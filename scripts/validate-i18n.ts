/**
 * Fails (exit code 1) when any enabled locale is incomplete.
 *
 *   npm run validate:i18n
 *
 * Checks: every enabled locale has every namespace, the same keys as the reference locale,
 * no empty values, matching {{placeholders}}, and no stray resource folders.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/config/siteConfig.ts'
import { enabledLocales, isLocaleCode, locales, namespaces } from '../src/i18n/locales.ts'
import { formatIssues, validateResources, type ResourceMap, type ValidationIssue } from '../src/i18n/validate.ts'

const resourcesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/i18n/resources')
const resources: ResourceMap = {}
const issues: ValidationIssue[] = []

for (const folder of readdirSync(resourcesDir)) {
  if (!statSync(path.join(resourcesDir, folder)).isDirectory()) continue
  if (!isLocaleCode(folder)) {
    issues.push({ kind: 'unknown-namespace', locale: folder, message: `Folder "${folder}" is not registered in src/i18n/locales.ts.` })
    continue
  }
  resources[folder] = {}
  for (const file of readdirSync(path.join(resourcesDir, folder))) {
    if (!file.endsWith('.json')) continue
    const full = path.join(resourcesDir, folder, file)
    try {
      resources[folder][file.replace(/\.json$/, '')] = JSON.parse(readFileSync(full, 'utf8'))
    } catch (error) {
      issues.push({ kind: 'type-mismatch', locale: folder, namespace: file, message: `Invalid JSON: ${(error as Error).message}` })
    }
  }
}

if (!enabledLocales.includes(siteConfig.defaultLocale)) {
  issues.push({ kind: 'missing-locale', locale: siteConfig.defaultLocale, message: 'siteConfig.defaultLocale is not an enabled locale.' })
}

issues.push(
  ...validateResources({
    resources,
    locales: enabledLocales,
    referenceLocale: siteConfig.defaultLocale,
    namespaces,
  }),
)

if (issues.length > 0) {
  console.error(`✖ i18n validation failed with ${issues.length} problem(s):\n${formatIssues(issues)}`)
  process.exit(1)
}

const summary = enabledLocales.map((code) => `${code} (${locales[code].label})`).join(', ')
console.log(`✔ i18n OK — ${enabledLocales.length} locales [${summary}] × ${namespaces.length} namespaces.`)
