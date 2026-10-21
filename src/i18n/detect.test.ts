import { describe, expect, it, vi } from 'vitest'
import { matchLocale, resolveInitialLocale } from './detect'
import { LOCALE_STORAGE_KEY, readStoredLocale, writeStoredLocale } from './storage'

describe('matchLocale', () => {
  it.each([
    ['en', 'en'],
    ['en-US', 'en'],
    ['en_GB', 'en'],
    ['es', 'es'],
    ['es-MX', 'es'],
    ['ES-419', 'es'],
  ])('maps %s to %s', (tag, expected) => {
    expect(matchLocale(tag)).toBe(expected)
  })

  it.each(['fr', 'fr-CA', 'ja', 'pt-BR', '', 'xx-yy'])('does not match unsupported %s', (tag) => {
    expect(matchLocale(tag)).toBeNull()
  })
})

describe('resolveInitialLocale', () => {
  const base = { stored: null, browserLanguages: [], fallback: 'en' as const, detectBrowserLocale: true }

  it('restores a previous choice over the browser language', () => {
    expect(resolveInitialLocale({ ...base, stored: 'es', browserLanguages: ['en-US'] })).toBe('es')
  })

  it('uses the first supported browser language', () => {
    expect(resolveInitialLocale({ ...base, browserLanguages: ['fr-FR', 'es-MX', 'en'] })).toBe('es')
  })

  it('falls back to English for an unsupported browser language', () => {
    expect(resolveInitialLocale({ ...base, browserLanguages: ['fr-FR', 'de'] })).toBe('en')
  })

  it('ignores the browser when detection is turned off', () => {
    expect(resolveInitialLocale({ ...base, detectBrowserLocale: false, browserLanguages: ['es-MX'] })).toBe('en')
  })

  it('ignores a stored locale that is not enabled', () => {
    expect(resolveInitialLocale({ ...base, stored: 'es', supported: ['en'], browserLanguages: [] })).toBe('en')
  })
})

describe('locale storage', () => {
  it('round-trips a choice and rejects unknown stored values', () => {
    writeStoredLocale('es')
    expect(readStoredLocale()).toBe('es')
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'klingon')
    expect(readStoredLocale()).toBeNull()
  })

  it('survives storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readStoredLocale()).toBeNull()
    expect(() => writeStoredLocale('es')).not.toThrow()
  })
})
