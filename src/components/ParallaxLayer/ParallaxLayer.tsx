import { useEffect, useRef, type ReactNode } from 'react'
import { registerParallax } from '../../lib/parallax'
import './ParallaxLayer.css'

interface ParallaxLayerProps {
  /** Positive lags behind the scroll (backgrounds); negative leads it (foreground). Keep it small (±0.04–0.14). */
  speed: number
  className?: string
  children?: ReactNode
}

/**
 * Decorative layer shifted by a small transform as the page scrolls.
 * It is oversized via CSS so the shift never reveals an edge.
 */
export function ParallaxLayer({ speed, className, children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    return element ? registerParallax(element, speed) : undefined
  }, [speed])
  return (
    <div ref={ref} className={['parallax-layer', className].filter(Boolean).join(' ')} aria-hidden="true">
      {children}
    </div>
  )
}
