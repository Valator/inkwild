import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../../i18n'
import type { LocaleCode } from '../../i18n/locales'
import { renderApp, setContactEmail } from '../../test/utils'
import { PrivacyPage } from './PrivacyPage'

function renderPrivacy(locale: LocaleCode) {
  return render(
    <I18nextProvider i18n={createI18n(locale)}>
      <PrivacyPage />
    </I18nextProvider>,
  )
}

describe.each([
  ['en', 'Privacy Policy', 'Last updated: October 21, 2026'],
  ['es', 'Política de privacidad', 'Última actualización: 21 de octubre de 2026'],
] as const)('privacy page in %s', (locale, title, updated) => {
  it('has one h1, the update date and a heading for every section', () => {
    renderPrivacy(locale)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(updated)).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(13)
  })

  it('never shows raw keys or unfilled placeholders', () => {
    renderPrivacy(locale)
    expect(document.body.textContent).not.toMatch(/\b(privacy|common|footer|navigation):[a-z]/i)
    expect(document.body.textContent).not.toMatch(/\{\{|\}\}/)
  })

  it('sets the document language, title and its own canonical URL', () => {
    renderPrivacy(locale)
    expect(document.documentElement.lang).toBe(locale)
    expect(document.title).toMatch(locale === 'en' ? /^Privacy Policy/ : /^Política de privacidad/)
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://inkwildgames.com/privacy/')
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', 'https://inkwildgames.com/privacy/')
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
})
