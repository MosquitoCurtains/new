import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Industrial Mesh',
  description: 'Buy industrial mesh by the foot or full roll. Incredibly strong military overrun nylon mesh. 65" wide, olive green. $4/ft or $900/roll (65" x 330ft).',
  slug: '/industrial-mesh',
  keywords: ['industrial mesh', 'military mesh', 'nylon mesh', 'industrial netting', 'heavy duty mesh', 'raw netting'],
  type: 'product',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
