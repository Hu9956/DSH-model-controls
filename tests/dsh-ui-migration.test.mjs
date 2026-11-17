import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { pickerCss } from '../src/client/picker.css.ts'
import { settingsZh } from '../src/client/locales.ts'

const bundleSource = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

const dom = new JSDOM('<!doctype html><head></head><body></body>', { url: 'https://picker.test' })
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

class SettingsFormModel {
  constructor(scope, specs) {
    this.scope = scope
    this.specs = new Map(specs.map(spec => [spec.field, spec]))
    this.drafts = new Map()
    this.listeners = new Set()
  }
  shell() {
    return {
      available: true, writable: true, dirty: this.drafts.size > 0,
      invalid: [...this.specs.keys()].some(field => this.field(field).invalid),
      saving: false, failed: false,
    }
  }
  field(name) {
    const spec = this.specs.get(name)
    const stored = spec.format(this.scope.getSnapshot().value?.[name])
    const staged = this.drafts.get(name)
    const text = staged === undefined ? stored : staged
    const write = staged === undefined ? { kind: 'set' } : spec.parse(staged)
    return { text, invalid: write === undefined, overridden: staged !== undefined && write?.kind === 'set' }
  }
  bind(project) {
    let state = project()
    this.publish = () => { state = project(); for (const fn of this.listeners) fn() }
    return { getSnapshot: () => state, subscribe: fn => { this.listeners.add(fn); return () => this.listeners.delete(fn) } }
  }
  actions() {
    return {
      edit: (field, text) => { this.drafts.set(field, text); this.publish() },
      resetField: (field) => { this.drafts.set(field, ''); this.publish() },
      discard: () => { this.drafts.clear(); this.publish() },
      save: async () => {
        const ops = []
        for (const [field, spec] of this.specs) {
          if (!this.drafts.has(field)) continue
          const parsed = spec.parse(this.drafts.get(field))
          if (parsed === undefined) return
          ops.push(parsed.kind === 'clear'
            ? { op: 'unset', path: [field] }
            : { op: 'set', path: [field], value: parsed.value })
        }
        if (ops.length === 0) return
        await this.scope.mutate(ops, this.scope.getSnapshot().revision)
        this.drafts.clear(); this.publish()
      },
    }
  }
  dispose() {}
}

let descriptor
runInNewContext(bundleSource, {
  document: win.document, Element: win.Element, Node: win.Node, URL: win.URL, console,
  ResizeObserver: win.ResizeObserver,
  window: Object.assign(win, { __ModuleLoader__: { load: value => { descriptor = value } } }),
})
const plugin = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
  ? {
    SettingsFormModel,
    SettingsForm: ({ children, labels, onSave, state }) => React.createElement('form', {
      onSubmit: event => { event.preventDefault(); onSave() },
    }, children, React.createElement('button', { type: 'submit', disabled: !state.dirty || state.invalid || state.saving }, labels.save)),
    SettingsValueField: ({ id, label, text, invalid, placeholder, onEdit }) => React.createElement(React.Fragment, null,
      React.createElement('label', { htmlFor: id }, label),
      React.createElement('input', { id, value: text, placeholder, 'aria-invalid': invalid, onChange: event => onEdit(event.target.value) })),
    Tooltip: ({ children }) => children,
  }
  : require(name))

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

let root
beforeEach(() => {
  win.document.head.innerHTML = ''
  win.document.body.innerHTML = '<div id="app"></div>'
  root = createRoot(win.document.querySelector('#app'))
})
afterEach(async () => { await act(async () => { root.unmount() }) })
const action = async fn => { await act(async () => { fn() }) }
const query = selector => win.document.querySelector(selector)

test('bundled client inlines @kewen/dsh-ui with zero external require or import', () => {
  assert.doesNotMatch(bundleSource, /\brequire\s*\(\s*['"]@kewen\/dsh-ui(?:\/[^'"]*)?['"]\s*\)/)
  assert.doesNotMatch(bundleSource, /\bfrom\s+['"]@kewen\/dsh-ui(?:\/[^'"]*)?['"]/)
})

test('apply mounts ref-counted @kewen/dsh-ui styles + plugin styles and disposes cleanly', () => {
  const peerDispose = plugin.mountStyles()
  const effects = []
  plugin.apply({
    get: () => undefined,
    effect: (fn, label) => { effects.push({ dispose: fn(), label }) },
  })
  const tokensStyle = query('style[data-dsh-ui="tokens"]')
  const menuStyle = query('style[data-dsh-ui="menu-surface"]')
  const pluginStyle = query('style[data-plugin-css="@kewen/dsh-model-controls"]')
  assert.ok(tokensStyle && menuStyle && pluginStyle, 'shared and plugin style tags mount into head')
const dshUiPkg = JSON.parse(readFileSync(new URL('../../packages/dsh-ui/package.json', import.meta.url), 'utf8'))
  assert.equal(tokensStyle.getAttribute('data-ver'), dshUiPkg.version)
  assert.equal(tokensStyle.getAttribute('data-refs'), '2')

  const styleEffect = effects.find(e => e.label === 'model-controls: styles')
  assert.ok(styleEffect, 'apply registers style cleanup on ctx.effect')
  styleEffect.dispose()
  styleEffect.dispose() // idempotent

  assert.equal(query('style[data-plugin-css="@kewen/dsh-model-controls"]'), null, 'plugin private style removed on unmount')
  assert.equal(tokensStyle.getAttribute('data-refs'), '1', 'shared style survives while peer still holds a ref')
  assert.ok(query('style[data-dsh-ui="tokens"]'))

  peerDispose()
  assert.equal(query('style[data-dsh-ui="tokens"]'), null, 'shared style removed once last ref disposes')
})

