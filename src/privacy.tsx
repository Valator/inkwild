import './styles/global.css' // first, so component styles can override it
import { mountPage } from './mount'
import { PrivacyPage } from './pages/PrivacyPage/PrivacyPage'

mountPage(<PrivacyPage />)
