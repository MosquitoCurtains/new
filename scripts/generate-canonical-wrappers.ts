/**
 * Generate canonical wrapper page.tsx and layout.tsx files for BUILD pages
 * where the content already exists at a different URL on the new site.
 *
 * Each wrapper:
 *   - page.tsx: re-exports the default component from the canonical page
 *   - layout.tsx: sets alternates.canonical metadata + wraps children
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname, relative } from 'path'

const APP_DIR = resolve(__dirname, '..', 'src', 'app')

// [wpSlug, canonicalSlug, title]
const WRAPPERS: [string, string, string][] = [
  // Plan section (24)
  ['/plan-screen-porch', '/plan', 'Plan Screen Porch'],
  ['/plan-screen-porch/magnetic-doorways', '/plan/magnetic-doorways', 'Magnetic Doorways'],
  ['/plan-screen-porch/mesh-and-colors', '/plan/mesh-colors', 'Mesh and Colors'],
  ['/plan-screen-porch/outdoor-curtain-tracking', '/plan/tracking', 'Outdoor Curtain Tracking'],
  ['/plan-screen-porch/how-to-order', '/plan/how-to-order', 'How To Order'],
  ['/plan-screen-porch/sealing-the-base', '/plan/sealing-base', 'Sealing The Base'],
  ['/plan-screen-porch/free-standing', '/plan/free-standing', 'Free Standing'],
  ['/plan-screen-porch/tents-and-awnings', '/plan/tents-awnings', 'Tents and Awnings'],
  ['/plan-screen-porch/single-sided-exposure', '/plan/1-sided', 'Single Sided Exposure'],
  ['/plan-screen-porch/2-sided-exposure', '/plan/2-sided', '2 Sided Exposure'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-tracking', '/plan/2-sided/regular-tracking', '2-Sided Regular Tracking'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-velcro', '/plan/2-sided/regular-velcro', '2-Sided Regular Velcro'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', '/plan/2-sided/irregular-tracking', '2-Sided Irregular Tracking'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', '/plan/2-sided/irregular-velcro', '2-Sided Irregular Velcro'],
  ['/plan-screen-porch/3-sided-exposure', '/plan/3-sided', '3 Sided Exposure'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-tracking', '/plan/3-sided/regular-tracking', '3-Sided Regular Tracking'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-velcro', '/plan/3-sided/regular-velcro', '3-Sided Regular Velcro'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', '/plan/3-sided/irregular-tracking', '3-Sided Irregular Tracking'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', '/plan/3-sided/irregular-velcro', '3-Sided Irregular Velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure', '/plan/4-sided', '4+ Sided Exposure'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', '/plan/4-sided/regular-tracking', '4-Sided Regular Tracking'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', '/plan/4-sided/regular-velcro', '4-Sided Regular Velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', '/plan/4-sided/irregular-velcro', '4-Sided Irregular Velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', '/plan/4-sided/irregular-tracking', '4-Sided Irregular Tracking (Wrap-Around)'],

  // Care / FAQ / Install / Reviews (10)
  ['/caring-for-clear-vinyl', '/care/clear-vinyl', 'Caring For Clear Vinyl'],
  ['/caring-for-mosquito-curtains', '/care/mosquito-curtains', 'Caring For Mosquito Curtains'],
  ['/clear-vinyl-faq', '/faq/clear-vinyl', 'Clear Vinyl FAQ'],
  ['/faqs', '/faq', 'FAQs'],
  ['/mosquito-curtains-faq', '/faq/mosquito-curtains', 'Mosquito Curtains FAQ'],
  ['/mosquito-curtains-reviews', '/reviews', 'Mosquito Curtains Reviews'],
  ['/mosquito-curtains-tracking-installation', '/install/tracking', 'Tracking Installation'],
  ['/mosquito-curtains-velcro-installation', '/install/velcro', 'Velcro Installation'],
  ['/clear-vinyl-installation', '/install/clear-vinyl', 'Clear Vinyl Installation'],
  ['/how-to-order', '/plan/how-to-order', 'How To Order'],

  // Raw Netting (5)
  ['/mosquito-net', '/raw-netting/mosquito-net', 'Mosquito Net'],
  ['/mosquito-netting/all-netting-and-attachment-hardware', '/raw-netting/hardware', 'Netting Attachment Hardware'],
  ['/mosquito-netting/fasteners-and-rigging-ideas', '/raw-netting/rigging', 'Fasteners and Rigging Ideas'],
  ['/mosquito-netting/why-us-for-raw-netting', '/raw-netting/why-us', 'Why Us For Raw Netting'],
  ['/mosquito-netting/let-us-make-it-for-you', '/raw-netting/custom', 'Custom Netting'],

  // Clear Vinyl Options (4)
  ['/apron-colors-to-choose-from', '/options/clear-vinyl/apron-colors', 'Apron Colors'],
  ['/clear-vinyl-self-installation-advantages', '/options/clear-vinyl/diy', 'CV Self-Installation Advantages'],
  ['/what-can-go-wrong-with-clear-vinyl', '/options/clear-vinyl/considerations', 'What Can Go Wrong With Clear Vinyl'],
  ['/what-makes-our-clear-vinyl-product-better', '/options/clear-vinyl/quality', 'What Makes Our Clear Vinyl Better'],

  // Other (7)
  ['/tentscreenpanels', '/tent-screens', 'Tent Screen Panels'],
  ['/contractor', '/contractors', 'Contractor'],
  ['/client-uploads', '/uploads', 'Client Uploads'],
  ['/order-mosquito-curtains', '/order/mosquito-curtains', 'Order Mosquito Curtains'],
  ['/my-account', '/my-orders', 'My Account'],
  ['/project-series', '/projects', 'Project Series'],
  ['/project-planning', '/plan', 'Project Planning'],
]

function slugToDir(slug: string): string {
  return slug.replace(/^\//, '')
}

function computeRelativeImport(fromSlug: string, toSlug: string): string {
  const fromDir = resolve(APP_DIR, slugToDir(fromSlug))
  const toPageDir = resolve(APP_DIR, slugToDir(toSlug))
  let rel = relative(fromDir, toPageDir)
  if (!rel.startsWith('.')) rel = './' + rel
  // Use forward slashes
  rel = rel.replace(/\\/g, '/')
  return rel + '/page'
}

let created = 0
let skipped = 0

for (const [wpSlug, canonicalSlug, title] of WRAPPERS) {
  const wpDir = resolve(APP_DIR, slugToDir(wpSlug))
  const pageFile = resolve(wpDir, 'page.tsx')
  const layoutFile = resolve(wpDir, 'layout.tsx')

  // Check if canonical page actually exists
  const canonicalPage = resolve(APP_DIR, slugToDir(canonicalSlug), 'page.tsx')
  if (!existsSync(canonicalPage)) {
    console.error(`  SKIP: ${wpSlug} -- canonical ${canonicalSlug}/page.tsx does NOT exist!`)
    skipped++
    continue
  }

  // Create directory
  mkdirSync(wpDir, { recursive: true })

  // Check if page.tsx already exists (don't overwrite)
  if (existsSync(pageFile)) {
    console.log(`  EXISTS: ${wpSlug}/page.tsx -- skipping (already has content)`)
    skipped++
    continue
  }

  // Compute relative import path
  const importPath = computeRelativeImport(wpSlug, canonicalSlug)

  // Write page.tsx -- re-export default from canonical
  const pageContent = `// Canonical wrapper: serves same content as ${canonicalSlug}
// Old WordPress URL preserved for SEO continuity
export { default } from '${importPath}'
`
  writeFileSync(pageFile, pageContent)

  // Write layout.tsx with canonical meta
  const layoutContent = `import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '${canonicalSlug}',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
`
  // Only write layout if it doesn't exist
  if (!existsSync(layoutFile)) {
    writeFileSync(layoutFile, layoutContent)
  }

  console.log(`  OK: ${wpSlug} -> canonical ${canonicalSlug}`)
  created++
}

console.log(`\nDone! Created: ${created} | Skipped: ${skipped}`)
