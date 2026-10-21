/**
 * Magpie 网关的显示层适配。
 *
 * Magpie 按 API 协议暴露多个路由（magpie / magpie-responses / magpie-anthropic），
 * 并把「模型 · 路由来源」拼成一个显示名（如 `Qwen3.8-Flash · Qoder CN`）。
 * 这里只做显示转换：provider id 与模型 id 是请求与存储的键，永不改写。
 */

/** 显示名分隔符：Magpie 用中点分隔「模型 · 路由来源」与「网关 · 协议」两种显示名。 */
const SEPARATOR = '\u00b7'

/** 该 provider 是否属于 Magpie 网关：按协议拆出的路由共享同一网关身份。 */
export function isMagpieRoute(providerId: string): boolean {
  const id = providerId.trim().toLowerCase()
  return id === 'magpie' || id.startsWith('magpie-')
}

/**
 * 拆分「模型 · 路由来源」显示名。
 * @param name - 上游上报的模型显示名。
 * @returns 模型名与路由来源；命名约定变化（无分隔符、缺一侧）时返回 null，调用方回退单行显示。
 */
export function splitMagpieModelName(name: string): { model: string; route: string } | null {
  const index = name.indexOf(SEPARATOR)
  if (index < 0) return null
  const model = name.slice(0, index).trim()
  const route = name.slice(index + SEPARATOR.length).trim()
  if (model === '' || route === '') return null
  return { model, route }
}

/**
 * 取路由显示名的首段作为网关标识（形如「Magpie · Responses」→「Magpie」），
 * 尊重用户在配置里写的网关名，而不是硬编码品牌词。
 * @param displayName - 路由的显示名。
 * @returns 网关标识；首段为空时退回整名。
 */
export function magpieGatewayLabel(displayName: string): string {
  const index = displayName.indexOf(SEPARATOR)
  const head = (index < 0 ? displayName : displayName.slice(0, index)).trim()
  return head === '' ? displayName.trim() : head
}

/**
 * 触发按钮上可以省略的品牌前缀：模型名其余部分已带版本号时，品牌词只是重复信息。
 *
 * 只收「品牌 + 版本号」这类厂商：`DeepSeek-V4.1-Flash` 去掉品牌仍是 `V4.1-Flash`。
 * GPT 在列：`GPT-6.1 Sol` → `6.1 Sol`、`GPT-6 Astra` → `6 Astra`，
 * 小数的版本号加代号本身认得出，供应商图标与悬停提示仍给出完整信息。
 * Step 不在列：`Step-5-Preview` → `5-Preview` 只剩通用词，按已确认结论完整显示。
 */
const COMPACT_BRAND_PREFIXES: readonly string[] = [
  'deepseek', 'claude', 'mimo', 'glm', 'qwen', 'gpt',
]

/**
 * 生成触发按钮用的短模型名：去掉冗余品牌前缀。
 *
 * 只作用于**按钮显示**——面板行、搜索匹配、请求参数与存储键一律沿用上游原名。
 *
 * 护栏：去掉品牌后必须还剩下数字，否则保留原名。这条挡住两类坏结果：
 * - `DeepSeek-Flash` → `Flash`（只剩通用词，认不出是谁）
 * - `Beam Free`、`M3` 等本来就没有可去的品牌
 *
 * @param name - 上游模型显示名（不含 `·` 路由后缀，调用方需先拆开）。
 * @returns 按钮显示用的短名；不满足条件时原样返回。
 */
export function compactModelName(name: string): string {
  const lower = name.toLowerCase()
  for (const brand of COMPACT_BRAND_PREFIXES) {
    if (!lower.startsWith(brand)) continue
    const rest = name.slice(brand.length).replace(/^[\s\-_]+/, '')
    return rest !== '' && /\d/.test(rest) ? rest : name
  }
  return name
}
