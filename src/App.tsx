import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SpaceScene } from './components/SpaceScene'
import { LoadingScreen } from './components/LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

// Heavy components lazily loaded to reduce initial bundle size
const HUDOverlay = React.lazy(() => import('./components/HUDOverlay').then(m => ({ default: m.HUDOverlay })))
const ScrollSections = React.lazy(() => import('./components/ScrollSections'))
const Particles = React.lazy(() => import('./components/Particles'))

const NAV_TO_ID: Record<string, string> = {
  'About Me':    'about-me',
  'Experience':  'experience',
  'Projects':    'projects',
  'Blog':        'blog',
  'Information': 'information',
}

import TargetCursor from './components/TargetCursor'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [selectedBody, setSelectedBody] = useState<number | null>(null)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)
  const [scenePaused, setScenePaused] = useState(false)

  // Single 0→1 value that drives both zoom and scatter inside SpaceScene
  const heroProgressRef = useRef(0)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
    // Delay showing content to allow initial animations/setup to complete
    setTimeout(() => setShowContent(true), 100)

    // Aggressively pre-fetch lazy chunks in the background while user is reading the landing page
    if (typeof window !== 'undefined') {
      const prefetch = () => {
        setTimeout(() => {
          import('./components/ScrollSections').catch(() => {})
          import('./components/Particles').catch(() => {})
        }, 1500)
      }
      if ('requestIdleCallback' in window) {
        // @ts-ignore
        window.requestIdleCallback(prefetch, { timeout: 2000 })
      } else {
        prefetch()
      }
    }
  }, [])

  useEffect(() => {
    if (!loaded || !showContent) return

    const ctx = gsap.context(() => {
      // Hero section scroll progress for SpaceScene
      ScrollTrigger.create({
        trigger: '#hero-spacer',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: ({ progress }) => {
          heroProgressRef.current = progress
        },
      })
    })

    return () => ctx.revert()
  }, [loaded, showContent])

  // Pause the 3D render loop once user scrolls past the About Me section
  useEffect(() => {
    if (!loaded) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const aboutMe = document.getElementById('about-me')
        if (aboutMe) {
          const bottom = aboutMe.getBoundingClientRect().bottom
          setScenePaused(bottom < 0)
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  const handleBodyClick = useCallback((index: number) => {
    setSelectedBody(prev => prev === index ? null : index)
  }, [])

  const scrollToSection = useCallback((item: string) => {
    const id = NAV_TO_ID[item]
    const el = id ? document.getElementById(id) : null
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setActiveNav(item)
  }, [])

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" />

      {/* Fixed background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#020408' }}>
        <Suspense fallback={null}>
          <Particles
            particleCount={typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 200}
            particleSpread={10}
            speed={0.1}
            particleColors={['#ffffff', '#f5f5f5', '#eeeeee']}
            alphaParticles={false}
            particleBaseSize={100}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation={false}
          />
        </Suspense>
      </div>

      {/* 3D scene — transparent canvas */}
      <SpaceScene
        selectedBody={selectedBody}
        onBodyClick={handleBodyClick}
        heroProgressRef={heroProgressRef}
        paused={scenePaused}
      />

      {/* ─── OVERLAYS ─── */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {loaded && (
        <>
          <Suspense fallback={null}>
            <HUDOverlay onNavClick={scrollToSection} activeNav={activeNav} />
          </Suspense>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div id="hero-spacer" style={{ height: '250vh' }} />

            <Suspense fallback={null}>
              <ScrollSections onSectionChange={setActiveNav} />
            </Suspense>
          </div>
        </>
      )}
    </>
  )
}
