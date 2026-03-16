import { motion, AnimatePresence } from 'framer-motion'

export type SectionKey = 'About Me' | 'Experience' | 'Projects' | 'Blog' | 'Information' | null

const SECTION_CONTENT: Record<NonNullable<SectionKey>, { title: string; subtitle: string; body: string[]; accent: string }> = {
  'About Me': {
    title: 'ABOUT ME',
    subtitle: 'Pilot / Creator / Explorer',
    accent: '#00F5D4',
    body: [
      'I am a full-stack developer and creative technologist navigating the chaotic gravitational fields of modern software.',
      'My craft spans interactive 3D experiences, scalable systems architecture, and generative art — pushing the boundaries between code and cosmos.',
      'Currently orbiting in the Mystic Oasis star system, seeking new worlds to explore and build.',
    ],
  },
  'Experience': {
    title: 'EXPERIENCE',
    subtitle: 'Mission Log',
    accent: '#FFB347',
    body: [
      '2023 — Present: Senior Engineer @ Nebula Systems — Architected real-time 3D visualization platforms serving 500k users.',
      '2021 — 2023: Lead Developer @ Quantum Labs — Built distributed microservices handling 10M+ daily transactions.',
      '2019 — 2021: Full-Stack Engineer @ Starfield Co. — Developed React + Three.js interactive data dashboards.',
      '2017 — 2019: Junior Developer @ Orbit Studios — Shipped mobile-first web applications for 50+ clients.',
    ],
  },
  'Projects': {
    title: 'PROJECTS',
    subtitle: 'Active Deployments',
    accent: '#C8E6FF',
    body: [
      'GRAVITON ENGINE — Real-time N-body physics simulator with WebGL rendering. 50k GitHub stars.',
      'NEBULA UI — Open-source React component library with space-themed design system. 120+ contributors.',
      'QUANTUM CANVAS — Procedural generative art platform using WASM + WebGPU. Featured on Awwwards.',
      'DARKFIELD ANALYTICS — Real-time anomaly detection dashboard. Processing 1M+ events per second.',
    ],
  },
  'Blog': {
    title: 'BLOG',
    subtitle: 'Transmissions from the Void',
    accent: '#8B0000',
    body: [
      'The Mathematics of Chaos: How 3-Body Systems Inspired My Approach to Software Architecture',
      'WebGPU is Here: Rendering 10 Million Particles at 60fps in the Browser',
      'Designing for the Dark: Color Theory in Space-Themed Interfaces',
      'From Newton to GSAP: Physics-Based Animations That Feel Real',
    ],
  },
  'Information': {
    title: 'INFORMATION',
    subtitle: 'Transmission Protocols',
    accent: '#00F5D4',
    body: [
      'LOCATION: Remote / Earth, Sol System',
      'CONTACT: contact@mysticoasis.dev',
      'GITHUB: github.com/mysticoasis',
      'RESPONSE TIME: 24-48 orbital cycles',
      'AVAILABILITY: Open to new missions Q1 2026',
    ],
  },
}

interface ContentPanelProps {
  section: SectionKey
  onClose: () => void
}

export function ContentPanel({ section, onClose }: ContentPanelProps) {
  const content = section ? SECTION_CONTENT[section] : null

  return (
    <AnimatePresence>
      {section && content && (
        <motion.div
          key={section}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          style={{
            position: 'fixed',
            top: '4rem',
            right: 'calc(clamp(60px, 8vw, 100px) + 1rem)',
            bottom: '4rem',
            width: 'clamp(280px, 35vw, 480px)',
            background: 'rgba(2, 4, 8, 0.85)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${content.accent}33`,
            borderRadius: '4px',
            zIndex: 300,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Glass sheen */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />

          {/* Top accent bar */}
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${content.accent}, transparent)`,
            boxShadow: `0 0 10px ${content.accent}`,
          }} />

          {/* Header */}
          <div style={{
            padding: '1.5rem 1.5rem 1rem',
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <h2 style={{
                  color: content.accent,
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.3em',
                  fontWeight: 700,
                  marginBottom: '0.3rem',
                }}>
                  {content.title}
                </h2>
                <p style={{
                  color: 'rgba(200,230,255,0.5)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                }}>
                  {content.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  color: 'rgba(200,230,255,0.6)',
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = content.accent
                  e.currentTarget.style.color = content.accent
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(200,230,255,0.6)'
                }}
              >
                [CLOSE]
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            scrollbarWidth: 'none',
          }}>
            {content.body.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                style={{
                  color: 'rgba(200,230,255,0.85)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.7rem',
                  lineHeight: 1.9,
                  marginBottom: '1rem',
                  paddingLeft: '1rem',
                  borderLeft: `2px solid ${content.accent}44`,
                }}
              >
                {line}
              </motion.div>
            ))}
          </div>

          {/* Bottom scan line */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${content.accent}44, transparent)`,
          }} />
          <div style={{
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: content.accent,
              boxShadow: `0 0 6px ${content.accent}`,
            }} className="led-green" />
            <span style={{
              color: `${content.accent}88`,
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.2em',
            }}>
              TRANSMISSION ACTIVE
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
