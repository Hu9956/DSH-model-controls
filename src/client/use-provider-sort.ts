import * as React from 'react'
import { getProviderOrder, moveProvider, orderedProviders, rememberProviders, subscribeProviderOrder } from './provider-order'

interface DragPreview { id: string; before: string | null; offset: number }

/** Long press owns its pointer; no catalog/model writes are involved. */
export function useProviderSort<T extends { id: string }>(providers: readonly T[]) {
  const order = React.useSyncExternalStore(subscribeProviderOrder, getProviderOrder)
  const sorted = React.useMemo(() => orderedProviders(providers, order), [providers, order])
  const idsKey = React.useMemo(() => JSON.stringify(providers.map(provider => provider.id)), [providers])
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
    const origin = element.getBoundingClientRect(), originScroll = list.scrollLeft
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
        return x < rect.left + rect.width / 2
      })?.dataset.providerId ?? null
      const baseLeft = origin.left - (list.scrollLeft - originScroll)
      const desiredLeft = origin.left + x - originX
      const left = Math.max(bounds.left, Math.min(bounds.right - origin.width, desiredLeft))
      const offset = left - baseLeft
      setDrag(previous => previous?.id === id && previous.before === before && previous.offset === offset
        ? previous : { id, before, offset })
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
        x = e.clientX
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
      if (done || !list.isConnected) { cancel(); return }
      active = true
      blockedClick.current = id
      try { element.setPointerCapture(pointerId) } catch { /* Window listeners still cover the pointer. */ }
      update()
      // Scroll horizontally during a held drag at the left/right edge of the supplier rail.
      scrollTimer = window.setInterval(() => {
        if (done || !list.isConnected) { cancel(); return }
        const bounds = list.getBoundingClientRect()
        const direction = x < bounds.left + 18 ? -1 : x > bounds.right - 18 ? 1 : 0
        if (direction !== 0) {
          const previousScroll = list.scrollLeft
          list.scrollLeft += direction * 10
          if (list.scrollLeft !== previousScroll) update()
        }
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
    if (!event.altKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    event.preventDefault()
    cancelRef.current?.()
    const ids = sorted.map(provider => provider.id), index = ids.indexOf(id)
    if (event.key === 'ArrowLeft' && index > 0) moveProvider(ids, id, ids[index - 1]!)
    if (event.key === 'ArrowRight' && index < ids.length - 1) moveProvider(ids, id, ids[index + 2] ?? null)
  }
  const cancel = (): void => { cancelRef.current?.() }
  return { sorted, listRef, drag, begin, cancel, suppressClick, keyboardMove }
}
