import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Mosquito Curtains - Start Project',
  description: 'Start your mosquito curtain project. Expert assistance, instant quote, or DIY builder.',
  slug: '/start-project/mosquito-curtains',
  keywords: ['mosquito curtains', 'custom screens', 'start project', 'expert assistance', 'instant quote', 'diy builder'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/start-project/mosquito-curtains', 'Mosquito Curtains'))) }} />
      {children}
    </>
  )
}
