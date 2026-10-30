/**
 * 偏好同步：把收藏、思考强度记忆、供应商顺序和 DSH 宿主上的那一份对齐。
 *
 * - 本地 store（picker-data / provider-order）照旧先改内存和 localStorage，界面立即响应；
 *   这里把同一个改动发给宿主（`POST /kewen-model-controls/prefs`）。
 * - 宿主的值是准的：页面加载、SSE 推来 change、断线重连、页面回到前台时都重新取一次，
 *   用宿主的值覆盖本地（同时写回 localStorage，宿主暂时连不上时下次打开也是最新的）。
 * - 首次接入（本机还没合并过）时把本机 localStorage 的旧数据 merge 上去，只增不删，
 *   桌面和手机各自原有的收藏都会保留。
 * - 宿主接口不可用（旧版插件宿主端、未登录）时什么都不做，退回纯 localStorage。
 *
 * 序号规则（照 harness-plus 的 work.ts）：每次取数和每次写入都拿新序号，只认最新一次的结果，
 * 先发的请求后到不会把界面退回旧状态。
 */

export const PREFS_PATH = '/kewen-model-controls/prefs'
const MERGED_FLAG = 'dsh003.model-picker.prefs-merged'

export interface Prefs {
  favorites: readonly string[]
  efforts: Readonly<Record<string, string>>
  providerOrder: readonly string[]
}

export type PrefsOp =
  | { op: 'favorite'; key: string; on: boolean }
  | { op: 'effort'; key: string; effort: string }
  | { op: 'order'; order: readonly string[] }
  | ({ op: 'merge' } & Prefs)

/** 各本地 store 提供的读写口。 */
export interface PrefsBinding {
  /** 本机当前的值（用于首次合并）。 */
  local(): Prefs
  /** 用宿主的值覆盖本地。 */
  replace(prefs: Prefs): void
}

function asPrefs(value: unknown): Prefs | undefined {
  if (value === null || typeof value !== 'object') return undefined
  const { favorites, efforts, providerOrder } = value as Record<string, unknown>
  if (!Array.isArray(favorites) || !Array.isArray(providerOrder)) return undefined
  if (efforts === null || typeof efforts !== 'object' || Array.isArray(efforts)) return undefined
  const strings = (list: unknown[]): string[] => list.filter((v): v is string => typeof v === 'string')
  const effortMap: Record<string, string> = {}
  for (const [k, v] of Object.entries(efforts)) if (typeof v === 'string') effortMap[k] = v
  return { favorites: strings(favorites), efforts: effortMap, providerOrder: strings(providerOrder) }
}

let binding: PrefsBinding | undefined
let seq = 0
/** 宿主接口是否可用：首次 GET 成功后才开始发写入，避免对旧宿主狂发 404。 */
let online = false
let started = false
/** 首次 GET 之前产生的写入先排着，确认可用后补发。 */
const queued: PrefsOp[] = []

function readMergedFlag(): boolean {
  try { return window.localStorage.getItem(MERGED_FLAG) === '1' } catch { return true }
}
function writeMergedFlag(): void {
  try { window.localStorage.setItem(MERGED_FLAG, '1') } catch { /* 存不下就下次再合并一次，merge 幂等 */ }
}

async function post(op: PrefsOp): Promise<Prefs | undefined> {
  const res = await fetch(PREFS_PATH, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(op),
  })
  return res.ok ? asPrefs(await res.json()) : undefined
}

function accept(n: number, prefs: Prefs | undefined): void {
  if (prefs !== undefined && n === seq) binding?.replace(prefs)
}

/** 从宿主重新取一次，以宿主为准。 */
export function reloadPrefs(): void {
  if (binding === undefined) return
  const n = ++seq
  fetch(PREFS_PATH, { credentials: 'same-origin' })
    .then(async res => {
      if (!res.ok) return undefined
      const prefs = asPrefs(await res.json())
      if (prefs === undefined) return undefined
      if (!online) {
        online = true
        // 首次接入：先把本机旧数据并上去，再补发排队的写入；结果都按序号落地。
        if (!readMergedFlag()) {
          const local = binding!.local()
          const merged = await post({ op: 'merge', ...local })
          if (merged !== undefined) writeMergedFlag()
          if (merged !== undefined && queued.length === 0) return merged
        }
        if (queued.length > 0) {
          let last: Prefs | undefined = prefs
          for (const op of queued.splice(0)) last = (await post(op)) ?? last
          return last
        }
      }
      return prefs
    })
    .then(prefs => accept(n, prefs))
    .catch(error => { console.warn('[model-picker] load prefs failed', error) })
}

/** 本地改动后调用：发给宿主。宿主还没确认可用时先排队。 */
export function pushPrefs(op: PrefsOp): void {
  if (binding === undefined) return
  if (!online) {
    queued.push(op)
    return
  }
  const n = ++seq
  post(op)
    .then(prefs => {
      if (prefs === undefined) throw new Error('save prefs failed')
      accept(n, prefs)
    })
    .catch(error => {
      console.warn('[model-picker] save prefs failed', error)
      // 没存上：按宿主现有的值恢复
      reloadPrefs()
    })
}

/**
 * 启动同步（插件 apply 时调用一次）。
 * @returns 停止同步的函数。
 */
export function startPrefsSync(next: PrefsBinding): () => void {
  binding = next
  if (started || typeof window === 'undefined' || typeof fetch !== 'function') return () => { binding = undefined }
  started = true
  reloadPrefs()
  let events: EventSource | undefined
  let retry: ReturnType<typeof setTimeout> | undefined
  let stopped = false
  // 网络断开时 EventSource 会自己重连；但服务端回了非 200（DSH 重启中、插件重载时的 401/503）
  // 它会永久关闭，之后再也收不到推送。这种情况隔几秒自己重开一个。
  const connect = (): void => {
    if (stopped || typeof EventSource !== 'function') return
    try {
      const source = new EventSource(`${PREFS_PATH}/events`)
      events = source
      source.addEventListener('change', reloadPrefs)
      // 连上（含断线重连）时可能错过了变化，重新取一次
      source.addEventListener('open', reloadPrefs)
      source.addEventListener('error', () => {
        if (source.readyState !== EventSource.CLOSED || stopped) return
        retry = setTimeout(connect, 5000)
      })
    } catch { /* SSE 不可用时靠回到前台时重新取 */ }
  }
  connect()
  const onVisible = (): void => { if (document.visibilityState === 'visible') reloadPrefs() }
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    stopped = true
    if (retry !== undefined) clearTimeout(retry)
    events?.close()
    document.removeEventListener('visibilitychange', onVisible)
    binding = undefined
    started = false
    online = false
    queued.length = 0
  }
}
