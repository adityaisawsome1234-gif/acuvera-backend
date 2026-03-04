import { Navigation } from '@/components/sections/navigation'
import { Hero } from '@/components/sections/hero'
import { ProductDemo } from '@/components/sections/product-demo'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Features } from '@/components/sections/features'
import { AIEngine } from '@/components/sections/ai-engine'
import { Trust } from '@/components/sections/trust'
import { Pricing } from '@/components/sections/pricing'
import { Enterprise } from '@/components/sections/enterprise'
import { FinalCTA } from '@/components/sections/final-cta'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <ProductDemo />
      <HowItWorks />
      <Features />
      <AIEngine />
      <Trust />
      <Pricing />
      <Enterprise />
      <FinalCTA />
      <Footer />
    </main>
  )
}
