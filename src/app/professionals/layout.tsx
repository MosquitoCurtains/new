import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Professionals',
  description: 'Learn about professionals from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.',
  slug: '/professionals',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'professionals'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/professionals', 'Professionals')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Professionals', description: 'Learn about professionals from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.', url: '/professionals' })) }} />
      {children}
    </>
  )
}
