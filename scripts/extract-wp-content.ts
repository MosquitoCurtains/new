/**
 * WordPress Content Extraction Script
 *
 * Uses Cheerio to crawl WordPress pages and extract actual content:
 * - Page text (headings, paragraphs, lists)
 * - Images (src + alt text)
 * - YouTube video IDs
 * - Blog posts (listing + individual articles)
 *
 * Usage:
 *   npx tsx scripts/extract-wp-content.ts --page /what-makes-our-clear-vinyl-product-better/
 *   npx tsx scripts/extract-wp-content.ts --blog
 *   npx tsx scripts/extract-wp-content.ts --all
 */

import * as cheerio from 'cheerio'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { normalizeImageUrl } from '../src/lib/utils/image-url'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExtractedImage {
  src: string
  normalizedSrc: string
  alt: string
  context: string // section heading or location on page
}

interface ExtractedVideo {
  videoId: string
  title: string
  platform: 'youtube' | 'vimeo'
  context: string
}

interface ExtractedSection {
  heading: string
  headingLevel: number
  paragraphs: string[]
  bullets: string[]
  images: ExtractedImage[]
  videos: ExtractedVideo[]
}

interface ExtractedPage {
  url: string
  slug: string
  title: string // H1
  metaTitle: string
  metaDescription: string
  ogImage: string
  sections: ExtractedSection[]
  allImages: ExtractedImage[]
  allVideos: ExtractedVideo[]
  rawTextWordCount: number
}

interface ExtractedBlogPost {
  url: string
  slug: string
  title: string
  excerpt: string
  content: string // Full HTML content cleaned up
  contentSections: ExtractedSection[]
  featuredImage: string
  featuredImageAlt: string
  date: string
  category: string
  author: string
  allImages: ExtractedImage[]
  allVideos: ExtractedVideo[]
}

interface BlogExtractionResult {
  posts: ExtractedBlogPost[]
  categories: string[]
  totalPosts: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = 'https://www.mosquitocurtains.com'

// Template/chrome images to skip
const TEMPLATE_IMAGE_PATTERNS = [
  'MC-Logo', 'favicon', 'clickcease', 'gravatar', 'wp-emoji',
  'Reviews-Image', 'blog-output__marker', 'woocommerce',
  'Planner-Image', 'site-logo', 'cropped-',
  'WhatsApp', 'facebook', 'twitter', 'instagram', 'pinterest',
  'google-play', 'app-store', 'payment-icon', 'credit-card',
  'trust-badge', 'ssl-', 'secure-',
  'spinner', 'loading', 'placeholder',
  'widget-image', 'sidebar',
]

// Template headings to ignore (shared across all pages)
const TEMPLATE_HEADINGS = new Set([
  'contact us',
  'products',
  'shipping & return policy',
  'shipping &amp; return policy',
  'mc instant quote',
  'clear vinyl instant quote',
  'want to have a quick chat about your quote?',
  'instant quote',
  'ordering',
  'need assistance? our planning team is here to help.',
  'leave a reply',
  'post navigation',
  'related posts',
  'recent posts',
  'categories',
  'archives',
  'search',
  'comments',
  'share this:',
])

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
// YouTube ID Extraction
// ---------------------------------------------------------------------------

function extractYouTubeIds(html: string, $: cheerio.CheerioAPI): string[] {
  const ids = new Set<string>()

  // Method 1: From Elementor widget data-settings (JSON)
  $('.elementor-widget-video').each((_, el) => {
    const settings = $(el).attr('data-settings') || ''
    try {
      const parsed = JSON.parse(settings)
      const ytUrl = parsed.youtube_url || parsed.video_url || ''
      const match = ytUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                    ytUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/) ||
                    ytUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
      if (match) ids.add(match[1])
    } catch { /* skip */ }
  })

  // Method 2: From iframes
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || ''
    const match = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/) ||
                  src.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (match) ids.add(match[1])
  })

  // Method 3: Regex over raw HTML for YouTube URLs
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g
  let match
  while ((match = regex.exec(html)) !== null) {
    ids.add(match[1])
  }

  return Array.from(ids)
}

// ---------------------------------------------------------------------------
// Image Extraction
// ---------------------------------------------------------------------------

function isTemplateImage(src: string): boolean {
  return TEMPLATE_IMAGE_PATTERNS.some(p => src.toLowerCase().includes(p.toLowerCase()))
}

function isContentImage(src: string): boolean {
  if (!src) return false
  if (src.startsWith('data:')) return false
  if (isTemplateImage(src)) return false
  // Must be from WP content or static CDN
  return src.includes('wp-content') ||
         src.includes('wp-media-folder') ||
         src.includes('static.mosquitocurtains.com') ||
         src.includes('mosquitocurtains.com/wp-content')
}

