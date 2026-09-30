/** Session picker backed by the official shared directory; remembers accepted per-model efforts. */
import * as React from 'react'
import { createPortal } from 'react-dom'

import { IconChevronDownOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'

import { ModelPickerPanel } from './ModelPickerPanel'
import { pickerPosition } from './picker-position'
import { ProviderLogo } from './provider-logos'
import { displayProviderIcon } from './display-identity'
import { createCatalogAdapter, type ModelDirectoryFace } from './model-catalog'

const FALLBACK_LABEL = '模型'

/** 组件 props：M-049 起 locked 由座位 owner share 透传（原生 disabled 对齐官方触发器）。 */
export interface ModelPickerButtonProps {
  /** composer 锁定态（M-049 座位接线；缺省 false 兼容独立使用）。 */
  directory: ModelDirectoryFace
  locked?: boolean
}

export function ModelPickerButton({ locked = false, directory }: ModelPickerButtonProps): React.ReactNode {
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
      setSelectionError(ok ? null : '模型或档位切换失败，请重试。')
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

  const triggerLabel = currentEffortName !== null
    ? `${currentModelName ?? FALLBACK_LABEL} · ${currentEffortName}`
    : (currentModelName ?? FALLBACK_LABEL)

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
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={currentEffortName === null
          ? `选择模型，当前 ${currentModelName ?? FALLBACK_LABEL}`
          : `选择模型，当前 ${currentModelName ?? FALLBACK_LABEL}，推理等级 ${currentEffortName}`}
        title={triggerLabel}
        disabled={locked}
        onClick={toggle}
      >
        {currentGroup !== undefined && (
          <ProviderLogo {...displayProviderIcon(currentGroup)} small />
        )}
        <span className="dsh003-picker-btn-label">{currentModelName ?? FALLBACK_LABEL}</span>
        {currentEffortName !== null && (
          <span className="dsh003-picker-btn-effort">{currentEffortName}</span>
        )}
        <IconChevronDownOutlineRegular className="dsh003-picker-chev" />
      </button>
      {open && !locked && pos !== null && createPortal(
        <ModelPickerPanel
          pending={catalog.pending}
          error={selectionError ?? catalog.error}
          catalogStatus={catalog.status}
          partial={catalog.partial}
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
