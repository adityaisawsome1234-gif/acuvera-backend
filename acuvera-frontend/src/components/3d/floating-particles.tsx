'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const mesh = useRef<THREE.Points>(null)
  
  const count = 200
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      // Blue-ish colors
      colors[i * 3] = 0.2 + Math.random() * 0.3
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.4
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    }
    
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function DataNodes() {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const nodes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.cos((i / 8) * Math.PI * 2) * 3,
        Math.sin((i / 8) * Math.PI * 2) * 0.5,
        Math.sin((i / 8) * Math.PI * 2) * 3,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.1,
    }))
  }, [])

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.scale, 16, 16]} />
          <meshBasicMaterial color="#2563EB" transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Connection lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={new Float32Array(nodes.flatMap(n => n.position))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2563EB" transparent opacity={0.3} />
      </line>
    </group>
  )
}

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <DataNodes />
      </Canvas>
    </div>
  )
}
