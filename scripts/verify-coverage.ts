/**
 * Final verification: ensure all BUILD pages have page.tsx files
 */
import { existsSync } from 'fs'
import { resolve } from 'path'

const APP_DIR = resolve(__dirname, '..', 'src', 'app')

// All 115 BUILD pages from CSV (116 minus 1 skip)
const BUILD_SLUGS = [
  '/', '/about', '/awning-screen-enclosures', '/boat-screens', '/blog',
  '/camping-net', '/cart', '/checkout', '/clear-vinyl-instant-quote',
  '/clear-vinyl-options', '/clear-vinyl-plastic-patio-enclosures', '/contact',
  '/french-door-screens', '/garage-door-screens', '/gazebo-screen-curtains',
  '/heavy-track', '/hvac-chiller-screens', '/industrial-mesh', '/industrial-netting',
  '/install', '/insulated-curtain-panels', '/mosquito-curtains-instant-quote',
  '/mosquito-netting', '/no-see-um-netting-screen', '/opportunities', '/options',
  '/order-attachments', '/order-mesh-netting-fabrics', '/order-mesh-panels',
  '/order-raw-netting-attachment-hardware', '/order-tracking', '/ordering-clear-vinyl',
  '/outdoor-projection-screens', '/patio-winterize', '/pergola-screen-curtains',
  '/photos', '/pollen-protection', '/porch-vinyl-curtains', '/porch-vinyl-panels',
  '/porch-winterize', '/privacy-policy', '/products', '/professionals',
  '/raw-netting-fabric-store', '/returns', '/roll-up-shade-screens', '/sale',
  '/satisfaction-guarantee', '/screen-patio', '/screened-in-decks', '/screened-porch',
  '/screened-porch-enclosures', '/shade-screen-mesh', '/shipping', '/tent-screens',
  '/theater-scrims', '/theatre-scrim', '/videos', '/weather-curtains',
  '/work-with-a-planner', '/yardistry-gazebo-curtains',
  // Canonical wrappers
  '/plan-screen-porch', '/plan-screen-porch/magnetic-doorways',
  '/plan-screen-porch/mesh-and-colors', '/plan-screen-porch/outdoor-curtain-tracking',
  '/plan-screen-porch/how-to-order', '/plan-screen-porch/sealing-the-base',
  '/plan-screen-porch/free-standing', '/plan-screen-porch/tents-and-awnings',
  '/plan-screen-porch/single-sided-exposure', '/plan-screen-porch/2-sided-exposure',
  '/plan-screen-porch/2-sided-exposure/regular-columns-tracking',
  '/plan-screen-porch/2-sided-exposure/regular-columns-velcro',
  '/plan-screen-porch/2-sided-exposure/irregular-columns-tracking',
  '/plan-screen-porch/2-sided-exposure/irregular-columns-velcro',
  '/plan-screen-porch/3-sided-exposure',
  '/plan-screen-porch/3-sided-exposure/regular-columns-tracking',
  '/plan-screen-porch/3-sided-exposure/regular-columns-velcro',
  '/plan-screen-porch/3-sided-exposure/irregular-columns-tracking',
  '/plan-screen-porch/3-sided-exposure/irregular-columns-velcro',
  '/plan-screen-porch/4-plus-sided-exposure',
  '/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking',
  '/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro',
  '/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro',
  '/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment',
  '/caring-for-clear-vinyl', '/caring-for-mosquito-curtains',
  '/clear-vinyl-faq', '/faqs', '/mosquito-curtains-faq',
  '/mosquito-curtains-reviews', '/mosquito-curtains-tracking-installation',
  '/mosquito-curtains-velcro-installation', '/clear-vinyl-installation',
  '/how-to-order', '/mosquito-net',
  '/mosquito-netting/all-netting-and-attachment-hardware',
  '/mosquito-netting/fasteners-and-rigging-ideas',
  '/mosquito-netting/why-us-for-raw-netting',
  '/mosquito-netting/let-us-make-it-for-you',
  '/apron-colors-to-choose-from', '/clear-vinyl-self-installation-advantages',
  '/what-can-go-wrong-with-clear-vinyl', '/what-makes-our-clear-vinyl-product-better',
  '/tentscreenpanels', '/contractor', '/client-uploads',
  '/order-mosquito-curtains', '/my-account', '/project-series',
  '/project-planning',
  // Fresh builds
  '/mosquito-curtain-planning-session', '/clear-vinyl-planning-session',
  '/project-series/clear-vinyl-project-87444', '/404-error-page',
  '/form-entry', '/prepare',
]

function slugToDir(slug: string): string {
  if (slug === '/') return ''
  return slug.replace(/^\//, '')
}

let ok = 0
let missing = 0
for (const slug of BUILD_SLUGS) {
  const dir = slugToDir(slug)
  const pagePath = resolve(APP_DIR, dir, 'page.tsx')
  if (existsSync(pagePath)) {
    ok++
  } else {
    console.error(`MISSING: ${slug} (expected ${dir}/page.tsx)`)
    missing++
  }
}

console.log(`\n=== BUILD PAGE VERIFICATION ===`)
console.log(`Total BUILD pages: ${BUILD_SLUGS.length}`)
console.log(`Found: ${ok}`)
console.log(`Missing: ${missing}`)
console.log(`Status: ${missing === 0 ? 'ALL GOOD' : 'ISSUES FOUND'}`)

// Count redirect entries
import { REDIRECTS } from '../src/lib/redirects'
console.log(`\n=== REDIRECT VERIFICATION ===`)
console.log(`Total redirects configured: ${REDIRECTS.length}`)
