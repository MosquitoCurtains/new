import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Heavy Mosquito Netting Fabric | Raw Mesh By the Foot',
  description: 'Our most popular raw netting: heavy mosquito mesh in black, white, or ivory. 101", 123", and 138" wide rolls from $5.50/ft. 450 denier, lock stitch, CA fire rated. Will not unravel when cut.',
  slug: '/raw-netting/mosquito-net',
  keywords: ['heavy mosquito netting', 'mosquito mesh fabric', 'raw mosquito netting', 'mosquito netting by the foot', 'bulk mosquito mesh', 'black mosquito netting', 'white mosquito netting'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/mosquito-net', 'Heavy Mosquito Netting'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Heavy Mosquito Netting Fabric', description: 'Our most popular raw netting. 450 denier polyester, lock stitch weave, CA fire rated. Available in 101", 123", and 138" wide rolls. Black, white, or ivory.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/Mosquito-Mesh-1600.jpg', url: '/raw-netting/mosquito-net' })) }} />
      {children}
    </>
  )
}
