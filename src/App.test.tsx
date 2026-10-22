import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LOCALE_STORAGE_KEY } from './i18n/storage'
import { renderApp, setBrowserLanguages, setContactEmail } from './test/utils'

const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute('content')

describe('language selection', () => {
  it('starts in English by default and sets the document language and metadata', () => {
    renderApp()
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
    expect(document.title).toBe('InkWild Games — Where imagination runs wild.')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where imagination runs wild.')
    expect(meta('meta[property="og:locale"]')).toBe('en_US')
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://inkwildgames.com/')
  })

  it('falls back to English for an unsupported browser language (French)', () => {
    setBrowserLanguages(['fr-FR', 'fr'])
    renderApp()
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where imagination runs wild.')
  })

  it('picks Spanish for a Mexican-Spanish browser', () => {
    setBrowserLanguages(['es-MX', 'es', 'en'])
    renderApp()
    expect(document.documentElement.lang).toBe('es')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Donde la imaginación vuela libre.')
  })

  it('prefers a saved choice over the browser language', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'es')
    setBrowserLanguages(['en-US'])
    renderApp()
    expect(document.documentElement.lang).toBe('es')
  })

  it('switches the whole page without a reload, updates metadata, persists, and announces it', async () => {
    const user = userEvent.setup()
    renderApp()
    const switcher = screen.getAllByRole('group', { name: 'Language' })[0]!
    expect(within(switcher).getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(switcher).getByRole('button', { name: 'Español' }))

    await waitFor(() => expect(document.documentElement.lang).toBe('es'))
    expect(document.title).toBe('InkWild Games — Donde la imaginación vuela libre.')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Donde la imaginación vuela libre.')
    expect(screen.getByRole('heading', { level: 2, name: /Un pequeño estudio/ })).toBeInTheDocument()
    expect(meta('meta[name="description"]')).toMatch(/estudio independiente de videojuegos/)
    expect(meta('meta[property="og:title"]')).toBe('InkWild Games — Donde la imaginación vuela libre.')
    expect(meta('meta[property="og:locale"]')).toBe('es_MX')
    const alternates = [...document.head.querySelectorAll('meta[property="og:locale:alternate"]')].map((tag) => tag.getAttribute('content'))
    expect(alternates).toEqual(['en_US', 'zh_CN'])
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es')
    expect(within(screen.getAllByRole('group', { name: 'Idioma' })[0]!).getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(screen.getByTestId('announcer')).toHaveTextContent('Idioma cambiado a Español.'))
  })

  it('never duplicates metadata when the language changes back and forth', async () => {
    const user = userEvent.setup()
    renderApp()
    const group = () => screen.getAllByRole('group', { name: /Language|Idioma/ })[0]!
    await user.click(within(group()).getByRole('button', { name: 'Español' }))
    await user.click(within(group()).getByRole('button', { name: 'English' }))
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:locale"]', 'link[rel="canonical"]', 'script#ld-organization']) {
      expect(document.head.querySelectorAll(selector), selector).toHaveLength(1)
    }
    expect(document.head.querySelector('link[rel="alternate"][hreflang]')).toBeNull()
  })

  it('remembers the choice on the next visit', async () => {
    const user = userEvent.setup()
    const first = renderApp()
    await user.click(within(screen.getAllByRole('group', { name: 'Language' })[0]!).getByRole('button', { name: 'Español' }))
    first.unmount()
    renderApp()
    expect(document.documentElement.lang).toBe('es')
  })

  it('writes localised Organization JSON-LD', async () => {
    renderApp('es')
    const data = JSON.parse(document.head.querySelector('script#ld-organization')!.textContent!)
    expect(data).toMatchObject({ '@type': 'Organization', name: 'InkWild Games', url: 'https://inkwildgames.com/', inLanguage: 'es' })
    expect(data.description).toMatch(/estudio independiente/)
    expect(data.sameAs).toBeUndefined()
  })
})

