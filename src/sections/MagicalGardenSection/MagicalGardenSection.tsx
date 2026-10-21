import { useTranslation } from 'react-i18next'
import { ParallaxLayer } from '../../components/ParallaxLayer/ParallaxLayer'
import { ParticleField } from '../../components/ParticleField/ParticleField'
import { Reveal } from '../../components/Reveal/Reveal'
import { StoreButtons } from '../../components/StoreButtons/StoreButtons'
import gardenBg from '../../assets/games/garden-bg.webp'
import gameLogo from '../../assets/games/magical-garden-logo.webp'
import menuScreen from '../../assets/games/menu-screen.webp'
import playScreen from '../../assets/games/play-screen.webp'
import tileFirefly from '../../assets/games/tile-firefly.webp'
import tileFlower from '../../assets/games/tile-flower.webp'
import tileFruit from '../../assets/games/tile-fruit.webp'
import tileLeaf from '../../assets/games/tile-leaf.webp'
import tileMushroom from '../../assets/games/tile-mushroom.webp'
import tilePotion from '../../assets/games/tile-potion.webp'
import './MagicalGardenSection.css'

const FEATURES = [
  { key: 'relaxing', icon: tileLeaf },
  { key: 'worlds', icon: tileFlower },
  { key: 'powerups', icon: tilePotion },
  { key: 'growth', icon: tileFruit },
] as const

/** Decorative game pieces drifting around the phones. */
const FLOATERS = [
  { src: tileFirefly, className: 'game__floater--a' },
  { src: tileMushroom, className: 'game__floater--b' },
  { src: tileFlower, className: 'game__floater--c' },
  { src: tilePotion, className: 'game__floater--d' },
] as const

export function MagicalGardenSection() {
  const { t } = useTranslation('game')

  return (
    <section id="game" className="section game" tabIndex={-1} aria-labelledby="game-title">
      <ParallaxLayer speed={0.08} className="game__art">
        <img src={gardenBg} width={1024} height={1536} alt="" loading="lazy" decoding="async" />
      </ParallaxLayer>
      <div className="game__veil" aria-hidden="true" />
      <ParticleField density={0.8} />

      <div className="container game__grid">
        <div className="game__intro">
          <Reveal as="p" className="eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" id="game-title" className="game__title" delay={80}>
            <img src={gameLogo} width={900} height={555} alt={t('logoAlt')} loading="lazy" decoding="async" />
          </Reveal>
          <Reveal as="p" className="game__tagline" delay={140}>
            {t('tagline')}
          </Reveal>
          <Reveal as="p" className="game__description" delay={200}>
            {t('description')}
          </Reveal>
          <Reveal className="game__availability" delay={260}>
            <p className="game__status">
              <strong>{t('status.title')}</strong>
              <span>{t('status.subtitle')}</span>
            </p>
            <StoreButtons />
          </Reveal>
        </div>

        <Reveal className="game__preview" delay={160}>
          <figure className="game__phones" aria-label={t('preview.label')}>
            <div className="phone phone--back">
              <img src={menuScreen} width={720} height={1080} alt={t('preview.menuAlt')} loading="lazy" decoding="async" />
            </div>
            <div className="phone phone--front">
              <img src={playScreen} width={720} height={1080} alt={t('preview.playAlt')} loading="lazy" decoding="async" />
            </div>
            {FLOATERS.map(({ src, className }) => (
              <img key={className} className={`game__floater float ${className}`} src={src} width={256} height={256} alt="" aria-hidden="true" loading="lazy" />
            ))}
          </figure>
        </Reveal>
      </div>

      <div className="container">
        <ul className="game__features" aria-label={t('features.label')}>
          {FEATURES.map(({ key, icon }, index) => (
            <Reveal as="li" key={key} className="game__feature" delay={index * 90}>
              <img src={icon} width={256} height={256} alt="" aria-hidden="true" loading="lazy" />
              <span>{t(`features.${key}`)}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
