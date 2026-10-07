import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/**
 * 搜索框图标的左右间距要**看起来**相等。
 *
 * 不能靠"盒子上的数字相等"来判断：图标墨迹不占满自己的 14px 盒，占位文字的字形
 * 也自带左侧留白。下面三个常量是 2026-10-07 在应用里逐像素量出来的（原图 2x，
 * 已换算为逻辑像素）；换字体、换图标或换主题后必须重量，届时这条会失败并提醒。
 */
const ICON_INK_LEFT = 1.5      // 图标盒左缘 → 图标墨迹左缘
const ICON_INK_RIGHT = 12.0    // 图标盒左缘 → 图标墨迹右缘
const TEXT_INK_BEARING = 1.5   // 文字原点 → 占位文字墨迹左缘

/** 从源码读出图标偏移、图标宽度与输入框左内边距。 */
function geometry() {
  const css = readFileSync(new URL('../src/client/picker.css.ts', import.meta.url), 'utf8')
  const panel = readFileSync(new URL('../src/client/ModelPickerPanel.tsx', import.meta.url), 'utf8')
  const iconBlock = /\.dsh003-picker-search-icon \{([\s\S]*?)\n\}/.exec(css)?.[1]
  const searchBlock = /\.dsh003-picker-search \{([\s\S]*?)\n\}/.exec(css)?.[1]
  assert.ok(iconBlock && searchBlock, 'the search icon and input rules must exist')
  return {
    inset: Number(/left: ([\d.]+)px/.exec(iconBlock)?.[1]),
    paddingLeft: Number(/padding: 0 [\d.]+px 0 ([\d.]+)px/.exec(searchBlock)?.[1]),
    iconWidth: Number(/function SearchIcon[\s\S]*?width=\{([\d.]+)\}/.exec(panel)?.[1]),
  }
}

test('the two visible gaps around the search icon are equal', () => {
  const { inset, paddingLeft, iconWidth } = geometry()
  assert.ok(Number.isFinite(inset) && Number.isFinite(paddingLeft) && Number.isFinite(iconWidth),
    `could not read the geometry: inset=${inset} paddingLeft=${paddingLeft} iconWidth=${iconWidth}`)
  const iconInkLeft = inset + ICON_INK_LEFT
  const iconInkRight = inset + ICON_INK_RIGHT
  const textInkLeft = paddingLeft + TEXT_INK_BEARING
  assert.ok(iconInkRight <= inset + iconWidth,
    `the icon's measured ink (${ICON_INK_RIGHT}px) must fit its ${iconWidth}px box`)
  assert.equal(textInkLeft - iconInkRight, iconInkLeft,
    `visible gaps must match: left ${iconInkLeft}px vs right ${(textInkLeft - iconInkRight).toFixed(2)}px`
    + ' — re-measure ICON_INK_* / TEXT_INK_BEARING in the app after changing the icon, the font or either value')
})
