import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18n } from '../../i18n'
import { AnnouncerProvider } from '../Announcer/Announcer'
import { StoreButtons } from './StoreButtons'

function renderStores(urls: { ios: string; android: string }) {
  return render(
    <I18nextProvider i18n={createI18n('en')}>
      <AnnouncerProvider>
        <StoreButtons urls={urls} />
      </AnnouncerProvider>
    </I18nextProvider>,
  )
}

describe('StoreButtons with configured URLs', () => {
  it('renders safe external links only for valid https destinations', () => {
    renderStores({ ios: 'https://apps.apple.com/app/id123', android: 'javascript:alert(1)' })
    const link = screen.getByRole('link', { name: 'Magical Garden on App Store (opens in a new tab)' })
    expect(link).toHaveAttribute('href', 'https://apps.apple.com/app/id123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    // The unsafe URL is treated as "not configured": no link, still a coming-soon button.
    expect(screen.queryByRole('link', { name: /Google Play/ })).toBeNull()
    expect(screen.getByRole('button', { name: /Google Play/ })).toHaveAttribute('aria-disabled', 'true')
  })
})
