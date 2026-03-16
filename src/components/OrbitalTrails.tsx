import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PhysicsState } from '../hooks/usePhysics'

const TRAIL_COLORS = [
  new THREE.Color('#FFB347'),  // creator star — amber
  new THREE.Color('#ff4422'),  // destroyer star — red-orange
  new THREE.Color('#00F5D4'),  // home planet — teal
]

interface TrailMeshProps {
  bodyIndex: number
  stateRef: React.MutableRefObject<PhysicsState>
}

function TrailMesh({ bodyIndex, stateRef }: TrailMeshProps) {
  // Use primitive refs to avoid JSX line type conflicts (line primitive manages its own geometry)

  const TRAIL_LENGTH = 300

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(TRAIL_LENGTH * 3)
    const colors = new Float32Array(TRAIL_LENGTH * 3)
    return { positions, colors }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  const mat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  }), [])

  // Build the Three.js Line object directly
  const linePrimitive = useMemo(() => {
    const l = new THREE.Line(geo, mat)
    return l
  }, [geo, mat])

  useFrame(() => {
    const trail = stateRef.current.trails[bodyIndex]
    if (!trail || trail.length < 2) return

    const col = TRAIL_COLORS[bodyIndex]
    const len = Math.min(trail.length, TRAIL_LENGTH)

    for (let i = 0; i < len; i++) {
      const pt = trail[i]
      positions[i * 3 + 0] = pt.x
      positions[i * 3 + 1] = pt.y
      positions[i * 3 + 2] = pt.z

      // fade from transparent (old) to opaque (new)
      const alpha = i / len
      colors[i * 3 + 0] = col.r * alpha
      colors[i * 3 + 1] = col.g * alpha
      colors[i * 3 + 2] = col.b * alpha
    }

    // Zero out unused trail positions
    for (let i = len; i < TRAIL_LENGTH; i++) {
      positions[i * 3] = positions[(len - 1) * 3]
      positions[i * 3 + 1] = positions[(len - 1) * 3 + 1]
      positions[i * 3 + 2] = positions[(len - 1) * 3 + 2]
    }

    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
    geo.setDrawRange(0, len)
  })

  return <primitive object={linePrimitive} />
}

interface OrbitalTrailsProps {
  stateRef: React.MutableRefObject<PhysicsState>
}

export function OrbitalTrails({ stateRef }: OrbitalTrailsProps) {
  return (
    <>
      <TrailMesh bodyIndex={0} stateRef={stateRef} />
      <TrailMesh bodyIndex={1} stateRef={stateRef} />
      <TrailMesh bodyIndex={2} stateRef={stateRef} />
    </>
  )
}
