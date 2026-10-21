import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toMailtoUrl } from '../../config/links'
import { siteConfig } from '../../config/siteConfig'
import { ParallaxLayer } from '../../components/ParallaxLayer/ParallaxLayer'
import { ParticleField } from '../../components/ParticleField/ParticleField'
import { Reveal } from '../../components/Reveal/Reveal'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { getConfiguredSocialLinks } from '../../lib/socialLinks'
import orchardBg from '../../assets/games/orchard-bg.webp'
import './FollowSection.css'

export function FollowSection() {
  const { t } = useTranslation('follow')
  const mailto = toMailtoUrl(siteConfig.contactEmail)
  const hasSocial = getConfiguredSocialLinks().length > 0

  return (
    <section id="contact" className="section follow" tabIndex={-1} aria-labelledby="follow-title">
      <ParallaxLayer speed={0.08} className="follow__art">
        <img src={orchardBg} width={1024} height={1536} alt="" loading="lazy" decoding="async" />
      </ParallaxLayer>
      <div className="follow__veil" aria-hidden="true" />
      <ParticleField density={0.9} />

      <div className="container follow__inner">
        <Reveal as="h2" id="follow-title" className="follow__title">
          {t('title')}
        </Reveal>
        <Reveal as="span" className="ornament" delay={80}>
          <span />
        </Reveal>
        <Reveal as="p" className="follow__description" delay={140}>
          {t('description')}
        </Reveal>

        <Reveal className="follow__cards" delay={200}>
          <div className="follow__card">
            <h3>{t('social.title')}</h3>
            {hasSocial ? <SocialLinks /> : <p className="follow__empty">{t('social.empty')}</p>}
          </div>
          <div className="follow__card">
            <h3>{t('contact.title')}</h3>
            {mailto ? (
              <a className="follow__email" href={mailto} aria-label={t('contact.emailAria', { studioName: siteConfig.studioName, email: siteConfig.contactEmail })}>
                <Mail size={20} aria-hidden="true" />
                <span>{siteConfig.contactEmail}</span>
              </a>
            ) : (
              <p className="follow__empty">{t('contact.empty')}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
