import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import App from '../App'
import { createI18n } from '../i18n'
import type { LocaleCode } from '../i18n/locales'
import { siteConfig } from '../config/siteConfig'
import { mediaState } from './setup'

export function setBrowserLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true })
  Object.defineProperty(window.navigator, 'language', { value: languages[0] ?? '', configurable: true })
}

export function setReducedMotion(reduce: boolean) {
  mediaState.set('(prefers-reduced-motion: reduce)', reduce)
}

/** Temporarily overrides the contact email; restored automatically after each test (see setup.ts). */
export function setContactEmail(email: string) {
  ;(siteConfig as { contactEmail: string }).contactEmail = email
}

/** Renders the whole app. Without `locale`, the language is detected exactly as in production. */
export function renderApp(locale?: LocaleCode) {
  const i18n = createI18n(locale)
  const view = render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>,
  )
  return { ...view, i18n }
}
