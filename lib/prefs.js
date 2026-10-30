/**
 * 模型选择器偏好的宿主端存储：收藏、每个模型记住的思考强度、供应商顺序。
 *
 * 以前这三项只存在各自浏览器的 localStorage 里，桌面版和手机浏览器各一份、互不相通。
 * 现在存在 DSH 宿主（`~/.dsh/storages/model_controls_prefs.json`），所有连到同一个 DSH 的
 * 页面共用一份，改动经 SSE 推给其他页面。
 *
 * GET  /kewen-model-controls/prefs         → 当前偏好
 * POST /kewen-model-controls/prefs         一条操作（见 opSchema）→ 操作后的偏好
 * GET  /kewen-model-controls/prefs/events  有变化就推一条 change（SSE），客户端收到后重新取
 *
 * 写入按「操作」而不是整份覆盖：电脑上收藏 A、手机上同时收藏 B，两条都保留。
 * 做法照 dsh-harness-plus 的「进行中」存储（storageDomain + webServer + connection.admit）。
 */
import { z } from 'zod'

export const PREFS_PATH = '/kewen-model-controls/prefs'

/** 键形如 `provider/model`；长度上限防止有人塞超大数据。 */
const keySchema = z.string().min(1).max(512)
const LIST_MAX = 2000

export const prefsSchema = z.object({
  favorites: z.array(keySchema).max(LIST_MAX),
  efforts: z.record(keySchema, z.string().min(1).max(128)),
  providerOrder: z.array(keySchema).max(LIST_MAX),
})

export const prefsDomain = {
  name: 'model_controls_prefs',
  version: 1,
  tables: {},
  global: { schema: prefsSchema, initial: { favorites: [], efforts: {}, providerOrder: [] } },
}

export const opSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('favorite'), key: keySchema, on: z.boolean() }),
  z.object({ op: z.literal('effort'), key: keySchema, effort: z.string().min(1).max(128) }),
  z.object({ op: z.literal('order'), order: z.array(keySchema).max(LIST_MAX) }),
  // 首次接入时把本机 localStorage 里的旧数据并进来：只增不删，已有的以宿主为准。
  z.object({ op: z.literal('merge'), favorites: z.array(keySchema).max(LIST_MAX), efforts: z.record(keySchema, z.string().min(1).max(128)), providerOrder: z.array(keySchema).max(LIST_MAX) }),
])

/**
 * @typedef {z.infer<typeof prefsSchema>} Prefs
 * @typedef {z.infer<typeof opSchema>} PrefsOp
 */

/** 去重并保持先后顺序。 @param {readonly string[]} list */
const unique = list => [...new Set(list)]

/**
 * 把一条操作作用到偏好上（纯函数，便于测试）。
 * @param {Prefs} prefs
 * @param {PrefsOp} op
 * @returns {Prefs}
 */
export function applyPrefsOp(prefs, op) {
  switch (op.op) {
    case 'favorite': {
      const rest = prefs.favorites.filter(key => key !== op.key)
      return { ...prefs, favorites: op.on ? [...rest, op.key] : rest }
    }
    case 'effort':
      return { ...prefs, efforts: { ...prefs.efforts, [op.key]: op.effort } }
    case 'order':
      return { ...prefs, providerOrder: unique(op.order) }
    case 'merge':
      return {
        favorites: unique([...prefs.favorites, ...op.favorites]).slice(0, LIST_MAX),
        efforts: { ...op.efforts, ...prefs.efforts },
        providerOrder: unique([...prefs.providerOrder, ...op.providerOrder]).slice(0, LIST_MAX),
      }
  }
}

/** 请求体上限：偏好很小，64KB 足够。 */
const BODY_LIMIT = 64 * 1024

class BodyError extends Error {
  /** @param {number} status */
  constructor(status) { super(`body ${status}`); this.status = status }
}

/** @param {import('node:http').IncomingMessage} req @returns {Promise<unknown>} */
function readJson(req) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > BODY_LIMIT) { reject(new BodyError(413)); req.pause(); return }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))) } catch { reject(new BodyError(400)) }
    })
    req.on('error', () => reject(new BodyError(400)))
  })
}

/**
 * 只收 application/json 的写请求：表单或 text/plain 能跨站直接发过来，application/json 会触发预检，
 * 本接口不回 CORS 头，预检过不去。
 * @param {import('node:http').IncomingMessage} req
 */
function isJsonRequest(req) {
  const type = req.headers['content-type']
  return typeof type === 'string' && type.split(';')[0].trim().toLowerCase() === 'application/json'
}

/** @param {import('node:http').ServerResponse} res @param {number} status @param {unknown} data */
function sendJson(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(data))
}

