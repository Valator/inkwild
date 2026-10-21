import { prefersReducedMotion } from '../hooks/useReducedMotion'

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-revealed', 'true')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  )
  return observer
}

/**
 * Marks `element` as revealed the first time it scrolls into view. One shared
 * IntersectionObserver serves every element and no React state is involved.
 * Without IntersectionObserver or with reduced motion the element is shown at once.
 */
export function observeReveal(element: Element): () => void {
  if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
    element.setAttribute('data-revealed', 'true')
    return () => {}
  }
  const io = getObserver()
  io.observe(element)
  return () => io.unobserve(element)
}
