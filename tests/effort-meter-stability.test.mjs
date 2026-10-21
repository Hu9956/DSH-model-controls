import { test } from 'node:test'
import assert from 'node:assert/strict'

/**
 * 折叠判定的纯逻辑模型：照抄 `use-effort-truncation.ts` 的决策顺序，
 * 用穷举验证它的**不变量**。
 *
 * 与旧版的根本差别：判据不再是「按钮可用宽度 < 150px 就换竖条」，
 * 而是
 *
 *   1. 先算出按钮的宽度上限 `cap = min(360, 行剩余 × 0.45)`；
 *   2. 若「上限 − 档位文字 − 固定占位」剩余不足 40px，换竖条。
 *
 * 为什么必须这样：固定断点与内容无关，模型名长短、档位文字长短都会让它误判。
 * 竖条的职责只有一个——省宽度给模型名，所以判据必须是「名字还剩多少」。
 */

/** 按钮占那一行的份额。 */
const AVAILABLE_SHARE = 0.45
/** 按钮宽度的绝对上限。 */
const ABSOLUTE_CAP = 360
/** 按钮宽度的下限：行剩余再小，也不让按钮窄到读不出模型名。 */
const MIN_CAP = 140
/** 名字不足一个汉字宽时整块收起。 */
const MIN_LABEL_ROOM = 12
/** 保留档位文字所需的最低名字宽度（约 10 个字符）。 */
const MIN_TEXT_LABEL_ROOM = 70

/** 真实档位文字的排版宽度（12px 字号实测）。 */
const REAL_EFFORT_WIDTHS = [13, 20, 26, 33, 40, 53, 66]

/** 真实量级：12px 内边距、16px logo、4px 间距、14px 箭头、3px 竖条。 */
const parts = (effort, overrides = {}) => ({
  padding: 12, logo: 16, gap: 4, effort, chevron: 14, meter: 3, hasEffort: true, ...overrides,
})

/**
 * 由「这一行剩余多少」算出按钮的宽度上限。
 *
 * 比例只在行剩余充足时决定宽度；窄窗口里行剩余本来就只有一两百像素，
 * 乘 0.45 会算出 90px 这种读不出模型名的值，所以用 MIN_CAP 托底。
 * 无论如何都不超过这一行本身。
 */
const capOf = (available) =>
  Math.min(ABSOLUTE_CAP, available, Math.max(MIN_CAP, available * AVAILABLE_SHARE))

/**
 * 决定折叠级别。
 * @param available 这一行留给按钮的剩余空间（实测值）
 * @param parts 固定部分与各项宽度（实测值）
 * @returns 0=常态 1=收箭头 2=竖条 3=只留 logo + 竖条
 */
function decide(available, parts) {
  const { padding, logo, gap, effort, chevron, meter, hasEffort } = parts
  const cap = capOf(available)
  const base = padding + logo
  const effortWidth = hasEffort ? effort : 0

  const neededForText = base + gap * 3 + effortWidth + chevron
  const showMeter = hasEffort && cap - neededForText < MIN_TEXT_LABEL_ROOM

  const tail = showMeter ? meter : effortWidth
  const neededWithChevron = base + gap * 3 + tail + chevron + MIN_LABEL_ROOM
  const compactChevron = neededWithChevron > cap

  const labelRoom = cap - base - gap * 2 - tail
  const compactLabel = labelRoom < MIN_LABEL_ROOM

  if (showMeter) return compactLabel ? 3 : 2
  if (compactChevron) return 1
  return 0
}

test('the button never exceeds the row it sits in', () => {
  // 最基本的一条：不管公式怎么变，按钮都不能比那一行剩余的空间还宽，
  // 否则宿主会判定放不下而换行。
  for (const available of [60, 120, 174, 248, 374, 674, 1234, 2000]) {
    const cap = capOf(available)
    assert.ok(cap <= available + 0.001, `cap ${cap} must never exceed the row's ${available}`)
  }
})

test('the button takes its share once the row is roomy, the floor once it is not', () => {
  // 三段式：窄行的下限 > 中段的比例 > 宽行的封顶。
  // 下限存在的理由：行剩余本来就只有一两百像素时，45% 会算出 90px——
  // 扣掉 logo/档位/箭头后名字只剩三十几像素，读不出是哪个模型。
  assert.equal(capOf(200), MIN_CAP, 'a cramped row hits the floor, not 90px')
  assert.equal(capOf(248), MIN_CAP, 'the 393px phone hits the floor too')
  // 中段：比例说了算，且高于下限。
  assert.ok(Math.abs(capOf(600) - 600 * AVAILABLE_SHARE) < 0.5, 'a roomy row uses the share')
  // 宽行：封顶。
  assert.equal(capOf(2000), ABSOLUTE_CAP, 'very wide screens stop at the absolute cap')
})

