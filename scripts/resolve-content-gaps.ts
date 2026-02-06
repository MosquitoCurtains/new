/**
 * Content Gap Auto-Resolver
 * 
 * For each `needs_revision` page in site_pages, reads revision_items,
 * re-fetches WordPress HTML, extracts missing content (images, text, headings),
 * and writes it directly into the page.tsx file as design-system JSX.
 * 
 * Image strategy:
 *   - Images on static.mosquitocurtains.com -> reference directly (already on S3)
 *   - Images on other WP domains -> download + upload to S3 bucket mosquito-curtains
 *   - Gallery images (sliders, customer installs) -> Grid + Frame gallery sections
 *   - Inline images (product shots, diagrams) -> TwoColumn with paired text
 * 
 * Text strategy:
 *   - Re-fetch WP HTML and extract text per section (keyed to headings)
 *   - Format into design system JSX (HeaderBarSection + Stack + Text + BulletedList)
 *   - Preserve original WP wording
 *   - Insert in logical order matching WP page structure
 * 
 * Usage:
 *   npx tsx scripts/resolve-content-gaps.ts                    # All needs_revision pages
 *   npx tsx scripts/resolve-content-gaps.ts --dry-run           # Preview without writing
 *   npx tsx scripts/resolve-content-gaps.ts --slugs /screen-patio,/about
 *   npx tsx scripts/resolve-content-gaps.ts --images-only       # Only fix image gaps
 *   npx tsx scripts/resolve-content-gaps.ts --text-only         # Only fix text gaps
 * 
 * Requires: .env.local with Supabase + AWS S3 credentials
 */

