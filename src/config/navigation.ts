/** Page sections reachable from the header, mobile menu and footer. */
export const sectionIds = ['home', 'game', 'about', 'contact'] as const
export type SectionId = (typeof sectionIds)[number]

/** `labelKey` resolves in the `navigation` namespace. */
export const navItems: readonly { readonly id: SectionId; readonly labelKey: SectionId }[] =
  sectionIds.map((id) => ({ id, labelKey: id }))
