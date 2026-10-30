/** Session picker backed by the official shared directory; remembers accepted per-model efforts. */
import * as React from 'react'
import { createPortal } from 'react-dom'

import { IconChevronDownOutlineRegular } from './chevron-icon'

import { ModelPickerPanel } from './ModelPickerPanel'
import { pickerPosition } from './picker-position'
import { ProviderLogo } from './provider-logos'
import { displayProviderIcon } from './display-identity'
import { createCatalogAdapter, type ModelDirectoryFace } from './model-catalog'
import { compactModelName, isMagpieRoute, splitMagpieModelName } from './magpie-display'
import { compactNamesEnabled } from './compact-names'
import { effortKeyOf, effortMeterHeight, effortProgress } from './effort-labels'
import { useButtonCollapse } from './use-effort-truncation'
import { format, pickerFallback, type PickerKey, type Translate } from './locales'

/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
const fallbackTranslate = pickerFallback


/** 组件 props：M-049 起 locked 由座位 owner share 透传（原生 disabled 对齐官方触发器）。 */
export interface ModelPickerButtonProps {
  /** composer 锁定态（M-049 座位接线；缺省 false 兼容独立使用）。 */
  directory: ModelDirectoryFace
  locked?: boolean
  /** 选择器文案的语言读取器；缺省用中文兜底。 */
  t?: Translate<PickerKey>
}

