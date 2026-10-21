import { siteConfig } from './siteConfig'
import type { LocaleCode } from '../i18n/locales'

/**
 * Canonical URL for a locale.
 *
 * The site is a single page served at the root for every language, so every locale
 * currently shares one canonical URL and NO `hreflang` links are emitted (they must
 * only point at pages that exist). If locale-prefixed routes (`/en/`, `/es/`) are added
 * later, return `${domain}/${locale}/` here, render each route with its locale and
 * add the matching `hreflang` alternates in `DocumentMeta`.
 */
export function getCanonicalUrl(_locale: LocaleCode, path = '/'): string {
  return `${siteConfig.domain}${path}`
}

export function getAbsoluteUrl(path: string): string {
  return `${siteConfig.domain}${path.startsWith('/') ? path : `/${path}`}`
}
