import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './ParticleField.css'

interface ParticleFieldProps {
  /** Scales the particle count (1 = default). */
  density?: number
  className?: string
}

interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  driftX: number
  driftY: number
  flicker: number
  phase: number
  tint: 0 | 1 | 2
}

/** Warm gold dust, with the odd pale-green and soft-white mote. */
const TINTS = ['230, 196, 135', '255, 240, 205', '178, 214, 160'] as const

const SPRITE_SIZE = 64

function createSprite(rgb: string): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = SPRITE_SIZE
  const ctx = sprite.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, `rgba(${rgb}, 1)`)
    gradient.addColorStop(0.18, `rgba(${rgb}, 0.85)`)
    gradient.addColorStop(0.5, `rgba(${rgb}, 0.18)`)
    gradient.addColorStop(1, `rgba(${rgb}, 0)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
  }
  return sprite
}

function isLowCapability(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4
}

/**
 * Lightweight canvas of drifting, flickering firefly motes.
 *
 * - No work at all with `prefers-reduced-motion: reduce` (nothing is rendered).
 * - Fewer, cheaper particles on phones and low-capability devices.
 * - The loop only runs while the canvas is on screen and the tab is visible.
 * - All observers, listeners and the animation frame are released on unmount.
 */
export function ParticleField({ density = 1, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reducedMotion) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sprites = TINTS.map(createSprite)
    const phone = window.matchMedia?.('(max-width: 47.99rem)')
    const lowEnd = isLowCapability()
    const frameInterval = lowEnd ? 1000 / 30 : 0

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let last = 0
    let onScreen = true

    const targetCount = () => {
      const area = width * height
      const perArea = phone?.matches ? 1 / 42000 : 1 / 20000
      const capability = lowEnd ? 0.6 : 1
      return Math.max(10, Math.min(72, Math.round(area * perArea * density * capability)))
    }

    const spawn = (anywhere: boolean): Particle => {
      const size = 3 + Math.random() * 7
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + size * 4,
        size,
        alpha: 0.3 + Math.random() * 0.55,
        // Larger motes drift more slowly — a cheap sense of depth.
        driftX: (Math.random() - 0.5) * 7,
        driftY: -(3 + Math.random() * 11) * (1 - size / 16),
        flicker: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random() < 0.72 ? 0 : Math.random() < 0.6 ? 1 : 2,
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, phone?.matches || lowEnd ? 1.5 : 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const wanted = targetCount()
      if (particles.length > wanted) particles.length = wanted
      while (particles.length < wanted) particles.push(spawn(true))
    }

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      if (frameInterval && time - last < frameInterval) return
      const dt = Math.min((time - (last || time)) / 1000, 0.1)
      last = time

      ctx.clearRect(0, 0, width, height)
      const t = time / 1000
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as Particle
        p.x += p.driftX * dt + Math.sin(t * 0.4 + p.phase) * 0.12
        p.y += p.driftY * dt
        if (p.y < -p.size * 4 || p.x < -p.size * 4 || p.x > width + p.size * 4) {
          particles[i] = spawn(false)
          continue
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t * p.flicker + p.phase)
        ctx.globalAlpha = p.alpha * twinkle
        const d = p.size * 4
        ctx.drawImage(sprites[p.tint] as HTMLCanvasElement, p.x - d / 2, p.y - d / 2, d, d)
      }
      ctx.globalAlpha = 1
    }

    const start = () => {
      if (raf || !onScreen || document.hidden) return
      last = 0
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    resizeObserver?.observe(canvas.parentElement ?? canvas)
    resize()

    const intersection =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            onScreen = !!entry?.isIntersecting
            if (onScreen) start()
            else stop()
          })
    intersection?.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      resizeObserver?.disconnect()
      intersection?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, reducedMotion])

  if (reducedMotion) return null
  return <canvas ref={canvasRef} className={['particle-field', className].filter(Boolean).join(' ')} aria-hidden="true" />
}
