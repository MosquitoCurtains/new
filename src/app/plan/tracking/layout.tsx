import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Outdoor Curtain Tracking',
  description: 'Outdoor Curtain Tracking - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/plan/tracking',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'plan', 'tracking'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/plan/tracking', 'Outdoor Curtain Tracking')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Outdoor Curtain Tracking', description: 'Outdoor Curtain Tracking - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/plan/tracking' })) }} />
      </head>
      {children}
    </>
  )
}
