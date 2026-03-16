import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CreatorStarProps {
  position: THREE.Vector3
  onClick?: () => void
}

// Shaders are module-level constants (never change), so useMemo deps can stay empty
const coronaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const coronaFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    float inner = 0.3;
    float outer = 0.5;
    float alpha = 1.0 - smoothstep(inner, outer, d);
    alpha *= 0.4 + 0.1 * sin(time * 2.0 + d * 20.0);
    vec3 col = mix(vec3(1.0, 0.9, 0.3), vec3(1.0, 0.4, 0.0), d * 2.0);
    gl_FragColor = vec4(col, alpha * (1.0 - d * 1.8));
  }
`

export function CreatorStar({ position, onClick }: CreatorStarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)

  const coronaMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: coronaVertexShader,
    fragmentShader: coronaFragmentShader,
    uniforms: { time: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    coronaMat.uniforms.time.value = t

    if (meshRef.current) {
      meshRef.current.position.copy(position)
      // Gentle pulse
      const scale = 1 + Math.sin(t * 1.5) * 0.04
      meshRef.current.scale.setScalar(scale)
    }
    if (coronaRef.current) {
      coronaRef.current.position.copy(position)
      coronaRef.current.rotation.z = t * 0.2
    }

  })

  return (
    <group>
      {/* Core star */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#FFB347"
          emissive="#FF8800"
          emissiveIntensity={3}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Corona glow */}
      <mesh ref={coronaRef} material={coronaMat}>
        <planeGeometry args={[3.5, 3.5]} />
      </mesh>

      {/* Point light */}
      <pointLight
        position={position}
        color="#FFB347"
        intensity={80}
        distance={30}
        decay={2}
      />

    </group>
  )
}
