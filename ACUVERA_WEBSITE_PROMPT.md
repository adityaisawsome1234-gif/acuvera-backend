# Acuvera Website — Complete Build Prompt

Use this prompt to build or recreate the Acuvera marketing website from scratch. It contains brand, structure, content, and technical requirements.

---

## Overview

Build a production-quality, responsive marketing landing page for **Acuvera** — an AI-powered medical billing intelligence platform. The site should look like a top-tier healthcare/fintech SaaS (Stripe/Notion-level cleanliness), clearly explain the product in under 10 seconds, and optimize for conversion.

---

## Brand

| Element | Value |
|---------|-------|
| **Name** | Acuvera |
| **Tagline** | "Clarity in Every Medical Bill." |
| **Product** | AI-powered medical billing intelligence — detects errors, reduces denials, explains charges |

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Electric Blue | `#4A90FF` | Accents, highlights, gradients |
| Deep Blue | `#2563EB` | Primary CTAs, buttons |
| Dark Background | `#0F1117` | Page background |
| Text | White | Primary text |
| Muted Text | `white/40` to `white/60` | Secondary text |

### Visual Style

- Dark-mode first
- Soft gradients, thin dividers (`border-white/[0.06]`)
- Rounded corners (`rounded-2xl`, `rounded-xl`)
- Soft shadows, subtle glows
- Clean, minimal icon set (lucide-react)
- No stock photos — use abstract SVG/gradient illustrations

---

## Site Structure

Single-page with anchor sections + `/privacy` and `/terms` pages.

### 1. Top Nav (Fixed, Sticky)

- **Logo**: Acuvera logo image + wordmark
- **Links**: Product, How it Works, Security, Pricing, FAQs (anchor links)
- **Actions**: Sign in (link to `/login`), Request Demo (primary CTA button)
- **Behavior**: Transparent when at top; on scroll, add `bg-[#0F1117]/90 backdrop-blur-xl border-b border-white/[0.06]`
- **Mobile**: Hamburger menu with slide-down panel
- **Accessibility**: Skip-to-content link

### 2. Hero (Above the Fold)

- **Badge**: "Clarity in Every Medical Bill" (pill with border)
- **Headline**: "AI-Powered Medical **Billing Intelligence**" (gradient on "Billing Intelligence")
- **Subhead**: "Detect billing errors, reduce claim denials, and restore trust in healthcare payments — before submission."
- **CTAs**: 
  - Primary: "Request Demo" → opens demo modal
  - Secondary: "Try Sample Bill" → links to `/upload`
- **Microcopy**: "No PHI needed for demo · Free to try"
- **Right side**: Animated abstract "bill scanner" mock — stacked cards with line items, subtle highlight sweep animation
- **Social proof strip**: "Built for Providers · Patients · Revenue Cycle Teams"

### 3. Problem → Solution (2-Column)

- **Headline**: "The billing problem is massive. **The fix doesn't have to be.**"
- **Subhead**: "Healthcare billing errors cost the U.S. system over $100B annually. Acuvera catches them before they become denials."
- **Left column (Problem)**: Red-tinted card with:
  - CPT/ICD coding mistakes go undetected until denial
  - Hidden fees and balance-billing inconsistencies
  - High denial rates from preventable submission errors
  - Manual audits are slow, expensive, and error-prone
- **Right column (Solution)**: Green-tinted card with:
  - Automated line-item error detection before submission
  - Plain-English explanations of every charge
  - AI-recommended corrective actions and next steps
  - Complete audit trail for compliance and review

### 4. Product Pillars (4 Cards)

- **Headline**: "What Acuvera does"
- **Subhead**: "Four pillars of billing intelligence — working together to protect revenue and build patient trust.
- **Cards**:
  1. **Error Detection** — CPT/ICD mismatches, duplicates, upcoding flags, modifier issues
  2. **Denial Prevention** — Predict likely denial reasons before submission; pre-submit checks
  3. **Payment Integrity** — Under/overpayment identification, fee-schedule variances, balance-billing inconsistencies
  4. **Patient Clarity** — Plain-English explanations + what to ask insurer/provider

### 5. How It Works (4-Step Stepper)

- **Steps**: Upload/Connect → Analyze → Explain → Act
- **Sample output mock** (3-column): Findings list, Explanation panel, Next steps checklist
- **Example content** (illustrative, NOT real PHI):
  - Findings: Duplicate charge CPT 99213, Modifier 25 missing, ICD-10 specificity
  - Explanation: Plain-English paragraph about duplicate
  - Next steps: Remove duplicate, Add modifier, Verify ICD-10

### 6. Security & Privacy

