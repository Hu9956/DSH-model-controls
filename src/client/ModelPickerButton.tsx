/** Session picker backed by the official shared directory; remembers accepted per-model efforts. */
import * as React from 'react'
import { createPortal } from 'react-dom'

import { IconChevronDownOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'

import { ModelPickerPanel } from './ModelPickerPanel'
import { pickerPosition } from './picker-position'
import { ProviderLogo } from './provider-logos'
import { displayProviderIcon } from './display-identity'
import { createCatalogAdapter, type ModelDirectoryFace } from './model-catalog'
import { compactModelName, isMagpieRoute, splitMagpieModelName } from './magpie-display'
import { compactNamesEnabled } from './compact-names'
import { effortKeyOf, effortProgress } from './effort-labels'
import { useButtonCollapse } from './use-effort-truncation'
import { format, pickerZh, type PickerKey, type Translate } from './locales'

/** 未注入语言服务时的兜底（测试或无 locale 的宿主）。 */
const fallbackTranslate: Translate<PickerKey> = (key, params) => format(pickerZh[key], params)


/** 组件 props：M-049 起 locked 由座位 owner share 透传（原生 disabled 对齐官方触发器）。 */
export interface ModelPickerButtonProps {
  /** composer 锁定态（M-049 座位接线；缺省 false 兼容独立使用）。 */
  directory: ModelDirectoryFace
  locked?: boolean
  /** 选择器文案的语言读取器；缺省用中文兜底。 */
  t?: Translate<PickerKey>
}

export function ModelPickerButton({ locked = false, directory, t = fallbackTranslate }: ModelPickerButtonProps): React.ReactNode {
  const interactionLocked = React.useRef(locked)
  interactionLocked.current = locked
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
    if (interactionLocked.current) return
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

  const closeMenu = React.useCallback((restoreFocus = false): void => {
    setOpen(false)
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true })
  }, [])

  // 挂载即拉目录（idle→ready 幂等）：按钮模型名回显不等首次点开面板
  React.useEffect(() => { adapter.load() }, [adapter])

  const toggle = (): void => {
    if (interactionLocked.current) return
    if (open) {
      closeMenu()
      return
    }
    const el = buttonRef.current
    if (el === null) return
    const rect = el.getBoundingClientRect()
    setPos(pickerPosition(rect, window.innerWidth, window.innerHeight))
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
    // M-055：面板内滚动（模型/供应商列表 overflow）不动 fixed 锚点，不关；页面滚动仍关
    const onScroll = (e: Event): void => {
      const target = e.target as Node
      if (target instanceof Element && target.closest('.dsh003-picker-panel') !== null) return
      closeMenu()
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

  const currentGroup = React.useMemo(() => {
    if (catalog.default === null) return undefined
    return catalog.groups.find(g => g.id === catalog.default?.provider)
  }, [catalog])
  const currentModel = React.useMemo(() => {
    if (catalog.default === null) return undefined
    return currentGroup?.models.find(m => m.id === catalog.default?.model)
  }, [catalog, currentGroup])
  const currentModelName = React.useMemo(() => {
    if (catalog.default === null) return null
    if (currentModel !== undefined) return currentModel.name
    // default 路由不在已公布分组里（仍可服务）：回退显示模型 id
    return catalog.default.model
  }, [catalog, currentModel])
  const currentEffortName = React.useMemo(() => {
    if (catalog.default === null) return null
    const reasoning = currentModel?.reasoning
    if (reasoning === undefined || reasoning.efforts.length <= 1) return null
    const effectiveEffort = catalog.default.reasoningEffort ?? reasoning.defaultEffort
    if (effectiveEffort === undefined) return null
    const effort = reasoning.efforts.find(e => e.id === effectiveEffort)
    return effort?.name ?? effectiveEffort
  }, [catalog, currentModel])

  /** 按钮显示的模型名：开关关闭时用完整上游名；开启时只压缩模型那一段，
   * `· 路由来源` 原样保留（供应商不改）。Magpie 的显示名是「模型 · 路由来源」，
   * 先拆开再压模型名，否则品牌词不在串首、压不到。 */
  const buttonModelName = React.useMemo(() => {
    if (currentModelName === null) return null
    if (!compactNamesEnabled()) return currentModelName
    const split = isMagpieRoute(catalog.default?.provider ?? '')
      ? splitMagpieModelName(currentModelName)
      : null
    if (split === null) return compactModelName(currentModelName)
    return `${compactModelName(split.model)} \u00b7 ${split.route}`
  }, [catalog.default?.provider, currentModelName])

  /** 按钮显示的档位：跟随界面语言（中文「高」/ 英文 `High`），未收录的原样显示。 */
  const buttonEffortName = React.useMemo(() => {
    if (currentEffortName === null) return null
    const key = effortKeyOf(currentEffortName)
    return key === undefined ? currentEffortName : t(key)
  }, [currentEffortName, t])

  /** 竖条填充比例：档位文字被截断时替代它显示。没有档位的模型不渲染竖条。 */
  const buttonEffortProgress = React.useMemo(() => {
    const reasoning = currentModel?.reasoning
    const effort = catalog.default?.reasoningEffort ?? reasoning?.defaultEffort
    if (reasoning === undefined || reasoning.efforts.length <= 1) return null
    return effortProgress(reasoning.efforts.map(e => e.id), effort)
  }, [catalog.default?.reasoningEffort, currentModel])

  /** 折叠判定：按实测溢出量决定收箭头 / 换竖条，详见 use-effort-truncation.ts。 */
  const logoProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const effortProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const chevronProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const meterProbeRef = React.useRef<HTMLSpanElement | null>(null)
  const collapse = useButtonCollapse(
    buttonRef,
    {
      logo: logoProbeRef,
      effort: effortProbeRef,
      chevron: chevronProbeRef,
      meter: meterProbeRef,
    },
    buttonEffortName !== null,
    [buttonEffortName, buttonModelName, buttonEffortProgress],
  )
  const showEffortMeter = buttonEffortProgress !== null && collapse.showMeter

  /** 悬停提示保留完整信息：上游全名 + 档位，不跟按钮一起压缩。 */
  const buttonTitle = currentEffortName === null
    ? (currentModelName ?? t('modelFallback'))
    : `${currentModelName ?? t('modelFallback')} · ${currentEffortName}`

  const pick = (providerId: string, modelId: string): void => {
    // no-op 语义：重复提交会把思考强度重置为模型默认（上游 route 变更清 effort 语义的同源风险）
    if (catalog.default !== null && catalog.default.provider === providerId && catalog.default.model === modelId) return
    submit(providerId, modelId)
  }

  const handleSelectEffort = (effortId: string): void => {
    if (catalog.default === null || effortId === catalog.default.reasoningEffort) return
    submit(catalog.default.provider, catalog.default.model, effortId)
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
        </span>
        {showEffortMeter && (
          <span
            className="dsh003-picker-effort-meter"
            role="img"
            aria-label={buttonEffortName ?? ''}
            data-empty={buttonEffortProgress === 0 ? 'true' : undefined}
            data-progress={buttonEffortProgress}
          >
            <span
              className="dsh003-picker-effort-meter-fill"
              style={{ height: `${buttonEffortProgress * 100}%` }}
            />
          </span>
        )}
        <IconChevronDownOutlineRegular className="dsh003-picker-chev" />
      </button>
      {open && !locked && pos !== null && createPortal(
        <ModelPickerPanel
          t={t}
          pending={catalog.pending}
          error={selectionError ?? catalog.error}
          catalogStatus={catalog.status}
          partial={catalog.partial}
          failures={catalog.failures}
          onReload={adapter.load}
          providers={catalog.groups}
          current={catalog.default}
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