import { config } from 'dotenv'
import { resolve, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PROJECT_ROOT = resolve(__dirname, '..')
const WP_BASE = 'https://www.mosquitocurtains.com'

const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME!
const S3_REGION = process.env.AWS_REGION!
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL! // https://media.mosquitocurtains.com

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const IMAGES_ONLY = args.includes('--images-only')
const TEXT_ONLY = args.includes('--text-only')
const slugsIdx = args.indexOf('--slugs')
const FILTER_SLUGS: string[] | null = slugsIdx >= 0
  ? args[slugsIdx + 1].split(',').map((s) => s.trim())
  : null

// ---------------------------------------------------------------------------
// Template patterns (same as audit-content.ts)
// ---------------------------------------------------------------------------

const TEMPLATE_IMAGE_PATTERNS = [
  'MC-Logo', 'Mosquito-Netting-Curtains-Logo', 'favicon',
  'WFSB-logo', 'NBC-logo', 'FOX-logo', 'ABC-logo', 'CBS-logo',
  'google-reviews', 'Google-Rating', 'BBB-Rating',
  'Google-Verified', 'Thumbtack-Top-Pro', 'Authorize-Net',
  'bbb-logo', 'angies-list', 'homeadvisor',
  'Custom-Kit-Planner', 'Custom-Kits-', 'clickcease',
  'woocommerce-placeholder', 'default-img',
  'wp-emoji', 'gravatar', 'pixel',
]

const TEMPLATE_HEADINGS = new Set([
  'custom kits',
  'free custom kits planner',
  'as seen on tv',
  'as seen on',
  'ready to get started?',
  'get started today',
  'need help?',
  'what our customers say',
  'customer reviews',
  'why choose us',
  'contact us',
  'get a free quote',
  'request a free estimate',
])

// ---------------------------------------------------------------------------
// WP Content Extraction (text-by-section)
// ---------------------------------------------------------------------------

interface WPSection {
  heading: string
  headingLevel: number
  text: string
  images: { src: string; alt: string }[]
  listItems: string[]
  isSlider: boolean
}

async function fetchAndExtractWPSections(wpUrl: string): Promise<WPSection[]> {
  try {
    const resp = await fetch(wpUrl, {
      headers: { 'User-Agent': 'MosquitoCurtains-ContentResolver/1.0' },
      signal: AbortSignal.timeout(20000),
    })
    if (!resp.ok) return []
    const html = await resp.text()
    const $ = cheerio.load(html)

    // Remove non-content elements (be careful not to remove Elementor section headers)
    $('script, style, noscript, #wpadminbar, nav').remove()
    $('.elementor-location-footer').remove()
    $('.elementor-location-header').remove()
    $('footer').remove()

    const sections: WPSection[] = []
    let currentHeading = '(intro)'
    let currentLevel = 2
    let currentTexts: string[] = []
    let currentImages: { src: string; alt: string }[] = []
    let currentListItems: string[] = []
    let isSlider = false

    // Walk through Elementor sections in order
    const contentElements = $(
      '.elementor-widget-heading, .elementor-widget-text-editor, ' +
      '.elementor-widget-toggle, .elementor-widget-image, ' +
      '.elementor-widget-image-carousel, .elementor-widget-slides, ' +
      '.elementor-widget-icon-box, .elementor-widget-icon-list'
    )

    contentElements.each((_, el) => {
      const $el = $(el)

      if ($el.hasClass('elementor-widget-heading')) {
        // Flush previous section
        if (currentTexts.length > 0 || currentImages.length > 0) {
          const heading = currentHeading.toLowerCase()
          if (!TEMPLATE_HEADINGS.has(heading)) {
            sections.push({
              heading: currentHeading,
              headingLevel: currentLevel,
              text: currentTexts.join('\n\n').trim(),
              images: [...currentImages],
              listItems: [...currentListItems],
              isSlider,
            })
          }
        }

        currentHeading = $el.text().replace(/\u200B/g, '').trim()
        const hTag = $el.find('h1, h2, h3, h4, h5, h6').first()
        currentLevel = hTag.length ? parseInt(hTag.prop('tagName')?.replace('H', '') || '2') : 2
        currentTexts = []
        currentImages = []
        currentListItems = []
        isSlider = false
      } else if (
        $el.hasClass('elementor-widget-image-carousel') ||
        $el.hasClass('elementor-widget-slides')
      ) {
        isSlider = true
        $el.find('img').each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src') || ''
          const alt = $(img).attr('alt') || ''
          if (src && !src.startsWith('data:') && !isTemplateImage(src)) {
            currentImages.push({ src, alt })
          }
        })
      } else if ($el.hasClass('elementor-widget-image')) {
        $el.find('img').each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src') || ''
          const alt = $(img).attr('alt') || ''
          if (src && !src.startsWith('data:') && !isTemplateImage(src)) {
            currentImages.push({ src, alt })
          }
        })
      } else if ($el.hasClass('elementor-widget-icon-list')) {
        $el.find('li .elementor-icon-list-text').each((_, li) => {
          const text = $(li).text().trim()
          if (text) currentListItems.push(text)
        })
      } else if ($el.hasClass('elementor-widget-icon-box')) {
        const text = $el.find('.elementor-icon-box-content').text().replace(/\u200B/g, '').trim()
        if (text) currentTexts.push(text)
      } else {
        // Text editor or toggle
        const container = $el.find('.elementor-widget-container, .elementor-tab-content')
        container.each((_, c) => {
          // Extract list items
          $(c).find('li').each((_, li) => {
            const t = $(li).text().trim()
            if (t) currentListItems.push(t)
          })

          // Extract paragraph text (excluding lists already captured)
          $(c).find('li').remove()
          const text = $(c).text().replace(/\u200B/g, '').trim()
          if (text) currentTexts.push(text)
        })
      }
    })

    // Flush final section
    if (currentTexts.length > 0 || currentImages.length > 0) {
      const heading = currentHeading.toLowerCase()
      if (!TEMPLATE_HEADINGS.has(heading)) {
        sections.push({
          heading: currentHeading,
          headingLevel: currentLevel,
          text: currentTexts.join('\n\n').trim(),
          images: [...currentImages],
          listItems: [...currentListItems],
          isSlider,
        })
      }
    }

    return sections
  } catch (err) {
    console.error(`  Failed to fetch ${wpUrl}:`, err)
    return []
  }
}

function isTemplateImage(src: string): boolean {
  return TEMPLATE_IMAGE_PATTERNS.some((p) => src.includes(p))
}

// ---------------------------------------------------------------------------
// S3 Image Migration
// ---------------------------------------------------------------------------

