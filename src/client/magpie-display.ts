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
