import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { pickerPosition } from '../src/client/picker-position.ts'
import { apply as applyHost } from '../lib/index.js'
import { pickerEn, pickerZh, settingsEn, settingsZh } from '../src/client/locales.ts'

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://picker.test' })
const win = dom.window
for (const name of ['window', 'document', 'navigator', 'Element', 'HTMLElement', 'Node']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? win : win[name] })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
win.HTMLElement.prototype.scrollIntoView = function () {}
// jsdom 没有 ResizeObserver；组件用它测量档位文字是否被截断。
// 测试里给一个不触发的桩：默认按「未截断」处理，需要截断的用例自己覆盖。
win.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
win.HTMLElement.prototype.setPointerCapture = function () {}
win.HTMLElement.prototype.releasePointerCapture = function () {}
win.HTMLElement.prototype.getBoundingClientRect = function () {
  return this.classList.contains('dsh003-picker-range')
    ? { left: 100, right: 300, width: 200, top: 400, bottom: 420, height: 20 }
    : { left: 700, right: 900, width: 200, top: 500, bottom: 528, height: 28 }
}
const require = createRequire(import.meta.url)
const React = require('react')
const { createRoot } = require('react-dom/client')
const { act } = React
// Host module contract fixture: production receives the official form model and styled controls.
// It mirrors the official model's contract for the fields a card declares: every field reads its
// own section value, stages its own draft, and saves the ordered writes it planned.
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
  bind(project) { let state = project(); this.publish = () => { state = project(); for (const fn of this.listeners) fn() }; return { getSnapshot: () => state, subscribe: fn => { this.listeners.add(fn); return () => this.listeners.delete(fn) } } }
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
runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  document: win.document, Element: win.Element, Node: win.Node, URL: win.URL, console,
  ResizeObserver: win.ResizeObserver,
  // Only the loader belongs to the fake host; events and hooks use a real DOM and React.
  window: Object.assign(win, { __ModuleLoader__: { load: value => { descriptor = value } } }),
})
const plugin = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
  ? {
    SettingsFormModel,
    SettingsForm: ({ children, labels, onSave, state }) => React.createElement('form', { onSubmit: event => { event.preventDefault(); onSave() } }, children,
      React.createElement('button', { type: 'submit', disabled: !state.dirty || state.invalid || state.saving }, labels.save)),
    SettingsValueField: ({ id, label, text, invalid, placeholder, onEdit }) => React.createElement(React.Fragment, null,
      React.createElement('label', { htmlFor: id }, label),
      React.createElement('input', { id, value: text, placeholder, 'aria-invalid': invalid, onChange: event => onEdit(event.target.value) })),
    MenuSurface: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })), IconChevronDownOutlineRegular: () => null,
    // Host tooltip stand-in: keeps the anchor's own handlers and exposes what it would show.
    Tooltip: ({ label, disabled, children }) => React.cloneElement(children, {
      'data-tooltip-label': disabled === true ? undefined : label,
      'data-tooltip-disabled': disabled === true ? 'true' : 'false',
    }),
  }
  : require(name))
let root
beforeEach(() => {
  win.document.body.innerHTML = '<div id="app"></div>'
  delete win.__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__
  root = createRoot(win.document.querySelector('#app'))
})
afterEach(async () => { await act(async () => { root.unmount() }) })

function fixture() {
  let state = {
    current: { provider: 'p', model: 'a', reasoningEffort: 'low' }, pending: null, status: 'ready', failures: [], error: null,
    groups: [{ id: 'p', name: 'Provider', models: ['a', 'b', 'c'].map(id => ({ id, name: `Model ${id}`, reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } })) }],
  }
  const listeners = new Set()
  const calls = []
  const publish = next => { state = { ...state, ...next }; for (const fn of listeners) fn() }
  const directory = {
    store: { getSnapshot: () => state, subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) } },
    load: async () => state,
    select: async selection => { calls.push(selection); publish({ current: selection, pending: null, error: null }); return { ok: true } },
  }
  return { directory, calls, publish }
}
const query = selector => win.document.querySelector(selector)
const queryAll = selector => [...win.document.querySelectorAll(selector)]
const rows = () => [...win.document.querySelectorAll('.dsh003-picker-model-row')]
const action = async fn => { await act(async () => { fn() }) }
const render = async directory => { await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory }))) }
const open = async () => { await action(() => query('.dsh003-picker-btn').click()) }
const key = async (element, value, type = 'keydown') => {
  await action(() => element.dispatchEvent(new win.KeyboardEvent(type, { key: value, bubbles: true, cancelable: true })))
}

/**
 * 给 jsdom 补一份「真实几何」：它不排版，所有 box 都是 0，
 * 折叠判定因此无从测量。这里只伪造**测量输入**（行可用宽度、各探针宽度、
 * 按钮内边距与间距），决策逻辑仍跑真实实现。
 *
 * @param {{ available: number, effort: number, chevron?: number, logo?: number }} spec
 * @returns 还原函数。
 */
function stubLayout({ available, effort, chevron = 14, logo = 16, label = 0 }) {
  // 顺序敏感：档位文字探针只带通用类，必须放在专属类之后判断，
  // 否则 logo / 箭头 / 竖条探针都会被它抢先匹配。
  const widths = [
    ['dsh003-picker-logo-probe', logo],
    ['dsh003-picker-chev-probe', chevron],
    ['dsh003-picker-meter-probe', 3],
    // 模型名探针：按「13px 字约 7px/字符」估算真实排版宽度。
    // 必须排在通用探针之前，否则会被它抢先匹配成档位宽度。
    ['dsh003-picker-label-probe', Math.max(20, (label ?? 0) * 7)],
    ['dsh003-picker-probe', effort],
  ]
  // 注意：文件顶部给 HTMLElement.prototype 设过兜底桩，它遮蔽 Element.prototype，
  // 所以这里必须覆盖 HTMLElement.prototype 才能生效。
  const rect = win.HTMLElement.prototype.getBoundingClientRect
  const box = width => ({ width, height: 20, top: 0, left: 0, right: width, bottom: 20, x: 0, y: 0, toJSON() {} })
  win.HTMLElement.prototype.getBoundingClientRect = function () {
    const classes = String(this.className ?? '').split(/\s+/)
    for (const [cls, width] of widths) {
      if (classes.includes(cls)) return box(width)
    }
    // 探针容器本身按内容收缩，量它没有意义；统一按 0 处理，避免误取兜底宽度。
    if (classes.includes('dsh003-picker-probes')) return box(0)
    return rect.call(this)
  }
  // 行可用宽度：折叠判定从 #app 的 clientWidth 读。
  const clientWidth = Object.getOwnPropertyDescriptor(win.Element.prototype, 'clientWidth')
  Object.defineProperty(win.Element.prototype, 'clientWidth', {
    configurable: true,
    get() { return this.id === 'app' ? available : (clientWidth?.get?.call(this) ?? 0) },
  })
  // 行必须是 container-type: inline-size（真实宿主如此），按钮的内边距与间距也要有值。
  // jsdom 的 getComputedStyle 返回一个普通对象（不是 live 的 CSSStyleDeclaration），
  // 所以包一层最省事：按元素决定要覆盖哪些属性。
  const computed = win.getComputedStyle.bind(win)
  win.getComputedStyle = (element, pseudo) => {
    const style = computed(element, pseudo)
    const isRow = element instanceof win.Element && element.id === 'app'
    const isButton = element instanceof win.Element && element.classList?.contains('dsh003-picker-btn')
    if (!isRow && !isButton) return style
    // 返回对象可写（每次都是新的），直接改它即可。
    if (isRow) {
      style.containerType = 'inline-size'
      style.paddingLeft = '0px'
      style.paddingRight = '0px'
    } else {
      style.paddingLeft = '8px'
      style.paddingRight = '4px'
    }
    style.columnGap = '4px'
    return style
  }
  return () => {
    win.HTMLElement.prototype.getBoundingClientRect = rect
    if (clientWidth === undefined) delete win.Element.prototype.clientWidth
    else Object.defineProperty(win.Element.prototype, 'clientWidth', clientWidth)
    win.getComputedStyle = computed
  }
}

