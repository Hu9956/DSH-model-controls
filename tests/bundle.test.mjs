import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'

const require = createRequire(import.meta.url)
test('built client executes with host modules and registers its session slot without a DOM', () => {
  let descriptor
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { descriptor = value } } }, console,
  })
  assert.equal(descriptor.id, '@kewen/dsh-model-controls')
  const exports = descriptor.factory(name => {
    if (name === '@deepseek-ai/dsh-client-ui-primitives') {
      return { MenuSurface: () => null, IconChevronDownOutlineRegular: () => null }
    }
    assert.ok(['react', 'react-dom', 'react/jsx-runtime'].includes(name), `unexpected host dependency: ${name}`)
    return require(name)
  })
  assert.equal(typeof exports.apply, 'function')
  const directory = {}
  let entry
  let settingsEntry
  const services = {
    slots: {
      inject: (key, register) => { assert.ok(['conversation.input.model', 'plugins.bundle.config'].includes(key)); register() },
      register: (value, component) => { if (value.name === 'plugins.bundle.config') settingsEntry = value; else entry = value; assert.equal(typeof component, 'function'); return () => {} },
    },
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: sessionId => { assert.equal(sessionId, 'test-session'); return directory } },
    configForms: { get: id => { assert.equal(id, 'dsh-std-model-picker'); return {} } },
  }
  exports.apply({ get: name => services[name] })
  assert.ok(entry, 'slot registration must succeed')
  assert.equal(settingsEntry.key, '@kewen/dsh-model-controls')
  assert.ok(settingsEntry.inject().form)
  assert.deepEqual(JSON.parse(JSON.stringify(entry.inject('test-session'))), { directory: {}, available: true })
})
