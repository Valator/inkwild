import { useTranslation } from 'react-i18next'
import { toSafeExternalUrl } from '../../config/links'
import { siteConfig } from '../../config/siteConfig'
import { useAnnouncer } from '../Announcer/context'
import { AppleIcon, GooglePlayIcon } from '../icons/BrandIcons'
import './StoreButtons.css'

interface StoreButtonsProps {
  /** Defaults to `siteConfig.storeUrls`; overridable for tests and previews. */
  urls?: { ios: string; android: string }
}

const STORES = [
  { id: 'ios', name: 'App Store', Icon: AppleIcon },
  { id: 'android', name: 'Google Play', Icon: GooglePlayIcon },
] as const

/**
 * App Store / Google Play badges. Store names are brand names, so they are not translated.
 * Without a valid https URL a badge is an honest, non-navigating "coming soon" button
 * that announces why — never a broken or invented link.
 */
export function StoreButtons({ urls = siteConfig.storeUrls }: StoreButtonsProps) {
  const { t } = useTranslation('game')
  const { notify } = useAnnouncer()
  const game = siteConfig.gameName

  return (
    <ul className="store-buttons" aria-label={t('stores.label')}>
      {STORES.map(({ id, name, Icon }) => {
        const href = toSafeExternalUrl(urls[id])
        const inner = (
          <>
            <Icon className="store-badge__icon" />
            <span className="store-badge__text">
              <span className="store-badge__prefix">{t(href ? 'stores.livePrefix' : 'stores.pendingPrefix')}</span>
              <span className="store-badge__name">{name}</span>
            </span>
          </>
        )
        return (
          <li key={id}>
            {href ? (
              <a
                className="store-badge"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('stores.liveAria', { game, store: name })}
              >
                {inner}
              </a>
            ) : (
              <button
                type="button"
                className="store-badge store-badge--pending"
                aria-disabled="true"
                aria-label={t('stores.pendingAria', { store: name })}
                onClick={() => notify(t('stores.notice', { store: name, game }))}
              >
                {inner}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
