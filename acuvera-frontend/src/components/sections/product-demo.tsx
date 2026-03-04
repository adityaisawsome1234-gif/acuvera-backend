'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentTransform } from '@/components/3d/document-transform'
import { Upload, Brain, Search, CheckCircle, DollarSign, FileText, AlertTriangle } from 'lucide-react'

const demoSteps = [
  {
    id: 1,
    title: 'Upload',
    icon: Upload,
    description: 'Upload any medical bill, EOB, or invoice',
    status: 'Upload your medical bill',
  },
  {
    id: 2,
    title: 'AI Analysis',
    icon: Brain,
    description: 'Claude extracts all billing data and codes',
    status: 'Processing with Claude...',
  },
  {
    id: 3,
    title: 'Code Validation',
    icon: Search,
    description: 'BioBERT validates CPT/ICD codes with PyCTAKES',
    status: 'Validating codes...',
  },
  {
    id: 4,
    title: 'Clinical Review',
    icon: CheckCircle,
    description: 'MedGemma provides final clinical validation',
    status: 'Clinical review complete',
  },
]

const mockErrors = [
  { code: '99213', description: 'Office visit Level 3', issue: 'Upcoded from 99212', savings: 45 },
  { code: '36415', description: 'Venipuncture', issue: 'Duplicate charge', savings: 25 },
  { code: '80053', description: 'CMP Blood Test', issue: 'Not ordered by physician', savings: 120 },
]

export function ProductDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const startDemo = () => {
    setIsAnalyzing(true)
    setShowResults(false)
    
    let step = 1
    const interval = setInterval(() => {
      step++
      if (step <= 4) {
        setCurrentStep(step)
      } else {
        clearInterval(interval)
        setIsAnalyzing(false)
        setShowResults(true)
      }
    }, 1500)
  }

  return (
    <section id="demo" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            Interactive Demo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            See Acuvera in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Watch how our 3-stage AI pipeline analyzes medical bills and detects hidden errors
          </motion.p>
        </div>

        {/* Demo Container */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <DocumentTransform />
          </motion.div>

          {/* Right: Interactive Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Progress Steps */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-primary/10 border border-primary/30' : 
                      isCompleted ? 'bg-surface/50' : 'bg-surface/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' :
                      isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-surface-light text-gray-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </motion.div>
                )
              })}
            </div>

            {/* Action Button */}
            <button
              onClick={startDemo}
              disabled={isAnalyzing}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : showResults ? 'Run Again' : 'Start Demo'}
            </button>

            {/* Results Panel */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      Errors Detected
                    </h4>
                    <span className="text-green-400 font-bold">$190 saved</span>
                  </div>
                  
                  <div className="space-y-3">
                    {mockErrors.map((error, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-surface-light last:border-0">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-white text-sm font-medium">{error.code}</p>
                            <p className="text-gray-500 text-xs">{error.issue}</p>
                          </div>
                        </div>
                        <span className="text-green-400 text-sm font-medium">-${error.savings}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 pt-2 text-primary">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-bold">Total Savings: $190</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
