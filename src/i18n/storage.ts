import { isEnabledLocale, type LocaleCode } from './locales'

export const LOCALE_STORAGE_KEY = 'inkwild.locale'

/** Reads the saved language. Storage can throw (private mode, blocked cookies) — never let that break the page. */
export function readStoredLocale(): LocaleCode | null {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return isEnabledLocale(value) ? value : null
  } catch {
    return null
  }
}

export function writeStoredLocale(code: LocaleCode): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    /* Preference simply isn't remembered. */
  }
}