function extractImages($: cheerio.CheerioAPI, context: string = 'page'): ExtractedImage[] {
  const images: ExtractedImage[] = []
  const seenSrc = new Set<string>()

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || ''
    const alt = $(el).attr('alt') || ''

    if (!isContentImage(src)) return
    if (seenSrc.has(src)) return
    seenSrc.add(src)

    // Also check srcset for higher res versions
    const srcset = $(el).attr('srcset') || ''
    let bestSrc = src
    if (srcset) {
      const candidates = srcset.split(',').map(s => s.trim().split(/\s+/))
      let maxWidth = 0
      for (const [url, descriptor] of candidates) {
        const w = parseInt(descriptor?.replace('w', '') || '0')
        if (w > maxWidth && isContentImage(url)) {
          maxWidth = w
          bestSrc = url
        }
      }
    }

    const normalized = normalizeImageUrl(bestSrc)

    images.push({
      src: bestSrc,
      normalizedSrc: normalized,
      alt,
      context,
    })
  })

  return images
}

// ---------------------------------------------------------------------------
// Text Cleaning
// ---------------------------------------------------------------------------

function cleanText(text: string): string {
  return text
    .replace(/\u200B/g, '')  // zero-width space
    .replace(/\u00A0/g, ' ') // non-breaking space
    .replace(/\s+/g, ' ')
    .trim()
}

// ---------------------------------------------------------------------------
// Page Content Extraction
// ---------------------------------------------------------------------------

function extractPageContent(html: string, url: string): ExtractedPage {
  const $ = cheerio.load(html)
  const slug = new URL(url).pathname.replace(/^\/|\/$/g, '')

  // Meta info
  const title = cleanText($('h1').first().text()) || cleanText($('title').text())
  const metaTitle = $('meta[property="og:title"]').attr('content') ||
                    $('title').text() || title
  const metaDescription = $('meta[name="description"]').attr('content') ||
                          $('meta[property="og:description"]').attr('content') || ''
  const ogImage = $('meta[property="og:image"]').attr('content') || ''

  const sections: ExtractedSection[] = []
  const allContentText: string[] = []

  // Strategy 1: Elementor section-based extraction
  // Walk each .elementor-section (top-level) and extract heading + content
  const isElementor = $('.elementor').length > 0

  if (isElementor) {
    console.log('  Using Elementor section-based extraction...')
    extractFromElementorSections($, sections, allContentText)
  }

  // Strategy 2: Standard DOM walking if Elementor didn't find enough
  if (!isElementor || sections.filter(s => s.paragraphs.length > 0 || s.bullets.length > 0).length === 0) {
    console.log('  Using standard DOM walking...')
    const contentArea = $('article, .entry-content, .post-content, main, #content').first()
    if (contentArea.length > 0) {
      extractFromDomWalk($, contentArea, sections, allContentText)
    }
  }

  // Strategy 3: Elementor widget fallback
  if (sections.filter(s => s.paragraphs.length > 0 || s.bullets.length > 0).length === 0) {
    console.log('  Trying Elementor widget fallback...')
    extractFromElementorWidgets($, sections, allContentText)
  }

  // All images and videos
  const allImages = extractImages($)
  const videoIds = extractYouTubeIds(html, $)
  const allVideos: ExtractedVideo[] = videoIds.map(id => ({
    videoId: id,
    title: '',
    platform: 'youtube' as const,
    context: 'page',
  }))

  // Assign videos to sections that contain a video widget
  // Walk each section's parent elementor-section and check for video widgets
  for (const section of sections) {
    for (const vid of allVideos) {
      if (section.paragraphs.some(p => p.includes(vid.videoId))) {
        section.videos.push(vid)
      }
    }
  }

  const wordCount = allContentText.join(' ').split(/\s+/).filter(w => w.length > 0).length

  return {
    url,
    slug,
    title,
    metaTitle: cleanText(metaTitle),
    metaDescription: cleanText(metaDescription),
    ogImage,
    sections,
    allImages,
    allVideos,
    rawTextWordCount: wordCount,
  }
}

// ---------------------------------------------------------------------------
// Elementor Section-Based Extraction (primary strategy for Elementor pages)
// ---------------------------------------------------------------------------

function extractFromElementorSections(
  $: cheerio.CheerioAPI,
  sections: ExtractedSection[],
  allContentText: string[]
) {
  // Elementor nests content as:
  // .elementor-section > .elementor-container > .elementor-column > .elementor-element
  // Each section may contain heading widgets, text widgets, list widgets, image widgets
  
  // Walk through all elementor sections
  const elementorSections = $('[data-element_type="section"], [data-element_type="container"], .elementor-section, .elementor-top-section')
  
  elementorSections.each((_, sectionEl) => {
    const $section = $(sectionEl)
    
    // Find heading in this section
    const $heading = $section.find('.elementor-widget-heading .elementor-heading-title').first()
    if (!$heading.length) {
      // Also check for headings in text widgets
      const $h2 = $section.find('h2, h3').first()
      if (!$h2.length) return
      
      const headingText = cleanText($h2.text())
      if (!headingText || TEMPLATE_HEADINGS.has(headingText.toLowerCase())) return
      if (headingText.match(/^\d{2,},\d{3}/)) return // Skip number headings like "92,103..."
      
      const section = extractSectionContent($, $section, headingText, parseInt($h2.prop('tagName')?.replace(/h/i, '') || '2'))
      if (section.paragraphs.length > 0 || section.bullets.length > 0 || section.images.length > 0) {
        sections.push(section)
        allContentText.push(...section.paragraphs)
      }
      return
    }
    
    const headingText = cleanText($heading.text())
    if (!headingText) return
    if (TEMPLATE_HEADINGS.has(headingText.toLowerCase())) return
    if (headingText.match(/^\d{2,},\d{3}/)) return
    
    const tag = $heading.prop('tagName')?.toLowerCase() || 'h2'
    const level = parseInt(tag.replace('h', '') || '2')
    if (level === 1) return // Skip H1 (page title)
    
    const section = extractSectionContent($, $section, headingText, level)
    if (section.paragraphs.length > 0 || section.bullets.length > 0 || section.images.length > 0) {
      sections.push(section)
      allContentText.push(...section.paragraphs)
    }
  })
}

