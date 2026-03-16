import { useRef, useEffect, MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { OrbitalTrails } from './OrbitalTrails'
import { CreatorStar } from './CreatorStar'
import { DestroyerStar } from './DestroyerStar'
import { HomePlanet } from './HomePlanet'
import { usePhysics } from '../hooks/usePhysics'

// --- Scroll animation config ---
// heroProgress 0→1 drives two sequential phases:
//   Phase 1  (0.00 → 0.40)  camera zooms out: Z 14 → 30
//   Phase 2  (0.40 → 1.00)  planets scatter off-screen
//     Yellow exits right, Red exits left, Teal lingers left (delayed start)

const ZOOM_END   = 0.40   // hero progress at which zoom finishes
const SCATTER_START = 0.40
const TEAL_DELAY = 0.20   // teal scatter starts this many progress-units later

// Exit directions (applied at full scatter)
const DIR_YELLOW = new THREE.Vector3( 22,  2,  0)   // hard right
const DIR_RED    = new THREE.Vector3(-22,  3,  0)   // hard left
const DIR_TEAL   = new THREE.Vector3(-15,  5,  0)   // left, slower/later

/** remap a value from [inMin,inMax] → [0,1], clamped */
function remap01(v: number, inMin: number, inMax: number) {
  return Math.min(1, Math.max(0, (v - inMin) / (inMax - inMin)))
}

/** smooth-step ease */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

interface PhysicsSceneProps {
  selectedBody: number | null
  onBodyClick: (index: number) => void
  heroProgressRef: MutableRefObject<number>
}

function PhysicsScene({ selectedBody, onBodyClick, heroProgressRef }: PhysicsSceneProps) {
  const { stateRef, step } = usePhysics()
  const { camera } = useThree()
  const mousePosRef = useRef({ x: 0, y: 0 })
  const targetCamRef = useRef(new THREE.Vector3(0, 0, 14))

  const renderPos = useRef([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mousePosRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mousePosRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // No wheel handler — page scroll owns the wheel event now

  useEffect(() => {
    if (selectedBody !== null) {
      const body = stateRef.current.bodies[selectedBody]
      targetCamRef.current.set(body.pos.x * 0.5, body.pos.y * 0.5, 8)
    } else {
      targetCamRef.current.set(0, 0, 14)
    }
  }, [selectedBody, stateRef])

  useFrame(() => {
    step()

    const hp = heroProgressRef.current
    const bodies = stateRef.current.bodies

    // ── Phase 1: zoom out ─────────────────────────────────────────
    const zoomP = smoothstep(remap01(hp, 0, ZOOM_END))
    const baseZ = 14 + zoomP * 16          // 14 → 30

    // ── Phase 2: scatter ──────────────────────────────────────────
    const scatterRange = 1 - SCATTER_START

    const yellowP = smoothstep(remap01(hp, SCATTER_START, 1.0))
    const redP    = smoothstep(remap01(hp, SCATTER_START, 1.0))
    const tealP   = smoothstep(remap01(hp, SCATTER_START + TEAL_DELAY, 1.0))

    renderPos.current[0].copy(bodies[0].pos).addScaledVector(DIR_YELLOW, yellowP)
    renderPos.current[1].copy(bodies[1].pos).addScaledVector(DIR_RED,    redP)
    renderPos.current[2].copy(bodies[2].pos).addScaledVector(DIR_TEAL,   tealP)

    // ── Camera ────────────────────────────────────────────────────
    // Only apply mouse parallax when we haven't scrolled far (feels odd when
    // planets are mid-scatter)
    const parallaxStrength = Math.max(0, 1 - hp * 2)
    const mouse = mousePosRef.current
    const target = targetCamRef.current
    target.z = baseZ   // keep target Z driven by scroll

    camera.position.x += (target.x + mouse.x * 0.8 * parallaxStrength - camera.position.x) * 0.04
    camera.position.y += (target.y + mouse.y * 0.5 * parallaxStrength - camera.position.y) * 0.04
    camera.position.z += (target.z - camera.position.z) * 0.05
    camera.lookAt(camera.position.x * 0.1, camera.position.y * 0.1, 0)

    // suppress unused warning
    void scatterRange
  })

  return (
    <>
      <ambientLight intensity={0.04} color="#112244" />
      <OrbitalTrails stateRef={stateRef} />
      <CreatorStar  position={renderPos.current[0]} onClick={() => onBodyClick(0)} />
      <DestroyerStar position={renderPos.current[1]} onClick={() => onBodyClick(1)} />
      <HomePlanet   position={renderPos.current[2]} onClick={() => onBodyClick(2)} />
      <EffectComposer>
        <Bloom intensity={1.8} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Vignette offset={0.3} darkness={0.9} />
      </EffectComposer>
    </>
  )
}

interface SpaceSceneProps {
  selectedBody: number | null
  onBodyClick: (index: number) => void
  heroProgressRef: MutableRefObject<number>
}

export function SpaceScene({ selectedBody, onBodyClick, heroProgressRef }: SpaceSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 60, near: 0.1, far: 1000 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <PhysicsScene
        selectedBody={selectedBody}
        onBodyClick={onBodyClick}
        heroProgressRef={heroProgressRef}
      />
    </Canvas>
  )
}
