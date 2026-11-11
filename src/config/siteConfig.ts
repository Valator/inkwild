import { enabledLocales, type LocaleCode } from '../i18n/locales'

/** The games shown on the site, in the order they appear. */
export const gameIds = ['magicalGarden', 'littleFortuna'] as const
export type GameId = (typeof gameIds)[number]

export interface GameConfig {
  /** Brand name, never translated. */
  readonly name: string
  /** Store listings. Leave empty until the real listing exists — never invent one. */
  readonly storeUrls: { readonly ios: string; readonly android: string }
}

export interface SiteConfig {
  readonly studioName: string
  readonly games: Readonly<Record<GameId, GameConfig>>
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
  games: {
    magicalGarden: { name: 'Magical Garden', storeUrls: { ios: '', android: '' } },
    littleFortuna: { name: 'Little Fortuna', storeUrls: { ios: '', android: '' } },
  },
  domain: 'https://inkwildgames.com',
  contactEmail: 'inkwildgames@gmail.com',
  defaultLocale: 'en',
  detectBrowserLocale: true,
  persistLocale: true,
  supportedLocales: enabledLocales,
  socialLinks: {
    youtube: '',
    instagram: '',
    tiktok: '',
    discord: '',
  },
}
