'use client'

import { motion } from 'framer-motion'
import { Upload, BrainCircuit, BadgeCheck, ChevronRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Upload Your Bill',
    description: 'Simply upload any medical bill, EOB, or healthcare invoice. Our system accepts PDFs, images, and scanned documents.',
    icon: Upload,
    color: '#2563EB',
  },
  {
    number: '02',
    title: 'AI Analyzes Billing Codes',
    description: 'Our 3-stage pipeline processes your bill: Claude extracts data, BioBERT validates codes, and MedGemma reviews clinically.',
    icon: BrainCircuit,
    color: '#059669',
  },
  {
    number: '03',
    title: 'Receive Savings Insights',
    description: 'Get a detailed breakdown of errors found, potential savings, and actionable recommendations to reduce your costs.',
    icon: BadgeCheck,
    color: '#7C3AED',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            Three Steps to Clarity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Our AI pipeline combines multiple models to deliver the most accurate billing analysis
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="glass rounded-2xl p-8 h-full card-hover">
                  {/* Step Number */}
                  <div 
                    className="text-6xl font-bold mb-6 opacity-30"
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  
                  {/* Connector Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Pipeline Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 glass rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Stage 1: Claude</h4>
              <p className="text-gray-400 text-sm">Document extraction & understanding</p>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Stage 2: BioBERT</h4>
              <p className="text-gray-400 text-sm">Medical entity & code validation</p>
            </div>
            <div>
              <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Stage 3: MedGemma</h4>
              <p className="text-gray-400 text-sm">Clinical reasoning & validation</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
