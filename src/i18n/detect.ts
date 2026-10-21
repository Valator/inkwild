import { enabledLocales, locales, type LocaleCode } from './locales'

/**
 * Matches a BCP 47 tag from the browser (`es-MX`, `fr`, `en_GB`) to an enabled locale.
 * Tries an exact match first, then the primary language subtag. Returns null when the
 * language is not supported — the caller decides the fallback.
 */
export function matchLocale(
  tag: string,
  supported: readonly LocaleCode[] = enabledLocales,
): LocaleCode | null {
  const normalised = tag.trim().toLowerCase().replace('_', '-')
  if (!normalised) return null
  const exact = supported.find((code) => locales[code].htmlLang.toLowerCase() === normalised)
  if (exact) return exact
  const primary = normalised.split('-')[0]
  return (
    supported.find(
      (code) =>
        code.toLowerCase() === primary || locales[code].htmlLang.toLowerCase().split('-')[0] === primary,
    ) ?? null
  )
}

export interface InitialLocaleInput {
  stored: LocaleCode | null
  browserLanguages: readonly string[]
  fallback: LocaleCode
  detectBrowserLocale: boolean
  supported?: readonly LocaleCode[]
}

/**
 * Selection order:
 *   1. an explicit choice the visitor made before (stored),
 *   2. the browser's preferred languages, in order, when detection is enabled,
 *   3. the configured default.
 */
export function resolveInitialLocale({
  stored,
  browserLanguages,
  fallback,
  detectBrowserLocale,
  supported = enabledLocales,
}: InitialLocaleInput): LocaleCode {
  if (stored && supported.includes(stored)) return stored
  if (detectBrowserLocale) {
    for (const tag of browserLanguages) {
      const match = matchLocale(tag, supported)
      if (match) return match
    }
  }
  return fallback
}
