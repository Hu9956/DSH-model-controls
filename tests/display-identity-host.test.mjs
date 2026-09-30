import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply, Config } from '../lib/index.js'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import z from '@deepseek-ai/schemastery'

const magpieURL = 'http://127.0.0.1:3425/v1'
const directURL = 'https://api.deepseek.com/anthropic'
const settings = { displayProviders: { 'deepseek-official': { name: 'Magpie', icon: 'magpie', whenBaseURL: magpieURL } } }
const identity = { 'deepseek-official': { name: 'Magpie', icon: 'magpie' } }
function provider(baseURL) {
  return { options: { name: '@deepseek-ai/dsh-llm-deepseek-api-key' }, disabled: false, fiber: { state: 2, config: { baseURL: { get: () => baseURL } } } }
}
function setup(entries = [provider(magpieURL)], config = settings, environment = undefined) {
  let inject
  apply({
    on: (event, handler) => { assert.equal(event, 'webserver/index-inject'); inject = handler },
    get: name => name === 'loader' ? { entries: () => entries } : name === 'launchEnvironment' ? environment : undefined,
  }, config)
  return () => { const rows = []; inject?.(rows); return rows[0]?.value ?? {} }
}

test('matching configured endpoint emits only the display identity, without address or credentials', () => {
  assert.deepEqual(setup()(), identity)
  let called = false
  apply({ on: () => { called = true } }, {})
  assert.equal(called, false)
})

test('official settings schema exposes one live address field, empty by default', () => {
  const config = Config({})
  assert.equal(config.magpieBaseURL.get(), '')
  assert.deepEqual(setup([provider(magpieURL)], config)(), {})
  const field = Config.dict.magpieBaseURL
  assert.equal(field.meta.volatile, true)
  assert.equal(field.meta.description, '备用 Magpie 接口地址')
  assert.equal(field.meta.default, '')
  assert.equal(Config.dict.displayProviders.meta.volatile, undefined)
  for (const value of ['not-a-url', 'file:///tmp/example', 'http://user:secret@localhost/v1', `${magpieURL}?token=secret`, `${magpieURL}#fragment`]) {
    assert.throws(() => Config({ magpieBaseURL: value }))
  }
})

test('Magpie standard wiring is recognized without an address setting and removal restores DeepSeek', () => {
  const entry = provider(magpieURL)
  entry.fiber.config.apiKeyEnv = { get: () => 'MAGPIE_API_KEY' }
  const read = setup([entry], Config({}))
  assert.deepEqual(read(), identity)
  entry.fiber.config.baseURL = { get: () => directURL }
  assert.deepEqual(read(), {})
  entry.fiber.config.baseURL = { get: () => 'http://127.0.0.1:9876/v1' }
  assert.deepEqual(read(), identity)
  entry.fiber.config.apiKeyEnv = { get: () => 'DEEPSEEK_API_KEY' }
  assert.deepEqual(read(), {})
})

test('automatic recognition requires both Magpie credential reference and loopback gateway path', () => {
  for (const url of ['https://api.deepseek.com/v1', 'http://localhost:3425/other', undefined]) {
    const entry = provider(url)
    entry.fiber.config.apiKeyEnv = 'MAGPIE_API_KEY'
    assert.deepEqual(setup([entry], Config({}))(), {})
  }
  for (const url of ['http://localhost:3425/v1/', 'http://[::1]:3425/v1']) {
    const entry = provider(url)
    entry.fiber.config.apiKeyEnv = 'MAGPIE_API_KEY'
    assert.deepEqual(setup([entry], Config({}))(), identity)
  }
})

test('new address setting takes precedence and clearing it disables even a retained legacy alias', () => {
  const config = Config({ ...settings, magpieBaseURL: magpieURL })
  assert.deepEqual(setup([provider(magpieURL)], config)(), identity)
  assert.deepEqual(setup([provider(directURL)], config)(), {})
  assert.deepEqual(setup([provider(magpieURL)], Config(settings))(), {})
  assert.deepEqual(setup([provider(magpieURL)], { ...settings, magpieBaseURL: '' })(), {})
})

test('official Loader applies address setting changes without remounting the plugin', async () => {
  const ctx = new Context()
  try {
    await ctx.plugin(Loader)
    let liveConfig
    ctx.loader.builtins['controls-settings'] = {
      Config,
      apply(_ctx, config) { liveConfig = config },
    }
    const id = await ctx.loader.create({ id: 'controls', name: 'cordis:controls-settings', config: {} })
    await ctx.loader.await()
    const entry = ctx.loader.resolve(id)
    const fiber = entry.fiber
    const read = setup([provider(magpieURL)], liveConfig)
    assert.deepEqual(read(), {})
    await entry.update({ config: { magpieBaseURL: magpieURL } })
    await ctx.loader.await()
    assert.equal(entry.fiber, fiber)
    assert.deepEqual(read(), identity)
    await entry.update({ config: { magpieBaseURL: '' } })
    await ctx.loader.await()
    assert.equal(entry.fiber, fiber)
    assert.deepEqual(read(), {})
  } finally { await ctx.fiber.dispose() }
})

