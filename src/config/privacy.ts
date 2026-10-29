import { siteConfig } from './siteConfig'
import type { LocaleCode } from '../i18n/locales'

/** ISO date the privacy policy was last updated. Bump it whenever the policy text changes. */
export const PRIVACY_LAST_UPDATED = '2026-10-29'

/** Path of the default-language policy page — the public URL to give to the App Store and Google Play. */
export const PRIVACY_PATH = '/privacy/'

/**
 * Locales that have their own policy URL: the default locale at `/privacy/`, every other one at
 * `/<locale>/privacy/` (e.g. `/zh/privacy/`). To give Spanish its own page: add 'es' here, copy
 * `zh/privacy/index.html` to `es/privacy/index.html` (translate its head) and list it in `vite.config.ts`
 * and `public/sitemap.xml`. Other locales keep sharing `/privacy/` and are switched in place.
 */
export const PRIVACY_PAGE_LOCALES: readonly LocaleCode[] = ['en', 'zh']

/** URL path of the policy page for a locale; falls back to the default-language page. */
export function privacyPath(locale: LocaleCode): string {
  return locale !== siteConfig.defaultLocale && PRIVACY_PAGE_LOCALES.includes(locale) ? `/${locale}${PRIVACY_PATH}` : PRIVACY_PATH
}

/** Unity's own policy, linked from the "who processes your information" section. */
export const UNITY_PRIVACY_URL = 'https://unity.com/legal/privacy-policy'

/** Google's page on how it uses information from apps that use its ad services (AdMob), linked from the Advertising section. */
export const GOOGLE_ADS_PRIVACY_URL = 'https://policies.google.com/technologies/partner-sites'
