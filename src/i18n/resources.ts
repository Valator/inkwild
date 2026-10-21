import { enabledLocales, isLocaleCode, type LocaleCode, type Namespace } from './locales'

type Tree = Record<string, unknown>
export type Resources = Record<string, Record<string, Tree>>

/**
 * Every `resources/<locale>/<namespace>.json` file is picked up automatically, so a
 * new language is just a new folder — no import lists to maintain.
 */
const modules = import.meta.glob<Tree>('./resources/*/*.json', {
  eager: true,
  import: 'default',
})

/** All bundled resources, including locales that are not enabled yet. */
export const allResources: Resources = {}
for (const [filePath, content] of Object.entries(modules)) {
  const match = /\.\/resources\/([^/]+)\/([^/]+)\.json$/.exec(filePath)
  if (!match) continue
  const [, locale, namespace] = match as unknown as [string, string, string]
  ;(allResources[locale] ??= {})[namespace] = content
}

/** Resources of the enabled locales only — what i18next is initialised with. */
export const resources = Object.fromEntries(
  enabledLocales.map((code) => [code, allResources[code] ?? {}]),
) as Record<LocaleCode, Record<Namespace, Tree>>

export function hasResourcesFor(code: string): boolean {
  return isLocaleCode(code) && code in allResources
}
