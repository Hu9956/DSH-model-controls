import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PassThrough } from 'node:stream'
import { applyPrefs, applyPrefsOp, prefsDomain, PREFS_PATH } from '../src/prefs.js'

const empty = () => structuredClone(prefsDomain.global.initial)

test('favorite / effort / order operations change only their own field', () => {
  let p = applyPrefsOp(empty(), { op: 'favorite', key: 'a/x', on: true })
  p = applyPrefsOp(p, { op: 'favorite', key: 'b/y', on: true })
  p = applyPrefsOp(p, { op: 'favorite', key: 'a/x', on: false })
  assert.deepEqual(p.favorites, ['b/y'])
  p = applyPrefsOp(p, { op: 'effort', key: 'b/y', effort: 'high' })
  p = applyPrefsOp(p, { op: 'order', order: ['b', 'a', 'b'] })
  assert.deepEqual(p, { favorites: ['b/y'], efforts: { 'b/y': 'high' }, providerOrder: ['b', 'a'] })
})

test('merge keeps both devices\u2019 favourites and lets the host win on conflicting efforts', () => {
  const host = { favorites: ['a/x'], efforts: { 'a/x': 'low' }, providerOrder: ['a'] }
  const merged = applyPrefsOp(host, { op: 'merge', favorites: ['b/y', 'a/x'], efforts: { 'a/x': 'high', 'b/y': 'max' }, providerOrder: ['b', 'a'] })
  assert.deepEqual(merged, { favorites: ['a/x', 'b/y'], efforts: { 'a/x': 'low', 'b/y': 'max' }, providerOrder: ['a', 'b'] })
})

test('global schema rejects null as the storage medium requires', () => {
  assert.equal(prefsDomain.global.schema.safeParse(null).success, false)
  assert.match(prefsDomain.name, /^[a-z][a-z0-9_]*$/)
})

/** 最小的假宿主：只实现 applyPrefs 用到的面。 */
function fakeHost({ admit = true } = {}) {
  let value = empty()
  const changed = []
  let handler
  const disposers = []
  const scope = {
    get: name => name === 'connection' ? { admit: () => admit ? {} : { rejection: 'no' } } : undefined,
    storageDomain: { open: async () => ({ global: { get: () => value, set: async next => { value = next; for (const fn of changed) fn({ domain: prefsDomain.name }) } }, close: async () => {} }) },
    webServer: { register: route => { assert.equal(route.path, PREFS_PATH); handler = route.handler; return () => {} } },
    on: (event, fn) => { if (event === 'domain/changed') changed.push(fn) },
    effect: (fn) => { disposers.push(fn()) },
  }
  const ctx = { inject: (_deps, fn) => fn(scope) }
  applyPrefs(ctx)
  const request = async (method, path, body, headers = { 'content-type': 'application/json' }) => {
    const req = new PassThrough()
    Object.assign(req, { method, url: PREFS_PATH + path, headers })
    let status = 0, text = ''
    const done = new Promise(resolve => {
      const res = { writeHead: s => { status = s }, write: chunk => { text += chunk; return true }, end: (chunk, cb) => { if (typeof chunk === 'string') text += chunk; resolve(); if (typeof cb === 'function') cb() } }
      handler(req, res)
    })
    req.end(body === undefined ? undefined : JSON.stringify(body))
    await done
    let json; try { json = JSON.parse(text) } catch { json = undefined }
    return { status, json }
  }
  return { request, get value() { return value } }
}

test('route reads and applies operations; concurrent writes from two devices both land', async () => {
  const host = fakeHost()
  assert.deepEqual((await host.request('GET', '')).json, empty())
  await Promise.all([
    host.request('POST', '', { op: 'favorite', key: 'a/x', on: true }),
    host.request('POST', '', { op: 'favorite', key: 'b/y', on: true }),
  ])
  assert.deepEqual([...host.value.favorites].sort(), ['a/x', 'b/y'])
})

test('route rejects unauthenticated, non-JSON and malformed writes', async () => {
  assert.equal((await fakeHost({ admit: false }).request('GET', '')).status, 401)
  const host = fakeHost()
  assert.equal((await host.request('POST', '', { op: 'favorite', key: 'a/x', on: true }, { 'content-type': 'text/plain' })).status, 415)
  assert.equal((await host.request('POST', '', { op: 'nope' })).status, 400)
  assert.equal((await host.request('PUT', '')).status, 405)
  assert.deepEqual(host.value, empty())
})
