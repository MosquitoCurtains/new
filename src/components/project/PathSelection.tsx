'use client'

/**
 * Path Selection — "How do you want to design your project?"
 *
 * Step 2 of the start-project flow.
 * Two main paths (equal weight):
 *   1. Expert Assistance — recommended hero path
 *   2. Design-It-Yourself Wizard — DIY builder
 * Plus a demoted Instant Quote utility box underneath.
 */

import Link from 'next/link'
import {
  MessageSquare,
  Hammer,
  Calculator,
  Check,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  Star,
  Users,
  Tag,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

export type ProductSlug = 'mosquito-curtains' | 'clear-vinyl' | 'raw-netting'

/* ------------------------------------------------------------------ */
/*  Trust strip for Expert card                                        */
/* ------------------------------------------------------------------ */

const TRUST_ITEMS = [
  { icon: Clock, text: '20+ years in business' },
  { icon: Heart, text: 'Family owned' },
  { icon: Star, text: 'A+ customer ratings' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PathSelectionProps {
  productSlug: ProductSlug
  productTitle: string
  backHref?: string
}

export function PathSelection({ productSlug, productTitle, backHref = '/start-project' }: PathSelectionProps) {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <section className="relative">
          {/* Background blurs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-5 md:p-6 lg:p-8">
            {/* Back button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {backHref && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref}>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                How do you want to design your project?
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Most homeowners either have us design it for them or use our step-by-step wizard.
                If you just want a quick price check, there&apos;s an Instant Quote tool too.
              </p>
            </div>

            {/* Section divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-base !mb-0 text-gray-900">Choose Your Path</Heading>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            {/* ============================================================ */}
            {/*  Two main path cards — equal weight, side by side             */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">

              {/* Card 1 — Expert Assistance */}
              <Link href={`/start-project/${productSlug}/expert-assistance`} className="block">
                <Card
                  variant="elevated"
                  className="relative h-full text-left rounded-2xl border-2 transition-all bg-white p-6 border-[#406517]/30 shadow-md ring-1 ring-[#406517]/10 hover:transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Badge
                    className="absolute -top-3 right-4 !text-white !px-3 !py-1"
                    style={{ backgroundColor: '#406517', borderColor: '#406517' }}
                  >
                    Recommended &middot; Easiest
                  </Badge>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#406517]/10 flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-[#406517]" />
                    </div>
                    <Heading level={4} className="!text-lg !mb-0">
                      Let our team design it for you
                    </Heading>
                  </div>
                  <Text size="sm" className="text-gray-600 !mb-3">
                    &ldquo;Send us a few photos and rough measurements. We&apos;ll do the hard parts.&rdquo;
                  </Text>

                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      We meet in a screen share and draw on your photos as you watch
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      We recommend the best attachments and panel layout for your space
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      We double-check everything before anything is built or shipped
                    </li>
                  </ul>

                  {/* Micro-proof + trust strip */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      20+ years helping homeowners get it right the first time.
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {TRUST_ITEMS.map((item, i) => {
                        const TrustIcon = item.icon
                        return (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <TrustIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            {item.text}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 w-full rounded-lg py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#406517] transition-all hover:opacity-90">
                    <span className="flex items-center justify-center gap-1.5">
                      Get Free Design &amp; Exact Quote
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>

              {/* Card 2 — Design-It-Yourself Wizard */}
              <Link href={`/start-project/${productSlug}/diy-builder`} className="block">
                <Card
                  variant="elevated"
                  className="relative h-full text-left rounded-2xl border-2 transition-all bg-white p-6 hover:border-gray-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Badge
                    className="absolute -top-3 right-4 !text-white"
                    style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}
                  >
                    DIY Friendly
                  </Badge>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFA501]/10 flex-shrink-0">
                      <Hammer className="w-5 h-5 text-[#FFA501]" />
                    </div>
                    <Heading level={4} className="!text-lg !mb-0">
                      Use the step-by-step builder
                    </Heading>
                  </div>
                  <Text size="sm" className="text-gray-600 !mb-3">
                    &ldquo;Measure your openings, choose options, and see your price as you go.&rdquo;
                  </Text>

                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Enter your porch measurements once
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Our wizard suggests panels, attachments, and layout as you build
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Adjust details until it&apos;s exactly how you want it
                    </li>
                  </ul>

                  {/* Micro-reassurance */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Text size="xs" className="text-gray-500 italic !mb-0">
                      Great if you&apos;re comfortable measuring and like to see every option.
                    </Text>
                  </div>

                  <div className="mt-4 w-full rounded-lg py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#FFA501] transition-all hover:opacity-90">
                    <span className="flex items-center justify-center gap-1.5">
                      Start the Design Wizard
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            </div>

            {/* ============================================================ */}
            {/*  Instant Quote — demoted utility box                          */}
            {/* ============================================================ */}
            <div className="mt-5 max-w-2xl mx-auto">
              <Link href={`/start-project/${productSlug}/instant-quote`} className="block group">
                <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 transition-all hover:border-[#003365]/30 hover:shadow-md">
                  <Badge
                    className="absolute -top-2.5 right-4 !text-white !text-xs"
                    style={{ backgroundColor: '#003365', borderColor: '#003365' }}
                  >
                    Price Check Tool
                  </Badge>

                  <div className="md:flex md:items-start md:gap-5">
                    {/* Left: icon + copy */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#003365]/10">
                          <Calculator className="w-5 h-5 text-[#003365]" />
                        </div>
                        <Heading level={4} className="!text-base !mb-0">
                          Just want a quick ballpark price?
                        </Heading>
                      </div>
                      <Text size="sm" className="text-gray-600 !mb-2">
                        &ldquo;Use our Instant Quote tool to see a rough price in a minute.&rdquo;
                      </Text>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#003365] flex-shrink-0" />
                          No email required to see pricing
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                          Same pricing we use in our full designs
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-[#003365] flex-shrink-0" />
                          Jump into Expert Assistance or the Wizard if you like what you see
                        </span>
                      </div>
                    </div>

                    {/* Right: button */}
                    <div className="mt-3 md:mt-0 md:flex-shrink-0 md:self-center">
                      <div className="rounded-lg py-2 px-5 text-center text-sm font-semibold text-white bg-[#003365] transition-all group-hover:opacity-90 whitespace-nowrap">
                        <span className="flex items-center justify-center gap-1.5">
                          Open Instant Quote
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transparency line */}
                  <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100 text-center">
                    We&apos;re proud of our pricing transparency. No sales games.
                    Use Instant Quote any time, then pick the path that feels right.
                  </p>
                </div>
              </Link>
            </div>

            {/* ============================================================ */}
            {/*  Microcopy + risk-reversal                                     */}
            {/* ============================================================ */}
            <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
              Not sure which to pick? Choose Expert Assistance.{' '}
              You&apos;ll still see all the options, but with a real person checking that it fits and works before anything is made.
            </p>

            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-start gap-2.5 bg-[#406517]/5 border border-[#406517]/15 rounded-xl px-4 py-3 max-w-2xl">
                <ShieldCheck className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Worried about getting it wrong? Every project is reviewed by a real person before it&apos;s made. If something looks off, we&apos;ll reach out.
                </span>
              </div>
            </div>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
