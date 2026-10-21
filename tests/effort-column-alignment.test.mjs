import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/**
 * 底栏「思考深度 / 档位名」的对齐不变量。
 *
 * 这一栏是两行文字堆叠：标签（11px）在上、当前档位（13px）在下。
 * 档位名通常只有一两个字（中文「高」13px），若两行左对齐，值会贴在列最左、
 * 右侧空出一大截；若给列加 min-width 再用居中平分，中文标签会被推离内容左缘，
 * 而英文标签本就撑满列、不移动——同一份代码在两种语言下基线不同（实测差 6px）。
 *
 * 定下的做法：列宽不设 min-width，严格由标签决定；两行围绕列中轴居中。
 * 前提是**标签在所有语言下都是最宽的一行**，档位名不会把列撑宽、让滑杆跳动。
 * 下面两条断言守住这两件事。
 */
const css = readFileSync(new URL('../src/client/picker.css.ts', import.meta.url), 'utf8')

/** 取一条规则的声明块。 */
function rule(selector) {
  const block = new RegExp(`\\.${selector} \\{([\\s\\S]*?)\\n\\}`).exec(css)?.[1]
  assert.ok(block !== undefined, `.${selector} must exist`)
  return block
}

test('the effort column takes its width from the label, never a fixed minimum', () => {
  const info = rule('dsh003-picker-foot-info')
  assert.ok(!/min-width/.test(info),
    'a min-width would let the label drift away from the content edge in narrow languages')
  assert.ok(!/\bwidth:/.test(info), 'the column must size to its label')
  assert.match(info, /align-items: center/, 'both lines must share one centre axis')
  assert.match(info, /text-align: center/)
})

test('the empty state that replaces the column follows the same geometry', () => {
  const empty = rule('dsh003-picker-slider-empty')
  assert.match(empty, /align-items: center/)
  assert.match(empty, /text-align: center/)
  assert.ok(!/min-width/.test(empty), 'the empty state must not reintroduce a fixed minimum')
})
