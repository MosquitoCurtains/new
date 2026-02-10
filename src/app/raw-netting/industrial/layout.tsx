import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Industrial Mesh | Heavy-Duty Military Overrun Netting',
  description: 'Incredibly strong military overrun industrial mesh at $4.00/ft or $1,350/roll. 65" wide, 9.4 oz/yd2 nylon. Can zip tie on edges. Olive green. Agriculture, warehouses, loading docks, and more.',
  slug: '/raw-netting/industrial',
  keywords: ['industrial mesh', 'military netting', 'heavy duty mesh fabric', 'industrial netting', 'agricultural netting', 'loading dock screen', 'warehouse mesh'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/industrial', 'Industrial Mesh'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Industrial Mesh - Military Overrun Netting', description: 'Incredibly strong military overrun nylon mesh. 65" wide, 9.4 oz/yd2. Available by the foot or full roll. Olive green. Can zip tie on edges.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/Industrial-Mesh-1600.jpg', url: '/raw-netting/industrial' })) }} />
      {children}
    </>
  )
}
