import { createContext, useContext } from 'react'

export interface AnnouncerApi {
  /** Screen-reader-only announcement (e.g. "Language changed"). */
  announce: (message: string) => void
  /** Visible toast that is also announced. */
  notify: (message: string) => void
}

export const AnnouncerContext = createContext<AnnouncerApi | null>(null)

export function useAnnouncer(): AnnouncerApi {
  const context = useContext(AnnouncerContext)
  if (!context) throw new Error('useAnnouncer must be used inside <AnnouncerProvider>')
  return context
}
