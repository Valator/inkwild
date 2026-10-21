import { describe, expect, it } from 'vitest'
import { siteConfig } from '../config/siteConfig'
import { enabledLocales, isEnabledLocale, locales, namespaces } from './locales'
import { allResources } from './resources'
import { flatten, validateResources, type ResourceMap } from './validate'

const reference = siteConfig.defaultLocale
const validate = (resources: ResourceMap, localeList: readonly string[] = ['en', 'es']) =>
  validateResources({ resources, locales: localeList, referenceLocale: 'en', namespaces: ['common', 'game'] })

describe('shipped translations', () => {
  it('give every enabled locale all namespaces and keys, with no empty or mismatched values', () => {
    const issues = validateResources({ resources: allResources, locales: enabledLocales, referenceLocale: reference, namespaces })
    expect(issues).toEqual([])
  })

  it('provide a resource bundle for every enabled locale and the default locale is enabled', () => {
    for (const code of enabledLocales) expect(Object.keys(allResources[code] ?? {}).sort()).toEqual([...namespaces].sort())
    expect(isEnabledLocale(siteConfig.defaultLocale)).toBe(true)
    expect(siteConfig.supportedLocales).toEqual(enabledLocales)
  })

  it('use a unique html lang per locale', () => {
    const tags = enabledLocales.map((code) => locales[code].htmlLang)
    expect(new Set(tags).size).toBe(tags.length)
  })

  it('translate (not copy) the headline strings between English and Spanish', () => {
    const en = flatten(allResources.en?.home)
    const es = flatten(allResources.es?.home)
    expect(es.get('hero.title')).not.toBe(en.get('hero.title'))
  })
})

describe('validateResources', () => {
  const good: ResourceMap = {
    en: { common: { a: 'Hello {{name}}', nested: { b: 'B' } }, game: { c: 'C' } },
    es: { common: { a: 'Hola {{name}}', nested: { b: 'Be' } }, game: { c: 'Ce' } },
  }

  it('accepts complete, equivalent locales', () => {
    expect(validate(good)).toEqual([])
  })

  it('reports a missing locale, namespace and key', () => {
    expect(validate(good, ['en', 'es', 'fr']).map((i) => i.kind)).toEqual(['missing-locale'])
    expect(validate({ ...good, es: { common: good.es!.common! } }).map((i) => i.kind)).toEqual(['missing-namespace'])
    const missingKey = { ...good, es: { ...good.es!, common: { a: 'Hola {{name}}' } } }
    expect(validate(missingKey)).toEqual([expect.objectContaining({ kind: 'missing-key', key: 'nested.b' })])
  })

  it('reports empty values, wrong types and extra keys', () => {
    const bad = { ...good, es: { ...good.es!, common: { a: '  ', nested: { b: 3 }, extra: 'x' } } } as unknown as ResourceMap
    const kinds = validate(bad).map((i) => i.kind)
    expect(kinds).toContain('empty-value')
    expect(kinds).toContain('type-mismatch')
    expect(kinds).toContain('extra-key')
  })

  it('reports interpolation placeholders that differ between locales', () => {
    const bad = { ...good, es: { ...good.es!, common: { a: 'Hola {{nombre}}', nested: { b: 'Be' } } } }
    expect(validate(bad)).toEqual([expect.objectContaining({ kind: 'placeholder-mismatch', key: 'a' })])
  })

  it('lets locales use different plural forms but requires "_other"', () => {
    const resources: ResourceMap = {
      en: { common: { item_one: '{{count}} item', item_other: '{{count}} items' }, game: { c: 'C' } },
      es: { common: { item_one: '{{count}} elemento', item_many: '{{count}} de elementos', item_other: '{{count}} elementos' }, game: { c: 'C' } },
    }
    expect(validate(resources)).toEqual([])
    const noOther = { ...resources, es: { ...resources.es!, common: { item_one: '{{count}} elemento' } } }
    expect(validate(noOther).map((i) => i.kind)).toContain('missing-plural-form')
  })
})
