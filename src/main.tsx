import './styles/global.css' // first, so component styles can override it
import App from './App'
import { mountPage } from './mount'

mountPage(<App />)
