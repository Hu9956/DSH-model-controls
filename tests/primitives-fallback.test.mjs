// 宿主 @deepseek-ai/dsh-client-ui-primitives 缺失、改名或缺导出时，插件仍能加载、apply，按钮与面板照常工作；
// 只有借用官方的 Tooltip 与设置表单退化。加载的是打包产物 lib/client.js，模块表由这里伪造。
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { settingsZh } from '../src/client/locales.ts'

const PRIMITIVES = '@deepseek-ai/dsh-client-ui-primitives'
const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://picker.test' })
const win = dom.window
for (const name of ['window', 'document', 'navigator', 'Element', 'HTMLElement', 'Node']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? win : win[name] })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
win.HTMLElement.prototype.scrollIntoView = function () {}
win.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
win.HTMLElement.prototype.getBoundingClientRect = function () {
  return { left: 700, right: 900, width: 200, top: 500, bottom: 528, height: 28 }
}
const require = createRequire(import.meta.url)
const React = require('react')
const { createRoot } = require('react-dom/client')
const { act } = React

/**
 * 按真实宿主的 require 语义加载插件：模块表里没有的包直接抛错（同 client-modules 的 makeRequire）。
 * @param primitives - 伪造的 primitives 导出表；undefined 表示模块表里根本没有这个包。
 * @returns 插件导出与本次加载期间的 console.warn 记录。
 */
function load(primitives) {
  const warnings = []
  const console_ = { ...console, warn: (...args) => { warnings.push(args) } }
  let descriptor
  runInNewContext(source, {
    document: win.document, Element: win.Element, Node: win.Node, URL: win.URL, console: console_,
    ResizeObserver: win.ResizeObserver,
    window: Object.assign(win, { __ModuleLoader__: { load: value => { descriptor = value } } }),
  })
  const requested = []
  const plugin = descriptor.factory(name => {
    requested.push(name)
    if (name === PRIMITIVES) {
      if (primitives === undefined) throw new Error(`client-modules: require("${name}") missed the module table`)
      return primitives
    }
    assert.ok(['react', 'react-dom', 'react/jsx-runtime'].includes(name), `unexpected host dependency: ${name}`)
    return require(name)
  })
  return { plugin, warnings, requested }
}

function fixture() {
  const state = {
    current: { provider: 'p', model: 'a', reasoningEffort: 'low' }, pending: null, status: 'ready', failures: [], error: null,
    groups: [{ id: 'p', name: 'Provider', models: ['a', 'b'].map(id => ({ id, name: `Model ${id}`, reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } })) }],
  }
  return {
    store: { getSnapshot: () => state, subscribe: () => () => {} },
    load: async () => state,
    select: async () => ({ ok: true }),
  }
}
const form = () => {
  const state = { status: 'ready', writable: true, revision: 1, base: {}, user: {}, value: { magpieBaseURL: '' } }
  return { getSnapshot: () => state, subscribe: () => () => {}, mutate: async () => true }
}

let root
beforeEach(() => {
  win.document.body.innerHTML = '<div id="app"></div>'
  root = createRoot(win.document.querySelector('#app'))
})
afterEach(async () => { await act(async () => { root.unmount() }) })
const action = async fn => { await act(async () => { fn() }) }
const query = selector => win.document.querySelector(selector)

test('the bundle has no unguarded top-level require of the primitives package', () => {
  // 只允许出现在 host-primitives 的常量里；字面量 require("…primitives") 会在模块表缺包时直接抛错。
  assert.equal(source.includes(`require("${PRIMITIVES}")`), false)
  assert.equal(source.includes(`require('${PRIMITIVES}')`), false)
  const literals = source.split('\n').filter(line => line.includes(`"${PRIMITIVES}"`))
  assert.deepEqual(literals.map(line => line.trim()), [`const PRIMITIVES_ID = "${PRIMITIVES}";`])
  assert.doesNotMatch(source, /dsh-client-ui-dockkit/)
})

