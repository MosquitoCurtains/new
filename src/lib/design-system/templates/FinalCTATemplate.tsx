'use client'

/**
 * FinalCTATemplate
 * 
 * The big gradient CTA section typically used at the bottom of pages.
 * Edit this template to update ALL instances across the site.
 * 
 * Usage:
 * ```tsx
 * import { FinalCTATemplate } from '@/lib/design-system'
 * 
 * <FinalCTATemplate />
 * // or with custom text:
 * <FinalCTATemplate 
 *   title="Custom Headline"
 *   subtitle="Custom supporting text"
 * />
 * ```
 */

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '../components'

export interface FinalCTATemplateProps {
  /** Main headline */
  title?: string
  /** Supporting text */
  subtitle?: string
  /** Primary CTA text */
  primaryCTAText?: string
  /** Primary CTA link */
  primaryCTALink?: string
  /** Show phone number button (default: true) */
  showPhone?: boolean
  /** Color variant (default: 'green') */
  variant?: 'green' | 'blue' | 'dark'
}

const VARIANT_STYLES = {
  green: 'bg-gradient-to-br from-[#406517] to-[#2d4710]',
  blue: 'bg-gradient-to-br from-[#003365] to-[#001a33]',
  dark: 'bg-gradient-to-br from-gray-900 to-black',
}

export function FinalCTATemplate({
  title = 'Ready to Enjoy Your Outdoor Space?',
  subtitle = "Get a custom quote in minutes. Our planning team is here to help you create the perfect solution for your home.",
  primaryCTAText = 'Free Instant Quote',
  primaryCTALink = '/start-project',
  showPhone = true,
  variant = 'green',
}: FinalCTATemplateProps) {
  return (
    <section>
      <div className={`${VARIANT_STYLES[variant]} rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="highlight" size="lg" asChild>
              <Link href={primaryCTALink}>
                {primaryCTAText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {showPhone && (
              <Button 
                variant="outline" 
                size="lg" 
                className="!border-white/30 !text-white hover:!bg-white/10" 
                asChild
              >
                <a href="tel:7706454745">
                  <Phone className="mr-2 w-5 h-5" />
                  (770) 645-4745
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
