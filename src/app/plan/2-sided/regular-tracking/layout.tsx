import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: '2-Sided Regular Tracking',
  description: '2-Sided Regular Tracking - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/plan/2-sided/regular-tracking',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'plan', 'sided', 'regular', 'tracking'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/plan/2-sided/regular-tracking', '2-Sided Regular Tracking')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: '2-Sided Regular Tracking', description: '2-Sided Regular Tracking - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/plan/2-sided/regular-tracking' })) }} />
      </head>
      {children}
    </>
  )
}
