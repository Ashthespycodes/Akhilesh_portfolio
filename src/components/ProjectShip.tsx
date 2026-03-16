import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/* ─── project data ─── */
const PROJECTS = [
  {
    title: 'GRAVITON ENGINE',
    sub: 'Real-time N-body Physics Simulator',
    desc: 'WebGL-powered gravitational simulation rendering 50k+ particles at 60fps. Custom Euler integration with adaptive time-stepping.',
    tech: ['Three.js', 'WebGL', 'TypeScript', 'WASM'],
    color: '#00F5D4',
  },
  {
    title: 'NEBULA UI',
    sub: 'Space-Themed Component Library',
    desc: 'Open-source React component library with 120+ contributors. Dark-first design system with procedural backgrounds.',
    tech: ['React', 'TypeScript', 'Storybook', 'CSS'],
    color: '#86E1F4',
  },
  {
    title: 'QUANTUM CANVAS',
    sub: 'Procedural Generative Art Platform',
    desc: 'Browser-based generative art using WebGPU compute shaders and WASM. Featured on Awwwards.',
    tech: ['WebGPU', 'WASM', 'Rust', 'React'],
    color: '#C4B5FD',
  },
  {
    title: 'DARKFIELD ANALYTICS',
    sub: 'Real-time Anomaly Detection',
    desc: 'Dashboard processing 1M+ events/sec with streaming anomaly detection. Live visualization of data pipelines.',
    tech: ['Python', 'Kafka', 'React', 'D3.js'],
    color: '#f97316',
  },
]

/* ─── helper: metallic material ─── */
function HullMaterial({ color = '#1a1d23', emissive = '#000000', emissiveIntensity = 0 }: { color?: string; emissive?: string; emissiveIntensity?: number }) {
  return <meshStandardMaterial color={color} metalness={0.35} roughness={0.55} emissive={emissive || color} emissiveIntensity={emissiveIntensity || 0.12} />
}

/* ─── engine glow ─── */
function EngineGlow({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const s = scale * (0.9 + Math.sin(clock.elapsedTime * 4) * 0.1)
    ref.current.scale.set(s, s, s)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={3} transparent opacity={0.8} />
    </mesh>
  )
}



/* ─── interior skeleton (always centered, revealed when hull opens) ─── */
function Interior() {
  return (
    <group>
      {/* frame ribs */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <boxGeometry args={[2.2, 0.04, 0.06]} />
          <HullMaterial color="#556070" emissive="#00F5D4" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* spine */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.04, 4.4]} />
        <HullMaterial color="#556070" emissive="#00F5D4" emissiveIntensity={0.4} />
      </mesh>
      {/* reactor core */}
      <mesh position={[0, 0, 1.2]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={2} transparent opacity={0.6} wireframe />
      </mesh>
      {/* power conduits */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 3.0, 6]} />
          <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.6} transparent opacity={0.3} />
        </mesh>
      ))}
      {/* main engines */}
      <mesh position={[0, 0, 2.3]}>
        <cylinderGeometry args={[0.35, 0.45, 0.9, 16]} />
        <HullMaterial color="#4a5565" emissive="#00F5D4" emissiveIntensity={0.3} />
      </mesh>
      <EngineGlow position={[0, 0, 2.78]} scale={1.4} />
    </group>
  )
}

