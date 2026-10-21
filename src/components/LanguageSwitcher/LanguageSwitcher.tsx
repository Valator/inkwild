import { useId, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { setLocale } from '../../i18n'
import { enabledLocales, isEnabledLocale, locales } from '../../i18n/locales'
import { useAnnouncer } from '../Announcer/context'
import './LanguageSwitcher.css'

/** Above this many languages a segmented control gets cramped, so a native select takes over. */
const MAX_SEGMENTS = 3

interface LanguageSwitcherProps {
  className?: string
}

/**
 * Lists every enabled locale from `src/i18n/locales.ts` — adding a language needs no change here.
 * Buttons show the short code but are named with the full language name, and each carries its own
 * `lang` so screen readers pronounce it correctly.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation('common')
  const { announce } = useAnnouncer()
  const selectId = useId()
  const current = isEnabledLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : enabledLocales[0]
  const classes = ['language-switcher', className].filter(Boolean).join(' ')

  const choose = async (code: string) => {
    if (!isEnabledLocale(code) || code === current) return
    await setLocale(i18n, code)
    // Announce in the language just selected.
    announce(i18n.t('common:language.changed', { lng: code, language: locales[code].label }))
  }

  if (enabledLocales.length > MAX_SEGMENTS) {
    return (
      <div className={classes}>
        <label className="visually-hidden" htmlFor={selectId}>
          {t('language.label')}
        </label>
        <select
          id={selectId}
          className="language-switcher__select"
          value={current}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => void choose(event.target.value)}
        >
          {enabledLocales.map((code) => (
            <option key={code} value={code} lang={locales[code].htmlLang}>
              {locales[code].label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className={classes} role="group" aria-label={t('language.label')}>
      {enabledLocales.map((code) => (
        <button
          key={code}
          type="button"
          className="language-switcher__option"
          lang={locales[code].htmlLang}
          aria-label={locales[code].label}
          aria-pressed={code === current}
          onClick={() => void choose(code)}
        >
          {locales[code].shortLabel}
        </button>
      ))}
    </div>
  )
}
