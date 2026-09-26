/**
 * M2-005a 模型选择器：类型与工具。收藏键：`${providerId}/${modelId}`，跨提供方唯一。
 * M2-005b：收藏为模块级持久化 store——localStorage 落盘（页面刷新/应用重启不丢），
 * 组件经 useSyncExternalStore 订阅（快照引用稳定纪律：变更时新建 Set）。
 * M-121：模型思考强度独立记忆（Per-Model Sticky Memory）——localStorage 落盘，
 * 记录用户为特定模型选定的思考强度，隔离跨模型/跨供应商继承污染。
 */

/** 收藏键：提供方 id + 模型 id 组合（跨提供方唯一）。 */
export function favoriteKeyOf(providerId: string, modelId: string): string {
  return `${providerId}/${modelId}`
}

const FAVORITES_STORAGE_KEY = 'dsh003.model-picker.favorites'

function readStoredFavorites(): ReadonlySet<string> {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (raw === null) return new Set()
    const list: unknown = JSON.parse(raw)
    if (!Array.isArray(list)) return new Set()
    return new Set(list.filter((v): v is string => typeof v === 'string'))
  } catch {
    // 坏 JSON 或存储不可用：按无收藏起步，不阻塞面板
    return new Set()
  }
}

let favoriteSnapshot: ReadonlySet<string> = readStoredFavorites()
const favoriteListeners = new Set<() => void>()

/** uSES getSnapshot：收藏键集合（引用在变更前保持稳定）。 */
export function getFavoriteSet(): ReadonlySet<string> {
  return favoriteSnapshot
}

/** uSES subscribe：收藏变更监听，返回解绑函数。 */
export function subscribeFavorites(listener: () => void): () => void {
  favoriteListeners.add(listener)
  return () => {
    favoriteListeners.delete(listener)
  }
}

/** 切换收藏并落盘 localStorage（写失败时内存态兜底，面板功能不受阻）。 */
export function toggleFavorite(providerId: string, modelId: string): void {
  const next = new Set(favoriteSnapshot)
  const key = favoriteKeyOf(providerId, modelId)
  if (!next.delete(key)) next.add(key)
  favoriteSnapshot = next
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]))
  } catch {
    // 配额满或存储被禁：放弃持久化，本次会话内存态仍生效
  }
  for (const listener of favoriteListeners) listener()
}

// —— M-121：模型思考强度独立记忆（Per-Model Sticky Memory）——

const EFFORTS_STORAGE_KEY = 'dsh003.model-picker.model-efforts'

function readStoredEfforts(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(EFFORTS_STORAGE_KEY)
    if (raw === null) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const result: Record<string, string> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string') result[k] = v
    }
    return result
  } catch {
    return {}
  }
}

let effortsSnapshot: Record<string, string> = readStoredEfforts()

/** 获取特定模型已记忆的思考强度（若从未设定过则返回 undefined）。 */
export function getModelEffort(providerId: string, modelId: string): string | undefined {
  const key = favoriteKeyOf(providerId, modelId)
  return effortsSnapshot[key]
}

/** 记录特定模型的思考强度并持久化到 localStorage。 */
export function setModelEffort(providerId: string, modelId: string, effortId: string): void {
  const key = favoriteKeyOf(providerId, modelId)
  if (effortsSnapshot[key] === effortId) return
  effortsSnapshot = {
    ...effortsSnapshot,
    [key]: effortId,
  }
  try {
    window.localStorage.setItem(EFFORTS_STORAGE_KEY, JSON.stringify(effortsSnapshot))
  } catch {
    // 存储配额满或受限时内存态依然生效
  }
}
