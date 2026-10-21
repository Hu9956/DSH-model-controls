import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/**
 * 触发按钮的降级：**按实测溢出量折叠，CSS 里没有任何宽度阈值**。
 *
 * 曾经的错误路线（本文件负责防止回退）：
 *   1. 按容器宽度写死三级 `max-width` 台阶（360 → 160 → 57 → 39px）。
 *      阈值一过按钮立刻窄 100px，文字整块消失，看着像凭空跳掉。
 *   2. 用 `calc(100cqw - 140px)` 推算按钮可用宽度。那个 140px 是照实测抄的，
 *      布局一改就错，而且窄窗口下会算出负数，导致整条声明失效。
 *   3. 用「模型名还剩多少宽度」当判据，需要手填固定占位 54px，
 *      错几像素就整档跑偏——实际表现是「模型名早没了、竖条却不出现」。
 *
 * 现在的做法（照 ZCode 的 composer 折叠）：
 *   宽度全部来自真实布局（`getBoundingClientRect` / `getComputedStyle`），
 *   判据是「还溢不溢出」，折叠状态由 `data-*` 属性驱动。
 */
const css = readFileSync(new URL('../src/client/picker.css.ts', import.meta.url), 'utf8')

function rule(selector) {
  const block = new RegExp(`^\\.${selector} \\{([\\s\\S]*?)\\n\\}`, 'm').exec(css)?.[1]
  assert.ok(block !== undefined, `.${selector} must exist`)
  return block
}
function declarations(block) {
  const out = new Map()
  for (const line of block.split('\n')) {
    const match = /^\s*([a-z-]+):\s*(.+?)!important;/.exec(line)
    if (match !== null) out.set(match[1], match[2].trim())
  }
  return out
}

test('no width threshold decides anything any more', () => {
  // 折叠必须完全由 JS 实测驱动。任何 @container 都会把「放不放得下」
  // 简化成「窗口多宽」，而同一个窗口宽度下模型名长短可以差 200px。
  assert.ok(!/@container/.test(css),
    'a container query cannot know whether the content fits; the collapse must be measured')
  assert.ok(!/data-meter[\s\S]{0,200}@container/.test(css))
})

test('the button width comes from measurement, with a sane fallback', () => {
  const widths = [...rule('dsh003-picker-btn').matchAll(/max-width:\s*(.+?)!important;/g)]
  const last = widths.at(-1)[1]
  // JS 算出「这一行剩余空间的固定份额」后写进 --dsh003-max；
  // 没有硬编码的 140px，也没有会在窄窗口算出负数的 calc()。
  assert.match(last, /var\(--dsh003-max/, 'the measured share must drive the button')
  assert.match(last, /360px/, 'the official absolute cap stays')
  assert.ok(!/140px/.test(last), 'a hardcoded trailing-group width goes stale as soon as the layout changes')
  assert.ok(!/calc\(100cqw/.test(last), 'a negative cqw subtraction invalidates the whole declaration')
})

test('the model name is the only thing that shrinks, and it shrinks continuously', () => {
  const label = declarations(rule('dsh003-picker-btn-label'))
  assert.match(label.get('flex'), /^1 1 auto/, 'the name must be the one that gives width')
  assert.equal(label.get('min-width'), '0', 'otherwise it refuses to shrink below its content')
  assert.match(label.get('text-overflow'), /ellipsis/, 'a continuous, character-by-character shrink')
})

test('the effort word never shrinks and leaves last', () => {
  const effort = declarations(rule('dsh003-picker-btn-effort'))
  assert.match(effort.get('flex'), /^0 0 auto/, 'the effort word is the last thing to go')
  assert.match(effort.get('transition'), /opacity/, 'leaving must be a fade, not a pop')
})

test('the chevron collapses on a data attribute, not on a width query', () => {
  const chev = /data-compact-chev="true"\] \.dsh003-picker-chev \{([\s\S]*?)\n\}/.exec(css)?.[1]
  assert.ok(chev !== undefined, 'the chevron collapse must be driven by data-compact-chev')
  assert.match(chev, /width: 0/, 'a collapsed icon takes no space')
  assert.match(chev, /margin-left: -4px/,
    'a zero-width flex item still keeps its gaps; the negative margin cancels them')
  assert.match(chev, /opacity: 0/)
})

test('the effort word gives way through a fade, not display:none', () => {
  const handover = /data-meter="true"\] \.dsh003-picker-btn-effort \{([\s\S]*?)\n\}/.exec(css)?.[1]
  assert.ok(handover !== undefined, 'a data-meter rule must hand the word over')
  assert.match(handover, /opacity: 0/, 'the word fades out')
  assert.match(handover, /position: absolute/, 'out of flow, so it gives back its width AND its gaps')
  assert.ok(!/display: none/.test(handover), 'display:none cannot be transitioned')
  const meter = /data-meter="true"\] \.dsh003-picker-effort-meter \{([\s\S]*?)\n\}/.exec(css)?.[1]
  assert.ok(meter !== undefined)
  assert.match(meter, /display: block/, 'the meter appears at the same moment')
})

