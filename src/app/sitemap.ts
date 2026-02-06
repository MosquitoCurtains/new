import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://www.mosquitocurtains.com'

// Priority mapping by page type
const PRIORITY_MAP: Record<string, number> = {
  homepage: 1.0,
  product: 0.9,
  landing: 0.8,
  informational: 0.7,
  support: 0.6,
  faq: 0.6,
  installation: 0.6,
  gallery: 0.5,
  blog: 0.5,
  legal: 0.3,
  redirect: 0.1,
}

// Change frequency by page type
const FREQUENCY_MAP: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  homepage: 'weekly',
  product: 'monthly',
  landing: 'monthly',
  informational: 'monthly',
  support: 'monthly',
  faq: 'monthly',
  installation: 'monthly',
  gallery: 'weekly',
  blog: 'yearly',
  legal: 'yearly',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use service role for server-side sitemap generation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: pages, error } = await supabase
    .from('site_pages')
    .select('slug, page_type, updated_at')
    .eq('migration_status', 'live')
    .order('migration_priority', { ascending: false })

  if (error || !pages) {
    console.error('Sitemap: failed to fetch pages', error)
    // Return minimal sitemap with homepage
    return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 }]
  }

  return pages.map((page) => {
    const pageType = page.page_type || 'informational'

    return {
      url: page.slug === '/' ? SITE_URL : `${SITE_URL}${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: FREQUENCY_MAP[pageType] || 'monthly',
      priority: PRIORITY_MAP[pageType] || 0.5,
    }
  })
}
