/**
 * M-065 供应商显示名美化：上游 pi-ai 目录对目录路由用路由 id 兜底当 displayName
 * （llm-pi-ai/src/index.ts:133 `declare(provider, provider)`，目录 JSON 无供应商名字段），
 * 设置页与 picker 左列因此显示全小写 id。本 helper 只做显示层转换：
 * 真名（≠ id）原样透传永不覆盖；兜底名按确定性规则美化。
 * 模型 ID / 模型名不经过此函数——ID 是发 API 的标识符必须原样。
 */

/** 复合品牌词映射（默认规则会写错形态的少数 token；未收录走通用规则）。 */
const KNOWN_TOKENS: Readonly<Record<string, string>> = {
  deepseek: 'DeepSeek',
  github: 'GitHub',
  glm: 'GLM',
  minimax: 'MiniMax',
  moonshotai: 'MoonshotAI',
  openai: 'OpenAI',
  opencode: 'OpenCode',
  openrouter: 'OpenRouter',
  xai: 'xAI',
  zai: 'Z.ai',
}

function prettifyId(id: string): string {
  return id.split('-').map(token => {
    if (token === '') return token
    if (/^\d+$/.test(token)) return token
    if (token.length <= 2) return token.toUpperCase()
    const known = KNOWN_TOKENS[token.toLowerCase()]
    if (known !== undefined) return known
    return token.charAt(0).toUpperCase() + token.slice(1)
  }).join(' ')
}

/**
 * @param providerId - 路由 id（如 qwen-token-plan-cn）。
 * @param displayName - 上报的显示名；≡ id 视为兜底名，做美化。
 * @returns 展示用名称（数据层原值不变，仅渲染面调用）。
 */
export function prettifyProviderName(providerId: string, displayName: string | undefined): string {
  if (displayName !== undefined && displayName !== '' && displayName !== providerId) return displayName
  return prettifyId(providerId)
}
