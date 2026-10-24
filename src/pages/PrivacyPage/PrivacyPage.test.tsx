import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../../i18n'
import { locales, type LocaleCode } from '../../i18n/locales'
import { PRIVACY_PAGE_LOCALES, privacyPath } from '../../config/privacy'
import { renderApp, setContactEmail } from '../../test/utils'
import { PrivacyPage } from './PrivacyPage'

/** The static pages, as served: each locale in PRIVACY_PAGE_LOCALES needs its own file. */
const staticPages = import.meta.glob<string>(['/privacy/index.html', '/zh/privacy/index.html'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

function renderPrivacy(locale: LocaleCode) {
  return render(
    <I18nextProvider i18n={createI18n(locale)}>
      <PrivacyPage />
    </I18nextProvider>,
  )
}

describe.each([
  ['en', 'Privacy Policy', 'Last updated: October 23, 2026'],
  ['es', 'Política de privacidad', 'Última actualización: 23 de octubre de 2026'],
  ['zh', '隐私政策', '最后更新：2026年10月23日'],
] as const)('privacy page in %s', (locale, title, updated) => {
  it('has one h1, the update date and a heading for every section', () => {
    renderPrivacy(locale)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(updated)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(15)
  })

  it('never shows raw keys or unfilled placeholders', () => {
    renderPrivacy(locale)
    expect(document.body.textContent).not.toMatch(/\b(privacy|common|footer|navigation):[a-z]/i)
    expect(document.body.textContent).not.toMatch(/\{\{|\}\}/)
  })

  it('sets the document language, title and its own canonical URL', () => {
    renderPrivacy(locale)
    expect(document.documentElement.lang).toBe(locales[locale].htmlLang)
    expect(document.title).toMatch({ en: /^Privacy Policy/, es: /^Política de privacidad/, zh: /^隐私政策/ }[locale])
    // Chinese has its own page; Spanish is switched in place on the shared English URL (see PRIVACY_PAGE_LOCALES).
    const url = locale === 'zh' ? 'https://inkwildgames.com/zh/privacy/' : 'https://inkwildgames.com/privacy/'
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', url)
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', url)
  })

  it('links to Unity safely and shows a placeholder while no contact email is configured', () => {
    setContactEmail('')
    renderPrivacy(locale)
    const unity = document.querySelector('a[href="https://unity.com/legal/privacy-policy"]')
    expect(unity).toHaveAttribute('rel', 'noopener noreferrer')
    expect(unity).toHaveAttribute('target', '_blank')
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(document.querySelector('.policy__placeholder')).toBeInTheDocument()
  })

  it('has Advertising and Purchases sections and links to the ad partner information safely', () => {
    renderPrivacy(locale)
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toContain({ en: 'Advertising', es: 'Publicidad', zh: '广告' }[locale])
    expect(headings).toContain({ en: 'Purchases', es: 'Compras', zh: '购买' }[locale])
    const google = document.querySelector('a[href="https://policies.google.com/technologies/partner-sites"]')
    expect(google).toHaveAttribute('rel', 'noopener noreferrer')
    expect(google).toHaveAttribute('target', '_blank')
    expect(document.body.textContent).toContain('Google AdMob')
    expect(document.body.textContent).not.toMatch(/LevelPlay/i)
  })

  // The Ladder is a later feature: mention it in the policy only in the release that ships it.
  it('does not mention the Ladder or player names', () => {
    renderPrivacy(locale)
    expect(document.body.textContent).not.toMatch(/Ladder|Escalera|天梯|player name|nombre de jugador|玩家名称/i)
  })

  it('no longer claims the game has no ads or purchases', () => {
    renderPrivacy(locale)
    expect(document.body.textContent).not.toMatch(/no ads, and no purchases|no tiene cuentas, anuncios ni compras|currently shows no advertising/i)
  })

  it('shows the configured contact email as a mailto link', () => {
    setContactEmail('hello@example.com')
    renderPrivacy(locale)
    expect(screen.getByRole('link', { name: /hello@example\.com/ })).toHaveAttribute('href', 'mailto:hello@example.com')
    expect(document.querySelector('.policy__placeholder')).toBeNull()
  })

  it('links back to the home sections instead of scrolling in place', () => {
    renderPrivacy(locale)
    const nav = screen.getAllByRole('navigation').find((n) => n.classList.contains('site-header__nav'))!
    const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/#home', '/#game', '/#about', '/#contact'])
    expect(within(nav).queryByRole('link', { current: 'location' })).toBeNull()
  })
})

describe('hreflang and locale URLs', () => {
  it('lists only pages that exist, with an x-default', () => {
    renderPrivacy('en')
    const alternates = [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [
      l.getAttribute('hreflang'),
      l.getAttribute('href'),
    ])
    expect(alternates).toEqual([
      ['en', 'https://inkwildgames.com/privacy/'],
      ['zh-Hans', 'https://inkwildgames.com/zh/privacy/'],
      ['x-default', 'https://inkwildgames.com/privacy/'],
    ])
  })

  it('has a static HTML file for every locale that has its own policy URL', () => {
    for (const code of PRIVACY_PAGE_LOCALES) {
      const html = staticPages[`${privacyPath(code)}index.html`]!
      expect(html).toBeDefined()
      expect(html).toContain(`href="https://inkwildgames.com${privacyPath(code)}"`)
      expect(html).toContain(`<html lang="${locales[code].htmlLang}"`)
    }
    expect(privacyPath('zh')).toBe('/zh/privacy/')
    expect(privacyPath('en')).toBe('/privacy/')
    expect(privacyPath('es')).toBe('/privacy/')
  })

  it('keeps the English and Chinese policy structurally identical', () => {
    const shape = (code: LocaleCode) => JSON.stringify(Object.keys(createI18n(code).getResourceBundle(code, 'privacy')))
    expect(shape('zh')).toBe(shape('en'))
  })
})

describe('language switching on the privacy page', () => {
  it('translates the policy without a reload', async () => {
    const user = userEvent.setup()
    renderPrivacy('en')
    await user.click(within(screen.getAllByRole('group', { name: 'Language' })[0]!).getByRole('button', { name: 'Español' }))
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Política de privacidad'))
    expect(document.documentElement.lang).toBe('es')
  })
})

describe('policy link from the home page', () => {
  it('is in the footer and points at the public policy URL', () => {
    renderApp('en')
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy/')
  })

  it('is translated', () => {
    renderApp('es')
    expect(screen.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute('href', '/privacy/')
  })

  it('points Chinese visitors at the Chinese policy page', () => {
    renderApp('zh')
    expect(screen.getByRole('link', { name: '隐私政策' })).toHaveAttribute('href', '/zh/privacy/')
  })
})
