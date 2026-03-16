import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HomePlanetProps {
  position: THREE.Vector3
  onClick?: () => void
}

export function HomePlanet({ position, onClick }: HomePlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmoRef = useRef<THREE.Mesh>(null)

  const atmosphereVertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  const atmosphereFragmentShader = `
    uniform float time;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1)), 2.0);
      vec3 atmosphere = vec3(0.0, 0.96, 0.83) * intensity;
      float pulse = 0.8 + 0.2 * sin(time * 0.8);
      gl_FragColor = vec4(atmosphere * pulse, intensity * 0.6);
    }
  `

  const atmoMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: { time: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
  }), [])


  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    atmoMat.uniforms.time.value = t

    if (meshRef.current) {
      meshRef.current.position.copy(position)
      meshRef.current.rotation.y = t * 0.15  // slow self-rotation
    }
    if (atmoRef.current) {
      atmoRef.current.position.copy(position)
    }
  })

  return (
    <group>
      {/* Planet core */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00E5C8"
          emissive="#00F5D4"
          emissiveIntensity={1.2}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh ref={atmoRef} material={atmoMat}>
        <sphereGeometry args={[0.63, 32, 32]} />
      </mesh>
    </group>
  )
}
