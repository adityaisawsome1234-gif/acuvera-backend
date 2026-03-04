import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Acuvera - AI-Powered Medical Billing Intelligence',
  description: 'Clarity in Every Medical Bill. AI that analyzes medical bills, detects hidden errors, and helps patients and providers recover lost money.',
  keywords: ['medical billing', 'AI healthcare', 'billing errors', 'healthcare costs', 'medical bill analysis'],
  openGraph: {
    title: 'Acuvera - AI-Powered Medical Billing Intelligence',
    description: 'Clarity in Every Medical Bill. Detect errors, prevent denials, protect revenue.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
