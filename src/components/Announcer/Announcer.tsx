import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnnouncerContext } from './context'
import './Announcer.css'

const TOAST_MS = 6000

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState('')
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  const announce = useCallback((message: string) => {
    // Clearing first makes repeated identical messages announce again.
    setAnnouncement('')
    window.setTimeout(() => setAnnouncement(message), 50)
  }, [])

  const notify = useCallback((message: string) => {
    setToast('')
    window.clearTimeout(toastTimer.current)
    window.setTimeout(() => {
      setToast(message)
      toastTimer.current = window.setTimeout(() => setToast(''), TOAST_MS)
    }, 30)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const api = useMemo(() => ({ announce, notify }), [announce, notify])

  return (
    <AnnouncerContext.Provider value={api}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true" data-testid="announcer">
        {announcement}
      </div>
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="true" data-testid="toast">
        {toast ? <p className="toast">{toast}</p> : null}
      </div>
    </AnnouncerContext.Provider>
  )
}
