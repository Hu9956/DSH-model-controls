import { test } from 'node:test'
import assert from 'node:assert/strict'
import { protocolBadgeOf, protocolBadges } from '../src/client/protocol-badge'

test('route id suffixes map to protocol letters; the default protocol has none', () => {
  assert.equal(protocolBadgeOf('magpie-responses'), 'R')
  assert.equal(protocolBadgeOf('magpie-anthropic'), 'A')
  assert.equal(protocolBadgeOf(' Magpie-Anthropic '), 'A')
  assert.equal(protocolBadgeOf('opencode-go-anthropic'), 'A')
  assert.equal(protocolBadgeOf('magpie'), undefined)
  assert.equal(protocolBadgeOf('anthropic'), undefined, 'a bare brand id is not a protocol route')
  assert.equal(protocolBadgeOf('-responses'), undefined)
})

test('only providers whose icon repeats get a badge', () => {
  const badges = protocolBadges([
    { id: 'magpie', iconKey: 'magpie' },
    { id: 'magpie-responses', iconKey: 'magpie' },
    { id: 'magpie-anthropic', iconKey: 'magpie' },
    { id: 'azure-openai-responses', iconKey: 'openai' },
    { id: 'deepseek-official', iconKey: 'deepseek' },
  ])
  assert.deepEqual([...badges], [['magpie-responses', 'R'], ['magpie-anthropic', 'A']])
})

test('a lone protocol route keeps a plain icon', () => {
  assert.equal(protocolBadges([{ id: 'magpie-anthropic', iconKey: 'magpie' }]).size, 0)
})