async function migrateImageToS3(wpImageUrl: string): Promise<string> {
  // If already on static.mosquitocurtains.com, return as-is
  if (wpImageUrl.includes('static.mosquitocurtains.com')) {
    return wpImageUrl
  }

  // If already on media.mosquitocurtains.com, return as-is
  if (wpImageUrl.includes('media.mosquitocurtains.com')) {
    return wpImageUrl
  }

  // Extract filename from URL
  const urlObj = new URL(wpImageUrl)
  const pathParts = urlObj.pathname.split('/')
  const filename = pathParts[pathParts.length - 1]
  const s3Key = `wp-migrated/${filename}`
  const cloudFrontUrl = `${CLOUDFRONT_URL}/${s3Key}`

  // Check if already uploaded
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }))
    return cloudFrontUrl // Already exists
  } catch {
    // Not found, need to upload
  }

  try {
    // Download image
    const response = await fetch(wpImageUrl, {
      headers: { 'User-Agent': 'MosquitoCurtains-ImageMigrator/1.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!response.ok) {
      console.error(`  Failed to download ${wpImageUrl}: ${response.status}`)
      return wpImageUrl // Fallback to original
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    // Determine content type
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    }
    const contentType = contentTypeMap[ext] || 'image/jpeg'

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      })
    )

    console.log(`    Migrated: ${filename} -> ${cloudFrontUrl}`)
    return cloudFrontUrl
  } catch (err) {
    console.error(`  S3 upload failed for ${wpImageUrl}:`, err)
    return wpImageUrl // Fallback
  }
}

// ---------------------------------------------------------------------------
// Parse revision_items to understand what's missing
// ---------------------------------------------------------------------------

interface ParsedGaps {
  missingImages: { src: string; alt: string }[]
  wordCountGap: number // percentage gap (e.g. 52 = local has 48% of WP content)
  missingHeadings: string[]
  extraVideos: string[]
}

function parseRevisionItems(revisionItems: string): ParsedGaps {
  const gaps: ParsedGaps = {
    missingImages: [],
    wordCountGap: 0,
    missingHeadings: [],
    extraVideos: [],
  }

  if (!revisionItems) return gaps

  const lines = revisionItems.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('- MISSING IMAGE:')) {
      const urlMatch = trimmed.match(/MISSING IMAGE:\s*(https?:\/\/\S+)/)
      const altMatch = trimmed.match(/\(alt:\s*"([^"]+)"\)/)
      if (urlMatch) {
        gaps.missingImages.push({
          src: urlMatch[1],
          alt: altMatch ? altMatch[1] : '',
        })
      }
    } else if (trimmed.startsWith('- WORD COUNT GAP:') || trimmed.includes('word count gap')) {
      const pctMatch = trimmed.match(/(\d+)%/)
      if (pctMatch) gaps.wordCountGap = parseInt(pctMatch[1], 10)
    } else if (trimmed.startsWith('- MISSING HEADING:')) {
      const headingMatch = trimmed.match(/MISSING HEADING:\s*(.+)/)
      if (headingMatch) gaps.missingHeadings.push(headingMatch[1].trim())
    } else if (trimmed.includes('extra/wrong video')) {
      // Note but don't auto-fix video issues
    }
  }

  return gaps
}

// ---------------------------------------------------------------------------
// Classify images: gallery vs inline
// ---------------------------------------------------------------------------

function classifyImages(images: { src: string; alt: string }[]): {
  gallery: { src: string; alt: string }[]
  inline: { src: string; alt: string }[]
} {
  const gallery: { src: string; alt: string }[] = []
  const inline: { src: string; alt: string }[] = []

  for (const img of images) {
    const src = img.src.toLowerCase()
    // Gallery indicators: numbered project photos, slider images, "Enclosure", "Install"
    const isGallery =
      /\d{2,}-.*(?:enclosure|screen|curtain|patio|porch|install)/i.test(img.alt) ||
      /\d{2,}-.*(?:enclosure|screen|curtain|patio|porch)/i.test(src) ||
      /slider|carousel|gallery/i.test(src) ||
      /-\d{3,4}x\d{3,4}/.test(src) // Resolution suffix typical of project photos

    if (isGallery) {
      gallery.push(img)
    } else {
      inline.push(img)
    }
  }

  return { gallery, inline }
}

// ---------------------------------------------------------------------------
// JSX Generation
// ---------------------------------------------------------------------------

