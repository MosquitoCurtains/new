import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Netting Rigging Ideas | How to Attach Raw Netting',
  description: 'Creative ways to attach and rig raw netting: marine snaps, elastic cord, PVC frames, duct tape hems, zip ties, velcro, and more. Ideas from thousands of customer projects since 2003.',
  slug: '/raw-netting/rigging',
  keywords: ['netting rigging', 'how to attach netting', 'mosquito net installation', 'DIY netting', 'PVC netting frame', 'netting attachment ideas', 'mesh rigging methods'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/rigging', 'Rigging Ideas'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Fasteners & Rigging Ideas for Raw Netting', description: 'Creative ways to attach raw netting. Marine snaps, elastic cord, PVC frames, duct tape hems, zip ties, and more. From thousands of customer projects.', url: '/raw-netting/rigging' })) }} />
      {children}
    </>
  )
}
