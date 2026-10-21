import { prefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Transform-only parallax driven by a single passive scroll listener and one rAF per frame.
 *
 * - Never touches scroll behaviour (no scroll-jacking).
 * - Disabled for reduced motion and on narrow screens, where it hurts usability and battery.
 * - Only elements whose container is on screen are updated.
 */
interface Entry {
  element: HTMLElement
  /** Fraction of the scroll distance the layer lags behind (positive) or leads (negative). */
  speed: number
  visible: boolean
}

const DESKTOP_QUERY = '(min-width: 48rem)'
const entries = new Map<HTMLElement, Entry>()
let io: IntersectionObserver | null = null
let frame = 0
let attached = false
let mediaQuery: MediaQueryList | null = null

function isEnabled(): boolean {
  return !prefersReducedMotion() && !!window.matchMedia?.(DESKTOP_QUERY).matches
}

function update() {
  frame = 0
  if (!isEnabled()) {
    reset()
    return
  }
  const viewportHeight = window.innerHeight
  for (const entry of entries.values()) {
    if (!entry.visible) continue
    const container = entry.element.parentElement
    if (!container) continue
    const rect = container.getBoundingClientRect()
    const distance = rect.top + rect.height / 2 - viewportHeight / 2
    // Keep the shift inside the layer's oversized headroom so edges never show.
    const limit = rect.height * 0.12
    const shift = Math.max(-limit, Math.min(limit, -distance * entry.speed))
    entry.element.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}

function reset() {
  for (const entry of entries.values()) entry.element.style.removeProperty('transform')
}

function attach() {
  if (attached) return
  attached = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  mediaQuery = window.matchMedia?.(DESKTOP_QUERY) ?? null
  mediaQuery?.addEventListener('change', schedule)
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((records) => {
      for (const record of records) {
        const target = record.target as HTMLElement
        for (const entry of entries.values()) {
          if (entry.element.parentElement === target) entry.visible = record.isIntersecting
        }
      }
      schedule()
    })
  }
}

function detach() {
  if (!attached) return
  attached = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  mediaQuery?.removeEventListener('change', schedule)
  mediaQuery = null
  io?.disconnect()
  io = null
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

export function registerParallax(element: HTMLElement, speed: number): () => void {
  if (typeof window === 'undefined') return () => {}
  const entry: Entry = { element, speed, visible: typeof IntersectionObserver === 'undefined' }
  entries.set(element, entry)
  attach()
  if (element.parentElement) io?.observe(element.parentElement)
  schedule()
  return () => {
    entries.delete(element)
    element.style.removeProperty('transform')
    if (element.parentElement && ![...entries.values()].some((e) => e.element.parentElement === element.parentElement)) {
      io?.unobserve(element.parentElement)
    }
    if (entries.size === 0) detach()
  }
}
