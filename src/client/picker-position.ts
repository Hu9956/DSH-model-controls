/**
 * 把面板放在触发按钮旁，并保证不超出视口、不改变正常尺寸。
 *
 * 水平方向两种策略：
 * - **面板窄于半个视口**（桌面、iPad）：右缘对齐按钮右缘，向左展开。官方入口在
 *   右侧，这样面板正好压住按钮上方，视线不用横跳。
 * - **面板宽于半个视口**（手机）：在视口内水平居中。
 *
 * 为什么手机要单独处理：393px 宽的手机上面板是 320px，右缘对齐按钮后左缘会算到
 * −38px，只能被推回 8px，结果左边空 8px、右边空 65px——肉眼就是「贴在左边」。
 * 面板已经占了八成宽度，「贴按钮」只剩几十像素的差别，却把整个浮层挤到一侧，
 * 不如居中。
 */
export function pickerPosition(rect: Pick<DOMRect, 'top' | 'bottom' | 'right'>, width: number, height: number) {
  const inset = 8
  const gap = 4
  const panelWidth = Math.min(320, Math.max(0, width - inset * 2))

  // 面板用 `right` 定位：right 越大，面板越靠左。
  const minRight = inset // 面板右缘贴右边距
  const maxRight = width - panelWidth - inset // 面板左缘贴左边距
  const clampX = (value: number) => Math.max(minRight, Math.min(value, Math.max(minRight, maxRight)))

  const alignedRight = width - rect.right // 右缘对齐按钮右缘
  const centeredRight = (width - panelWidth) / 2 // 左右留白相等
  const right = panelWidth * 2 >= width ? clampX(centeredRight) : clampX(alignedRight)

  const clamp = (value: number) => Math.max(inset, Math.min(value, Math.max(inset, height - inset)))
  const bottom = clamp(height - rect.top + gap)
  const top = clamp(rect.bottom + gap)
  const above = Math.max(0, height - bottom - inset)
  const below = Math.max(0, height - top - inset)
  if (above >= 360 || above >= below) return { right, bottom, maxHeight: Math.min(360, above) }
  return { right, top, maxHeight: Math.min(360, below) }
}
