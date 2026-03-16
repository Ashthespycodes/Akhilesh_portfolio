import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const BELT_W = 210
const CX = BELT_W / 2   // 105
const AMP = 78

const PLANETS = [
  { color: '#60a5fa', dark: '#1e3a8a', size: 56, glow: 'rgba(96,165,250,0.65)' },
  { color: '#4ade80', dark: '#14532d', size: 46, glow: 'rgba(74,222,128,0.65)' },
  { color: '#f472b6', dark: '#831843', size: 38, glow: 'rgba(244,114,182,0.65)' },
]

// Asteroid shapes distributed along a full 0-1 fractional height
const ASTEROID_DEFS = Array.from({ length: 26 }, (_, i) => {
  const t = i / 25
  return {
    yFrac: t,
    x: CX + AMP * Math.sin(t * Math.PI * 3.4 + 0.5),
    w: 9 + (i % 7) * 5,
    hRatio: 0.3 + (i % 6) * 0.08,
    rot: i * 53,
    opacity: 0.38 + (i % 5) * 0.1,
  }
})

interface Props {
  sectionRef: React.RefObject<HTMLDivElement | null>
  cardRefs: React.RefObject<(HTMLDivElement | null)[]>
}

export default function AsteroidBelt({ sectionRef, cardRefs }: Props) {
  const stickyRef   = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)
  const asteroidRefs = useRef<(HTMLDivElement | null)[]>([])
  const planetRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const inner   = innerRef.current
    if (!section || !inner) return

    const place = () => {
      const sH = section.offsetHeight
      inner.style.height = sH + 'px'

      // Distribute asteroids over the section height
      ASTEROID_DEFS.forEach((def, i) => {
        const el = asteroidRefs.current[i]
        if (!el) return
        const h = def.w * def.hRatio
        el.style.top  = (def.yFrac * sH - h / 2) + 'px'
        el.style.left = (def.x - def.w / 2) + 'px'
      })

      // Pin planets to card vertical centers
      cardRefs.current.forEach((card, i) => {
        const planet = planetRefs.current[i]
        if (!card || !planet) return
        const pSize = PLANETS[i]?.size ?? 44
        planet.style.top = (card.offsetTop + card.offsetHeight / 2 - pSize / 2) + 'px'
      })
    }

    let st: ReturnType<typeof ScrollTrigger.create> | null = null

    const createST = () => {
      st?.kill()
      const maxY = section.offsetHeight - window.innerHeight
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(inner, { y: -self.progress * maxY })
        },
      })
    }

    // Run placement after layout settles (cards may shift height via GSAP)
    place()
    createST()
    const raf = requestAnimationFrame(() => {
      place()
      createST()
      ScrollTrigger.refresh()
    })

    const ro = new ResizeObserver(() => {
      place()
      createST()
    })
    ro.observe(section)

    const onResize = () => { place(); createST() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      st?.kill()
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [sectionRef, cardRefs])

  return (
    <div
      ref={stickyRef}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: BELT_W,
        overflow: 'hidden',
        pointerEvents: 'none',
        flexShrink: 0,
        alignSelf: 'flex-start',
        zIndex: 4,
      }}
    >
      {/* Faint belt axis line */}
      <div style={{
        position: 'absolute',
        left: CX,
        top: 0, bottom: 0,
        width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(251,146,60,0.08) 20%, rgba(251,146,60,0.08) 80%, transparent)',
      }} />

      <div ref={innerRef} style={{ position: 'absolute', top: 0, width: '100%' }}>

        {/* Asteroids */}
        {ASTEROID_DEFS.map((def, i) => (
          <div
            key={i}
            ref={el => { asteroidRefs.current[i] = el }}
            style={{
              position: 'absolute',
              width: def.w,
              height: def.w * def.hRatio,
              background: 'radial-gradient(ellipse at 38% 30%, #fb923c 0%, #c2410c 55%, #7c2d12 100%)',
              borderRadius: '42% 48% 38% 44%',
              transform: `rotate(${def.rot}deg)`,
              opacity: def.opacity,
              boxShadow: '0 0 4px rgba(251,146,60,0.2)',
            }}
          />
        ))}

        {/* Planets */}
        {PLANETS.map((p, i) => (
          <div key={i} ref={el => { planetRefs.current[i] = el }}
            style={{
              position: 'absolute',
              left: CX - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 32% 30%, ${p.color} 0%, ${p.dark} 80%)`,
              boxShadow: `0 0 20px ${p.glow}, 0 0 42px ${p.glow}55`,
              zIndex: 3,
            }}
          />
        ))}

      </div>
    </div>
  )
}
