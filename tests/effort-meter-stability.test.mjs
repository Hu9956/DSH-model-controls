import { test } from 'node:test'
import assert from 'node:assert/strict'

/**
 * 折叠判定的纯逻辑模型：照抄 `use-effort-truncation.ts` 的决策顺序，
 * 用穷举验证它的**不变量**。
 *
 * 依据是 ZCode 的行为：档位文字不跟模型名抢最后几个像素，而是在
 * 按钮还剩一百多像素时就换成竖条。固定信息（模型名）优先，
 * 可替代信息（档位）按断点让位。
 *
 * 任何一条不变量被破坏，用户看到的就是抖动，或「该切的不切 / 不该切的切了」。
 */

/** 换竖条的断点（按钮可用宽度），对应 ZCode 在 composer 576px 让位。 */
const EFFORT_BREAKPOINT = 150

/** 模型名至少留一个汉字宽，仅用于「还能不能再加一项」的判断。 */
const MIN_LABEL_ROOM = 12

/**
 * 真实档位文字的排版宽度（13px 字号实测）：
 * 中文 「关/最低/低/中/高/最高/最大」≈ 13–26px；英文 Off/Minimal/Low/Medium/High/Max ≈ 20–40px，
 * 最长是 Extra high ≈ 62px。只有这些真实值才应该参与判定。
 */
const REAL_EFFORT_WIDTHS = [13, 20, 26, 33, 40, 53, 62]

/**
 * 决定折叠级别。
 * @param available 按钮可用宽度（实测值）
 * @param parts 固定部分与各项宽度（实测值）
 * @returns 0=常态 1=收箭头 2=换竖条
 */
function decide(available, parts) {
  const { padding, logo, gap, effort, chevron, meter, hasEffort } = parts
  const base = padding + logo
  const showMeter = hasEffort && available < EFFORT_BREAKPOINT
  const tail = showMeter ? meter : (hasEffort ? effort : 0)
  const neededWithChevron = base + gap * 3 + tail + chevron + MIN_LABEL_ROOM
  const compactChevron = neededWithChevron > available
  if (showMeter) return 2
  if (compactChevron) return 1
  return 0
}

/** 真实量级：16px logo、4px 间距、12px 内边距、14px 箭头、3px 竖条。 */
const parts = (effort, overrides = {}) => ({
  padding: 12, logo: 16, gap: 4, effort, chevron: 14, meter: 3, hasEffort: true, ...overrides,
})

test('the effort word yields at the breakpoint, long before it runs out of room', () => {
  // 这是本次修正的核心：ZCode 在按钮还有一百多像素时就换竖条，
  // 而不是等到模型名被省略号吃光。150px 断点是分水岭。
  for (const effort of REAL_EFFORT_WIDTHS) {
    assert.equal(decide(149, parts(effort)), 2, 'below the breakpoint the word is gone and the meter shows')
    // 断点之上必须能完整显示（含箭头），否则刚回到文字态就又放不下——
    // 那正是抖动的来源。所以断点必须 ≥ 最宽真实档位所需的 128px。
    assert.equal(decide(150, parts(effort)), 0, 'at the breakpoint the word stays, with the chevron')
  }
})

test('the collapse level only ever increases as the button narrows', () => {
  for (const effort of REAL_EFFORT_WIDTHS) {
    let previous = 0
    for (let available = 400; available >= 20; available -= 0.5) {
      const level = decide(available, parts(effort))
      assert.ok(level >= previous,
        `effort ${effort}: level dropped from ${previous} to ${level} at ${available}px`)
      previous = level
    }
  }
})

test('the meter takes over exactly once, and widening undoes it exactly', () => {
  for (const effort of REAL_EFFORT_WIDTHS) {
    const down = []
    for (let available = 400; available >= 20; available -= 1) down.push(decide(available, parts(effort)))
    const up = []
    for (let available = 20; available <= 400; available += 1) up.push(decide(available, parts(effort)))
    assert.deepEqual(up, [...down].reverse(), `effort ${effort}: widening must undo narrowing exactly`)
    // 层级序列里 2 只应出现一段连续区间。
    const twos = down.filter(level => level === 2).length
    const firstTwo = down.indexOf(2)
    assert.ok(down.slice(firstTwo).every(level => level === 2),
      `effort ${effort}: the meter level must be one contiguous band, got ${twos} entries`)
  }
})

test('the breakpoint is wide enough for the widest real effort word', () => {
  // 断点若窄于「最宽档位 + 箭头 + 固定占位」，英文界面会一进文字态就又放不下，
  // 表现为刚显示就跳回竖条。这是 0.2.23 选 130px 时踩过的坑。
  const widest = Math.max(...REAL_EFFORT_WIDTHS)
  const needed = parts(0).padding + parts(0).logo + parts(0).gap * 3 + widest + parts(0).chevron + MIN_LABEL_ROOM
  assert.ok(EFFORT_BREAKPOINT >= needed,
    `the breakpoint ${EFFORT_BREAKPOINT} must cover the widest real word (${widest}px needs ${needed}px)`)
})

test('the breakpoint does not depend on how wide the effort word is', () => {
  // ZCode 的断点是容器宽度，与档位文字长短无关。若这里让更长的文字更早切换，
  // 就会出现「切到别的模型时按钮突然变宽」的跳动。
  const switchPoint = effort => {
    for (let available = 20; available <= 400; available += 0.5) {
      if (decide(available, parts(effort)) < 2) return available
    }
    return Infinity
  }
  const points = REAL_EFFORT_WIDTHS.map(switchPoint)
  for (const point of points) {
    assert.equal(point, EFFORT_BREAKPOINT, 'every effort word must hand over at the same width')
  }
})

test('a model with no effort never shows a meter', () => {
  for (let available = 20; available <= 400; available += 1) {
    const level = decide(available, parts(0, { hasEffort: false }))
    assert.ok(level === 0 || level === 1, 'no effort means no meter level')
  }
})

test('the chevron collapses only when even the meter no longer fits', () => {
  // 箭头是最后一个让位的装饰，且只在真的放不下时收——
  // 否则会出现「按钮还挺宽，箭头却没了」。
  const p = parts(26)
  const fitsWithChevron = p.padding + p.logo + p.gap * 3 + p.meter + p.chevron + MIN_LABEL_ROOM
  assert.equal(decide(fitsWithChevron, p), 2, 'at exactly enough room the chevron stays')
  assert.equal(decide(fitsWithChevron - 1, p), 2, 'level stays 2 either way: the word is already gone')
})
