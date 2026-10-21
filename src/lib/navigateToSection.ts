import { prefersReducedMotion } from '../hooks/useReducedMotion'

/**
 * Scrolls to a page section, updates the URL hash and moves keyboard focus into it,
 * so keyboard and screen-reader users land where sighted users do.
 */
export function navigateToSection(id: string): void {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
  target.focus({ preventScroll: true })
}

/** Click handler for in-page links: smooth-scrolls (and focuses) instead of jumping, but leaves modified clicks alone. */
export function sectionLinkHandler(id: string) {
  return (event: { preventDefault: () => void; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; button: number }) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    navigateToSection(id)
  }
}
