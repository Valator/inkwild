import { useTranslation } from 'react-i18next'
import { AnnouncerProvider } from './components/Announcer/Announcer'
import { DocumentMeta } from './components/DocumentMeta/DocumentMeta'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { FollowSection } from './sections/FollowSection/FollowSection'
import { HeroSection } from './sections/HeroSection/HeroSection'
import { MagicalGardenSection } from './sections/MagicalGardenSection/MagicalGardenSection'
import { StudioSection } from './sections/StudioSection/StudioSection'

export default function App() {
  const { t } = useTranslation('common')
  return (
    <AnnouncerProvider>
        <DocumentMeta />
        <a className="skip-link" href="#main">
          {t('skipToContent')}
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          <HeroSection />
          <MagicalGardenSection />
          <StudioSection />
          <FollowSection />
        </main>
        <Footer />
    </AnnouncerProvider>
  )
}
