import { enabledLocales, type LocaleCode } from '../i18n/locales'

export interface SiteConfig {
  readonly studioName: string
  readonly gameName: string
  /** Production origin, without a trailing slash. Used for canonical and Open Graph URLs. */
  readonly domain: string
  /** Public contact address. Leave empty until one is supplied — the UI hides it. */
  readonly contactEmail: string
  readonly defaultLocale: LocaleCode
  /** Pick the browser's preferred language on a first visit. */
  readonly detectBrowserLocale: boolean
  /** Remember an explicit language choice in localStorage. */
  readonly persistLocale: boolean
  /** Derived from `src/i18n/locales.ts` so there is one source of truth. */
  readonly supportedLocales: readonly LocaleCode[]
  /** Store listings. Leave empty until the real listing exists — never invent one. */
  readonly storeUrls: { readonly ios: string; readonly android: string }
  /** Optional social profiles. Empty entries are hidden. */
  readonly socialLinks: {
    readonly youtube: string
    readonly instagram: string
    readonly tiktok: string
    readonly discord: string
  }
}

export const siteConfig: SiteConfig = {
  studioName: 'InkWild Games',
  gameName: 'Magical Garden',
  domain: 'https://inkwildgames.com',
  contactEmail: '',
  defaultLocale: 'en',
  detectBrowserLocale: true,
  persistLocale: true,
  supportedLocales: enabledLocales,
  storeUrls: {
    ios: '',
    android: '',
  },
  socialLinks: {
    youtube: '',
    instagram: '',
    tiktok: '',
    discord: '',
  },
}