const pointer = async (target, type, pointerId = 1, clientX = 280, clientY = 410) => {
  const event = new win.MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX, clientY })
  Object.defineProperties(event, { pointerId: { value: pointerId }, isPrimary: { value: true } })
  await action(() => target.dispatchEvent(event))
}
function deferred() { let resolve; const promise = new Promise(fn => { resolve = fn }); return { promise, resolve } }

test('plugin settings renders its labeled address, saves and clears through the official form', async () => {
  let state = { status: 'ready', writable: true, revision: 3, base: {}, user: {}, value: { magpieBaseURL: '' } }
  const calls = []
  const form = { getSnapshot: () => state, subscribe: () => () => {}, mutate: async (ops, revision) => {
    calls.push({ ops, revision }); state = { ...state, value: { magpieBaseURL: ops[0].value } }; return true
  } }
  const missing = []
  const t = key => { if (!(key in settingsZh)) missing.push(key); return settingsZh[key] }
  await action(() => root.render(React.createElement(plugin.ModelControlsSettings, { view: 'page', form, t })))
  const input = query('#dsh-model-controls-magpie')
  assert.equal(query('label[for="dsh-model-controls-magpie"]').htmlFor, input.id)
  // The page must use official settings components only: no hand-rolled disclosure box.
  assert.equal(query('details, summary'), null)
  assert.equal(input.getAttribute('placeholder'), '例如 http://127.0.0.1:3425/v1')
  async function edit(value) { await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(input, value)
    input.dispatchEvent(new win.Event('input', { bubbles: true }))
  }) }
  await edit('http://127.0.0.1:3425/v1')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.equal(calls[0].ops[0].value, 'http://127.0.0.1:3425/v1')
  assert.equal(calls[0].revision, 3)
  await edit('')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.equal(calls[1].ops[0].value, '')
  await edit('http://user:secret@localhost/v1')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.equal(calls.length, 2)
  assert.equal(input.getAttribute('aria-invalid'), 'true')
  assert.deepEqual(missing, [], 'the page must only ask for keys the dictionary defines')
  assert.equal(query('button[type="submit"]').textContent, settingsZh.save)
})

test('the two dictionaries stay in step and the page renders English when the locale is English', async () => {
  for (const [label, a, b] of [['settings', settingsEn, settingsZh], ['picker', pickerEn, pickerZh]]) {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), `${label}: both dictionaries must define the same keys`)
  }
  for (const [key, value] of [...Object.entries(settingsEn), ...Object.entries(settingsZh), ...Object.entries(pickerEn), ...Object.entries(pickerZh)]) {
    assert.ok(typeof value === 'string' && value.trim() !== '', `empty copy for ${key}`)
  }
  // 英文界面下渲染同一张卡片：文案应全部来自 en
  let state = { status: 'ready', writable: true, revision: 1, base: {}, user: {}, value: { magpieBaseURL: '' } }
  const form = { getSnapshot: () => state, subscribe: () => () => {}, mutate: async () => true }
  const asked = []
  const t = key => { asked.push(key); return settingsEn[key] }
  await action(() => root.render(React.createElement(plugin.ModelControlsSettings, { view: 'page', form, t })))
  const input = query('#dsh-model-controls-magpie')
  assert.equal(input.getAttribute('placeholder'), settingsEn.addressPlaceholder)
  assert.equal(query('label[for="dsh-model-controls-magpie"]').textContent, settingsEn.addressLabel)
  assert.equal(query('button[type="submit"]').textContent, settingsEn.save)
  assert.ok(asked.every(key => key in settingsEn), 'every requested key must exist in the English dictionary')
  assert.ok(!/搜索|保存|备用/.test(win.document.body.textContent), 'no Chinese copy may leak into the English page')
})

test('the trigger shortens the model name but keeps the route source verbatim', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'magpie', model: 'a', reasoningEffort: 'high' },
    groups: [{ id: 'magpie', name: 'Magpie', models: [{ id: 'a', name: 'Deepseek-V4.1-Flash · routing group',
      reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } }] }],
  })
  await render(f.directory)
  const trigger = query('.dsh003-picker-btn')
  // 品牌词去掉、路由来源原样保留（供应商不改）。
  assert.equal(query('.dsh003-picker-btn-label').textContent, 'V4.1-Flash · routing group')
  // 档位跟随界面语言：默认中文兜底。
  assert.equal(query('.dsh003-picker-btn-effort').textContent, '高')
  // 悬停提示仍是完整上游名，压缩不外溢。
  assert.equal(trigger.getAttribute('title'), 'Deepseek-V4.1-Flash · routing group · High')
})

test('a model with no brand prefix keeps its full name on the trigger', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'p', model: 'a', reasoningEffort: 'low' },
    groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Step-5-Preview · WorkBuddy AI',
      reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
  })
  await render(f.directory)
  assert.equal(query('.dsh003-picker-btn-label').textContent, 'Step-5-Preview · WorkBuddy AI')
})

test('the effort on the trigger follows the interface language', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
    groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
      reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } }] }],
  })
  const t = (key, params) => {
    const template = pickerEn[key]
    assert.ok(template !== undefined, `missing English key: ${key}`)
    if (params === undefined) return template
    return template.replace(/\{(\w+)\}/g, (whole, name) => name in params ? String(params[name]) : whole)
  }
  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: f.directory, t })))
  assert.equal(query('.dsh003-picker-btn-effort').textContent, 'High')
  assert.equal(query('.dsh003-picker-btn').getAttribute('aria-label'),
    'Choose a model, currently Model a, reasoning effort High')
})

test('the effort slider names a level in the interface language', async () => {
  const f = fixture(); await render(f.directory); await open()
  assert.equal(query('.dsh003-picker-effort-val').textContent, '低')
  assert.equal(query('[role="slider"]').getAttribute('aria-valuetext'), '低')
})

test('the settings page stages and saves the model-name preference', async () => {
  let state = { status: 'ready', writable: true, revision: 5, base: {}, user: {}, value: { compactModelNames: 'on', magpieBaseURL: '' } }
  const calls = []
  const form = { getSnapshot: () => state, subscribe: () => () => {}, mutate: async (ops, revision) => {
    calls.push({ ops, revision }); return true
  } }
  const t = key => settingsZh[key]
  await action(() => root.render(React.createElement(plugin.ModelControlsSettings, { view: 'page', form, t })))
  const input = query('#dsh-model-controls-compact')
  assert.equal(query('label[for="dsh-model-controls-compact"]').textContent, settingsZh.compactNamesLabel)
  assert.equal(input.getAttribute('placeholder'), 'on 或 off')
  assert.equal(input.value, 'on', 'the stored preference seeds the draft')
  async function edit(value) { await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(input, value)
    input.dispatchEvent(new win.Event('input', { bubbles: true }))
  }) }
  await edit('off')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.deepEqual(calls[0].ops, [{ op: 'set', path: ['compactModelNames'], value: 'off' }])
  // Anything other than on/off blocks the save instead of silently discarding the edit.
  await edit('maybe')
  assert.equal(input.getAttribute('aria-invalid'), 'true')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.equal(calls.length, 1)
  // Clearing stages a clear, so the field re-inherits the default.
  await edit('')
  await action(() => query('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })))
  assert.deepEqual(calls[1].ops, [{ op: 'unset', path: ['compactModelNames'] }])
})

test('the model entry keeps its full name when the preference is off', async () => {
  win.__DSH_MODEL_CONTROLS_COMPACT_NAMES__ = false
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'magpie', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'magpie', name: 'Magpie', models: [{ id: 'a', name: 'Deepseek-V4.1-Flash · routing group',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } }] }],
    })
    await render(f.directory)
    assert.equal(query('.dsh003-picker-btn-label').textContent, 'Deepseek-V4.1-Flash · routing group')
  } finally { delete win.__DSH_MODEL_CONTROLS_COMPACT_NAMES__ }
})

test('the model entry shortens names when the preference is absent or on', async () => {
  for (const value of [undefined, true]) {
    if (value === undefined) delete win.__DSH_MODEL_CONTROLS_COMPACT_NAMES__
    else win.__DSH_MODEL_CONTROLS_COMPACT_NAMES__ = value
    const f = fixture()
    f.publish({
      current: { provider: 'magpie', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'magpie', name: 'Magpie', models: [{ id: 'a', name: 'Deepseek-V4.1-Flash · routing group',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } }] }],
    })
    const host = win.document.createElement('div')
    win.document.body.appendChild(host)
    await render(f.directory)
    assert.equal(query('.dsh003-picker-btn-label').textContent, 'V4.1-Flash · routing group',
      `expected a shortened name for ${String(value)}`)
    host.remove()
  }
  delete win.__DSH_MODEL_CONTROLS_COMPACT_NAMES__
})

