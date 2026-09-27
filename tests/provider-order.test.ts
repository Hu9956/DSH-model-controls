import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeProviderOrder, mergeProviderOrder, orderedProviders, rememberProviders, moveProvider, getProviderOrder } from '../src/client/provider-order'

test('stored provider IDs are validated and deduplicated', () => {
  assert.deepEqual(normalizeProviderOrder(['a', 4, '', 'a', 'b', null]), ['a', 'b'])
  assert.deepEqual(normalizeProviderOrder({ a: 1 }), [])
})
test('host re-registration cannot reorder known IDs; new IDs append and unavailable IDs survive', () => {
  assert.deepEqual(mergeProviderOrder(['a', 'b', 'c'], ['c', 'a', 'd']), ['a', 'b', 'c', 'd'])
  const providers = [{ id: 'c', name: 'Same' }, { id: 'a', name: 'Same' }, { id: 'd', name: 'New' }]
  assert.deepEqual(orderedProviders(providers, ['a', 'b', 'c']).map(p => p.id), ['a', 'c', 'd'])
  assert.deepEqual(providers.map(p => p.id), ['c', 'a', 'd'])
})
test('moving visible suppliers preserves temporarily unavailable positions without window/storage', () => {
  rememberProviders(['a', 'missing', 'b', 'c'])
  moveProvider(['a', 'b', 'c'], 'c', 'a')
  assert.deepEqual(getProviderOrder(), ['c', 'missing', 'a', 'b'])
  moveProvider(['a', 'b', 'c'], 'c', null)
  assert.deepEqual(getProviderOrder(), ['a', 'missing', 'b', 'c'])
  moveProvider(['a', 'b', 'c'], 'a', 'unknown')
  assert.deepEqual(getProviderOrder(), ['a', 'missing', 'b', 'c'])
})
