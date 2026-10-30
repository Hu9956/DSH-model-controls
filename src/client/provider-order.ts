/** Stable client preference; unavailable providers retain their place for recovery.
 * 0.2.42：顺序同步到 DSH 宿主（prefs-sync.ts），localStorage 只做离线缓存。 */
import { pushPrefs } from './prefs-sync'

const STORAGE_KEY = 'dsh003.model-picker.provider-order'

export function normalizeProviderOrder(value: unknown): readonly string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))] : []
}

function readOrder(): readonly string[] {
  try { return normalizeProviderOrder(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')) }
  catch { return [] }
}

let snapshot = readOrder()
const listeners = new Set<() => void>()
export const getProviderOrder = (): readonly string[] => snapshot
export function subscribeProviderOrder(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function mergeProviderOrder(saved: readonly string[], available: readonly string[]): readonly string[] {
  return normalizeProviderOrder([...saved, ...available])
}

export function orderedProviders<T extends { id: string }>(providers: readonly T[], order: readonly string[]): T[] {
  const byId = new Map(providers.map(provider => [provider.id, provider]))
  return mergeProviderOrder(order, providers.map(provider => provider.id)).flatMap(id => {
    const provider = byId.get(id)
    return provider === undefined ? [] : [provider]
  })
}

function setOrder(next: readonly string[]): boolean {
  if (next.length === snapshot.length && next.every((id, index) => id === snapshot[index])) return false
  snapshot = next
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Keep the in-memory preference if storage is unavailable. */ }
  for (const listener of listeners) listener()
  return true
}

function saveOrder(next: readonly string[]): void {
  if (setOrder(next)) pushPrefs({ op: 'order', order: next })
}

/** 用宿主的顺序覆盖本地；不回推。 */
export function replaceProviderOrder(order: readonly string[]): void {
  setOrder(normalizeProviderOrder(order))
}

/**
 * 把新出现的供应商补到末尾。只改本地、不推给宿主：这不是用户的排序操作，
 * 推上去会让还没同步的设备（手机首次打开时本地是空的）用目录默认顺序盖掉别处排好的顺序。
 */
export function rememberProviders(ids: readonly string[]): void {
  setOrder(mergeProviderOrder(snapshot, ids))
}

/** Move only visible providers; temporary failures keep their reserved positions. */
export function moveProvider(ids: readonly string[], id: string, before: string | null): void {
  const saved = mergeProviderOrder(snapshot, ids)
  const available = new Set(ids)
  const visible = saved.filter(value => available.has(value))
  if (!visible.includes(id) || before === id || (before !== null && !visible.includes(before))) return
  const next = visible.filter(value => value !== id)
  next.splice(before === null ? next.length : next.indexOf(before), 0, id)
  let index = 0
  saveOrder(saved.map(value => available.has(value) ? next[index++]! : value))
}
