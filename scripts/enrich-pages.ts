/**
 * enrich-pages.ts
 *
 * Content enrichment script that:
 * 1. Replaces GALLERY_IMAGES arrays with correct project-type images from DB
 * 2. Scrapes WordPress pages and extracts meaningful text content
 * 3. Inserts new content sections before FinalCTATemplate
 * 4. Updates database tracking fields
 *
 * Usage: npx tsx scripts/enrich-pages.ts [--batch 1] [--dry-run]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: path.resolve(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const WP_BASE = 'https://mosquitocurtains.com'
const SRC_DIR = path.resolve(__dirname, '..', 'src', 'app')

// ─── Page definitions by batch ──────────────────────────────────────────────

interface PageDef {
  slug: string
  projectTypes: string[]
  galleryLabel?: string
  wpSlug?: string // if different from slug
}

const BATCH_1: PageDef[] = [
  // Homepage handled separately (no GALLERY_IMAGES, already rich)
  { slug: 'screened-porch', projectTypes: ['porch'], galleryLabel: 'Client Installed Projects' },
  { slug: 'screen-patio', projectTypes: ['patio'], galleryLabel: 'Client Installed Projects' },
  { slug: 'gazebo-screen-curtains', projectTypes: ['gazebo'], galleryLabel: 'Client Installed Projects' },
  { slug: 'pergola-screen-curtains', projectTypes: ['pergola'], galleryLabel: 'Client Installed Projects' },
]

const BATCH_2: PageDef[] = [
  { slug: 'garage-door-screens', projectTypes: ['garage'], galleryLabel: 'Client Installed Projects' },
  { slug: 'boat-screens', projectTypes: ['boat'], galleryLabel: 'Client Installed Projects' },
  { slug: 'french-door-screens', projectTypes: ['porch', 'patio'], galleryLabel: 'Client Installed Projects' },
  { slug: 'awning-screen-enclosures', projectTypes: ['awning'], galleryLabel: 'Client Installed Projects' },
  { slug: 'clear-vinyl-plastic-patio-enclosures', projectTypes: ['porch', 'patio'], galleryLabel: 'Client Installed Projects' },
]

const BATCH_3: PageDef[] = [
  { slug: 'screened-in-decks', projectTypes: ['deck'], galleryLabel: 'Client Installed Projects' },
  { slug: 'weather-curtains', projectTypes: ['porch', 'patio'], galleryLabel: 'Client Installed Projects' },
  { slug: 'screened-porch-enclosures', projectTypes: ['porch'], galleryLabel: 'Client Installed Projects' },
  { slug: 'industrial-netting', projectTypes: ['industrial'], galleryLabel: 'Client Installed Projects' },
]

// Reviews page
const BATCH_REVIEWS: PageDef[] = [
  { slug: 'reviews', projectTypes: ['porch', 'patio', 'gazebo', 'pergola', 'garage'] },
]

// Support, options, install, info pages
const BATCH_4: PageDef[] = [
  { slug: 'options', projectTypes: ['porch', 'patio'] },
  { slug: 'clear-vinyl-options', projectTypes: ['porch', 'patio'] },
  { slug: 'install/velcro', projectTypes: ['porch', 'patio'] },
  { slug: 'install/tracking', projectTypes: ['porch', 'patio'] },
  { slug: 'install/clear-vinyl', projectTypes: ['porch', 'patio'] },
  { slug: 'faq/clear-vinyl', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl/diy', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl/apron-colors', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl/considerations', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl/ordering', projectTypes: ['porch', 'patio'] },
  { slug: 'options/clear-vinyl/quality', projectTypes: ['porch', 'patio'] },
]

// Plan pages
const BATCH_5: PageDef[] = [
  { slug: 'plan/overview', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/mesh-colors', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/magnetic-doorways', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/sealing-base', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/1-sided', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/2-sided', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/3-sided', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/4-sided', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/free-standing', projectTypes: ['porch', 'patio', 'gazebo'] },
  { slug: 'plan/2-sided/regular-velcro', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/2-sided/regular-tracking', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/2-sided/irregular-tracking', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/3-sided/regular-velcro', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/3-sided/regular-tracking', projectTypes: ['porch', 'patio'] },
  { slug: 'plan/3-sided/irregular-tracking', projectTypes: ['porch', 'patio'] },
]

// Info, raw-netting, SEO landing, marketing pages
const BATCH_6: PageDef[] = [
  { slug: 'raw-netting', projectTypes: ['porch', 'patio'] },
  { slug: 'raw-netting-fabric-store', projectTypes: ['porch', 'patio'] },
  { slug: 'raw-netting/shade-mesh', projectTypes: ['porch', 'patio'] },
  { slug: 'raw-netting/mosquito-net', projectTypes: ['porch', 'patio'] },
  { slug: 'raw-netting/hardware', projectTypes: ['porch', 'patio'] },
  { slug: 'raw-netting/rigging', projectTypes: ['porch', 'patio'] },
  { slug: 'contact', projectTypes: ['porch', 'patio'] },
  { slug: 'shipping', projectTypes: ['porch', 'patio'] },
  { slug: 'satisfaction-guarantee', projectTypes: ['porch', 'patio'] },
  { slug: 'about', projectTypes: ['porch', 'patio'] },
  { slug: 'contractors', projectTypes: ['porch', 'patio', 'garage'] },
  { slug: 'opportunities', projectTypes: ['porch', 'patio'] },
  { slug: 'work-with-a-planner', projectTypes: ['porch', 'patio'] },
  { slug: 'videos', projectTypes: ['porch', 'patio', 'gazebo'] },
  { slug: 'photos', projectTypes: ['porch', 'patio', 'gazebo', 'pergola'] },
  { slug: 'patio-winterize', projectTypes: ['patio'] },
  { slug: 'porch-winterize', projectTypes: ['porch'] },
  { slug: 'porch-vinyl-panels', projectTypes: ['porch'] },
  { slug: 'porch-vinyl-curtains', projectTypes: ['porch'] },
  { slug: 'insulated-curtain-panels', projectTypes: ['porch', 'patio'] },
  { slug: 'hvac-chiller-screens', projectTypes: ['industrial'] },
  { slug: 'theater-scrims', projectTypes: ['projection'] },
]

const BATCHES: Record<string, PageDef[]> = {
  '1': BATCH_1,
  '2': BATCH_2,
  '3': BATCH_3,
  'reviews': BATCH_REVIEWS,
  '4': BATCH_4,
  '5': BATCH_5,
  '6': BATCH_6,
}

// ─── Gallery image fetching ─────────────────────────────────────────────────

interface GalleryImage {
  src: string
  alt: string
}

async function fetchGalleryImages(
  projectTypes: string[],
  limit: number = 10
): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('image_url, title, description, project_type')
    .in('project_type', projectTypes)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error || !data) {
    console.error('Failed to fetch gallery images:', error)
    return []
  }

  return data.map((img) => ({
    src: img.image_url,
    alt: img.title || img.description || `${img.project_type} project photo`,
  }))
}

// ─── WordPress content scraping ─────────────────────────────────────────────

interface WPSection {
  heading?: string
  paragraphs: string[]
  listItems: string[]
}

async function scrapeWPContent(slug: string): Promise<WPSection[]> {
  const url = `${WP_BASE}/${slug}`
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MCBot/1.0)' },
      redirect: 'follow',
    })
    if (!resp.ok) {
      console.log(`  WP page returned ${resp.status} for ${slug}`)
      return []
    }
    const html = await resp.text()
    const $ = cheerio.load(html)

    // Remove boilerplate
    $('header, footer, nav, .elementor-location-header, .elementor-location-footer').remove()
    $('[class*="menu-"], [class*="nav-"], [class*="sidebar"]').remove()
    $('script, style, noscript, iframe').remove()
    // Remove CTA buttons, forms
    $('form, .elementor-button, [class*="cta"]').remove()

    const sections: WPSection[] = []
    let currentSection: WPSection = { paragraphs: [], listItems: [] }

    // Extract text widgets from Elementor
    const textWidgets = $('.elementor-widget-text-editor, .elementor-widget-heading')

    textWidgets.each((_i, el) => {
      const $el = $(el)

      // Check for headings
      const heading = $el.find('h1, h2, h3, h4').first()
      if (heading.length) {
        const headingText = heading.text().trim()
        // Skip boilerplate headings
        if (isBoilerplateHeading(headingText)) return

        // Start a new section if we have content in the current one
        if (currentSection.paragraphs.length > 0 || currentSection.listItems.length > 0) {
          sections.push(currentSection)
        }
        currentSection = { heading: headingText, paragraphs: [], listItems: [] }
        return
      }

      // Extract paragraphs
      $el.find('p').each((_j, p) => {
        const text = $(p).text().trim()
        if (text.length > 30 && !isBoilerplateText(text)) {
          currentSection.paragraphs.push(text)
        }
      })

      // Extract list items
      $el.find('li').each((_j, li) => {
        const text = $(li).text().trim()
        if (text.length > 10 && !isBoilerplateText(text)) {
          currentSection.listItems.push(text)
        }
      })
    })

    // Push last section
    if (currentSection.paragraphs.length > 0 || currentSection.listItems.length > 0) {
      sections.push(currentSection)
    }

    return sections
  } catch (err) {
    console.log(`  Failed to scrape ${slug}:`, err)
    return []
  }
}

function isBoilerplateHeading(text: string): boolean {
  const boilerplate = [
    'free instant quote',
    'start your project',
    'call us',
    'contact',
    'get started',
    'order now',
    'ready to order',
    'join our',
    'subscribe',
    'newsletter',
    'follow us',
    'connect with us',
    'free consultation',
    'request a quote',
    'get your free',
    'what our customers',
    'customer reviews',
    'testimonials',
    'latest posts',
    'recent posts',
    'blog',
    'related products',
    'related posts',
    'you may also like',
    'share this',
  ]
  const lower = text.toLowerCase()
  return boilerplate.some((b) => lower.includes(b))
}

function isBoilerplateText(text: string): boolean {
  const boilerplate = [
    'free instant quote',
    'call us today',
    'all rights reserved',
    'copyright',
    'privacy policy',
    'terms of service',
    'cookie',
    '©',
    'subscribe',
    'newsletter',
    'follow us on',
    'click here to',
    'learn more about our',
    'contact us today',
    'get started today',
    'order now',
  ]
  const lower = text.toLowerCase()
  return boilerplate.some((b) => lower.includes(b))
}

// ─── Gallery image array generation ─────────────────────────────────────────

function generateGalleryArray(images: GalleryImage[]): string {
  const entries = images
    .map(
      (img) =>
        `  { src: '${img.src}', alt: '${img.alt.replace(/'/g, "\\'")}' },`
    )
    .join('\n')
  return `const GALLERY_IMAGES = [\n${entries}\n]`
}

// ─── Content section generation ─────────────────────────────────────────────

function generateContentSection(
  section: WPSection,
  galleryImage: GalleryImage | null,
  index: number,
  sectionIcon: string
): string {
  if (!section.heading && section.paragraphs.length === 0) return ''

  const heading = section.heading || 'More Information'
  const safeHeading = heading.replace(/'/g, "\\'").replace(/"/g, '\\"')

  // Build text content
  const textParts: string[] = []
  for (const p of section.paragraphs.slice(0, 3)) {
    const safeP = p.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;')
    textParts.push(
      `              <Text className="text-gray-600">\n                ${safeP}\n              </Text>`
    )
  }

  // Add list items if any
  if (section.listItems.length > 0) {
    const listItemsJsx = section.listItems
      .slice(0, 5)
      .map((item) => {
        const safeItem = item.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;')
        return `                <ListItem variant="checked" iconColor="#406517">${safeItem}</ListItem>`
      })
      .join('\n')
    textParts.push(
      `              <BulletedList spacing="sm">\n${listItemsJsx}\n              </BulletedList>`
    )
  }

  if (textParts.length === 0) return ''

  const textContent = textParts.join('\n')

  // If we have a gallery image, create a TwoColumn layout
  if (galleryImage) {
    const safeAlt = galleryImage.alt.replace(/"/g, '\\"')
    const imageOnLeft = index % 2 === 0

    if (imageOnLeft) {
      return `        <HeaderBarSection icon={${sectionIcon}} label="${safeHeading}" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="${galleryImage.src}"
                alt="${safeAlt}"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
${textContent}
            </Stack>
          </TwoColumn>
        </HeaderBarSection>`
    } else {
      return `        <HeaderBarSection icon={${sectionIcon}} label="${safeHeading}" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
${textContent}
            </Stack>
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="${galleryImage.src}"
                alt="${safeAlt}"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>`
    }
  }

  // No gallery image - just text
  return `        <HeaderBarSection icon={${sectionIcon}} label="${safeHeading}" variant="dark">
          <Stack gap="md">
${textContent}
          </Stack>
        </HeaderBarSection>`
}

// ─── File modification ──────────────────────────────────────────────────────

function replaceGalleryImages(
  content: string,
  newImages: GalleryImage[]
): string {
  // Find and replace the GALLERY_IMAGES array
  const galleryPattern =
    /const GALLERY_IMAGES = \[[\s\S]*?\n\]/
  const match = content.match(galleryPattern)
  if (!match) {
    console.log('  No GALLERY_IMAGES array found')
    return content
  }
  return content.replace(galleryPattern, generateGalleryArray(newImages))
}

function insertContentSections(
  content: string,
  sections: string[]
): string {
  if (sections.length === 0) return content

  // Find the FinalCTATemplate and insert sections before it
  const ctaPattern = /(\s*<FinalCTATemplate\s*\/>)/
  const match = content.match(ctaPattern)
  if (!match) {
    console.log('  No FinalCTATemplate found')
    return content
  }

  const newContent = sections.join('\n\n')
  return content.replace(ctaPattern, `\n\n${newContent}\n\n$1`)
}

function ensureImports(content: string, needed: string[]): string {
  // Lucide icon names (from lucide-react)
  const lucideIcons = new Set([
    'Bug', 'Award', 'Wrench', 'Shield', 'Layers', 'Sparkle', 'Snowflake',
    'CheckCircle', 'ArrowRight', 'Camera', 'Home', 'TreePine', 'Tent',
    'Sun', 'AlertTriangle', 'Anchor', 'Factory', 'Clapperboard',
  ])

  // Design system components
  const dsComponents = new Set([
    'TwoColumn', 'HeaderBarSection', 'Frame', 'Stack', 'Grid', 'Text',
    'BulletedList', 'ListItem', 'Container', 'Card', 'Heading', 'Button',
    'YouTubeEmbed', 'FinalCTATemplate', 'WhyChooseUsTemplate', 'PowerHeaderTemplate',
  ])

  for (const imp of needed) {
    // Skip if already present anywhere in the import section
    const allImports = content.match(/import \{[^}]+\} from '[^']+'/g) || []
    const alreadyImported = allImports.some((i) => i.includes(imp))
    if (alreadyImported) continue

    if (lucideIcons.has(imp)) {
      // Add to lucide-react import
      const pattern = /(} from 'lucide-react')/
      if (content.match(pattern)) {
        content = content.replace(pattern, `  ${imp},\n$1`)
      }
    } else {
      // Add to design-system import
      const pattern = /(} from '@\/lib\/design-system')/
      if (content.match(pattern)) {
        content = content.replace(pattern, `  ${imp},\n$1`)
      }
    }
  }

  return content
}

// ─── Database tracking ──────────────────────────────────────────────────────

async function updatePageTracking(slug: string, phase: 'gallery' | 'enriched') {
  const normalizedSlug = slug === '' ? '/' : `/${slug}`

  if (phase === 'gallery') {
    // Phase 1: Gallery images fixed
    const { data: page } = await supabase
      .from('site_pages')
      .select('review_notes')
      .eq('slug', normalizedSlug)
      .single()

    const existingNotes = page?.review_notes || ''
    const newNotes = existingNotes.startsWith('Image URLs fixed.')
      ? existingNotes
      : `Image URLs fixed. ${existingNotes}`

    await supabase
      .from('site_pages')
      .update({
        review_notes: newNotes,
      })
      .eq('slug', normalizedSlug)
  } else {
    // Phase 3: Content enriched
    const now = new Date().toISOString()
    await supabase
      .from('site_pages')
      .update({
        review_status: 'complete',
        review_notes: 'Content enriched: images fixed, gallery added, WP text integrated',
        revision_items: '',
        reviewed_by: 'Site Content Audit 1',
        reviewed_at: now,
        last_audited_at: now,
      })
      .eq('slug', normalizedSlug)
  }
}

// ─── Icon mapping ───────────────────────────────────────────────────────────

function getIconForSection(heading: string): string {
  const lower = heading.toLowerCase()
  if (lower.includes('quality') || lower.includes('craft')) return 'Award'
  if (lower.includes('install') || lower.includes('diy') || lower.includes('tool')) return 'Wrench'
  if (lower.includes('shield') || lower.includes('protect') || lower.includes('guarantee') || lower.includes('durable')) return 'Shield'
  if (lower.includes('mesh') || lower.includes('fabric') || lower.includes('netting') || lower.includes('screen')) return 'Layers'
  if (lower.includes('cost') || lower.includes('price') || lower.includes('value') || lower.includes('afford')) return 'Sparkle'
  if (lower.includes('compare') || lower.includes('vs') || lower.includes('permanent')) return 'Sparkle'
  if (lower.includes('how') || lower.includes('step') || lower.includes('process')) return 'Wrench'
  if (lower.includes('benefit') || lower.includes('advantage') || lower.includes('why')) return 'CheckCircle'
  if (lower.includes('option') || lower.includes('type') || lower.includes('choose')) return 'Layers'
  if (lower.includes('winter') || lower.includes('weather') || lower.includes('cold') || lower.includes('vinyl')) return 'Snowflake'
  return 'Bug'
}

function getIconImportsNeeded(sections: WPSection[]): string[] {
  const icons = new Set<string>()
  for (const s of sections) {
    if (s.heading) {
      icons.add(getIconForSection(s.heading))
    }
  }
  return Array.from(icons)
}

// ─── Main processing ────────────────────────────────────────────────────────

async function processPage(pageDef: PageDef, dryRun: boolean) {
  const filePath = path.join(SRC_DIR, pageDef.slug, 'page.tsx')
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${filePath} does not exist`)
    return
  }

  console.log(`\n--- Processing: ${pageDef.slug} ---`)

  // 1. Read the current file
  let content = fs.readFileSync(filePath, 'utf-8')
  console.log(`  Read ${content.split('\n').length} lines`)

  // 2. Fetch correct gallery images from DB
  const galleryImages = await fetchGalleryImages(pageDef.projectTypes, 10)
  console.log(`  Fetched ${galleryImages.length} gallery images for [${pageDef.projectTypes.join(', ')}]`)

  // 3. Replace GALLERY_IMAGES array
  if (galleryImages.length > 0) {
    const before = content
    content = replaceGalleryImages(content, galleryImages)
    if (content !== before) {
      console.log(`  Replaced GALLERY_IMAGES with ${galleryImages.length} images`)
    }
  }

  // 4. Scrape WordPress for additional text
  const wpSlug = pageDef.wpSlug || pageDef.slug
  const wpSections = await scrapeWPContent(wpSlug)
  console.log(`  Scraped ${wpSections.length} WP sections`)

  // 5. Filter WP sections to only those with meaningful NEW content
  // Skip sections whose headings already exist in the page
  const newSections = wpSections.filter((s) => {
    if (!s.heading) return s.paragraphs.length > 0
    // Skip if heading text already appears in the file
    const headingLower = s.heading.toLowerCase()
    return !content.toLowerCase().includes(headingLower)
  })
  console.log(`  ${newSections.length} new sections (not already on page)`)

  // 6. Generate content sections (limit to 3 to avoid bloat)
  const sectionsToAdd = newSections.slice(0, 3)
  const sectionJsx: string[] = []

  // Get extra gallery images for pairing with text sections
  const extraImages = await fetchGalleryImages(pageDef.projectTypes, 15)
  const pairedImages = extraImages.slice(10) // Use images 11-15 for text sections

  for (let i = 0; i < sectionsToAdd.length; i++) {
    const section = sectionsToAdd[i]
    const icon = getIconForSection(section.heading || '')
    const pairedImage = pairedImages[i] || null
    const jsx = generateContentSection(section, pairedImage, i, icon)
    if (jsx) {
      sectionJsx.push(jsx)
    }
  }

  if (sectionJsx.length > 0) {
    console.log(`  Generated ${sectionJsx.length} new content sections`)

    // Ensure icon imports
    const iconsNeeded = getIconImportsNeeded(sectionsToAdd)
    content = ensureImports(content, iconsNeeded)

    // Also ensure BulletedList/ListItem are imported if sections have list items
    const hasLists = sectionsToAdd.some((s) => s.listItems.length > 0)
    if (hasLists) {
      content = ensureImports(content, ['BulletedList', 'ListItem'])
    }

    // Insert sections before FinalCTATemplate
    content = insertContentSections(content, sectionJsx)
  }

  // 7. Write the file
  if (!dryRun) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`  WRITTEN: ${filePath}`)

    // 8. Update database tracking
    await updatePageTracking(pageDef.slug, 'enriched')
    console.log(`  DB: Updated tracking for /${pageDef.slug}`)
  } else {
    console.log(`  [DRY RUN] Would write ${content.split('\n').length} lines`)
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const batchArg = process.argv.find((a) => a.startsWith('--batch'))
  const batchNum =
    process.argv[process.argv.indexOf('--batch') + 1] || '1'
  const singlePage = process.argv.find(
    (a) => a.startsWith('--page=')
  )

  console.log(`\n=== Content Enrichment Script ===`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)

  if (singlePage) {
    const slug = singlePage.replace('--page=', '')
    const allPages = [...BATCH_1, ...BATCH_2, ...BATCH_3]
    const pageDef = allPages.find((p) => p.slug === slug)
    if (!pageDef) {
      console.error(`Page ${slug} not found in definitions`)
      process.exit(1)
    }
    await processPage(pageDef, dryRun)
  } else {
    const pages = BATCHES[batchNum]
    if (!pages) {
      console.error(`Batch ${batchNum} not found. Available: ${Object.keys(BATCHES).join(', ')}`)
      process.exit(1)
    }

    console.log(`Batch ${batchNum}: ${pages.length} pages\n`)

    for (const pageDef of pages) {
      await processPage(pageDef, dryRun)
    }
  }

  console.log(`\n=== Done ===\n`)
}

main().catch(console.error)
