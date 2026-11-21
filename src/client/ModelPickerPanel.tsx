/**
 * M2-005a 模型选择器面板（分栏收藏形态，用户参考图拍板 + 验收反馈三项修订）：
 * 顶栏（收藏入口 + 搜索）→ 主体（左提供方 logo 列 | 右模型列表带收藏星标）→ 底部运行框架占位。
 * M-051：左栏首字母色块升级为品牌 logo（provider-logos.tsx，未收录回退首字母）。
 * 数据来自 model-catalog.ts 真目录（providers = 会话可服务路由分组）；行单行模型名（验收反馈：不留 ID 副标题）。
 * 纯受控组件：目录快照/当前选择/收藏/回调全部由 ModelPickerButton 喂入。
 * 收藏视图：右栏跨提供方汇总收藏的模型，行两行制（模型名 + 供应商名副行，M-054，行高 36px 不变）。搜索：模型 id/名称（收藏视图含提供方名）子串过滤。
 */
import * as React from 'react'
import {
  CheckIcon,
  CloseIcon,
  PlusIcon,
  ScrollArea,
  SearchIcon,
  StarIcon,
  isImeComposing,
  useSlidingIndicator,
} from '@kewen/dsh-ui'
import { MenuSurface } from './MenuSurface'
import { Tooltip } from './host-primitives'

import { favoriteKeyOf, getFavoriteSet, subscribeFavorites, toggleFavorite } from './picker-data'
import { isMagpieRoute, magpieGatewayLabel, splitMagpieModelName } from './magpie-display'
import { effortKeyOf } from './effort-labels'
import { ProviderLogo, providerIconKey } from './provider-logos'
import { protocolBadges } from './protocol-badge'
import { displayProviderIcon, displayProviderName } from './display-identity'
import { searchPlaceholder } from './search-placeholder'
import { format, pickerFallback, type PickerKey, type Translate } from './locales'
import type { CatalogGroupSnapshot } from './model-catalog'
import { useProviderSort } from './use-provider-sort'

/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
const fallbackTranslate = pickerFallback

/** 把 v 夹在 [lo, hi]。 */
const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi)

/** 空 failures 常量：`props.failures ?? []` 每次 render 新建数组会让下游比对失真。 */
const EMPTY_FAILURES: ReadonlyArray<never> = []

/** 面板行：提供方 + 模型（收藏视图跨提供方汇总用）。
 * 主行 `primary` 与副行 `sub` 是显示层结果：Magpie 的「模型 · 路由来源」显示名拆成两行，
 * 副行补上网关标识；`modelName` 保留上游原值，供搜索与提示使用。 */
interface PickerRow {
  providerId: string
  providerName: string
  modelId: string
  modelName: string
  primary: string
  sub: string | null
}

/** 构造一行显示数据。
 * Magpie 模型一律两行（模型 / 网关 · 路由来源），与所在视图无关；
 * 其余供应商只在收藏视图借副行标注来源（跨供应商汇总时需要），供应商视图保持单行紧凑。
 * @param favView - 当前是否收藏视图。
 */
function buildRow(
  provider: CatalogGroupSnapshot,
  model: { id: string; name: string },
  favView: boolean,
): PickerRow {
  const providerName = displayProviderName(provider)
  const split = isMagpieRoute(provider.id) ? splitMagpieModelName(model.name) : null
  // Magpie 副行写作「网关 · 路由来源」：网关名取自该路由显示名的首段（尊重用户配置的网关名），
  // 路由来源是模型显示名分隔符之后那段（如 Qoder CN）。拆不出格式时回退单行原名。
  const sub = split !== null
    ? `${magpieGatewayLabel(providerName)} \u00b7 ${split.route}`
    : (favView ? providerName : null)
  return {
    providerId: provider.id,
    providerName,
    modelId: model.id,
    modelName: model.name,
    primary: split?.model ?? model.name,
    sub,
  }
}

/** 模型名单元：被省略号截断时，悬停显示完整名。
 * 原生 title 在本应用不可靠——行悬停会展开右侧星标、挤窄文本，这次布局重排会不断重置
 * 原生提示的计时器，实测悬停不出来；宿主 Tooltip 由 JS 驱动，不受重排影响。
 * 是否截断在指针进入时按当时布局实测（此刻星标已展开，量到的正是悬停态可用宽度），
 * 未截断则抑制气泡；离开时复位，使下一次进入重新判定。 */
