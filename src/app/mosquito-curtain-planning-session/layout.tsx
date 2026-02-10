import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Prepare for Your Mosquito Curtain Planning Session',
  description: 'Get ready for your planning session. Learn about mesh types, attachment options, and hardware before meeting with our planning team.',
  slug: '/mosquito-curtain-planning-session',
  keywords: ['mosquito curtains', 'planning session', 'mesh types', 'tracking', 'velcro', 'marine snaps'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/mosquito-curtain-planning-session', 'Prepare for Your Mosquito Curtain Planning Session'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Prepare for Your Mosquito Curtain Planning Session', description: 'Get ready for your planning session. Learn about mesh types, attachment options, and hardware before meeting with our planning team.', url: '/mosquito-curtain-planning-session' })) }} />
      {children}
    </>
  )
}