test('the trigger renders an effort meter when the effort word does not fit', async () => {
  // 折叠判定是实测的：这里给出「按钮只剩 60px」的几何，档位文字 26px，
  // 连「logo + 文字 + 一个字宽模型名」都放不下 → 应换竖条。
  const restore = stubLayout({ available: 60, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'medium', name: 'Medium' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const meter = query('.dsh003-picker-effort-meter')
    assert.ok(meter !== null, 'an effort word that does not fit must give way to the meter')
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-meter'), 'true')
    // 3 档里的最强档 → 满格；填充方向由 CSS 的 bottom:0 决定。
    assert.equal(meter.getAttribute('data-progress'), '1')
    assert.equal(query('.dsh003-picker-effort-meter-fill').style.height, '100%')
    // 读屏应读到当前档位名，而不是一个空 span。
    assert.equal(meter.getAttribute('aria-label'), '高')
  } finally { restore() }
})

test('the meter stays hidden while the effort word still fits', async () => {
  const restore = stubLayout({ available: 360, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-meter'), 'false',
      'no meter while the word is readable')
    assert.equal(query('.dsh003-picker-btn-effort').textContent, '高')
  } finally { restore() }
})

test('the chevron stays while the effort word and model name have room', async () => {
  // 上限够宽、能放下最宽档位文字：箭头必须留着（它是唯一的展开提示）。
  // 注意这里是「行剩余 600px」，经 45% 后上限 270px——足够放下
  // logo + 名字 + `Extra high`(66px) + 箭头，且名字仍远超 40px。
  const restore = stubLayout({ available: 600, effort: 62 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const trigger = query('.dsh003-picker-btn')
    assert.equal(trigger.getAttribute('data-compact-chev'), 'false')
    assert.equal(trigger.getAttribute('data-meter'), 'false')
  } finally { restore() }
})

test('a long model name hands the effort word to the meter', async () => {
  // 判据是「模型名放不下才换竖条」，不是按钮窄到某个值。
  // 这里名字很长（V4.1 Flash Free · routing group），140px 的按钮放不下它，
  // 于是换竖条把档位文字那 24px 让给名字。
  const restore = stubLayout({ available: 200, effort: 26, label: 34 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'V4.1 Flash Free · routing group',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const cap = Number.parseFloat(query('.dsh003-picker-btn').style.getPropertyValue('--dsh003-max'))
    // 200 × 0.45 = 90，低于下限 140，因此按钮仍是 140px。
    assert.equal(cap, 140, `the 140px floor applies here, got ${cap}`)
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-meter'), 'true',
      'the name cannot fit at 140px, so the word yields to the meter')
  } finally { restore() }
})

test('a short model name keeps the word even on a narrow button', async () => {
  // 名字本来就放得下时，竖条没有存在的理由——它只会变成一个没有意义的图形。
  // 这也是「竖条时有时无」的修正：短名字永远保留文字，不再看按钮多宽。
  const restore = stubLayout({ available: 200, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Opus-5',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-meter'), 'false',
      'a short name fits, so the word stays')
  } finally { restore() }
})

test('switching effort levels never changes the button shape', async () => {
  // 这是「竖条时有时无」的直接回归：判据曾经依赖当前档位文字的宽度，
  // 于是同一个按钮里切「中」(12px) 与「最高」(24px) 会在文字/竖条间翻转。
  // 现在判据只看模型名放不放得下，与选中的是哪一档无关。
  const restore = stubLayout({ available: 374, effort: 24, label: 34 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'medium' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'V4.1 Flash Free · routing group',
        reasoning: {
          efforts: [{ id: 'medium', name: '中' }, { id: 'max', name: '最高' }],
          defaultEffort: 'medium',
        } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const first = query('.dsh003-picker-btn').getAttribute('data-meter')

    // 切到名字更长的档位：形态必须一模一样。
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'max' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'V4.1 Flash Free · routing group',
        reasoning: {
          efforts: [{ id: 'medium', name: '中' }, { id: 'max', name: '最高' }],
          defaultEffort: 'medium',
        } }] }],
    })
    await action(() => {})
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-meter'), first,
      'the shape must not flip just because a longer effort label was picked')
  } finally { restore() }
})

test('at the narrowest width the model name is dropped instead of left half-cut', async () => {
  // 按钮可用宽度只够 logo + 竖条：模型名必须整个收起，不能留下「V.…」。
  const restore = stubLayout({ available: 40, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'V4.1 Flash Free',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const trigger = query('.dsh003-picker-btn')
    assert.equal(trigger.getAttribute('data-compact-label'), 'true', 'the name goes away entirely')
    assert.equal(trigger.getAttribute('data-meter'), 'true', 'the meter stays: it still carries information')
  } finally { restore() }
})

test('the model name survives while it still has room to read', async () => {
  // 只要还分得到一个字宽以上，就必须保留模型名——那是「在用哪个模型」的唯一线索。
  const restore = stubLayout({ available: 120, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'V4.1 Flash Free',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    assert.equal(query('.dsh003-picker-btn').getAttribute('data-compact-label'), 'false')
  } finally { restore() }
})

test('the measured width is written to the button so the row never wraps', async () => {
  const restore = stubLayout({ available: 260, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    // CSS 用 var(--dsh003-max) 当 max-width：宽度来自实测，不是硬编码公式。
    // 现在是「行剩余 × 0.45，下限 140、上限 360」，而不是「剩余多少给多少」——
    // 后者会让手机上的按钮正好占满整行。260 × 0.45 = 117，低于下限，取 140。
    assert.equal(query('.dsh003-picker-btn').style.getPropertyValue('--dsh003-max'), '140px')
  } finally { restore() }
})

test('the button never eats the whole composer row on a phone', async () => {
  // 回归用例：截图里 393px 的手机上按钮占满整行剩余（100%），
  // 看起来就是「输入框底部三分之二都是它」。修正后必须只占约 45%。
  const restore = stubLayout({ available: 248, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    const cap = Number.parseFloat(query('.dsh003-picker-btn').style.getPropertyValue('--dsh003-max'))
    // 248 × 0.45 = 112，低于下限，因此取 140（约占 56%），
    // 而不是修复前的 248（100%）。下限的作用见 MIN_CAP。
    assert.equal(cap, 140, `the 140px floor applies here, got ${cap}px`)
    assert.ok(cap / 248 <= 0.57, `the button must not fill the row, got ${(cap / 248 * 100).toFixed(0)}%`)
  } finally { restore() }
})

test('a model with no effort levels says so instead of showing nothing', async () => {
  // 以前这种情况按钮上既不显示档位文字也没有竖条，和「还没加载完」长得一样，
  // 用户会以为出了 bug，而不是意识到这个模型本来就没有档位。
  // 现在必须画淡短轨道 + 一个「无」字。
  const restore = stubLayout({ available: 400, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a' }] }],
    })
    await render(f.directory)
    await action(() => {})
    const none = query('.dsh003-picker-effort-none')
    assert.ok(none !== null, 'a model with no levels must announce that, not stay silent')
    assert.equal(none.textContent, '无')
    assert.ok(query('.dsh003-picker-effort-none-rail') !== null, 'and carry the short dim rail')
    // 不能和有档位的竖条同时出现——那是两个互相矛盾的信号。
    assert.equal(query('.dsh003-picker-effort-meter'), null)
  } finally { restore() }
})

test('a model with levels never shows the "no levels" marker', async () => {
  const restore = stubLayout({ available: 400, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a', reasoningEffort: 'high' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a',
        reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }] }],
    })
    await render(f.directory)
    await action(() => {})
    assert.equal(query('.dsh003-picker-effort-none'), null, 'a model with levels must not claim it has none')
  } finally { restore() }
})

test('the "no levels" marker explains itself on hover', async () => {
  const restore = stubLayout({ available: 400, effort: 26 })
  try {
    const f = fixture()
    f.publish({
      current: { provider: 'p', model: 'a' },
      groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a' }] }],
    })
    await render(f.directory)
    await action(() => {})
    const title = query('.dsh003-picker-btn').getAttribute('title')
    assert.match(title, /没有思考档位/, `the tooltip must say why, got ${title}`)
  } finally { restore() }
})