test('without the primitives package the plugin applies, renders its button and opens its own menu surface', async () => {
  const { plugin, warnings, requested } = load(undefined)
  assert.ok(requested.includes(PRIMITIVES), 'the shim must still try the official package first')
  assert.equal(warnings.length, 1, 'a missing package warns exactly once')
  assert.match(String(warnings[0][0]), /missing Tooltip, SettingsForm, SettingsValueField, SettingsFormModel/)

  let entry, settingsEntry
  const services = {
    slots: {
      inject: (key, register) => { register() },
      register: (value, component) => { if (value.name === 'plugins.bundle.config') settingsEntry = { value, component }; else entry = { value, component }; return () => {} },
    },
    sessions: { subagentAddress: () => undefined },
    modelDirectories: { directoryFor: () => fixture() },
    configForms: { get: () => form() },
  }
  plugin.apply({ get: name => services[name] })
  assert.ok(entry && settingsEntry, 'both slot entries register')

  await action(() => root.render(React.createElement(entry.component, { locked: false, ...entry.value.inject('s') })))
  const button = query('.dsh003-picker-btn')
  assert.ok(button, 'the model picker button renders')
  // 自带的下拉箭头：官方原件同一条 path。
  assert.equal(query('.dsh003-picker-chev path').getAttribute('d'), 'M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6')
  await action(() => button.click())
  const panel = query('.dsh003-picker-panel')
  assert.ok(panel, 'the panel opens')
  // 自带的 MenuSurface：官方同款标记（材质层 + body 下的 backing），类名为插件前缀。
  assert.equal(panel.dataset.menuMaterial, 'translucent')
  assert.ok(panel.classList.contains('dsh003-menu-surface'))
  assert.ok(panel.firstElementChild.classList.contains('dsh003-menu-surface-material'))
  const backing = query('body > [data-menu-backing]')
  assert.ok(backing?.classList.contains('dsh003-menu-surface-backing'))
  assert.equal(backing.style.getPropertyValue('--dsh-menu-anchor'), panel.style.getPropertyValue('--dsh-menu-anchor'))
  // Tooltip 退化为只渲染锚点。
  assert.ok(query('.dsh003-picker-model-name'))

  await action(() => root.render(React.createElement(settingsEntry.component, { view: 'page', ...settingsEntry.value.inject() })))
  assert.equal(query('#app').textContent, settingsZh.formUnavailable)
  assert.equal(warnings.length, 1, 'rendering the degraded pieces adds no further warnings')
})

test('missing or malformed single exports degrade without throwing', async () => {
  const fullKit = {
    SettingsForm: ({ children }) => React.createElement('form', null, children),
    SettingsValueField: ({ id }) => React.createElement('input', { id }),
  }
  const cases = [
    ['an empty module object', {}],
    ['only Tooltip', { Tooltip: ({ children }) => children }],
    ['SettingsFormModel missing', { ...fullKit }],
    ['SettingsFormModel not constructible', { ...fullKit, SettingsFormModel: () => ({}) }],
    ['SettingsFormModel throws', { ...fullKit, SettingsFormModel: class { constructor() { throw new Error('changed') } } }],
    ['SettingsFormModel lacks methods', { ...fullKit, SettingsFormModel: class { bind() {} } }],
    ['exports behind a throwing getter', Object.defineProperty({ ...fullKit }, 'SettingsFormModel', { get() { throw new Error('gone') } })],
    ['a non-object module', 42],
  ]
  for (const [label, table] of cases) {
    const { plugin, warnings } = load(table)
    await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
    assert.ok(query('.dsh003-picker-btn'), `${label}: the button renders`)
    await action(() => query('.dsh003-picker-btn').click())
    assert.ok(query('.dsh003-picker-panel'), `${label}: the panel opens`)
    await action(() => root.render(React.createElement(plugin.ModelControlsSettings, { view: 'page', form: form(), t: key => settingsZh[key] })))
    assert.equal(query('#app').textContent, settingsZh.formUnavailable, `${label}: the settings page explains itself`)
    assert.equal(warnings.length, 1, `${label}: warns exactly once`)
  }
})
