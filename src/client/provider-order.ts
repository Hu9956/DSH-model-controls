/** Stable client preference; unavailable providers retain their place for recovery. */
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

function saveOrder(next: readonly string[]): void {
  if (next.length === snapshot.length && next.every((id, index) => id === snapshot[index])) return
  snapshot = next
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Keep the in-memory preference if storage is unavailable. */ }
  for (const listener of listeners) listener()
}

export function rememberProviders(ids: readonly string[]): void {
  saveOrder(mergeProviderOrder(snapshot, ids))
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