function extractSectionContent(
  $: cheerio.CheerioAPI,
  $section: cheerio.Cheerio<cheerio.Element>,
  heading: string,
  level: number
): ExtractedSection {
  const section: ExtractedSection = {
    heading,
    headingLevel: level,
    paragraphs: [],
    bullets: [],
    images: [],
    videos: [],
  }
  
  // Extract text from text editor widgets
  $section.find('.elementor-widget-text-editor .elementor-widget-container').each((_, widget) => {
    $(widget).find('p').each((_, p) => {
      const text = cleanText($(p).text())
      if (text && text.length > 10 && !section.paragraphs.includes(text)) {
        section.paragraphs.push(text)
      }
    })
  })
  
  // Extract list items (from icon-list widgets or regular lists)
  $section.find('.elementor-widget-icon-list .elementor-icon-list-text, .elementor-icon-list-item').each((_, item) => {
    const text = cleanText($(item).text())
    if (text && text.length > 5 && !section.bullets.includes(text)) {
      section.bullets.push(text)
    }
  })
  
  // Also extract from regular ul/ol lists within text widgets
  $section.find('.elementor-widget-text-editor ul li, .elementor-widget-text-editor ol li').each((_, li) => {
    const text = cleanText($(li).text())
    if (text && text.length > 5 && !section.bullets.includes(text)) {
      section.bullets.push(text)
    }
  })
  
  // Extract from icon box widgets
  $section.find('.elementor-icon-box-content').each((_, box) => {
    const boxTitle = cleanText($(box).find('.elementor-icon-box-title').text())
    const boxDesc = cleanText($(box).find('.elementor-icon-box-description').text())
    if (boxTitle && boxDesc) {
      section.paragraphs.push(`**${boxTitle}**: ${boxDesc}`)
    } else if (boxDesc) {
      section.paragraphs.push(boxDesc)
    }
  })
  
  // Extract images
  $section.find('img').each((_, img) => {
    const src = $(img).attr('src') || $(img).attr('data-src') || ''
    const alt = $(img).attr('alt') || ''
    if (isContentImage(src) && !section.images.some(i => i.src === src)) {
      section.images.push({
        src,
        normalizedSrc: normalizeImageUrl(src),
        alt,
        context: heading,
      })
    }
  })
  
  // Extract video IDs from this section
  $section.find('.elementor-widget-video').each((_, vid) => {
    const settings = $(vid).attr('data-settings') || ''
    try {
      const parsed = JSON.parse(settings)
      const ytUrl = parsed.youtube_url || parsed.video_url || ''
      const match = ytUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                    ytUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/) ||
                    ytUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
      if (match) {
        section.videos.push({
          videoId: match[1],
          title: heading,
          platform: 'youtube',
          context: heading,
        })
      }
    } catch { /* skip */ }
  })
  
  return section
}

// ---------------------------------------------------------------------------
// Standard DOM Walking (for non-Elementor pages like blog posts)
// ---------------------------------------------------------------------------

function extractFromDomWalk(
  $: cheerio.CheerioAPI,
  contentArea: cheerio.Cheerio<cheerio.Element>,
  sections: ExtractedSection[],
  allContentText: string[]
) {
  let currentSection: ExtractedSection | null = null
  
  const headingEls = contentArea.find('h1, h2, h3, h4')
  
  headingEls.each((_, el) => {
    const headingText = cleanText($(el).text())
    if (!headingText) return
    if (TEMPLATE_HEADINGS.has(headingText.toLowerCase())) return

    const level = parseInt(el.tagName?.replace(/h/i, '') || '2')
    if (level === 1) return

    if (currentSection) {
      sections.push(currentSection)
    }

    currentSection = {
      heading: headingText,
      headingLevel: level,
      paragraphs: [],
      bullets: [],
      images: [],
      videos: [],
    }

    let sibling = $(el).next()
    while (sibling.length && !sibling.is('h1, h2, h3, h4')) {
      if (sibling.find('h1, h2, h3, h4').length) break

      const text = cleanText(sibling.text())
      if (text && text.length > 10) {
        if (sibling.is('ul, ol')) {
          sibling.find('li').each((_, li) => {
            const liText = cleanText($(li).text())
            if (liText) currentSection!.bullets.push(liText)
          })
        } else {
          currentSection!.paragraphs.push(text)
          allContentText.push(text)
        }
      }

      sibling.find('img').each((_, img) => {
        const src = $(img).attr('src') || $(img).attr('data-src') || ''
        const alt = $(img).attr('alt') || ''
        if (isContentImage(src)) {
          currentSection!.images.push({
            src,
            normalizedSrc: normalizeImageUrl(src),
            alt,
            context: headingText,
          })
        }
      })

      sibling = sibling.next()
    }
  })

  if (currentSection) {
    sections.push(currentSection)
  }
}