test('CJK IME composition events in search input never dismiss panel or steal focus', async () => {
  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
  await action(() => query('.dsh003-picker-btn').click())
  const search = query('.dsh003-picker-search')
  assert.ok(search)
  assert.equal(win.document.activeElement, search)

  // MenuSurface, ScrollArea & unified 16x16 @kewen/dsh-ui SVG icons are mounted
  assert.ok(query('.dsh003-picker-panel.hs-msurf'))
  assert.ok(query('.dsh003-picker-model-scroll.dsh-scroll-frame'))
  assert.ok(query('.dsh003-picker-model-list.dsh-scroll-area'))
  assert.equal(query('.dsh003-picker-search-icon svg.dsh-icon')?.getAttribute('viewBox'), '0 0 16 16')
  assert.equal(query('.dsh003-picker-row-check svg.dsh-icon')?.getAttribute('viewBox'), '0 0 16 16')
  assert.equal(query('.dsh003-picker-row-star svg.dsh-icon')?.getAttribute('viewBox'), '0 0 16 16')

  // Escape & ArrowDown while isComposing=true must NOT close panel or move focus to model rows
  await action(() => {
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', isComposing: true, bubbles: true, cancelable: true }))
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', isComposing: true, bubbles: true, cancelable: true }))
  })
  assert.ok(query('.dsh003-picker-panel'), 'panel stays open during isComposing Escape')
  assert.equal(win.document.activeElement, search, 'focus stays in search during isComposing ArrowDown')

  // keyCode === 229 IME fallback must also be guarded
  await action(() => {
    const ime229 = new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    Object.defineProperty(ime229, 'keyCode', { value: 229 })
    search.dispatchEvent(ime229)
  })
  assert.ok(query('.dsh003-picker-panel'), 'panel stays open during keyCode 229 Escape')

  // Non-composing Escape closes panel normally
  await action(() => {
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
  })
  assert.equal(query('.dsh003-picker-panel'), null)
})

test('settings page renders @kewen/dsh-ui Card, CardRow and StandaloneSwitch synced with form draft', async () => {
  let state = { status: 'ready', writable: true, revision: 2, base: {}, user: {}, value: { compactModelNames: 'on', magpieBaseURL: '' } }
  const calls = []
  const form = {
    getSnapshot: () => state,
    subscribe: () => () => {},
    mutate: async (ops, revision) => { calls.push({ ops, revision }); return true },
  }
  await action(() => root.render(React.createElement(plugin.ModelControlsSettings, {
    view: 'page', form, t: key => settingsZh[key],
  })))

  assert.ok(query('.dsh-card.dsh003-settings-card'))
  assert.equal(win.document.querySelectorAll('.dsh-card-row.dsh003-settings-row').length, 2)
  const toggle = query('.hs-fb-switch[role="switch"]')
  const input = query('#dsh-model-controls-compact')
  assert.ok(toggle && input)
  assert.equal(toggle.getAttribute('aria-checked'), 'true')

  await action(() => toggle.click())
  assert.equal(toggle.getAttribute('aria-checked'), 'false')
  assert.equal(input.value, 'off')

  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.deepEqual(calls[0].ops, [{ op: 'set', path: ['compactModelNames'], value: 'off' }])
})

test('pickerCss retires --dshT3-* tokens and pairs dual-track curvature properly', () => {
  assert.doesNotMatch(pickerCss, /--dshT3-/)
  assert.doesNotMatch(pickerCss, /:root\s*\{[^}]*--dsw-corner-shape/)
  assert.match(pickerCss, /\.dsh003-picker-btn\s*\{[\s\S]*?border-radius:\s*999px\s*!important;[\s\S]*?corner-shape:\s*round\s*!important;/)
  assert.match(pickerCss, /corner-shape:\s*var\(--dsh-corner-shape,\s*var\(--dsw-corner-shape,\s*round\)\)/)
})

test('compositor invariants: MenuSurface glass host keeps overflow:visible with corner-shape:round inner clip', async () => {
  assert.match(pickerCss, /\.dsh003-picker-panel\s*\{[^}]*?overflow:\s*visible\s*!important;/)
  assert.doesNotMatch(pickerCss, /\.dsh003-picker-panel\s*\{[^}]*?overflow:\s*(?:hidden|clip)\b/)
  assert.match(pickerCss, /\.dsh003-picker-inner\s*\{[^}]*?corner-shape:\s*round\s*!important;[^}]*?overflow:\s*clip\s*!important;/)
  assert.doesNotMatch(pickerCss, /will-change\s*:/)
  assert.doesNotMatch(pickerCss, /backdrop-filter\s*:/)

  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
  await action(() => query('.dsh003-picker-btn').click())
  const panel = query('.dsh003-picker-panel')
  const material = query('.dsh003-picker-panel > .hs-msurf-material')
  const inner = query('.dsh003-picker-panel > .dsh003-picker-inner')
  const body = query('.dsh003-picker-panel > .dsh003-picker-inner > .dsh003-picker-body')
  assert.ok(panel && material && inner && body, 'hs-msurf-material must sit outside .dsh003-picker-inner clip container')
  assert.equal(inner.contains(material), false)
})
