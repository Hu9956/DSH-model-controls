/**
 * M2-005a 模型选择器面板（分栏收藏形态，用户参考图拍板 + 验收反馈三项修订）：
 * 顶栏（收藏入口 + 搜索）→ 主体（左提供方 logo 列 | 右模型列表带收藏星标）→ 底部运行框架占位。
 * M-051：左栏首字母色块升级为品牌 logo（provider-logos.tsx，未收录回退首字母）。
 * 数据来自 model-catalog.ts 真目录（providers = 会话可服务路由分组）；行单行模型名（验收反馈：不留 ID 副标题）。
 * 纯受控组件：目录快照/当前选择/收藏/回调全部由 ModelPickerButton 喂入。
 * 收藏视图：右栏跨提供方汇总收藏的模型，行两行制（模型名 + 供应商名副行，M-054，行高 36px 不变）。搜索：模型 id/名称（收藏视图含提供方名）子串过滤。
 */
import * as React from 'react'
import { MenuSurface } from '@deepseek-ai/dsh-client-ui-primitives'

import { favoriteKeyOf, getFavoriteSet, subscribeFavorites, toggleFavorite } from './picker-data'
import { ProviderLogo } from './provider-logos'
import { displayProviderIcon, displayProviderName } from './display-identity'
import { searchPlaceholder } from './search-placeholder'
import { format, pickerZh, type PickerKey, type Translate } from './locales'
import type { CatalogGroupSnapshot } from './model-catalog'
import { useProviderSort } from './use-provider-sort'

/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
const fallbackTranslate: Translate<PickerKey> = (key, params) => format(pickerZh[key], params)

