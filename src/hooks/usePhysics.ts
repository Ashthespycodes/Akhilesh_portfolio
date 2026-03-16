import { useRef } from 'react'
import * as THREE from 'three'

export interface Body {
  mass: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  acc: THREE.Vector3
}

export interface PhysicsState {
  bodies: Body[]
  trails: THREE.Vector3[][]
}

const G = 0.00667  // scaled gravitational constant
const TRAIL_LENGTH = 300
const DT = 0.016   // timestep

function createBodies(): Body[] {
  const bodies: Body[] = [
    // Creator Star — amber, heavy
    // Velocities calibrated for ~9-unit binary separation (circular orbit needs v≈0.92)
    {
      mass: 3200,
      pos: new THREE.Vector3(-4.2, 0.6, 0.2),
      vel: new THREE.Vector3(0.02, 0.92, 0.02),
      acc: new THREE.Vector3(),
    },
    // Destroyer Star — crimson, medium-heavy
    {
      mass: 2400,
      pos: new THREE.Vector3(5.8, -0.4, -0.3),
      vel: new THREE.Vector3(-0.02, -1.22, -0.02),
      acc: new THREE.Vector3(),
    },
    // Home Planet — blue-green, heavier to avoid ejection
    {
      mass: 900,
      pos: new THREE.Vector3(0.5, 3.6, -1.0),
      vel: new THREE.Vector3(-0.50, -0.18, 0.08),
      acc: new THREE.Vector3(),
    },
  ]

  // Zero the centre-of-mass velocity so the system stays centred from frame 1
  const totalMass = bodies.reduce((s, b) => s + b.mass, 0)
  const comVel = new THREE.Vector3()
  for (const b of bodies) comVel.addScaledVector(b.vel, b.mass / totalMass)
  for (const b of bodies) b.vel.sub(comVel)

  // Also centre the initial positions
  const comPos = new THREE.Vector3()
  for (const b of bodies) comPos.addScaledVector(b.pos, b.mass / totalMass)
  for (const b of bodies) b.pos.sub(comPos)

  return bodies
}

export function usePhysics() {
  const stateRef = useRef<PhysicsState>({
    bodies: createBodies(),
    trails: [[], [], []],
  })

  function step() {
    const { bodies, trails } = stateRef.current

    // Reset accelerations
    for (const b of bodies) b.acc.set(0, 0, 0)

    // Compute pairwise gravitational forces
    const tmp = new THREE.Vector3()
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bi = bodies[i]
        const bj = bodies[j]
        tmp.subVectors(bj.pos, bi.pos)
        const distSq = Math.max(tmp.lengthSq(), 0.5) // softening
        const dist = Math.sqrt(distSq)
        const force = G * bi.mass * bj.mass / distSq
        tmp.normalize().multiplyScalar(force)
        bi.acc.addScaledVector(tmp, 1 / bi.mass)
        bj.acc.addScaledVector(tmp, -1 / bj.mass)
      }
    }

    // Integrate — Euler
    for (const b of bodies) {
      b.vel.addScaledVector(b.acc, DT)
      b.pos.addScaledVector(b.vel, DT)
    }

    // Soft leash: keep HomePlanet (index 2) within MAX_DIST of origin
    const MAX_DIST = 7.0
    const planet = bodies[2]
    const dist = planet.pos.length()
    if (dist > MAX_DIST) {
      const pullStrength = 0.6 * ((dist - MAX_DIST) / dist)
      planet.acc.addScaledVector(planet.pos, -pullStrength / DT)
      planet.vel.addScaledVector(planet.pos, -pullStrength / dist)
    }

    // Re-centre: subtract the centre-of-mass position AND velocity every frame
    // so numerical drift can never accumulate and the system stays at the origin.
    const totalMass = bodies.reduce((s, b) => s + b.mass, 0)
    const com    = new THREE.Vector3()
    const comVel = new THREE.Vector3()
    for (const b of bodies) {
      com.addScaledVector(b.pos, b.mass / totalMass)
      comVel.addScaledVector(b.vel, b.mass / totalMass)
    }
    for (const b of bodies) {
      b.pos.sub(com)
      b.vel.sub(comVel)
    }

    // Update trails
    for (let i = 0; i < bodies.length; i++) {
      trails[i].push(bodies[i].pos.clone())
      if (trails[i].length > TRAIL_LENGTH) trails[i].shift()
    }
  }

  function getReadout() {
    const { bodies } = stateRef.current
    const v0 = bodies[0].vel.length()
    const v1 = bodies[1].vel.length()
    const v2 = bodies[2].vel.length()
    const d01 = bodies[0].pos.distanceTo(bodies[1].pos)
    const d02 = bodies[0].pos.distanceTo(bodies[2].pos)
    const d12 = bodies[1].pos.distanceTo(bodies[2].pos)
    return { v0, v1, v2, d01, d02, d12 }
  }

  return { stateRef, step, getReadout }
}