export function ModelPickerButton({ locked = false, directory, t = fallbackTranslate }: ModelPickerButtonProps): React.ReactNode {
  const adapter = React.useMemo(() => createCatalogAdapter(directory), [directory])
  const catalog = React.useSyncExternalStore(adapter.subscribe, adapter.getSnapshot)
  const [selectionError, setSelectionError] = React.useState<string | null>(null)
  const selectionRequest = React.useRef(0)
  React.useLayoutEffect(() => {
    selectionRequest.current += 1
    setSelectionError(null)
    return () => { selectionRequest.current += 1 }
  }, [adapter])
  const submit = (provider: string, model: string, effort?: string): void => {
    if (locked) return
    const request = ++selectionRequest.current
    setSelectionError(null)
    void adapter.select(provider, model, effort).then(ok => {
      if (request !== selectionRequest.current) return
      setSelectionError(ok ? null : t('switchFailed'))
    })
  }
  const [open, setOpen] = React.useState(false)
  React.useLayoutEffect(() => { if (locked) setOpen(false) }, [locked])
  // 官方模型入口在右侧：弹层右缘对齐按钮右缘，向左展开。
  const [pos, setPos] = React.useState<React.CSSProperties | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  /** 打开瞬间按钮的视口矩形：滚动时用它判断按钮到底有没有真的挪位。 */
  const anchorRef = React.useRef<DOMRect | null>(null)

  const closeMenu = React.useCallback((restoreFocus = false): void => {
    setOpen(false)
    // 切换失败提示挂在按钮状态上、不随面板卸载；关面板即清掉，下次打开不显示过期提示。
    setSelectionError(null)
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true })
  }, [])

  // 挂载即拉目录（idle→ready 幂等）：按钮模型名回显不等首次点开面板
  React.useEffect(() => { adapter.load() }, [adapter])

  const toggle = (): void => {
    if (locked) return
    if (open) {
      closeMenu()
      return
    }
    const el = buttonRef.current
    if (el === null) return
    const rect = el.getBoundingClientRect()
    anchorRef.current = rect
    setPos(pickerPosition(rect, window.innerWidth, window.innerHeight))
    // 外部关闭（如 locked）不经 closeMenu，打开时再清一次兜底。
    setSelectionError(null)
    adapter.load()
    setOpen(true)
  }

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent): void => {
      const target = e.target as Node
      // 面板内点击（含星标）不关；面板根以类名识别（portal 后按钮容器无关）
      if (target instanceof Element && target.closest('.dsh003-picker-panel') !== null) return
      if (buttonRef.current?.contains(target) === true) return
      closeMenu()
    }
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu(true)
      }
    }
    // M-055：面板内滚动（模型/供应商列表 overflow）不动 fixed 锚点，不关；
    // 页面滚动仍关——但只在按钮**真的跟着挪了**的时候关。
    //
    // 为什么不能无条件关（0.2.35 修）：弹层是 `position: fixed`，它的坐标只跟
    // 视口有关；而 scroll 事件是**捕获阶段**监听在 window 上的，任何内部滚动容器
    // 冒上来都会命中。流式输出插件（dsh-smooth-stream 接管底部跟随）在回答期间
    // 每帧写 conversation 的 scrollTop，于是每帧都触发一次滚动 → 面板点开即关。
    // 判定改成「按钮矩形是否真的位移」：只要按钮没动，弹层就没有失准的理由。
    const onScroll = (e: Event): void => {
      const target = e.target as Node
      if (target instanceof Element && target.closest('.dsh003-picker-panel') !== null) return
      const anchor = anchorRef.current
      const el = buttonRef.current
      if (anchor === null || el === null) return
      const now = el.getBoundingClientRect()
      // 1px 容差：亚像素抖动来自子元素高度的小数变化，不是真的滚动。
      if (Math.abs(now.top - anchor.top) > 1 || Math.abs(now.left - anchor.left) > 1) closeMenu()
    }
    const onReflow = (): void => closeMenu()
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open, closeMenu])

  const selection = catalog.default
  const currentGroup = React.useMemo(() => {
    if (selection === null) return undefined
    return catalog.groups.find(g => g.id === selection.provider)
  }, [catalog.groups, selection])
  const currentModel = React.useMemo(() => {
    if (selection === null) return undefined
    return currentGroup?.models.find(m => m.id === selection.model)
  }, [selection, currentGroup])
  const currentModelName = React.useMemo(() => {
    if (selection === null) return null
    if (currentModel !== undefined) return currentModel.name
    // default 路由不在已公布分组里（仍可服务）：回退显示模型 id
    return selection.model
  }, [selection, currentModel])
  const currentEffortName = React.useMemo(() => {
    if (selection === null) return null
    const reasoning = currentModel?.reasoning
    if (reasoning === undefined || reasoning.efforts.length <= 1) return null
    const effectiveEffort = selection.reasoningEffort ?? reasoning.defaultEffort
    if (effectiveEffort === undefined) return null
    const effort = reasoning.efforts.find(e => e.id === effectiveEffort)
    return effort?.name ?? effectiveEffort
  }, [selection, currentModel])

  /** 按钮显示的模型名：开关关闭时用完整上游名；开启时只压缩模型那一段，
   * `· 路由来源` 原样保留（供应商不改）。Magpie 的显示名是「模型 · 路由来源」，
   * 先拆开再压模型名，否则品牌词不在串首、压不到。 */
  const buttonModelName = React.useMemo(() => {
    if (currentModelName === null) return null
    if (!compactNamesEnabled()) return currentModelName
    const split = isMagpieRoute(selection?.provider ?? '')
      ? splitMagpieModelName(currentModelName)
      : null
    if (split === null) return compactModelName(currentModelName)
    return `${compactModelName(split.model)} \u00b7 ${split.route}`
  }, [selection?.provider, currentModelName])

  /**
   * 这个模型**没有任何**思考档位（不是「关闭」，而是根本没有这个概念）。
   *
   * 必须和「还在加载」区分开：`currentModel` 为 undefined 表示目录里还没找到
   * 这个模型，那时什么都不该画；而这里是有明确答案——它没有档位。
   */
  const hasNoEfforts = currentModel !== undefined
    && (currentModel.reasoning === undefined || currentModel.reasoning.efforts.length <= 1)

  /**
   * 按钮上档位位置的文字。
   *
   * 「没有档位」也走这一条管线，当作一个名叫「无」的档位——它不是特例，
   * 只是在竖条形态下画成一根短轨道（见 `data-none`）。这样折叠判定、
   * 宽度计算、探针测量全都只有一套逻辑，不需要为它开分支。
   *
   * 跟随界面语言：中文「无」/ 英文 `N/A`。
   */
  const buttonEffortName = React.useMemo(() => {
    if (hasNoEfforts) return t('effortNoneShort')
    if (currentEffortName === null) return null
    const key = effortKeyOf(currentEffortName)
    return key === undefined ? currentEffortName : t(key)
  }, [hasNoEfforts, currentEffortName, t])

  /**
   * 竖条的填充比例与实际高度：档位文字被截断时替代它显示。
   *
   * 「没有档位」返回 0——它在竖条形态下画成短轨道、不填充（`data-none`）。
   * progress 用 effortProgress，与面板滑杆严格同刻度（最低档为 0），写进 data-progress；
   * 绘制高度用 effortMeterHeight：12px 高的竖条分不出「0」与「关闭」，所以抬到最小可见高度。
   * 两者原先是两个逐行重复的 memo，合并成一处推导，免得以后只改一边导致刻度与高度对不上。
   */
  const effortMeter = React.useMemo(() => {
    if (hasNoEfforts) return { progress: 0, height: 0 }
    const reasoning = currentModel?.reasoning
    if (reasoning === undefined || reasoning.efforts.length <= 1) return null
    const ids = reasoning.efforts.map(e => e.id)
    const effort = selection?.reasoningEffort ?? reasoning.defaultEffort
    return { progress: effortProgress(ids, effort), height: effortMeterHeight(ids, effort) }
  }, [selection?.reasoningEffort, currentModel, hasNoEfforts])
  // 解构成原始值：下游折叠测量的依赖数组拿对象会每次变化、误触发重测。
  const buttonEffortProgress = effortMeter?.progress ?? null
  const buttonMeterHeight = effortMeter?.height ?? null

  /** 折叠判定：按实测溢出量决定收箭头 / 换竖条，详见 use-effort-truncation.ts。 */
  const logoProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const effortProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const chevronProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const meterProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const labelProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const collapse = useButtonCollapse(
    buttonRef,
    {
      logo: logoProbeRef,
      effort: effortProbeRef,
      chevron: chevronProbeRef,
      meter: meterProbeRef,
      label: labelProbeRef,
    },
    buttonEffortName !== null,
    [buttonEffortName, buttonModelName, buttonEffortProgress],
  )
  const showEffortMeter = buttonEffortProgress !== null && collapse.showMeter

  /** 悬停提示保留完整信息：上游全名 + 档位，不跟按钮一起压缩。 */
  const buttonTitle = React.useMemo(() => {
    const model = currentModelName ?? t('modelFallback')
    if (hasNoEfforts) return `${model} · ${t('effortNoneTitle')}`
    return currentEffortName === null ? model : `${model} · ${currentEffortName}`
  }, [currentModelName, currentEffortName, hasNoEfforts, t])

  const pick = (providerId: string, modelId: string): void => {
    // no-op 语义：重复提交会把思考强度重置为模型默认（上游 route 变更清 effort 语义的同源风险）
    if (selection !== null && selection.provider === providerId && selection.model === modelId) return
    submit(providerId, modelId)
  }

  const handleSelectEffort = (effortId: string): void => {
    if (selection === null || effortId === selection.reasoningEffort) return
    submit(selection.provider, selection.model, effortId)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="dsh003-picker-btn"
        data-open={open ? 'true' : 'false'}
        data-meter={showEffortMeter ? 'true' : 'false'}
        data-compact-chev={collapse.compactChevron ? 'true' : 'false'}
        data-compact-label={collapse.compactLabel ? 'true' : 'false'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={buttonEffortName === null
          ? format(t('triggerAria'), { model: buttonModelName ?? t('modelFallback') })
          : format(t('triggerAriaEffort'), { model: buttonModelName ?? t('modelFallback'), effort: buttonEffortName })}
        title={buttonTitle}
        disabled={locked}
        onClick={toggle}
      >
        {currentGroup !== undefined && (
          <ProviderLogo {...displayProviderIcon(currentGroup)} small />
        )}
        <span className="dsh003-picker-btn-label">{buttonModelName ?? t('modelFallback')}</span>
        {buttonEffortName !== null && (
          <span className="dsh003-picker-btn-effort">{buttonEffortName}</span>
        )}
        {/* 量宽探针：按真实内容排版（宽度可读），但绝对定位、从不参与折叠，
            所以测量结果与当前渲染状态无关——这是 0.2.19 抖动的根治方式。
            外层是 0 尺寸裁剪框，避免探针伸出按钮撑出横向滚动。 */}
        <span className="dsh003-picker-probes" aria-hidden="true">
          <span ref={logoProbeRef} className="dsh003-picker-probe dsh003-picker-logo-probe" />
          {buttonEffortName !== null && (
            <span ref={effortProbeRef} className="dsh003-picker-probe">{buttonEffortName}</span>
          )}
          <span ref={chevronProbeRef} className="dsh003-picker-probe dsh003-picker-chev-probe">
            <IconChevronDownOutlineRegular />
          </span>
          <span ref={meterProbeRef} className="dsh003-picker-probe dsh003-picker-meter-probe" />
          {buttonModelName !== null && (
            <span ref={labelProbeRef} className="dsh003-picker-probe dsh003-picker-label-probe">{buttonModelName}</span>
          )}
        </span>
        {showEffortMeter && (
          <span
            className="dsh003-picker-effort-meter"
            role="img"
            aria-label={buttonEffortName ?? ''}
            data-empty={buttonMeterHeight === 0 ? 'true' : undefined}
            data-none={hasNoEfforts ? 'true' : undefined}
            data-progress={buttonEffortProgress}
          >
            <span
              className="dsh003-picker-effort-meter-fill"
              style={{ height: `${(buttonMeterHeight ?? 0) * 100}%` }}
            />
          </span>
        )}
        <IconChevronDownOutlineRegular className="dsh003-picker-chev" />
      </button>
      {open && !locked && pos !== null && createPortal(
        <ModelPickerPanel
          t={t}
          pending={catalog.pending}
          catalogError={catalog.error}
          selectionError={selectionError}
          catalogStatus={catalog.status}
          partial={catalog.partial}
          failures={catalog.failures}
          onReload={adapter.load}
          providers={catalog.groups}
          current={selection}
          containerStyle={pos}
          onPick={pick}
          onSelectEffort={handleSelectEffort}
          onClose={() => closeMenu(true)}
        />,
        document.body,
      )}
    </>
  )
}
