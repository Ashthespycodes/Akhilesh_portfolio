import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SpaceScene } from './components/SpaceScene'
import { LoadingScreen } from './components/LoadingScreen'
import { HUDOverlay } from './components/HUDOverlay'
import TargetCursor from './components/TargetCursor'
import Particles from './components/Particles'
import ScrollSections from './components/ScrollSections'

gsap.registerPlugin(ScrollTrigger)

const NAV_TO_ID: Record<string, string> = {
  'About Me':    'about-me',
  'Experience':  'experience',
  'Projects':    'projects',
  'Blog':        'blog',
  'Information': 'information',
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [selectedBody, setSelectedBody] = useState<number | null>(null)
  const [activeNav, setActiveNav] = useState<string | null>(null)

  // Single 0→1 value that drives both zoom and scatter inside SpaceScene
  const heroProgressRef = useRef(0)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return

    const heroSpacer = document.getElementById('hero-spacer')
    if (!heroSpacer) return

    const trigger = ScrollTrigger.create({
      trigger: heroSpacer,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: ({ progress }) => {
        heroProgressRef.current = progress
      },
    })

    return () => trigger.kill()
  }, [loaded])

  const handleBodyClick = useCallback((index: number) => {
    setSelectedBody(prev => prev === index ? null : index)
  }, [])

  const handleNavClick = useCallback((item: string) => {
    const id = NAV_TO_ID[item]
    const el = id ? document.getElementById(id) : null
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setActiveNav(item)
  }, [])

  const handleSectionChange = useCallback((nav: string | null) => {
    setActiveNav(nav)
  }, [])

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" />

      {/* Fixed background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#020408' }}>
        <Particles
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleColors={['#ffffff', '#f5f5f5', '#eeeeee']}
          alphaParticles={false}
          particleBaseSize={100}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
        />
      </div>

      {/* 3D scene — transparent canvas */}
      <SpaceScene
        selectedBody={selectedBody}
        onBodyClick={handleBodyClick}
        heroProgressRef={heroProgressRef}
      />

      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {loaded && (
        <>
          <HUDOverlay onNavClick={handleNavClick} activeNav={activeNav} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div id="hero-spacer" style={{ height: '250vh' }} />

            <ScrollSections onSectionChange={handleSectionChange} />
          </div>
        </>
      )}
    </>
  )
}
