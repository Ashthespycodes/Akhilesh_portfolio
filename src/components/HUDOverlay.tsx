import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useIsMobile } from '../hooks/useIsMobile'

const NAV_ITEMS = ['About Me', 'Experience', 'Projects', 'Blog', 'Information']

const TYPEWRITER_LINES = [
  'Star System: Mystic Oasis',
  'Inspiration: The 3 Body Problem',
  'It is mathematically impossible to derive the orbital path of 3 Celestial bodies in revolution with each other',
]

interface HUDOverlayProps {
  onNavClick: (item: string) => void
  activeNav: string | null
}

// Hide text once the user has scrolled this far (about-me starts entering viewport)
const HIDE_SCROLL_THRESHOLD = typeof window !== 'undefined' ? window.innerHeight * 1.2 : 900

function TypewriterDisplay() {
  const [lines, setLines] = useState<string[]>([''])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const wasHiddenRef = useRef(false)

  // Show/hide based on scroll and restart typewriter when returning to hero
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY
          if (scrolled > HIDE_SCROLL_THRESHOLD) {
            if (!wasHiddenRef.current) {
              wasHiddenRef.current = true
              setVisible(false)
            }
          } else {
            if (wasHiddenRef.current) {
              wasHiddenRef.current = false
              // Reset typewriter so it replays from the start
              setLines([''])
              setLineIndex(0)
              setCharIndex(0)
              setVisible(true)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!visible) return
    const target = TYPEWRITER_LINES[lineIndex]

    if (charIndex < target.length) {
      const t = setTimeout(() => setCharIndex(c => c + 1), 50 + Math.random() * 30)
      return () => clearTimeout(t)
    }

    if (charIndex === target.length) {
      if (lines.length < TYPEWRITER_LINES.length) {
        const t = setTimeout(() => {
          setLines(prev => [...prev, ''])
          setLineIndex(i => i + 1)
          setCharIndex(0)
        }, 800)
        return () => clearTimeout(t)
      }
      // All lines done — stop, no loop
    }
  }, [charIndex, lineIndex, lines, visible])

  useEffect(() => {
    setLines(prev => {
      const copy = [...prev]
      copy[lineIndex] = TYPEWRITER_LINES[lineIndex]?.slice(0, charIndex) ?? ''
      return copy
    })
  }, [charIndex, lineIndex])

  const isMobile = useIsMobile()
  if (isMobile) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '1.5rem',
      zIndex: 200,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          lineHeight: 1.8,
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(0,255,65,0.5)', marginRight: '0.5em' }}>{'>'}</span>
          {line}
          {i === lines.length - 1 && (
            <span className="cursor-blink" style={{
              display: 'inline-block',
              width: '0.5em',
              height: '0.8em',
              background: '#00ff41',
              marginLeft: '2px',
              verticalAlign: 'middle',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function HeroName() {
  const [visible, setVisible] = useState(false)
  const wasHiddenRef = useRef(false)

  useEffect(() => {
    const fadeIn = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(fadeIn)
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY
          if (scrolled > HIDE_SCROLL_THRESHOLD) {
            if (!wasHiddenRef.current) { wasHiddenRef.current = true; setVisible(false) }
          } else {
            if (wasHiddenRef.current) { wasHiddenRef.current = false; setVisible(true) }
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isMobile = useIsMobile()

  return (
    <div style={{
      position: 'fixed',
      left: isMobile ? '50%' : '2.5rem',
      top: isMobile ? '50%' : '50%',
      transform: isMobile ? 'translate(-50%, -50%)' : 'translateY(-50%)',
      zIndex: 200,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.8s ease',
      textAlign: isMobile ? 'center' : 'left',
    }}>
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: isMobile ? '0.6rem' : 'clamp(0.45rem, 0.8vw, 0.6rem)',
        letterSpacing: '0.4em',
        color: '#00F5D4',
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      }}>
        Portfolio
      </p>
      <h1 style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: isMobile ? '2.2rem' : 'clamp(1.4rem, 3vw, 2.6rem)',
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        margin: 0,
      }}>
        <span style={{ display: 'block' }}>AKHILESH</span>
        <span style={{ display: 'block' }}>BHUTE</span>
      </h1>
      <div style={{ width: '2rem', height: '2px', background: '#00F5D4', margin: isMobile ? '0.8rem auto' : '0.8rem 0' }} />
      <p style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: isMobile ? '0.55rem' : 'clamp(0.4rem, 0.7vw, 0.55rem)',
        letterSpacing: '0.25em',
        color: 'rgba(200,230,255,0.6)',
        textTransform: 'uppercase',
      }}>
        CS · AI
      </p>
    </div>
  )
}

function ScrollHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fadeIn = setTimeout(() => setVisible(true), 600)
    let ticking = false
    const onScroll = () => { 
      if (!ticking && window.scrollY > 80) {
        window.requestAnimationFrame(() => {
          setVisible(false)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(fadeIn); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2.5rem',
      zIndex: 200,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.8s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <span style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 'clamp(0.4rem, 0.65vw, 0.52rem)',
        letterSpacing: '0.35em',
        color: 'rgba(200,230,255,0.55)',
        textTransform: 'uppercase',
      }}>
        Scroll Down
      </span>
      <div style={{
        width: '1px',
        height: '2.5rem',
        background: 'linear-gradient(to bottom, rgba(0,245,212,0.6), rgba(0,245,212,0))',
        animation: 'scrollPulse 1.6s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  )
}

export function HUDOverlay({ onNavClick, activeNav }: HUDOverlayProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const [pillVisible, setPillVisible] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (navRef.current) {
      const items = navRef.current.querySelectorAll('.nav-item')
      gsap.fromTo(items,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
      )
    }
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPillVisible(window.scrollY > HIDE_SCROLL_THRESHOLD)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top Navigation */}
      <div
        ref={navRef}
        style={{
          position: 'fixed',
          top: '0.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '0.5rem' : 'clamp(1.5rem, 4vw, 4rem)',
          zIndex: 200,
          pointerEvents: 'auto',
          borderRadius: '100px',
          padding: isMobile ? '0.4rem 1rem' : '0.6rem 2.5rem',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {/* Pill background — fades in once hero is scrolled past */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 20, 50, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 245, 212, 0.12)',
          borderRadius: '100px',
          opacity: pillVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }} />
        {NAV_ITEMS.map(item => (
          <button
            key={item}
            className="nav-item cursor-target"
            onClick={() => onNavClick(item)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: activeNav === item ? '#00F5D4' : 'rgba(200,230,255,0.85)',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: isMobile ? '0.5rem' : 'clamp(0.55rem, 1.1vw, 0.75rem)',
              letterSpacing: isMobile ? '0.1em' : '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '0.5rem 0',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { color: '#00F5D4', duration: 0.2 })
            }}
            onMouseLeave={e => {
              if (activeNav !== item) {
                gsap.to(e.currentTarget, { color: 'rgba(200,230,255,0.85)', duration: 0.2 })
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Hero name — left side */}
      <HeroName />

      {/* Scroll hint — bottom right */}
      <ScrollHint />

      {/* Typewriter */}
      <TypewriterDisplay />
    </>
  )
}
