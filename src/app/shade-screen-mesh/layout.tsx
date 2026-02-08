import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Shade Mesh Fabric',
  description: 'Buy shade mesh fabric by the foot. Blocks 80% of sunlight plus insects. Clear looking out, opaque looking in. Also works as outdoor projection screen. 120" wide rolls.',
  slug: '/shade-screen-mesh',
  keywords: ['shade mesh', 'shade screen', 'sun blocking mesh', 'outdoor projection screen', 'shade fabric', 'raw netting'],
  type: 'product',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
