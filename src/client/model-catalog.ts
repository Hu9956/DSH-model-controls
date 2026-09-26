/** Bridge the official per-session directory to the picker; the catalog default is not session state. */
import { getModelEffort, setModelEffort } from './picker-data'

export interface CatalogEffortSnapshot { id: string; name: string; description?: string }
export interface CatalogReasoningSnapshot { efforts: ReadonlyArray<CatalogEffortSnapshot>; defaultEffort?: string }
export interface CatalogModelSnapshot { id: string; name: string; reasoning?: CatalogReasoningSnapshot }
export interface CatalogGroupSnapshot { id: string; name: string; models: ReadonlyArray<CatalogModelSnapshot> }
export interface ModelSelection { provider: string; model: string; reasoningEffort?: string }
export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error'
export interface DirectoryState {
  current: ModelSelection | null
  pending: ModelSelection | null
  groups: ReadonlyArray<CatalogGroupSnapshot>
  failures: ReadonlyArray<unknown>
  status: CatalogStatus | 'selecting'
  error: string | null
}
/** Only the public directory surface is used; no official implementation is bundled. */
export interface ModelDirectoryFace {
  store: { getSnapshot(): DirectoryState; subscribe(fn: () => void): () => void }
  load(): Promise<unknown>
  select(selection: ModelSelection): Promise<{ ok: boolean }>
}
export interface CatalogState {
  status: CatalogStatus
  partial: boolean
  groups: ReadonlyArray<CatalogGroupSnapshot>
  default: ModelSelection | null
  pending: boolean
  error: string | null
}

const queues = new WeakMap<ModelDirectoryFace, Promise<unknown>>()

function resolveModelEffort(state: DirectoryState, provider: string, model: string): string | undefined {
  const reasoning = state.groups.find(g => g.id === provider)?.models.find(m => m.id === model)?.reasoning
  const remembered = getModelEffort(provider, model)
  return reasoning?.efforts.some(e => e.id === remembered) ? remembered : reasoning?.defaultEffort
}

/** Serialize writes across picker instances sharing this session. Remember only accepted choices. */
export function selectCatalogModel(directory: ModelDirectoryFace, provider: string, model: string, effort?: string): Promise<boolean> {
  const operation = (queues.get(directory) ?? Promise.resolve()).then(async () => {
    const before = directory.store.getSnapshot()
    const previous = before.current
    const reasoningEffort = effort ?? resolveModelEffort(before, provider, model)
    try {
      const result = await directory.select({ provider, model, ...(reasoningEffort === undefined ? {} : { reasoningEffort }) })
      if (!result.ok) return false
      if (previous?.reasoningEffort !== undefined) {
        setModelEffort(previous.provider, previous.model, previous.reasoningEffort)
      }
      const confirmed = directory.store.getSnapshot().current
      if (confirmed?.provider === provider && confirmed.model === model && confirmed.reasoningEffort !== undefined) {
        setModelEffort(provider, model, confirmed.reasoningEffort)
      } else if (reasoningEffort !== undefined) {
        setModelEffort(provider, model, reasoningEffort)
      }
      return true
    } catch (error) {
      console.warn('[model-picker] model selection failed', error)
      return false
    }
  })
  queues.set(directory, operation)
  void operation.finally(() => { if (queues.get(directory) === operation) queues.delete(directory) })
  return operation
}

/** Stable snapshots for useSyncExternalStore, backed by the official session projection. */
export function createCatalogAdapter(directory: ModelDirectoryFace) {
  let source: DirectoryState | undefined
  let snapshot: CatalogState
  return {
    subscribe: (fn: () => void) => directory.store.subscribe(fn),
    getSnapshot: (): CatalogState => {
      const next = directory.store.getSnapshot()
      if (source !== next) {
        source = next
        snapshot = {
          status: next.groups.length > 0 ? 'ready' : next.status === 'selecting' ? 'ready' : next.status,
          partial: next.failures.length > 0,
          groups: next.groups,
          default: next.pending ?? next.current,
          pending: next.pending !== null,
          error: next.error,
        }
      }
      return snapshot
    },
    load: () => { void directory.load().catch(error => { console.warn('[model-picker] catalog load failed', error) }) },
    select: (provider: string, model: string, effort?: string) => selectCatalogModel(directory, provider, model, effort),
  }
}
