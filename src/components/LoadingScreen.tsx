import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let current = 0
    intervalRef.current = setInterval(() => {
      // Variable speed for realism
      const increment = Math.random() * 3 + 0.5
      current = Math.min(100, current + increment)
      setProgress(Math.floor(current))

      if (current >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setTimeout(() => {
          setVisible(false)
          setTimeout(onComplete, 800)
        }, 600)
      }
    }, 40)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'Orbitron, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* Scanline overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,212,0.015) 2px, rgba(0,245,212,0.015) 4px)',
            pointerEvents: 'none',
          }} />

          {/* Moving scanline */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'rgba(0,245,212,0.3)',
            animation: 'scanline 3s linear infinite',
            pointerEvents: 'none',
          }} />

          {/* Sub text */}
          <div style={{
            color: '#00F5D4',
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            marginBottom: '3rem',
            opacity: 0.7,
            fontFamily: 'Space Mono, monospace',
          }}>
            INITIALIZING STAR SYSTEM... MYSTIC OASIS
          </div>

          {/* Percentage counter */}
          <div
            className="flicker"
            style={{
              color: '#C8E6FF',
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(200,230,255,0.5), 0 0 80px rgba(0,245,212,0.2)',
            }}
          >
            {String(progress).padStart(3, '0')}
            <span style={{ fontSize: '0.4em', color: '#00F5D4' }}>%</span>
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '2.5rem',
            width: 'clamp(280px, 50vw, 600px)',
            position: 'relative',
          }}>
            {/* Bar track */}
            <div style={{
              height: '3px',
              background: 'rgba(0,245,212,0.15)',
              borderRadius: '2px',
              border: '1px solid rgba(0,245,212,0.2)',
              overflow: 'hidden',
            }}>
              {/* Fill */}
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00F5D4, #C8E6FF)',
                boxShadow: '0 0 10px #00F5D4, 0 0 20px rgba(0,245,212,0.5)',
                transition: 'width 0.1s ease',
                borderRadius: '2px',
              }} />
            </div>

            {/* Tick marks */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              opacity: 0.3,
            }}>
              {[0, 25, 50, 75, 100].map(v => (
                <span key={v} style={{
                  color: '#00F5D4',
                  fontSize: '0.5rem',
                  fontFamily: 'Space Mono, monospace',
                  letterSpacing: '0.1em',
                }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom status */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(0,245,212,0.4)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            fontFamily: 'Space Mono, monospace',
          }}>
            {progress < 30 ? 'MAPPING GRAVITATIONAL FIELDS...' :
             progress < 60 ? 'CALIBRATING STELLAR BODIES...' :
             progress < 85 ? 'SYNCHRONIZING ORBITAL MECHANICS...' :
             'ESTABLISHING QUANTUM LINK...'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
