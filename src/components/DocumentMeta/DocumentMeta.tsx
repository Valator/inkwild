import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PRIVACY_PAGE_LOCALES, PRIVACY_PATH, privacyPath } from '../../config/privacy'
import { getAbsoluteUrl, getCanonicalUrl } from '../../config/seo'
import { toSafeExternalUrl } from '../../config/links'
import { siteConfig } from '../../config/siteConfig'
import { enabledLocales, isEnabledLocale, locales } from '../../i18n/locales'
import { replaceHreflangLinks, replaceMetaGroup, upsertJsonLd, upsertLink, upsertMeta } from '../../lib/documentHead'

/**
 * Keeps <html lang/dir>, the title and every locale-dependent <meta> tag in sync with the active
 * language. Each tag is updated in place, so switching language never leaves stale or duplicate metadata.
 *
 * Note: a client-side switcher updates the page for people; search engines index the URL they fetch.
 * Locale-specific URLs (and hreflang) can be added later — see `src/config/seo.ts`.
 */
interface DocumentMetaProps {
  /** Which page is showing; each has its own title, description and canonical URL. */
  page?: 'home' | 'privacy'
}

export function DocumentMeta({ page = 'home' }: DocumentMetaProps) {
  const { t, i18n } = useTranslation(['common', 'footer', 'privacy'])
  const locale = isEnabledLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : siteConfig.defaultLocale

  useEffect(() => {
    const definition = locales[locale]
    const root = document.documentElement
    root.lang = definition.htmlLang
    root.dir = definition.dir
    root.dataset.locale = locale

    const isPrivacy = page === 'privacy'
    const title = isPrivacy ? t('privacy:meta.title') : t('common:meta.title')
    const description = isPrivacy ? t('privacy:meta.description') : t('common:meta.description')
    const canonical = getCanonicalUrl(locale, isPrivacy ? privacyPath(locale) : '/')
    const image = getAbsoluteUrl('/og-image.jpg')

    document.title = title
    upsertMeta('name', 'description', description)
    upsertLink('canonical', canonical)
    // hreflang only for pages that exist: one policy URL per locale in PRIVACY_PAGE_LOCALES.
    replaceHreflangLinks(
      isPrivacy
        ? [
            ...PRIVACY_PAGE_LOCALES.map((code) => ({
              hreflang: locales[code].htmlLang,
              href: getCanonicalUrl(code, privacyPath(code)),
            })),
            { hreflang: 'x-default', href: getCanonicalUrl(siteConfig.defaultLocale, PRIVACY_PATH) },
          ]
        : [],
    )

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', siteConfig.studioName)
    upsertMeta('property', 'og:title', isPrivacy ? title : t('common:meta.ogTitle'))
    upsertMeta('property', 'og:description', isPrivacy ? description : t('common:meta.ogDescription'))
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:alt', t('common:meta.ogImageAlt'))
    upsertMeta('property', 'og:locale', definition.ogLocale)
    replaceMetaGroup(
      'og:locale:alternate',
      enabledLocales.filter((code) => code !== locale).map((code) => locales[code].ogLocale),
    )

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', isPrivacy ? title : t('common:meta.ogTitle'))
    upsertMeta('name', 'twitter:description', isPrivacy ? description : t('common:meta.ogDescription'))
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', t('common:meta.ogImageAlt'))

    const sameAs = Object.values(siteConfig.socialLinks)
      .map((url) => toSafeExternalUrl(url))
      .filter((url): url is string => url !== null)
    upsertJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.studioName,
      url: `${siteConfig.domain}/`,
      logo: getAbsoluteUrl('/inkwild-logo.png'),
      description: t('common:meta.organizationDescription'),
      slogan: t('footer:tagline'),
      inLanguage: definition.htmlLang,
      ...(sameAs.length > 0 ? { sameAs } : {}),
      ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    })
  }, [locale, t, page])

  return null
}
