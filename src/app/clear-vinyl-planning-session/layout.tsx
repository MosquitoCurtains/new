import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Prepare for Your Clear Vinyl Planning Session',
  description: 'Get ready for your clear vinyl planning session. Learn about apron colors, attachment options, and installation hardware.',
  slug: '/clear-vinyl-planning-session',
  keywords: ['clear vinyl', 'planning session', 'apron colors', 'velcro', 'tracking', 'marine snaps'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/clear-vinyl-planning-session', 'Prepare for Your Clear Vinyl Planning Session'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Prepare for Your Clear Vinyl Planning Session', description: 'Get ready for your clear vinyl planning session. Learn about apron colors, attachment options, and installation hardware.', url: '/clear-vinyl-planning-session' })) }} />
      {children}
    </>
  )
}