/**
 * 和官方 /api 同一套登录校验；拿不到 connection 服务时一律拒绝。
 * @param {any} scope @param {import('node:http').IncomingMessage} req
 */
function admitted(scope, req) {
  const connection = scope.get?.('connection')
  if (typeof connection?.admit !== 'function') return false
  return !('rejection' in connection.admit(req))
}

/**
 * 挂上存储与接口。服务都是可选注入：宿主缺了它们，插件其余部分照常工作，客户端退回 localStorage。
 * @param {any} ctx
 */
export function applyPrefs(ctx) {
  // 测试里的假 ctx 没有 inject；真实 cordis 总有。
  if (typeof ctx?.inject !== 'function') return
  ctx.inject(['storageDomain', 'webServer', 'connection'], (/** @type {any} */ scope) => {
    /** @type {any} */
    let store
    /** @type {Set<import('node:http').ServerResponse>} */
    const listeners = new Set()
    const notify = () => {
      for (const res of listeners) {
        try { res.write('event: change\ndata: {}\n\n') } catch { listeners.delete(res) }
      }
    }

    // 句柄生命周期跟着 ready 走：open 完成前 scope 就被释放时也要关掉，否则名字一直被占，
    // 下次 apply 报 already-open（harness-plus 踩过同一个坑）。
    let disposed = false
    /** @type {Promise<any>} */
    const ready = scope.storageDomain.open(prefsDomain).then(async (/** @type {any} */ opened) => {
      if (disposed) { await opened.close(); return undefined }
      store = opened
      return opened
    }, (/** @type {unknown} */ error) => {
      scope.logger?.warn?.(`model-controls: open prefs store failed: ${String(error)}`)
      return undefined
    })
    scope.effect(() => () => {
      disposed = true
      for (const res of listeners) res.end()
      listeners.clear()
      const closing = store
      return ready.then(opened => (opened ?? closing)?.close()).catch(() => {})
    }, 'model-controls: prefs store')

    // 读改写串行：global.get 是同步读内存，两条并发操作会读到同一份旧值、后写的吞掉先写的。
    /** @type {Promise<unknown>} */
    let chain = Promise.resolve()
    /** @param {PrefsOp} op @returns {Promise<Prefs>} */
    const run = op => {
      const next = chain.then(async () => {
        const opened = await ready
        if (opened === undefined) throw new Error('prefs store unavailable')
        const value = applyPrefsOp(opened.global.get(), op)
        await opened.global.set(value)
        return value
      })
      chain = next.then(() => {}, () => {})
      return next
    }

    scope.on('domain/changed', (/** @type {{ domain: string }} */ change) => {
      if (change.domain === prefsDomain.name) notify()
    })

    scope.effect(() => scope.webServer.register({
      kind: 'prefix',
      path: PREFS_PATH,
      handler: async (/** @type {import('node:http').IncomingMessage} */ req, /** @type {import('node:http').ServerResponse} */ res) => {
        if (!admitted(scope, req)) {
          res.writeHead(401)
          res.end('unauthorized')
          return
        }
        const path = new URL(req.url ?? '/', 'http://x').pathname.slice(PREFS_PATH.length)
        try {
          if (path === '/events' && req.method === 'GET') {
            res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache, no-transform', 'connection': 'keep-alive' })
            res.write(': connected\n\n')
            listeners.add(res)
            req.on('close', () => listeners.delete(res))
            return
          }
          if (path !== '' && path !== '/') { sendJson(res, 404, { error: 'not found' }); return }
          const opened = await ready
          if (opened === undefined) { sendJson(res, 503, { error: 'prefs store unavailable' }); return }
          if (req.method === 'GET') { sendJson(res, 200, opened.global.get()); return }
          if (req.method !== 'POST') { sendJson(res, 405, { error: 'method not allowed' }); return }
          if (!isJsonRequest(req)) { sendJson(res, 415, { error: 'unsupported media type' }); return }
          /** @type {unknown} */
          let body
          try {
            body = await readJson(req)
          } catch (error) {
            if (!(error instanceof BodyError)) throw error
            res.writeHead(error.status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'connection': 'close' })
            res.end(JSON.stringify({ error: error.status === 413 ? 'payload too large' : 'bad request' }), () => { if (error.status === 413) req.destroy() })
            return
          }
          const parsed = opSchema.safeParse(body)
          if (!parsed.success) { sendJson(res, 400, { error: 'bad request' }); return }
          sendJson(res, 200, await run(parsed.data))
        } catch (error) {
          scope.logger?.warn?.(`model-controls: prefs request failed: ${String(error)}`)
          sendJson(res, 500, { error: 'internal error' })
        }
      },
    }), 'model-controls: prefs route')
  })
}