/* ─── nose / bow (stays centered) ─── */
function Nose() {
  return (
    <group>
      {/* main nose cone */}
      <mesh position={[0, 0, -2.9]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 1.2, 6]} />
        <HullMaterial color="#586070" />
      </mesh>
      {/* nose plate */}
      <mesh position={[0, 0, -2.2]}>
        <boxGeometry args={[1.2, 0.35, 0.5]} />
        <HullMaterial color="#505868" />
      </mesh>
      {/* forward sensor array */}
      <mesh position={[0, 0.22, -2.6]}>
        <boxGeometry args={[0.3, 0.06, 0.3]} />
        <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ─── holographic project screen (Html overlay) ─── */
function ProjectScreen({ project, onNext, onPrev, index, total, visible }: {
  project: typeof PROJECTS[0]
  onNext: () => void
  onPrev: () => void
  index: number
  total: number
  visible: boolean
}) {
  return (
    <Html
      center
      position={[0, 0, -0.5]}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div style={{
        width: '380px',
        background: 'rgba(5,8,15,0.92)',
        border: `1px solid ${project.color}44`,
        borderRadius: '16px',
        padding: '2rem 2.2rem',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 40px ${project.color}22, inset 0 0 30px rgba(0,0,0,0.4)`,
        userSelect: 'none' as const,
      }}>
        {/* project counter */}
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: project.color, textTransform: 'uppercase' as const, marginBottom: '0.5rem' }}>
          PROJECT {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>

        {/* title */}
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: '0 0 0.3rem', letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>

        {/* subtitle */}
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: project.color, margin: '0 0 1rem' }}>
          {project.sub}
        </p>

        {/* description */}
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.82rem', lineHeight: 1.7, color: '#aaa', margin: '0 0 1.2rem' }}>
          {project.desc}
        </p>

        {/* tech stack */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '1.4rem' }}>
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              color: project.color,
              border: `1px solid ${project.color}44`,
              borderRadius: '4px',
              padding: '0.3rem 0.6rem',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onPrev}
            className="cursor-target"
            style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em',
              color: index === 0 ? '#333' : '#fff', background: 'transparent',
              border: `1px solid ${index === 0 ? '#222' : '#444'}`,
              borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'none',
            }}
            disabled={index === 0}
          >
            ← PREV
          </button>
          <button
            onClick={onNext}
            className="cursor-target"
            style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em',
              color: index === total - 1 ? '#333' : '#020408',
              background: index === total - 1 ? 'transparent' : project.color,
              border: `1px solid ${index === total - 1 ? '#222' : project.color}`,
              borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'none',
            }}
            disabled={index === total - 1}
          >
            NEXT →
          </button>
        </div>
      </div>
    </Html>
  )
}

/* ─── main ship scene (inside R3F Canvas) ─── */
function ShipScene({ progressRef }: { progressRef: React.RefObject<number> }) {
  const shipRef = useRef<THREE.Group>(null)
  const topRef = useRef<THREE.Group>(null)
  const botRef = useRef<THREE.Group>(null)
  const leftRef = useRef<THREE.Group>(null)
  const rightRef = useRef<THREE.Group>(null)

  const [projectIdx, setProjectIdx] = useState(0)
  const [screenVisible, setScreenVisible] = useState(false)
  const prevVisible = useRef(false)

  useFrame(() => {
    const p = progressRef.current ?? 0

    const ship = shipRef.current
    if (ship) {
      // fly in from above: starts fully off-screen, settles to y=0 by p=0.3
      const entryT = Math.min(1, p / 0.3)
      const entryEased = entryT * entryT * (3 - 2 * entryT)
      ship.position.y = 8 * (1 - entryEased)

      ship.rotation.x = -0.35 + p * 0.15
      ship.rotation.y = Math.PI + Math.sin(Date.now() * 0.0003) * 0.08
    }

    const openStart = 0.2
    const openEnd = 0.5
    const closeStart = 0.75
    const closeEnd = 1.0

    let openAmount = 0
    if (p < openStart) {
      openAmount = 0
    } else if (p < openEnd) {
      openAmount = (p - openStart) / (openEnd - openStart)
    } else if (p < closeStart) {
      openAmount = 1
    } else if (p < closeEnd) {
      openAmount = 1 - (p - closeStart) / (closeEnd - closeStart)
    } else {
      openAmount = 0
    }

    const eased = openAmount * openAmount * (3 - 2 * openAmount)
    const spread = eased * 1.8

    if (topRef.current) topRef.current.position.y = spread
    if (botRef.current) botRef.current.position.y = -spread
    if (leftRef.current) leftRef.current.position.x = -spread * 0.8
    if (rightRef.current) rightRef.current.position.x = spread * 0.8

    const nowVisible = eased > 0.7
    if (nowVisible !== prevVisible.current) {
      prevVisible.current = nowVisible
      setScreenVisible(nowVisible)
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, -3]} intensity={2.5} color="#c8d8ee" />
      <directionalLight position={[-4, -3, 5]} intensity={1.2} color="#00F5D4" />
      <directionalLight position={[0, -5, -3]} intensity={0.8} color="#6688aa" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#00F5D4" distance={10} />
      <pointLight position={[0, 2, -2]} intensity={1.0} color="#aabbcc" distance={12} />

      <group ref={shipRef} rotation={[-0.35, Math.PI, 0]} scale={1.15}>
        {/* ── TOP HULL ── */}
        <group ref={topRef}>
          <mesh position={[0, 0.45, 0]}><boxGeometry args={[2.6, 0.18, 5.2]} /><HullMaterial color="#5a6070" /></mesh>
          <mesh position={[0, 0.6, -0.4]}><boxGeometry args={[1.8, 0.12, 3.6]} /><HullMaterial color="#6a7080" /></mesh>
          <mesh position={[0, 0.78, -1.6]}><boxGeometry args={[1.0, 0.28, 1.0]} /><HullMaterial color="#485060" emissive="#00F5D4" emissiveIntensity={0.3} /></mesh>
          <mesh position={[0, 0.8, -2.12]}><boxGeometry args={[0.7, 0.12, 0.06]} /><meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={1.5} transparent opacity={0.6} /></mesh>
          <mesh position={[-0.7, 0.65, 0.8]}><cylinderGeometry args={[0.08, 0.12, 0.3, 8]} /><HullMaterial color="#7a8090" /></mesh>
          <mesh position={[0.7, 0.65, 0.8]}><cylinderGeometry args={[0.08, 0.12, 0.3, 8]} /><HullMaterial color="#7a8090" /></mesh>
          <mesh position={[0, 1.0, -1.6]}><cylinderGeometry args={[0.015, 0.015, 0.5, 6]} /><HullMaterial color="#8890a0" emissive="#00F5D4" emissiveIntensity={0.8} /></mesh>
        </group>

        {/* ── BOTTOM HULL ── */}
        <group ref={botRef}>
          <mesh position={[0, -0.45, 0]}><boxGeometry args={[2.6, 0.18, 5.2]} /><HullMaterial color="#505868" /></mesh>
          <mesh position={[0, -0.6, 0.2]}><boxGeometry args={[2.0, 0.12, 4.0]} /><HullMaterial color="#5e6575" /></mesh>
          {[-0.8, 0, 0.8].map((x, i) => (
            <mesh key={i} position={[x, -0.72, 1.0]}><boxGeometry args={[0.1, 0.12, 0.3]} /><HullMaterial color="#6a6a72" /></mesh>
          ))}
          <mesh position={[0, -0.55, -1.5]}><boxGeometry args={[1.4, 0.06, 1.2]} /><HullMaterial color="#606878" /></mesh>
          <mesh position={[-0.6, -0.65, -0.3]}><cylinderGeometry args={[0.1, 0.06, 0.2, 8]} /><HullMaterial color="#7a8090" /></mesh>
          <mesh position={[0.6, -0.65, -0.3]}><cylinderGeometry args={[0.1, 0.06, 0.2, 8]} /><HullMaterial color="#7a8090" /></mesh>
        </group>

        {/* ── LEFT WING ── */}
        <group ref={leftRef}>
          <mesh position={[-2.2, 0, 0.3]}><boxGeometry args={[1.8, 0.14, 3.5]} /><HullMaterial color="#4e5565" /></mesh>
          <mesh position={[-3.2, 0, -0.8]}><boxGeometry args={[0.3, 0.1, 1.8]} /><HullMaterial color="#586070" /></mesh>
          <mesh position={[-2.4, 0, 2.0]}><cylinderGeometry args={[0.22, 0.28, 0.8, 12]} /><HullMaterial color="#454d5d" /></mesh>
          <EngineGlow position={[-2.4, 0, 2.42]} scale={0.8} />
          <mesh position={[-1.8, 0.08, 0]}><boxGeometry args={[0.04, 0.02, 2.8]} /><meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.8} transparent opacity={0.4} /></mesh>
        </group>

        {/* ── RIGHT WING ── */}
        <group ref={rightRef}>
          <mesh position={[2.2, 0, 0.3]}><boxGeometry args={[1.8, 0.14, 3.5]} /><HullMaterial color="#4e5565" /></mesh>
          <mesh position={[3.2, 0, -0.8]}><boxGeometry args={[0.3, 0.1, 1.8]} /><HullMaterial color="#586070" /></mesh>
          <mesh position={[2.4, 0, 2.0]}><cylinderGeometry args={[0.22, 0.28, 0.8, 12]} /><HullMaterial color="#454d5d" /></mesh>
          <EngineGlow position={[2.4, 0, 2.42]} scale={0.8} />
          <mesh position={[1.8, 0.08, 0]}><boxGeometry args={[0.04, 0.02, 2.8]} /><meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.8} transparent opacity={0.4} /></mesh>
        </group>

        {/* ── INTERIOR ── */}
        <Interior />
        <Nose />

        {/* project hologram screen */}
        <ProjectScreen
          project={PROJECTS[projectIdx]}
          onNext={() => setProjectIdx(i => Math.min(i + 1, PROJECTS.length - 1))}
          onPrev={() => setProjectIdx(i => Math.max(i - 1, 0))}
          index={projectIdx}
          total={PROJECTS.length}
          visible={screenVisible}
        />
      </group>
    </>
  )
}

/* ─── exported wrapper component ─── */
export default function ProjectShip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const scrollY = window.scrollY
      const elTop = el.offsetTop
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable > 0) {
        progressRef.current = Math.min(1, Math.max(0, (scrollY - elTop) / scrollable))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        height: '300vh',
        position: 'relative',
        background: '#020408',
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
      }}>
        {/* heading overlay */}
        <div style={{
          position: 'absolute',
          top: '3rem',
          left: '8vw',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
            letterSpacing: '0.35em',
            color: '#00F5D4',
            textTransform: 'uppercase' as const,
            marginBottom: '0.6rem',
          }}>
            Active Deployments
          </p>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            PROJECTS
          </h2>
        </div>

        <Canvas
          frameloop="always"
          camera={{ position: [0, -0.6, 7], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => { gl.setClearColor('#020408') }}
        >
          <ShipScene progressRef={progressRef} />
        </Canvas>
      </div>
    </div>
  )
}
