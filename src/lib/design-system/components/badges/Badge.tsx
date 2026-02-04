'use client'

import React from 'react'
import { cn } from '../shared-utils'

// ============================================================================
// BADGE COMPONENT - Mosquito Curtains Light Theme
// ============================================================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'highlight' | 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral'
  className?: string
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'primary', className = '', ...props }, ref) => {
    // Mosquito Curtains Brand Colors:
    // Primary: #406517 (Forest Green)
    // Secondary: #003365 (Navy Blue)
    // Accent: #B30158 (Magenta)
    // Highlight: #FFA501 (Orange)
    
    const variants = {
      primary: 'bg-[#406517]/10 text-[#406517] border-[#406517]/30',
      secondary: 'bg-[#003365]/10 text-[#003365] border-[#003365]/30',
      accent: 'bg-[#B30158]/10 text-[#B30158] border-[#B30158]/30',
      highlight: 'bg-[#FFA501]/10 text-[#FFA501] border-[#FFA501]/30',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-amber-100 text-amber-700 border-amber-200',
      danger: 'bg-red-100 text-red-700 border-red-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    }
    
    return (
      <span 
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold border',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
