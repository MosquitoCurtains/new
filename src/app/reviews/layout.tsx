import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Reviews',
  description: 'Learn about reviews from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.',
  slug: '/reviews',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'reviews'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/reviews', 'Reviews')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Reviews', description: 'Learn about reviews from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.', url: '/reviews' })) }} />
      </head>
      {children}
    </>
  )
}
