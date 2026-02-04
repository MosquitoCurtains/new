'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface GradientSectionProps {
  children: ReactNode
  /**
   * Color theme for the gradient
   * @default 'green'
   */
  variant?: 'green' | 'blue' | 'pink' | 'mixed' | 'neutral'
  /**
   * Whether to center content
   * @default true
   */
  centered?: boolean
  /**
   * Optional title
   */
  title?: ReactNode
  /**
   * Optional subtitle
   */
  subtitle?: ReactNode
  /**
   * Additional className
   */
  className?: string
}

const variantStyles = {
  green: 'bg-gradient-to-br from-[#406517]/5 via-white to-transparent border-[#406517]/20',
  blue: 'bg-gradient-to-br from-[#003365]/5 via-white to-transparent border-[#003365]/20',
  pink: 'bg-gradient-to-br from-[#B30158]/5 via-white to-transparent border-[#B30158]/20',
  mixed: 'bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20',
  neutral: 'bg-white border-gray-200',
}

/**
 * GradientSection - Reusable gradient-bordered section card
 * 
 * Edit this component to update ALL gradient sections across the site.
 * 
 * @example
 * ```tsx
 * <GradientSection 
 *   variant="mixed" 
 *   title="Section Title" 
 *   subtitle="Section description"
 * >
 *   <YourContent />
 * </GradientSection>
 * ```
 */
export function GradientSection({
  children,
  variant = 'green',
  centered = true,
  title,
  subtitle,
  className,
}: GradientSectionProps) {
  return (
    <section>
      <div 
        className={cn(
          'border-2 rounded-3xl p-6 md:p-8 lg:p-10',
          variantStyles[variant],
          className
        )}
      >
        <div className={cn(centered && 'flex flex-col items-center')}>
          {(title || subtitle) && (
            <div className={cn('mb-8', centered && 'text-center')}>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
