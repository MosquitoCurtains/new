import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Options / Clear Vinyl',
  description: 'Options / Clear Vinyl - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/options/clear-vinyl',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'options', 'clear', 'vinyl'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/options/clear-vinyl', 'Options / Clear Vinyl')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Options / Clear Vinyl', description: 'Options / Clear Vinyl - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/options/clear-vinyl' })) }} />
      {children}
    </>
  )
}
