import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Form Received - Prepare for Your Planning Session',
  description: 'Thank you for reaching out. Prepare for your planning session by reviewing mesh types, attachment options, and hardware details.',
  slug: '/form-entry',
  keywords: ['mosquito curtains', 'contact form', 'planning session', 'mesh types', 'tracking', 'velcro'],
  noIndex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/form-entry', 'Form Received'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Form Received - Prepare for Your Planning Session', description: 'Thank you for reaching out. Prepare for your planning session by reviewing mesh types, attachment options, and hardware details.', url: '/form-entry' })) }} />
      {children}
    </>
  )
}
