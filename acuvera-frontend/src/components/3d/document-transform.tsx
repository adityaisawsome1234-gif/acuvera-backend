'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function DocumentMesh({ stage }: { stage: number }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <group ref={meshRef}>
      {/* Medical Bill Document */}
      <Box args={[3, 4, 0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={stage >= 2 ? '#2563EB' : '#FFFFFF'} 
          transparent 
          opacity={0.9}
        />
      </Box>
      
      {/* Document Lines */}
      {stage === 1 && (
        <>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 1.5, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 1.2, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 0.9, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 0.6, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 0.3, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
          <Box args={[2.5, 0.05, 0.02]} position={[0, 0, 0.03]}>
            <meshBasicMaterial color="#94A3B8" />
          </Box>
        </>
      )}
      
      {/* AI Processing Nodes */}
      {stage >= 2 && (
        <>
          {[...Array(6)].map((_, i) => (
            <Sphere 
              key={i} 
              args={[0.08]} 
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 2,
                Math.sin((i / 6) * Math.PI * 2) * 1.5,
                0.5
              ]}
            >
              <meshBasicMaterial color="#4A90FF" />
            </Sphere>
          ))}
        </>
      )}
      
      {/* Error Highlights */}
      {stage >= 3 && (
        <>
          <Box args={[0.4, 0.15, 0.06]} position={[-0.8, 1.2, 0.04]}>
            <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
          </Box>
          <Box args={[0.4, 0.15, 0.06]} position={[0.5, 0.6, 0.04]}>
            <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
          </Box>
        </>
      )}
      
      {/* Savings Indicator */}
      {stage >= 4 && (
        <Sphere args={[0.3]} position={[1.5, 1.5, 0.3]}>
          <meshBasicMaterial color="#22C55E" transparent opacity={0.9} />
        </Sphere>
      )}
    </group>
  )
}

export function DocumentTransform() {
  const [stage, setStage] = useState(1)
  
  const stages = [
    { id: 1, label: 'Medical Bill', description: 'Upload your medical bill' },
    { id: 2, label: 'AI Analysis', description: 'Claude processes the document' },
    { id: 3, label: 'Error Detection', description: 'BioBERT validates codes' },
    { id: 4, label: 'Savings Found', description: 'MedGemma validates findings' },
  ]

  return (
    <div className="relative w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <DocumentMesh stage={stage} />
      </Canvas>
      
      {/* Stage Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4">
        {stages.map((s) => (
          <button
            key={s.id}
            onClick={() => setStage(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              stage === s.id 
                ? 'bg-primary text-white' 
                : 'bg-surface text-gray-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      
      {/* Stage Info */}
      <motion.div 
        key={stage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-0 right-0 text-center"
      >
        <p className="text-primary font-semibold">{stages[stage - 1].label}</p>
        <p className="text-gray-400 text-sm">{stages[stage - 1].description}</p>
      </motion.div>
    </div>
  )
}