test('a model without levels carries no meter', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'p', model: 'a' },
    groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a' }] }],
  })
  await render(f.directory)
  await action(() => {})
  assert.equal(query('.dsh003-picker-effort-meter'), null, 'no reasoning levels means nothing to meter')
})

test('a model without effort levels renders no meter at all', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'p', model: 'a', reasoningEffort: 'low' },
    groups: [{ id: 'p', name: 'Provider', models: [{ id: 'a', name: 'Model a' }] }],
  })
  await render(f.directory)
  assert.equal(query('.dsh003-picker-effort-meter'), null)
})

test('pointercancel restores the confirmed effort and sends no selection', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await pointer(slider, 'pointerdown'); await pointer(win, 'pointermove')
  assert.equal(slider.getAttribute('aria-valuetext'), '高')
  await pointer(win, 'pointercancel')
  assert.equal(slider.getAttribute('aria-valuetext'), '低')
  await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
})
test('only the owning pointer can finish, and pointerup commits once', async () => {
  const f = fixture(); await render(f.directory); await open()
  await pointer(query('[role="slider"]'), 'pointerdown')
  await pointer(win, 'pointerup', 2)
  assert.equal(f.calls.length, 0)
  await pointer(win, 'pointerup'); await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 1)
  assert.equal(f.calls[0].reasoningEffort, 'high')
})
test('lost pointer capture cancels instead of committing', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await pointer(slider, 'pointerdown'); await pointer(slider, 'lostpointercapture')
  await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  assert.equal(slider.getAttribute('aria-valuetext'), '低')
})
test('a model change during dragging cannot submit an old model effort', async () => {
  const f = fixture(); await render(f.directory); await open()
  await pointer(query('[role="slider"]'), 'pointerdown')
  await action(() => f.publish({ current: { provider: 'p', model: 'b', reasoningEffort: 'low' } }))
  await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  assert.equal(query('[role="slider"]').getAttribute('aria-valuetext'), '低')
})
test('closing during dragging removes listeners and sends no selection', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await action(() => slider.focus())
  await pointer(slider, 'pointerdown')
  await key(slider, 'Escape')
  await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  assert.equal(query('[role="dialog"]'), null)
})
test('focus enters search, arrows traverse rows, selection retains focus, Escape returns it', async () => {
  const f = fixture(); await render(f.directory); await open()
  assert.equal(win.document.activeElement, query('.dsh003-picker-search'))
  await key(win.document.activeElement, 'ArrowDown')
  assert.equal(win.document.activeElement, rows()[0])
  await key(win.document.activeElement, 'ArrowDown')
  const selected = rows()[1]
  assert.equal(win.document.activeElement, selected)
  await action(() => selected.click())
  assert.equal(win.document.activeElement, selected)
  assert.equal(f.calls[0].model, 'b')
  await key(selected, 'Escape')
  assert.equal(query('[role="dialog"]'), null)
  assert.equal(win.document.activeElement, query('.dsh003-picker-btn'))
})
test('keyboard preview commits when focus leaves before keyup', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await action(() => slider.focus())
  await key(slider, 'ArrowRight')
  assert.equal(f.calls.length, 0)
  await action(() => query('.dsh003-picker-search').focus())
  assert.equal(f.calls.length, 1)
  assert.equal(f.calls[0].reasoningEffort, 'high')
})
test('an earlier failed request cannot leave an error after the latest succeeds', async () => {
  const f = fixture(), first = deferred(), second = deferred()
  f.directory.select = async selection => {
    const index = f.calls.length; f.calls.push(selection)
    f.publish({ pending: selection, error: null })
    const result = await (index === 0 ? first.promise : second.promise)
    f.publish({ pending: null, error: result.ok ? null : 'host rejection', ...(result.ok ? { current: selection } : {}) })
    return result
  }
  await render(f.directory); await open()
  await action(() => rows()[1].click()); await action(() => rows()[2].click())
  await action(() => first.resolve({ ok: false }))
  assert.equal(query('[role="alert"]'), null)
  await action(() => second.resolve({ ok: true }))
  assert.equal(query('[role="alert"]'), null)
  assert.match(query('.dsh003-picker-btn').textContent, /Model c/)
})
test('the latest failure is still displayed, and success clears it', async () => {
  const f = fixture()
  f.directory.select = async selection => { f.calls.push(selection); return { ok: false } }
  await render(f.directory); await open()
  await action(() => rows()[1].click())
  assert.match(query('[role="alert"]').textContent, /切换失败/)
  f.directory.select = async selection => { f.publish({ current: selection }); return { ok: true } }
  await action(() => rows()[2].click())
  assert.equal(query('[role="alert"]'), null)
})
test('a failure from the previous session does not appear in a new directory', async () => {
  const old = fixture(), next = fixture(), response = deferred()
  old.directory.select = async () => response.promise
  await render(old.directory); await open(); await action(() => rows()[1].click())
  await render(next.directory)
  await action(() => response.resolve({ ok: false }))
  assert.equal(query('[role="alert"]'), null)
})
test('a provider failure names the provider and offers a retry', async () => {
  // 宿主真实结构是 { id, name, message }（见官方 ModelSelect 的 failures.map）。
  // 只说一句「部分提供方加载失败」会让用户不知道该改哪个配置。
  const f = fixture()
  f.publish({ failures: [{ id: 'missing', name: 'Missing Provider', message: 'offline' }] })
  let reloads = 0
  f.directory.load = async () => { reloads += 1 }
  await render(f.directory); await open()
  // 挂载与打开面板本来就会各拉一次目录，这里只关心「点重试是否又拉了一次」。
  const before = reloads
  const status = query('[role="status"]')
  assert.match(status.textContent, /Missing Provider/)
  assert.match(status.textContent, /offline/)
  const retry = status.querySelector('.dsh003-picker-retry')
  assert.ok(retry !== null, 'a failed provider must offer a retry button')
  await action(() => retry.click())
  assert.equal(reloads, before + 1, 'retry must reload the catalog')
  // 可用的模型不受影响。
  assert.equal(rows().length, 3)
  await action(() => f.publish({ failures: [] }))
  assert.equal(query('[role="status"]'), null)
})

test('a failed provider without a name falls back to its id', async () => {
  const f = fixture()
  f.publish({ failures: [{ id: 'acme', message: 'timeout' }] })
  await render(f.directory); await open()
  assert.match(query('[role="status"]').textContent, /acme/)
})

test('a catalog load error offers a retry instead of only a message', async () => {
  const f = fixture()
  f.publish({ status: 'error', error: 'boom' })
  let reloads = 0
  f.directory.load = async () => { reloads += 1 }
  await render(f.directory); await open()
  const before = reloads
  const alert = query('[role="alert"]')
  assert.match(alert.textContent, /boom/)
  const retry = alert.querySelector('.dsh003-picker-retry')
  assert.ok(retry !== null, 'a load failure must be retryable in place')
  await action(() => retry.click())
  assert.equal(reloads, before + 1)
})
test('on a phone the menu centres instead of hugging the left edge', () => {
  // 393px 宽的手机上面板是 320px。按「右缘对齐按钮」算会得到负数，只能推回 8px，
  // 于是左边空 8px、右边空 65px——肉眼就是贴在左侧。面板已占八成宽度，居中才对。
  const width = 393
  const panelWidth = Math.min(320, width - 16)
  // 按钮在 composer 里靠右：截图里右缘约在 282px 处。
  const p = pickerPosition({ top: 700, bottom: 734, right: 282 }, width, 844)
  const leftGap = width - p.right - panelWidth
  const rightGap = p.right
  assert.equal(leftGap.toFixed(1), rightGap.toFixed(1), `must be centred, got left ${leftGap} / right ${rightGap}`)
  assert.ok(Math.abs(leftGap - 36.5) < 0.5, 'the side gaps are the leftover half of the viewport')
})

test('on a narrow viewport the menu stays centred but never overflows', () => {
  // 320px 的极窄屏：居中会算出负数，必须退回 8px 内边距，而不是溢出或推歪。
  const width = 320
  const panelWidth = Math.min(320, width - 16)
  const p = pickerPosition({ top: 600, bottom: 634, right: 300 }, width, 844)
  assert.equal(p.right, 8)
  assert.equal(width - p.right - panelWidth, 8)
})

