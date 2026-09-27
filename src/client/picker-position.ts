/** Keep the menu beside its trigger and inside the viewport without changing its normal size. */
export function pickerPosition(rect: Pick<DOMRect, 'top' | 'bottom' | 'right'>, width: number, height: number) {
  const inset = 8
  const gap = 4
  const panelWidth = Math.min(320, Math.max(0, width - inset * 2))
  const right = Math.max(inset, Math.min(width - rect.right, width - panelWidth - inset))
  const clamp = (value: number) => Math.max(inset, Math.min(value, Math.max(inset, height - inset)))
  const bottom = clamp(height - rect.top + gap)
  const top = clamp(rect.bottom + gap)
  const above = Math.max(0, height - bottom - inset)
  const below = Math.max(0, height - top - inset)
  if (above >= 360 || above >= below) return { right, bottom, maxHeight: Math.min(360, above) }
  return { right, top, maxHeight: Math.min(360, below) }
}