// ---------------------------------------------------------------------------
// Blog Post Elementor Extraction
// ---------------------------------------------------------------------------

function extractBlogFromElementor(
  $: cheerio.CheerioAPI,
  contentArea: cheerio.Cheerio<cheerio.Element>,
  sections: ExtractedSection[]
) {
  // Blog posts in Elementor use:
  // .elementor-widget-heading with .elementor-heading-title for headings and paragraphs
  // .elementor-widget-text-editor for longer text blocks
  // .elementor-widget-image for images
  
  // Skip headings
  const skipHeadings = new Set([
    ...TEMPLATE_HEADINGS,
    'you might also like',
    'related posts',
  ])

  let currentSection: ExtractedSection = {
    heading: '(intro)',
    headingLevel: 2,
    paragraphs: [],
    bullets: [],
    images: [],
    videos: [],
  }

  // Walk all Elementor widgets in DOM order within the content area
  contentArea.find('.elementor-widget').each((_, widget) => {
    const $widget = $(widget)
    const widgetType = $widget.attr('data-widget_type') || ''

    if (widgetType.startsWith('heading')) {
      // This could be a heading or a paragraph styled as heading
      const $title = $widget.find('.elementor-heading-title')
      const text = cleanText($title.text())
      if (!text) return

      // Determine if this is actually a heading (h1-h4) or paragraph text
      const tag = $title.prop('tagName')?.toLowerCase() || 'p'
      
      if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
        if (skipHeadings.has(text.toLowerCase())) return
        if (text.match(/^\d{2,},\d{3}/)) return
        
        // Save current section
        if (currentSection.paragraphs.length > 0 || currentSection.bullets.length > 0 || currentSection.images.length > 0) {
          sections.push(currentSection)
        }
        currentSection = {
          heading: text,
          headingLevel: parseInt(tag.replace('h', '')),
          paragraphs: [],
          bullets: [],
          images: [],
          videos: [],
        }
      } else {
        // It's a paragraph styled as heading widget (common in Elementor blogs)
        if (text.length > 10) {
          currentSection.paragraphs.push(text)
        }
      }
    } else if (widgetType.startsWith('text-editor')) {
      // Text editor widget - extract paragraphs and lists
      $widget.find('p').each((_, p) => {
        const text = cleanText($(p).text())
        if (text && text.length > 5 && !currentSection.paragraphs.includes(text)) {
          currentSection.paragraphs.push(text)
        }
      })
      $widget.find('ul li, ol li').each((_, li) => {
        const text = cleanText($(li).text())
        if (text && !currentSection.bullets.includes(text)) {
          currentSection.bullets.push(text)
        }
      })
    } else if (widgetType.startsWith('image')) {
      const img = $widget.find('img').first()
      const src = img.attr('src') || img.attr('data-src') || ''
      const alt = img.attr('alt') || ''
      if (isContentImage(src)) {
        currentSection.images.push({
          src,
          normalizedSrc: normalizeImageUrl(src),
          alt,
          context: currentSection.heading,
        })
      }
    }
  })

  // Push last section
  if (currentSection.paragraphs.length > 0 || currentSection.bullets.length > 0 || currentSection.images.length > 0) {
    sections.push(currentSection)
  }
}

// ---------------------------------------------------------------------------
// Elementor Widget Extraction (fallback)
// ---------------------------------------------------------------------------

