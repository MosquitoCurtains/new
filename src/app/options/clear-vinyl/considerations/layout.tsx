import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'What Can Go Wrong',
  description: 'What Can Go Wrong - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/options/clear-vinyl/considerations',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'options', 'clear', 'vinyl', 'considerations'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/options/clear-vinyl/considerations', 'What Can Go Wrong')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'What Can Go Wrong', description: 'What Can Go Wrong - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/options/clear-vinyl/considerations' })) }} />
      {children}
    </>
  )
}
