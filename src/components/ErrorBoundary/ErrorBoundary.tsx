import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

function Fallback() {
  const { t } = useTranslation('common')
  return (
    <div role="alert" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem' }}>{t('errors.title')}</h1>
        <p style={{ margin: '1rem 0 1.5rem' }}>{t('errors.message')}</p>
        <button type="button" onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem' }}>
          {t('errors.reload')}
        </button>
      </div>
    </div>
  )
}

interface State {
  failed: boolean
}

/** Last-resort guard so a rendering bug shows a translated message instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[app] Unhandled render error', error, info.componentStack)
  }

  override render() {
    return this.state.failed ? <Fallback /> : this.props.children
  }
}