test('on a desktop the menu still hugs the trigger rather than centring', () => {
  // 桌面上面板相对视口很窄，贴按钮才有意义：视线不用横跳，也不遮住整屏。
  const width = 1400
  const panelWidth = Math.min(320, width - 16)
  const p = pickerPosition({ top: 900, bottom: 934, right: 1200 }, width, 844)
  assert.equal(p.right, width - 1200, 'the right edge lines up with the trigger')
  assert.notEqual(width - p.right - panelWidth, p.right, 'and it is visibly not centred')
})

test('menu placement preserves normal size, shrinks above, flips below and stays in bounds', () => {
  const cases = [
    { width: 1000, height: 700, rect: { top: 500, bottom: 528, right: 900 }, expectedHeight: 360, above: true },
    { width: 700, height: 400, rect: { top: 340, bottom: 368, right: 690 }, expectedHeight: 328, above: true },
    { width: 280, height: 600, rect: { top: 50, bottom: 78, right: 40 }, expectedHeight: 360, above: false },
  ]
  for (const c of cases) {
    const p = pickerPosition(c.rect, c.width, c.height)
    const top = p.top ?? c.height - p.bottom - p.maxHeight
    const panelWidth = Math.min(320, c.width - 16)
    assert.equal(p.maxHeight, c.expectedHeight)
    assert.equal(p.bottom !== undefined, c.above)
    assert.ok(top >= 8)
    assert.ok(top + p.maxHeight <= c.height - 8)
    assert.ok(c.width - p.right - panelWidth >= 8)
    assert.ok(p.right >= 8)
  }
})

test('blur cancels an active pointer drag rather than committing a keyboard preview', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await action(() => slider.focus()); await pointer(slider, 'pointerdown')
  await action(() => query('.dsh003-picker-search').focus()); await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  assert.equal(slider.getAttribute('aria-valuetext'), '低')
})
test('Escape cancels a keyboard preview before restoring trigger focus', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await action(() => slider.focus()); await key(slider, 'ArrowRight'); await key(slider, 'Escape')
  assert.equal(f.calls.length, 0)
  assert.equal(win.document.activeElement, query('.dsh003-picker-btn'))
})

test('locking closes the panel, cancels its pointer preview and does not reopen on unlock', async () => {
  const f = fixture(); await render(f.directory); await open()
  const staleRow = rows()[1]
  await pointer(query('[role="slider"]'), 'pointerdown')
  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: f.directory, locked: true })))
  assert.equal(query('.dsh003-picker-btn').disabled, true)
  assert.equal(query('[role="dialog"]'), null)
  await action(() => staleRow.click()); await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  await render(f.directory)
  assert.equal(query('[role="dialog"]'), null)
  await open(); await action(() => rows()[1].click())
  assert.equal(f.calls[0].model, 'b')
})

test('locking cannot commit an unsubmitted keyboard effort preview', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await action(() => slider.focus()); await key(slider, 'ArrowRight')
  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: f.directory, locked: true })))
  await key(slider, 'ArrowRight', 'keyup')
  assert.equal(f.calls.length, 0)
  assert.equal(query('[role="dialog"]'), null)
})

test('catalog refresh preserves browsing; disappearance falls back and actual selection follows', async () => {
  const f = fixture()
  const groups = [
    { id: 'p', name: 'P', models: [{ id: 'a', name: 'Model a' }] },
    { id: 'q', name: 'Q', models: [{ id: 'z', name: 'Model z' }] },
  ]
  f.publish({ groups }); await render(f.directory); await open()
  await action(() => query('[data-provider-id="q"]').click())
  await action(() => f.publish({ groups: groups.map(group => ({ ...group })) }))
  assert.equal(rows()[0].textContent, 'Model z')
  assert.equal(query('[data-provider-id="q"]').dataset.active, 'true')
  await action(() => f.publish({ groups: [groups[0]] }))
  assert.equal(rows()[0].textContent, 'Model a')
  await action(() => f.publish({ groups }))
  assert.equal(rows()[0].textContent, 'Model a')
  await action(() => f.publish({ current: { provider: 'q', model: 'z' } }))
  assert.equal(rows()[0].textContent, 'Model z')
  assert.equal(f.calls.length, 0)
})

test('an asynchronously loaded catalog initially opens the current provider', async () => {
  const f = fixture(); f.publish({ groups: [], status: 'loading', current: { provider: 'q', model: 'z' } })
  await render(f.directory); await open()
  await action(() => f.publish({ status: 'ready', groups: [
    { id: 'p', name: 'P', models: [{ id: 'a', name: 'Model a' }] },
    { id: 'q', name: 'Q', models: [{ id: 'z', name: 'Model z' }] },
  ] }))
  assert.equal(rows()[0].textContent, 'Model z')
  assert.equal(query('[data-provider-id="q"]').dataset.active, 'true')
})

test('window blur cancels an effort drag even when focus stays in search; a new gesture still works', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  assert.equal(win.document.activeElement, query('.dsh003-picker-search'))
  await pointer(slider, 'pointerdown'); await pointer(win, 'pointermove', 1, 285)
  await action(() => win.dispatchEvent(new win.Event('blur')))
  assert.equal(slider.getAttribute('aria-valuetext'), '低')
  await pointer(win, 'pointerup'); assert.equal(f.calls.length, 0)
  await pointer(slider, 'pointerdown'); await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 1)
  assert.equal(f.calls[0].reasoningEffort, 'high')
})

test('empty supplier, catalog, favorites, loading and failure each show one matching message', async () => {
  const f = fixture(); f.publish({ groups: [{ id: 'p', name: 'P', models: [] }] })
  await render(f.directory); await open()
  const message = () => {
    const all = [...win.document.querySelectorAll('.dsh003-picker-model-list p')]
    assert.equal(all.length, 1)
    return all[0].textContent
  }
  assert.equal(message(), '该提供方暂未公布模型。')
  await action(() => f.publish({ groups: [], current: null }))
  assert.equal(message(), '暂无可用模型，请检查提供方配置。')
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.match(message(), /^暂无收藏/)
  await action(() => f.publish({ status: 'loading' }))
  assert.equal(message(), '正在加载模型目录…')
  await action(() => f.publish({ status: 'error' }))
  assert.equal(message(), '模型目录加载失败，请稍后重试。')
  // Restore the shared view for subsequent interaction scenarios.
  await action(() => query('.dsh003-picker-prov-fav').click())
})

test('a search with no results shows only the search empty message', async () => {
  const f = fixture(); await render(f.directory); await open()
  const search = query('.dsh003-picker-search')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, 'does-not-exist')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
  assert.equal(rows().length, 0)
  const messages = [...win.document.querySelectorAll('.dsh003-picker-model-list p')]
  assert.equal(messages.length, 1)
  assert.equal(messages[0].textContent, '没有匹配的模型。')
})

test('explicit gateway identity changes only display, preserving provider/model selection and favorite keys', async () => {
  win.__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__ = { 'deepseek-official': { name: 'Magpie', icon: 'magpie' } }
  const f = fixture()
  f.publish({
    current: { provider: 'deepseek-official', model: 'opencode-go/space-bunny-free' },
    groups: [{ id: 'deepseek-official', name: 'DeepSeek', models: [
      { id: 'opencode-go/space-bunny-free', name: 'Space Bunny Free · OpenCode Go' },
      { id: 'group/auto-glm', name: 'GLM · routing group' },
    ] }],
  })
  await render(f.directory)
  assert.equal(query('.dsh003-picker-btn .dsh003-provider-logo svg')?.getAttribute('viewBox'), '0 5 44 34')
  await open()
  assert.equal(query('[data-provider-id="deepseek-official"]').getAttribute('aria-label'), 'Magpie')
  await action(() => rows()[0].querySelector('.dsh003-picker-row-star').click())
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.equal(query('.dsh003-picker-model-sub').textContent, 'Magpie')
  assert.deepEqual(JSON.parse(win.localStorage.getItem('dsh003.model-picker.favorites')).includes('deepseek-official/opencode-go/space-bunny-free'), true)
  await action(() => query('.dsh003-picker-prov-fav').click())
  await action(() => rows()[1].click())
  assert.equal(f.calls[0].provider, 'deepseek-official')
  assert.equal(f.calls[0].model, 'group/auto-glm')
})

