'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileCheck, Server, Fingerprint } from 'lucide-react'

const trustCards = [
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Fully compliant with HIPAA regulations. All data handling meets strict healthcare privacy standards.',
    color: '#2563EB',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption for data at rest and in transit. Your medical data is protected at every layer.',
    color: '#059669',
  },
  {
    icon: Eye,
    title: 'AI Transparency',
    description: 'Clear explanations for every AI decision. See exactly why errors were flagged and how confidence scores were calculated.',
    color: '#7C3AED',
  },
  {
    icon: FileCheck,
    title: 'Audit Trails',
    description: 'Complete audit logs for all analyses. Track every change, review, and decision with timestamped records.',
    color: '#EA580C',
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'SOC 2 Type II certified data centers. Multi-region redundancy and 99.99% uptime guarantee.',
    color: '#0891B2',
  },
  {
    icon: Fingerprint,
    title: 'Access Controls',
    description: 'Role-based access with MFA. Granular permissions ensure only authorized personnel access sensitive data.',
    color: '#DC2626',
  },
]

export function Trust() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            Security & Trust
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            Enterprise-Grade Security
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Your medical data deserves the highest level of protection
          </motion.p>
        </div>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="glass rounded-2xl p-6 h-full border border-transparent hover:border-surface-light transition-all duration-300">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: card.color }} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Certifications Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 glass rounded-2xl p-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['HIPAA', 'SOC 2 Type II', 'GDPR', 'ISO 27001'].map((cert) => (
              <div key={cert} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white font-semibold">{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
