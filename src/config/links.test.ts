import { describe, expect, it } from 'vitest'
import { toMailtoUrl, toSafeExternalUrl } from './links'

describe('toSafeExternalUrl', () => {
  it('accepts https URLs', () => {
    expect(toSafeExternalUrl('https://apps.apple.com/app/id1')).toBe('https://apps.apple.com/app/id1')
  })

  it.each(['', '   ', 'javascript:alert(1)', 'data:text/html,hi', 'http://insecure.example', 'not a url', '//evil.example'])(
    'rejects %j',
    (value) => {
      expect(toSafeExternalUrl(value)).toBeNull()
    },
  )
})

describe('toMailtoUrl', () => {
  it('builds a mailto link for a valid address', () => {
    expect(toMailtoUrl(' hello@inkwildgames.com ')).toBe('mailto:hello@inkwildgames.com')
  })

  it.each(['', 'nope', 'a@b', 'a b@c.com', 'x@y.com,z@y.com'])('rejects %j', (value) => {
    expect(toMailtoUrl(value)).toBeNull()
  })
})