test('the same host recomputes Magpie -> DeepSeek -> Magpie on each page injection', () => {
  const entry = provider(magpieURL)
  const read = setup([entry])
  assert.deepEqual(read(), identity)
  entry.fiber.config.baseURL = { get: () => undefined }
  assert.deepEqual(read(), {})
  entry.fiber.config.baseURL = { get: () => magpieURL }
  assert.deepEqual(read(), identity)
  entry.fiber.config.baseURL = { get: () => directURL }
  assert.deepEqual(read(), {})
})

test('legacy unconditional mappings no longer mislabel the official provider', () => {
  assert.deepEqual(setup([provider(magpieURL)], { displayProviders: { 'deepseek-official': { name: 'Magpie', icon: 'magpie' } } })(), {})
})

test('port, path, credentials, query and fragments cannot accidentally match another endpoint', () => {
  for (const url of ['http://127.0.0.1:3426/v1', 'http://127.0.0.1:3425/anthropic', 'http://127.0.0.1:3425/v1/other',
    'http://user:secret@127.0.0.1:3425/v1', `${magpieURL}?token=secret`, `${magpieURL}#fragment`, 'not-a-url']) {
    assert.deepEqual(setup([provider(url)])(), {}, url)
  }
  assert.deepEqual(setup([provider(`${magpieURL}/`)])(), identity)
})

test('missing, disabled, failed, ambiguous and unreadable providers retain original identity', () => {
  assert.deepEqual(setup([])(), {})
  for (const entry of [
    { ...provider(), disabled: true },
    { ...provider(), fiber: { state: 3, config: { baseURL: magpieURL } } },
    { ...provider(), fiber: { state: 2 } },
    { ...provider(), fiber: { state: 2, config: { baseURL: { get() { throw new Error('unavailable') } } } } },
  ]) assert.deepEqual(setup([entry])(), {})
  assert.deepEqual(setup([provider(magpieURL), provider(magpieURL)])(), {})
  assert.deepEqual(setup([{ ...provider(), options: { name: '@deepseek-ai/dsh-llm-deepseek-account' } }])(), {})
})

test('accepted live config wins over the raw patch candidate; trusted environment fallback follows provider precedence', () => {
  const entry = provider(directURL)
  entry.options.config = { baseURL: magpieURL }
  assert.deepEqual(setup([entry])(), {})
  const env = { get: name => { assert.equal(name, 'DEEPSEEK_BASE_URL'); return { value: magpieURL } } }
  assert.deepEqual(setup([provider(undefined)], settings, env)(), identity)
  assert.deepEqual(setup([provider(directURL)], settings, env)(), {})
})

test('real Cordis loader volatile updates and entry removal change the next page identity', async () => {
  const ctx = new Context()
  try {
    await ctx.plugin(Loader)
    ctx.loader.builtins['deepseek-test'] = {
      Config: z.object({ baseURL: z.string().volatile() }),
      apply() {},
    }
    const id = await ctx.loader.create({ id: 'llm-deepseek', name: 'cordis:deepseek-test', config: { baseURL: magpieURL } })
    const entry = ctx.loader.resolve(id)
    await ctx.loader.await()
    // The real Loader owns the fiber, validation and volatile cells. Only module identity is aliased for this fixture.
    const fixtureContext = {
      get: name => name === 'loader' ? { entries: () => [...ctx.loader.entries()].map(row => ({ options: { name: '@deepseek-ai/dsh-llm-deepseek-api-key' }, disabled: row.disabled, fiber: row.fiber })) } : undefined,
      on: (event, handler) => ctx.on(event, handler),
    }
    apply(fixtureContext, settings)
    const read = () => { const rows = []; ctx.emit('webserver/index-inject', rows); return rows[0].value }
    assert.equal(entry.fiber.state, 2)
    assert.deepEqual(read(), identity)
    await entry.update({ config: { baseURL: directURL } })
    await ctx.loader.await()
    assert.deepEqual(read(), {})
    await entry.update({ config: { baseURL: magpieURL } })
    await ctx.loader.await()
    assert.deepEqual(read(), identity)
    await entry.update({ disabled: true })
    assert.deepEqual(read(), {})
    ctx.loader.remove(id)
    assert.deepEqual(read(), {})
  } finally { await ctx.fiber.dispose() }
})
