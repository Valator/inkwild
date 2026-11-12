import { useTranslation } from 'react-i18next'
import { FORTUNA_PRIVACY_LAST_UPDATED, GOOGLE_ADS_PRIVACY_URL, GOOGLE_PRIVACY_URL, privacyPath } from '../../config/privacy'
import { siteConfig } from '../../config/siteConfig'
import { isEnabledLocale } from '../../i18n/locales'
import { PolicySection, PolicyShell } from './PolicyShell'

/** Little Fortuna's own privacy policy page (`/privacy/little-fortuna/`): the URL for the stores, AdMob and the game's Settings. */
export function FortunaPrivacyPage() {
  const { t, i18n } = useTranslation('privacyFortuna')
  const locale = isEnabledLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : siteConfig.defaultLocale

  return (
    <PolicyShell policy="privacyFortuna" updated={FORTUNA_PRIVACY_LAST_UPDATED}>
      <PolicySection id="collect" title={t('collect.title')}>
        <p>{t('collect.intro')}</p>
        <ul>
          <li>
            <strong>{t('collect.device.label')}</strong> {t('collect.device.text')}
          </li>
          <li>
            <strong>{t('collect.ads.label')}</strong> {t('collect.ads.text')}
          </li>
          <li>
            <strong>{t('collect.purchase.label')}</strong> {t('collect.purchase.text')}
          </li>
          <li>
            <strong>{t('collect.updates.label')}</strong> {t('collect.updates.text')}
          </li>
          <li>
            <strong>{t('collect.engine.label')}</strong> {t('collect.engine.text')}
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
        <p>
          <strong>{t('advertising.rewarded.label')}</strong> {t('advertising.rewarded.text')}
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
            <a href={GOOGLE_ADS_PRIVACY_URL} target="_blank" rel="noopener noreferrer" aria-label={t('advertising.learn.googleAria')}>
              {t('advertising.learn.google')}
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
        </ul>
      </PolicySection>

      <PolicySection id="providers" title={t('providers.title')}>
        <p>{t('providers.text')}</p>
        <p>
          <a href={GOOGLE_PRIVACY_URL} target="_blank" rel="noopener noreferrer" aria-label={t('providers.googleLinkAria')}>
            {t('providers.googleLink')}
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
        <p>
          <a href={`${privacyPath(locale)}#policy-website`} aria-label={t('website.linkAria')}>
            {t('website.link')}
          </a>
        </p>
      </PolicySection>
    </PolicyShell>
  )
}
