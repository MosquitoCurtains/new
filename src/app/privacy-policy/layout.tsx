import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy Policy for Mosquito Curtains. Important information about our policies, terms, and commitments to our customers.',
  slug: '/privacy-policy',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'privacy', 'policy'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/privacy-policy', 'Privacy Policy')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Privacy Policy', description: 'Privacy Policy for Mosquito Curtains. Important information about our policies, terms, and commitments to our customers.', url: '/privacy-policy' })) }} />
      </head>
      {children}
    </>
  )
}
