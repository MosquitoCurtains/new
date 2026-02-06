/**
 * Content Audit Script
 * 
 * Crawls WordPress HTML for all pages in site_pages, extracts content
 * (videos, images, headings, body text), compares against local Next.js
 * pages where they exist, and writes findings directly to site_pages.
 * 
 * Usage:
 *   npx tsx scripts/audit-content.ts                    # Full audit, all pages
 *   npx tsx scripts/audit-content.ts --dry-run           # Preview without DB writes
 *   npx tsx scripts/audit-content.ts --slugs /garage-door-screens,/french-door-screens
 *   npx tsx scripts/audit-content.ts --live-only         # Only audit built pages
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PROJECT_ROOT = resolve(__dirname, '..')
const WP_BASE = 'https://www.mosquitocurtains.com'

// Word count threshold: flag if local page has less than this % of WP words
const WORD_COUNT_THRESHOLD = 0.60

// Template videos that were intentionally moved to /start-project (false positives)
const TEMPLATE_VIDEO_IDS = new Set([
  '47DB7mSxd5g', // Photo Guidelines
  'OZrqh2tG8Nk', // Watch Before You Call or Email (Planner)
])

// Shared WP template headings (hero bar, footer, CTA sections) -- present on most pages
// These are handled by the Next.js design system (PowerHeaderTemplate, FinalCTATemplate, Footer)
const TEMPLATE_HEADINGS = new Set([
  'custom kits',
  'custom-made',
  'delivered fast',
  'high quality',
  'diy install',
  'options',
  'instant quote',
  'ordering',
  'client installed projects',
  'how to get started',
  'get started fast with a real person!',
  'photo guidelines',
  'good photos',
  'bad photos',
  'quick connect form',
  'click the button to learn your customization options.',
  'need assistance? our planning team is here to help.',
  'contact us',
  'products',
  'shipping & return policy',
  'shipping &amp; return policy',
  'tutorial videos',
  'mc instant quote',
  'want to have a quick chat about your quote?',
  'want to see a gallery of client installed projects?',
])

// Shared WP template images (logos, planner images, etc.) -- filter by filename substring
const TEMPLATE_IMAGE_PATTERNS = [
  'Planner-Image',          // CTA planner section
  'Mosquito-Netting-Curtains-Video-Thumbnail', // Hero video thumbnail (shared)
  'USA_Today_logo',         // Media logos in trust section
  'HGTV_logo',
  'Chicago_Sun-Times',
  'USDA_logo',
  'NASA-logo',
  'Mosquito-Curtains-Team', // About section
  'Insect-Mesh-Holds-Up',   // Shared trust section
  'Good-1-Big',             // Photo guidelines (moved to /start-project)
  'Good-2-Big',
  'Bad-1-Big',              // Photo guidelines bad examples
  'Bad-2-Big',
  'Reviews-Image',          // Shared reviews CTA section
  'blog-output__marker',    // Shared blog marker
  'White-Porch-Curtains-1', // Shared testimonial/CTA images
  'Shade-Fabric-Porch',
  'Hawaii-Porch-Screen',    // Shared testimonial images
  'Screen-Porch-1-200',
  'Canadian-Porch-200',
]

// Delay between HTTP requests to avoid hammering WP server (ms)
const REQUEST_DELAY_MS = 500

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WPContent {
  videos: string[]           // YouTube video IDs
  images: ImageInfo[]        // Image URLs with alt text
  headings: HeadingInfo[]    // Heading text with level
  wordCount: number          // Total body text word count
  textSections: TextSection[] // Text blocks keyed to nearest heading
  rawTextInventory: string   // Full text summary for unbuilt pages
}

interface ImageInfo {
  src: string
  alt: string
}

interface HeadingInfo {
  level: number  // 1-4
  text: string
}

interface TextSection {
  heading: string
  text: string
  wordCount: number
}

interface LocalContent {
  videos: string[]
  images: string[]
  headings: string[]
  wordCount: number
}

interface AuditResult {
  missingVideos: string[]
  extraVideos: string[]
  missingImages: ImageInfo[]
  wordCountGap: { wpWords: number; localWords: number; pct: number } | null
  headingsDiff: { missing: string[]; extra: string[] }
  isClean: boolean
}

interface SitePage {
  id: string
  slug: string
  title: string
  wordpress_url: string | null
  migration_status: string
  review_status: string | null
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIVE_ONLY = args.includes('--live-only')
const slugsArg = args.find(a => a.startsWith('--slugs=') || a.startsWith('--slugs '))
let FILTER_SLUGS: string[] | null = null

const slugsIdx = args.indexOf('--slugs')
if (slugsIdx !== -1 && args[slugsIdx + 1]) {
  FILTER_SLUGS = args[slugsIdx + 1].split(',').map(s => s.trim())
} else if (slugsArg?.startsWith('--slugs=')) {
  FILTER_SLUGS = slugsArg.replace('--slugs=', '').split(',').map(s => s.trim())
}

// ---------------------------------------------------------------------------
// WordPress HTML Fetching
// ---------------------------------------------------------------------------

async function fetchWordPressHTML(wpPath: string): Promise<string | null> {
  const url = wpPath.startsWith('http') ? wpPath : `${WP_BASE}${wpPath}`
  // Ensure trailing slash for WordPress
  const normalizedUrl = url.endsWith('/') ? url : `${url}/`

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'MosquitoCurtains-ContentAudit/1.0',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      console.warn(`  [WARN] HTTP ${response.status} for ${normalizedUrl}`)
      return null
    }

    return await response.text()
  } catch (err) {
    console.warn(`  [WARN] Fetch failed for ${normalizedUrl}:`, (err as Error).message)
    return null
  }
}

// ---------------------------------------------------------------------------
// WordPress Content Extraction
// ---------------------------------------------------------------------------

function extractWPContent(html: string): WPContent {
  const $ = cheerio.load(html)

  // --- Videos ---
  const videoIds = new Set<string>()
  const ytRegex = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g

  // Search entire HTML for YouTube URLs (covers iframes, data-src, JSON, lightbox links)
  let match: RegExpExecArray | null
  while ((match = ytRegex.exec(html)) !== null) {
    const id = match[1]
    if (!TEMPLATE_VIDEO_IDS.has(id)) {
      videoIds.add(id)
    }
  }

  // --- Images ---
  const images: ImageInfo[] = []
  const seenSrcs = new Set<string>()

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || ''
    const alt = $(el).attr('alt') || ''

    // Skip tracking pixels, logos, icons, gravatar, tiny images, and data URIs
    if (
      !src ||
      src.startsWith('data:') ||
      src.includes('clickcease') ||
      src.includes('gravatar') ||
      src.includes('MC-Logo') ||
      src.includes('favicon') ||
      src.includes('icon') ||
      src.includes('pixel') ||
      src.includes('wp-emoji') ||
      src.includes('woocommerce') ||
      seenSrcs.has(src)
    ) return

    // Only include content images (from wp-content/uploads), skip template images
    if (src.includes('wp-content/uploads') || src.includes('wp-media-folder')) {
      const isTemplateImage = TEMPLATE_IMAGE_PATTERNS.some(pattern => src.includes(pattern))
      if (!isTemplateImage) {
        seenSrcs.add(src)
        images.push({ src, alt })
      }
    }
  })

  // --- Headings ---
  const headings: HeadingInfo[] = []
  const seenHeadings = new Set<string>()

  $('h1, h2, h3, h4').each((_, el) => {
    const text = $(el).text().replace(/\u200B/g, '').trim() // Remove zero-width spaces
    const level = parseInt(el.tagName?.replace('h', '') || '0', 10)
    const lower = text.toLowerCase()

    // Skip template headings and duplicates
    if (text && !seenHeadings.has(lower) && !TEMPLATE_HEADINGS.has(lower)) {
      seenHeadings.add(lower)
      headings.push({ level, text })
    }
  })

  // --- Body Text ---
  // Remove obvious non-content areas (scripts, styles, admin bar)
  $('script, style, noscript, #wpadminbar').remove()
  $('nav').remove()

  // Extract text from content-bearing Elementor widgets
  let bodyTextParts: string[] = []

  // Primary: text editor widgets (the main body content in Elementor)
  $('.elementor-widget-text-editor .elementor-widget-container').each((_, el) => {
    const text = $(el).text().replace(/\u200B/g, '').trim()
    if (text) bodyTextParts.push(text)
  })

  // Also capture heading text
  $('.elementor-heading-title').each((_, el) => {
    const text = $(el).text().replace(/\u200B/g, '').trim()
    if (text) bodyTextParts.push(text)
  })

  // Also capture icon-box and other widget text
  $('.elementor-icon-box-content, .elementor-widget-toggle .elementor-tab-content').each((_, el) => {
    const text = $(el).text().replace(/\u200B/g, '').trim()
    if (text) bodyTextParts.push(text)
  })

  // Fallback for non-Elementor sites
  if (bodyTextParts.length === 0) {
    $('main, article, .entry-content').each((_, el) => {
      const text = $(el).text().replace(/\u200B/g, '').trim()
      if (text) bodyTextParts.push(text)
    })
  }

  const allBodyText = bodyTextParts.join(' ').replace(/\s+/g, ' ').trim()
  const wordCount = allBodyText.split(/\s+/).filter(w => w.length > 0).length

  // Build section breakdown keyed to headings
  const textSections: TextSection[] = []
  let currentHeading = '(intro)'
  let currentSectionText: string[] = []

  // Walk through the Elementor sections in order
  const allSections = $('.elementor-widget-heading, .elementor-widget-text-editor, .elementor-widget-toggle')
  allSections.each((_, el) => {
    const $el = $(el)
    if ($el.hasClass('elementor-widget-heading')) {
      // Flush previous section
      if (currentSectionText.length > 0) {
        const sectionText = currentSectionText.join(' ').trim()
        if (sectionText) {
          textSections.push({
            heading: currentHeading,
            text: sectionText.substring(0, 500),
            wordCount: sectionText.split(/\s+/).filter(w => w.length > 0).length,
          })
        }
      }
      currentHeading = $el.text().replace(/\u200B/g, '').trim()
      currentSectionText = []
    } else {
      const text = $el.find('.elementor-widget-container, .elementor-tab-content').text().replace(/\u200B/g, '').trim()
      if (text) currentSectionText.push(text)
    }
  })
  // Flush final section
  if (currentSectionText.length > 0) {
    const sectionText = currentSectionText.join(' ').trim()
    if (sectionText) {
      textSections.push({
        heading: currentHeading,
        text: sectionText.substring(0, 500),
        wordCount: sectionText.split(/\s+/).filter(w => w.length > 0).length,
      })
    }
  }

  // Build raw text inventory for unbuilt pages
  const headingSummary = headings.map(h => `${'#'.repeat(h.level)} ${h.text}`).join('\n')
  const rawTextInventory = [
    `Word count: ~${wordCount}`,
    `Headings:\n${headingSummary}`,
    `Videos: ${[...videoIds].join(', ') || 'none'}`,
    `Images: ${images.length} content images`,
  ].join('\n\n')

  return {
    videos: [...videoIds],
    images,
    headings,
    wordCount,
    textSections,
    rawTextInventory,
  }
}

// ---------------------------------------------------------------------------
// Local Page Content Extraction
// ---------------------------------------------------------------------------

function slugToLocalPath(slug: string): string | null {
  // Map slug to file path
  const cleanSlug = slug.replace(/^\//, '').replace(/\/$/, '')
  const pagePath = resolve(PROJECT_ROOT, 'src', 'app', cleanSlug, 'page.tsx')
  if (existsSync(pagePath)) return pagePath

  // Try without trailing segment for grouped routes
  const parentPath = resolve(PROJECT_ROOT, 'src', 'app', cleanSlug, 'page.tsx')
  if (existsSync(parentPath)) return parentPath

  return null
}

function extractLocalContent(filePath: string): LocalContent {
  const source = readFileSync(filePath, 'utf-8')

  // --- Videos ---
  const videoIds = new Set<string>()

  // Match videoId="xxx" or videoId={'xxx'} or videoId={VIDEOS.XXX}
  const videoIdRegex = /videoId[=:]\s*["'{]([a-zA-Z0-9_-]{11})["'}]/g
  let m: RegExpExecArray | null
  while ((m = videoIdRegex.exec(source)) !== null) {
    if (!TEMPLATE_VIDEO_IDS.has(m[1])) {
      videoIds.add(m[1])
    }
  }

  // Also match VIDEOS.XXX references by looking up the constants
  const videosConstPath = resolve(PROJECT_ROOT, 'src', 'lib', 'constants', 'videos.ts')
  if (existsSync(videosConstPath)) {
    const videosSource = readFileSync(videosConstPath, 'utf-8')

    // Direct VIDEOS.XXX references
    const constRegex = /VIDEOS\.([A-Z_0-9]+)/g
    while ((m = constRegex.exec(source)) !== null) {
      const constName = m[1]
      const valMatch = new RegExp(`${constName}[^']*'([a-zA-Z0-9_-]{11})'`).exec(videosSource)
      if (valMatch && !TEMPLATE_VIDEO_IDS.has(valMatch[1])) {
        videoIds.add(valMatch[1])
      }
    }

    // Resolve imported video collections (HARDWARE_VIDEOS, CAMPING_VIDEOS, etc.)
    // These are arrays of { id: VIDEOS.XXX, title: '...' } that render via .map()
    const collectionNames = ['HARDWARE_VIDEOS', 'CAMPING_VIDEOS', 'RAW_NETTING_VIDEOS', 'TRACKING_VIDEOS', 'INSTALLATION_VIDEOS']
    for (const collName of collectionNames) {
      if (source.includes(collName)) {
        // Find the collection definition in the constants file and extract all video IDs
        const collRegex = new RegExp(`${collName}[\\s\\S]*?\\]`, 'm')
        const collMatch = collRegex.exec(videosSource)
        if (collMatch) {
          const idRegex = /VIDEOS\.([A-Z_]+)/g
          let idMatch: RegExpExecArray | null
          while ((idMatch = idRegex.exec(collMatch[0])) !== null) {
            const name = idMatch[1]
            const valMatch2 = new RegExp(`${name}[^']*'([a-zA-Z0-9_-]{11})'`).exec(videosSource)
            if (valMatch2 && !TEMPLATE_VIDEO_IDS.has(valMatch2[1])) {
              videoIds.add(valMatch2[1])
            }
          }
          // Also match literal IDs in collections
          const litIdRegex = /id:\s*'([a-zA-Z0-9_-]{11})'/g
          while ((idMatch = litIdRegex.exec(collMatch[0])) !== null) {
            if (!TEMPLATE_VIDEO_IDS.has(idMatch[1])) {
              videoIds.add(idMatch[1])
            }
          }
        }
      }
    }
  }

  // --- Images ---
  const images: string[] = []
  const imgRegex = /(?:src|href)=["']([^"']*(?:mosquitocurtains|static\.mosquito|wp-content|ytimg|cloudinary)[^"']*)["']/g
  while ((m = imgRegex.exec(source)) !== null) {
    images.push(m[1])
  }

  // Also match Next.js Image imports and local paths
  const nextImgRegex = /(?:src=\{?["'])(\/[^"']+\.(?:jpg|jpeg|png|webp|gif|svg))["']/g
  while ((m = nextImgRegex.exec(source)) !== null) {
    images.push(m[1])
  }

  // --- Headings ---
  const headings: string[] = []
  // Match JSX heading content: <Heading ...>text</Heading> or <h1>text</h1>
  const headingRegex = /<(?:Heading|h[1-4])[^>]*>([^<]+)</g
  while ((m = headingRegex.exec(source)) !== null) {
    const text = m[1].trim()
    if (text && !text.startsWith('{')) {
      headings.push(text)
    }
  }

  // Also match title="..." and heading="..." props
  const titlePropRegex = /(?:title|heading)=["']([^"']+)["']/g
  while ((m = titlePropRegex.exec(source)) !== null) {
    headings.push(m[1].trim())
  }

  // --- Word Count ---
  // Count words in JSX string literals (text between > and <, and prop values)
  let wordCount = 0
  const jsxTextRegex = />([^<>{]+)</g
  while ((m = jsxTextRegex.exec(source)) !== null) {
    const text = m[1].trim()
    if (text && !text.match(/^\s*[{}\\/]/) && text.length > 2) {
      wordCount += text.split(/\s+/).filter(w => w.length > 0).length
    }
  }

  return {
    videos: [...videoIds],
    images,
    headings,
    wordCount,
  }
}

// ---------------------------------------------------------------------------
// Content Comparison
// ---------------------------------------------------------------------------

function diffContent(wp: WPContent, local: LocalContent): AuditResult {
  const localVideoSet = new Set(local.videos)
  const wpVideoSet = new Set(wp.videos)

  // Missing: in WP but not in local
  const missingVideos = wp.videos.filter(v => !localVideoSet.has(v))

  // Extra: in local but not in WP (potential wrong videos)
  const extraVideos = local.videos.filter(v => !wpVideoSet.has(v))

  // Images: check by filename (ignore domain differences)
  const localImageFiles = new Set(local.images.map(extractFilename))
  const missingImages = wp.images.filter(img => {
    const filename = extractFilename(img.src)
    return !localImageFiles.has(filename)
  })

  // Word count comparison
  let wordCountGap: AuditResult['wordCountGap'] = null
  if (wp.wordCount > 50 && local.wordCount > 0) {
    const ratio = local.wordCount / wp.wordCount
    if (ratio < WORD_COUNT_THRESHOLD) {
      const pct = Math.round((1 - ratio) * 100)
      wordCountGap = { wpWords: wp.wordCount, localWords: local.wordCount, pct }
    }
  }

  // Headings: fuzzy match (lowercase, trim)
  const localHeadingSet = new Set(local.headings.map(h => h.toLowerCase().trim()))
  const wpHeadingTexts = wp.headings.map(h => h.text)
  const missingHeadings = wpHeadingTexts.filter(h => !localHeadingSet.has(h.toLowerCase().trim()))
  const wpHeadingSet = new Set(wpHeadingTexts.map(h => h.toLowerCase().trim()))
  const extraHeadings = local.headings.filter(h => !wpHeadingSet.has(h.toLowerCase().trim()))

  const isClean = missingVideos.length === 0 &&
    extraVideos.length === 0 &&
    !wordCountGap

  return {
    missingVideos,
    extraVideos,
    missingImages,
    wordCountGap,
    headingsDiff: { missing: missingHeadings, extra: extraHeadings },
    isClean,
  }
}

function extractFilename(url: string): string {
  return url.split('/').pop()?.split('?')[0]?.toLowerCase() || ''
}

// ---------------------------------------------------------------------------
// Format Results for DB
// ---------------------------------------------------------------------------

function formatRevisionItemsForBuilt(diff: AuditResult, wp: WPContent): string {
  const items: string[] = []

  for (const vid of diff.missingVideos) {
    items.push(`- MISSING VIDEO: ${vid} (https://youtube.com/watch?v=${vid})`)
  }
  for (const vid of diff.extraVideos) {
    items.push(`- EXTRA/WRONG VIDEO in local: ${vid} (not on WP page)`)
  }
  for (const img of diff.missingImages.slice(0, 20)) { // Cap at 20
    const altLabel = img.alt ? ` (alt: "${img.alt}")` : ''
    items.push(`- MISSING IMAGE: ${img.src}${altLabel}`)
  }
  if (diff.missingImages.length > 20) {
    items.push(`- ... and ${diff.missingImages.length - 20} more missing images`)
  }
  if (diff.wordCountGap) {
    items.push(
      `- WORD COUNT GAP: WP has ~${diff.wordCountGap.wpWords} words, local has ~${diff.wordCountGap.localWords} (${diff.wordCountGap.pct}% less) -- possible missing sections`
    )
  }
  if (diff.headingsDiff.missing.length > 0) {
    items.push(`- MISSING HEADINGS: ${diff.headingsDiff.missing.slice(0, 10).map(h => `"${h}"`).join(', ')}`)
  }

  return items.join('\n')
}

function formatRevisionItemsForUnbuilt(wp: WPContent): string {
  const items: string[] = []

  if (wp.videos.length > 0) {
    items.push(`- WP VIDEOS (${wp.videos.length}): ${wp.videos.map(v => `${v} (https://youtube.com/watch?v=${v})`).join(', ')}`)
  }

  if (wp.images.length > 0) {
    const imgList = wp.images.slice(0, 10).map(i => {
      const filename = extractFilename(i.src)
      return i.alt ? `${filename} (alt: "${i.alt}")` : filename
    }).join(', ')
    items.push(`- WP IMAGES (${wp.images.length}): ${imgList}`)
    if (wp.images.length > 10) {
      items.push(`  ... and ${wp.images.length - 10} more`)
    }
  }

  if (wp.headings.length > 0) {
    items.push(`- WP HEADINGS: ${wp.headings.map(h => `"${h.text}"`).join(', ')}`)
  }

  if (wp.wordCount > 0) {
    const sectionNames = wp.textSections
      .filter(s => s.heading !== '(intro)' && s.wordCount > 20)
      .map(s => `"${s.heading}"`)
      .slice(0, 10)
      .join(', ')
    items.push(`- WP TEXT (~${wp.wordCount} words): Key sections include ${sectionNames || 'various'}`)
  }

  return items.join('\n')
}

function formatReviewNotes(wp: WPContent, diff: AuditResult | null, isBuilt: boolean): string {
  if (!isBuilt) {
    return `WP content inventory: ${wp.videos.length} videos, ${wp.images.length} images, ${wp.headings.length} headings, ~${wp.wordCount} words`
  }

  if (diff && diff.isClean) {
    return `Content audit PASSED: ${wp.videos.length} videos, ${wp.images.length} images match`
  }

  if (diff) {
    const issues: string[] = []
    if (diff.missingVideos.length > 0) issues.push(`${diff.missingVideos.length} missing videos`)
    if (diff.extraVideos.length > 0) issues.push(`${diff.extraVideos.length} extra/wrong videos`)
    if (diff.missingImages.length > 0) issues.push(`${diff.missingImages.length} missing images`)
    if (diff.wordCountGap) issues.push(`word count gap ${diff.wordCountGap.pct}%`)
    if (diff.headingsDiff.missing.length > 0) issues.push(`${diff.headingsDiff.missing.length} missing headings`)
    return `Content audit: ${issues.join(', ')}`
  }

  return 'Content audit completed'
}

// ---------------------------------------------------------------------------
// Database Operations
// ---------------------------------------------------------------------------

function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function fetchPages(supabase: ReturnType<typeof createClient>): Promise<SitePage[]> {
  let query = supabase
    .from('site_pages')
    .select('id, slug, title, wordpress_url, migration_status, review_status')
    .not('wordpress_url', 'is', null)
    .order('migration_priority', { ascending: false })

  if (LIVE_ONLY) {
    query = query.eq('migration_status', 'live')
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch pages: ${error.message}`)
  
  let pages = (data || []) as SitePage[]

  if (FILTER_SLUGS) {
    pages = pages.filter(p => FILTER_SLUGS!.includes(p.slug))
  }

  return pages
}

async function updateSitePage(
  supabase: ReturnType<typeof createClient>,
  pageId: string,
  wp: WPContent,
  diff: AuditResult | null,
  isBuilt: boolean,
): Promise<void> {
  const reviewNotes = formatReviewNotes(wp, diff, isBuilt)
  const revisionItems = isBuilt && diff
    ? formatRevisionItemsForBuilt(diff, wp)
    : formatRevisionItemsForUnbuilt(wp)

  const updates: Record<string, unknown> = {
    review_notes: reviewNotes,
    revision_items: revisionItems || null,
    has_video: wp.videos.length > 0,
    video_count: wp.videos.length,
    has_images: wp.images.length > 0,
    image_count: wp.images.length,
    word_count: wp.wordCount,
    updated_at: new Date().toISOString(),
  }

  // Only change review_status for built pages
  if (isBuilt && diff) {
    updates.review_status = diff.isClean ? 'complete' : 'needs_revision'
    updates.reviewed_at = new Date().toISOString()
  }

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would write to ${pageId}:`)
    console.log(`    review_status: ${updates.review_status || '(unchanged)'}`)
    console.log(`    review_notes: ${reviewNotes}`)
    if (revisionItems) {
      console.log(`    revision_items:\n${revisionItems.split('\n').map(l => `      ${l}`).join('\n')}`)
    }
    return
  }

  const { error } = await supabase
    .from('site_pages')
    .update(updates)
    .eq('id', pageId)

  if (error) {
    console.error(`  [ERROR] DB update failed for ${pageId}: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('='.repeat(60))
  console.log('  CONTENT AUDIT: WordPress vs Local Next.js')
  console.log('='.repeat(60))
  console.log()

  if (DRY_RUN) console.log('  ** DRY RUN MODE -- no database writes **\n')
  if (LIVE_ONLY) console.log('  ** LIVE ONLY -- skipping unbuilt pages **\n')
  if (FILTER_SLUGS) console.log(`  ** FILTERING: ${FILTER_SLUGS.join(', ')} **\n`)

  const supabase = createSupabaseClient()
  const pages = await fetchPages(supabase)

  console.log(`Found ${pages.length} pages to audit\n`)

  // Stats
  let total = 0
  let passed = 0
  let needsRevision = 0
  let inventoried = 0
  let fetchFailed = 0
  let noLocalFile = 0

  for (const page of pages) {
    total++
    const isBuilt = page.migration_status === 'live'
    const statusTag = isBuilt ? '[LIVE]' : `[${page.migration_status}]`

    console.log(`[${total}/${pages.length}] ${statusTag} ${page.slug} -- ${page.title}`)

    // 1. Fetch WordPress HTML
    const html = await fetchWordPressHTML(page.wordpress_url!)
    if (!html) {
      fetchFailed++
      console.log('  SKIPPED: Could not fetch WordPress page\n')
      continue
    }

    // 2. Extract WordPress content
    const wp = extractWPContent(html)
    console.log(`  WP: ${wp.videos.length} videos, ${wp.images.length} images, ${wp.headings.length} headings, ~${wp.wordCount} words`)

    // 3. Compare with local (only for built pages)
    let diff: AuditResult | null = null

    if (isBuilt) {
      const localPath = slugToLocalPath(page.slug)
      if (localPath) {
        const local = extractLocalContent(localPath)
        console.log(`  Local: ${local.videos.length} videos, ${local.images.length} images, ${local.headings.length} headings, ~${local.wordCount} words`)

        diff = diffContent(wp, local)

        if (diff.isClean) {
          passed++
          console.log('  RESULT: PASSED')
        } else {
          needsRevision++
          const issues: string[] = []
          if (diff.missingVideos.length) issues.push(`${diff.missingVideos.length} missing videos`)
          if (diff.extraVideos.length) issues.push(`${diff.extraVideos.length} extra videos`)
          if (diff.missingImages.length) issues.push(`${diff.missingImages.length} missing images`)
          if (diff.wordCountGap) issues.push(`word gap ${diff.wordCountGap.pct}%`)
          if (diff.headingsDiff.missing.length) issues.push(`${diff.headingsDiff.missing.length} missing headings`)
          console.log(`  RESULT: NEEDS REVISION -- ${issues.join(', ')}`)
        }
      } else {
        noLocalFile++
        console.log('  WARN: No local page.tsx found (page marked live but file missing)')
      }
    } else {
      inventoried++
      console.log('  RESULT: WP content inventory stored (page not built yet)')
    }

    // 4. Write to database
    await updateSitePage(supabase, page.id, wp, diff, isBuilt)

    console.log()

    // Rate limiting
    await sleep(REQUEST_DELAY_MS)
  }

  // Final summary
  console.log('='.repeat(60))
  console.log('  AUDIT SUMMARY')
  console.log('='.repeat(60))
  console.log(`  Total pages audited:  ${total}`)
  console.log(`  Live - Passed:        ${passed}`)
  console.log(`  Live - Needs revision: ${needsRevision}`)
  console.log(`  Unbuilt - Inventoried: ${inventoried}`)
  console.log(`  Fetch failed:         ${fetchFailed}`)
  console.log(`  No local file:        ${noLocalFile}`)
  console.log()

  if (DRY_RUN) {
    console.log('  ** DRY RUN -- no changes were written to the database **')
  } else {
    console.log('  Results written to site_pages. View at /admin/audit')
  }

  console.log()
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
