import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Apron Colors',
  description: 'Apron Colors - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/options/clear-vinyl/apron-colors',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'options', 'clear', 'vinyl', 'apron', 'colors'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/options/clear-vinyl/apron-colors', 'Apron Colors')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Apron Colors', description: 'Apron Colors - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/options/clear-vinyl/apron-colors' })) }} />
      {children}
    </>
  )
}
