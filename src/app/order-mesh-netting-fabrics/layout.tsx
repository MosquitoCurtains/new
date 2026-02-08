import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Mesh Netting Fabrics',
  description: 'Order raw netting fabrics by the foot. Heavy mosquito mesh, no-see-um, shade mesh, theatre scrim, and industrial mesh. Marine-grade quality.',
  slug: '/order-mesh-netting-fabrics',
  keywords: ['order mesh netting', 'raw netting fabric', 'mosquito netting by the foot', 'shade mesh', 'theatre scrim'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
