import './styles/global.css' // first, so component styles can override it
import { mountPage } from './mount'
import { FortunaPrivacyPage } from './pages/PrivacyPage/FortunaPrivacyPage'

mountPage(<FortunaPrivacyPage />)
