import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Shade Screen Mesh Fabric | 80% Sun Block By the Foot',
  description: 'Shade mesh blocks 80% of sunlight plus insects. 120" wide roll at $7.00/ft. Black for privacy (opaque looking in), white for outdoor projection screens. Solution-dyed polyester.',
  slug: '/raw-netting/shade-mesh',
  keywords: ['shade mesh', 'shade screen fabric', 'sun blocking mesh', 'privacy screen mesh', 'outdoor projection screen', 'shade netting', '80% shade cloth'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/shade-mesh', 'Shade Mesh'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Shade Screen Mesh Fabric', description: 'Blocks 80% of sunlight plus insects. 120" wide roll in black or white. Clear looking out, opaque looking in. Also used for outdoor projection screens.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/Shade-Mesh-1600.jpg', url: '/raw-netting/shade-mesh' })) }} />
      {children}
    </>
  )
}