function extractFromElementorWidgets(
  $: cheerio.CheerioAPI,
  sections: ExtractedSection[],
  allContentText: string[]
) {
  // Extract from Elementor text widgets
  const textWidgets = $(
    '.elementor-widget-text-editor .elementor-widget-container, ' +
    '.elementor-widget-theme-post-content .elementor-widget-container, ' +
    '.elementor-text-editor'
  )

  let currentHeading = '(intro)'
  let currentSection: ExtractedSection = {
    heading: currentHeading,
    headingLevel: 2,
    paragraphs: [],
    bullets: [],
    images: [],
    videos: [],
  }

  textWidgets.each((_, widget) => {
    // Check for headings within the widget
    $(widget).find('h2, h3, h4').each((_, h) => {
      const text = cleanText($(h).text())
      if (text && !TEMPLATE_HEADINGS.has(text.toLowerCase())) {
        // Save current and start new
        if (currentSection.paragraphs.length > 0 || currentSection.bullets.length > 0) {
          sections.push(currentSection)
        }
        currentHeading = text
        currentSection = {
          heading: text,
          headingLevel: parseInt(h.tagName?.replace(/h/i, '') || '2'),
          paragraphs: [],
          bullets: [],
          images: [],
          videos: [],
        }
      }
    })

    // Extract paragraphs
    $(widget).find('p').each((_, p) => {
      const text = cleanText($(p).text())
      if (text && text.length > 10) {
        currentSection.paragraphs.push(text)
        allContentText.push(text)
      }
    })

    // Extract lists
    $(widget).find('ul li, ol li').each((_, li) => {
      const text = cleanText($(li).text())
      if (text) {
        currentSection.bullets.push(text)
      }
    })
  })

  if (currentSection.paragraphs.length > 0 || currentSection.bullets.length > 0) {
    sections.push(currentSection)
  }

  // Also extract from icon boxes (common Elementor pattern)
  $('.elementor-icon-box-content').each((_, box) => {
    const heading = cleanText($(box).find('.elementor-icon-box-title').text())
    const description = cleanText($(box).find('.elementor-icon-box-description').text())
    if (heading && description) {
      sections.push({
        heading,
        headingLevel: 3,
        paragraphs: [description],
        bullets: [],
        images: [],
        videos: [],
      })
      allContentText.push(description)
    }
  })

  // Extract from toggle/accordion widgets
  $('.elementor-widget-toggle .elementor-toggle-item, .elementor-widget-accordion .elementor-accordion-item').each((_, item) => {
    const title = cleanText($(item).find('.elementor-tab-title, .elementor-toggle-title').text())
    const content = cleanText($(item).find('.elementor-tab-content, .elementor-toggle-content').text())
    if (title && content) {
      sections.push({
        heading: title,
        headingLevel: 3,
        paragraphs: [content],
        bullets: [],
        images: [],
        videos: [],
      })
      allContentText.push(content)
    }
  })
}

// ---------------------------------------------------------------------------
// Blog Extraction
// ---------------------------------------------------------------------------

async function extractBlogListing(): Promise<string[]> {
  console.log('\n  Discovering blog posts from WordPress...')
  const postUrls: string[] = []
  const seenUrls = new Set<string>()
  let page = 1
  const maxPages = 10

  // Skip patterns: pagination URLs, category URLs, and non-post URLs
  const skipPatterns = [
    /\/blog\/page\//,
    /\/blog\/\d+\/?$/,
    /\/blog\/?$/,
    /\/category\//,
    /\/tag\//,
    /\/author\//,
    /\/#/,
    /\/wp-content\//,
    /\/wp-admin\//,
  ]

  while (page <= maxPages) {
    const url = page === 1
      ? `${BASE_URL}/blog/`
      : `${BASE_URL}/blog/page/${page}/`

    try {
      const html = await fetchHTML(url)
      const $ = cheerio.load(html)

      let foundOnPage = 0

      // Primary: Use "Read more about..." links (most reliable for blog posts)
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href') || ''
        const text = $(el).text().trim()
        
        // "Read more about X" links are definitely blog post links
        if (text.startsWith('Read more about') && href.includes('mosquitocurtains.com')) {
          const cleanHref = href.replace(/\/$/, '')
          if (!seenUrls.has(cleanHref)) {
            seenUrls.add(cleanHref)
            postUrls.push(cleanHref)
            foundOnPage++
          }
          return
        }
      })

      // Secondary: article heading links (h2 > a, h3 > a inside .blog-output or article)
      $('article h2 a[href], article h3 a[href], .blog-output h3 a[href]').each((_, el) => {
        const href = $(el).attr('href') || ''
        if (!href.includes('mosquitocurtains.com')) return
        const cleanHref = href.replace(/\/$/, '')
        if (seenUrls.has(cleanHref)) return
        if (skipPatterns.some(p => p.test(cleanHref))) return
        
        seenUrls.add(cleanHref)
        postUrls.push(cleanHref)
        foundOnPage++
      })

      console.log(`  Page ${page}: found ${foundOnPage} new post links`)

      // Check for next page
      const hasNext = $('a:contains("Next"), a.next, .nav-next a, a:contains("»")').length > 0
      if (!hasNext || foundOnPage === 0) break

      page++
    } catch (err) {
      console.log(`  Page ${page}: no more pages (${err instanceof Error ? err.message : 'error'})`)
      break
    }
  }

  console.log(`  Total unique blog post URLs found: ${postUrls.length}`)
  return postUrls
}

