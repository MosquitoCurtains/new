import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'
import OrderShell from '@/app/order/components/OrderShell'

export const metadata: Metadata = buildPageMetadata({
  title: 'Raw Netting Fabric Store | Shop Mesh By Type',
  description: 'Shop raw netting and mesh fabrics by type. Heavy mosquito mesh, no-see-um, shade mesh, theatre scrim, and industrial netting. Giant rolls custom-cut to your specs. Marine-grade quality.',
  slug: '/raw-netting-fabric-store',
  keywords: ['raw netting store', 'mesh fabric store', 'buy netting online', 'mosquito mesh store', 'netting fabric shop', 'bulk mesh netting'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting-fabric-store', 'Raw Netting Fabric Store'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Raw Netting Fabric Store', description: 'Shop raw netting and mesh fabrics by type. Giant rolls custom-cut to your specifications. Marine-grade quality from manufacturers since 2003.', url: '/raw-netting-fabric-store' })) }} />
      <OrderShell>{children}</OrderShell>
    </>
  )
}
