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
  assert.equal(descriptor.id, '@dsh-std/model-picker')
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
  const services = {
    slots: {
      inject: (key, register) => { assert.equal(key, 'conversation.input.model'); register() },
      register: (value, component) => { entry = value; assert.equal(typeof component, 'function'); return () => {} },
    },
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: sessionId => { assert.equal(sessionId, 'test-session'); return directory } },
  }
  exports.apply({ get: name => services[name] })
  assert.ok(entry, 'slot registration must succeed')
  assert.deepEqual(JSON.parse(JSON.stringify(entry.inject('test-session'))), { directory: {}, available: true })
})