async function extractBlogPost(url: string): Promise<ExtractedBlogPost | null> {
  try {
    const html = await fetchHTML(url)
    const $ = cheerio.load(html)

    // Blog posts are at root level (e.g., /gazebos-then-and-now/) not /blog/slug/
    const slug = new URL(url).pathname.replace(/^\//, '').replace(/\/$/, '')

    // Title
    const title = cleanText($('h1.entry-title, .post-title, h1').first().text()) ||
                  cleanText($('title').text())

    if (!title || title.length < 3) {
      console.log(`  SKIP: No title found for ${url}`)
      return null
    }

    // Featured image
    const featuredImage = $('meta[property="og:image"]').attr('content') ||
                          $('.post-thumbnail img, .featured-image img, article img').first().attr('src') ||
                          ''
    const featuredImageAlt = $('meta[property="og:image:alt"]').attr('content') ||
                             $('.post-thumbnail img, .featured-image img, article img').first().attr('alt') ||
                             title

    // Date
    const dateStr = $('time[datetime]').first().attr('datetime') ||
                    $('meta[property="article:published_time"]').attr('content') ||
                    $('.post-date, .entry-date, .date').first().text() ||
                    ''
    let date = ''
    if (dateStr) {
      try {
        const d = new Date(dateStr)
        if (!isNaN(d.getTime())) {
          date = d.toISOString().split('T')[0]
        }
      } catch {
        date = dateStr
      }
    }

    // Category
    const category = cleanText(
      $('a[rel="category tag"], .cat-links a, .post-category a, .entry-categories a').first().text()
    ) || 'General'

    // Author
    const author = cleanText(
      $('a[rel="author"], .author-name, .post-author, .entry-author').first().text()
    ) || 'Mosquito Curtains Team'

    // Content extraction
    const sections: ExtractedSection[] = []

    // Check if the blog post content uses Elementor
    const entryContent = $('article .entry-content, .post-content').first()
    const isElementorContent = entryContent.find('.elementor').length > 0 || entryContent.find('[data-elementor-type]').length > 0

    if (isElementorContent) {
      // Blog posts wrapped in Elementor: walk Elementor widgets in DOM order
      console.log(`    [Elementor blog post]`)
      extractBlogFromElementor($, entryContent, sections)
    } else {
      // Standard WordPress blog post: walk p, h2, h3, etc.
      console.log(`    [Standard blog post]`)
      const allContentText: string[] = []
      extractFromDomWalk($, entryContent.length ? entryContent : $('article').first(), sections, allContentText)
    }

    // Build content string from sections
    const contentParts: string[] = []
    for (const section of sections) {
      if (section.heading !== '(intro)') {
        contentParts.push(`## ${section.heading}`)
      }
      for (const p of section.paragraphs) {
        contentParts.push(p)
      }
      if (section.bullets.length > 0) {
        for (const b of section.bullets) {
          contentParts.push(`- ${b}`)
        }
      }
      contentParts.push('')
    }
    const content = contentParts.join('\n\n')

    // Build excerpt from first paragraph
    const allParagraphs = sections.flatMap(s => s.paragraphs)
    const excerpt = allParagraphs[0]?.substring(0, 200) || title

    // All images
    const allImages = extractImages($)

    // All videos
    const videoIds = extractYouTubeIds(html, $)
    const allVideos: ExtractedVideo[] = videoIds.map(id => ({
      videoId: id,
      title: '',
      platform: 'youtube' as const,
      context: 'blog-post',
    }))

    return {
      url,
      slug,
      title,
      excerpt,
      content,
      contentSections: sections,
      featuredImage: featuredImage || (allImages[0]?.normalizedSrc || ''),
      featuredImageAlt,
      date,
      category,
      author,
      allImages,
      allVideos,
    }
  } catch (err) {
    console.error(`  ERROR extracting ${url}: ${err instanceof Error ? err.message : err}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Verify Image URLs
// ---------------------------------------------------------------------------

async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    })
    return resp.ok
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Output Formatting
// ---------------------------------------------------------------------------

function printPageSummary(page: ExtractedPage) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  PAGE: ${page.title}`)
  console.log(`  URL: ${page.url}`)
  console.log(`  Slug: ${page.slug}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`  Meta Title: ${page.metaTitle}`)
  console.log(`  Meta Description: ${page.metaDescription.substring(0, 100)}...`)
  console.log(`  Word Count: ${page.rawTextWordCount}`)
  console.log(`  Sections: ${page.sections.length}`)
  console.log(`  Images: ${page.allImages.length}`)
  console.log(`  Videos: ${page.allVideos.length}`)

  for (const section of page.sections) {
    console.log(`\n  --- ${section.heading} (H${section.headingLevel}) ---`)
    console.log(`    Paragraphs: ${section.paragraphs.length}`)
    if (section.paragraphs.length > 0) {
      console.log(`    First: ${section.paragraphs[0].substring(0, 80)}...`)
    }
    console.log(`    Bullets: ${section.bullets.length}`)
    console.log(`    Images: ${section.images.length}`)
    console.log(`    Videos: ${section.videos.length}`)
  }

  console.log(`\n  ALL IMAGES:`)
  for (const img of page.allImages) {
    const urlChanged = img.src !== img.normalizedSrc
    console.log(`    ${urlChanged ? '* ' : '  '}${img.normalizedSrc}`)
    if (img.alt) console.log(`      alt: ${img.alt}`)
    if (urlChanged) console.log(`      (normalized from: ${img.src})`)
  }

  console.log(`\n  ALL VIDEOS:`)
  for (const vid of page.allVideos) {
    console.log(`    ${vid.platform}: ${vid.videoId}`)
  }
}

function printBlogSummary(result: BlogExtractionResult) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  BLOG EXTRACTION SUMMARY`)
  console.log(`${'='.repeat(60)}`)
  console.log(`  Total Posts: ${result.totalPosts}`)
  console.log(`  Categories: ${result.categories.join(', ')}`)

  for (const post of result.posts) {
    console.log(`\n  --- ${post.title} ---`)
    console.log(`    Slug: ${post.slug}`)
    console.log(`    Date: ${post.date}`)
    console.log(`    Category: ${post.category}`)
    console.log(`    Featured Image: ${post.featuredImage ? 'YES' : 'MISSING'}`)
    console.log(`    Sections: ${post.contentSections.length}`)
    console.log(`    Images: ${post.allImages.length}`)
    console.log(`    Videos: ${post.allVideos.length}`)
    console.log(`    Content length: ${post.content.length} chars`)
  }
}

// ---------------------------------------------------------------------------
// Content Document Generation
// ---------------------------------------------------------------------------

function generateContentDoc(page: ExtractedPage): string {
  const lines: string[] = []
  lines.push(`# ${page.title} - Content Extraction`)
  lines.push('')
  lines.push(`## Meta`)
  lines.push(`- **WordPress URL:** ${page.url}`)
  lines.push(`- **Slug:** ${page.slug}`)
  lines.push(`- **Meta Title:** ${page.metaTitle}`)
  lines.push(`- **Meta Description:** ${page.metaDescription}`)
  lines.push(`- **OG Image:** ${page.ogImage}`)
  lines.push(`- **Word Count:** ${page.rawTextWordCount}`)
  lines.push('')

  for (const section of page.sections) {
    lines.push(`## ${section.heading}`)
    for (const p of section.paragraphs) {
      lines.push(`\n${p}`)
    }
    if (section.bullets.length > 0) {
      lines.push('')
      for (const b of section.bullets) {
        lines.push(`- ${b}`)
      }
    }
    if (section.images.length > 0) {
      lines.push('')
      lines.push('**Images in this section:**')
      for (const img of section.images) {
        lines.push(`- ${img.normalizedSrc} (alt: ${img.alt || 'none'})`)
      }
    }
    lines.push('')
  }

  lines.push(`## All Images`)
  lines.push(`| # | URL | Alt | Normalized |`)
  lines.push(`|---|-----|-----|------------|`)
  page.allImages.forEach((img, i) => {
    lines.push(`| ${i + 1} | ${img.src} | ${img.alt || '-'} | ${img.normalizedSrc} |`)
  })

  lines.push('')
  lines.push(`## All Videos`)
  lines.push(`| # | Platform | ID |`)
  lines.push(`|---|----------|-----|`)
  page.allVideos.forEach((vid, i) => {
    lines.push(`| ${i + 1} | ${vid.platform} | ${vid.videoId} |`)
  })

  return lines.join('\n')
}

function generateBlogDataTs(posts: ExtractedBlogPost[]): string {
  const lines: string[] = []
  lines.push(`// Blog post data - extracted from WordPress via Cheerio`)
  lines.push(`// Generated: ${new Date().toISOString()}`)
  lines.push(``)
  lines.push(`export interface BlogPost {`)
  lines.push(`  slug: string`)
  lines.push(`  title: string`)
  lines.push(`  excerpt: string`)
  lines.push(`  content: string`)
  lines.push(`  image: string`)
  lines.push(`  date: string`)
  lines.push(`  category: string`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`export const BLOG_POSTS: BlogPost[] = [`)

  for (const post of posts) {
    const escapedContent = post.content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')

    const escapedTitle = post.title.replace(/'/g, "\\'")
    const escapedExcerpt = post.excerpt.replace(/'/g, "\\'")

    lines.push(`  {`)
    lines.push(`    slug: '${post.slug}',`)
    lines.push(`    title: '${escapedTitle}',`)
    lines.push(`    excerpt: '${escapedExcerpt}',`)
    lines.push(`    content: \`${escapedContent}\`,`)
    lines.push(`    image: '${post.featuredImage}',`)
    lines.push(`    date: '${post.date}',`)
    lines.push(`    category: '${post.category}',`)
    lines.push(`  },`)
  }

  lines.push(`]`)
  lines.push(``)
  lines.push(`// Helper function to get a post by slug`)
  lines.push(`export function getPostBySlug(slug: string): BlogPost | undefined {`)
  lines.push(`  return BLOG_POSTS.find(post => post.slug === slug)`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`// Helper function to get posts by category`)
  lines.push(`export function getPostsByCategory(category: string): BlogPost[] {`)
  lines.push(`  return BLOG_POSTS.filter(post => post.category === category)`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`// Get all unique categories`)
  lines.push(`export function getAllCategories(): string[] {`)
  lines.push(`  return Array.from(new Set(BLOG_POSTS.map(post => post.category)))`)
  lines.push(`}`)

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const mode = args[0] || '--all'

  const outputDir = resolve(__dirname, '..', 'docs', 'migrations')
  mkdirSync(outputDir, { recursive: true })

  console.log('='.repeat(60))
  console.log('  WORDPRESS CONTENT EXTRACTION (Cheerio)')
  console.log('='.repeat(60))

  // -----------------------------------------------------------------------
  // Single page extraction
  // -----------------------------------------------------------------------
  if (mode === '--page' && args[1]) {
    const slug = args[1].replace(/^\/|\/$/g, '')
    const url = `${BASE_URL}/${slug}/`
    const html = await fetchHTML(url)
    console.log(`  HTML size: ${(html.length / 1024).toFixed(0)}KB`)

    const page = extractPageContent(html, url)
    printPageSummary(page)

    // Write content doc
    const contentDoc = generateContentDoc(page)
    const docPath = resolve(outputDir, `${slug.replace(/\//g, '-')}-content.md`)
    writeFileSync(docPath, contentDoc)
    console.log(`\n  Content doc: ${docPath}`)

    // Write JSON
    const jsonPath = resolve(outputDir, `${slug.replace(/\//g, '-')}-extracted.json`)
    writeFileSync(jsonPath, JSON.stringify(page, null, 2))
    console.log(`  JSON data: ${jsonPath}`)

    // Verify images
    console.log(`\n  Verifying ${page.allImages.length} image URLs...`)
    let verified = 0
    let failed = 0
    for (const img of page.allImages) {
      const ok = await verifyImageUrl(img.normalizedSrc)
      if (ok) {
        verified++
      } else {
        failed++
        console.log(`    BROKEN: ${img.normalizedSrc}`)
        // Try original
        const okOrig = await verifyImageUrl(img.src)
        if (okOrig) {
          console.log(`    FALLBACK OK: ${img.src}`)
        }
      }
    }
    console.log(`  Images: ${verified} OK, ${failed} broken`)
  }

  // -----------------------------------------------------------------------
  // Blog extraction
  // -----------------------------------------------------------------------
  if (mode === '--blog' || mode === '--all') {
    console.log('\n' + '─'.repeat(60))
    console.log('  BLOG EXTRACTION')
    console.log('─'.repeat(60))

    const postUrls = await extractBlogListing()
    const posts: ExtractedBlogPost[] = []

    for (const url of postUrls) {
      const post = await extractBlogPost(url)
      if (post) {
        posts.push(post)
        console.log(`  OK: ${post.title} (${post.contentSections.length} sections, ${post.allImages.length} images)`)
      }
    }

    const categories = Array.from(new Set(posts.map(p => p.category)))
    const result: BlogExtractionResult = {
      posts,
      categories,
      totalPosts: posts.length,
    }

    printBlogSummary(result)

    // Write blog JSON
    const blogJsonPath = resolve(outputDir, 'blog-extracted.json')
    writeFileSync(blogJsonPath, JSON.stringify(result, null, 2))
    console.log(`\n  Blog JSON: ${blogJsonPath}`)

    // Write blog-data.ts
    const blogDataTs = generateBlogDataTs(posts)
    const blogDataPath = resolve(outputDir, 'blog-data-extracted.ts')
    writeFileSync(blogDataPath, blogDataTs)
    console.log(`  Blog TypeScript: ${blogDataPath}`)

    // Verify featured images
    console.log(`\n  Verifying ${posts.length} featured images...`)
    for (const post of posts) {
      if (post.featuredImage) {
        const ok = await verifyImageUrl(post.featuredImage)
        console.log(`    ${ok ? 'OK' : 'BROKEN'}: ${post.slug} -> ${post.featuredImage.substring(0, 80)}...`)
      } else {
        console.log(`    MISSING: ${post.slug} has no featured image`)
      }
    }
  }

  // -----------------------------------------------------------------------
  // All pages extraction (clear vinyl + blog)
  // -----------------------------------------------------------------------
  if (mode === '--all' || mode === '--cv') {
    console.log('\n' + '─'.repeat(60))
    console.log('  CLEAR VINYL QUALITY PAGE EXTRACTION')
    console.log('─'.repeat(60))

    const cvUrl = `${BASE_URL}/what-makes-our-clear-vinyl-product-better/`
    const cvHtml = await fetchHTML(cvUrl)
    console.log(`  HTML size: ${(cvHtml.length / 1024).toFixed(0)}KB`)

    const cvPage = extractPageContent(cvHtml, cvUrl)
    printPageSummary(cvPage)

    // Write content doc
    const contentDoc = generateContentDoc(cvPage)
    const docPath = resolve(outputDir, 'what-makes-our-clear-vinyl-product-better-content.md')
    writeFileSync(docPath, contentDoc)
    console.log(`\n  Content doc: ${docPath}`)

    // Write JSON
    const jsonPath = resolve(outputDir, 'what-makes-our-clear-vinyl-product-better-extracted.json')
    writeFileSync(jsonPath, JSON.stringify(cvPage, null, 2))
    console.log(`  JSON data: ${jsonPath}`)

    // Verify images
    console.log(`\n  Verifying ${cvPage.allImages.length} image URLs...`)
    for (const img of cvPage.allImages) {
      const ok = await verifyImageUrl(img.normalizedSrc)
      console.log(`    ${ok ? 'OK' : 'BROKEN'}: ${img.normalizedSrc.substring(0, 80)}...`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('  EXTRACTION COMPLETE')
  console.log('='.repeat(60))
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
