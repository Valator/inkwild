import { render, screen, within } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../../i18n'
import { locales, type LocaleCode } from '../../i18n/locales'
import { PRIVACY_PAGE_LOCALES, fortunaPrivacyPath, privacyPath } from '../../config/privacy'
import { setContactEmail } from '../../test/utils'
import { FortunaPrivacyPage } from './FortunaPrivacyPage'
import { PrivacyPage } from './PrivacyPage'

/** The static pages, as served: each locale in PRIVACY_PAGE_LOCALES needs its own file. */
const staticPages = import.meta.glob<string>(['/privacy/little-fortuna/index.html', '/zh/privacy/little-fortuna/index.html'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

function renderFortuna(locale: LocaleCode) {
  return render(
    <I18nextProvider i18n={createI18n(locale)}>
      <FortunaPrivacyPage />
    </I18nextProvider>,
  )
}

describe.each([
  ['en', 'Privacy Policy', 'Last updated: November 11, 2026', 'Device statistics.'],
  ['es', 'Política de privacidad', 'Última actualización: 11 de noviembre de 2026', 'Estadísticas del dispositivo.'],
  ['zh', '隐私政策', '最后更新：2026年11月11日', '设备统计信息。'],
] as const)("Little Fortuna's privacy page in %s", (locale, title, updated, engineLabel) => {
  it('has one h1, the update date and a heading for every section', () => {
    renderFortuna(locale)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(updated)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(15)
  })

  it('never shows raw keys or unfilled placeholders', () => {
    renderFortuna(locale)
    expect(document.body.textContent).not.toMatch(/\b(privacyFortuna|privacy|common|footer|navigation):[a-z]/i)
    expect(document.body.textContent).not.toMatch(/\{\{|\}\}/)
  })

  it("is about Little Fortuna only: no Magical Garden, no player ID, no Ladder, no cloud save claims", () => {
    renderFortuna(locale)
    // The footer legitimately links to both policies, so check the policy itself.
    expect(screen.getByRole('main').textContent).not.toMatch(/Magical Garden|LevelPlay/i)
    expect(document.body.textContent).toMatch(/Little Fortuna|小小福尔图娜/)
    expect(document.body.textContent).toMatch(/AdMob/)
  })

  it('keeps the Unity device statistics paragraph', () => {
    renderFortuna(locale)
    expect(screen.getByText(engineLabel)).toBeInTheDocument()
    expect(document.body.textContent).toMatch(/Unity Technologies/)
  })

  it('sets the document language, title and its own canonical URL', () => {
    renderFortuna(locale)
    expect(document.documentElement.lang).toBe(locales[locale].htmlLang)
    expect(document.title).toMatch(/Little Fortuna|小小福尔图娜/)
    const url = locale === 'zh' ? 'https://inkwildgames.com/zh/privacy/little-fortuna/' : 'https://inkwildgames.com/privacy/little-fortuna/'
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', url)
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', url)
  })

  it('opens the Unity and Google links safely and links to the website section of the other policy', () => {
    renderFortuna(locale)
    for (const href of ['https://unity.com/legal/privacy-policy', 'https://policies.google.com/privacy', 'https://policies.google.com/technologies/partner-sites']) {
      const link = document.querySelector(`a[href="${href}"]`)
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    }
    expect(document.querySelector(`a[href="${privacyPath(locale)}#policy-website"]`)).toBeInTheDocument()
  })

  it('shows the contact email as a mailto link, or a placeholder without one', () => {
    setContactEmail('hello@example.com')
    const { unmount } = renderFortuna(locale)
    expect(screen.getByRole('link', { name: /hello@example\.com/ })).toHaveAttribute('href', 'mailto:hello@example.com')
    unmount()
    setContactEmail('')
    renderFortuna(locale)
    expect(document.querySelector('.policy__placeholder')).toBeInTheDocument()
  })
})

describe('Little Fortuna policy URLs', () => {
  it('has its own URL per locale and a static HTML file for each', () => {
    expect(fortunaPrivacyPath('en')).toBe('/privacy/little-fortuna/')
    expect(fortunaPrivacyPath('zh')).toBe('/zh/privacy/little-fortuna/')
    expect(fortunaPrivacyPath('es')).toBe('/privacy/little-fortuna/')
    for (const code of PRIVACY_PAGE_LOCALES) {
      const html = staticPages[`${fortunaPrivacyPath(code)}index.html`]!
      expect(html).toBeDefined()
      expect(html).toContain(`href="https://inkwildgames.com${fortunaPrivacyPath(code)}"`)
      expect(html).toContain(`<html lang="${locales[code].htmlLang}"`)
    }
  })

  it('lists only pages that exist as hreflang alternates', () => {
    renderFortuna('en')
    const alternates = [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [
      l.getAttribute('hreflang'),
      l.getAttribute('href'),
    ])
    expect(alternates).toEqual([
      ['en', 'https://inkwildgames.com/privacy/little-fortuna/'],
      ['zh-Hans', 'https://inkwildgames.com/zh/privacy/little-fortuna/'],
      ['x-default', 'https://inkwildgames.com/privacy/little-fortuna/'],
    ])
  })

  it('leaves Magical Garden\'s policy as it was', () => {
    render(
      <I18nextProvider i18n={createI18n('en')}>
        <PrivacyPage />
      </I18nextProvider>,
    )
    expect(screen.getByText('Magical Garden and inkwildgames.com')).toBeInTheDocument()
    expect(screen.getByText('Last updated: November 10, 2026')).toBeInTheDocument()
    expect(within(document.body).getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(15)
  })
})
