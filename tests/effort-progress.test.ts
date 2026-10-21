import { test } from 'node:test'
import assert from 'node:assert/strict'
import { effortKeyOf, effortMeterHeight, effortProgress } from '../src/client/effort-labels'

/**
 * 竖条的填充比例。
 *
 * **必须与面板滑杆同一套刻度**：`第几档 / (档数 − 1)`，最低档 0%、最高档 100%。
 *
 * 曾经用 ZCode 的「(第几档 + 1) / 总档数」，理由是让最低档也占一格、竖条不至
 * 看不见。但面板滑杆用的是 `第几档 / (档数 − 1)`，两套并存时同一个模型在两处
 * 差一档：3 档模型里「中」在滑杆上 50%、竖条上 67%，「低」滑杆 0%、竖条 33%。
 * 用户看到的就是「中等快满了、低档还有三成」。
 *
 * 最低档看不见的问题改为在**绘制层**解决（{@link effortMeterHeight}），
 * 刻度本身保持与滑杆一致。
 */

/** 与面板滑杆一致的刻度：i / (n − 1)。 */
const sliderRatio = (index, count) => (count > 1 ? index / (count - 1) : 0)

test('the meter uses the same scale as the panel slider', () => {
  // 这是本次修正的核心：两处必须给出同一个比例，否则眼睛一比较就发现对不上。
  const cases = [
    ['low', 'medium', 'high'],
    ['low', 'high'],
    ['minimal', 'low', 'medium', 'high', 'max'],
  ]
  for (const ids of cases) {
    ids.forEach((id, index) => {
      assert.equal(effortProgress(ids, id), sliderRatio(index, ids.length),
        `${ids.join('/')} at ${id}: the meter must match the slider`)
    })
  }
})

test('a three-level model steps 0 / 50 / 100 percent', () => {
  const ids = ['low', 'medium', 'high']
  assert.equal(effortProgress(ids, 'low'), 0)
  assert.equal(effortProgress(ids, 'medium'), 0.5)
  assert.equal(effortProgress(ids, 'high'), 1)
})

test('off shows an empty track and does not consume a strength step', () => {
  // 3 个档位里有 1 个是 off：强度档只剩 low/high，high 仍然满格。
  const ids = ['off', 'low', 'high']
  assert.equal(effortProgress(ids, 'off'), 0, 'off must read as no thinking, not as a weak level')
  assert.equal(effortProgress(ids, 'low'), 0)
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
  assert.equal(effortProgress(['Extra_High', 'Max'], 'extra-high'), 0)
  assert.equal(effortProgress(['Extra_High', 'Max'], 'EXTRA HIGH'), 0)
  assert.equal(effortProgress(['extra high', 'max'], 'Max'), 1)
})

test('every spelling of "do not think" reads as an empty track', () => {
  // 上游各家对关闭态的写法不统一。少认一个就会把关闭态画成有强度——
  // 那是显示错误，不是外观差异。清单照 ZCode 的 8 个取（归一化后 6 个）。
  const spellings = ['off', 'none', 'disabled', 'false', 'no', 'nothink', 'no-think', 'no_think', 'Off', 'NONE', 'No Think']
  for (const spelling of spellings) {
    assert.equal(effortProgress([spelling, 'low', 'high'], spelling), 0,
      `${spelling} must read as no thinking`)
    assert.equal(effortMeterHeight([spelling, 'low', 'high'], spelling), 0,
      `${spelling} must draw nothing, not a minimum stub`)
  }
})

test('a disabled-style off level does not consume a strength step', () => {
  const ids = ['disabled', 'low', 'high']
  assert.equal(effortProgress(ids, 'low'), 0)
  assert.equal(effortProgress(ids, 'high'), 1)
})

test('a model whose every level is a form of off shows nothing', () => {
  assert.equal(effortProgress(['off', 'none'], 'none'), 0)
  assert.equal(effortProgress(['no_think'], 'no_think'), 0)
  assert.equal(effortMeterHeight(['off', 'none'], 'none'), 0)
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

test('the drawn height lifts only the weakest level above zero', () => {
  // 刻度与滑杆一致（最低档 0），但 12px 高的竖条分不出 0 与「关闭」，
  // 所以绘制时把最低的有效档抬到可见高度。只抬最弱那一档。
  const ids = ['low', 'medium', 'high']
  assert.ok(effortMeterHeight(ids, 'low') > 0, 'the weakest level must be visible')
  assert.equal(effortMeterHeight(ids, 'medium'), 0.5, 'other levels keep the slider scale')
  assert.equal(effortMeterHeight(ids, 'high'), 1)
})

test('the drawn height never reorders the levels', () => {
  // 抬升不能把某一档画得比更强的档还高。
  const ids = ['low', 'medium', 'high']
  const heights = ids.map(id => effortMeterHeight(ids, id))
  for (let i = 1; i < heights.length; i += 1) {
    assert.ok(heights[i] > heights[i - 1],
      `level ${ids[i]} must draw taller than ${ids[i - 1]} (${heights.join(', ')})`)
  }
})

test('the drawn height keeps off and the weakest level distinguishable', () => {
  // 这是抬升的唯一目的：关闭态必须是空轨道，最低档必须看得见，两者不能一样。
  const ids = ['off', 'low', 'high']
  assert.equal(effortMeterHeight(ids, 'off'), 0, 'off draws nothing')
  assert.ok(effortMeterHeight(ids, 'low') > 0, 'the weakest on-level draws something')
})

test('a single-level model draws full rather than nothing', () => {
  // 只有一档时没有「进度」可言；画 0 会看起来像关闭。
  assert.equal(effortMeterHeight(['high'], 'high'), 1)
})