function ModelName(props: { name: string }): React.ReactNode {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [fits, setFits] = React.useState(false)
  const measure = (): void => {
    const el = ref.current
    if (el === null) return
    setFits(el.scrollWidth <= el.clientWidth)
  }
  return (
    <Tooltip label={props.name} side="top" align="end" delayMs={150} portal disabled={fits}>
      <span
        ref={ref}
        className="dsh003-picker-model-name"
        onMouseEnter={measure}
        onMouseLeave={() => setFits(false)}
      >
        {props.name}
      </span>
    </Tooltip>
  )
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
  /** 行点击原样转发；是否 no-op 由调用方决定。 */
  onPick(providerId: string, modelId: string): void
  partial?: boolean
  /** 加载失败的提供方，逐项显示原因并提供重试。 */
  failures?: ReadonlyArray<{ id: string; name?: string; message: string }>
  /** 重新加载目录；失败行与加载失败都会用到。 */
  onReload?(): void
  pending?: boolean
  /** 整个目录加载失败的原因；配 onReload 的「重试」按钮。 */
  catalogError?: string | null
  /** 模型或档位切换失败的提示；只显示文字，不配重试（重试目录救不回一次切换，重新点选即可）。 */
  selectionError?: string | null
  onSelectEffort?(effortId: string): void
  /** 点击顶栏「+」打开宿主「设置 → 模型 / 供应商」页面（可选；外部复用时不传则隐藏）。 */
  onOpenSettings?(): void
  onClose(): void
  /** 官方模型菜单附加选项插槽（RC2 conversation.input.model.options，如团队模式开关）。 */
  optionsSlot?: React.ReactNode
}): React.ReactNode {
  const { providers, current, catalogStatus } = props
  const providerSort = useProviderSort(providers)
  // 同一网关按协议拆出的路由图标相同，给撞图标的路由补协议角标（R / A）。
  const badges = React.useMemo(() => protocolBadges(providers.map(provider => {
    const icon = displayProviderIcon(provider)
    return { id: provider.id, iconKey: providerIconKey(icon.providerId, icon.name) }
  })), [providers])
  const favorites = React.useSyncExternalStore(subscribeFavorites, getFavoriteSet)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  const searchToggleRef = React.useRef<HTMLButtonElement | null>(null)
  const activeProvRef = React.useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = React.useRef<'panel' | 'toggle' | null>(null)
  const [searchExpanded, setSearchExpanded] = React.useState(false)
  // 桌面端打开面板后把焦点落到面板容器上（触屏不自动抢焦点），方向键、Esc 与直接打字即刻生效。
  React.useLayoutEffect(() => {
    if (window.matchMedia?.('(pointer: coarse)').matches === true) return
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  React.useLayoutEffect(() => {
    if (searchExpanded) {
      const input = searchRef.current
      if (input !== null) {
        input.focus({ preventScroll: true })
        const len = input.value.length
        try { input.setSelectionRange(len, len) } catch { /* ignore */ }
      }
      return
    }
    const target = restoreFocusRef.current
    restoreFocusRef.current = null
    if (target === 'toggle') searchToggleRef.current?.focus({ preventScroll: true })
    else if (target === 'panel') panelRef.current?.focus({ preventScroll: true })
  }, [searchExpanded])

  const openSearch = (initialQuery?: string): void => {
    providerSort.cancel()
    if (initialQuery !== undefined) setQuery(initialQuery)
    setSearchExpanded(true)
  }

  const closeSearch = (focusTarget: 'panel' | 'toggle' = 'toggle'): void => {
    restoreFocusRef.current = focusTarget
    setQuery('')
    setSearchExpanded(false)
  }

  const t = props.t ?? fallbackTranslate
  const onPanelKeyDown = (event: React.KeyboardEvent): void => {
    if (isImeComposing(event)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      if (searchExpanded) {
        closeSearch('panel')
        return
      }
      cancelDragRef.current?.()
      keyboardPreviewRef.current = false
      snapIndexRef.current = null
      props.onClose()
      return
    }
    if (!searchExpanded) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        openSearch()
        return
      }
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null
        const inEditable = target !== null && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        if (!inEditable) {
          if (event.key === '/') {
            event.preventDefault()
            openSearch()
            return
          }
          if (event.key.length === 1 && event.key !== ' ') {
            event.preventDefault()
            openSearch(event.key)
            return
          }
        }
      }
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const rows = Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>('.dsh003-picker-model-row') ?? [])
    const index = rows.indexOf(event.target as HTMLButtonElement)
    if (event.target !== panelRef.current && event.target !== searchRef.current && index < 0) return
    if (rows.length === 0) return
    event.preventDefault()
    const next = index < 0
      ? event.key === 'ArrowDown' ? 0 : rows.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length
    rows[next]?.focus({ preventScroll: true })
    rows[next]?.scrollIntoView({ block: 'nearest' })
  }

  // 打开面板优先定位到当前模型所在的提供方；否则回退到记忆值或第一个。
  // 仅挂载时计算（惰性初值），后续同步见下方 effect——原先写成带依赖的 useMemo，
  // 重算结果会被 useState 丢弃，容易误读成参与同步。
  const [favView, setFavView] = React.useState(rememberedFavView)
  const [query, setQuery] = React.useState('')
  const [activeProviderId, setActiveProviderId] = React.useState<string>(() => {
    if (current?.provider && providers.some(p => p.id === current.provider)) {
      return current.provider
    }
    if (rememberedProviderId !== '' && providers.some(p => p.id === rememberedProviderId)) {
      return rememberedProviderId
    }
    return providerSort.sorted[0]?.id ?? ''
  })

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

  // 视口自动滚动至当前激活模型与当前激活供应商 Tab
  const activeRowRef = React.useRef<HTMLButtonElement | null>(null)
  React.useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ block: 'nearest' })
    }
    if (activeProvRef.current) {
      activeProvRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }, [activeProviderId, favView, searchExpanded])

  const normalized = query.trim().toLocaleLowerCase()

  // 底部思考深度：提取当前模型及其档位
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

  // —— 滑杆机制（完全对齐原思考深度/等级选择器 EffortPickerButton.tsx，横向化映射）——
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
  }, [props.pending, props.catalogError, props.selectionError])

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
    ? clamp(Math.round(dragRatio * maxIndex), 0, maxIndex)
    : clamp(snapIndex ?? activeIndex, 0, maxIndex)
  const positionRatio = dragRatio !== null ? dragRatio : (effortCount > 1 ? liveIndex / (effortCount - 1) : 0)

  const displayedEffortName = React.useMemo(() => {
    if (!efforts || efforts.length === 0) return ''
    const level = efforts[liveIndex]
    if (level === undefined) return ''
    // 档位名由宿主提供（通常英文）；这里跟随界面语言，与按钮显示保持一致。
    const key = effortKeyOf(level.name)
    return key === undefined ? level.name : t(key)
  }, [efforts, liveIndex, t])

  const commitEffort = (): void => {
    if (!keyboardPreviewRef.current) return
    keyboardPreviewRef.current = false
    if (!efforts) return
    const idx = clamp(snapIndexRef.current ?? activeIndex, 0, efforts.length - 1)
    const next = efforts[idx]
    if (next !== undefined && next.id !== effectiveEffort) {
      props.onSelectEffort?.(next.id)
    }
  }

  const onSliderKeyDown = (e: React.KeyboardEvent): void => {
    if (!efforts || efforts.length < 2) return
    const maxIdx = efforts.length - 1
    const base = clamp(snapIndexRef.current ?? activeIndex, 0, maxIdx)
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
    // 点击轨道直达：pointerdown 即锁最近档（轨道端帽半径 10px，珠心活动区间 [10, width - 10]）
    if (efforts !== undefined && efforts.length >= 2 && dragRectRef.current !== null) {
      const rect0 = dragRectRef.current
      const raw0 = (e.clientX - rect0.left - 10) / Math.max(rect0.width - 20, 1)
      lockSnap(Math.round(clamp(raw0, 0, 1) * (efforts.length - 1)))
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
      const clamped = clamp(raw, 0, 1)
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
        ? clamp(Math.round(started * (efforts.length - 1)), 0, efforts.length - 1)
        : clamp(snapIndexRef.current ?? activeIndex, 0, efforts.length - 1)
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
          rows.push(buildRow(provider, model, true))
        }
      }
    }
    return rows
  }, [favView, providers, favorites])

  const activeProvider = providers.find(p => p.id === activeProviderId) ?? providerSort.sorted[0]
  // 接入 @kewen/dsh-ui 滑动指示器：切换收藏/供应商 Tab 时 220ms 平滑滑动圆头底线；
  // 搜索态卸载供应商栏时传 false 回收，收起搜索重挂载后瞬时归位。
  const activeTabKey = searchExpanded ? false : (favView ? '__fav__' : (activeProvider?.id ?? ''))
  useSlidingIndicator(providerSort.listRef, activeTabKey, {
    itemSelector: '.dsh003-picker-prov',
    indicatorClass: 'dsh003-picker-prov-ind',
  })
  const sourceRows = React.useMemo(() => {
    if (favView) return favoriteRows
    if (!activeProvider) return []
    return activeProvider.models.map(model => buildRow(activeProvider, model, false))
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
    // 是否 no-op（点当前模型）由调用方决定，规则与理由见 ModelPickerButton.pick；这里只转发。
    props.onPick(providerId, modelId)
  }
  const toggleStar = (e: React.SyntheticEvent, providerId: string, modelId: string): void => {
    e.stopPropagation()
    toggleFavorite(providerId, modelId)
  }

  // 原生 non-passive wheel 监听：垂直滚轮转横向滚动，且真正阻止事件穿透滚动底层页面。
  React.useEffect(() => {
    if (searchExpanded) return
    const el = providerSort.listRef.current
    if (el === null) return
    const onWheel = (event: WheelEvent): void => {
      if (el.scrollWidth <= el.clientWidth) return
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      el.scrollLeft += event.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('wheel', onWheel) }
  }, [searchExpanded, providerSort.listRef])

  return (
    <MenuSurface ref={panelRef} tabIndex={-1} className="dsh003-picker-panel" role="dialog" aria-label={t('dialogLabel')} style={props.containerStyle} onKeyDown={onPanelKeyDown}>
      <div className="dsh003-picker-inner">
      <div className="dsh003-picker-body">
        {searchExpanded ? (
          <div className="dsh003-picker-topbar dsh003-picker-topbar-searching">
            <div className="dsh003-picker-search-box">
              <span className="dsh003-picker-search-icon"><SearchIcon size={14} inline={false} /></span>
              <input
                ref={searchRef}
                type="text"
                className="dsh003-picker-search"
                placeholder={placeholder}
                aria-label={t('searchNeutral')}
                title={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (isImeComposing(e)) e.stopPropagation()
                }}
              />
              <Tooltip label={t('searchCloseLabel')} side="top" delayMs={120} portal>
                <button
                  type="button"
                  className="dsh003-picker-top-btn dsh003-picker-search-close"
                  aria-label={t('searchCloseLabel')}
                  onClick={() => closeSearch('toggle')}
                >
                  <CloseIcon size={14} inline={false} />
                </button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="dsh003-picker-topbar">
            <div className="dsh003-picker-prov-rail-wrap">
              <div
                ref={providerSort.listRef}
                className="dsh003-picker-prov-list"
                role="tablist"
                aria-label={t('providerRailLabel')}
                data-sorting={providerSort.drag ? 'true' : undefined}
              >
                <Tooltip label={t('favoritesLabel')} side="top" delayMs={120} portal>
                  <button
                    ref={favView ? activeProvRef : undefined}
                    type="button"
                    role="tab"
                    aria-selected={favView}
                    className="dsh003-picker-prov dsh003-picker-prov-fav"
                    data-active={favView ? 'true' : 'false'}
                    aria-label={t('favoritesLabel')}
                    onClick={() => {
                      rememberedFavView = !favView
                      setFavView(!favView)
                    }}
                  >
                    <StarIcon size={19} inline={false} filled={favView} />
                  </button>
                </Tooltip>
                {providerSort.sorted.map(provider => {
                  const isActive = !favView && provider.id === activeProvider?.id
                  const providerLabel = displayProviderName(provider)
                  return (
                    <Tooltip
                      key={provider.id}
                      label={providerLabel}
                      side="top"
                      delayMs={120}
                      portal
                      disabled={providerSort.drag !== null}
                    >
                      <button
                        ref={isActive ? activeProvRef : undefined}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className="dsh003-picker-prov"
                        data-provider-id={provider.id}
                        data-dragging={providerSort.drag?.id === provider.id ? 'true' : undefined}
                        data-insert={providerSort.drag?.before === provider.id ? 'before' : undefined}
                        style={providerSort.drag?.id === provider.id ? { transform: `translateX(${providerSort.drag.offset}px)` } : undefined}
                        data-active={isActive ? 'true' : 'false'}
                        aria-label={providerLabel}
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
                        <ProviderLogo {...displayProviderIcon(provider)} badge={badges.get(provider.id)} />
                      </button>
                    </Tooltip>
                  )
                })}
                {providerSort.drag?.before === null && <span className="dsh003-picker-prov-insert-end" aria-hidden="true" />}
                {props.onOpenSettings !== undefined && (
                  <Tooltip label={t('manageProvidersLabel')} side="top" delayMs={120} portal>
                    <button
                      type="button"
                      className="dsh003-picker-top-btn dsh003-picker-add-prov"
                      aria-label={t('manageProvidersLabel')}
                      onClick={() => props.onOpenSettings?.()}
                    >
                      <PlusIcon size={14} inline={false} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="dsh003-picker-topbar-actions">
              <Tooltip label={t('searchToggleLabel')} side="top" delayMs={120} portal>
                <button
                  ref={searchToggleRef}
                  type="button"
                  className="dsh003-picker-top-btn dsh003-picker-search-toggle"
                  aria-label={t('searchToggleLabel')}
                  onClick={() => openSearch()}
                >
                  <SearchIcon size={14} inline={false} />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
        <ScrollArea className="dsh003-picker-model-scroll" viewportClassName="dsh003-picker-model-list">
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
                data-sub={row.sub !== null ? 'true' : 'false'}
                onClick={() => pick(row.providerId, row.modelId)}
              >
                {row.sub !== null ? (
                  <span className="dsh003-picker-model-text">
                    <span className="dsh003-picker-model-title">
                      <ModelName name={row.primary} />
                      {active && (
                        <span className="dsh003-picker-row-check" aria-hidden="true">
                          <CheckIcon size={13} inline={false} />
                        </span>
                      )}
                    </span>
                    <span className="dsh003-picker-model-sub">{row.sub}</span>
                  </span>
                ) : (
                  <span className="dsh003-picker-model-title">
                    <ModelName name={row.primary} />
                    {active && (
                      <span className="dsh003-picker-row-check" aria-hidden="true">
                        <CheckIcon size={13} inline={false} />
                      </span>
                    )}
                  </span>
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
                  <StarIcon size={14} inline={false} filled={favorites.has(key)} />
                </span>
              </button>
            )
          })}
        </ScrollArea>
      </div>
      {/* 逐个提供方给出失败原因 + 重试。只显示一句「部分提供方加载失败」会让用户
          不知道该去改哪个配置；宿主其实已经在 failures 里给了 id / name / message。
          交互照官方 ModelSelect：同样的 retry 按钮、同样的位置（列表下方）。 */}
      {(props.failures ?? EMPTY_FAILURES).map(failure => (
        <p key={failure.id} className="dsh003-picker-notice" role="status">
          <span>{format(t('providerLoadFailed'), {
            name: failure.name ?? failure.id,
            message: failure.message,
          })}</span>
          {props.onReload && (
            <button type="button" className="dsh003-picker-retry" onClick={props.onReload}>
              {t('retry')}
            </button>
          )}
        </p>
      ))}
      {props.partial && (props.failures ?? EMPTY_FAILURES).length === 0 && (
        <p className="dsh003-picker-notice" role="status">{t('partialProviders')}</p>
      )}
      {/* 整个目录加载失败：给可点的重试，而不是让用户关掉面板重开。 */}
      {props.catalogError && (
        <p className="dsh003-picker-empty" role="alert">
          <span>{props.catalogError}</span>
          {props.onReload && (
            <button type="button" className="dsh003-picker-retry" onClick={props.onReload}>
              {t('retry')}
            </button>
          )}
        </p>
      )}
      {/* 切换失败单独一行、不带按钮：「重试」只会重拉目录，既不重提这次选择也清不掉提示。
          两行可同时出现，避免切换错误盖住真正的目录错误。 */}
      {props.selectionError && (
        <p className="dsh003-picker-empty" role="alert">
          <span>{props.selectionError}</span>
        </p>
      )}
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
                  width: `calc(20px + (100% - 20px) * ${positionRatio})`,
                }}
              />
              {efforts.map((level, i) => {
                const tickRatio = effortCount > 1 ? i / (effortCount - 1) : 0
                const isMax = i === effortCount - 1
                const nameKey = effortKeyOf(level.name)
                const tickTitle = level.description ?? (nameKey === undefined ? level.name : t(nameKey))
                return (
                  <span
                    key={level.id}
                    className="dsh003-picker-tick"
                    data-max={isMax ? 'true' : 'false'}
                    style={{
                      left: `calc(10px + (100% - 20px) * ${tickRatio})`,
                    }}
                    title={tickTitle}
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
      {props.optionsSlot != null && (
        <div className="dsh003-picker-options">
          {props.optionsSlot}
        </div>
      )}
      </div>
    </MenuSurface>
  )
}
