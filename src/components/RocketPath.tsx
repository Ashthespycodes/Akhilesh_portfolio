import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

const DURATION = 22
const TRAIL = 7

export default function RocketPath() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const rocketRef   = useRef<SVGGElement>(null)
  const flame1Ref   = useRef<SVGPolygonElement>(null)
  const flame2Ref   = useRef<SVGPolygonElement>(null)
  const trailRefs   = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const rocket    = rocketRef.current
    const svg       = svgRef.current
    if (!container || !rocket || !svg) return

    const W = container.offsetWidth
    const H = container.offsetHeight

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)

    // ── path generation ──────────────────────────────────────────────
    const pad   = 50           // keep rocket inside by this many px
    const topY  = pad * 1.5
    const botY  = H - pad * 1.5
    const leftX = pad * 1.5
    const rightX = W - pad * 1.5
    const tAmp  = Math.min(H * 0.065, 55)   // top/bottom wave amplitude
    const sAmp  = Math.min(W * 0.025, 36)   // side wave amplitude
    const tWaves = 6
    const sWaves = 4
    const tW = (rightX - leftX) / tWaves
    const sH = (botY - topY)   / sWaves

    // Start in the middle of the top edge going RIGHT so the loop direction
    // is consistent on repeat (same tangent at start == end)
    const startX = leftX + tW * Math.floor(tWaves / 2)

    let d = `M ${startX},${topY}`

    // top: startX → rightX (remaining half)
    const topRemainder = tWaves - Math.floor(tWaves / 2)
    for (let i = 0; i < topRemainder; i++) {
      const x0  = startX + i * tW
      const x3  = x0 + tW
      const dir = (Math.floor(tWaves / 2) + i) % 2 === 0 ? -1 : 1
      d += ` C ${x0 + tW * 0.33},${topY + dir * tAmp} ${x0 + tW * 0.67},${topY + dir * tAmp} ${x3},${topY}`
    }

    // right side: topY → botY
    for (let i = 0; i < sWaves; i++) {
      const y0  = topY + i * sH
      const y3  = y0 + sH
      const dir = i % 2 === 0 ? 1 : -1
      d += ` C ${rightX + dir * sAmp},${y0 + sH * 0.33} ${rightX + dir * sAmp},${y0 + sH * 0.67} ${rightX},${y3}`
    }

    // bottom: rightX → leftX
    for (let i = 0; i < tWaves; i++) {
      const x0  = rightX - i * tW
      const x3  = x0 - tW
      const dir = i % 2 === 0 ? 1 : -1
      d += ` C ${x0 - tW * 0.33},${botY + dir * tAmp} ${x0 - tW * 0.67},${botY + dir * tAmp} ${x3},${botY}`
    }

    // left side: botY → topY
    for (let i = 0; i < sWaves; i++) {
      const y0  = botY - i * sH
      const y3  = y0 - sH
      const dir = i % 2 === 0 ? -1 : 1
      d += ` C ${leftX + dir * sAmp},${y0 - sH * 0.33} ${leftX + dir * sAmp},${y0 - sH * 0.67} ${leftX},${y3}`
    }

    // top: leftX → startX (first half, back to origin)
    const topFirst = Math.floor(tWaves / 2)
    for (let i = 0; i < topFirst; i++) {
      const x0  = leftX + i * tW
      const x3  = x0 + tW
      const dir = i % 2 === 0 ? -1 : 1
      d += ` C ${x0 + tW * 0.33},${topY + dir * tAmp} ${x0 + tW * 0.67},${topY + dir * tAmp} ${x3},${topY}`
    }

    d += ' Z'

    const pathEl = document.getElementById('rocket-track')
    pathEl?.setAttribute('d', d)

    // ── rocket motion ─────────────────────────────────────────────────
    const rocketTween = gsap.to(rocket, {
      duration: DURATION,
      repeat: -1,
      ease: 'none',
      motionPath: {
        path: '#rocket-track',
        align: '#rocket-track',
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
    })

    // ── trail dots ────────────────────────────────────────────────────
    const trailTweens: gsap.core.Tween[] = []
    for (let i = 0; i < TRAIL; i++) {
      const dot = trailRefs.current[i]
      if (!dot) continue
      const tw = gsap.to(dot, {
        duration: DURATION,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: '#rocket-track',
          align: '#rocket-track',
          alignOrigin: [0.5, 0.5],
        },
      })
      // offset each dot behind the rocket
      tw.time(DURATION - (i + 1) * DURATION * 0.013)
      trailTweens.push(tw)
    }

    // ── booster flame pulse ───────────────────────────────────────────
    const flameTween = gsap.timeline({ repeat: -1 })
    flameTween
      .to([flame1Ref.current, flame2Ref.current], {
        scaleX: 1.35, scaleY: 0.75, opacity: 0.6,
        duration: 0.1, ease: 'power1.inOut',
        transformOrigin: 'right center',
      })
      .to([flame1Ref.current, flame2Ref.current], {
        scaleX: 0.85, scaleY: 1.25, opacity: 1,
        duration: 0.1, ease: 'power1.inOut',
        transformOrigin: 'right center',
      })

    return () => {
      rocketTween.kill()
      trailTweens.forEach(t => t.kill())
      flameTween.kill()
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <svg ref={svgRef} width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id="trail-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="flame-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* invisible guide path */}
        <path id="rocket-track" d="" fill="none" stroke="none" />

        {/* trail dots — rendered before rocket so rocket draws on top */}
        {Array.from({ length: TRAIL }).map((_, i) => (
          <circle
            key={i}
            ref={el => { trailRefs.current[i] = el }}
            r={Math.max(1, 3.5 - i * 0.4)}
            fill="#93c5fd"
            opacity={Math.max(0.05, 0.55 - i * 0.08)}
            filter="url(#trail-glow)"
          />
        ))}

        {/* rocket group — autoRotate turns this via GSAP */}
        <g ref={rocketRef}>
          {/* booster flames (rendered behind body) */}
          <polygon
            ref={flame1Ref}
            points="-18,0 -30,-7 -34,0 -30,7"
            fill="#f97316"
            filter="url(#flame-glow)"
          />
          <polygon
            ref={flame2Ref}
            points="-18,0 -25,-3.5 -28,0 -25,3.5"
            fill="#fde68a"
            filter="url(#flame-glow)"
          />

          {/* main fuselage */}
          <polygon points="24,0 10,-5 -16,-4 -19,0 -16,4 10,5" fill="#9ca3af" />
          {/* nose */}
          <polygon points="24,-1 30,0 24,1" fill="#e5e7eb" />
          {/* cockpit glass */}
          <ellipse cx="11" cy="-1" rx="5" ry="2.5" fill="#6b7280" />
          <ellipse cx="11" cy="-1" rx="3"  ry="1.5" fill="#1f2937" />
          {/* cockpit highlight */}
          <ellipse cx="12" cy="-2" rx="1.2" ry="0.8" fill="#93c5fd" opacity="0.5" />
          {/* top wing */}
          <polygon points="-1,-5 -14,-23 -7,-5" fill="#6b7280" />
          <polygon points="-1,-5 -14,-23 -12,-20" fill="#4b5563" />
          {/* bottom wing */}
          <polygon points="-1,5 -14,23 -7,5" fill="#6b7280" />
          <polygon points="-1,5 -14,23 -12,20" fill="#4b5563" />
          {/* engine block */}
          <rect x="-20" y="-3.5" width="5" height="7" rx="1.5" fill="#374151" />
          {/* engine inner glow */}
          <ellipse cx="-20" cy="0" rx="2" ry="2" fill="#60a5fa" opacity="0.6" />
        </g>
      </svg>
    </div>
  )
}
