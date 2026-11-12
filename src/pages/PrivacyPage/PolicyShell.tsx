import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toMailtoUrl } from '../../config/links'
import { siteConfig } from '../../config/siteConfig'
import { AnnouncerProvider } from '../../components/Announcer/Announcer'
import { DocumentMeta } from '../../components/DocumentMeta/DocumentMeta'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'
import { isEnabledLocale, locales } from '../../i18n/locales'
import './PrivacyPage.css'

export function PolicySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="policy__section" aria-labelledby={`policy-${id}`}>
      <h2 id={`policy-${id}`}>{title}</h2>
      {children}
    </section>
  )
}

interface PolicyShellProps {
  /** Which policy: its translation namespace, which is also what `DocumentMeta` takes. */
  policy: 'privacy' | 'privacyFortuna'
  /** ISO date the policy was last updated. */
  updated: string
  /** The sections between the intro and "Contact us". */
  children: ReactNode
}

/** What every policy page shares: head, header, title block, summary, intro, "Contact us" and footer. */
export function PolicyShell({ policy, updated, children }: PolicyShellProps) {
  const { t, i18n } = useTranslation([policy, 'common'])
  const locale = isEnabledLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : siteConfig.defaultLocale
  const updatedText = new Intl.DateTimeFormat(locales[locale].htmlLang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updated))
  const mailto = toMailtoUrl(siteConfig.contactEmail)

  return (
    <AnnouncerProvider>
      <DocumentMeta page={policy} />
      <a className="skip-link" href="#main">
        {t('common:skipToContent')}
      </a>
      <Header sectionBase="/" />
      <main id="main" tabIndex={-1} className="policy">
        <div className="container policy__wrap">
          <article className="policy__sheet">
            <header className="policy__header">
              <p className="eyebrow policy__eyebrow">{t('subtitle')}</p>
              <h1>{t('title')}</h1>
              <p className="policy__updated">{t('updated', { date: updatedText })}</p>
            </header>

            <aside className="policy__summary" aria-labelledby="policy-summary">
              <h2 id="policy-summary">{t('summary.title')}</h2>
              <p>{t('summary.text')}</p>
            </aside>

            <p>{t('intro')}</p>

            {children}

            <PolicySection id="contact" title={t('contact.title')}>
              <p>{t('contact.text')}</p>
              {mailto ? (
                <p>
                  <a
                    href={mailto}
                    aria-label={t('contact.emailAria', { studioName: siteConfig.studioName, email: siteConfig.contactEmail })}
                  >
                    {siteConfig.contactEmail}
                  </a>
                </p>
              ) : (
                <p className="policy__placeholder">{t('contact.empty')}</p>
              )}
            </PolicySection>
          </article>
        </div>
      </main>
      <Footer sectionBase="/" />
    </AnnouncerProvider>
  )
}
