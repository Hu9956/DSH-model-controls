import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { pickerPosition } from '../src/client/picker-position.ts'

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
let descriptor
runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  document: win.document, Element: win.Element, Node: win.Node, console,
  // Only the loader belongs to the fake host; events and hooks use a real DOM and React.
  window: Object.assign(win, { __ModuleLoader__: { load: value => { descriptor = value } } }),
})
const plugin = descriptor.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives'
  ? { MenuSurface: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })), IconChevronDownOutlineRegular: () => null }
  : require(name))
let root
beforeEach(() => {
  win.document.body.innerHTML = '<div id="app"></div>'
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
