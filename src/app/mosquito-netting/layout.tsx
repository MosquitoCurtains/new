import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: "Our 'Heavy' Mosquito Netting Fabric",
  description: 'Buy heavy mosquito netting fabric by the foot. Most popular mesh — best value, quality, and airflow. Available in black, white, or ivory. 101" to 138" wide rolls.',
  slug: '/mosquito-netting',
  keywords: ['mosquito netting', 'mosquito mesh', 'heavy mosquito netting', 'raw netting', 'mosquito netting fabric', 'netting by the foot'],
  type: 'product',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
