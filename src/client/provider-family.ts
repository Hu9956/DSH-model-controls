/**
 * 顶栏入口归并：画出同一个品牌图标的提供方并成顶栏一格（入口），格子里按原提供方分渠道。
 *
 * 归并的是「同一个来源换一种接法」：Magpie 的三个协议路由、DeepSeek 的账号登录与 API 密钥。
 * 不归并的两类：首字母兜底的图标（不同供应商可能碰巧同字母），以及 T3 桥接器的各个 CLI
 * （它们各有各的图标，见 t3-display.ts）。
 * 只做显示层归并：选择、收藏、思考深度记忆与排序存储仍以 provider id 为键。
 */
import type { CatalogGroupSnapshot } from './model-catalog'
import { displayProviderName } from './display-identity'
import { prettifyProviderName } from './provider-names'
import type { PickerKey, Translate } from './locales'

/** 顶栏一格：一个或几个画出同一图标的提供方。 */
export interface ProviderFamily {
  /** 归并键；单独成格的提供方用自己的 id 派生，保证互不相同。 */
  key: string
  /** 入口名：悬停提示、读屏名与搜索占位文字用。 */
  label: string
  /** 成员，顺序即渠道顺序。 */
  members: ReadonlyArray<CatalogGroupSnapshot>
}

/** 显示名里分隔「入口 · 渠道」的中点。 */
const SEPARATOR = '\u00b7'

/**
 * 图标身份 → 入口键：同品牌图标同入口；首字母兜底的图标各自成格。
 * 图标身份由调用方算（provider-logos.tsx 的 providerIconKey），本模块不依赖图标素材。
 * @param providerId - 提供方 id。
 * @param iconKey - 该提供方的图标身份。
 */
export function familyKeyOf(providerId: string, iconKey: string): string {
  return iconKey.startsWith('initial:') ? `solo:${providerId}` : iconKey
}

/** 几个显示名开头相同的那几个词；分隔中点不算词。 */
function sharedLead(names: readonly string[]): string {
  const [first = [], ...rest] = names.map(name => name.split(/\s+/).filter(word => word !== '' && word !== SEPARATOR))
  let length = first.length
  for (const words of rest) {
    let index = 0
    while (index < length && words[index] === first[index]) index += 1
    length = index
  }
  return first.slice(0, length).join(' ')
}

/** 入口名：单独成格用自己的显示名；并格取成员显示名共同的开头，没有共同开头时用品牌名。 */
function familyLabel(key: string, members: ReadonlyArray<CatalogGroupSnapshot>): string {
  const names = members.map(displayProviderName)
  if (names.length === 1) return names[0]!
  const lead = sharedLead(names)
  return lead !== '' ? lead : prettifyProviderName(key, undefined)
}

/**
 * 把排好序的提供方归并成入口。
 * @param sorted - 已按用户顺序排好的提供方。
 * @param keyOf - 取一个提供方的入口键（见 familyKeyOf）。
 * @returns 入口列表：入口顺序取其第一个成员的位置，成员之间保持原顺序。
 */
export function groupFamilies(
  sorted: ReadonlyArray<CatalogGroupSnapshot>,
  keyOf: (provider: CatalogGroupSnapshot) => string,
): ProviderFamily[] {
  const byKey = new Map<string, CatalogGroupSnapshot[]>()
  for (const provider of sorted) {
    const key = keyOf(provider)
    const members = byKey.get(key)
    if (members === undefined) byKey.set(key, [provider])
    else members.push(provider)
  }
  return [...byKey].map(([key, members]) => ({ key, label: familyLabel(key, members), members }))
}

/** 认得的提供方的渠道名，跟随界面语言，优先于显示名里剩下的那段。
 * `magpie` 的显示名就是入口名本身；DeepSeek 两条宿主上报的是英文「DeepSeek Account」与「DeepSeek」，
 * 照剩下的那段取会得到一个英文「Account」和一个空名字。 */
const KNOWN_CHANNEL_KEYS: Readonly<Record<string, PickerKey>> = {
  magpie: 'channelChat',
  'deepseek-account': 'channelAccount',
  'deepseek-official': 'channelApiKey',
}

/** 一个成员的渠道名：认得的提供方用本地化叫法，其余取显示名去掉入口名之后剩下的部分。 */
function channelLabelOf(provider: CatalogGroupSnapshot, family: ProviderFamily, t: Translate<PickerKey>): string {
  const key = KNOWN_CHANNEL_KEYS[provider.id]
  if (key !== undefined) return t(key)
  const name = displayProviderName(provider)
  const rest = name.startsWith(family.label) ? name.slice(family.label.length) : name
  const tail = rest.replace(/^[\s\u00b7]+/, '').trim()
  return tail !== '' ? tail : name
}

/**
 * 并格入口里各渠道的小标题。
 * @param family - 入口。
 * @param t - 面板的语言读取器。
 * @returns provider id → 渠道名；两个渠道撞名时改用各自的 id 美化名，保证标题能区分。
 */
export function channelLabels(family: ProviderFamily, t: Translate<PickerKey>): ReadonlyMap<string, string> {
  const labels = family.members.map(member => channelLabelOf(member, family, t))
  return new Map(family.members.map((member, index) => [
    member.id,
    labels.indexOf(labels[index]!) === labels.lastIndexOf(labels[index]!)
      ? labels[index]!
      : prettifyProviderName(member.id, undefined),
  ]))
}
