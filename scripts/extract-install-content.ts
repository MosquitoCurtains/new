/**
 * Deep HTML Content Extraction for Installation Pages
 * 
 * Fetches raw HTML from WordPress installation pages, parses with Cheerio,
 * extracts video IDs from Elementor data-settings attributes, and maps
 * them to headings in document order.
 * 
 * Key insight: WordPress Elementor stores YouTube URLs in data-settings
 * JSON attributes on .elementor-widget-video elements, NOT in iframes.
 * The videos appear in DOM order matching headings 1:1.
 * 
 * Usage: npx tsx scripts/extract-install-content.ts
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VideoEntry {
  title: string
  videoId: string
  duration: string
}

interface HelpfulVideoEntry extends VideoEntry {
  notes?: string[]
  image?: string
}

interface StepEntry extends VideoEntry {
  stepNumber: number
}

interface ImageEntry {
  src: string
  alt: string
  context: string
}

interface InstallPageManifest {
  slug: string
  title: string
  introText: string
  pdfDownloadUrl: string
  mainVideo: VideoEntry | null
  introVideo: VideoEntry | null
  steps: StepEntry[]
  supplementaryVideos: VideoEntry[]
  helpfulVideos: HelpfulVideoEntry[]
  images: ImageEntry[]
  totalVideoCount: number
  allVideoIds: string[]
}

// ---------------------------------------------------------------------------
// Pages to extract
// ---------------------------------------------------------------------------

const PAGES = [
  {
    slug: 'tracking',
    url: 'https://www.mosquitocurtains.com/mosquito-curtains-tracking-installation/',
  },
  {
    slug: 'velcro',
    url: 'https://www.mosquitocurtains.com/mosquito-curtains-velcro-installation/',
  },
  {
    slug: 'clear-vinyl',
    url: 'https://www.mosquitocurtains.com/clear-vinyl-installation/',
  },
]

// ---------------------------------------------------------------------------
// HTML Fetching
// ---------------------------------------------------------------------------

async function fetchHTML(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`)
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  return await response.text()
}

// ---------------------------------------------------------------------------
// Duration parsing
// ---------------------------------------------------------------------------

function parseDurationFromTitle(title: string): { cleanTitle: string; duration: string } {
  // Match patterns like "7:47", "39:59", "0:53" at end of title (possibly after newline/whitespace)
  const durationMatch = title.match(/\s*(\d{1,2}:\d{2})\s*$/)
  if (durationMatch) {
    return {
      cleanTitle: title.replace(durationMatch[0], '').trim(),
      duration: durationMatch[1],
    }
  }
  return { cleanTitle: title.trim(), duration: '' }
}

// ---------------------------------------------------------------------------
// YouTube ID extraction from data-settings JSON
// ---------------------------------------------------------------------------

function extractVideoIdFromSettings(settingsJson: string): string | null {
  try {
    const parsed = JSON.parse(settingsJson)
    const ytUrl = parsed.youtube_url || parsed.video_url || ''
    if (!ytUrl) return null

    // Match ?v=VIDEO_ID or /embed/VIDEO_ID
    const match = ytUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                  ytUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/) ||
                  ytUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Headings that are NOT video-associated
// ---------------------------------------------------------------------------

const NON_VIDEO_HEADINGS = new Set([
  'caring for your curtains',
  'other helpful videos',
  'contact us',
  'products',
  'shipping & return policy',
  'shipping &amp; return policy',
  'tutorial videos',
  'mc instant quote',
  'clear vinyl instant quote',
  'want to have a quick chat about your quote?',
  'we love showing off your diy handy work!',
  'learn more',
  'why our system?',
  'self-installation',
  'guarantee',
  'options',
  'instant quote',
  'ordering',
  'need assistance? our planning team is here to help.',
])

// ---------------------------------------------------------------------------
// Deep DOM Extraction
// ---------------------------------------------------------------------------

function extractInstallContent(html: string, slug: string): InstallPageManifest {
  const $ = cheerio.load(html)

  // --- 1. Extract page title (H1) ---
  const h1 = $('h1').first().text().replace(/\u200B/g, '').trim()

  // --- 2. Extract intro text ---
  let introText = ''
  const textWidgets = $('.elementor-widget-text-editor .elementor-widget-container')
  textWidgets.each((_, el) => {
    const text = $(el).text().replace(/\u200B/g, '').trim()
    if (text && text.includes('installation video') && !introText) {
      introText = text
    }
  })

  // --- 3. Extract PDF download URL ---
  let pdfDownloadUrl = ''
  $('a').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href.includes('.pdf') && (href.includes('Installation') || href.includes('installation'))) {
      pdfDownloadUrl = href
    }
  })

  // --- 4. Extract ALL video IDs from .elementor-widget-video in DOM order ---
  const orderedVideoIds: string[] = []
  $('.elementor-widget-video').each((_, el) => {
    const settings = $(el).attr('data-settings') || ''
    const videoId = extractVideoIdFromSettings(settings)
    if (videoId) {
      orderedVideoIds.push(videoId)
    }
  })

  // Deduplicate while preserving first occurrence order
  const uniqueVideoIds: string[] = []
  const seenIds = new Set<string>()
  for (const id of orderedVideoIds) {
    if (!seenIds.has(id)) {
      seenIds.add(id)
      uniqueVideoIds.push(id)
    }
  }

  console.log(`  Found ${orderedVideoIds.length} video widgets (${uniqueVideoIds.length} unique)`)

  // --- 5. Extract ALL headings in DOM order ---
  interface HeadingEntry {
    text: string
    cleanTitle: string
    duration: string
    isVideoHeading: boolean
    originalIndex: number
  }

  const allHeadings: HeadingEntry[] = []
  $('h2, h3').each((idx, el) => {
    const rawText = $(el).text().replace(/\u200B/g, '').replace(/\s+/g, ' ').trim()
    if (!rawText) return

    const lower = rawText.toLowerCase().trim()
    const isNonVideo = NON_VIDEO_HEADINGS.has(lower) || lower.match(/^\d{2,},\d{3}/)
    const { cleanTitle, duration } = parseDurationFromTitle(rawText)

    allHeadings.push({
      text: rawText,
      cleanTitle,
      duration,
      isVideoHeading: !isNonVideo && (duration !== '' || lower.startsWith('step') || lower.includes('complete') || lower.includes('intro')),
      originalIndex: idx,
    })
  })

  // Filter to headings that have associated videos
  // A heading has a video if it has a duration or is clearly a video section title
  const videoHeadings = allHeadings.filter(h => {
    const lower = h.cleanTitle.toLowerCase()
    // Has duration = definitely has video
    if (h.duration) return true
    // Contains "Additional Videos" = section header, not a video itself
    if (lower.includes('additional videos')) return false
    // Other patterns that have videos
    if (lower.startsWith('step')) return true
    if (lower.includes('complete') && (lower.includes('install') || lower.includes('velcro'))) return true
    if (lower.includes('intro') && lower.includes('tool')) return true
    return false
  })

  console.log(`  Found ${allHeadings.length} total headings, ${videoHeadings.length} video headings`)

  // --- 6. Map headings to video IDs (1:1 in order) ---
  // The WordPress pages have video widgets in the same order as their headings
  // Some headings may be duplicated at the end (repeated section); skip duplicates

  const seenHeadingTitles = new Set<string>()
  const dedupedVideoHeadings: HeadingEntry[] = []
  for (const h of videoHeadings) {
    const key = h.cleanTitle.toLowerCase()
    if (!seenHeadingTitles.has(key)) {
      seenHeadingTitles.add(key)
      dedupedVideoHeadings.push(h)
    }
  }

  console.log(`  After dedup: ${dedupedVideoHeadings.length} unique video headings, ${uniqueVideoIds.length} unique video IDs`)

  // --- 7. Detect section boundaries ---
  let helpfulSectionIdx = -1
  for (let i = 0; i < allHeadings.length; i++) {
    if (allHeadings[i].text.toLowerCase().includes('other helpful videos')) {
      helpfulSectionIdx = allHeadings[i].originalIndex
      break
    }
  }

  // Find the original index of "Caring For Your Curtains" to mark end of supplementary
  let caringSectionIdx = -1
  for (const h of allHeadings) {
    if (h.text.toLowerCase().includes('caring for your curtains')) {
      caringSectionIdx = h.originalIndex
      break
    }
  }

  // --- 8. Build manifest by pairing headings with video IDs ---
  const result: InstallPageManifest = {
    slug,
    title: h1,
    introText,
    pdfDownloadUrl,
    mainVideo: null,
    introVideo: null,
    steps: [],
    supplementaryVideos: [],
    helpfulVideos: [],
    images: [],
    totalVideoCount: uniqueVideoIds.length,
    allVideoIds: uniqueVideoIds,
  }

  let vidIdx = 0

  for (const heading of dedupedVideoHeadings) {
    const videoId = vidIdx < uniqueVideoIds.length ? uniqueVideoIds[vidIdx] : ''
    vidIdx++

    const cleanLower = heading.cleanTitle.toLowerCase()
    const isAfterHelpful = helpfulSectionIdx !== -1 && heading.originalIndex > helpfulSectionIdx

    // Classify the heading
    if (cleanLower.includes('complete') && (cleanLower.includes('install') || cleanLower.includes('velcro'))) {
      result.mainVideo = { title: heading.cleanTitle, videoId, duration: heading.duration }
    } else if (cleanLower.includes('intro') && cleanLower.includes('tool')) {
      result.introVideo = { title: heading.cleanTitle, videoId, duration: heading.duration }
    } else if (/^step\s+\d/i.test(cleanLower)) {
      const stepMatch = cleanLower.match(/^step\s+(\d+):\s*(.*)/i)
      const stepNum = stepMatch ? parseInt(stepMatch[1]) : result.steps.length + 1
      let stepTitle = stepMatch ? stepMatch[2].trim() : heading.cleanTitle.replace(/^step\s+\d+:\s*/i, '')
      // Capitalize first letter
      stepTitle = stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1)
      result.steps.push({ stepNumber: stepNum, title: stepTitle, videoId, duration: heading.duration })
    } else if (isAfterHelpful) {
      const entry: HelpfulVideoEntry = { title: heading.cleanTitle, videoId, duration: heading.duration }

      // Add notes for Adhesive Back Marine Snaps
      if (cleanLower.includes('adhesive back marine snaps')) {
        entry.notes = [
          'If you peel and stick and put any "load" on them at all right away they are worthless and will come right off.',
          'If you let them cure for 2 days on masonry, or 6 hours on either Vinyl or aluminum siding, they are fantastic.',
          'They DO NOT work for either Hardi-board or stucco.',
          'To apply, peel and stick and don\'t TOUCH them at all, in fact don\'t even look at them or talk to them until they cure, and by all means, don\'t try to snap to them until the adhesive has fully cured.',
          'If you forgot to let them cure and they come off, use an appropriate adhesive for the surface you are adhering to (like "Liquid Nails for Masonry" at any hardware store).',
          'We\'ve included screw studs as a back up if all else fails. Use masonry drill bit and a little plastic insert to receive the screw (from hardware store).',
        ]
      }

      // Add image for Notching Stucco Strip
      if (cleanLower.includes('notching stucco strip')) {
        entry.image = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/04/AAA-Notching-Zippered-Stucco-Strip.jpg'
      }

      result.helpfulVideos.push(entry)
    } else {
      // Supplementary video
      result.supplementaryVideos.push({ title: heading.cleanTitle, videoId, duration: heading.duration })
    }
  }

  // --- 9. Extract content images (non-template) ---
  const templateImagePatterns = [
    'MC-Logo', 'favicon', 'clickcease', 'gravatar', 'wp-emoji',
    'Reviews-Image', 'blog-output__marker', 'Hawaii-Porch-Screen',
    'Screen-Porch-1-200', 'Canadian-Porch', 'White-Porch-Curtains',
    'Shade-Fabric-Porch', 'Garage-Screen', 'Shade-Fabric-400',
    'Planner-Image', 'woocommerce',
  ]

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || ''
    const alt = $(el).attr('alt') || ''
    if (
      src &&
      !src.startsWith('data:') &&
      (src.includes('wp-content') || src.includes('wp-media-folder')) &&
      !templateImagePatterns.some(p => src.includes(p))
    ) {
      result.images.push({ src, alt, context: 'page' })
    }
  })

  return result
}

