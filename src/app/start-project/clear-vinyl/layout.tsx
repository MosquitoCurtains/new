import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Clear Vinyl Panels - Start Project',
  description: 'Start your clear vinyl panel project. Expert assistance, instant quote, or DIY builder.',
  slug: '/start-project/clear-vinyl',
  keywords: ['clear vinyl', 'vinyl panels', 'start project', 'expert assistance', 'instant quote', 'diy builder'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/start-project/clear-vinyl', 'Clear Vinyl'))) }} />
      {children}
    </>
  )
}
