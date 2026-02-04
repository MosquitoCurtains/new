'use client'

import React from 'react'
import { cn } from '../shared-utils'

// ============================================================================
// PAGE HERO COMPONENT - Mosquito Curtains Light Theme
// Standardized hero section following PAGE_BUILDING_RULES.md
// ============================================================================

export interface PageHeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}

export const PageHero = React.forwardRef<HTMLDivElement, PageHeroProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {/* Gradient Border - MC Brand Colors */}
        <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-[#406517]/40 via-[#003365]/30 to-[#B30158]/40">
          {/* Card Container */}
          <div className="relative p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 shadow-lg">
            
            <div className="relative z-10">
              {/* Eyebrow */}
              {eyebrow && (
                <div className="text-center mb-4">
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#406517] font-semibold">
                    {eyebrow}
                  </div>
                </div>
              )}
              
              {/* Title Section */}
              <div className={cn("text-center", subtitle || children ? "mb-4" : "")}>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  {title}
                </h1>
              </div>
              
              {/* Subtitle */}
              {subtitle && (
                <div className={cn("text-center", children ? "mb-4" : "")}>
                  <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                    {subtitle}
                  </p>
                </div>
              )}

              {/* Custom Children (buttons, etc.) */}
              {children && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
PageHero.displayName = 'PageHero'
