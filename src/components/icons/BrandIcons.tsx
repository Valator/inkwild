import type { SVGProps } from 'react'

/** Lucide dropped brand logos, so the few we need live here. All are decorative (`aria-hidden`). */
type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) =>
  ({ viewBox: '0 0 24 24', 'aria-hidden': true, focusable: 'false', fill: 'currentColor', ...props }) as IconProps

export function AppleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M16.37 12.62c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.85 0-2.14-.95-3.52-.93-1.81.03-3.48 1.05-4.41 2.67-1.88 3.26-.48 8.09 1.35 10.74.9 1.3 1.96 2.75 3.36 2.7 1.35-.05 1.86-.87 3.49-.87 1.63 0 2.09.87 3.52.84 1.45-.03 2.37-1.32 3.26-2.62 1.03-1.5 1.45-2.96 1.48-3.03-.03-.01-2.83-1.09-2.86-4.3zM13.7 4.67c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.13 1.61-.69.8-1.29 2.07-1.13 3.3 1.19.09 2.4-.61 3.16-1.51z" />
    </svg>
  )
}

export function GooglePlayIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, fill: 'none' })}>
      <path d="M3.6 2.4 13.2 12 3.6 21.6a1.6 1.6 0 0 1-.6-1.3V3.7c0-.5.2-1 .6-1.3z" fill="#00a0ff" />
      <path d="M16.4 8.8 13.2 12l3.2 3.2 3.9-2.2c1.2-.7 1.2-2.3 0-3z" fill="#ffc400" />
      <path d="M3.6 2.4c.4-.3.9-.4 1.5-.1l11.3 6.5L13.2 12z" fill="#00d775" />
      <path d="m3.6 21.6 9.6-9.6 3.2 3.2-11.3 6.5c-.6.3-1.1.2-1.5-.1z" fill="#f13a4b" />
    </svg>
  )
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.76 2 12 2 12s0 3.24.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' })}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.3V2h-3.5v13.7a2.9 2.9 0 1 1-2-2.8V9.4a6.4 6.4 0 1 0 5.5 6.3V8.6a8.2 8.2 0 0 0 4.8 1.5V6.7z" />
    </svg>
  )
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fillRule="evenodd"
        d="M5 6.5C6.5 5.7 8 5.2 9.5 5l.5 1h4l.5-1c1.5.2 3 .7 4.5 1.5 1.7 2.8 2.5 5.7 2.2 9-1.3 1-2.7 1.6-4.2 2l-.9-1.5c.5-.2 1-.4 1.4-.7l-.3-.3c-2.7 1.2-5.7 1.2-8.4 0l-.3.3c.4.3.9.5 1.4.7L7 17.500c-1.500-.4-2.900-1-4.200-2-.3-3.300.5-6.200 2.200-9zm3.500 4.700c-.8 0-1.500.7-1.500 1.600s.7 1.600 1.500 1.600 1.500-.7 1.500-1.600-.7-1.600-1.500-1.600zm7 0c-.8 0-1.500.7-1.500 1.600s.7 1.600 1.500 1.600 1.500-.7 1.500-1.600-.7-1.600-1.500-1.600z"
      />
    </svg>
  )
}
