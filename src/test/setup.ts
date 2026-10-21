import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { siteConfig } from '../config/siteConfig'

const configuredEmail = siteConfig.contactEmail

/** Queries that should report `matches: true` in the current test. */
export const mediaState = new Map<string, boolean>()

function matchMediaStub(query: string): MediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  return {
    media: query,
    get matches() {
      // Desktop-width queries match by default so the desktop navigation/parallax paths are exercised.
      if (mediaState.has(query)) return mediaState.get(query) as boolean
      return query.includes('min-width')
    },
    onchange: null,
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
}

beforeEach(() => {
  mediaState.clear()
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', matchMediaStub)
  window.matchMedia = matchMediaStub
  // jsdom has no canvas, layout or smooth scrolling.
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext']
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  Object.defineProperty(window.navigator, 'languages', { value: ['en-US', 'en'], configurable: true })
  Object.defineProperty(window.navigator, 'language', { value: 'en-US', configurable: true })
})

afterEach(() => {
  ;(siteConfig as { contactEmail: string }).contactEmail = configuredEmail
  cleanup()
  vi.restoreAllMocks()
  document.head.querySelectorAll('meta[property], meta[name], link[rel="canonical"], script[type="application/ld+json"]').forEach((el) => {
    if (!el.hasAttribute('data-keep')) el.remove()
  })
  document.documentElement.removeAttribute('lang')
  document.documentElement.className = ''
})