describe.each(['en', 'es'] as const)('content in %s', (locale) => {
  it('never shows raw translation keys', () => {
    renderApp(locale)
    expect(document.body.textContent).not.toMatch(/\b(common|navigation|home|game|studio|follow|footer):[a-z]/i)
    expect(document.body.textContent).not.toMatch(/\{\{|\}\}/)
  })

  it('exposes every section with a heading and the four navigation links', () => {
    renderApp(locale)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)
    for (const id of ['home', 'game', 'about', 'contact']) expect(document.getElementById(id)).toBeInTheDocument()
    const nav = screen.getAllByRole('navigation').find((n) => n.classList.contains('site-header__nav'))!
    expect(within(nav).getAllByRole('link')).toHaveLength(4)
  })

  it('has an accessible name for every image (alt text) and decorative images stay silent', () => {
    renderApp(locale)
    for (const image of document.querySelectorAll('img')) {
      expect(image.hasAttribute('alt'), image.src).toBe(true)
    }
    expect(screen.getAllByRole('img').every((img) => img.getAttribute('alt')!.length > 0)).toBe(true)
  })

  it('renders a copyright line with the current year and studio name', () => {
    renderApp(locale)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} InkWild Games\\.`))).toBeInTheDocument()
  })
})

describe('navigation', () => {
  it('has a skip link that targets the main landmark', () => {
    renderApp()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })

  it('scrolls to a section and updates the hash when a link is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    const nav = screen.getAllByRole('navigation').find((n) => n.classList.contains('site-header__nav'))!
    await user.click(within(nav).getByRole('link', { name: 'About' }))
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(window.location.hash).toBe('#about')
    expect(document.activeElement).toBe(document.getElementById('about'))
  })

  it('translates navigation labels', () => {
    renderApp('es')
    const nav = screen.getAllByRole('navigation').find((n) => n.classList.contains('site-header__nav'))!
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['Inicio', 'Nuestro juego', 'El estudio', 'Contacto'])
  })
})

describe('mobile menu', () => {
  const menu = () => screen.getByRole('dialog', { hidden: true })

  it('is closed and inert by default, then opens as a modal dialog with focus inside', async () => {
    const user = userEvent.setup()
    renderApp()
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(menu().closest('.mobile-nav')).toHaveAttribute('inert')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const dialog = screen.getByRole('dialog', { name: 'Site menu' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('button', { name: 'Close menu' })).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('closes with Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup()
    renderApp()
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('keeps Tab and Shift+Tab inside the open menu', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Site menu' })
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button')]
    const last = focusable[focusable.length - 1]!
    last.focus()
    await user.tab()
    expect(focusable[0]).toHaveFocus()
    await user.tab({ shift: true })
    expect(last).toHaveFocus()
  })

  it('closes after choosing a destination and scrolls there', async () => {
    const user = userEvent.setup()
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Site menu' })).getByRole('link', { name: 'Our Game' }))
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(window.location.hash).toBe('#game')
    raf.mockRestore()
  })

  it('offers the language switcher too, and switching works from inside the menu', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Site menu' })
    await user.click(within(dialog).getByRole('button', { name: 'Español' }))
    await waitFor(() => expect(document.documentElement.lang).toBe('es'))
    expect(screen.getByRole('dialog', { name: 'Menú del sitio' })).toBeInTheDocument()
  })
})

describe('store badges and links without configured URLs', () => {
  it('shows honest coming-soon states and no store links', () => {
    renderApp()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByText('to iOS and Android')).toBeInTheDocument()
    expect(document.querySelector('a[href*="apps.apple.com"], a[href*="play.google.com"]')).toBeNull()
    const list = screen.getByRole('list', { name: 'Store availability' })
    expect(within(list).queryAllByRole('link')).toHaveLength(0)
    const apple = within(list).getByRole('button', { name: "App Store: the store listing isn't available yet" })
    expect(apple).toHaveAttribute('aria-disabled', 'true')
    expect(within(list).getByRole('button', { name: /Google Play/ })).toBeInTheDocument()
  })

  it('explains, in the active language, why the badge does nothing', async () => {
    const user = userEvent.setup()
    renderApp('es')
    await user.click(screen.getByRole('button', { name: /App Store: la página de la tienda/ }))
    await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent('La página de Magical Garden en App Store aún no está disponible.'))
    expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status')
  })

  it('hides social links and the email and shows translated placeholders', () => {
    setContactEmail('')
    renderApp()
    expect(screen.getByText('Our community links are on their way — check back soon.')).toBeInTheDocument()
    expect(screen.getByText('Our contact details will be shared here soon.')).toBeInTheDocument()
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(document.querySelector('.social-links')).toBeNull()
  })
})

describe('configured contact email', () => {
  it('is shown as a mailto link in the contact card and in the structured data', () => {
    setContactEmail('hello@example.com')
    renderApp('es')
    const link = screen.getByRole('link', { name: 'Escribe a InkWild Games a hello@example.com' })
    expect(link).toHaveAttribute('href', 'mailto:hello@example.com')
    expect(screen.queryByText('Muy pronto compartiremos aquí nuestros datos de contacto.')).toBeNull()
    expect(JSON.parse(document.head.querySelector('script#ld-organization')!.textContent!).email).toBe('hello@example.com')
  })

  it('is ignored when it is not a valid address', () => {
    setContactEmail('not an email')
    renderApp()
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
  })
})

describe('keyboard and language control', () => {
  it('can be operated by keyboard', async () => {
    const user = userEvent.setup()
    renderApp()
    const switcher = within(screen.getAllByRole('group', { name: 'Language' })[0]!)
    switcher.getByRole('button', { name: 'Español' }).focus()
    await user.keyboard('{Enter}')
    await act(async () => {})
    await waitFor(() => expect(document.documentElement.lang).toBe('es'))
  })
})
