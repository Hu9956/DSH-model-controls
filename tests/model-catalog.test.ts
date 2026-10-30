import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCatalogAdapter, selectCatalogModel, type DirectoryState, type ModelDirectoryFace, type ModelSelection } from '../src/client/model-catalog'
import { getModelEffort, setModelEffort } from '../src/client/picker-data'
import { pickerCss } from '../src/client/picker.css'

function fixture(provider: string) {
  let state: DirectoryState = {
    current: { provider, model: 'a', reasoningEffort: 'low' }, pending: null, status: 'ready', failures: [], error: null,
    groups: [{ id: provider, name: provider, models: ['a', 'b'].map(id => ({ id, name: id, reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } })) }],
  }
  const listeners = new Set<() => void>()
  const calls: ModelSelection[] = []
  const publish = (next: Partial<DirectoryState>) => { state = { ...state, ...next }; for (const fn of listeners) fn() }
  const directory: ModelDirectoryFace = {
    store: { getSnapshot: () => state, subscribe: fn => { listeners.add(fn); return () => { listeners.delete(fn) } } },
    load: async () => state,
    select: async selection => { calls.push(selection); publish({ current: selection, pending: null }); return { ok: true } },
  }
  return { directory, calls, publish }
}

test('each model restores its own accepted effort after A → B → A', async () => {
  const { directory, calls } = fixture('memory')
  assert.equal(await selectCatalogModel(directory, 'memory', 'a', 'high'), true)
  await selectCatalogModel(directory, 'memory', 'b')
  assert.equal(calls[1].reasoningEffort, 'low')
  await selectCatalogModel(directory, 'memory', 'a')
  assert.equal(calls[2].reasoningEffort, 'high')
})
test('unsupported remembered effort falls back to model default', async () => {
  const { directory, calls } = fixture('unsupported')
  setModelEffort('unsupported', 'b', 'max')
  await selectCatalogModel(directory, 'unsupported', 'b')
  assert.equal(calls[0].reasoningEffort, 'low')
})
test('failed choice does not pollute remembered effort', async () => {
  const { directory } = fixture('failure')
  setModelEffort('failure', 'a', 'low')
  directory.select = async () => ({ ok: false })
  assert.equal(await selectCatalogModel(directory, 'failure', 'a', 'high'), false)
  assert.equal(getModelEffort('failure', 'a'), 'low')
})
test('rapid choices wait for the preceding receipt, including after rejection', async () => {
  const { directory, calls } = fixture('queue')
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  directory.select = async selection => { calls.push(selection); if (calls.length === 1) { await gate; throw new Error('rejected') }; return { ok: true } }
  const first = selectCatalogModel(directory, 'queue', 'a', 'high')
  const second = selectCatalogModel(directory, 'queue', 'b')
  await Promise.resolve()
  assert.equal(calls.length, 1)
  release()
  assert.equal(await first, false)
  assert.equal(await second, true)
  assert.equal(calls.length, 2)
})
test('pending effort remains visible during catalog refresh; confirmed session wins', () => {
  const { directory, publish } = fixture('projection')
  const adapter = createCatalogAdapter(directory)
  const original = adapter.getSnapshot()
  assert.equal(adapter.getSnapshot(), original)
  publish({ pending: { provider: 'projection', model: 'a', reasoningEffort: 'high' }, status: 'selecting' })
  assert.equal(adapter.getSnapshot().default?.reasoningEffort, 'high')
  publish({ status: 'loading' })
  assert.equal(adapter.getSnapshot().status, 'ready')
  assert.equal(adapter.getSnapshot().default?.reasoningEffort, 'high')
  publish({ pending: null, current: { provider: 'projection', model: 'a', reasoningEffort: 'high' }, status: 'ready' })
  assert.equal(adapter.getSnapshot().default?.reasoningEffort, 'high')
})
test('session directories remain isolated and external selections are observed', () => {
  const a = fixture('session-a'), b = fixture('session-b')
  const adapterA = createCatalogAdapter(a.directory), adapterB = createCatalogAdapter(b.directory)
  a.publish({ current: { provider: 'session-a', model: 'b', reasoningEffort: 'high' } })
  assert.equal(adapterA.getSnapshot().default?.model, 'b')
  assert.equal(adapterB.getSnapshot().default?.model, 'a')
})
test('all private theme variables have standalone fallbacks', () => {
  for (const match of pickerCss.matchAll(/var\(--dshT3-[^)]*\)/g)) assert.match(match[0], /,/, match[0])
})
test('fallback initial retains micro-badge styles', () => {
  assert.match(pickerCss, /\.dsh003-provider-initial--sm\s*\{[^}]*width:\s*16px/)
  assert.match(pickerCss, /\.dsh003-provider-initial--sm\s*\{[^}]*font-size:\s*11px/)
})

// 官方 ModelDirectory.select 的真实时序：RPC 返回时先清 pending，新 current 约 30ms 后随会话投影到达。
// 中间这一帧若回落到旧 current，按钮会「新 → 旧 → 新」闪一下（手机上表现为左右跳动）。
test('accepted switch keeps showing the new model until the projection lands', () => {
  const { directory, publish } = fixture('hold')
  const adapter = createCatalogAdapter(directory)
  assert.equal(adapter.getSnapshot().default?.model, 'a')
  publish({ pending: { provider: 'hold', model: 'b' }, status: 'selecting' })
  assert.equal(adapter.getSnapshot().default?.model, 'b')
  publish({ pending: null, status: 'ready' }) // current 仍是 a：投影还没到
  assert.equal(adapter.getSnapshot().default?.model, 'b')
  publish({ status: 'ready', groups: [...directory.store.getSnapshot().groups] }) // 期间的其他刷新也不回落
  assert.equal(adapter.getSnapshot().default?.model, 'b')
  publish({ current: { provider: 'hold', model: 'b' } })
  assert.equal(adapter.getSnapshot().default?.model, 'b')
  // 投影到达后放手：之后别处把会话改回 a，要如实显示。
  publish({ current: { provider: 'hold', model: 'a', reasoningEffort: 'low' } })
  assert.equal(adapter.getSnapshot().default?.model, 'a')
})
test('failed switch falls back to the confirmed model immediately', () => {
  const { directory, publish } = fixture('hold-fail')
  const adapter = createCatalogAdapter(directory)
  publish({ pending: { provider: 'hold-fail', model: 'b' }, status: 'selecting' })
  publish({ pending: null, status: 'error', error: 'E: rejected' })
  assert.equal(adapter.getSnapshot().default?.model, 'a')
})
test('held selection expires when the projection never arrives', async () => {
  const { directory, publish } = fixture('hold-timeout')
  const adapter = createCatalogAdapter(directory)
  let notified = 0
  // 与 useSyncExternalStore 一致：每次通知都读一次快照。
  const off = adapter.subscribe(() => { notified += 1; adapter.getSnapshot() })
  publish({ pending: { provider: 'hold-timeout', model: 'b' }, status: 'selecting' })
  publish({ pending: null, status: 'ready' })
  assert.equal(adapter.getSnapshot().default?.model, 'b')
  await new Promise(resolve => setTimeout(resolve, 2100))
  assert.ok(notified >= 3)
  assert.equal(adapter.getSnapshot().default?.model, 'a')
  off()
})
