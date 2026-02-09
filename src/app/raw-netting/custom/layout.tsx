import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Custom Netting Orders | We Make It For You',
  description: 'Let us custom-make your netting panels. Hemmed edges, grommets, marine snaps, velcro -- whatever you need. Custom cut, sewn, and finished to your exact measurements. Since 2003.',
  slug: '/raw-netting/custom',
  keywords: ['custom netting', 'custom mosquito panels', 'made to measure netting', 'custom mesh panels', 'netting fabrication', 'custom screen panels'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/custom', 'Custom Orders'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Custom Netting Orders - Let Us Make It For You', description: 'Custom-made netting panels to your exact measurements. Hemmed, grommeted, snapped, or velcroed. Tens of thousands of custom projects since 2003.', url: '/raw-netting/custom' })) }} />
      {children}
    </>
  )
}