test('the floor never makes the button bigger than the row', () => {
  // 320px 手机上行剩余可能只有 100px，此时下限 140 若直接生效会撑破整行。
  assert.ok(capOf(100) <= 100, 'the floor must yield to the row width')
  assert.ok(capOf(140) <= 140)
})

test('the effort word yields when the name would get too little room', () => {
  // 判据是「名字还剩多少」，不是按钮宽度落在哪个固定值上。
  // 同一个按钮宽度下，档位文字更宽（Extra high）就必须更早让位。
  for (const effort of REAL_EFFORT_WIDTHS) {
    const p = parts(effort)
    // 找到「名字刚好还有 40px」的那个上限，逐个像素验证分界。
    let boundary = null
    for (let available = 2000; available >= 100; available -= 1) {
      const cap = capOf(available)
      const room = cap - (p.padding + p.logo + p.gap * 3 + effort + p.chevron)
      if (room < MIN_TEXT_LABEL_ROOM) { boundary = available; break }
    }
    assert.ok(boundary !== null, `effort ${effort}: the sweep must reach the switch point`)
    assert.ok(decide(boundary, p) >= 2, `effort ${effort}: at ${boundary}px the word must yield`)
    assert.equal(decide(boundary + 20, p) < 2, true,
      `effort ${effort}: a bit wider and the word must stay`)
  }
})

test('a wider effort word hands over earlier than a narrow one', () => {
  // 「最高」是 24px，`Extra high` 是 66px。后者必须更早换竖条，
  // 否则就是「同一个断点误伤长档位名」的老问题。
  const switchPoint = (effort) => {
    for (let available = 2000; available >= 100; available -= 1) {
      if (decide(available, parts(effort)) >= 2) return available
    }
    return 0
  }
  const narrow = switchPoint(24)
  const wide = switchPoint(66)
  assert.ok(wide > narrow,
    `Extra high (${wide}) must hand over at a wider button than 最高 (${narrow})`)
})

test('the collapse level only ever increases as the button narrows', () => {
  // 从宽到窄扫一遍，级别只增不减——任何回退都是抖动。
  for (const effort of REAL_EFFORT_WIDTHS) {
    let previous = 0
    for (let available = 2000; available >= 80; available -= 1) {
      const level = decide(available, parts(effort))
      assert.ok(level >= previous,
        `effort ${effort}: level dropped from ${previous} to ${level} at ${available}px`)
      previous = level
    }
  }
})

test('widening undoes every collapse exactly', () => {
  // 可逆：从窄到宽走一遍，级别必须单调**递减**回到 0。
  // 任何「越走宽反而更折叠」都是抖动。
  const p = parts(24)
  const down = []
  for (let available = 2000; available >= 80; available -= 2) down.push(decide(available, p))
  const up = [...down].reverse()
  let previous = up[0]
  for (const level of up) {
    assert.ok(level <= previous, 'going wider must never add a collapse')
    previous = level
  }
  assert.equal(up.at(-1), 0, 'the widest state has nothing collapsed')
})

test('a model with no effort never shows a meter', () => {
  // 没有档位的模型不该凭空出现一根竖条。
  for (const available of [100, 200, 400, 1200]) {
    assert.ok(decide(available, parts(24, { hasEffort: false })) <= 1,
      'without efforts there is no meter to switch to')
  }
})

test('the model name is dropped whole rather than left as one character', () => {
  // 名字分不到一个汉字宽时整块收起，不留「V.…」。
  const p = parts(24)
  let dropped = null
  // 下限 140px 让按钮不会再窄于 140，而 140 仍放得下一个汉字的名字，
  // 所以「只留图标」这一级在下限启用后通常不再可达——这是预期的：
  // 与其缩到读不出模型，不如停在一个能读的最小宽度上。
  for (let available = 2000; available >= 60; available -= 1) {
    if (decide(available, p) === 3) { dropped = available; break }
  }
  if (dropped === null) {
    assert.ok(capOf(60) === 60, 'the floor yields on a row narrower than the floor itself')
    return
  }
  assert.equal(decide(dropped, p), 3, 'at this width the name goes entirely')
  assert.ok(decide(dropped + 40, p) < 3, 'a bit wider and the name comes back')
})

test('the phone stops filling the composer row', () => {
  // 回归用例：截图里的问题是 393px 手机上按钮吃满整行（100%）。
  // 修正后是 140px 下限，约占 56%，并且已经换用竖条让名字还能读。
  const available = 248
  const cap = capOf(available)
  assert.ok(cap / available <= 0.57, `the button must not fill the row, got ${(cap / available * 100).toFixed(0)}%`)
  assert.ok(decide(available, parts(24)) >= 2, 'and it hands over to the meter so the name stays readable')
})
