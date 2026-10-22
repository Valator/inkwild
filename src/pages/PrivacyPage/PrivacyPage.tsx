import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toMailtoUrl } from '../../config/links'
import {
  LEVELPLAY_NETWORKS_URL,
  PRIVACY_LAST_UPDATED,
  UNITY_PLAYER_PRIVACY_URL,
  UNITY_PRIVACY_URL,
} from '../../config/privacy'
import { siteConfig } from '../../config/siteConfig'
import { AnnouncerProvider } from '../../components/Announcer/Announcer'
import { DocumentMeta } from '../../components/DocumentMeta/DocumentMeta'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'
import { isEnabledLocale, locales } from '../../i18n/locales'
import './PrivacyPage.css'

function PolicySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="policy__section" aria-labelledby={`policy-${id}`}>
      <h2 id={`policy-${id}`}>{title}</h2>
      {children}
    </section>
  )
}

/** Privacy policy page — the public URL (`/privacy/`) given to the App Store and Google Play. */
export function PrivacyPage() {
  const { t, i18n } = useTranslation(['privacy', 'common'])
  const locale = isEnabledLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : siteConfig.defaultLocale
  const updated = new Intl.DateTimeFormat(locales[locale].htmlLang, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(PRIVACY_LAST_UPDATED),
  )
  const mailto = toMailtoUrl(siteConfig.contactEmail)

  return (
    <AnnouncerProvider>
      <DocumentMeta page="privacy" />
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
              <p className="policy__updated">{t('updated', { date: updated })}</p>
            </header>

            <aside className="policy__summary" aria-labelledby="policy-summary">
              <h2 id="policy-summary">{t('summary.title')}</h2>
              <p>{t('summary.text')}</p>
            </aside>

            <p>{t('intro')}</p>

            <PolicySection id="collect" title={t('collect.title')}>
              <p>{t('collect.intro')}</p>
              <ul>
                <li>
                  <strong>{t('collect.id.label')}</strong> {t('collect.id.text')}
                </li>
                <li>
                  <strong>{t('collect.progress.label')}</strong> {t('collect.progress.text')}
                </li>
                <li>
                  <strong>{t('collect.ladder.label')}</strong> {t('collect.ladder.text')}
                </li>
                <li>
                  <strong>{t('collect.stats.label')}</strong> {t('collect.stats.text')}
                </li>
                <li>
                  <strong>{t('collect.ads.label')}</strong> {t('collect.ads.text')}
                </li>
                <li>
                  <strong>{t('collect.purchase.label')}</strong> {t('collect.purchase.text')}
                </li>
                <li>
                  <strong>{t('collect.device.label')}</strong> {t('collect.device.text')}
                </li>
              </ul>
            </PolicySection>

            <PolicySection id="nocollect" title={t('nocollect.title')}>
              <p>{t('nocollect.text')}</p>
            </PolicySection>

            <PolicySection id="advertising" title={t('advertising.title')}>
              <p>{t('advertising.intro')}</p>
              <p>
                <strong>{t('advertising.when.label')}</strong> {t('advertising.when.text')}
              </p>
              <p>{t('advertising.data.intro')}</p>
              <ul>
                <li>{t('advertising.data.li1')}</li>
                <li>{t('advertising.data.li2')}</li>
                <li>{t('advertising.data.li3')}</li>
                <li>{t('advertising.data.li4')}</li>
                <li>{t('advertising.data.li5')}</li>
              </ul>
              <p>{t('advertising.data.share')}</p>
              <p>
                <strong>{t('advertising.choices.label')}</strong> {t('advertising.choices.text')}
              </p>
              <p>{t('advertising.learn.intro')}</p>
              <ul>
                <li>
                  <a
                    href={UNITY_PLAYER_PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('advertising.learn.unityAria')}
                  >
                    {t('advertising.learn.unity')}
                  </a>
                </li>
                <li>
                  <a
                    href={LEVELPLAY_NETWORKS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('advertising.learn.networksAria')}
                  >
                    {t('advertising.learn.networks')}
                  </a>
                </li>
              </ul>
            </PolicySection>

            <PolicySection id="purchases" title={t('purchases.title')}>
              <p>{t('purchases.intro')}</p>
              <p>{t('purchases.pay')}</p>
              <p>{t('purchases.effect')}</p>
              <p>{t('purchases.restore')}</p>
            </PolicySection>

            <PolicySection id="use" title={t('use.title')}>
              <ul>
                <li>{t('use.li1')}</li>
                <li>{t('use.li2')}</li>
                <li>{t('use.li3')}</li>
                <li>{t('use.li4')}</li>
              </ul>
            </PolicySection>

            <PolicySection id="choices" title={t('choices.title')}>
              <ul>
                <li>{t('choices.li1')}</li>
                <li>{t('choices.li2')}</li>
                <li>{t('choices.li3')}</li>
                <li>{t('choices.li4')}</li>
                <li>{t('choices.li5')}</li>
              </ul>
            </PolicySection>

            <PolicySection id="providers" title={t('providers.title')}>
              <p>{t('providers.text')}</p>
              <p>
                <a href={UNITY_PRIVACY_URL} target="_blank" rel="noopener noreferrer" aria-label={t('providers.linkAria')}>
                  {t('providers.link')}
                </a>
              </p>
            </PolicySection>

            <PolicySection id="retention" title={t('retention.title')}>
              <p>{t('retention.text')}</p>
            </PolicySection>

            <PolicySection id="children" title={t('children.title')}>
              <p>{t('children.text')}</p>
            </PolicySection>

            <PolicySection id="rights" title={t('rights.title')}>
              <p>{t('rights.text')}</p>
            </PolicySection>

            <PolicySection id="security" title={t('security.title')}>
              <p>{t('security.text')}</p>
            </PolicySection>

            <PolicySection id="changes" title={t('changes.title')}>
              <p>{t('changes.text')}</p>
            </PolicySection>

            <PolicySection id="website" title={t('website.title')}>
              <p>{t('website.text')}</p>
            </PolicySection>

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
