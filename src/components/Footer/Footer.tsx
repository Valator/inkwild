import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navItems } from '../../config/navigation'
import { PRIVACY_PATH } from '../../config/privacy'
import { siteConfig } from '../../config/siteConfig'
import { sectionLinkHandler } from '../../lib/navigateToSection'
import { getConfiguredSocialLinks } from '../../lib/socialLinks'
import { SocialLinks } from '../SocialLinks/SocialLinks'
import logo from '../../assets/brand/inkwild-logo.webp'
import './Footer.css'

interface FooterProps {
  /** See `Header`: set on pages other than home so section links go to `${sectionBase}#id`. */
  sectionBase?: string
}

export function Footer({ sectionBase }: FooterProps) {
  const { t } = useTranslation(['footer', 'navigation', 'follow', 'common'])
  // Lazy initialiser: the year is read once per mount, not on every render.
  const [year] = useState(() => new Date().getFullYear())
  const hasSocial = getConfiguredSocialLinks().length > 0

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <span className="logo-mark">
            <img src={logo} width={1000} height={375} alt={t('common:brand.logoAlt')} loading="lazy" />
          </span>
          <p>{t('footer:tagline')}</p>
        </div>

        <nav aria-label={t('navigation:footerLabel')}>
          <ul className="site-footer__nav">
            {navItems.map(({ id, labelKey }) => (
              <li key={id}>
                <a href={`${sectionBase ?? ''}#${id}`} onClick={sectionBase === undefined ? sectionLinkHandler(id) : undefined}>
                  {t(`navigation:${labelKey}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {hasSocial ? (
          <div className="site-footer__social">
            <p>{t('follow:social.title')}</p>
            <SocialLinks />
          </div>
        ) : null}
      </div>

      <div className="site-footer__legal container">
        <p>{t('footer:copyright', { year, studioName: siteConfig.studioName })}</p>
        <a href={PRIVACY_PATH}>{t('footer:privacy')}</a>
      </div>
    </footer>
  )
}
