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
