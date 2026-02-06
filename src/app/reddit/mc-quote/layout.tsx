import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Reddit MC Quote',
  description: 'Reddit MC Quote from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.',
  slug: '/reddit/mc-quote',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'reddit', 'quote'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/reddit/mc-quote', 'Reddit MC Quote')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Reddit MC Quote', description: 'Reddit MC Quote from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.', url: '/reddit/mc-quote' })) }} />
      {children}
    </>
  )
}
