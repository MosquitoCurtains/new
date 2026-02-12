import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'
import OrderShell from '@/app/order/components/OrderShell'

export const metadata: Metadata = buildPageMetadata({
  title: 'Raw Netting & Mesh Fabrics | Buy By the Foot',
  description: 'Giant rolls of raw netting and mesh fabric sold by the linear foot. Heavy mosquito mesh, no-see-um, shade mesh, theatre scrim, and industrial netting. Marine-grade quality from manufacturers since 2003.',
  slug: '/raw-netting',
  keywords: ['raw netting', 'mesh fabric', 'mosquito netting by the foot', 'bulk mosquito mesh', 'raw mesh netting', 'netting fabric rolls', 'DIY mosquito netting'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting', 'Raw Netting & Mesh Fabrics'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Raw Netting & Mesh Fabrics | Buy By the Foot', description: 'Giant rolls of raw netting and mesh fabric sold by the linear foot. Heavy mosquito mesh, no-see-um, shade mesh, theatre scrim, and industrial netting. Marine-grade quality.', url: '/raw-netting' })) }} />
      <OrderShell>{children}</OrderShell>
    </>
  )
}
