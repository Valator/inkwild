/**
 * Central locale registry — the single place that knows which languages exist.
 *
 * To add a language (e.g. French):
 *   1. Add an entry below with `enabled: true`.
 *   2. Create `src/i18n/resources/fr/` with the same JSON files as `en/`.
 *   3. Run `npm run validate:i18n` — it reports anything missing.
 * No component needs to change. Optional: add `:lang(fr)` typography rules in
 * `src/styles/global.css`.
 */
export interface LocaleDefinition {
  /** Name of the language written in that language (shown to users). */
  readonly label: string
  /** Compact label for tight spaces such as the header selector. */
  readonly shortLabel: string
  /** Value for `<html lang>` — a BCP 47 tag. */
  readonly htmlLang: string
  /** Text direction. Every launch locale is left-to-right. */
  readonly dir: 'ltr' | 'rtl'
  /** Open Graph locale (`language_TERRITORY`). */
  readonly ogLocale: string
  /** Set to false to ship the resources without exposing the language. */
  readonly enabled: boolean
}

export const locales = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    htmlLang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
    enabled: true,
  },
  es: {
    label: 'Español',
    shortLabel: 'ES',
    htmlLang: 'es',
    dir: 'ltr',
    ogLocale: 'es_MX',
    enabled: true,
  },
} as const satisfies Record<string, LocaleDefinition>

export type LocaleCode = keyof typeof locales

export const enabledLocales = (Object.keys(locales) as LocaleCode[]).filter(
  (code) => locales[code].enabled,
)

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === 'string' && Object.hasOwn(locales, value)
}

export function isEnabledLocale(value: unknown): value is LocaleCode {
  return isLocaleCode(value) && locales[value].enabled
}

/** Translation namespaces every enabled locale must provide. */
export const namespaces = [
  'common',
  'navigation',
  'home',
  'game',
  'studio',
  'follow',
  'footer',
] as const

export type Namespace = (typeof namespaces)[number]
