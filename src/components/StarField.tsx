import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function StarField() {
  const COUNT = 2000
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const alphas = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      sizes[i] = Math.random() * 2.5 + 0.5
      alphas[i] = Math.random() * 0.7 + 0.3
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
    return g
  }, [])

  const matRef = useRef<THREE.ShaderMaterial>(null)

  const vertexShader = `
    attribute float size;
    attribute float alpha;
    varying float vAlpha;
    void main() {
      vAlpha = alpha;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }
  `
  const fragmentShader = `
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float alpha = (1.0 - d * 2.0) * vAlpha;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
