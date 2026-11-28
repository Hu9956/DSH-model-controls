/**
 * T3 Code 桥接器（@kewen/dsh-t3-bridge）的显示层适配。
 *
 * 桥接器把本机 T3 Code 里的各个 CLI 注册成提供方：`t3-codex` / `t3-agy` / `t3-devin`，
 * 显示名形如「T3 · Codex」。它们是不同的 CLI，不是同一来源的几种接法，所以各占顶栏一格，
 * 图标画作「T3 字标 + CLI 图标角标」。这里只做显示判断：provider id 是请求与存储的键，永不改写。
 */

/** 顶栏能画出角标的 CLI。 */
export type T3Cli = 'codex' | 'antigravity' | 'devin'

/** 桥接器路由 id 的后缀 → CLI。 */
const T3_CLI_BY_SUFFIX: Readonly<Record<string, T3Cli>> = {
  codex: 'codex',
  agy: 'antigravity',
  devin: 'devin',
}

/** 该 provider 是否由 T3 桥接器注册。 */
export function isT3Route(providerId: string): boolean {
  return providerId.trim().toLowerCase().startsWith('t3-')
}

/**
 * 桥接器路由背后的 CLI。
 * @param providerId - 提供方 id。
 * @returns 认得的 CLI；不是桥接器路由或后缀未收录时返回 undefined（调用方只画 T3 字标）。
 */
export function t3CliOf(providerId: string): T3Cli | undefined {
  const id = providerId.trim().toLowerCase()
  return isT3Route(id) ? T3_CLI_BY_SUFFIX[id.slice(3)] : undefined
}
