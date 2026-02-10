import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Prepare for Your Planning Session',
  description: 'Select your project type to prepare for your planning session with our team.',
  slug: '/prepare',
  keywords: ['planning session', 'mosquito curtains', 'clear vinyl', 'project preparation'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/prepare', 'Prepare for Your Planning Session'))) }} />
      {children}
    </>
  )
}
