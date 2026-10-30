import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyPrefsOp, prefsDomain } from '../src/prefs.js'
import { startPrefsSync, pushPrefs, reloadPrefs, PREFS_PATH, type Prefs } from '../src/client/prefs-sync'

/** 假的浏览器环境：localStorage + fetch 直连一份内存里的宿主偏好。 */
function environment(host: Prefs, { available = true } = {}) {
  const storage = new Map<string, string>()
  const posts: unknown[] = []
  const g = globalThis as any
  g.window = { localStorage: { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => { storage.set(k, v) } } }
  g.document = { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} }
  g.fetch = async (url: string, init?: { method?: string; body?: string }) => {
    assert.equal(url, PREFS_PATH)
    if (!available) return new Response('nope', { status: 404 })
    if (init?.method === 'POST') {
      const op = JSON.parse(init.body!)
      posts.push(op)
      host = applyPrefsOp(host as any, op)
    }
    return Response.json(host)
  }
  return { storage, posts, get host() { return host } }
}
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

test('first connection merges this device\u2019s old data, then adopts the host copy', async () => {
  const env = environment({ favorites: ['phone/a'], efforts: {}, providerOrder: ['p'] })
  let local: Prefs = { favorites: ['desk/b'], efforts: { 'desk/b': 'high' }, providerOrder: ['d'] }
  const replaced: Prefs[] = []
  const stop = startPrefsSync({ local: () => local, replace: p => { replaced.push(p); local = p } })
  await settle()
  assert.deepEqual((env.posts[0] as any).op, 'merge')
  assert.deepEqual(local, { favorites: ['phone/a', 'desk/b'], efforts: { 'desk/b': 'high' }, providerOrder: ['p', 'd'] })
  assert.equal(env.storage.get('dsh003.model-picker.prefs-merged'), '1')
  stop()
  // 再次启动不会重复合并
  startPrefsSync({ local: () => local, replace: p => { local = p } })()
  await settle()
  assert.equal(env.posts.filter(op => (op as any).op === 'merge').length, 1)
})

test('changes made before the host answers are queued and sent once it does', async () => {
  const env = environment(structuredClone(prefsDomain.global.initial) as Prefs)
  env.storage.set('dsh003.model-picker.prefs-merged', '1')
  let local: Prefs = { favorites: [], efforts: {}, providerOrder: [] }
  const stop = startPrefsSync({ local: () => local, replace: p => { local = p } })
  pushPrefs({ op: 'favorite', key: 'x/1', on: true })
  await settle()
  assert.deepEqual(env.host.favorites, ['x/1'])
  assert.deepEqual(local.favorites, ['x/1'])
  pushPrefs({ op: 'effort', key: 'x/1', effort: 'max' })
  await settle()
  assert.deepEqual(env.host.efforts, { 'x/1': 'max' })
  stop()
})

test('a host without the prefs route leaves local data untouched and sends nothing', async () => {
  const env = environment(structuredClone(prefsDomain.global.initial) as Prefs, { available: false })
  let local: Prefs = { favorites: ['keep/me'], efforts: {}, providerOrder: [] }
  const stop = startPrefsSync({ local: () => local, replace: p => { local = p } })
  pushPrefs({ op: 'favorite', key: 'keep/too', on: true })
  reloadPrefs()
  await settle()
  assert.equal(env.posts.length, 0)
  assert.deepEqual(local.favorites, ['keep/me'])
  stop()
})

test('a push channel closed by the server is reopened instead of staying dead', async () => {
  environment(structuredClone(prefsDomain.global.initial) as Prefs)
  const g = globalThis as any
  const opened: any[] = []
  class FakeSource {
    static CLOSED = 2
    readyState = 0
    listeners: Record<string, (() => void)[]> = {}
    constructor() { opened.push(this) }
    addEventListener(type: string, fn: () => void) { (this.listeners[type] ??= []).push(fn) }
    close() { this.readyState = 2 }
  }
  g.EventSource = FakeSource
  const realTimeout = globalThis.setTimeout
  g.setTimeout = (fn: () => void, ms: number) => realTimeout(fn, ms === 5000 ? 1 : ms)
  const stop = startPrefsSync({ local: () => structuredClone(prefsDomain.global.initial) as Prefs, replace() {} })
  assert.equal(opened.length, 1)
  opened[0].readyState = 2
  for (const fn of opened[0].listeners.error) fn()
  await settle()
  assert.equal(opened.length, 2)
  stop()
  g.setTimeout = realTimeout
  delete g.EventSource
})
