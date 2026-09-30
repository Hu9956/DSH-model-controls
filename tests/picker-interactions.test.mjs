import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { pickerPosition } from '../src/client/picker-position.ts'
import { apply as applyHost } from '../lib/index.js'

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://picker.test' })
const win = dom.window
for (const name of ['window', 'document', 'navigator', 'Element', 'HTMLElement', 'Node']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? win : win[name] })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
win.HTMLElement.prototype.scrollIntoView = function () {}
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
class SettingsFormModel {
  constructor(scope, specs) { this.scope = scope; this.spec = specs[0]; this.draft = null; this.listeners = new Set() }
  shell() { return { available: true, writable: true, dirty: this.draft !== null, invalid: this.field().invalid, saving: false, failed: false } }
  field() { const text = this.draft ?? this.scope.getSnapshot().value.magpieBaseURL; return { text, invalid: this.spec.parse(text) === undefined, overridden: this.draft !== null } }
  bind(project) { let state = project(); this.publish = () => { state = project(); for (const fn of this.listeners) fn() }; return { getSnapshot: () => state, subscribe: fn => { this.listeners.add(fn); return () => this.listeners.delete(fn) } } }
  actions() { return { edit: (_field, text) => { this.draft = text; this.publish() }, discard: () => {}, save: async () => {
    const parsed = this.spec.parse(this.field().text); if (!parsed) return
    await this.scope.mutate([{ op: 'set', path: [this.spec.field], value: parsed.value }], this.scope.getSnapshot().revision)
    this.draft = null; this.publish()
  } } }
  dispose() {}
}
let descriptor
runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  document: win.document, Element: win.Element, Node: win.Node, URL: win.URL, console,
  // Only the loader belongs to the fake host; events and hooks use a real DOM and React.
  window: Object.assign(win, { __ModuleLoader__: { load: value => { descriptor = value } } }),
})
const plugin = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
  ? {
    SettingsFormModel,
    SettingsForm: ({ children, onSave, state }) => React.createElement('form', { onSubmit: event => { event.preventDefault(); onSave() } }, children,
      React.createElement('button', { type: 'submit', disabled: !state.dirty || state.invalid || state.saving }, '保存')),
    SettingsValueField: ({ id, label, text, invalid, placeholder, onEdit }) => React.createElement(React.Fragment, null,
      React.createElement('label', { htmlFor: id }, label),
      React.createElement('input', { id, value: text, placeholder, 'aria-invalid': invalid, onChange: event => onEdit(event.target.value) })),
    MenuSurface: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })), IconChevronDownOutlineRegular: () => null,
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
const rows = () => [...win.document.querySelectorAll('.dsh003-picker-model-row')]
const action = async fn => { await act(async () => { fn() }) }
const render = async directory => { await action(() => root.render(React.createElement(plugin.ModelPickerButton, { directory }))) }
const open = async () => { await action(() => query('.dsh003-picker-btn').click()) }
const key = async (element, value, type = 'keydown') => {
  await action(() => element.dispatchEvent(new win.KeyboardEvent(type, { key: value, bubbles: true, cancelable: true })))
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
  await action(() => root.render(React.createElement(plugin.ModelControlsSettings, { view: 'page', form })))
  const input = query('#dsh-model-controls-magpie')
  assert.equal(query('label').htmlFor, input.id)
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
})

test('pointercancel restores the confirmed effort and sends no selection', async () => {
  const f = fixture(); await render(f.directory); await open()
  const slider = query('[role="slider"]')
  await pointer(slider, 'pointerdown'); await pointer(win, 'pointermove')
  assert.equal(slider.getAttribute('aria-valuetext'), 'High')
  await pointer(win, 'pointercancel')
  assert.equal(slider.getAttribute('aria-valuetext'), 'Low')
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
  assert.equal(slider.getAttribute('aria-valuetext'), 'Low')
})
test('a model change during dragging cannot submit an old model effort', async () => {
  const f = fixture(); await render(f.directory); await open()
  await pointer(query('[role="slider"]'), 'pointerdown')
  await action(() => f.publish({ current: { provider: 'p', model: 'b', reasoningEffort: 'low' } }))
  await pointer(win, 'pointerup')
  assert.equal(f.calls.length, 0)
  assert.equal(query('[role="slider"]').getAttribute('aria-valuetext'), 'Low')
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
test('partial provider failure keeps usable models and displays a warning', async () => {
  const f = fixture(); f.publish({ failures: [{ provider: 'missing', error: 'offline' }] })
  await render(f.directory); await open()
  assert.match(query('[role="status"]').textContent, /部分提供方/)
  assert.equal(rows().length, 3)
  await action(() => f.publish({ failures: [] }))
  assert.equal(query('[role="status"]'), null)
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
  assert.equal(slider.getAttribute('aria-valuetext'), 'Low')
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
  assert.equal(slider.getAttribute('aria-valuetext'), 'Low')
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
  await action(() => query('.dsh003-picker-prov-fav').click())
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
  runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), { document: win.document, Element: win.Element, Node: win.Node, console, window: win })
  const reloaded = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
    ? { MenuSurface: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })), IconChevronDownOutlineRegular: () => null }
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
