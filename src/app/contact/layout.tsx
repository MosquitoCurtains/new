import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact',
  description: 'Get started fast with a real person. Upload project photos, fill out our Quick Connect form, or call (770) 645-4745. Our planning team is ready to help with mosquito curtains, clear vinyl, and outdoor enclosures.',
  slug: '/contact',
  keywords: ['mosquito curtains', 'contact', 'project planning', 'screen enclosures', 'custom curtains', 'Alpharetta GA'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/contact', 'Contact')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Contact', description: 'Get started fast with a real person. Upload project photos, fill out our Quick Connect form, or call (770) 645-4745. Our planning team is ready to help with mosquito curtains, clear vinyl, and outdoor enclosures.', url: '/contact' })) }} />
      {children}
    </>
  )
}
