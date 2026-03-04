'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Server, Cpu, Network, Database, ChevronRight, CheckCircle } from 'lucide-react'

const engineComponents = [
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    role: 'Document Understanding',
    description: 'Extracts all billing data, codes, and clinical information from medical documents with advanced vision capabilities.',
    icon: Server,
    color: '#2563EB',
    stats: [
      { label: 'Accuracy', value: '99.2%' },
      { label: 'Processing', value: '<2s' },
    ],
  },
  {
    id: 'biobert',
    name: 'BioBERT + PyCTAKES',
    role: 'Medical Code Validation',
    description: 'Validates CPT/ICD codes against official medical databases. Detects upcoding, unbundling, and invalid combinations.',
    icon: Cpu,
    color: '#059669',
    stats: [
      { label: 'Codes Validated', value: '100K+' },
      { label: 'Rules Engine', value: '500+' },
    ],
  },
  {
    id: 'medgemma',
    name: 'MedGemma',
    role: 'Clinical Validation',
    description: 'Provides final clinical reasoning validation via Google Vertex AI. Ensures medical accuracy of all findings.',
    icon: Network,
    color: '#7C3AED',
    stats: [
      { label: 'Clinical Accuracy', value: '97.8%' },
      { label: 'Parameters', value: '27B' },
    ],
  },
]

const consensusFeatures = [
  'Cross-model validation',
  'Confidence scoring',
  'Uncertainty flagging',
  'Human review triggers',
]

export function AIEngine() {
  const [activeComponent, setActiveComponent] = useState('claude')

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            AI Technology
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            The Acuvera AI Engine
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-3xl mx-auto"
          >
            A multi-model ensemble pipeline combining the world's most advanced AI systems for medical billing analysis
          </motion.p>
        </div>

        {/* Pipeline Visualization */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {engineComponents.map((component, index) => {
            const Icon = component.icon
            const isActive = activeComponent === component.id
            
            return (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setActiveComponent(component.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                  isActive 
                    ? 'bg-surface border-2' 
                    : 'bg-surface/50 border border-transparent hover:border-surface-light'
                }`}
                style={{ borderColor: isActive ? component.color : undefined }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${component.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: component.color }} />
                  </div>
                  <div className="flex items-center gap-1">
                    {index < engineComponents.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{component.name}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: component.color }}>
                  {component.role}
                </p>
                <p className="text-gray-400 text-sm mb-4">{component.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-light">
                  {component.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Consensus Engine */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-white">Consensus Engine</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Our proprietary consensus algorithm merges outputs from all three AI models, 
                weighting each by confidence scores and cross-validating findings for maximum accuracy.
              </p>
              <div className="space-y-3">
                {consensusFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Data Flow Visualization */}
            <div className="relative h-64 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Hub */}
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse">
                  <span className="text-primary font-bold text-sm">Consensus</span>
                </div>
              </div>
              
              {/* Orbiting Nodes */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 rounded-xl glass flex items-center justify-center"
                  animate={{
                    x: Math.cos((i / 3) * Math.PI * 2 + Date.now() / 1000) * 100,
                    y: Math.sin((i / 3) * Math.PI * 2 + Date.now() / 1000) * 80,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -32,
                    marginTop: -32,
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: [engineComponents[0].color, engineComponents[1].color, engineComponents[2].color][i]
                    }} 
                  />
                </motion.div>
              ))}
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
