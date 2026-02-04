'use client'

import React from 'react'
import { cn } from '../shared-utils'

// ============================================================================
// PAGE LAYOUT COMPONENT - Mosquito Curtains Light Theme
// 
// For marketing sites, PageLayout provides minimal base styling.
// Individual pages control their own section padding via Container + Stack.
// This allows full-bleed hero sections while maintaining consistent patterns.
//
// GlobalLayout wraps this - pages should NOT import PageLayout directly.
// ============================================================================

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** If true, adds default padding. False for marketing pages with full-bleed sections. */
  withPadding?: boolean
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, withPadding = false, className = '', ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          'min-h-screen bg-gray-50 text-gray-900',
          withPadding && 'pt-6 pb-12 md:py-12 lg:pt-8 px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      >
        {children}
      </main>
    )
  }
)
PageLayout.displayName = 'PageLayout'
