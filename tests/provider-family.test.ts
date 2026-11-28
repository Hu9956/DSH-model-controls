import { test } from 'node:test'
import assert from 'node:assert/strict'

// display-identity 读 window 上的显示身份表；单元测试里没有浏览器，给一个空的。
Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
const { channelLabels, familyKeyOf, groupFamilies } = await import('../src/client/provider-family')
const { pickerEn, pickerFallback, format } = await import('../src/client/locales')

const group = (id: string, name: string = id) => ({ id, name, models: [] })
const zh = pickerFallback
const en = (key: keyof typeof pickerEn, params?: Record<string, string>) => format(pickerEn[key], params)
// 图标身份由 provider-logos.tsx 算（依赖图标素材，单元测试不加载）；这里按它的规则给一个替身：
// 认得品牌的取品牌键，其余按首字母兜底。归并规则本身由 picker-interactions 的整包测试覆盖。
const BRANDS = ['magpie', 'deepseek', 'qwen', 'minimax', 'openai']
const iconKeyOf = (id: string, name: string): string =>
  BRANDS.find(brand => id.includes(brand)) ?? `initial:${name.charAt(0).toUpperCase()}`
const keyOf = (provider: { id: string; name: string }) => familyKeyOf(provider.id, iconKeyOf(provider.id, provider.name))
const families = (...providers: ReturnType<typeof group>[]) => groupFamilies(providers, keyOf)

test('providers that draw the same brand icon share a tab, placed where the first member sits', () => {
  assert.deepEqual(families(
    group('magpie', 'Magpie'),
    group('deepseek-account', 'DeepSeek'),
    group('magpie-responses', 'Magpie · Responses'),
    group('deepseek-official', 'DeepSeek'),
    group('magpie-anthropic', 'Magpie · Anthropic'),
  ).map(family => [family.label, family.members.map(member => member.id)]), [
    ['Magpie', ['magpie', 'magpie-responses', 'magpie-anthropic']],
    ['DeepSeek', ['deepseek-account', 'deepseek-official']],
  ])
})

test('providers that only share an initial keep their own tabs', () => {
  // 首字母都是 T，但它们是互不相干的提供方。
  assert.deepEqual(families(group('custom-tea', 'Tea'), group('custom-tide', 'Tide')).map(family => family.label), ['Tea', 'Tide'])
})

test('a merged tab is named by what its members share, else by the brand', () => {
  const label = (...providers: ReturnType<typeof group>[]) => families(...providers)[0]!.label
  assert.equal(label(group('qwen-token-plan', 'Qwen Token Plan'), group('qwen-token-plan-cn', 'Qwen Token Plan CN')), 'Qwen Token Plan')
  // 目录没给真名时显示名由 id 美化而来，同样取共同的开头。
  assert.equal(label(group('minimax'), group('minimax-cn')), 'MiniMax')
  // 显示名没有共同开头：退回品牌名。
  assert.equal(label(group('azure-openai-responses', 'Azure'), group('openai', 'OpenAI')), 'OpenAI')
})

test('channel headings are what is left of each name after the tab name', () => {
  const [magpie] = families(
    group('magpie', 'Magpie'), group('magpie-responses', 'Magpie · Responses'), group('magpie-anthropic', 'Magpie · Anthropic'),
  )
  assert.deepEqual([...channelLabels(magpie!, zh).values()], ['Chat', 'Responses', 'Anthropic'])
  const [qwen] = families(group('qwen-token-plan', 'Qwen Token Plan'), group('qwen-token-plan-cn', 'Qwen Token Plan CN'))
  // 显示名就是入口名、又不在默认表里：标题用完整显示名。
  assert.deepEqual([...channelLabels(qwen!, zh).values()], ['Qwen Token Plan', 'CN'])
  // 显示名不以入口名开头：标题用完整显示名。
  const [openai] = families(group('azure-openai-responses', 'Azure'), group('openai', 'OpenAI'))
  assert.deepEqual([...channelLabels(openai!, zh)], [['azure-openai-responses', 'Azure'], ['openai', 'OpenAI']])
})

test('the two DeepSeek routes are told apart by how they sign in, in the interface language', () => {
  // 宿主上报的显示名是「DeepSeek Account」与「DeepSeek」：照剩下的那段取会得到英文「Account」，所以认 id。
  const [deepseek] = families(group('deepseek-account', 'DeepSeek Account'), group('deepseek-official', 'DeepSeek'))
  assert.equal(deepseek!.label, 'DeepSeek')
  assert.deepEqual([...channelLabels(deepseek!, zh).values()], ['账号登录', 'API 密钥'])
  assert.deepEqual([...channelLabels(deepseek!, en).values()], ['Account sign-in', 'API key'])
})

test('headings that would read the same fall back to the provider ids', () => {
  const [family] = families(group('deepseek-east', 'DeepSeek'), group('deepseek-west', 'DeepSeek'))
  assert.deepEqual([...channelLabels(family!, zh).values()], ['DeepSeek East', 'DeepSeek West'])
})
