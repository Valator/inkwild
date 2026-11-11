import { useTranslation } from 'react-i18next'
import { ParallaxLayer } from '../../components/ParallaxLayer/ParallaxLayer'
import { Reveal } from '../../components/Reveal/Reveal'
import { StoreButtons } from '../../components/StoreButtons/StoreButtons'
import city from '../../assets/games/fortuna-city.webp'
import cloak from '../../assets/games/fortuna-cloak.webp'
import coin from '../../assets/games/fortuna-coin.webp'
import guard from '../../assets/games/fortuna-guard.webp'
import jadeIdol from '../../assets/games/fortuna-jade-idol.webp'
import jump from '../../assets/games/fortuna-jump.webp'
import lodestone from '../../assets/games/fortuna-lodestone.webp'
import logo from '../../assets/games/fortuna-logo.webp'
import pocketWatch from '../../assets/games/fortuna-pocket-watch.webp'
import thief from '../../assets/games/fortuna-thief.webp'
import './LittleFortunaSection.css'

const FEATURES = [
  { key: 'run', icon: jump },
  { key: 'watch', icon: guard },
  { key: 'loot', icon: cloak },
  { key: 'guild', icon: coin },
] as const

/** Loot from the game drifting around the artwork. */
const FLOATERS = [
  { src: coin, className: 'fortuna__floater--a' },
  { src: pocketWatch, className: 'fortuna__floater--b' },
  { src: lodestone, className: 'fortuna__floater--c' },
  { src: jadeIdol, className: 'fortuna__floater--d' },
] as const

/** Little Fortuna: Thief & Tumble, shown with the game's own pictures (never concept art). */
export function LittleFortunaSection() {
  const { t } = useTranslation('fortuna')

  return (
    <section id="little-fortuna" className="section fortuna" tabIndex={-1} aria-labelledby="fortuna-title">
      <ParallaxLayer speed={0.08} className="fortuna__backdrop">
        <img src={city} width={1600} height={900} alt="" loading="lazy" decoding="async" />
      </ParallaxLayer>
      <div className="fortuna__veil" aria-hidden="true" />

      <div className="container fortuna__grid">
        <div className="fortuna__intro">
          <Reveal as="p" className="eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" id="fortuna-title" className="fortuna__title" delay={80}>
            <img src={logo} width={900} height={597} alt={t('logoAlt')} loading="lazy" decoding="async" />
          </Reveal>
          <Reveal as="p" className="fortuna__subtitle" delay={120}>
            {t('subtitle')}
          </Reveal>
          <Reveal as="p" className="fortuna__tagline" delay={160}>
            {t('tagline')}
          </Reveal>
          <Reveal as="p" className="fortuna__description" delay={200}>
            {t('description')}
          </Reveal>
          <Reveal className="fortuna__availability" delay={260}>
            <p className="fortuna__status">
              <strong>{t('status.title')}</strong>
              <span>{t('status.subtitle')}</span>
            </p>
            <StoreButtons game="littleFortuna" />
          </Reveal>
        </div>

        <Reveal className="fortuna__art" delay={160}>
          <figure className="fortuna__figure" aria-label={t('art.label')}>
            <img className="fortuna__thief" src={thief} width={720} height={604} alt={t('art.alt')} loading="lazy" decoding="async" />
            {FLOATERS.map(({ src, className }) => (
              <img key={className} className={`fortuna__floater float ${className}`} src={src} width={256} height={256} alt="" aria-hidden="true" loading="lazy" />
            ))}
          </figure>
        </Reveal>
      </div>

      <div className="container">
        <ul className="fortuna__features" aria-label={t('features.label')}>
          {FEATURES.map(({ key, icon }, index) => (
            <Reveal as="li" key={key} className="fortuna__feature" delay={index * 90}>
              <img src={icon} width={256} height={256} alt="" aria-hidden="true" loading="lazy" />
              <span>{t(`features.${key}`)}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
