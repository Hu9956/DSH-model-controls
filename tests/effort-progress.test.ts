import { test } from 'node:test'
import assert from 'node:assert/strict'
import { effortKeyOf, effortProgress } from '../src/client/effort-labels'

/**
 * 按钮上那根竖条的填充比例（0–1）。
 *
 * 参照 ZCode 的 composer-thought-meter：用「第几档 / 总档数」，让最低的有效档
 * 也占到一格，竖条不会矮到看不见。与它不同的是关闭档的处理——`off` 表示不思考，
 * 画成有强度的样子会误导，因此为 0（只剩空轨道），且不占分母。
 */

test('a three-level model fills one third per step and tops out at full', () => {
  const ids = ['low', 'medium', 'high']
  assert.equal(effortProgress(ids, 'low'), 1 / 3)
  assert.equal(effortProgress(ids, 'medium'), 2 / 3)
  assert.equal(effortProgress(ids, 'high'), 1)
})

test('the weakest level is never zero, so the bar stays visible', () => {
  // 这正是 ZCode 用 (index+1)/n 而不是 index/(n-1) 的原因。
  assert.ok(effortProgress(['low', 'high'], 'low') > 0)
  assert.equal(effortProgress(['low', 'high'], 'low'), 0.5)
})

test('off shows an empty track and does not consume a strength step', () => {
  // 3 个档位里有 1 个是 off：强度档只剩 low/high，high 仍然满格。
  const ids = ['off', 'low', 'high']
  assert.equal(effortProgress(ids, 'off'), 0, 'off must read as no thinking, not as a weak level')
  assert.equal(effortProgress(ids, 'low'), 0.5)
  assert.equal(effortProgress(ids, 'high'), 1)
})

test('an all-off model has no strength to show', () => {
  assert.equal(effortProgress(['off'], 'off'), 0)
})

test('unknown and missing efforts fall back to an empty bar', () => {
  assert.equal(effortProgress(['low', 'high'], undefined), 0)
  assert.equal(effortProgress(['low', 'high'], 'nonsense'), 0)
})

test('matching ignores case, spaces, underscores and hyphens', () => {
  // 归一化是为了容忍写法差异：宿主在同一次会话里可能给出 'Extra High' / 'extra_high'。
  assert.equal(effortProgress(['Extra_High', 'Max'], 'extra-high'), 0.5)
  assert.equal(effortProgress(['Extra_High', 'Max'], 'EXTRA HIGH'), 0.5)
  assert.equal(effortProgress(['extra high', 'max'], 'Max'), 1)
})

test('every spelling of "do not think" reads as an empty track', () => {
  // 上游各家对关闭态的写法不统一。少认一个就会把关闭态画成有强度——
  // 那是显示错误，不是外观差异。清单照 ZCode 的 8 个取（归一化后 6 个）。
  const spellings = ['off', 'none', 'disabled', 'false', 'no', 'nothink', 'no-think', 'no_think', 'Off', 'NONE', 'No Think']
  for (const spelling of spellings) {
    assert.equal(effortProgress([spelling, 'low', 'high'], spelling), 0,
      `${spelling} must read as no thinking`)
  }
})

test('a disabled-style off level does not consume a strength step', () => {
  // 关闭档不占分母：剩下的 low/high 里 high 仍然满格。
  const ids = ['disabled', 'low', 'high']
  assert.equal(effortProgress(ids, 'low'), 0.5)
  assert.equal(effortProgress(ids, 'high'), 1)
})

test('a model whose every level is a form of off shows nothing', () => {
  assert.equal(effortProgress(['off', 'none'], 'none'), 0)
  assert.equal(effortProgress(['no_think'], 'no_think'), 0)
})

test('the button shows a localised name for every off spelling', () => {
  // 不映射的话，按钮会原样回显 `disabled` / `no_think` 这类上游 id，
  // 而中文界面其它档位都已是「低 / 中 / 高」，看起来像漏翻译。
  for (const spelling of ['off', 'none', 'disabled', 'false', 'no', 'no_think', 'NO-THINK']) {
    assert.equal(effortKeyOf(spelling), 'effortOff', `${spelling} must map to the off label`)
  }
  assert.equal(effortKeyOf('xhigh'), 'effortXHigh')
  assert.equal(effortKeyOf('somethingelse'), undefined, 'unknown levels still fall back to the host name')
})
