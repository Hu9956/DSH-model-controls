import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isMagpieRoute, magpieGatewayLabel, splitMagpieModelName } from '../src/client/magpie-display'

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
