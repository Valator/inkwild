import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { observeReveal } from '../../lib/reveal'

interface RevealProps {
  as?: ElementType
  /** Stagger in milliseconds. */
  delay?: number
  /**
   * For content that is visible on first paint (the hero): use a plain CSS entrance animation
   * instead of waiting for an IntersectionObserver callback, so nothing above the fold is ever held back.
   */
  immediate?: boolean
  className?: string
  id?: string
  children: ReactNode
}

/** Fades content in once, when it first scrolls into view. Pure CSS transition; no React state. */
export function Reveal({ as: Tag = 'div', delay = 0, immediate = false, className, id, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    return element && !immediate ? observeReveal(element) : undefined
  }, [immediate])

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined
  const classes = [className, immediate ? 'rise' : undefined].filter(Boolean).join(' ') || undefined
  return (
    <Tag ref={ref} id={id} className={classes} data-reveal={immediate ? undefined : ''} style={style}>
      {children}
    </Tag>
  )
}
