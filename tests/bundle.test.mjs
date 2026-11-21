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
      return { Tooltip: () => null }
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

// 0.2.36 把 remote / remote.session 从 inject 里删掉，结果真实宿主里 modelDirectories.directoryFor
// 经本插件 ctx 代理读 remote.session 时抛「without inject」，条目被官方让位，按钮退回官方样式。
// 本插件不直接读它们，但必须声明；这里锁住，免得再被当成「未使用」删掉。
test('inject declares remote and remote.session (read through our ctx by modelDirectories)', () => {
  let descriptor
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { descriptor = value } } }, console,
  })
  const exports = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives' ? {} : require(name))
  for (const name of ['remote', 'remote.session', 'modelDirectories', 'sessions', 'slots']) {
    assert.ok(exports.inject.includes(name), `inject must include ${name}`)
  }
})

test('borrows RC2 conversation.input.model.options child slot non-enumerably and cleans up on dispose', () => {
  let descriptor
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { descriptor = value } } }, console,
  })
  const exports = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives' ? { Tooltip: () => null } : require(name))
  const list = []
  const listeners = new Set()
  let cleanupSlot
  const services = {
    slots: {
      inject: (key, register) => {
        const off = register()
        if (key === 'conversation.input.model') cleanupSlot = off
      },
      entries: key => key === 'conversation.input.model' ? list : [],
      subscribe: (key, fn) => {
        if (key === 'conversation.input.model') listeners.add(fn)
        return () => listeners.delete(fn)
      },
      register: (value, component) => {
        const record = { ...value, component }
        if (value.name === 'conversation.input.model') list.push(record)
        return () => {
          const idx = list.indexOf(record)
          if (idx >= 0) list.splice(idx, 1)
        }
      },
    },
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: () => ({}) },
  }
  exports.apply({ get: name => services[name] })
  assert.equal(list.length, 1)
  const mine = list[0]
  assert.equal(mine.children, undefined)

  // Official ModelSelect arrives later with RC2 conversation.input.model.options child slot
  const optionsSpec = { kind: 'list', scope: 'session' }
  list.push({ name: 'conversation.input.model', component: function OfficialModelSelect() {}, children: { 'conversation.input.model.options': optionsSpec } })
  listeners.forEach(fn => fn())

  assert.ok(mine.children, 'borrowed children map must be attached')
  assert.equal(mine.children['conversation.input.model.options'], optionsSpec)
  assert.deepEqual(Object.keys(mine.children), [], 'borrowed child slot keys must be non-enumerable')

  cleanupSlot()
  assert.equal(mine.children, undefined)
})

test('onOpenSettings opens official sidebar.settings store at models section', () => {
  let descriptor
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { descriptor = value } } }, console,
  })
  const exports = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives' ? { Tooltip: () => null } : require(name))
  const opened = []
  let entry
  const settingsStore = { create: () => ({ actions: { openSection: id => opened.push(id) } }) }
  const services = {
    slots: {
      inject: (_key, register) => { register() },
      entries: key => key === 'sidebar.settings' ? [{ component: () => null, store: settingsStore }] : [],
      subscribe: () => () => {},
      register: value => { if (value.name === 'conversation.input.model') entry = value; return () => {} },
    },
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: () => ({}) },
  }
  exports.apply({ get: name => services[name] })
  const injected = entry.inject('test-session')
  assert.equal(typeof injected.onOpenSettings, 'function')
  injected.onOpenSettings()
  assert.deepEqual(opened, ['models'])
})
