import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Applications Hub',
  description: 'Browse our applications hub collection. Custom-made screen and netting solutions for porches, patios, garages, and more. Ships direct from our workshop.',
  slug: '/applications',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'applications'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/applications', 'Applications Hub')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Applications Hub', description: 'Browse our applications hub collection. Custom-made screen and netting solutions for porches, patios, garages, and more. Ships direct from our workshop.', url: '/applications' })) }} />
      {children}
    </>
  )
}
