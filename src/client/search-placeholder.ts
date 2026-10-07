/**
 * The search box's placeholder: name the provider being browsed without ever
 * dropping the name silently — a provider whose name vanished would read as a
 * broken box, not as a shorter one.
 */

/** Neutral copy, also the input's fixed accessible name. */
export const NEUTRAL_PLACEHOLDER = '搜索模型…'

/** Cross-provider view: naming one provider here would misstate the scope. */
const FAVORITES_PLACEHOLDER = '搜索收藏模型…'

/**
 * Name budget in half-width units (one Latin character ≈ 1, one CJK ≈ 2),
 * measured from the panel: 320px panel − 52px provider rail − 16px row padding
 * − 48px input padding = 204px of text at 12px, minus the fixed words around
 * the name, with a unit of slack. The trailing `…` costs one unit.
 */
const NAME_UNITS_WITH_SUFFIX = 21
const NAME_UNITS_WITHOUT_SUFFIX = 24

/** Display width of one code point, in half-width units. */
function unitsOf(codePoint: number): number {
  // CJK, kana, hangul and fullwidth forms render at about twice a Latin glyph.
  return codePoint >= 0x2e80 && codePoint <= 0xffef ? 2 : 1
}

function widthOf(text: string): number {
  let total = 0
  for (const character of text) total += unitsOf(character.codePointAt(0) ?? 0)
  return total
}

/** Keep the leading code points that fit the budget, marking the cut. */
function clip(text: string, budget: number): string {
  let kept = ''
  let used = 0
  for (const character of text) {
    const units = unitsOf(character.codePointAt(0) ?? 0)
    if (used + units > budget) break
    kept += character
    used += units
  }
  return `${kept.trimEnd()}…`
}

/**
 * Build the search box's placeholder for the current view.
 * @param favorites - whether the cross-provider favourites view is showing.
 * @param providerName - the browsed provider's display name, when one is active.
 * @returns the placeholder; the provider name is always present when there is one.
 */
export function searchPlaceholder(favorites: boolean, providerName: string | undefined): string {
  if (favorites) return FAVORITES_PLACEHOLDER
  const name = providerName?.trim() ?? ''
  if (name === '') return NEUTRAL_PLACEHOLDER
  const width = widthOf(name)
  if (width <= NAME_UNITS_WITH_SUFFIX) return `搜索 ${name} 模型…`
  if (width <= NAME_UNITS_WITHOUT_SUFFIX) return `搜索 ${name}…`
  // Leave one unit for the ellipsis itself.
  return `搜索 ${clip(name, NAME_UNITS_WITHOUT_SUFFIX - 1)}`
}
