/**
 * Pure translation-resource validation, shared by `npm run validate:i18n`, the unit tests
 * and the runtime start-up check. No browser or Node APIs — it only inspects objects.
 */
export type Tree = Record<string, unknown>
export type ResourceMap = Record<string, Record<string, Tree>>

export type IssueKind =
  | 'missing-locale'
  | 'missing-namespace'
  | 'unknown-namespace'
  | 'missing-key'
  | 'extra-key'
  | 'empty-value'
  | 'type-mismatch'
  | 'placeholder-mismatch'
  | 'missing-plural-form'

export interface ValidationIssue {
  kind: IssueKind
  locale: string
  namespace?: string
  key?: string
  message: string
}

export interface ValidateOptions {
  resources: ResourceMap
  /** Locales that must be complete. */
  locales: readonly string[]
  /** The locale all others are compared against. */
  referenceLocale: string
  /** Namespaces every locale must provide. */
  namespaces: readonly string[]
}

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/
const PLACEHOLDER = /{{\s*([\w.]+)\s*(?:,[^}]*)?}}/g

/** Flattens a nested JSON tree into `a.b.c → string` leaves. */
export function flatten(tree: unknown, prefix = ''): Map<string, unknown> {
  const out = new Map<string, unknown>()
  if (tree !== null && typeof tree === 'object' && !Array.isArray(tree)) {
    for (const [key, value] of Object.entries(tree)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [k, v] of flatten(value, path)) out.set(k, v)
      } else {
        out.set(path, value)
      }
    }
  }
  return out
}

/** Plural variants (`item_one`, `item_other`) collapse to one logical key so locales may differ in plural forms. */
const baseKey = (key: string) => key.replace(PLURAL_SUFFIX, '')

function groupByBase(flat: Map<string, unknown>): Map<string, Map<string, unknown>> {
  const groups = new Map<string, Map<string, unknown>>()
  for (const [key, value] of flat) {
    const base = baseKey(key)
    const group = groups.get(base) ?? new Map<string, unknown>()
    group.set(key, value)
    groups.set(base, group)
  }
  return groups
}

function placeholdersOf(values: Iterable<unknown>): Set<string> {
  const found = new Set<string>()
  for (const value of values) {
    if (typeof value !== 'string') continue
    for (const match of value.matchAll(PLACEHOLDER)) found.add(match[1] as string)
  }
  return found
}

export function validateResources({
  resources,
  locales,
  referenceLocale,
  namespaces,
}: ValidateOptions): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const push = (issue: ValidationIssue) => issues.push(issue)

  for (const locale of locales) {
    const bundle = resources[locale]
    if (!bundle) {
      push({ kind: 'missing-locale', locale, message: `No resources found for locale "${locale}".` })
      continue
    }

    for (const ns of Object.keys(bundle)) {
      if (!namespaces.includes(ns)) {
        push({ kind: 'unknown-namespace', locale, namespace: ns, message: `Namespace "${ns}" is not declared in src/i18n/locales.ts.` })
      }
    }

    for (const ns of namespaces) {
      const tree = bundle[ns]
      if (!tree) {
        push({ kind: 'missing-namespace', locale, namespace: ns, message: `Missing namespace file "${ns}.json".` })
        continue
      }

      const flat = flatten(tree)
      for (const [key, value] of flat) {
        if (typeof value !== 'string') {
          push({ kind: 'type-mismatch', locale, namespace: ns, key, message: `"${key}" must be a string (found ${Array.isArray(value) ? 'array' : typeof value}).` })
        } else if (value.trim() === '') {
          push({ kind: 'empty-value', locale, namespace: ns, key, message: `"${key}" is empty.` })
        }
      }

      if (locale === referenceLocale) continue
      const referenceTree = resources[referenceLocale]?.[ns]
      if (!referenceTree) continue

      const refGroups = groupByBase(flatten(referenceTree))
      const groups = groupByBase(flat)

      for (const [base, refGroup] of refGroups) {
        const group = groups.get(base)
        if (!group) {
          push({ kind: 'missing-key', locale, namespace: ns, key: base, message: `Missing key "${base}" (present in ${referenceLocale}).` })
          continue
        }
        const isPlural = [...refGroup.keys()].some((k) => PLURAL_SUFFIX.test(k))
        if (isPlural && ![...group.keys()].some((k) => k.endsWith('_other'))) {
          push({ kind: 'missing-plural-form', locale, namespace: ns, key: base, message: `Plural key "${base}" needs at least an "_other" form.` })
        }
        const expected = placeholdersOf(refGroup.values())
        const actual = placeholdersOf(group.values())
        const differs =
          expected.size !== actual.size || [...expected].some((placeholder) => !actual.has(placeholder))
        if (differs) {
          push({
            kind: 'placeholder-mismatch',
            locale,
            namespace: ns,
            key: base,
            message: `"${base}" uses {{${[...actual].join('}}, {{')}}} but ${referenceLocale} uses {{${[...expected].join('}}, {{')}}}.`,
          })
        }
      }
      for (const base of groups.keys()) {
        if (!refGroups.has(base)) {
          push({ kind: 'extra-key', locale, namespace: ns, key: base, message: `Key "${base}" does not exist in ${referenceLocale}.` })
        }
      }
    }
  }
  return issues
}

export function formatIssues(issues: readonly ValidationIssue[]): string {
  return issues
    .map((i) => `  [${i.locale}${i.namespace ? `/${i.namespace}` : ''}] ${i.message}`)
    .join('\n')
}