test('without an explicit identity, the same route remains DeepSeek', async () => {
  const f = fixture()
  f.publish({ current: { provider: 'deepseek-official', model: 'm' }, groups: [
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'm', name: 'M' }] },
  ] })
  await render(f.directory); await open()
  assert.equal(query('[data-provider-id="deepseek-official"]').getAttribute('aria-label'), 'DeepSeek')
  assert.equal(query('.dsh003-picker-btn .dsh003-provider-initial'), null)
})

test('removing Magpie routing restores button, supplier and existing favorite identity after reload', async () => {
  let baseURL = 'http://127.0.0.1:3425/v1'
  let inject
  applyHost({
    get: name => name === 'loader' ? { entries: () => [{
      options: { name: '@deepseek-ai/dsh-llm-deepseek-api-key' }, disabled: false,
      fiber: { state: 2, config: { baseURL: { get: () => baseURL } } },
    }] } : undefined,
    on: (_event, handler) => { inject = handler },
  }, { displayProviders: { 'deepseek-official': { name: 'Magpie', icon: 'magpie', whenBaseURL: baseURL } } })
  const pageLoad = () => { const rows = []; inject(rows); win.__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__ = rows[0].value }
  const f = fixture()
  f.publish({ current: { provider: 'deepseek-official', model: 'restore-test' }, groups: [
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'restore-test', name: 'DeepSeek Flash' }] },
  ] })
  pageLoad(); await render(f.directory); await open()
  assert.equal(query('[data-provider-id="deepseek-official"]').getAttribute('aria-label'), 'Magpie')
  assert.equal(query('.dsh003-picker-btn svg')?.getAttribute('viewBox'), '0 5 44 34')
  const star = rows()[0].querySelector('.dsh003-picker-row-star')
  if (star.dataset.fav !== 'true') await action(() => star.click())
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.equal(query('.dsh003-picker-model-sub').textContent, 'Magpie')
  const stored = win.localStorage.getItem('dsh003.model-picker.favorites')
  await action(() => root.render(null))
  baseURL = undefined; pageLoad()
  await render(f.directory); await open()
  assert.equal(query('[data-provider-id="deepseek-official"]').getAttribute('aria-label'), 'DeepSeek')
  assert.notEqual(query('.dsh003-picker-btn svg')?.getAttribute('viewBox'), '0 5 44 34')
  // Reopening returns to the favorites view, where the restored identity applies as well.
  assert.equal(query('.dsh003-picker-model-sub').textContent, 'DeepSeek')
  assert.equal(win.localStorage.getItem('dsh003.model-picker.favorites'), stored)
  assert.equal(f.calls.length, 0)
  // Restore the shared view for subsequent interaction scenarios.
  await action(() => query('.dsh003-picker-prov-fav').click())
})

test('unknown providers still render their initial with the existing small badge', async () => {
  const f = fixture()
  f.publish({ current: { provider: 'custom-lingsuan', model: 'm' }, groups: [
    { id: 'custom-lingsuan', name: '灵算', models: [{ id: 'm', name: 'M' }] },
  ] })
  await render(f.directory)
  const icon = query('.dsh003-picker-btn .dsh003-provider-initial--sm')
  assert.equal(icon?.textContent, '灵')
})

test('every Magpie protocol route shows the Magpie icon instead of a bare initial', async () => {
  const f = fixture()
  // The gateway exposes one route per API protocol; all of them are the same gateway.
  const groups = [
    { id: 'magpie', name: 'Magpie', models: [{ id: 'a', name: 'Model a' }] },
    { id: 'magpie-responses', name: 'Magpie · Responses', models: [{ id: 'b', name: 'Model b' }] },
    { id: 'magpie-anthropic', name: 'Magpie · Anthropic', models: [{ id: 'c', name: 'Model c' }] },
  ]
  f.publish({ current: { provider: 'magpie', model: 'a' }, groups })
  await render(f.directory); await open()
  const magpieViewBox = '0 5 44 34'
  for (const group of groups) {
    assert.equal(
      query(`[data-provider-id="${group.id}"] svg`)?.getAttribute('viewBox'), magpieViewBox,
      `${group.id} must show the Magpie icon`,
    )
    assert.equal(query(`[data-provider-id="${group.id}"] .dsh003-provider-initial`), null,
      `${group.id} must not fall back to a bare initial`)
  }
})

test('a Magpie model splits into two lines in the supplier view, other suppliers stay one line', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'magpie', model: 'm1' },
    groups: [
      { id: 'magpie', name: 'Magpie', models: [
        { id: 'm1', name: 'Qwen3.8-Flash · Qoder CN' },
        { id: 'm2', name: 'Deepseek-V4.1-Flash (SG) · WorkBuddy AI' },
        { id: 'm3', name: 'no-separator-here' },
      ] },
      { id: 'plain', name: 'Plain', models: [{ id: 'p1', name: 'Plain Model' }] },
    ],
  })
  await render(f.directory); await open()
  // Magpie 供应商视图：两行，主行是模型、副行是「网关 · 路由来源」。
  assert.equal(rows()[0].dataset.sub, 'true')
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-name').textContent, 'Qwen3.8-Flash')
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-sub').textContent, 'Magpie · Qoder CN')
  assert.equal(rows()[1].querySelector('.dsh003-picker-model-name').textContent, 'Deepseek-V4.1-Flash (SG)')
  assert.equal(rows()[1].querySelector('.dsh003-picker-model-sub').textContent, 'Magpie · WorkBuddy AI')
  // 不遵循命名约定：回退单行原名，不臆造副行。
  assert.equal(rows()[2].dataset.sub, 'false')
  assert.equal(rows()[2].querySelector('.dsh003-picker-model-sub'), null)
  assert.equal(rows()[2].querySelector('.dsh003-picker-model-name').textContent, 'no-separator-here')
  // 非 Magpie 供应商在供应商视图保持单行。
  await action(() => query('[data-provider-id="plain"]').click())
  assert.equal(rows()[0].dataset.sub, 'false')
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-sub'), null)
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-name').textContent, 'Plain Model')
  // 搜索仍按上游原名匹配（拆分只影响显示，不影响检索）：路由来源也能搜到。
  await action(() => query('[data-provider-id="magpie"]').click())
  const search = query('.dsh003-picker-search')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, 'Qoder')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
  assert.equal(rows().length, 1, 'the upstream name stays searchable even though the route moved to line two')
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-name').textContent, 'Qwen3.8-Flash')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, '')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
})

test('a favourited Magpie model shows the gateway and route in its second line', async () => {
  const f = fixture()
  f.publish({
    current: { provider: 'magpie', model: 'm1' },
    groups: [{ id: 'magpie', name: 'Magpie', models: [{ id: 'm1', name: 'Qwen3.8-Flash · Qoder CN' }] }],
  })
  await render(f.directory); await open()
  await action(() => rows()[0].querySelector('.dsh003-picker-row-star').click())
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-name').textContent, 'Qwen3.8-Flash')
  assert.equal(rows()[0].querySelector('.dsh003-picker-model-sub').textContent, 'Magpie · Qoder CN')
  // 搜索在收藏视图含提供方名与上游原名。
  const search = query('.dsh003-picker-search')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, 'Qoder')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
  assert.equal(rows().length, 1, 'the upstream name stays searchable in the favourites view')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, '')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
  await action(() => query('.dsh003-picker-prov-fav').click())
})

/** 模拟真实截断：jsdom 不做布局，用可覆写的 scrollWidth/clientWidth 表达"文本比盒子宽"。 */
function mockNameOverflow(overflowing) {
  const originalScroll = Object.getOwnPropertyDescriptor(win.Element.prototype, 'scrollWidth')
  const originalClient = Object.getOwnPropertyDescriptor(win.Element.prototype, 'clientWidth')
  Object.defineProperty(win.Element.prototype, 'scrollWidth', {
    configurable: true,
    get() { return this.classList?.contains('dsh003-picker-model-name') && overflowing ? 400 : 100 },
  })
  Object.defineProperty(win.Element.prototype, 'clientWidth', {
    configurable: true,
    get() { return this.classList?.contains('dsh003-picker-model-name') ? 200 : 200 },
  })
  return () => {
    if (originalScroll) Object.defineProperty(win.Element.prototype, 'scrollWidth', originalScroll)
    if (originalClient) Object.defineProperty(win.Element.prototype, 'clientWidth', originalClient)
  }
}

