'use client'

import { motion } from 'framer-motion'
import { Building2, Users, Stethoscope, FileBarChart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const useCases = [
  {
    icon: Building2,
    title: 'Clinics & Practices',
    description: 'Streamline billing workflows and catch costly errors before submission. Reduce denial rates and accelerate reimbursements.',
    benefits: ['40% reduction in claim denials', '60% faster bill processing', '$50K+ average annual savings'],
  },
  {
    icon: Users,
    title: 'Healthcare Groups',
    description: 'Scale AI-powered billing analysis across multiple locations. Standardize processes and gain organization-wide insights.',
    benefits: ['Multi-location dashboards', 'Consistent coding standards', 'Centralized compliance monitoring'],
  },
  {
    icon: Stethoscope,
    title: 'Billing Departments',
    description: 'Empower your team with AI assistance. Automate routine checks and focus on complex cases that need human expertise.',
    benefits: ['3x productivity increase', 'AI-assisted review workflow', 'Automated audit trails'],
  },
  {
    icon: FileBarChart,
    title: 'Revenue Cycle Management',
    description: 'Optimize your entire revenue cycle with predictive analytics. Identify patterns and prevent revenue leakage.',
    benefits: ['Revenue leakage detection', 'Predictive denial analytics', 'Automated root cause analysis'],
  },
]

export function Enterprise() {
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
            Enterprise Solutions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
          >
            Built for Healthcare Organizations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-3xl mx-auto"
          >
            Scalable AI solutions for organizations of any size
          </motion.p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-8 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{useCase.description}</p>
                
                <ul className="space-y-3">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our enterprise team will work with you to build a tailored AI solution 
            that fits your organization's unique requirements.
          </p>
          <Button size="lg" className="group">
            Schedule a Demo
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
