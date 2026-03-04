'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Layers, 
  BarChart3,
  FileSearch,
  Lock
} from 'lucide-react'

const features = [
  {
    title: 'AI Billing Error Detection',
    description: 'Advanced machine learning models detect billing errors, coding issues, and compliance risks with 95%+ accuracy.',
    icon: Brain,
    color: '#2563EB',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    title: 'Real-time Code Validation',
    description: 'Instant CPT/ICD code validation using BioBERT and PyCTAKES. Catch errors before submission.',
    icon: ShieldCheck,
    color: '#059669',
    gradient: 'from-green-500/20 to-green-600/5',
  },
  {
    title: 'Denial Prevention',
    description: 'Predict and prevent claim denials before they happen. Save time and protect your revenue.',
    icon: AlertTriangle,
    color: '#DC2626',
    gradient: 'from-red-500/20 to-red-600/5',
  },
  {
    title: 'Human-in-the-Loop Review',
    description: 'Expert review workflow with Accept/Reject/Escalate controls. Perfect balance of AI speed and human judgment.',
    icon: Users,
    color: '#7C3AED',
    gradient: 'from-purple-500/20 to-purple-600/5',
  },
  {
    title: '3-Stage AI Pipeline',
    description: 'Claude + BioBERT + MedGemma ensemble for maximum accuracy. Multiple AI models cross-validate every finding.',
    icon: Layers,
    color: '#EA580C',
    gradient: 'from-orange-500/20 to-orange-600/5',
  },
  {
    title: 'Advanced Analytics',
    description: 'Comprehensive insights into billing patterns, error trends, and savings opportunities across your organization.',
    icon: BarChart3,
    color: '#0891B2',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
  {
    title: 'Smart Document Processing',
    description: 'Extract data from any format - PDFs, images, scans. OCR + AI vision handles it all.',
    icon: FileSearch,
    color: '#6366F1',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
  },
  {
    title: 'Enterprise Security',
    description: 'HIPAA-compliant infrastructure with end-to-end encryption. Your data never leaves secure environments.',
    icon: Lock,
    color: '#0EA5E9',
    gradient: 'from-sky-500/20 to-sky-600/5',
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Powerful AI-driven tools designed for healthcare providers
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative glass rounded-2xl p-6 h-full border border-transparent hover:border-surface-light transition-colors duration-300">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
