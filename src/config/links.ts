/**
 * Validation for externally supplied destinations. Anything that fails returns
 * `null`, which the UI treats as "not configured" instead of rendering a broken link.
 */
export function toSafeExternalUrl(
  value: string,
  allowedProtocols: readonly string[] = ['https:'],
): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    return allowedProtocols.includes(url.protocol) ? url.toString() : null
  } catch {
    return null
  }
}

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/

export function toMailtoUrl(email: string): string | null {
  const trimmed = email.trim()
  return EMAIL_PATTERN.test(trimmed) ? `mailto:${trimmed}` : null
}
