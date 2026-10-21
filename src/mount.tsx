import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import { createI18n, reportResourceIssues } from './i18n'

/** Shared start-up for every page of the site (home, privacy, …): i18n, error boundary, React root. */
export function mountPage(page: ReactNode) {
  // Lets CSS hide scroll-reveal content only when scripts are actually running.
  document.documentElement.classList.add('js')
  reportResourceIssues()
  const i18n = createI18n()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>{page}</ErrorBoundary>
      </I18nextProvider>
    </StrictMode>,
  )
}
