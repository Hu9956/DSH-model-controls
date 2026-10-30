/** Bridge the official per-session directory to the picker; the catalog default is not session state. */
import { getModelEffort, setModelEffort } from './picker-data'

export interface CatalogEffortSnapshot { id: string; name: string; description?: string }
export interface CatalogReasoningSnapshot { efforts: ReadonlyArray<CatalogEffortSnapshot>; defaultEffort?: string }
export interface CatalogModelSnapshot { id: string; name: string; reasoning?: CatalogReasoningSnapshot }
export interface CatalogGroupSnapshot { id: string; name: string; models: ReadonlyArray<CatalogModelSnapshot> }
export interface ModelSelection { provider: string; model: string; reasoningEffort?: string }
export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error'
/** 单个提供方加载失败：`id` 与 `name` 标识它，`message` 是宿主给的原因。 */
export interface CatalogFailure { id: string; name?: string; message: string }

export interface DirectoryState {
  current: ModelSelection | null
  pending: ModelSelection | null
  groups: ReadonlyArray<CatalogGroupSnapshot>
  failures: ReadonlyArray<CatalogFailure>
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
  /** 加载失败的提供方，用于逐项显示原因并提供重试。 */
  failures: ReadonlyArray<CatalogFailure>
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
  // 队列接续：operation 内部 try 包住同步与异步路径、catch 恒返回 false，因此它永不 reject，
  // 前驱的异常既不会逃逸给调用方，也不会毒化队列里排队的下一次选择。
  const operation = (queues.get(directory) ?? Promise.resolve()).then(async (): Promise<boolean> => {
    try {
      const before = directory.store.getSnapshot()
      const previous = before.current
      const reasoningEffort = effort ?? resolveModelEffort(before, provider, model)
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
      // 同步路径（getSnapshot / 本地 effort 记忆）与异步 select 同口径：失败即 false，
      // 既不让 rejection 逃逸给调用方，也不毒化队列里排队的下一次选择。
      console.warn('[model-picker] model selection failed', error)
      return false
    }
  })
  queues.set(directory, operation)
  void operation.finally(() => { if (queues.get(directory) === operation) queues.delete(directory) })
  return operation
}

function sameSelection(a: ModelSelection | null, b: ModelSelection | null): boolean {
  if (a === null || b === null) return a === b
  return a.provider === b.provider && a.model === b.model && a.reasoningEffort === b.reasoningEffort
}

/**
 * 切换已被接受、但会话投影还没送来新 `current` 的最长等待。投影正常约 30ms 到；
 * 超时只是兜底（例如连接重置把 pending 清掉、投影不会再来），到点就回到宿主的 current。
 */
const HOLD_TIMEOUT_MS = 2000

/** Stable snapshots for useSyncExternalStore, backed by the official session projection. */
export function createCatalogAdapter(directory: ModelDirectoryFace) {
  let source: DirectoryState | undefined
  let snapshot: CatalogState
  /**
   * 官方 `select()` 在 RPC 返回时就把 `pending` 清成 null，而新的 `current` 要等会话历史的
   * 投影帧才到。这中间约 30ms 里 `pending ?? current` 是**旧**模型：按钮先变成新模型、
   * 闪回旧模型、再变成新模型，名字宽度不同，按钮就跟着左右跳一下（手机上最明显）。
   *
   * 这里记住最近一次 pending 和它出现时的 current（base）。pending 正常清掉（无错误）
   * 而 current 还停在 base 时，继续显示 pending；current 一变（投影到达或别处改了选择）、
   * 出错或超时，就放手。
   */
  let lastPending: { selection: ModelSelection; base: ModelSelection | null } | null = null
  let held: { selection: ModelSelection; base: ModelSelection | null } | null = null
  let holdTimer: ReturnType<typeof setTimeout> | undefined
  let dirty = false
  const listeners = new Set<() => void>()
  const release = (): void => {
    held = null
    if (holdTimer !== undefined) clearTimeout(holdTimer)
    holdTimer = undefined
  }
  const shown = (next: DirectoryState): ModelSelection | null => {
    if (next.pending !== null) {
      release()
      if (lastPending === null || !sameSelection(lastPending.selection, next.pending)) {
        lastPending = { selection: next.pending, base: next.current }
      }
      return next.pending
    }
    if (lastPending !== null) {
      // pending 刚清掉：成功（无错误）且 current 仍是旧值 → 进入等待投影。
      if (next.error === null && sameSelection(next.current, lastPending.base)) {
        held = lastPending
        if (holdTimer !== undefined) clearTimeout(holdTimer)
        holdTimer = setTimeout(() => {
          holdTimer = undefined
          if (held === null) return
          held = null
          dirty = true
          for (const fn of listeners) fn()
        }, HOLD_TIMEOUT_MS)
      }
      lastPending = null
    }
    if (held !== null) {
      if (next.error === null && sameSelection(next.current, held.base)) return held.selection
      release()
    }
    return next.current
  }
  return {
    subscribe: (fn: () => void) => {
      listeners.add(fn)
      const off = directory.store.subscribe(fn)
      return () => { listeners.delete(fn); off() }
    },
    getSnapshot: (): CatalogState => {
      const next = directory.store.getSnapshot()
      // shown() 有状态，同一份宿主快照只算一次；等待超时会置 dirty 强制重算。
      if (source !== next || dirty) {
        dirty = false
        source = next
        const selection = shown(next)
        snapshot = {
          status: next.groups.length > 0 ? 'ready' : next.status === 'selecting' ? 'ready' : next.status,
          failures: next.failures,
          partial: next.failures.length > 0,
          groups: next.groups,
          default: selection,
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
