import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { siteConfig } from '../config/siteConfig'
import { resolveInitialLocale } from './detect'
import { enabledLocales, isEnabledLocale, locales, namespaces, type LocaleCode } from './locales'
import { allResources, resources } from './resources'
import { readStoredLocale, writeStoredLocale } from './storage'
import { formatIssues, validateResources } from './validate'

/** Missing translations must never go unnoticed — they are logged as errors in every build. */
function reportMissingKey(lngs: readonly string[], ns: string, key: string) {
  console.error(`[i18n] Missing translation "${ns}:${key}" for ${lngs.join(', ')}.`)
}

export function getInitialLocale(): LocaleCode {
  const browserLanguages =
    typeof navigator === 'undefined' ? [] : (navigator.languages?.length ? navigator.languages : [navigator.language])
  return resolveInitialLocale({
    stored: siteConfig.persistLocale ? readStoredLocale() : null,
    browserLanguages: browserLanguages.filter(Boolean),
    fallback: siteConfig.defaultLocale,
    detectBrowserLocale: siteConfig.detectBrowserLocale,
  })
}

export function createI18n(initialLocale: LocaleCode = getInitialLocale()) {
  const instance = i18n.createInstance()
  void instance.use(initReactI18next).init({
    resources,
    lng: initialLocale,
    // Safety net only: validation guarantees every locale is complete.
    fallbackLng: siteConfig.defaultLocale,
    supportedLngs: [...enabledLocales],
    ns: [...namespaces],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    saveMissing: true,
    missingKeyHandler: reportMissingKey,
    // Never show an internal key such as "game:tagline" to a visitor.
    parseMissingKeyHandler: () => '',
    react: { useSuspense: false },
  })
  return instance
}

/** Logs any incomplete locale at start-up so a bad deploy is visible in the console. */
export function reportResourceIssues(): void {
  const issues = validateResources({
    resources: allResources,
    locales: enabledLocales,
    referenceLocale: siteConfig.defaultLocale,
    namespaces,
  })
  if (issues.length > 0) {
    console.error(`[i18n] ${issues.length} translation problem(s):\n${formatIssues(issues)}`)
  }
}

/** Switches language and remembers the explicit choice. Ignores unsupported codes. */
export async function setLocale(instance: typeof i18n, code: string): Promise<void> {
  if (!isEnabledLocale(code)) return
  await instance.changeLanguage(code)
  if (siteConfig.persistLocale) writeStoredLocale(code)
}

export { locales, enabledLocales }
