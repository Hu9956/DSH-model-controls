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
  // 模拟从 <=0.2.45 不重启热升级时遗留在 head 的旧版样式表，mountStyles 必须自动清理
  const legacyStyle = win.document.createElement('style')
  legacyStyle.dataset.plugin = 'dsh-std-model-picker'
  legacyStyle.textContent = '.dsh003-picker-prov[data-active="true"]{background:red !important;}'
  win.document.head.appendChild(legacyStyle)

  const peerDispose = plugin.mountStyles()
  assert.equal(query('style[data-plugin="dsh-std-model-picker"]'), null, 'legacy <=0.2.45 style tag is purged on mount')
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
  await action(() => query('.dsh003-picker-search-toggle').click())
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

  // Escape & ArrowDown while isComposing=true must NOT collapse search, close panel or move focus to model rows
  await action(() => {
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', isComposing: true, bubbles: true, cancelable: true }))
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', isComposing: true, bubbles: true, cancelable: true }))
  })
  assert.ok(query('.dsh003-picker-search'), 'search stays open during isComposing Escape')
  assert.ok(query('.dsh003-picker-panel'), 'panel stays open during isComposing Escape')
  assert.equal(win.document.activeElement, search, 'focus stays in search during isComposing ArrowDown')

  // keyCode === 229 IME fallback must also be guarded
  await action(() => {
    const ime229 = new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    Object.defineProperty(ime229, 'keyCode', { value: 229 })
    search.dispatchEvent(ime229)
  })
  assert.ok(query('.dsh003-picker-search'), 'search stays open during keyCode 229 Escape')
  assert.ok(query('.dsh003-picker-panel'), 'panel stays open during keyCode 229 Escape')

  // First non-composing Escape collapses search back to tabs, keeping panel open
  await action(() => {
    search.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
  })
  assert.equal(query('.dsh003-picker-search'), null)
  assert.ok(query('.dsh003-picker-panel'), 'panel stays open after collapsing search')

  // Second Escape closes the panel
  await action(() => {
    query('.dsh003-picker-panel').dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
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

test('row hover rule never overrides starred or directly-hovered star color', () => {
  assert.match(pickerCss, /\.dsh003-picker-model-item:hover\s+\.dsh003-picker-row-star:not\(\[data-fav="true"\]\):not\(:hover\)/)
  assert.doesNotMatch(pickerCss, /\.dsh003-picker-model-item:hover\s+\.dsh003-picker-row-star\s*\{/)
  assert.doesNotMatch(pickerCss, /\.dsh003-picker-model-row:hover/, 'hover chrome lives on the item shell, not the inner row button')
})

test('top bar icon boxes, end-insert margin and focus pseudo-element invariants hold', () => {
  assert.match(pickerCss, /\.dsh003-picker-search-icon\s+\.dsh-icon\s*\{[^}]*width:\s*14px\s*!important;[^}]*height:\s*14px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-search-close\s+\.dsh-icon\s*\{[^}]*width:\s*14px\s*!important;[^}]*height:\s*14px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-prov-insert-end\s*\{[^}]*margin:\s*0\s+-2px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-prov:not\(\[data-insert="before"\]\):focus-visible::before/)
})

test('active row check sits inline after model name and all four bands align on the 16px grid', async () => {
  assert.match(pickerCss, /\.dsh003-picker-topbar\s*\{[^}]*padding:\s*0\s+8px\s+0\s+6px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-model-item\s*\{[^}]*padding:\s*0\s+2px\s+0(?:\s+0)?\s*!important;/,
    'item keeps only the 2px right edge that aligns the star; the rest of the band is clickable row padding')
  assert.match(pickerCss, /\.dsh003-picker-model-item\s*\{[^}]*min-height:\s*36px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-model-item\[data-sub="true"\]\s*\{[^}]*min-height:\s*36px\s*!important;/)
  assert.doesNotMatch(pickerCss, /\.dsh003-picker-model-item\[data-sub="true"\]\s*\{[^}]*padding:/)
  assert.match(pickerCss, /\.dsh003-picker-model-row\s*\{[^}]*padding:\s*6px\s+6px\s+6px\s+8px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-model-row\s*\{[^}]*align-self:\s*stretch\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-model-row\[data-sub="true"\]\s*\{[^}]*padding:\s*3px\s+6px\s+3px\s+8px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-row-star\s*\{[^}]*margin-left:\s*0\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-foot\s*\{[^}]*padding:\s*6px\s+16px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-options\s*\{[^}]*padding:\s*4px\s+8px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-model-name\s*\{[^}]*flex:\s*0\s+1\s+auto\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-row-star\s+\.dsh-icon\s*\{[^}]*width:\s*14px\s*!important;[^}]*height:\s*14px\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-row-check\s+\.dsh-icon\s*\{[^}]*width:\s*13px\s*!important;[^}]*height:\s*13px\s*!important;/)

  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
  await action(() => query('.dsh003-picker-btn').click())
  const activeItem = query('.dsh003-picker-model-item[data-active="true"]')
  assert.ok(activeItem)
  const row = activeItem.querySelector('.dsh003-picker-model-row')
  const title = row?.querySelector('.dsh003-picker-model-title')
  const name = title?.querySelector('.dsh003-picker-model-name')
  const check = title?.querySelector('.dsh003-picker-row-check')
  const star = activeItem.querySelector('.dsh003-picker-row-star')
  assert.ok(row && title && name && check && star, 'check renders inside .dsh003-picker-model-title alongside model name')
  assert.equal(title.contains(star), false, 'star stays outside title block at row trailing edge')
  assert.equal(row.contains(star), false, 'star is a sibling button after the row, never nested inside it')
})

