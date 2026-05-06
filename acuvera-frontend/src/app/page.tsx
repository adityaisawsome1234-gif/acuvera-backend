"use client"

import {
  Search,
  FileSearch,
  Shield,
  FileText,
  DollarSign,
  Upload,
  TrendingUp,
  Files,
  CheckCircle,
  AlertTriangle,
  Lock,
  Activity,
} from 'lucide-react'

import { WaitlistHero } from '@/components/ui/waitlist-hero'
import { SectionWithMockup } from '@/components/ui/section-with-mockup'
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid'
import {
  RadialOrbitalTimeline,
  type TimelineItem,
} from '@/components/ui/radial-orbital-timeline'
import { CinematicFooter } from '@/components/ui/motion-footer'

const features: BentoItem[] = [
  {
    title: 'Overcharge Detection',
    meta: 'AI-driven',
    description:
      'Surface charges that exceed Medicare benchmarks, payer contracts, and regional fair-price data.',
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    status: 'Live',
    tags: ['Pricing', 'Audit', 'AI'],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: 'Duplicate Billing',
    meta: '99.4% recall',
    description:
      'Catch repeat charges, unbundled services, and same-day double-bills the human eye misses.',
    icon: <Files className="w-4 h-4 text-emerald-400" />,
    status: 'Live',
    tags: ['Detection', 'Compliance'],
  },
  {
    title: 'Code Validation',
    meta: 'CPT · ICD-10',
    description:
      'Cross-reference every CPT and ICD-10 code against payer rules, NCCI edits, and clinical context.',
    icon: <CheckCircle className="w-4 h-4 text-cyan-400" />,
    status: 'Live',
    tags: ['Coding', 'NCCI'],
    colSpan: 2,
  },
  {
    title: 'Denial Risk',
    meta: 'predictive',
    description:
      'Flag claims likely to be denied before they ship, with the exact field that needs fixing.',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    status: 'Beta',
    tags: ['Claims', 'Revenue'],
  },
  {
    title: 'HIPAA-Ready',
    meta: 'SOC 2 in flight',
    description:
      'Patient data stays encrypted at rest and in transit. Zero training on your records.',
    icon: <Lock className="w-4 h-4 text-purple-400" />,
    status: 'Compliant',
    tags: ['Security', 'Privacy'],
  },
  {
    title: 'Real-time Audit',
    meta: '< 30s',
    description:
      'Drop a bill, get a full findings report in under thirty seconds. No batch jobs, no waiting.',
    icon: <Activity className="w-4 h-4 text-rose-400" />,
    status: 'Live',
    tags: ['Speed', 'Pipeline'],
    colSpan: 2,
  },
]

const workflow: TimelineItem[] = [
  {
    id: 1,
    title: 'Upload',
    date: 'Step 1',
    content:
      'Drop a PDF, image, or EOB. We accept any format hospital billing systems output.',
    category: 'Intake',
    icon: Upload,
    relatedIds: [2],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'Extract',
    date: 'Step 2',
    content:
      'Our OCR pipeline pulls every line item, CPT, ICD-10, modifier, and dollar amount into a structured ledger.',
    category: 'Parsing',
    icon: FileSearch,
    relatedIds: [1, 3],
    status: 'completed',
    energy: 90,
  },
  {
    id: 3,
    title: 'Validate',
    date: 'Step 3',
    content:
      'Codes are cross-checked against NCCI edits, payer rules, and the patient’s clinical context.',
    category: 'Validation',
    icon: Shield,
    relatedIds: [2, 4],
    status: 'completed',
    energy: 80,
  },
  {
    id: 4,
    title: 'Audit',
    date: 'Step 4',
    content:
      'Claude-powered AI surfaces overcharges, duplicates, denial risk, and missing discounts with confidence scores.',
    category: 'Detection',
    icon: Search,
    relatedIds: [3, 5],
    status: 'in-progress',
    energy: 65,
  },
  {
    id: 5,
    title: 'Report',
    date: 'Step 5',
    content:
      'Findings are ranked by severity and dollar impact, with citations to the exact line that triggered each flag.',
    category: 'Output',
    icon: FileText,
    relatedIds: [4, 6],
    status: 'pending',
    energy: 40,
  },
  {
    id: 6,
    title: 'Recover',
    date: 'Step 6',
    content:
      'Submit appeals, dispute charges, and recover funds — directly from the dashboard.',
    category: 'Recovery',
    icon: DollarSign,
    relatedIds: [5],
    status: 'pending',
    energy: 20,
  },
]

export default function Home() {
  return (
    <main className="relative bg-black">
      {/* 1. Hero / Waitlist */}
      <section id="waitlist">
        <WaitlistHero />
      </section>

      {/* 2. The problem framed: every line, every code, every dollar */}
      <SectionWithMockup
        title={
          <>
            Every line.
            <br />
            Every code.
            <br />
            Every dollar.
          </>
        }
        description={
          <>
            Acuvera reads through medical bills the way a billing expert would —
            but in seconds. Every CPT and ICD-10 code is cross-checked against
            payer rules. Every charge is benchmarked against Medicare and fair-price
            data. The errors humans miss, our AI catches.
          </>
        }
        primaryImageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
        secondaryImageSrc="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80"
      />

      {/* 3. Capability bento grid */}
      <section className="relative py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
          <h2 className="text-white text-3xl md:text-5xl font-semibold tracking-tight text-center">
            What Acuvera catches.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg text-center mt-4 max-w-2xl mx-auto">
            One pipeline, six layers of detection. Built for the billions of
            dollars in healthcare errors that go uncaught every year.
          </p>
        </div>
        <BentoGrid items={features} />
      </section>

      {/* 4. Workflow as orbital timeline */}
      <section className="relative bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-8 text-center">
          <h2 className="text-white text-3xl md:text-5xl font-semibold tracking-tight">
            From bill to recovery.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Six steps. Click any node to see what happens at that stage.
          </p>
        </div>
        <RadialOrbitalTimeline timelineData={workflow} />
      </section>

      {/* 5. The flip side: AI fighting for the wallet */}
      <SectionWithMockup
        reverseLayout
        title={
          <>
            AI that fights
            <br />
            for your wallet.
          </>
        }
        description={
          <>
            One in three medical bills contains an error. Most go unchallenged
            because patients can&apos;t read them and providers don&apos;t have time.
            Acuvera puts a billing expert in everyone&apos;s pocket — flagging
            overcharges with line-level citations, confidence scores, and the
            exact appeal language to use.
          </>
        }
        primaryImageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
        secondaryImageSrc="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
      />

      {/* 6. Cinematic footer / final CTA */}
      <CinematicFooter />
    </main>
  )
}
