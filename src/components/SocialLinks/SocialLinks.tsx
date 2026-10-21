import { useTranslation } from 'react-i18next'
import { siteConfig, type SiteConfig } from '../../config/siteConfig'
import { getConfiguredSocialLinks } from '../../lib/socialLinks'
import './SocialLinks.css'

interface SocialLinksProps {
  links?: SiteConfig['socialLinks']
}

/** Renders only the profiles that are configured. Renders nothing when there are none. */
export function SocialLinks({ links = siteConfig.socialLinks }: SocialLinksProps) {
  const { t } = useTranslation('follow')
  const configured = getConfiguredSocialLinks(links)
  if (configured.length === 0) return null
  return (
    <ul className="social-links">
      {configured.map(({ id, Icon, href }) => (
        <li key={id}>
          <a
            className="social-links__link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('social.aria', { studioName: siteConfig.studioName, network: t(`social.${id}`) })}
          >
            <Icon width={22} height={22} />
          </a>
        </li>
      ))}
    </ul>
  )
}