test('effort slider uses seamless capsule fill enclosing circular knob with distinct dark-mode contrast', async () => {
  assert.match(pickerCss, /\.dsh003-picker-slider\s*\{[^}]*border-radius:\s*999px\s*!important;[^}]*corner-shape:\s*round\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-fill\s*\{[^}]*border-radius:\s*999px\s*!important;[^}]*corner-shape:\s*round\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-knob\s*\{[^}]*width:\s*18px\s*!important;[^}]*height:\s*18px\s*!important;[^}]*border-radius:\s*999px\s*!important;/)
  assert.match(pickerCss, /body\[data-ds-dark-theme\]\s+\.dsh003-picker-knob\s*\{[^}]*var\(--dsh-brand-fill/)

  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
  await action(() => query('.dsh003-picker-btn').click())
  const fill = query('.dsh003-picker-fill')
  const knob = query('.dsh003-picker-knob')
  const ticks = win.document.querySelectorAll('.dsh003-picker-tick')
  assert.match(fill?.style.width ?? '', /^calc\(20px \+ (?:0 \* \(100% - 20px\)|\(100% - 20px\) \* 0)\)$/)
  assert.match(knob?.style.left ?? '', /^calc\(10px \+ (?:0 \* \(100% - 20px\)|\(100% - 20px\) \* 0)\)$/)
  assert.match(ticks[0]?.style.left ?? '', /^calc\(10px \+ (?:0 \* \(100% - 20px\)|\(100% - 20px\) \* 0)\)$/)
  assert.match(ticks[1]?.style.left ?? '', /^calc\(10px \+ (?:1 \* \(100% - 20px\)|\(100% - 20px\) \* 1)\)$/)
})

test('provider topbar mounts @kewen/dsh-ui sliding rounded underline indicator', async () => {
  assert.match(pickerCss, /\.dsh003-picker-prov-list\s*\{[^}]*position:\s*relative\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-prov-ind::after\s*\{[^}]*border-radius:\s*999px\s*!important;[^}]*corner-shape:\s*round\s*!important;/)
  assert.match(pickerCss, /\.dsh003-picker-prov-list\[data-ind\]\s+\.dsh003-picker-prov\[data-active="true"\]::after\s*\{\s*display:\s*none\s*!important;\s*\}/)

  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: fixture() })))
  await action(() => query('.dsh003-picker-btn').click())
  const list = query('.dsh003-picker-prov-list')
  assert.ok(list?.hasAttribute('data-ind'), 'provider rail mounts useSlidingIndicator data-ind attribute')
  const ind = list?.querySelector('.dsh003-picker-prov-ind')
  assert.ok(ind, 'provider rail renders sliding indicator node')
})