// ---------------------------------------------------------------------------
// Video ID Verification
// ---------------------------------------------------------------------------

async function verifyVideoId(videoId: string): Promise<boolean> {
  try {
    const resp = await fetch(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    return resp.ok
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Pretty Print
// ---------------------------------------------------------------------------

function printManifest(m: InstallPageManifest) {
  console.log(`\n  MANIFEST: ${m.title}`)
  console.log(`  ${'─'.repeat(50)}`)
  console.log(`  Intro: ${m.introText.substring(0, 80)}...`)
  console.log(`  PDF: ${m.pdfDownloadUrl || '(none)'}`)

  if (m.mainVideo) {
    console.log(`\n  MAIN VIDEO:`)
    console.log(`    ${m.mainVideo.title} [${m.mainVideo.videoId}] (${m.mainVideo.duration})`)
  }

  if (m.introVideo) {
    console.log(`\n  INTRO VIDEO:`)
    console.log(`    ${m.introVideo.title} [${m.introVideo.videoId}] (${m.introVideo.duration})`)
  }

  console.log(`\n  STEPS (${m.steps.length}):`)
  for (const s of m.steps) {
    console.log(`    Step ${s.stepNumber}: ${s.title} [${s.videoId}] (${s.duration})`)
  }

  console.log(`\n  SUPPLEMENTARY (${m.supplementaryVideos.length}):`)
  for (const v of m.supplementaryVideos) {
    console.log(`    ${v.title} [${v.videoId}] (${v.duration})`)
  }

  console.log(`\n  HELPFUL VIDEOS (${m.helpfulVideos.length}):`)
  for (const v of m.helpfulVideos) {
    const extras: string[] = []
    if (v.notes) extras.push(`${v.notes.length} notes`)
    if (v.image) extras.push('has image')
    console.log(`    ${v.title} [${v.videoId}] (${v.duration})${extras.length ? ` [${extras.join(', ')}]` : ''}`)
  }

  console.log(`\n  IMAGES: ${m.images.length}`)
  console.log(`  TOTAL UNIQUE VIDEO IDS: ${m.totalVideoCount}`)

  // Count videos accounted for
  let accounted = 0
  if (m.mainVideo?.videoId) accounted++
  if (m.introVideo?.videoId) accounted++
  accounted += m.steps.filter(s => s.videoId).length
  accounted += m.supplementaryVideos.filter(v => v.videoId).length
  accounted += m.helpfulVideos.filter(v => v.videoId).length
  console.log(`  VIDEOS ACCOUNTED FOR: ${accounted}/${m.totalVideoCount}`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('='.repeat(60))
  console.log('  DEEP HTML EXTRACTION: Installation Pages')
  console.log('='.repeat(60))

  const manifests: InstallPageManifest[] = []

  for (const page of PAGES) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`  ${page.slug.toUpperCase()}`)
    console.log(`${'─'.repeat(60)}`)

    const html = await fetchHTML(page.url)
    console.log(`  HTML size: ${(html.length / 1024).toFixed(0)}KB`)

    const manifest = extractInstallContent(html, page.slug)
    manifests.push(manifest)
    printManifest(manifest)
  }

  // Verify all video IDs
  console.log('\n' + '='.repeat(60))
  console.log('  VIDEO ID VERIFICATION')
  console.log('='.repeat(60))

  const allIds = new Set<string>()
  for (const m of manifests) {
    for (const id of m.allVideoIds) {
      if (id) allIds.add(id)
    }
  }

  console.log(`\n  Verifying ${allIds.size} unique video IDs...\n`)

  let valid = 0
  let invalid = 0
  const invalidIds: string[] = []
  for (const id of allIds) {
    const ok = await verifyVideoId(id)
    if (ok) {
      valid++
    } else {
      invalid++
      invalidIds.push(id)
      console.log(`  INVALID: ${id}`)
    }
  }
  console.log(`\n  Valid: ${valid}, Invalid: ${invalid}`)
  if (invalidIds.length) {
    console.log(`  Invalid IDs: ${invalidIds.join(', ')}`)
  }

  // Write JSON manifests to file
  const outputPath = resolve(__dirname, '..', 'docs', 'migrations', 'install-pages-manifest.json')
  writeFileSync(outputPath, JSON.stringify(manifests, null, 2))
  console.log(`\n  Manifests written to: ${outputPath}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
