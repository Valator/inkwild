import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary'

interface CommonProps {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

/** One button style for links and real buttons. Labels wrap, so longer translations never clip. */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = 'primary', icon, children, className, ...rest } = props
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {icon ? (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  )
  if (props.href !== undefined) {
    const { href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
    return (
      <a className={classes} href={href} {...anchor}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
