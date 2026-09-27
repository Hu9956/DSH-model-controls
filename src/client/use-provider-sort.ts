import * as React from 'react'
import { getProviderOrder, moveProvider, orderedProviders, rememberProviders, subscribeProviderOrder } from './provider-order'

interface DragPreview { id: string; before: string | null; offset: number }

/** Long press owns its pointer; no catalog/model writes are involved. */
export function useProviderSort<T extends { id: string }>(providers: readonly T[]) {
  const order = React.useSyncExternalStore(subscribeProviderOrder, getProviderOrder)
  const sorted = orderedProviders(providers, order)
  const idsKey = JSON.stringify(providers.map(provider => provider.id))
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const cancelRef = React.useRef<(() => void) | null>(null)
  const blockedClick = React.useRef<string | null>(null)
  const [drag, setDrag] = React.useState<DragPreview | null>(null)

  React.useEffect(() => { rememberProviders(providers.map(provider => provider.id)) }, [idsKey])
  React.useEffect(() => () => { cancelRef.current?.() }, [idsKey])

  const begin = (event: React.PointerEvent<HTMLButtonElement>, id: string): void => {
    if (!event.isPrimary || event.button !== 0) return
    cancelRef.current?.()
    blockedClick.current = null
    const element = event.currentTarget
    const list = listRef.current
    if (list === null || sorted.length < 2) return
    const pointerId = event.pointerId
    const originX = event.clientX, originY = event.clientY
    const origin = element.getBoundingClientRect(), originScroll = list.scrollTop
    const ids = sorted.map(provider => provider.id)
    let x = originX, y = originY
    let active = false, done = false
    let before: string | null = null
    let scrollTimer: number | undefined

    const update = (): void => {
      const bounds = list.getBoundingClientRect()
      const candidates = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-provider-id]')).filter(button => button.dataset.providerId !== id)
      before = candidates.find(button => {
        const rect = button.getBoundingClientRect()
        return y < rect.top + rect.height / 2
      })?.dataset.providerId ?? null
      const baseTop = origin.top - (list.scrollTop - originScroll)
      const desiredTop = origin.top + y - originY
      const top = Math.max(bounds.top, Math.min(bounds.bottom - origin.height, desiredTop))
      setDrag({ id, before, offset: top - baseTop })
    }
    const cleanup = (): void => {
      if (done) return
      done = true
      window.clearTimeout(holdTimer)
      window.clearInterval(scrollTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('blur', cancel)
      document.removeEventListener('keydown', onKey, true)
      element.removeEventListener('lostpointercapture', onCancel)
      cancelRef.current = null
      setDrag(null)
      try { element.releasePointerCapture(pointerId) } catch { /* Pointer may already be released. */ }
    }
    const cancel = (): void => {
      if (active) blockedClick.current = id
      cleanup()
    }
    const onMove = (e: PointerEvent): void => {
      if (e.pointerId !== pointerId) return
      x = e.clientX; y = e.clientY
      if (!active) {
        if (Math.hypot(x - originX, y - originY) > 6) {
          blockedClick.current = id
          cancel()
        }
        return
      }
      e.preventDefault()
      update()
    }
    const onUp = (e: PointerEvent): void => {
      if (e.pointerId !== pointerId) return
      if (active) {
        y = e.clientY
        update()
        blockedClick.current = id
        moveProvider(ids, id, before)
      }
      cleanup()
    }
    const onCancel = (e: PointerEvent): void => { if (e.pointerId === pointerId) cancel() }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape' || !active) return
      e.preventDefault(); e.stopPropagation()
      cancel()
      element.focus({ preventScroll: true })
    }
    const holdTimer = window.setTimeout(() => {
      active = true
      blockedClick.current = id
      try { element.setPointerCapture(pointerId) } catch { /* Window listeners still cover the pointer. */ }
      update()
      // Scroll only during a held drag at the edge of the supplier viewport.
      scrollTimer = window.setInterval(() => {
        const bounds = list.getBoundingClientRect()
        const direction = y < bounds.top + 18 ? -1 : y > bounds.bottom - 18 ? 1 : 0
        if (direction !== 0) { list.scrollTop += direction * 10; update() }
      }, 50)
    }, 300)
    cancelRef.current = cancel
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('blur', cancel)
    document.addEventListener('keydown', onKey, true)
    element.addEventListener('lostpointercapture', onCancel)
  }

  const suppressClick = (event: React.MouseEvent): void => {
    if (blockedClick.current === null) return
    blockedClick.current = null
    event.preventDefault(); event.stopPropagation()
  }
  const keyboardMove = (event: React.KeyboardEvent, id: string): void => {
    blockedClick.current = null
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
    event.preventDefault()
    cancelRef.current?.()
    const ids = sorted.map(provider => provider.id), index = ids.indexOf(id)
    if (event.key === 'ArrowUp' && index > 0) moveProvider(ids, id, ids[index - 1]!)
    if (event.key === 'ArrowDown' && index < ids.length - 1) moveProvider(ids, id, ids[index + 2] ?? null)
  }
  return { sorted, listRef, drag, begin, suppressClick, keyboardMove }
}
