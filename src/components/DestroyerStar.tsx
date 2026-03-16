import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DestroyerStarProps {
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

// Jagged unstable corona
const coronaFragmentShader = `
  uniform float time;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i+1.0), f*f*(3.0-2.0*f));
  }

  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    float angle = atan(c.y, c.x);

    // Jagged spikes
    float spikes = 0.0;
    for (float k = 1.0; k <= 5.0; k++) {
      spikes += noise(angle * k * 3.0 + time * (k * 0.7)) * (0.05 / k);
    }
    float rim = 0.28 + spikes;
    float alpha = smoothstep(rim + 0.12, rim - 0.02, d);
    alpha *= 0.5 + 0.2 * sin(time * 3.0 + d * 15.0);

    vec3 col = mix(vec3(0.9, 0.05, 0.05), vec3(0.4, 0.0, 0.0), d * 2.0);
    gl_FragColor = vec4(col, alpha * max(0.0, 1.0 - d * 2.2));
  }
`

export function DestroyerStar({ position, onClick }: DestroyerStarProps) {
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
      // Unstable pulsing
      const scale = 1 + Math.sin(t * 3.7) * 0.06 + Math.sin(t * 7.3) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
    if (coronaRef.current) {
      coronaRef.current.position.copy(position)
      coronaRef.current.rotation.z = t * -0.3
    }
  })

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#cc0000"
          emissiveIntensity={4}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Jagged corona */}
      <mesh ref={coronaRef} material={coronaMat}>
        <planeGeometry args={[3.0, 3.0]} />
      </mesh>

      {/* Dark red point light */}
      <pointLight
        position={position}
        color="#cc2200"
        intensity={50}
        distance={25}
        decay={2}
      />
    </group>
  )
}
