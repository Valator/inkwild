import type { ComponentType, SVGProps } from 'react'
import { DiscordIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '../components/icons/BrandIcons'
import { toSafeExternalUrl } from '../config/links'
import { siteConfig, type SiteConfig } from '../config/siteConfig'

export type Network = keyof SiteConfig['socialLinks']

const NETWORKS: readonly { id: Network; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'youtube', Icon: YouTubeIcon },
  { id: 'instagram', Icon: InstagramIcon },
  { id: 'tiktok', Icon: TikTokIcon },
  { id: 'discord', Icon: DiscordIcon },
]

/** Social profiles that are configured with a safe https URL, in display order. */
export function getConfiguredSocialLinks(links: SiteConfig['socialLinks'] = siteConfig.socialLinks) {
  return NETWORKS.flatMap(({ id, Icon }) => {
    const href = toSafeExternalUrl(links[id])
    return href ? [{ id, Icon, href }] : []
  })
}
