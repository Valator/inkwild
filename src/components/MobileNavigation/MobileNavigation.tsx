import { Menu, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { navItems, type SectionId } from '../../config/navigation'
import { navigateToSection } from '../../lib/navigateToSection'
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher'
import fairy from '../../assets/games/fairy.webp'
import logo from '../../assets/brand/inkwild-logo.webp'
import './MobileNavigation.css'

interface MobileNavigationProps {
  activeSection: SectionId
}

const FOCUSABLE = 'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])'

/**
 * Slide-in menu for small screens. A modal dialog: Escape closes it, Tab stays inside it,
 * scrolling the page behind is locked, and focus returns to the toggle on close.
 */
export function MobileNavigation({ activeSection }: MobileNavigationProps) {
  const { t } = useTranslation(['navigation', 'common', 'footer'])
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const close = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    closeRef.current?.focus()
    // The menu is irrelevant once the desktop navigation is showing.
    const wide = window.matchMedia?.('(min-width: 60rem)')
    const onWide = () => wide?.matches && setOpen(false)
    wide?.addEventListener('change', onWide)
    return () => {
      root.style.overflow = previous
      wide?.removeEventListener('change', onWide)
    }
  }, [open])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
      return
    }
    if (event.key !== 'Tab') return
    const items = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault()
    close(false)
    // Wait a frame so the scroll lock is released before scrolling.
    requestAnimationFrame(() => navigateToSection(id))
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={t('navigation:menu.open')}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" size={26} />
      </button>

      {/* Portalled: the header's backdrop-filter would otherwise become the containing block of this fixed overlay. */}
      {createPortal(
      <div className="mobile-nav" data-open={open} inert={!open}>
        <div className="mobile-nav__backdrop" onClick={() => close()} aria-hidden="true" />
        <div
          ref={panelRef}
          id={panelId}
          className="mobile-nav__panel"
          role="dialog"
          aria-modal="true"
          aria-label={t('navigation:menu.title')}
          onKeyDown={onKeyDown}
        >
          <div className="mobile-nav__top">
            <span className="logo-plaque mobile-nav__logo">
              <img src={logo} width={1000} height={375} alt={t('common:brand.logoAlt')} />
            </span>
            <button ref={closeRef} type="button" className="mobile-nav__close" aria-label={t('navigation:menu.close')} onClick={() => close()}>
              <X aria-hidden="true" size={26} />
            </button>
          </div>

          <LanguageSwitcher className="mobile-nav__language" />

          <nav aria-label={t('navigation:primaryLabel')}>
            <ul className="mobile-nav__list">
              {navItems.map(({ id, labelKey }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="mobile-nav__link"
                    aria-current={activeSection === id ? 'location' : undefined}
                    onClick={(event) => onNavigate(event, id)}
                  >
                    {t(`navigation:${labelKey}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-nav__footer" aria-hidden="true">
            <img src={fairy} width={720} height={720} alt="" loading="lazy" />
            <p>{t('footer:tagline')}</p>
          </div>
        </div>
      </div>,
        document.body,
      )}
    </>
  )
}
