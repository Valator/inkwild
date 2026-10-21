import { useTranslation } from 'react-i18next'
import { navItems, sectionIds, type SectionId } from '../../config/navigation'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { navigateToSection } from '../../lib/navigateToSection'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import { MobileNavigation } from '../MobileNavigation/MobileNavigation'
import logo from '../../assets/brand/inkwild-logo.webp'
import './Header.css'

export function Header() {
  const { t } = useTranslation(['navigation', 'common'])
  const active = useActiveSection<SectionId>(sectionIds)
  const scrolled = useScrolled()

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    // Keep the browser's native behaviour for modified clicks (open in a new tab, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    navigateToSection(id)
  }

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="site-header__inner container">
        <a className="site-header__logo logo-mark" href="#home" onClick={(event) => go(event, 'home')}>
          <img src={logo} width={1000} height={375} alt={t('common:brand.logoAlt')} />
        </a>

        <nav className="site-header__nav" aria-label={t('navigation:primaryLabel')}>
          <ul>
            {navItems.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  className="site-header__link"
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={(event) => go(event, id)}
                >
                  {t(`navigation:${labelKey}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />
          <MobileNavigation activeSection={active} />
        </div>
      </div>
    </header>
  )
}
