import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../lib/index.js'

test('host publishes only explicitly configured presentation identities', () => {
  let inject
  apply({ on: (event, handler) => { assert.equal(event, 'webserver/index-inject'); inject = handler } }, {
    displayProviders: { 'deepseek-official': { name: 'Magpie', icon: 'magpie' } },
  })
  const rows = []
  inject(rows)
  assert.deepEqual(rows, [{ kind: 'global', name: '__DSH_MODEL_PICKER_DISPLAY_PROVIDERS__', value: {
    'deepseek-official': { name: 'Magpie', icon: 'magpie' },
  } }])
  let called = false
  apply({ on: () => { called = true } }, {})
  assert.equal(called, false)
})
