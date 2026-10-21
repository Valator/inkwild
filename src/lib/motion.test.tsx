import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { ParallaxLayer } from '../components/ParallaxLayer/ParallaxLayer'
import { ParticleField } from '../components/ParticleField/ParticleField'
import { Reveal } from '../components/Reveal/Reveal'
import { I18nextProvider } from 'react-i18next'
import { createI18n } from '../i18n'
import { setReducedMotion } from '../test/utils'
import { mediaState } from '../test/setup'

describe('reduced motion', () => {
  it('renders no particle canvas', () => {
    setReducedMotion(true)
    const { container } = render(<ParticleField />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('renders the particle canvas when motion is allowed', () => {
    setReducedMotion(false)
    const { container } = render(<ParticleField />)
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows reveal content immediately instead of animating it in', () => {
    setReducedMotion(true)
    const { getByText } = render(<Reveal>Hello</Reveal>)
    expect(getByText('Hello')).toHaveAttribute('data-revealed', 'true')
  })

  it('does not move parallax layers', async () => {
    setReducedMotion(true)
    const { container } = render(
      <div>
        <ParallaxLayer speed={0.1} />
      </div>,
    )
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect((container.querySelector('.parallax-layer') as HTMLElement).style.transform).toBe('')
  })

  it('moves parallax layers on desktop when motion is allowed, but not on phones', async () => {
    setReducedMotion(false)
    const desktop = render(
      <div>
        <ParallaxLayer speed={0.1} />
      </div>,
    )
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect((desktop.container.querySelector('.parallax-layer') as HTMLElement).style.transform).toContain('translate3d')
    desktop.unmount()

    mediaState.set('(min-width: 48rem)', false)
    const phone = render(
      <div>
        <ParallaxLayer speed={0.1} />
      </div>,
    )
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect((phone.container.querySelector('.parallax-layer') as HTMLElement).style.transform).toBe('')
  })

  it('removes parallax styling when a layer unmounts', async () => {
    setReducedMotion(false)
    const { container, unmount } = render(
      <div>
        <ParallaxLayer speed={0.1} />
      </div>,
    )
    const layer = container.querySelector('.parallax-layer') as HTMLElement
    unmount()
    expect(layer.style.transform).toBe('')
  })

  it('keeps the whole page free of canvases when reduced motion is requested', () => {
    setReducedMotion(true)
    const { container } = render(
      <I18nextProvider i18n={createI18n('en')}>
        <App />
      </I18nextProvider>,
    )
    expect(container.querySelectorAll('canvas')).toHaveLength(0)
    expect(container.querySelectorAll('[data-reveal]:not([data-revealed])')).toHaveLength(0)
  })
})
