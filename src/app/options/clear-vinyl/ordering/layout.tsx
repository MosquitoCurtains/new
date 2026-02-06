import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Ordering Clear Vinyl',
  description: 'Ordering Clear Vinyl - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/options/clear-vinyl/ordering',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'options', 'clear', 'vinyl', 'ordering'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/options/clear-vinyl/ordering', 'Ordering Clear Vinyl')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Ordering Clear Vinyl', description: 'Ordering Clear Vinyl - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/options/clear-vinyl/ordering' })) }} />
      </head>
      {children}
    </>
  )
}
