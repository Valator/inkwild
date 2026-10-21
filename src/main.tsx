import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './styles/global.css'
import App from './App'
import { createI18n, reportResourceIssues } from './i18n'

// Lets CSS hide scroll-reveal content only when scripts are actually running.
document.documentElement.classList.add('js')

reportResourceIssues()
const i18n = createI18n()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
