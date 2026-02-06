import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Videos',
  description: 'Videos from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.',
  slug: '/videos',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'videos'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/videos', 'Videos')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Videos', description: 'Videos from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.', url: '/videos' })) }} />
      {children}
    </>
  )
}
