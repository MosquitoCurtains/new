import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Fabric Store',
  description: 'Custom fabric store by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.',
  slug: '/raw-netting-fabric-store',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'netting', 'fabric', 'store'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting-fabric-store', 'Fabric Store')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Fabric Store', description: 'Custom fabric store by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/raw-netting-fabric-store' })) }} />
      </head>
      {children}
    </>
  )
}