function escapeJSX(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeJSXContent(text: string): string {
  // For text content inside JSX tags -- lighter escaping
  return text
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function generateGallerySection(
  images: { src: string; alt: string }[],
  title: string
): string {
  if (images.length === 0) return ''

  const cols = images.length >= 6 ? 3 : images.length >= 4 ? 2 : 2
  const imageCards = images
    .map(
      (img) =>
        `            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="${img.src}"
                  alt="${escapeJSX(img.alt || title)}"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>`
    )
    .join('\n')

  return `
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="${escapeJSX(title)} Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: ${cols} }} gap="md">
${imageCards}
          </Grid>
        </HeaderBarSection>`
}

function generateInlineImageSection(
  images: { src: string; alt: string }[],
  text: string,
  heading: string
): string {
  if (images.length === 0 && !text) return ''

  if (images.length > 0 && text) {
    // TwoColumn: image on one side, text on the other
    const img = images[0]
    return `
        <HeaderBarSection icon={Info} label="${escapeJSX(heading)}" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                ${escapeJSXContent(text)}
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="${img.src}"
                alt="${escapeJSX(img.alt || heading)}"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>`
  }

  if (images.length > 0) {
    // Image(s) only
    if (images.length === 1) {
      const img = images[0]
      return `
        <div className="rounded-lg overflow-hidden">
          <img
            src="${img.src}"
            alt="${escapeJSX(img.alt || heading)}"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>`
    }
    // Multiple inline images -- small grid
    return generateGallerySection(images, heading)
  }

  return ''
}

function generateTextSection(section: WPSection): string {
  const heading = escapeJSX(section.heading)
  const parts: string[] = []

  if (section.text) {
    // Split long text into paragraphs
    const paragraphs = section.text
      .split(/\n{2,}/)
      .filter((p) => p.trim().length > 0)

    const textBlocks = paragraphs
      .map((p) => `              <Text className="text-gray-600">${escapeJSXContent(p.trim())}</Text>`)
      .join('\n')

    parts.push(textBlocks)
  }

  if (section.listItems.length > 0) {
    const items = section.listItems
      .map((item) => `                <li>${escapeJSXContent(item)}</li>`)
      .join('\n')
    parts.push(`              <BulletedList>
${items}
              </BulletedList>`)
  }

  if (parts.length === 0) return ''

  const variant = section.headingLevel <= 2 ? 'green' : 'dark'

  return `
        <HeaderBarSection icon={Info} label="${heading}" variant="${variant}">
          <Stack gap="md">
${parts.join('\n')}
          </Stack>
        </HeaderBarSection>`
}

// ---------------------------------------------------------------------------
// Determine what imports are needed
// ---------------------------------------------------------------------------

function getRequiredImports(
  hasGallery: boolean,
  hasInlineImages: boolean,
  hasTextSections: boolean,
  hasList: boolean
): string[] {
  const imports = new Set<string>()

  if (hasGallery || hasInlineImages) {
    imports.add('Card')
    imports.add('Frame')
    imports.add('Grid')
  }
  if (hasGallery) {
    imports.add('HeaderBarSection')
  }
  if (hasInlineImages || hasTextSections) {
    imports.add('HeaderBarSection')
    imports.add('Stack')
    imports.add('Text')
    imports.add('TwoColumn')
  }
  if (hasList) {
    imports.add('BulletedList')
  }

  return [...imports]
}

function getRequiredIcons(hasGallery: boolean, hasTextSections: boolean): string[] {
  const icons = new Set<string>()
  if (hasGallery) icons.add('Camera')
  if (hasTextSections) icons.add('Info')
  return [...icons]
}

// ---------------------------------------------------------------------------
// Inject content into page.tsx
// ---------------------------------------------------------------------------

function injectContentIntoPage(
  pageSource: string,
  galleryJSX: string,
  textSectionsJSX: string,
  requiredImports: string[],
  requiredIcons: string[]
): string {
  let updated = pageSource

  // --- Add missing design-system imports ---
  for (const imp of requiredImports) {
    if (!updated.includes(imp)) {
      // Find the design-system import line and add the component
      const dsImportRegex = /(import\s*\{[^}]*)(}\s*from\s*['"]@\/lib\/design-system['"])/
      const dsMatch = updated.match(dsImportRegex)
      if (dsMatch) {
        updated = updated.replace(
          dsImportRegex,
          `$1, ${imp}$2`
        )
      }
    }
  }

  // --- Add missing lucide-react imports ---
  for (const icon of requiredIcons) {
    if (!updated.includes(icon)) {
      const lucideRegex = /(import\s*\{[^}]*)(}\s*from\s*['"]lucide-react['"])/
      const lucideMatch = updated.match(lucideRegex)
      if (lucideMatch) {
        updated = updated.replace(
          lucideRegex,
          `$1, ${icon}$2`
        )
      } else {
        // No lucide import exists, add one at the top after 'use client'
        updated = updated.replace(
          /('use client'\s*\n)/,
          `$1\nimport { ${icon} } from 'lucide-react'\n`
        )
      }
    }
  }

  // --- Find injection point: just before the closing of the main content area ---
  // Strategy: inject before the last FinalCTATemplate or before the last </Container>
  // or before the last closing tag in the JSX return block

  const newContent = [galleryJSX, textSectionsJSX].filter(Boolean).join('\n')

  if (!newContent.trim()) return updated

  // Try injecting before FinalCTATemplate
  const ctaIdx = updated.lastIndexOf('<FinalCTATemplate')
  if (ctaIdx !== -1) {
    updated = updated.substring(0, ctaIdx) + newContent + '\n\n        ' + updated.substring(ctaIdx)
    return updated
  }

  // Try injecting before last </Container>
  const containerCloseIdx = updated.lastIndexOf('</Container>')
  if (containerCloseIdx !== -1) {
    updated =
      updated.substring(0, containerCloseIdx) +
      newContent +
      '\n\n        ' +
      updated.substring(containerCloseIdx)
    return updated
  }

  // Fallback: inject before closing return parenthesis
  const lastParen = updated.lastIndexOf('    )')
  if (lastParen !== -1) {
    updated =
      updated.substring(0, lastParen) +
      newContent +
      '\n' +
      updated.substring(lastParen)
    return updated
  }

  // Final fallback: append before export default
  console.warn('    Could not find injection point, appending to end')
  return updated
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Content Gap Resolver ===')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Filter: ${IMAGES_ONLY ? 'images only' : TEXT_ONLY ? 'text only' : 'all gaps'}`)
  console.log()

  // 1. Fetch needs_revision pages
  let query = supabase
    .from('site_pages')
    .select('slug, title, page_type, wordpress_url, revision_items, review_notes')
    .eq('review_status', 'needs_revision')
    .eq('migration_status', 'live')
    .order('slug')

  if (FILTER_SLUGS) {
    query = query.in('slug', FILTER_SLUGS)
  }

  const { data: pages, error } = await query

  if (error || !pages) {
    console.error('Failed to fetch pages:', error)
    process.exit(1)
  }

  console.log(`Found ${pages.length} pages with content gaps\n`)

  let resolved = 0
  let skipped = 0
  let failed = 0

  for (const page of pages) {
    const slug = page.slug as string
    const title = (page.title as string) || 'Page'
    const wpUrl = page.wordpress_url as string
    const revisionItems = (page.revision_items as string) || ''

    console.log(`\n--- ${slug} (${title}) ---`)

    // Parse what's missing
    const gaps = parseRevisionItems(revisionItems)

    const hasImageGap = gaps.missingImages.length > 0
    const hasTextGap = gaps.wordCountGap > 0
    const hasHeadingGap = gaps.missingHeadings.length > 0

    if (!hasImageGap && !hasTextGap && !hasHeadingGap) {
      console.log('  No actionable gaps found (might be video-only issues)')
      skipped++
      continue
    }

    console.log(`  Gaps: ${gaps.missingImages.length} images, ${gaps.wordCountGap}% word gap, ${gaps.missingHeadings.length} headings`)

    // Find local page
    const cleanSlug = slug.replace(/^\//, '').replace(/\/$/, '')
    const pagePath = join(PROJECT_ROOT, 'src', 'app', cleanSlug, 'page.tsx')

    if (!existsSync(pagePath)) {
      console.log('  SKIP: no local page.tsx')
      skipped++
      continue
    }

    // Read existing page source
    const pageSource = readFileSync(pagePath, 'utf8')

    // Fetch WP content sections
    let wpSections: WPSection[] = []
    if (wpUrl && (!IMAGES_ONLY || hasTextGap)) {
      const fullWpUrl = wpUrl.startsWith('http') ? wpUrl : `${WP_BASE}${wpUrl}`
      console.log('  Fetching WordPress content...')
      wpSections = await fetchAndExtractWPSections(fullWpUrl)
      console.log(`  Extracted ${wpSections.length} WP sections`)
    }

    // --- IMAGES ---
    let galleryJSX = ''
    if (hasImageGap && !TEXT_ONLY) {
      console.log(`  Processing ${gaps.missingImages.length} missing images...`)

      // Migrate non-S3 images
      const migratedImages: { src: string; alt: string }[] = []
      for (const img of gaps.missingImages) {
        if (DRY_RUN) {
          migratedImages.push(img)
        } else {
          const newSrc = await migrateImageToS3(img.src)
          migratedImages.push({ src: newSrc, alt: img.alt })
        }
      }

      // Classify into gallery vs inline
      const { gallery, inline } = classifyImages(migratedImages)
      console.log(`    Gallery: ${gallery.length}, Inline: ${inline.length}`)

      // Generate gallery section
      if (gallery.length > 0) {
        galleryJSX = generateGallerySection(gallery, title)
      }

      // Inline images are handled with text sections below
      // If no text sections, add them as standalone
      if (inline.length > 0 && wpSections.length === 0) {
        galleryJSX += generateInlineImageSection(inline, '', title)
      }
    }

    // --- TEXT + HEADINGS ---
    let textSectionsJSX = ''
    if ((hasTextGap || hasHeadingGap) && !IMAGES_ONLY && wpSections.length > 0) {
      console.log('  Generating text sections...')

      // Find sections that are missing from local page
      const localLower = pageSource.toLowerCase()

      for (const section of wpSections) {
        // Skip sections whose heading already appears in local page
        const headingLower = section.heading.toLowerCase()
        if (headingLower !== '(intro)' && localLower.includes(headingLower)) {
          continue
        }

        // Skip very short sections
        if (section.text.split(/\s+/).length < 10 && section.images.length === 0 && section.listItems.length === 0) {
          continue
        }

        // Generate JSX for this section
        if (section.isSlider && section.images.length > 0) {
          // Slider becomes gallery
          const migratedSliderImages = DRY_RUN
            ? section.images
            : await Promise.all(
                section.images.map(async (img) => ({
                  src: await migrateImageToS3(img.src),
                  alt: img.alt,
                }))
              )
          textSectionsJSX += generateGallerySection(migratedSliderImages, section.heading)
        } else if (section.images.length > 0) {
          // Section with inline images
          const migratedInlineImages = DRY_RUN
            ? section.images
            : await Promise.all(
                section.images.map(async (img) => ({
                  src: await migrateImageToS3(img.src),
                  alt: img.alt,
                }))
              )
          textSectionsJSX += generateInlineImageSection(
            migratedInlineImages,
            section.text,
            section.heading
          )
        } else if (section.text || section.listItems.length > 0) {
          // Text-only section
          textSectionsJSX += generateTextSection(section)
        }
      }
    }

    // --- Combine and inject ---
    const hasGallery = galleryJSX.length > 0
    const hasTextContent = textSectionsJSX.length > 0
    const hasListContent = textSectionsJSX.includes('BulletedList')

    if (!hasGallery && !hasTextContent) {
      console.log('  No new content generated (existing content may already cover gaps)')
      skipped++
      continue
    }

    const requiredImports = getRequiredImports(
      hasGallery,
      textSectionsJSX.includes('TwoColumn'),
      hasTextContent,
      hasListContent
    )
    const requiredIcons = getRequiredIcons(hasGallery, hasTextContent)

    if (DRY_RUN) {
      console.log(`  WOULD INJECT: ${hasGallery ? 'gallery' : ''} ${hasTextContent ? 'text sections' : ''}`)
      console.log(`  New imports: ${requiredImports.join(', ')}`)
      console.log(`  New icons: ${requiredIcons.join(', ')}`)
      resolved++
      continue
    }

    try {
      const updatedSource = injectContentIntoPage(
        pageSource,
        galleryJSX,
        textSectionsJSX,
        requiredImports,
        requiredIcons
      )

      writeFileSync(pagePath, updatedSource, 'utf8')
      console.log(`  UPDATED: ${pagePath}`)
      resolved++

      // Update site_pages to reflect the changes
      await supabase
        .from('site_pages')
        .update({
          review_notes: `Content gaps auto-resolved. Previous: ${page.review_notes || 'none'}`,
        })
        .eq('slug', slug)
    } catch (err) {
      console.error(`  FAILED: ${slug}`, err)
      failed++
    }
  }

  console.log('\n=== Summary ===')
  console.log(`Resolved: ${resolved}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total: ${pages.length}`)
}

main().catch(console.error)
