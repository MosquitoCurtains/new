import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Raw Mesh Fabric - Start Project',
  description: 'Start your raw mesh fabric project. Expert assistance, contact for quote, or DIY fabric store.',
  slug: '/start-project/raw-netting',
  keywords: ['raw netting', 'mesh fabric', 'diy materials', 'start project', 'expert assistance', 'bulk fabric'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/start-project/raw-netting', 'Raw Netting'))) }} />
      {children}
    </>
  )
}
