'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { PageLayout } from '@/lib/design-system'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// ============================================================================
// GLOBAL LAYOUT - Mosquito Curtains
// 
// This wraps ALL pages automatically via the root layout.
// Individual pages should NEVER import PageLayout directly.
// 
// Pattern from PAGE_BUILDING_RULES.md:
// GlobalLayout → PageLayout → Container → Stack → PageHero → Sections
// ============================================================================

interface GlobalLayoutProps {
  children: React.ReactNode
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const pathname = usePathname()
  
  // Special routes that need no layout (e.g., print pages, PDFs)
  const noLayoutRoutes = ['/print', '/pdf', '/api']
  if (noLayoutRoutes.some(route => pathname?.startsWith(route))) {
    return <>{children}</>
  }
  
  // All pages: Header + PageLayout + Footer
  // pt-8 matches Stack gap="lg" (gap-8 = 32px) for consistent spacing
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <PageLayout className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {children}
      </PageLayout>
      <Footer />
    </div>
  )
}
