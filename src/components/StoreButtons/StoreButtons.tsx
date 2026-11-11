import { useTranslation } from 'react-i18next'
import { toSafeExternalUrl } from '../../config/links'
import { siteConfig, type GameId } from '../../config/siteConfig'
import { useAnnouncer } from '../Announcer/context'
import { AppleIcon, GooglePlayIcon } from '../icons/BrandIcons'
import './StoreButtons.css'

interface StoreButtonsProps {
  /** Which game's listings to show. */
  game?: GameId
  /** Defaults to the game's `storeUrls` in `siteConfig`; overridable for tests and previews. */
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
export function StoreButtons({ game: gameId = 'magicalGarden', urls = siteConfig.games[gameId].storeUrls }: StoreButtonsProps) {
  const { t } = useTranslation('game')
  const { notify } = useAnnouncer()
  const game = siteConfig.games[gameId].name

  return (
    <ul className="store-buttons" aria-label={t('stores.label', { game })}>
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
                aria-label={t('stores.pendingAria', { store: name, game })}
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