- **Headline**: "Security & Privacy"
- **Subhead**: "Built for healthcare from day one. Your data stays yours."
- **Cards**:
  - Encryption at rest & in transit (AES-256, TLS 1.3)
  - Least-privilege access (RBAC)
  - Data minimization
  - Audit logs
  - Consent-first AI: "We ask permission before sending data to any third-party AI service"
  - Compliance roadmap: SOC 2 (Planned) · HIPAA-ready (as applicable)
- **Callout**: "Consent-first AI: We never send your data to external AI providers without explicit permission."

### 7. Outcomes (4 Metric Cards)

- Use outcome-style cards with qualifiers ("Target", "Example", "Pilot"):
  - 60% (Target) — Reduction in claim rework
  - 3× (Target) — Faster review cycles
  - 95%+ (Example) — Clean claim rate
  - 4.8/5 (Pilot) — Patient clarity score

### 8. Pricing (3 Tiers)

| Tier | Price | Description | CTA |
|------|-------|-------------|-----|
| **Patient** | Free | For individuals reviewing their own bills | Get Started |
| **Clinic / Practice** | $99/seat/month | For billing teams; highlight as "Most Popular" | Request Demo |
| **Enterprise** | Custom | SSO, SLAs, integrations, dedicated success manager | Contact Sales |

- **Patient features**: Scan a bill, Plain-English explanations, Export questions, 1 bill/month
- **Clinic features**: Unlimited analysis, Denial prediction, Team dashboard, Batch upload & API, Priority support
- **Enterprise features**: Everything in Clinic + SSO, Custom SLAs, EHR/RCM integrations, Dedicated success manager
- **Disclaimer**: "Pricing is indicative and subject to change. Contact sales for final quotes."

### 9. FAQ (Accordion)

- Is Acuvera medical advice? (No — billing tool, not medical advice)
- Do you store my bills? (Configurable; default: delete after analysis)
- Can I try without PHI? (Yes — sample bills)
- What data is sent to AI providers? (Disclosed + consent required)
- How do you handle HIPAA? (Safeguards, BAA, roadmap)
- What billing formats are supported? (PDF, EOB, CMS-1500, UB-04, EDI)

### 10. Final CTA

- **Headline**: "Revenue integrity should be **automatic**"
- **Subhead**: "Schedule a demo and see how Acuvera fits into your revenue cycle — in under 15 minutes."
- **Button**: Schedule a Demo

### 11. Footer

- Logo + Acuvera
- Links: Privacy, Terms, Security, Contact
- Copyright: © [Year] Acuvera. All rights reserved.

---

## Request Demo Modal

- **Fields**: Name (required), Work email (required), Company/Role (optional), Message (optional)
- **Validation**: Client-side; show errors inline
- **On submit**: Success state with checkmark, "Thanks! We'll be in touch." — No backend required (stub handler); structure for easy API integration later
- **Accessibility**: Focus trap, Escape to close, aria-modal, aria-label

---

## Pages

| Route | Content |
|-------|---------|
| `/` | Landing page (all sections above) |
| `/privacy` | Privacy policy template (data collected, purpose, sharing, retention, security, user rights, contact) |
| `/terms` | Terms of service template (acceptance, description, accounts, acceptable use, data, IP, liability, termination, changes, contact) |

---

## Technical Requirements

- **Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Animations**: framer-motion (entrance, hover, scroll); respect `prefers-reduced-motion`
- **Icons**: lucide-react
- **Images**: Prefer SVGs; use next/image only when needed
- **Performance**: Minimal dependencies; optimize for Lighthouse

### Accessibility

- Skip-to-content link
- Keyboard focus states
- aria-labels where needed
- Semantic headings (h1 → h2 → h3)
- Contrast: white text on dark backgrounds meets WCAG

### SEO

- Next.js metadata (title, description)
- OpenGraph tags
- Twitter cards
- Favicon

### Component Architecture

```
components/
  landing/
    Navbar.tsx
    Hero.tsx
    ProblemSolution.tsx
    ProductPillars.tsx
    HowItWorks.tsx
    Security.tsx
    Outcomes.tsx
    Pricing.tsx
    FAQ.tsx
    FinalCTA.tsx
    Footer.tsx
    DemoModal.tsx
    AnimatedSection.tsx  (reusable scroll-triggered entrance)
```

### Auth Flow

- If user is logged in, redirect `/` → `/dashboard`
- Otherwise show landing page

---

## Copywriting Guidelines

- Crisp, enterprise-credible, not hypey
- No claims of FDA approval or guaranteed outcomes
- Use "Target", "Example", "Pilot" when citing metrics
- Avoid legal overclaims; label compliance items as "Planned" if not implemented

---

## Deliverables

- Full codebase with clean component structure
- CSS variables for brand tokens
- Runnable with `npm run dev`
- README with setup steps
