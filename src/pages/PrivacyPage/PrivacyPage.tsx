import { useTranslation } from 'react-i18next'
import { GOOGLE_ADS_PRIVACY_URL, GOOGLE_PRIVACY_URL, PRIVACY_LAST_UPDATED, UNITY_PRIVACY_URL } from '../../config/privacy'
import { PolicySection, PolicyShell } from './PolicyShell'

/** Magical Garden's privacy policy page (`/privacy/`), which also covers the website. */
export function PrivacyPage() {
  const { t } = useTranslation('privacy')

  return (
    <PolicyShell policy="privacy" updated={PRIVACY_LAST_UPDATED}>
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
            <strong>{t('collect.playgames.label')}</strong> {t('collect.playgames.text')}
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
            <strong>{t('collect.updates.label')}</strong> {t('collect.updates.text')}
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
            <a
              href={GOOGLE_ADS_PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('advertising.learn.googleAria')}
            >
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
          <li>{t('use.li5')}</li>
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
      </PolicySection>
    </PolicyShell>
  )
}
