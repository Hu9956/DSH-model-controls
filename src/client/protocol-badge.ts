/**
 * 协议角标：同一网关按 API 协议拆出多个路由（如 magpie / magpie-responses / magpie-anthropic），
 * 左栏三个按钮画的是同一枚图标，看起来像重复。这里给撞图标的路由按 id 后缀标出协议字母。
 *
 * 规则：
 * - 只在同一列表里图标身份重复时才加标；单独出现的 `azure-openai-responses` 不加。
 * - 默认的 Chat Completions 路由（无后缀）不加标，其余两个带标，无标那个自然读作「标准版」。
 * - 只看真实路由 id 的后缀，不看显示名：显示名可由用户改写。
 */

export type ProtocolBadge = 'R' | 'A'

/** 路由 id 后缀 → 角标字母。 */
const SUFFIX_BADGES: ReadonlyArray<readonly [suffix: string, badge: ProtocolBadge]> = [
  ['-responses', 'R'],
  ['-anthropic', 'A'],
]

/** 按路由 id 后缀判断协议；默认协议或无法识别返回 undefined。 */
export function protocolBadgeOf(providerId: string): ProtocolBadge | undefined {
  const id = providerId.trim().toLowerCase()
  for (const [suffix, badge] of SUFFIX_BADGES) {
    if (id.endsWith(suffix) && id.length > suffix.length) return badge
  }
  return undefined
}

/**
 * 给图标重复的提供方分配协议角标。
 * @param entries - 左栏提供方：真实 id 与其图标身份键（相同键 = 画出相同图标）。
 * @returns 需要加标的提供方 id → 角标字母。
 */
export function protocolBadges(entries: ReadonlyArray<{ id: string; iconKey: string }>): ReadonlyMap<string, ProtocolBadge> {
  const counts = new Map<string, number>()
  for (const entry of entries) counts.set(entry.iconKey, (counts.get(entry.iconKey) ?? 0) + 1)
  const badges = new Map<string, ProtocolBadge>()
  for (const entry of entries) {
    if ((counts.get(entry.iconKey) ?? 0) < 2) continue
    const badge = protocolBadgeOf(entry.id)
    if (badge !== undefined) badges.set(entry.id, badge)
  }
  return badges
}