test('the meter is hidden by default and revealed by the handover', () => {
  // 基础规则必须排在让位规则**之前**：同特异性同 !important，后者胜出。
  // 曾经排反了，基础 display:none 把 display:block 整个盖掉，竖条永远不出现。
  const base = css.indexOf('.dsh003-picker-effort-meter {')
  const handover = css.indexOf('[data-meter="true"] .dsh003-picker-effort-meter')
  assert.ok(base > 0 && handover > 0)
  assert.ok(base < handover, 'the base display:none would override the handover if placed after')
  assert.match(rule('dsh003-picker-effort-meter'), /display: none/)
})

test('every probe measures a real thing and never collapses', () => {
  // 抖动事故的防线：量宽元素必须绝对定位 + visibility:hidden，
  // 且永不参与折叠。若让被测元素自己隐藏，下一次量到 0，判定翻转、每帧抖动。
  const probe = rule('dsh003-picker-probe')
  assert.match(probe, /position: absolute/, 'out of flow so it cannot shift the button')
  assert.match(probe, /visibility: hidden/, 'invisible but still laid out, so widths are readable')
  assert.ok(!/display: none/.test(probe), 'display:none would make the widths unreadable')
  // 四根探针各自的尺寸必须与真实元素一致，否则量出来的不是真实需求。
  assert.match(rule('dsh003-picker-logo-probe'), /width: 16px/)
  assert.match(rule('dsh003-picker-meter-probe'), /width: 3px/)
})

test('the probes are clipped so they cannot widen the composer', () => {
  const box = rule('dsh003-picker-probes')
  assert.match(box, /position: absolute/)
  assert.match(box, /width: 0/)
  assert.match(box, /overflow: hidden/)
})

test('the meter sits below the 16px logo in visual weight', () => {
  const meter = rule('dsh003-picker-effort-meter')
  assert.match(meter, /width: 3px/)
  assert.match(meter, /height: 12px/)
  assert.match(meter, /border-radius: 999px/)
})

test('the meter fill grows from the bottom in the theme accent', () => {
  const fill = rule('dsh003-picker-effort-meter-fill')
  assert.match(fill, /bottom: 0/, 'a thermometer fills upward')
  assert.match(fill, /--dsw-static-deepseek-400/, 'the theme accent, matching the slider max tick')
  assert.ok(!/success|green/i.test(fill), 'green means running or succeeded in this product, not effort')
})

test('an off effort keeps the empty track so it stays distinct from no reasoning at all', () => {
  assert.match(css, /effort-meter\[data-empty="true"\][\s\S]{0,120}display: none/,
    'only the fill disappears; the track remains')
})

test('the retry button is a real, focusable control', () => {
  // 失败行的重试是唯一的就地恢复入口；它必须看起来可点、键盘可达。
  const retry = rule('dsh003-picker-retry')
  assert.match(retry, /cursor: pointer/)
  assert.match(retry, /text-decoration: underline/, 'a text button needs an affordance')
  assert.match(css, /dsh003-picker-retry:focus-visible[\s\S]{0,120}box-shadow/,
    'keyboard users must see where focus is')
  assert.match(retry, /margin-left: auto/, 'the reason keeps the space; the action sits at the end')
  // 失败行本身要能横排放下「原因 + 重试」。
  assert.match(rule('dsh003-picker-notice'), /display: flex/)
})

test('a model name too narrow to read is dropped whole, not truncated to one letter', () => {
  // 只够一个字符时屏幕上是「V.…」：读不出信息，还比图标宽，看起来像坏了。
  const drop = /data-compact-label="true"\] \.dsh003-picker-btn-label \{([\s\S]*?)\n\}/.exec(css)?.[1]
  assert.ok(drop !== undefined, 'the label must have a whole-drop state')
  assert.match(drop, /opacity: 0/)
  assert.match(drop, /position: absolute/, 'out of flow, so it stops widening the button')
  assert.ok(!/display: none/.test(drop), 'display:none cannot be transitioned')
})
