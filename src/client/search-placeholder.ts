/**
 * The search box's placeholder: name the provider being browsed without ever
 * dropping the name silently — a provider whose name vanished would read as a
 * broken box, not as a shorter one. Text is measured in half-width units so the
 * same rule holds in any language.
 */

import { format, pickerZh, type PickerKey, type Translate } from './locales'

/** The input's text area: 204px at 12px, where one Latin glyph ≈ 1 unit and one CJK ≈ 2. */
const TEXT_UNITS = 30

/** Fallback used when no locale service is bound (tests, or a host without one). */
const fallback: Translate<PickerKey> = (key, params) => format(pickerZh[key], params)

/** Neutral copy, also the input's accessible name. */
export const NEUTRAL_PLACEHOLDER = pickerZh.searchNeutral

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

/** Longest prefix of the name whose rendered line still fits, or '' when none does. */
function clipToFit(name: string, render: (candidate: string) => string): string {
  const characters = [...name]
  let best = ''
  for (let end = 1; end <= characters.length; end += 1) {
    const candidate = render(characters.slice(0, end).join(''))
    if (widthOf(candidate) > TEXT_UNITS) break
    best = candidate
  }
  return best
}

/**
 * Build the search box's placeholder for the current view.
 * @param favorites - whether the cross-provider favourites view is showing.
 * @param providerName - the browsed provider's display name, when one is active.
 * @param t - the picker's locale reader.
 * @returns the placeholder; the provider name is always present when there is one.
 */
export function searchPlaceholder(
  favorites: boolean,
  providerName: string | undefined,
  t: Translate<PickerKey> = fallback,
): string {
  if (favorites) return t('searchFavorites')
  const name = providerName?.trim() ?? ''
  if (name === '') return t('searchNeutral')
  const full = format(t('searchProvider'), { name })
  if (widthOf(full) <= TEXT_UNITS) return full
  // Dropping the trailing noun buys the name more room; only then shorten the name.
  const short = format(t('searchProviderShort'), { name })
  if (widthOf(short) <= TEXT_UNITS) return short
  const clipped = clipToFit(name, candidate => format(t('searchProviderShort'), { name: candidate }))
  return clipped === '' ? t('searchNeutral') : clipped
}
