import { ChevronDown, Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sectionLinkHandler } from '../../lib/navigateToSection'
import { Button } from '../../components/Button/Button'
import { ParallaxLayer } from '../../components/ParallaxLayer/ParallaxLayer'
import { ParticleField } from '../../components/ParticleField/ParticleField'
import { Reveal } from '../../components/Reveal/Reveal'
import fairy from '../../assets/games/fairy.webp'
import heroArt from '../../assets/games/hero-garden.webp'
import './HeroSection.css'

export function HeroSection() {
  const { t } = useTranslation('home')

  return (
    <section id="home" className="section hero" tabIndex={-1} aria-labelledby="hero-title">
      <ParallaxLayer speed={0.12} className="hero__art">
        <img src={heroArt} width={1024} height={1536} alt="" fetchPriority="high" decoding="async" />
      </ParallaxLayer>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__glow glow-pulse" aria-hidden="true" />

      <ParticleField />

      <div className="container hero__content">
        <Reveal as="p" className="eyebrow hero__eyebrow" immediate>
          {t('hero.eyebrow')}
        </Reveal>
        <Reveal as="h1" id="hero-title" className="hero__title" delay={90} immediate>
          {t('hero.title')}
        </Reveal>
        <Reveal as="p" className="hero__description" delay={180} immediate>
          {t('hero.description')}
        </Reveal>
        <Reveal className="hero__actions" delay={270} immediate>
          <Button href="#game" icon={<Leaf size={20} />} onClick={sectionLinkHandler('game')}>
            {t('hero.primaryCta')}
          </Button>
          <Button href="#about" variant="secondary" onClick={sectionLinkHandler('about')}>
            {t('hero.secondaryCta')}
          </Button>
        </Reveal>
      </div>

      <div className="hero__fairy float">
        <img src={fairy} width={720} height={720} alt={t('hero.fairyAlt')} decoding="async" />
      </div>

      <p className="hero__cue" aria-hidden="true">
        <span>{t('hero.scrollCue')}</span>
        <ChevronDown size={20} />
      </p>
    </section>
  )
}
