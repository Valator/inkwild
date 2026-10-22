/**
 * Idempotent helpers for <head> metadata. Each one updates the existing tag if there is one,
 * so switching language never duplicates or contradicts metadata.
 */
type MetaAttribute = 'name' | 'property'

export function upsertMeta(attribute: MetaAttribute, key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function replaceMetaGroup(property: string, values: readonly string[]): void {
  document.head.querySelectorAll(`meta[property="${property}"]`).forEach((tag) => tag.remove())
  for (const value of values) {
    const tag = document.createElement('meta')
    tag.setAttribute('property', property)
    tag.setAttribute('content', value)
    document.head.appendChild(tag)
  }
}

export function upsertLink(rel: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]:not([hreflang])`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  let script = document.head.querySelector<HTMLScriptElement>(`script#${id}`)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

/** Replaces every `<link rel="alternate" hreflang>` with the given entries (each must point at a page that exists). */
export function replaceHreflangLinks(entries: readonly { hreflang: string; href: string }[]): void {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove())
  for (const { hreflang, href } of entries) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', hreflang)
    link.setAttribute('href', href)
    document.head.appendChild(link)
  }
}
