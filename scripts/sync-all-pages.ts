/**
 * Push ALL admin sitemap pages (205) into site_pages.
 * Includes private/internal pages the public sitemap doesn't have.
 */
import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '..', '.env.local') })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// All 57 private/internal pages from admin sitemap (non-dynamic only)
const PRIVATE_PAGES = [
  // Marketing Landing
  { slug: '/fb', title: 'Facebook Hub', type: 'marketing' },
  { slug: '/fb/mc-quote', title: 'FB: MC Quote', type: 'marketing' },
  { slug: '/fb/cv-quote', title: 'FB: CV Quote', type: 'marketing' },
  { slug: '/reddit', title: 'Reddit Hub', type: 'marketing' },
  { slug: '/reddit/mc-quote', title: 'Reddit: MC Quote', type: 'marketing' },
  // E-commerce / Transactional
  { slug: '/cart', title: 'Shopping Cart', type: 'ecommerce' },
  { slug: '/checkout', title: 'Checkout', type: 'ecommerce' },
  { slug: '/my-orders', title: 'My Orders', type: 'ecommerce' },
  { slug: '/my-projects', title: 'My Projects', type: 'ecommerce' },
  { slug: '/uploads', title: 'Uploads', type: 'utility' },
  { slug: '/experiment', title: 'Experiment', type: 'utility' },
  // Admin
  { slug: '/admin', title: 'Admin Home', type: 'admin' },
  { slug: '/admin/sitemap', title: 'Site Map', type: 'admin' },
  { slug: '/admin/pricing', title: 'Pricing Manager', type: 'admin' },
  { slug: '/admin/sales', title: 'Sales Dashboard', type: 'admin' },
  { slug: '/admin/mc-sales', title: 'MC Sales', type: 'admin' },
  { slug: '/admin/mc-sales/analytics', title: 'MC Analytics', type: 'admin' },
  { slug: '/admin/mc-sales/analytics/ads', title: 'MC Ad Analytics', type: 'admin' },
  { slug: '/admin/mc-sales/analytics/leads', title: 'MC Lead Analytics', type: 'admin' },
  { slug: '/admin/mc-sales/analytics/waterfall', title: 'MC Waterfall', type: 'admin' },
  { slug: '/admin/cv-sales', title: 'CV Sales', type: 'admin' },
  { slug: '/admin/rn-sales', title: 'RN Sales', type: 'admin' },
  { slug: '/admin/ru-sales', title: 'RU Sales', type: 'admin' },
  { slug: '/admin/audit', title: 'Page Audit', type: 'admin' },
  { slug: '/admin/customers', title: 'Customer CRM', type: 'admin' },
  { slug: '/admin/analytics', title: 'Analytics', type: 'admin' },
  { slug: '/admin/export', title: 'Financial Export', type: 'admin' },
  { slug: '/admin/gallery', title: 'Gallery Manager', type: 'admin' },
  { slug: '/admin/galleries', title: 'Collections Manager', type: 'admin' },
  { slug: '/admin/notifications', title: 'Notifications', type: 'admin' },
  { slug: '/admin/notifications/templates', title: 'Notification Templates', type: 'admin' },
  { slug: '/admin/shipping-tax', title: 'Shipping & Tax', type: 'admin' },
  // Design System
  { slug: '/design-system', title: 'Design System Hub', type: 'utility' },
  { slug: '/design-system/button', title: 'DS: Button', type: 'utility' },
  { slug: '/design-system/card', title: 'DS: Card', type: 'utility' },
  { slug: '/design-system/container', title: 'DS: Container', type: 'utility' },
  { slug: '/design-system/grid', title: 'DS: Grid', type: 'utility' },
  { slug: '/design-system/stack', title: 'DS: Stack', type: 'utility' },
  { slug: '/design-system/heading', title: 'DS: Heading', type: 'utility' },
  { slug: '/design-system/text', title: 'DS: Text', type: 'utility' },
  { slug: '/design-system/input', title: 'DS: Input', type: 'utility' },
  { slug: '/design-system/frame', title: 'DS: Frame', type: 'utility' },
  { slug: '/design-system/two-column', title: 'DS: Two Column', type: 'utility' },
  { slug: '/design-system/bulleted-list', title: 'DS: Bulleted List', type: 'utility' },
  { slug: '/design-system/gradient-section', title: 'DS: Gradient Section', type: 'utility' },
  { slug: '/design-system/header-bar-section', title: 'DS: Header Bar Section', type: 'utility' },
  { slug: '/design-system/cta-section', title: 'DS: CTA Section', type: 'utility' },
  { slug: '/design-system/feature-card', title: 'DS: Feature Card', type: 'utility' },
  { slug: '/design-system/youtube-embed', title: 'DS: YouTube Embed', type: 'utility' },
  { slug: '/design-system/power-header-template', title: 'DS: Power Header', type: 'utility' },
  { slug: '/design-system/final-cta-template', title: 'DS: Final CTA', type: 'utility' },
  { slug: '/design-system/why-choose-us-template', title: 'DS: Why Choose Us', type: 'utility' },
]

async function main() {
  console.log('=== Push Private/Internal Pages -> site_pages ===\n')

  const { data: existing } = await supabase.from('site_pages').select('slug')
  const existingSlugs = new Set((existing || []).map((r: any) => r.slug))
  
  const newPages = PRIVATE_PAGES.filter(p => !existingSlugs.has(p.slug))
  console.log(`Existing: ${existingSlugs.size} | Private to add: ${newPages.length}`)
  
  if (newPages.length === 0) {
    console.log('All private pages already exist!')
    const { count } = await supabase.from('site_pages').select('*', { count: 'exact', head: true })
    console.log(`Total site_pages: ${count}`)
    return
  }
  
  let success = 0
  for (const page of newPages) {
    const { error } = await supabase.from('site_pages').insert({
      slug: page.slug,
      title: page.title,
      page_type: page.type,
      migration_status: 'live',
      review_status: 'pending',
      migration_priority: 10,
    } as never)
    if (error) {
      console.error(`  FAIL: ${page.slug} -- ${error.message}`)
    } else {
      console.log(`  OK: ${page.slug}`)
      success++
    }
  }
  
  const { count } = await supabase.from('site_pages').select('*', { count: 'exact', head: true })
  console.log(`\nInserted: ${success} | Total site_pages: ${count}`)
}

main().catch(console.error)
