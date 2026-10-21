import { useId, useMemo } from 'react'

interface ForestSilhouetteProps {
  /** Same seed → same skyline, so renders are stable. */
  seed: number
  /** Number of trees across the width. */
  trees: number
  /** Tallest tree as a fraction of the viewBox height (0–1). */
  maxHeight: number
  fill: string
  className?: string
}

/** Small deterministic PRNG so the skyline is identical on every render and SSR-safe. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const WIDTH = 1600
const HEIGHT = 300

/** Layered conifer treeline drawn as a single path. Purely decorative. */
export function ForestSilhouette({ seed, trees, maxHeight, fill, className }: ForestSilhouetteProps) {
  const gradientId = useId()
  const path = useMemo(() => {
    const rand = mulberry32(seed)
    const base = HEIGHT
    const step = WIDTH / trees
    const f = (n: number) => n.toFixed(1)
    let d = `M-10 ${base} L-10 ${base - 24}`
    for (let i = 0; i < trees; i++) {
      const cx = i * step + step / 2 + (rand() - 0.5) * step * 0.7
      const h = HEIGHT * maxHeight * (0.4 + rand() * 0.6)
      const w = step * (0.75 + rand() * 0.8)
      const tiers = 4 + Math.floor(rand() * 3)
      const top = base - h
      const tierH = h / tiers
      // Ascend the left edge, tier by tier (widest tier at the bottom).
      const left: string[] = []
      const right: string[] = []
      for (let t = tiers - 1; t >= 0; t--) {
        const half = (w / 2) * ((t + 1) / tiers)
        const yBottom = top + tierH * (t + 1) - (t === tiers - 1 ? 0 : tierH * 0.12)
        const yTop = top + tierH * t
        left.push(`L${f(cx - half)} ${f(yBottom)} L${f(cx - half * 0.42)} ${f(yTop + tierH * 0.15)}`)
        right.unshift(`L${f(cx + half * 0.42)} ${f(yTop + tierH * 0.15)} L${f(cx + half)} ${f(yBottom)}`)
      }
      d += ` L${f(cx - w / 2)} ${base - 24} ${left.join(' ')} L${f(cx)} ${f(top)} ${right.join(' ')} L${f(cx + w / 2)} ${base - 24}`
    }
    return `${d} L${WIDTH + 10} ${base - 24} L${WIDTH + 10} ${base} Z`
  }, [seed, trees, maxHeight])

  return (
    <svg className={className} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fill} stopOpacity="0.92" />
          <stop offset="1" stopColor={fill} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${gradientId})`} />
    </svg>
  )
}