test('a truncated model name offers its full text on hover, and re-measures on each entry', async () => {
  const f = fixture()
  const restore = mockNameOverflow(true)
  try {
    await render(f.directory); await open()
    const name = () => rows()[0].querySelector('.dsh003-picker-model-name')
    // 悬停前处于"待测量"态：气泡未被抑制，真正是否弹出由宿主在测得截断后决定。
    assert.equal(name().getAttribute('data-tooltip-disabled'), 'false')
    await action(() => name().dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true })))
    assert.equal(name().getAttribute('data-tooltip-label'), 'Model a')
    assert.equal(name().getAttribute('data-tooltip-disabled'), 'false',
      'a truncated name must keep the bubble enabled')
    // 离开后复位，下一次进入重新判定
    await action(() => name().dispatchEvent(new win.MouseEvent('mouseout', { bubbles: true })))
    assert.equal(name().getAttribute('data-tooltip-disabled'), 'false')
  } finally { restore() }
})

test('a name that fits is suppressed once measured', async () => {
  const f = fixture()
  const restore = mockNameOverflow(false)
  try {
    await render(f.directory); await open()
    const name = () => rows()[0].querySelector('.dsh003-picker-model-name')
    await action(() => name().dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true })))
    assert.equal(name().getAttribute('data-tooltip-disabled'), 'true',
      'a name that fits must suppress the bubble')
  } finally { restore() }
})

test('cached lists still reflect favorite changes and catalog updates under an active search', async () => {
  const f = fixture()
  const group = { id: 'cache-provider', name: 'Cache Provider', models: [{ id: 'unique', name: 'Original name' }] }
  f.publish({ current: { provider: group.id, model: 'unique' }, groups: [group] })
  await render(f.directory); await open()
  await action(() => rows()[0].querySelector('.dsh003-picker-row-star').click())
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.equal(rows().length, 1)
  assert.match(rows()[0].textContent, /Original name/)
  await action(() => rows()[0].querySelector('.dsh003-picker-row-star').click())
  assert.equal(rows().length, 0)
  await action(() => query('[data-provider-id="cache-provider"]').click())
  const search = query('.dsh003-picker-search')
  await action(() => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(search, 'renamed')
    search.dispatchEvent(new win.Event('input', { bubbles: true }))
  })
  assert.equal(rows().length, 0)
  await action(() => f.publish({ groups: [{ ...group, models: [{ id: 'unique', name: 'Renamed model' }] }] }))
  assert.equal(rows().length, 1)
  assert.equal(rows()[0].textContent, 'Renamed model')
})

test('reopening the panel returns to the favorites view without switching back to the supplier list', async () => {
  const f = fixture()
  const groups = [
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'step-5', name: 'Step 5' }] },
    { id: 'magpie', name: 'Magpie', models: [{ id: 'other', name: 'Other' }] },
  ]
  f.publish({ current: { provider: 'deepseek-official', model: 'step-5' }, groups })
  await render(f.directory); await open()
  assert.equal(query('.dsh003-picker-model-sub'), null, 'the supplier list shows the model name alone')
  await action(() => rows()[0].querySelector('.dsh003-picker-row-star').click())
  await action(() => query('.dsh003-picker-prov-fav').click())
  assert.equal(query('.dsh003-picker-model-sub').textContent, 'DeepSeek')
  await key(query('.dsh003-picker-search'), 'Escape')
  await open()
  assert.equal(query('.dsh003-picker-model-sub').textContent, 'DeepSeek')
  assert.equal(f.calls.length, 0, 'reopening must not resubmit the current model')
  assert.equal(query('[data-provider-id="deepseek-official"]').dataset.active, 'false')
  // 切回供应商视图后重开，应留在供应商视图（记忆双向生效）
  await action(() => query('[data-provider-id="deepseek-official"]').click())
  await key(query('.dsh003-picker-search'), 'Escape')
  await open()
  assert.equal(query('.dsh003-picker-model-sub'), null)
})

let supplierFixtureId = 0
const suppliers = () => [...win.document.querySelectorAll('.dsh003-picker-prov-list [data-provider-id]')]
const supplierIds = () => suppliers().map(button => button.dataset.providerId)
const savedOrder = () => JSON.parse(win.localStorage.getItem('dsh003.model-picker.provider-order'))
function supplierFixture(t) {
  const f = fixture(), prefix = `supplier-${++supplierFixtureId}`
  const groups = ['A', 'B', 'C'].map(name => ({ id: `${prefix}-${name}`, name, models: [{ id: name, name: `Model ${name}` }] }))
  f.publish({ groups, current: { provider: groups[0].id, model: 'A' } })
  const originalRect = win.HTMLElement.prototype.getBoundingClientRect
  t.mock.method(win.HTMLElement.prototype, 'getBoundingClientRect', function () {
    if (this.classList.contains('dsh003-picker-prov-list')) return { top: 0, bottom: 120, height: 120, left: 0, right: 52, width: 52 }
    if (this.dataset.providerId) {
      const offset = Number(this.style.transform.match(/translateY\(([-.\d]+)px\)/)?.[1] ?? 0)
      const top = suppliers().indexOf(this) * 40 + offset - query('.dsh003-picker-prov-list').scrollTop
      return { top, bottom: top + 36, height: 36, left: 8, right: 44, width: 36 }
    }
    return originalRect.call(this)
  })
  let hold, scroll
  const originalTimeout = win.setTimeout.bind(win)
  t.mock.method(win, 'setTimeout', (fn, ms, ...args) => {
    if (ms === 300) { hold = fn; return 900000 }
    return originalTimeout(fn, ms, ...args)
  })
  t.mock.method(win, 'setInterval', fn => { scroll = fn; return 900001 })
  return { ...f, groups, hold: () => action(() => hold()), scroll: () => action(() => scroll()) }
}

