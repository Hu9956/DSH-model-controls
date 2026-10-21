import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isMagpieRoute, magpieGatewayLabel, splitMagpieModelName, compactModelName } from '../src/client/magpie-display'

test('every Magpie protocol route is recognised as the same gateway', () => {
  for (const id of ['magpie', 'magpie-responses', 'magpie-anthropic', 'MAGPIE', ' magpie-responses ']) {
    assert.equal(isMagpieRoute(id), true, `${id} belongs to the gateway`)
  }
  for (const id of ['deepseek-official', 'lingsuan', 'magpieish', 'm']) {
    assert.equal(isMagpieRoute(id), false, `${id} is not the gateway`)
  }
})

test('a model name splits into the model and its route source', () => {
  assert.deepEqual(splitMagpieModelName('Qwen3.8-Flash · Qoder CN'), { model: 'Qwen3.8-Flash', route: 'Qoder CN' })
  assert.deepEqual(splitMagpieModelName('Deepseek-V4.1-Flash (SG) · WorkBuddy AI'), { model: 'Deepseek-V4.1-Flash (SG)', route: 'WorkBuddy AI' })
  // 空白宽容：两侧多余空格被裁掉。
  assert.deepEqual(splitMagpieModelName('  Step 5 Preview Free  ·  OpenCode Zen  '), { model: 'Step 5 Preview Free', route: 'OpenCode Zen' })
})

test('a name that does not follow the convention is left for the single-line fallback', () => {
  assert.equal(splitMagpieModelName('claude-opus-5-5'), null)
  assert.equal(splitMagpieModelName('Model · '), null, 'a missing route source is not a split')
  assert.equal(splitMagpieModelName(' · Qoder CN'), null, 'a missing model name is not a split')
})

test('only the first separator splits, so a route source keeps its own dots', () => {
  assert.deepEqual(splitMagpieModelName('Model · Route · Extra'), { model: 'Model', route: 'Route · Extra' })
})

test('the gateway label comes from the configured route name, never a hard-coded brand', () => {
  assert.equal(magpieGatewayLabel('Magpie · Responses'), 'Magpie')
  assert.equal(magpieGatewayLabel('Magpie · Anthropic'), 'Magpie')
  assert.equal(magpieGatewayLabel('Magpie'), 'Magpie')
  // 用户改了网关名，副行跟着变；不假定品牌词。
  assert.equal(magpieGatewayLabel('Gateway · Responses'), 'Gateway')
  assert.equal(magpieGatewayLabel('  Magpie · Responses  '), 'Magpie')
})

test('the button shortens a model name by dropping a redundant brand prefix', () => {
  // 品牌 + 版本号：品牌是冗余信息，去掉仍能唯一认出。
  assert.equal(compactModelName('DeepSeek-V4.1-Flash'), 'V4.1-Flash')
  assert.equal(compactModelName('Deepseek-V4.1-Flash'), 'V4.1-Flash', 'upstream casing varies')
  assert.equal(compactModelName('DeepSeek V4.1 Flash Free'), 'V4.1 Flash Free')
  assert.equal(compactModelName('DeepSeek V4.1 Flash 1017'), 'V4.1 Flash 1017')
  assert.equal(compactModelName('DeepSeek-V4.1-Flash (Max)'), 'V4.1-Flash (Max)')
  assert.equal(compactModelName('claude-sonnet-5'), 'sonnet-5')
  assert.equal(compactModelName('claude-opus-5-5'), 'opus-5-5')
  assert.equal(compactModelName('MiMo-V2.6-Flash Free'), 'V2.6-Flash Free')
  assert.equal(compactModelName('GLM-5.3-FlashX (Max)'), '5.3-FlashX (Max)')
  assert.equal(compactModelName('Qwen3.8-Max'), '3.8-Max')
})

test('a name whose remainder carries no version keeps its brand', () => {
  // 去掉品牌只剩通用词，认不出是谁——护栏保留原名。
  assert.equal(compactModelName('DeepSeek-Flash'), 'DeepSeek-Flash')
  assert.equal(compactModelName('Claude-Haiku'), 'Claude-Haiku')
})

test('GPT drops its prefix but Step keeps it', () => {
  // GPT 后面跟的是 6.1 / 6 这类版本号，加代号本身认得出；
  // Step-5-Preview 削成 5-Preview 只剩通用词，因此整类保留。
  assert.equal(compactModelName('GPT-6 Astra'), '6 Astra')
  assert.equal(compactModelName('GPT-6.1 Sol'), '6.1 Sol')
  assert.equal(compactModelName('gpt-6.1 sol'), '6.1 sol', 'upstream casing varies')
  assert.equal(compactModelName('Step-5-Preview'), 'Step-5-Preview')
})

test('names with no known brand prefix are left exactly as they are', () => {
  assert.equal(compactModelName('Beam Free'), 'Beam Free')
  assert.equal(compactModelName('M3'), 'M3')
  assert.equal(compactModelName('M3.1-Flash（订阅限免）'), 'M3.1-Flash（订阅限免）')
  assert.equal(compactModelName('dsh-opencode-go'), 'dsh-opencode-go')
})

test('the brand only strips at the start, never inside a name', () => {
  assert.equal(compactModelName('Qwen3.8-Flash'), '3.8-Flash')
  assert.equal(compactModelName('MiMo-V2.6-Flash Free'), 'V2.6-Flash Free')
  assert.equal(compactModelName('Step-Qwen4'), 'Step-Qwen4', 'an inner brand is not a prefix')
})
