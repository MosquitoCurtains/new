'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CTASectionProps {
  /**
   * Main headline
   */
  title: ReactNode
  /**
   * Supporting text
   */
  subtitle?: ReactNode
  /**
   * CTA buttons/actions
   */
  children: ReactNode
  /**
   * Color theme
   * @default 'green'
   */
  variant?: 'green' | 'blue' | 'dark'
  /**
   * Additional className
   */
  className?: string
}

const variantStyles = {
  green: 'bg-gradient-to-br from-[#406517] to-[#2d4710]',
  blue: 'bg-gradient-to-br from-[#003365] to-[#001a33]',
  dark: 'bg-gradient-to-br from-gray-900 to-black',
}

/**
 * CTASection - Big gradient call-to-action section
 * 
 * Edit this component to update ALL CTA sections across the site.
 * 
 * @example
 * ```tsx
 * <CTASection 
 *   title="Ready to Get Started?"
 *   subtitle="Join thousands of happy customers"
 *   variant="green"
 * >
 *   <Button variant="highlight" size="lg">Get Your Quote</Button>
 * </CTASection>
 * ```
 */
export function CTASection({
  title,
  subtitle,
  children,
  variant = 'green',
  className,
}: CTASectionProps) {
  return (
    <section>
      <div 
        className={cn(
          'rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden',
          variantStyles[variant],
          className
        )}
      >
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-white/80 mb-8">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
