import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Mosquito Netting Hub',
  description: 'Custom mosquito netting hub by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.',
  slug: '/raw-netting',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'netting'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting', 'Mosquito Netting Hub')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Mosquito Netting Hub', description: 'Custom mosquito netting hub by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/raw-netting' })) }} />
      {children}
    </>
  )
}
