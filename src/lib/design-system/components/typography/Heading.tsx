'use client'

import React from 'react'
import { cn } from '../shared-utils'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, level = 1, className = '', ...props }, ref) => {
    const sizes = {
      1: 'text-2xl md:text-3xl',                  // Page titles (24px → 30px)
      2: 'text-xl md:text-2xl',                   // Section titles (20px → 24px)
      3: 'text-lg md:text-xl',                    // Subsection titles (18px → 20px)
      4: 'text-base md:text-lg',                  // Card titles (16px → 18px)
      5: 'text-sm md:text-base',                  // Small headings (14px → 16px)
      6: 'text-xs md:text-sm'                     // Smallest headings (12px → 14px)
    }
    
    const margins = {
      1: 'mb-3 md:mb-4',
      2: 'mb-2 md:mb-3',
      3: 'mb-2',
      4: 'mb-1.5',
      5: 'mb-1',
      6: 'mb-1'
    }
    
    const weights = {
      1: 'font-bold',
      2: 'font-bold',
      3: 'font-bold',
      4: '',           // H4 is not bold
      5: 'font-semibold',
      6: 'font-semibold'
    }
    
    const baseClassName = cn(weights[level], sizes[level], margins[level], className)
    
    switch (level) {
      case 1:
        return (
          <h1 ref={ref} className={baseClassName} {...props}>
            {children}
          </h1>
        )
      case 2:
        return (
          <h2 ref={ref} className={baseClassName} {...props}>
            {children}
          </h2>
        )
      case 3:
        return (
          <h3 ref={ref} className={baseClassName} {...props}>
            {children}
          </h3>
        )
      case 4:
        return (
          <h4 ref={ref} className={baseClassName} {...props}>
            {children}
          </h4>
        )
      case 5:
        return (
          <h5 ref={ref} className={baseClassName} {...props}>
            {children}
          </h5>
        )
      case 6:
        return (
          <h6 ref={ref} className={baseClassName} {...props}>
            {children}
          </h6>
        )
    }
  }
)
Heading.displayName = 'Heading'

