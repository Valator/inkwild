# InkWild Games website

Single-page, multilingual (English / Spanish) site for **InkWild Games** and its first game, **Magical Garden**.
React 19 · TypeScript (strict) · Vite · `i18next` + `react-i18next` · plain CSS with custom properties.

```bash
npm install                      # .npmrc sets legacy-peer-deps (see "Install note")
npm run dev                      # http://localhost:5173
npm run check                    # i18n validation + tsc + lint + tests + production build
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `preview` | Vite dev server / production build (runs i18n validation and `tsc` first) / serve the build |
| `npm run validate:i18n` | Fails if any enabled locale is incomplete (see below) |
| `npm run typecheck` · `lint` · `test` | `tsc -b` · oxlint · Vitest (jsdom + Testing Library) |
| `npm run assets` | Regenerates optimised images in `src/assets` and `public` from the original art |

> **Install note:** `.npmrc` enables `legacy-peer-deps`, which worked around an npm resolver crash on the scaffolded Vite 8 toolchain.

## Configuration

Everything an owner is likely to edit lives in [`src/config/siteConfig.ts`](src/config/siteConfig.ts):
contact email, the App Store / Google Play URLs, social profiles, default locale, and whether browser-language
detection and persistence are on. **Empty values are never rendered as links** — the UI shows a translated
"coming soon" state instead. Filled-in URLs must be `https:` (or a valid email); anything else is ignored.

## Languages

Launch languages are English (`en`, default) and Spanish (`es`). Every user-visible string — including alt text,
ARIA labels, toast messages and metadata — comes from `src/i18n/resources/<locale>/<namespace>.json`.

### Add a language (e.g. French)

1. Add `fr: { label: 'Français', shortLabel: 'FR', htmlLang: 'fr', dir: 'ltr', ogLocale: 'fr_FR', enabled: true }` to
   [`src/i18n/locales.ts`](src/i18n/locales.ts).
2. Copy `src/i18n/resources/en/` to `src/i18n/resources/fr/` and translate the values.
3. Run `npm run validate:i18n` — it lists every missing key, empty value or mismatched `{{placeholder}}`.
4. Optional: add `:lang(fr) { … }` typography rules to `src/styles/global.css`.

No component changes are needed: the switcher, detection, metadata, `<html lang/dir>` and Open Graph alternates are
all driven by the locale registry, and resource files are discovered automatically. With more than three enabled
locales the switcher becomes a native `<select>`.

### Behaviour

* **Selection order:** saved choice (`localStorage` key `inkwild.locale`) → browser language (`es-MX` → `es`) → default.
  Only an *explicit* choice is stored; storage errors are swallowed.
* **Metadata:** `<html lang>`/`dir`, title, description, canonical, Open Graph/Twitter tags and Organization JSON-LD are
  updated in place on every switch (no duplicates).
* **Missing translations:** English is a safety-net fallback only. Missing keys are logged with `console.error`, the
  build fails on incomplete locales, and an untranslated key is never rendered (it renders empty).
* **Typed keys:** `t('game:tagline')` is checked against the English files (`src/i18n/i18next.d.ts`).

### SEO caveat

A client-side language switcher updates the page for visitors, but search engines index the URL they fetch, so only
the default (English) text is guaranteed to be indexed. For real multilingual SEO, add locale routes
(`/en/`, `/es/`), return the matching URL from `getCanonicalUrl()` in `src/config/seo.ts`, and emit `hreflang`
alternates for those pages. No `hreflang` is emitted today because no alternate URLs exist.

## Motion

* `ParticleField` — canvas fireflies; fewer on phones/low-end devices, paused off-screen and in hidden tabs.
* `ParallaxLayer` — small transform offsets from one passive scroll listener (desktop only, never scroll-jacking).
* `Reveal` — one shared `IntersectionObserver`; hero copy uses a CSS entrance instead.
* `prefers-reduced-motion: reduce` removes particles, parallax, floating and reveal transitions.

## Assets

Optimised images are committed. `npm run assets` rebuilds them from the Magical Garden Unity project
(`~/MagicalGarden/Assets/Art`, `DesignProposals`) — override with `MG_ART_DIR` / `MG_DESIGN_DIR`.

**InkWild Games logo:** the supplied original is kept untouched in `assets-source/inkwild-logo.webp` and only resized by
`npm run assets` (to `src/assets/brand/inkwild-logo.webp`, `public/inkwild-logo.png`, favicons and the social image). Its
wordmark is dark green, so the site never recolours it: it sits on a Story Parchment plaque (`.logo-plaque` in
`src/styles/global.css`). To update the logo, replace the file in `assets-source/` and re-run `npm run assets`.

## Structure

```
src/
  assets/{brand,games}   optimised images
  components/            Header, LanguageSwitcher, MobileNavigation, ParticleField, ParallaxLayer, Reveal,
                         StoreButtons, SocialLinks, Footer, DocumentMeta, Announcer, …
  sections/              HeroSection, MagicalGardenSection, StudioSection, FollowSection (#contact)
  config/                siteConfig, navigation, seo, links (URL validation)
  i18n/                  locales registry, detection, storage, validation, resources/<locale>/<ns>.json
  hooks/ lib/            reduced motion, active section, parallax & reveal engines, <head> helpers
  styles/                tokens.css (brand palette), global.css, animations.css
scripts/                 validate-i18n.ts, prepare-assets.mjs
```