test('supplier positions survive host reordering, temporary absence and new providers', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const ids = f.groups.map(p => p.id)
  assert.deepEqual(supplierIds(), ids)
  await action(() => f.publish({ groups: [f.groups[2], f.groups[0]] }))
  assert.deepEqual(supplierIds(), [ids[0], ids[2]])
  const extra = { id: 'extra-stable', name: 'Extra', models: [] }
  await action(() => f.publish({ groups: [extra, ...f.groups.toReversed()] }))
  assert.deepEqual(supplierIds(), [...ids, extra.id])
})
test('long press reorders without switching and persists across reopening and a fresh plugin load', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const ids = f.groups.map(p => p.id), first = suppliers()[0]
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  assert.equal(first.dataset.dragging, 'true')
  await pointer(win, 'pointermove', 1, 20, 115)
  assert.ok(query('.dsh003-picker-prov-insert-end'))
  await pointer(win, 'pointerup', 1, 20, 115)
  await action(() => first.click())
  const expected = [ids[1], ids[2], ids[0]]
  assert.deepEqual(supplierIds(), expected)
  assert.equal(f.calls.length, 0)
  assert.match(query('.dsh003-picker-model-row').textContent, /Model A/)
  assert.deepEqual(savedOrder().filter(id => ids.includes(id)), expected)
  await key(query('.dsh003-picker-search'), 'Escape'); await open()
  assert.deepEqual(supplierIds(), expected)
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), { document: win.document, Element: win.Element, Node: win.Node, console, ResizeObserver: win.ResizeObserver, window: win })
  const reloaded = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
    ? { MenuSurface: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })), IconChevronDownOutlineRegular: () => null, Tooltip: ({ children }) => children }
    : require(name))
  await action(() => root.render(React.createElement(reloaded.ModelPickerButton, { directory: f.directory })))
  await open()
  assert.deepEqual(supplierIds(), expected)
})
test('a short click switches the supplier; movement before the hold cancels sorting and click', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const second = suppliers()[1], before = savedOrder()
  await pointer(second, 'pointerdown', 1, 20, 58)
  await pointer(win, 'pointerup', 1, 20, 58); await action(() => second.click())
  assert.match(rows()[0].textContent, /Model B/)
  const first = suppliers()[0]
  await pointer(first, 'pointerdown', 1, 20, 18)
  await pointer(win, 'pointermove', 1, 20, 30)
  await pointer(win, 'pointerup', 1, 20, 30); await action(() => first.click())
  assert.match(rows()[0].textContent, /Model B/)
  assert.deepEqual(savedOrder(), before)
})
test('Escape cancels supplier sorting and keeps the menu open', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const first = suppliers()[0], before = savedOrder()
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  await pointer(win, 'pointermove', 1, 20, 115)
  await key(first, 'Escape')
  assert.ok(query('[role="dialog"]'))
  assert.equal(query('[data-dragging="true"]'), null)
  await pointer(win, 'pointerup', 1, 20, 115); await action(() => first.click())
  assert.deepEqual(savedOrder(), before)
  assert.match(rows()[0].textContent, /Model A/)
})
test('supplier pointer ownership, cancellation and lost capture cannot save a preview', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const first = suppliers()[0], before = savedOrder()
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  await pointer(win, 'pointermove', 2, 20, 115)
  await pointer(win, 'pointerup', 2, 20, 115)
  assert.equal(first.dataset.dragging, 'true')
  await pointer(win, 'pointermove', 1, 20, 115)
  await pointer(win, 'pointercancel', 1, 20, 115)
  assert.deepEqual(savedOrder(), before)
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  await pointer(win, 'pointermove', 1, 20, 115)
  await pointer(first, 'lostpointercapture', 1, 20, 115)
  await pointer(win, 'pointerup', 1, 20, 115)
  assert.deepEqual(savedOrder(), before)
  assert.equal(f.calls.length, 0)
})
test('supplier changes and closing remove active sort listeners without saving', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const first = suppliers()[0], before = savedOrder()
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  await pointer(win, 'pointermove', 1, 20, 115)
  await action(() => f.publish({ groups: [f.groups[0], f.groups[1]] }))
  await pointer(win, 'pointerup', 1, 20, 115)
  assert.deepEqual(savedOrder(), before)
  await pointer(first, 'pointerdown', 1, 20, 18); await f.hold()
  await action(() => query('.dsh003-picker-btn').click())
  await pointer(win, 'pointerup', 1, 20, 115)
  assert.deepEqual(savedOrder(), before)
  assert.equal(query('[role="dialog"]'), null)
})
test('keyboard supplier reordering retains focus and leaves the selected model unchanged', async t => {
  const f = supplierFixture(t); await render(f.directory); await open()
  const first = suppliers()[0], ids = f.groups.map(p => p.id)
  await action(() => first.focus())
  await action(() => first.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true, cancelable: true })))
  assert.deepEqual(supplierIds(), [ids[1], ids[0], ids[2]])
  assert.equal(win.document.activeElement, first)
  assert.equal(f.calls.length, 0)
  assert.match(rows()[0].textContent, /Model A/)
})

test('holding a supplier at the viewport edge scrolls to destinations outside the initial view', async t => {
  const f = supplierFixture(t)
  const extra = ['D', 'E', 'F'].map(name => ({ id: `scroll-${name}`, name, models: [{ id: name, name }] }))
  const groups = [...f.groups, ...extra], ids = groups.map(p => p.id)
  f.publish({ groups }); await render(f.directory); await open()
  await pointer(suppliers()[0], 'pointerdown', 1, 20, 18); await f.hold()
  await pointer(win, 'pointermove', 1, 20, 115)
  for (let index = 0; index < 5; index++) await f.scroll()
  assert.equal(query('.dsh003-picker-prov-list').scrollTop, 50)
  assert.equal(query('[data-insert="before"]').dataset.providerId, ids[4])
  await pointer(win, 'pointerup', 1, 20, 115)
  assert.deepEqual(supplierIds(), [ids[1], ids[2], ids[3], ids[0], ids[4], ids[5]])
  assert.equal(f.calls.length, 0)
})

test('search placeholder names the browsed provider, never dropping it', () => {
  const { searchPlaceholder, NEUTRAL_PLACEHOLDER } = require('../src/client/search-placeholder.ts')
  // 供应商视图：写显示名
  assert.equal(searchPlaceholder(false, 'Magpie'), '搜索 Magpie 模型…')
  assert.equal(searchPlaceholder(false, 'OpenCode Go'), '搜索 OpenCode Go 模型…')
  assert.equal(searchPlaceholder(false, '灵算'), '搜索 灵算 模型…')
  // 收藏视图跨供应商，不写名字
  assert.equal(searchPlaceholder(true, 'Magpie'), '搜索收藏模型…')
  // 取不到名字才退回中性，此时无供应商可写
  assert.equal(searchPlaceholder(false, undefined), NEUTRAL_PLACEHOLDER)
  assert.equal(searchPlaceholder(false, '   '), NEUTRAL_PLACEHOLDER)
})

test('a long provider name shortens the wording first, then clips, and keeps its head', () => {
  const { searchPlaceholder } = require('../src/client/search-placeholder.ts')
  // 「Qwen Token Plan CN」18 单位，仍在第一级：完整显示
  assert.equal(searchPlaceholder(false, 'Qwen Token Plan CN'), '搜索 Qwen Token Plan CN 模型…')
  // 去掉「模型」两字腾出空间：名字仍完整
  assert.equal(searchPlaceholder(false, 'OpenCode Go Enterprise'), '搜索 OpenCode Go Enterprise…')
  // 仍放不下才截断，且保留名字开头（不出现只有「搜索…」的空壳）
  const clipped = searchPlaceholder(false, 'Qwen Token Plan CN Enterprise Edition')
  assert.ok(clipped.startsWith('搜索 Qwen Token Plan'), clipped)
  assert.ok(clipped.endsWith('…'), clipped)
  assert.ok(!clipped.includes(' 模型…'), clipped)
  // 中文名按双宽计算，不会因为字少就被误判为放得下
  assert.ok(searchPlaceholder(false, '这是一个非常非常长的中文供应商名称示例').length < 24)
})

test('the search box shows the provider name and keeps a stable accessible name', async () => {
  const f = fixture()
  f.publish({ groups: [
    { id: 'p', name: 'Magpie', models: [{ id: 'a', name: 'Model A' }] },
    { id: 'q', name: 'OpenCode Go', models: [{ id: 'b', name: 'Model B' }] },
  ] })
  await render(f.directory); await open()
  const input = query('.dsh003-picker-search')
  assert.equal(input.getAttribute('placeholder'), '搜索 Magpie 模型…')
  assert.equal(input.getAttribute('title'), '搜索 Magpie 模型…')
  assert.equal(input.getAttribute('aria-label'), '搜索模型…')
  await action(() => query('[data-provider-id="q"]').click())
  assert.equal(input.getAttribute('placeholder'), '搜索 OpenCode Go 模型…')
  assert.equal(input.getAttribute('aria-label'), '搜索模型…')
})

test('the picker renders in English with no Chinese copy left behind', async () => {
  const t = (key, params) => {
    const template = pickerEn[key]
    assert.ok(template !== undefined, `missing English key: ${key}`)
    if (params === undefined) return template
    return template.replace(/\{(\w+)\}/g, (whole, name) => name in params ? String(params[name]) : whole)
  }
  const f = fixture()
  f.publish({
    current: { provider: 'open-code-go', model: 'a', reasoningEffort: 'high' },
    groups: [{ id: 'open-code-go', name: 'OpenCode Go', models: [{ id: 'a', name: 'Model A',
      reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } }] }],
  })
  await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory: f.directory, t })))
  const trigger = query('.dsh003-picker-btn')
  assert.equal(trigger.getAttribute('aria-label'), 'Choose a model, currently Model A, reasoning effort High')
  await open()
  const input = query('.dsh003-picker-search')
  assert.equal(input.getAttribute('placeholder'), 'Search OpenCode Go models…')
  assert.equal(input.getAttribute('aria-label'), 'Search models…')
  assert.equal(query('[role="dialog"]').getAttribute('aria-label'), 'Choose a model')
  assert.equal(query('[role="tablist"]').getAttribute('aria-label'), 'Providers')
  assert.equal(query('.dsh003-picker-row-star').getAttribute('aria-label'), 'Add to favourites')
  assert.equal(query('.dsh003-picker-effort-sub').textContent, 'Reasoning effort')
  assert.ok(!/[\u4e00-\u9fa5]/.test(win.document.body.textContent), 'no Chinese copy may remain in the English picker')
  assert.ok(!/[\u4e00-\u9fa5]/.test(trigger.getAttribute('aria-label')), 'the trigger label must be English too')
})
