import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'No-See-Um Mesh Fabric',
  description: 'Buy no-see-um mesh fabric by the foot. Dense weave with 800 holes per sq inch keeps out tiny biting flies. Available in black or white. 101" & 123" wide rolls.',
  slug: '/no-see-um-netting-screen',
  keywords: ['no-see-um mesh', 'no-see-um netting', 'no see um screen', 'biting fly mesh', 'dense mosquito netting', 'raw netting'],
  type: 'product',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
