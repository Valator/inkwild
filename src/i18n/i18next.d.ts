import 'i18next'
import type common from './resources/en/common.json'
import type follow from './resources/en/follow.json'
import type footer from './resources/en/footer.json'
import type game from './resources/en/game.json'
import type home from './resources/en/home.json'
import type navigation from './resources/en/navigation.json'
import type studio from './resources/en/studio.json'

/** Typed keys: `t('game:tagline')` autocompletes and a typo fails `tsc`. English is the reference shape. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      navigation: typeof navigation
      home: typeof home
      game: typeof game
      studio: typeof studio
      follow: typeof follow
      footer: typeof footer
    }
  }
}
