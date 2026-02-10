import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Clear Vinyl Project #87444 | Project Series',
  description: 'See how we worked with a customer on their clear vinyl patio enclosure project. Learn how to plan your own project with our team.',
  slug: '/project-series/clear-vinyl-project-87444',
  keywords: ['clear vinyl project', 'patio enclosure', 'project series', 'case study', 'clear vinyl panels'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/project-series/clear-vinyl-project-87444', 'Clear Vinyl Project #87444'))) }} />
      {children}
    </>
  )
}
