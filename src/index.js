import z from '@deepseek-ai/schemastery'

/** The official plugin configuration UI projects volatile fields into editable forms. */
export const Config = z.object({
  magpieBaseURL: z.string()
    .pattern(/^(?:|https?:\/\/[^/\s@?#]+(?:\/[^?\s#]*)?)$/)
    .default('')
    .description('备用 Magpie 接口地址')
    .comment('通常无需填写。默认根据 Magpie 写入的运行配置自动识别；仅自定义接入未被识别时填写。切换路由后刷新界面。')
    .volatile(),
  // Retain installed configurations while exposing only the new field in the settings form.
  displayProviders: z.any().hidden(),
})

/** Normalize an explicitly configured endpoint, without guessing from model names. */
function endpoint(value) {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) return undefined
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
  } catch { return undefined }
}

/** Read the accepted, running API-key provider config, never a rejected patch candidate. */
function deepSeekRoute(ctx) {
  try { return readDeepSeekRoute(ctx) } catch { return undefined }
}

function readDeepSeekRoute(ctx) {
  const loader = ctx.get('loader')
  if (typeof loader?.entries !== 'function') return undefined
  const entries = [...loader.entries()].filter(entry =>
    entry.options.name === '@deepseek-ai/dsh-llm-deepseek-api-key'
    && !entry.disabled && entry.fiber?.state === 2,
  )
  if (entries.length !== 1) return undefined
  const config = entries[0].fiber.config
  if (config === undefined || config === null) return undefined
  const value = config?.baseURL
  const baseURL = typeof value?.get === 'function' ? value.get() : value
  const environment = ctx.get('launchEnvironment')
  const address = endpoint(baseURL ?? (environment === undefined
    ? process.env.DEEPSEEK_BASE_URL
    : environment.get('DEEPSEEK_BASE_URL')?.value) ?? 'https://api.deepseek.com/anthropic')
  const key = config.apiKeyEnv
  const keyRef = typeof key?.get === 'function' ? key.get() : key
  let automatic = false
  if (address && keyRef === 'MAGPIE_API_KEY') {
    const url = new URL(address)
    automatic = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) && url.pathname === '/v1'
  }
  return { address, automatic }
}

/** Host half: publish presentation identities only while their endpoint condition matches. */
export function apply(ctx, config = {}) {
  const providers = config.displayProviders
  if (config.magpieBaseURL === undefined && (providers === undefined || providers === null || typeof providers !== 'object' || Array.isArray(providers))) return
  ctx.on('webserver/index-inject', table => {
    if (ctx.fiber?.entry) table.push({ kind: 'global', name: '__DSH_MODEL_CONTROLS_NAMESPACE__', value: ctx.fiber.entry.options.id })
    // Recompute on every page load: removing a router patch must remove its display identity too.
    const displayProviders = {}
    const route = deepSeekRoute(ctx)
    if (route?.automatic) displayProviders['deepseek-official'] = { name: 'Magpie', icon: 'magpie' }
    const setting = config.magpieBaseURL
    const baseURL = typeof setting?.get === 'function' ? setting.get() : setting
    // An explicit empty setting disables the alias, including an older mapping left in a profile.
    const rules = setting === undefined ? providers : {
      'deepseek-official': { name: 'Magpie', icon: 'magpie', whenBaseURL: baseURL },
    }
    for (const [id, value] of Object.entries(rules ?? {})) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) continue
      if (typeof value.name !== 'string' || value.name.trim() === '') continue
      const expected = endpoint(value.whenBaseURL)
      // Old unconditional DeepSeek -> Magpie mappings intentionally stop taking effect.
      if (id !== 'deepseek-official' || expected === undefined || route?.address !== expected) continue
      displayProviders[id] = {
        name: value.name.trim(),
        // Only bundled icon keys are accepted; never load arbitrary URLs or markup.
        icon: value.icon === 'magpie' ? 'magpie' : undefined,
      }
    }
    table.push({ kind: 'global', name: '__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__', value: displayProviders })
  })
}