function StarIcon(props: { filled: boolean }): React.ReactNode {
  // lucide star（24 viewBox）：统一保留 2px 描边边界，避免实心填充消除描边外扩导致视觉缩小（10%跳变）
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill={props.filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function SearchIcon(): React.ReactNode {
  // lucide search（24 viewBox），与星标同族同笔画
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx={11} cy={11} r={7} />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function CheckIcon(): React.ReactNode {
  // lucide check（24 viewBox），与星标/搜索同族同笔画（2px 描边 + 圆角端点与拐角，几何平滑无形变）
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/** 面板行：提供方 + 模型（收藏视图跨提供方汇总用）。 */
interface PickerRow {
  providerId: string
  providerName: string
  modelId: string
  modelName: string
}

// 会话内视图记忆：面板关闭即卸载，用模块级变量把「收藏夹视图开关 / 选中的提供方」带到
// 下次打开（搜索词是一次性过滤意图，不记忆）。提供方被删时由 find 兜底回第一个。
let rememberedFavView = false
let rememberedProviderId = ''

export function ModelPickerPanel(props: {
  /** 面板文案的语言读取器；缺省用中文兜底。 */
  t?: Translate<PickerKey>
  /** 目录加载状态（loading/error 显示占位行） */
  catalogStatus: 'idle' | 'loading' | 'ready' | 'error'
  providers: ReadonlyArray<CatalogGroupSnapshot>
  /** 当前选择（provider id + model id + reasoningEffort） */
  current: { provider: string; model: string; reasoningEffort?: string } | null
  /** 弹层定位及可用高度，由触发按钮计算传入。 */
  containerStyle?: React.CSSProperties
  onPick(providerId: string, modelId: string): void
  partial?: boolean
  pending?: boolean
  error?: string | null
  onSelectEffort?(effortId: string): void
  onClose(): void
}): React.ReactNode {
  const { providers, current, catalogStatus } = props
  const providerSort = useProviderSort(providers)
  const favorites = React.useSyncExternalStore(subscribeFavorites, getFavoriteSet)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  React.useLayoutEffect(() => { searchRef.current?.focus({ preventScroll: true }) }, [])

  const t = props.t ?? fallbackTranslate
  const onPanelKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      cancelDragRef.current?.()
      keyboardPreviewRef.current = false
      snapIndexRef.current = null
      props.onClose()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const rows = Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>('.dsh003-picker-model-row') ?? [])
    const index = rows.indexOf(event.target as HTMLButtonElement)
    if (event.target !== searchRef.current && index < 0) return
    if (rows.length === 0) return
    event.preventDefault()
    const next = index < 0
      ? event.key === 'ArrowDown' ? 0 : rows.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length
    rows[next]?.focus({ preventScroll: true })
    rows[next]?.scrollIntoView({ block: 'nearest' })
  }

  // 打开面板优先定位到当前模型所在的提供方；否则回退到记忆值或第一个
  const initialProviderId = React.useMemo(() => {
    if (current?.provider && providers.some(p => p.id === current.provider)) {
      return current.provider
    }
    if (rememberedProviderId !== '' && providers.some(p => p.id === rememberedProviderId)) {
      return rememberedProviderId
    }
    return providerSort.sorted[0]?.id ?? ''
  }, [current?.provider, providers, providerSort.sorted])

  const [favView, setFavView] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeProviderId, setActiveProviderId] = React.useState<string>(initialProviderId)

  const observedProvider = React.useRef(current?.provider)
  // 跟随实际模型切换；目录刷新保留正在浏览的供应商，失效后才回退。
  React.useEffect(() => {
    const changed = observedProvider.current !== current?.provider
    observedProvider.current = current?.provider
    const currentId = providers.some(p => p.id === current?.provider) ? current?.provider : undefined
    setActiveProviderId(active => {
      if (changed && currentId) return currentId
      if (providers.some(p => p.id === active)) return active
      return currentId ?? providerSort.sorted[0]?.id ?? ''
    })
  }, [current?.provider, providers, providerSort.sorted])

  // 视口自动滚动至当前激活模型
  const activeRowRef = React.useRef<HTMLButtonElement | null>(null)
  React.useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [activeProviderId, favView])

  const normalized = query.trim().toLocaleLowerCase()

  // 底部推理等级：提取当前模型及其档位
  const currentProvider = providers.find(p => p.id === current?.provider)
  const currentModel = currentProvider?.models.find(m => m.id === current?.model)
  const reasoning = currentModel?.reasoning
  const efforts = reasoning?.efforts
  const effectiveEffort = current?.reasoningEffort ?? reasoning?.defaultEffort
  const hasEfforts = efforts !== undefined && efforts.length > 1
  const effortCount = efforts?.length ?? 1

  const activeIndex = React.useMemo(() => {
    if (!efforts || !effectiveEffort) return 0
    const idx = efforts.findIndex(e => e.id === effectiveEffort)
    return idx >= 0 ? idx : 0
  }, [efforts, effectiveEffort])

  // —— 滑杆机制（完全对齐原推理等级选择器 EffortPickerButton.tsx，横向化映射）——
  // 行为三条：
  // ① 点击轨道=珠直接滑到点击处最近档（pointerdown 即锁，原生 range onChange 等价）
  // ② 拖动=5px 阈值越过才判拖动（手抖微动=点击），拖动中 1:1 跟手，data-dragging 关位移过渡零迟滞
  // ③ 松手=吸附最近档并生效（commit 一次）
  const [dragRatio, setDragRatio] = React.useState<number | null>(null)
  const [snapIndex, setSnapIndex] = React.useState<number | null>(null)
  const snapIndexRef = React.useRef<number | null>(null)
  const dragRectRef = React.useRef<DOMRect | null>(null)
  const downRef = React.useRef(false)
  const dragRatioRef = React.useRef<number | null>(null)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const cancelDragRef = React.useRef<(() => void) | null>(null)
  const keyboardPreviewRef = React.useRef(false)

  const lockSnap = (idx: number): void => {
    snapIndexRef.current = idx
    setSnapIndex(idx)
  }

  // 目录追上本地锁后清除 snapIndex
  React.useEffect(() => {
    if (snapIndex !== null && activeIndex === snapIndex) {
      snapIndexRef.current = null
      setSnapIndex(null)
    }
  }, [activeIndex, snapIndex])

  React.useEffect(() => {
    if (!props.pending) {
      snapIndexRef.current = null
      setSnapIndex(null)
    }
  }, [props.pending, props.error])

  React.useLayoutEffect(() => {
    cancelDragRef.current?.()
    keyboardPreviewRef.current = false
    snapIndexRef.current = null
    setSnapIndex(null)
    dragRatioRef.current = null
    setDragRatio(null)
    return () => { cancelDragRef.current?.() }
  }, [current?.provider, current?.model])

  const maxIndex = Math.max(effortCount - 1, 0)
  const liveIndex = dragRatio !== null
    ? Math.min(Math.max(Math.round(dragRatio * maxIndex), 0), maxIndex)
    : Math.min(Math.max(snapIndex ?? activeIndex, 0), maxIndex)
  const positionRatio = dragRatio !== null ? dragRatio : (effortCount > 1 ? liveIndex / (effortCount - 1) : 0)

  const displayedEffortName = React.useMemo(() => {
    if (!efforts || efforts.length === 0) return ''
    return efforts[liveIndex]?.name ?? ''
  }, [efforts, liveIndex])

  const commitEffort = (): void => {
    if (!keyboardPreviewRef.current) return
    keyboardPreviewRef.current = false
    if (!efforts) return
    const idx = Math.min(Math.max(snapIndexRef.current ?? activeIndex, 0), efforts.length - 1)
    const next = efforts[idx]
    if (next !== undefined && next.id !== effectiveEffort) {
      props.onSelectEffort?.(next.id)
    }
  }

  const onSliderKeyDown = (e: React.KeyboardEvent): void => {
    if (!efforts || efforts.length < 2) return
    const maxIdx = efforts.length - 1
    const base = Math.min(Math.max(snapIndexRef.current ?? activeIndex, 0), maxIdx)
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(base + 1, maxIdx)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(base - 1, 0)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = maxIdx
    if (next === null) return
    e.preventDefault()
    keyboardPreviewRef.current = true
    lockSnap(next)
  }

  const beginDrag = (e: React.PointerEvent): void => {
    if (e.button !== 0 || !e.isPrimary) return
    cancelDragRef.current?.()
    keyboardPreviewRef.current = false
    const hitEl = e.currentTarget as HTMLDivElement
    const pointerId = e.pointerId
    downRef.current = true
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    dragRectRef.current = hitEl.getBoundingClientRect()
    dragRatioRef.current = null
    // 点击轨道直达：pointerdown 即锁最近档
    if (efforts !== undefined && efforts.length >= 2 && dragRectRef.current !== null) {
      const rect0 = dragRectRef.current
      const raw0 = (e.clientX - rect0.left - 10) / Math.max(rect0.width - 20, 1)
      lockSnap(Math.round(Math.min(Math.max(raw0, 0), 1) * (efforts.length - 1)))
    }
    try {
      hitEl.setPointerCapture(e.pointerId)
    } catch {
      // 忽略已被捕获
    }
    const onMove = (ev: PointerEvent): void => {
      if (!downRef.current || ev.pointerId !== pointerId || dragRectRef.current === null) return
      // 拖动阈值：平面位移越过 5px 才进入跟手（区分点击与拖动）
      if (Math.hypot(ev.clientX - startXRef.current, ev.clientY - startYRef.current) < 5) return
      const rect = dragRectRef.current
      const raw = (ev.clientX - rect.left - 10) / Math.max(rect.width - 20, 1)
      const clamped = Math.min(Math.max(raw, 0), 1)
      dragRatioRef.current = clamped
      setDragRatio(clamped)
    }
    const cleanup = (): void => {
      downRef.current = false
      cancelDragRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('blur', cancel)
      hitEl.removeEventListener('lostpointercapture', onCancel)
      try { hitEl.releasePointerCapture(pointerId) } catch { /* Capture may already be released. */ }
      dragRectRef.current = null
      dragRatioRef.current = null
      setDragRatio(null)
    }
    const cancel = (): void => {
      cleanup()
      snapIndexRef.current = null
      setSnapIndex(null)
    }
    const onCancel = (ev: PointerEvent): void => {
      if (ev.pointerId === pointerId && downRef.current) cancel()
    }
    const onEnd = (ev: PointerEvent): void => {
      if (ev.pointerId !== pointerId || !downRef.current) return
      const started = dragRatioRef.current
      cleanup()
      if (!efforts || efforts.length < 2) return
      const idx = started !== null
        ? Math.min(Math.max(Math.round(started * (efforts.length - 1)), 0), efforts.length - 1)
        : Math.min(Math.max(snapIndexRef.current ?? activeIndex, 0), efforts.length - 1)
      lockSnap(idx)
      const next = efforts[idx]
      if (next !== undefined && next.id !== effectiveEffort) {
        props.onSelectEffort?.(next.id)
      }
    }
    cancelDragRef.current = cancel
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('blur', cancel)
    hitEl.addEventListener('lostpointercapture', onCancel)
  }

  // 收藏视图的汇总行：收藏键 → 提供方 + 模型（键失效自动跳过）
  const favoriteRows = React.useMemo(() => {
    const rows: PickerRow[] = []
    if (!favView) return rows
    for (const provider of providers) {
      for (const model of provider.models) {
        if (favorites.has(favoriteKeyOf(provider.id, model.id))) {
          rows.push({ providerId: provider.id, providerName: displayProviderName(provider), modelId: model.id, modelName: model.name })
        }
      }
    }
    return rows
  }, [favView, providers, favorites])

  const activeProvider = providers.find(p => p.id === activeProviderId) ?? providerSort.sorted[0]
  const sourceRows = React.useMemo(() => {
    if (favView) return favoriteRows
    if (!activeProvider) return []
    return activeProvider.models.map(model => ({ providerId: activeProvider.id, providerName: displayProviderName(activeProvider), modelId: model.id, modelName: model.name }))
  }, [favView, favoriteRows, activeProvider])
  const visibleRows = React.useMemo(() => {
    const matches = (text: string): boolean => text.toLocaleLowerCase().includes(normalized)
    return normalized === '' ? sourceRows : sourceRows.filter(row =>
      matches(row.modelName) || matches(row.modelId) || (favView && matches(row.providerName)))
  }, [sourceRows, normalized, favView])
  const emptyText = catalogStatus === 'loading' ? t('loadingCatalog')
    : catalogStatus === 'error' ? t('loadFailed')
    : normalized !== '' ? t('emptyNoMatch')
    : favView ? t('emptyFavorites')
    : activeProvider ? t('emptyProvider') : t('emptyCatalog')
  // 占位文字随所在视图变化：收藏视图跨供应商，不写名字；供应商视图写显示名。
  const placeholder = searchPlaceholder(favView, activeProvider ? displayProviderName(activeProvider) : undefined, t)

  const pick = (providerId: string, modelId: string): void => {
    const isCurrent = current?.provider === providerId && current?.model === modelId
    if (isCurrent) {
      // 点选当前已选中的模型：纯粹保持选中（no-op），杜绝连击或手抖误触闪退卡片
      return
    }
    props.onPick(providerId, modelId)
  }
  const toggleStar = (e: React.SyntheticEvent, providerId: string, modelId: string): void => {
    e.stopPropagation()
    toggleFavorite(providerId, modelId)
  }

  return (
    <MenuSurface ref={panelRef} className="dsh003-picker-panel" role="dialog" aria-label={t('dialogLabel')} style={props.containerStyle} onKeyDown={onPanelKeyDown}>
      <div className="dsh003-picker-body">
        <div className="dsh003-picker-prov-col" role="tablist" aria-label={t('providerRailLabel')}>
          <div className="dsh003-picker-prov-head">
            <button
              type="button"
              className="dsh003-picker-prov dsh003-picker-prov-fav"
              data-active={favView ? 'true' : 'false'}
              aria-label={t('favoritesLabel')}
              title={t('favoritesLabel')}
              onClick={() => {
                rememberedFavView = !favView
                setFavView(!favView)
              }}
            >
              <StarIcon filled={favView} />
            </button>
          </div>
          <div className="dsh003-picker-prov-divider" />
          <div ref={providerSort.listRef} className="dsh003-picker-prov-list" data-sorting={providerSort.drag ? 'true' : undefined}>
            {providerSort.sorted.map(provider => (
              <button
                key={provider.id}
                type="button"
                className="dsh003-picker-prov"
                data-provider-id={provider.id}
                data-dragging={providerSort.drag?.id === provider.id ? 'true' : undefined}
                data-insert={providerSort.drag?.before === provider.id ? 'before' : undefined}
                style={providerSort.drag?.id === provider.id ? { transform: `translateY(${providerSort.drag.offset}px)` } : undefined}
                data-active={!favView && provider.id === activeProvider?.id ? 'true' : 'false'}
                aria-label={displayProviderName(provider)}
                title={format(t('providerReorderHint'), { name: displayProviderName(provider) })}
                onPointerDown={event => providerSort.begin(event, provider.id)}
                onClickCapture={providerSort.suppressClick}
                onKeyDown={event => providerSort.keyboardMove(event, provider.id)}
                onContextMenu={event => event.preventDefault()}
                onClick={() => {
                  rememberedFavView = false
                  rememberedProviderId = provider.id
                  setFavView(false)
                  setActiveProviderId(provider.id)
                }}
              >
                <ProviderLogo {...displayProviderIcon(provider)} />
              </button>
            ))}
            {providerSort.drag?.before === null && <span className="dsh003-picker-prov-insert-end" aria-hidden="true" />}
          </div>
        </div>
        <div className="dsh003-picker-model-col">
          <div className="dsh003-picker-search-row">
            <div className="dsh003-picker-search-box">
              <span className="dsh003-picker-search-icon"><SearchIcon /></span>
              <input
                ref={searchRef}
                type="text"
                className="dsh003-picker-search"
                placeholder={placeholder}
                aria-label={t('searchNeutral')}
                title={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="dsh003-picker-model-list">
            {visibleRows.length === 0 && <p className="dsh003-picker-empty">{emptyText}</p>}
            {visibleRows.map(row => {
              const key = favoriteKeyOf(row.providerId, row.modelId)
              const active = row.providerId === current?.provider && row.modelId === current?.model
              return (
                <button
                  key={key}
                  ref={active ? activeRowRef : undefined}
                  type="button"
                  className="dsh003-picker-model-row"
                  data-active={active ? 'true' : 'false'}
                  data-sub={favView ? 'true' : 'false'}
                  title={row.modelName}
                  onClick={() => pick(row.providerId, row.modelId)}
                >
                  {favView ? (
                    <span className="dsh003-picker-model-text">
                      <span className="dsh003-picker-model-name">{row.modelName}</span>
                      <span className="dsh003-picker-model-sub">{row.providerName}</span>
                    </span>
                  ) : (
                    <span className="dsh003-picker-model-name">{row.modelName}</span>
                  )}
                  <span
                    role="button"
                    tabIndex={0}
                    className="dsh003-picker-row-star"
                    data-fav={favorites.has(key) ? 'true' : 'false'}
                    aria-label={favorites.has(key) ? t('favoriteRemove') : t('favoriteAdd')}
                    onClick={e => toggleStar(e, row.providerId, row.modelId)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (!e.repeat) toggleStar(e, row.providerId, row.modelId)
                      }
                    }}
                  >
                    <StarIcon filled={favorites.has(key)} />
                  </span>
                  {active && (
                    <span className="dsh003-picker-row-check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {props.partial && <p className="dsh003-picker-notice" role="status">{t('partialProviders')}</p>}
      {props.error && <p className="dsh003-picker-empty" role="alert">{props.error}</p>}
      <div className={`dsh003-picker-foot ${hasEfforts ? '' : 'dsh003-picker-foot-disabled'}`}>
        {hasEfforts ? (
          <div className="dsh003-picker-foot-inner">
            <div className="dsh003-picker-foot-info">
              <span className="dsh003-picker-effort-sub">{t('effortLabel')}</span>
              <span className="dsh003-picker-effort-val">{displayedEffortName}</span>
            </div>
            <div
              className="dsh003-picker-slider"
              data-dragging={dragRatio !== null ? 'true' : 'false'}
            >
              <div
                className="dsh003-picker-range"
                role="slider"
                tabIndex={0}
                aria-label={t('effortLabel')}
                aria-orientation="horizontal"
                aria-valuemin={0}
                aria-valuemax={effortCount - 1}
                aria-valuenow={liveIndex}
                aria-valuetext={displayedEffortName}
                onPointerDown={beginDrag}
                onKeyDown={onSliderKeyDown}
                onKeyUp={e => {
                  if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(e.key)) commitEffort()
                }}
                onBlur={() => {
                  if (downRef.current) cancelDragRef.current?.()
                  else commitEffort()
                }}
              />
              <span
                className="dsh003-picker-fill"
                style={{
                  width: `calc(10px + (100% - 20px) * ${positionRatio})`,
                }}
              />
              {efforts.map((level, i) => {
                const tickRatio = effortCount > 1 ? i / (effortCount - 1) : 0
                const isMax = i === effortCount - 1
                return (
                  <span
                    key={level.id}
                    className="dsh003-picker-tick"
                    data-max={isMax ? 'true' : 'false'}
                    style={{
                      left: `calc(10px + (100% - 20px) * ${tickRatio})`,
                    }}
                    title={level.description ?? level.name}
                  />
                )
              })}
              <span
                className="dsh003-picker-knob"
                style={{
                  left: `calc(10px + (100% - 20px) * ${positionRatio})`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="dsh003-picker-slider-empty">
            <span className="dsh003-picker-effort-sub">{t('effortLabel')}</span>
            <span className="dsh003-picker-effort-none">{t('effortUnsupported')}</span>
          </div>
        )}
      </div>
    </MenuSurface>
  )
}
