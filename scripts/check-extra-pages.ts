import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '..', '.env.local') })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// All 205 paths from admin sitemap (non-dynamic)
const ADMIN_SITEMAP_SLUGS = new Set([
  '/','/about','/our-story','/products','/applications',
  '/screened-porch-enclosures','/mosquito-netting','/no-see-um-netting-screen','/shade-screen-mesh','/industrial-mesh','/industrial-netting','/theatre-scrim','/theater-scrims','/roll-up-shade-screens','/heavy-track','/camping-net','/outdoor-projection-screens','/pollen-protection','/tent-screens','/weather-curtains','/insulated-curtain-panels',
  '/clear-vinyl-plastic-patio-enclosures','/ordering-clear-vinyl','/porch-vinyl-curtains','/porch-vinyl-panels',
  '/raw-netting','/raw-netting-fabric-store','/raw-netting/mosquito-net','/raw-netting/no-see-um','/raw-netting/shade-mesh','/raw-netting/industrial','/raw-netting/scrim','/raw-netting/custom','/raw-netting/hardware','/raw-netting/rigging','/raw-netting/why-us',
  '/screened-porch','/screen-patio','/screened-in-decks','/garage-door-screens','/pergola-screen-curtains','/gazebo-screen-curtains','/yardistry-gazebo-curtains','/awning-screen-enclosures','/french-door-screens','/boat-screens','/hvac-chiller-screens','/porch-winterize','/patio-winterize',
  '/options','/options/clear-vinyl','/options/clear-vinyl/quality','/options/clear-vinyl/ordering','/options/clear-vinyl/considerations','/options/clear-vinyl/diy','/options/clear-vinyl/apron-colors','/clear-vinyl-options',
  '/order','/order/mosquito-curtains','/order/clear-vinyl','/order/raw-netting','/order/roll-up-shades','/order/track-hardware','/order/attachments','/order/raw-netting-attachments','/order-mesh-panels','/order-mesh-netting-fabrics','/order-attachments','/order-raw-netting-attachment-hardware','/order-tracking',
  '/start-project','/mosquito-curtains-instant-quote','/clear-vinyl-instant-quote','/quote/mosquito-curtains','/quote/clear-vinyl','/work-with-a-planner',
  '/plan','/plan/overview','/plan/how-to-order','/plan/tracking','/plan/mesh-colors','/plan/magnetic-doorways','/plan/sealing-base','/plan/free-standing','/plan/tents-awnings','/plan/1-sided','/plan/2-sided','/plan/2-sided/regular-tracking','/plan/2-sided/regular-velcro','/plan/2-sided/irregular-tracking','/plan/2-sided/irregular-velcro','/plan/3-sided','/plan/3-sided/regular-tracking','/plan/3-sided/regular-velcro','/plan/3-sided/irregular-tracking','/plan/3-sided/irregular-velcro','/plan/4-sided','/plan/4-sided/regular-tracking','/plan/4-sided/regular-velcro','/plan/4-sided/irregular-tracking','/plan/4-sided/irregular-velcro',
  '/install','/install/tracking','/install/velcro','/install/clear-vinyl',
  '/care/mosquito-curtains','/care/clear-vinyl',
  '/faq','/faq/mosquito-curtains','/faq/clear-vinyl',
  '/contact','/shipping','/returns','/satisfaction-guarantee','/reviews','/professionals','/contractors','/opportunities','/privacy-policy',
  '/gallery','/gallery/featured','/gallery/porch-projects','/gallery/clear-vinyl','/gallery/mosquito-netting','/gallery/white-netting','/gallery/black-netting','/photos','/videos','/projects',
  '/blog','/blog/history-of-mosquitoes','/blog/mosquito-capitol-of-america','/blog/mosquito-enclosures-for-decks','/blog/gazebos-then-and-now','/blog/porch-too-beautiful-to-screen','/blog/pollen-and-porches','/blog/northern-mosquitoes','/blog/storm-proof-screening','/blog/west-nile-virus-effects','/blog/mosquito-protection-summary','/blog/bond-sales-story','/blog/kids-project','/blog/dear-martha-stewart','/blog/work-is-good','/blog/mulligan-blocker','/blog/airlines-screen-doors','/blog/outdoor-projection-screens',
  '/sale',
  '/fb','/fb/mc-quote','/fb/cv-quote','/reddit','/reddit/mc-quote',
  '/cart','/checkout','/my-orders','/my-projects','/uploads','/experiment',
  '/admin','/admin/sitemap','/admin/pricing','/admin/sales','/admin/mc-sales','/admin/mc-sales/analytics','/admin/mc-sales/analytics/ads','/admin/mc-sales/analytics/leads','/admin/mc-sales/analytics/waterfall','/admin/cv-sales','/admin/rn-sales','/admin/ru-sales','/admin/audit','/admin/customers','/admin/analytics','/admin/export','/admin/gallery','/admin/galleries','/admin/notifications','/admin/notifications/templates','/admin/shipping-tax',
  '/design-system','/design-system/button','/design-system/card','/design-system/container','/design-system/grid','/design-system/stack','/design-system/heading','/design-system/text','/design-system/input','/design-system/frame','/design-system/two-column','/design-system/bulleted-list','/design-system/gradient-section','/design-system/header-bar-section','/design-system/cta-section','/design-system/feature-card','/design-system/youtube-embed','/design-system/power-header-template','/design-system/final-cta-template','/design-system/why-choose-us-template',
])

async function main() {
  const { data } = await supabase.from('site_pages').select('slug, title').order('slug')
  const dbSlugs = (data || []).map((r: any) => r.slug as string)
  
  const extras = dbSlugs.filter(s => !ADMIN_SITEMAP_SLUGS.has(s))
  console.log(`DB has ${dbSlugs.length} pages, admin sitemap has ${ADMIN_SITEMAP_SLUGS.size}`)
  console.log(`\n${extras.length} pages in DB but NOT in admin sitemap:`)
  for (const s of extras) {
    const row = data!.find((r: any) => r.slug === s)
    console.log(`  ${s} -- "${(row as any).title}"`)
  }
}
main().catch(console.error)
