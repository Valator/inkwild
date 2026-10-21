import { BookOpen, Compass, Leaf, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '../../components/Reveal/Reveal'
import creekArt from '../../assets/games/creek-bg.webp'
import './StudioSection.css'

const PRINCIPLES: readonly { key: 'worlds' | 'care' | 'room'; Icon: LucideIcon }[] = [
  { key: 'worlds', Icon: BookOpen },
  { key: 'care', Icon: Leaf },
  { key: 'room', Icon: Compass },
]

export function StudioSection() {
  const { t } = useTranslation('studio')

  return (
    <section id="about" className="section studio" tabIndex={-1} aria-labelledby="about-title">
      <div className="container studio__grid">
        <div className="studio__art" aria-hidden="true">
          <img src={creekArt} width={1024} height={1536} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="studio__copy">
          <Reveal as="p" className="eyebrow studio__eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" id="about-title" className="studio__title" delay={80}>
            {t('title')}
          </Reveal>
          <Reveal as="span" className="ornament" delay={140}>
            <span />
          </Reveal>
          <Reveal as="p" className="studio__description" delay={180}>
            {t('description')}
          </Reveal>
        </div>
      </div>

      <div className="container">
        <ul className="studio__principles" aria-label={t('principles.label')}>
          {PRINCIPLES.map(({ key, Icon }, index) => (
            <Reveal as="li" key={key} className="studio__principle" delay={index * 100}>
              <Icon className="studio__principle-icon" size={34} strokeWidth={1.4} aria-hidden="true" />
              <h3>{t(`principles.${key}.title`)}</h3>
              <p>{t(`principles.${key}.description`)}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
