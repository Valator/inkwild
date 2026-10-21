import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../../i18n'
import { SocialLinks } from './SocialLinks'

const renderLinks = (links: Parameters<typeof SocialLinks>[0]['links'], locale: 'en' | 'es' = 'en') =>
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <SocialLinks links={links} />
    </I18nextProvider>,
  )

describe('SocialLinks', () => {
  it('renders nothing when no profile is configured', () => {
    const { container } = renderLinks({ youtube: '', instagram: '', tiktok: '', discord: '' })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders only valid https profiles, with localized accessible names and safe rel', () => {
    renderLinks({ youtube: 'https://youtube.com/@inkwild', instagram: 'javascript:void(0)', tiktok: '', discord: 'https://discord.gg/abc' }, 'es')
    const links = screen.getAllByRole('link')
    expect(links.map((l) => l.getAttribute('aria-label'))).toEqual([
      'InkWild Games en YouTube (se abre en una pestaña nueva)',
      'InkWild Games en Discord (se abre en una pestaña nueva)',
    ])
    for (const link of links) expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
