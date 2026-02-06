# Page Migration Workflow

**Last Updated:** February 5, 2026  
**Status:** Active  
**Reference:** Use with `PAGE_MIGRATION_TRACKER.md`

---

## CRITICAL: Asset Verification

**EVERY PAGE requires Phase 4 (Asset Verification Pass) before completion.**

Common mistakes:
- Missing images from WordPress sections
- Missing videos from WordPress
- Videos without thumbnails
- Skipping the side-by-side comparison

The workflow now includes a dedicated Asset Verification Pass (Phase 4) with explicit counts to ensure nothing is missed.

This document provides a step-by-step workflow for migrating each WordPress page to Next.js using the design system. Every page must follow this process to ensure consistency and quality.

---

## Quick Reference

### Design System Imports (ALWAYS USE THIS)

```tsx
import { 
  // Layout
  Container, Stack, Grid, TwoColumn, Frame,
  
  // Typography
  Text, Heading,
  
  // Forms
  Button,
  
  // Lists
  BulletedList, ListItem,
  
  // Media
  YouTubeEmbed,
  
  // Section Containers
  HeaderBarSection, GradientSection, CTASection,
  
  // Pre-built Templates (EDIT ONCE, UPDATE EVERYWHERE)
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  HowItWorksTemplate,
  FinalCTATemplate,
  ProfessionalsCalloutTemplate,
  WhoWeAreWhatWeDoTemplate,
} from '@/lib/design-system'
```

### Page Structure Pattern

```tsx
<Container size="xl">
  <Stack gap="lg">
    {/* 1. HERO - PowerHeaderTemplate or custom */}
    {/* 2. TEMPLATES - WhyChooseUsTemplate, etc. */}
    {/* 3. CONTENT - HeaderBarSection blocks */}
    {/* 4. GALLERY - If applicable */}
    {/* 5. FINAL CTA - FinalCTATemplate */}
  </Stack>
</Container>
```

---

## Phase 1: Content Extraction (WordPress)

Before writing any code, extract ALL content from the WordPress page.

### 1.1 Visit the WordPress Page

```
URL: https://mosquitocurtains.com/[page-slug]/
```

### 1.2 Create Content Extraction Document

Create a temporary file to store extracted content:

```
/docs/migrations/[page-slug]-content.md
```

### 1.3 Extract These Elements

| Element | What to Capture | Where to Find |
|---------|-----------------|---------------|
| Page Title | H1 heading | Top of page |
| Subtitle | First paragraph under H1 | Below title |
| Meta Description | SEO description | View page source or Yoast |
| Hero Image | Main image URL | Right-click > Copy image address |
| Hero Video | YouTube video ID | Extract from embed URL |
| Section Headings | All H2/H3 headings | Throughout page |
| Body Text | All paragraphs | Each section |
| Bullet Lists | All bullet points | Throughout page |
| Images | All image URLs | Right-click > Copy image address |
| Videos | All YouTube video or vimeo IDs | Extract from embeds |
| CTAs | Button text + link destinations | Throughout page |
| Testimonials | Quote text + attribution | If present |

### 1.4 Content Template

Use this template for extraction:

```markdown
# [Page Title] - Content Extraction

## Meta
- **WordPress URL:** /original-slug/
- **New Route:** /new-slug/
- **Meta Title:** 
- **Meta Description:** 

## Hero Section
- **Title:** 
- **Subtitle:** 
- **Video ID:** (YouTube)
- **Thumbnail URL:** (if custom)

## Section 1: [Heading]
- **Icon:** (suggest Lucide icon)
- **Content:**
  [Paragraph text here]
- **Bullets:**
  - Bullet 1
  - Bullet 2
  - Bullet 3
- **Video ID:** (if applicable)
- **Image URL:** (if applicable)
- **CTA:** [Button text] -> [Link destination]

## Section 2: [Heading]
...

## Images to Migrate
| Description | WordPress URL | CloudFront URL |
|-------------|---------------|----------------|
| Hero image | https://... | TBD |
| Section 1 image | https://... | TBD |

## Videos
| Description | YouTube ID | Used In |
|-------------|------------|---------|
| Overview | FqNe9pDsZ8M | Hero |
| Installation | abc123 | Section 2 |
```

---

## Phase 2: Content Mapping (Design System)

Map extracted content to design system components.

### 2.1 Page Type Determination

| WordPress Content | Design System Approach |
|-------------------|----------------------|
| Product landing page | PowerHeaderTemplate + HeaderBarSection content |
| FAQ page | HeaderBarSection + BulletedList/Accordion |
| Installation guide | PowerHeaderTemplate + TwoColumn with videos |
| Blog post | Article layout with Text components |
| Gallery page | Grid with Frame components |
| Support page | HeaderBarSection content sections |

### 2.2 Component Mapping

| WordPress Element | Design System Component |
|-------------------|------------------------|
| Hero section | `PowerHeaderTemplate` |
| Section with heading | `HeaderBarSection` |
| Two-column layout | `TwoColumn` |
| Feature list | `BulletedList` + `ListItem` |
| YouTube embed | `YouTubeEmbed` |
| Image | `Frame` + `img` |
| Image gallery | `Grid` + `Frame` |
| Call-to-action | `Button` with `Link` |
| Trust badges | `WhyChooseUsTemplate` |
| Final CTA | `FinalCTATemplate` |

### 2.3 Icon Selection (Lucide React)

Choose icons from Lucide React that match your content:

```tsx
import { 
  Bug,           // Mosquito/pest related
  Shield,        // Protection/guarantee
  Wrench,        // Installation/tools
  Award,         // Quality/awards
  CheckCircle,   // Features/benefits
  Sparkles,      // Premium/special
  Sun,           // Outdoor/weather
  Wind,          // Weather protection
  Thermometer,   // Temperature/seasons
  Camera,        // Photos/gallery
  Play,          // Video
  Phone,         // Contact
  Mail,          // Email
  MapPin,        // Location
  Clock,         // Time/quick
  Truck,         // Shipping
  CreditCard,    // Payment
  Star,          // Reviews/ratings
  Users,         // Customers/testimonials
  Home,          // Residential
  Building2,     // Commercial
  Ruler,         // Measurements
  Scissors,      // Custom/DIY
} from 'lucide-react'
```

---

## Phase 3: Page Creation

### 3.1 Create Page File

```bash
# Create the page directory and file
mkdir -p src/app/[page-slug]
touch src/app/[page-slug]/page.tsx
```

### 3.2 Starter Template

Copy this template and customize:

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Bug, Shield, Wrench } from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid,
  TwoColumn,
  Frame,
  Text, 
  Button,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

// ============================================================================
// PAGE METADATA (update these)
// ============================================================================
const PAGE_CONFIG = {
  title: 'Page Title Here',
  subtitle: 'Clear, concise description of the page content.',
  videoId: 'YOUTUBE_VIDEO_ID',  // or null if no video
  videoTitle: 'Video Title',
}

// ============================================================================
// CONTENT SECTIONS (extracted from WordPress)
// ============================================================================
const SECTIONS = [
  {
    icon: Bug,
    label: 'Section 1 Label',
    content: `
      Your paragraph content here. Copy directly from WordPress.
      Can be multiple sentences.
    `,
    bullets: [
      'Bullet point 1',
      'Bullet point 2',
      'Bullet point 3',
    ],
    videoId: 'VIDEO_ID_OR_NULL',
    videoTitle: 'Video Title',
    ctaText: 'Call to Action',
    ctaLink: '/destination',
  },
  // Add more sections...
]

// ============================================================================
// GALLERY IMAGES (if applicable)
// ============================================================================
const GALLERY_IMAGES = [
  { src: 'https://cloudfront-url/image1.jpg', alt: 'Description 1' },
  { src: 'https://cloudfront-url/image2.jpg', alt: 'Description 2' },
  // Add more images...
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function PageName() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <PowerHeaderTemplate
          title={PAGE_CONFIG.title}
          subtitle={PAGE_CONFIG.subtitle}
          videoId={PAGE_CONFIG.videoId}
          videoTitle={PAGE_CONFIG.videoTitle}
          variant="compact"
        />

        {/* ============================================================ */}
        {/* WHY CHOOSE US (shared template) */}
        {/* ============================================================ */}
        <WhyChooseUsTemplate />

        {/* ============================================================ */}
        {/* CONTENT SECTIONS */}
        {/* ============================================================ */}
        {SECTIONS.map((section, idx) => (
          <HeaderBarSection 
            key={idx}
            icon={section.icon} 
            label={section.label} 
            variant="dark"
          >
            <TwoColumn gap="lg" className="items-center">
              <Stack gap="md">
                <Text className="text-gray-600">
                  {section.content}
                </Text>
                {section.bullets && section.bullets.length > 0 && (
                  <BulletedList spacing="sm">
                    {section.bullets.map((bullet, i) => (
                      <ListItem key={i} variant="checked" iconColor="#406517">
                        {bullet}
                      </ListItem>
                    ))}
                  </BulletedList>
                )}
                {section.ctaText && (
                  <div className="pt-2">
                    <Button variant="primary" asChild>
                      <Link href={section.ctaLink}>
                        {section.ctaText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </Stack>
              {section.videoId && (
                <YouTubeEmbed
                  videoId={section.videoId}
                  title={section.videoTitle}
                  variant="card"
                />
              )}
            </TwoColumn>
          </HeaderBarSection>
        ))}

        {/* ============================================================ */}
        {/* GALLERY (if applicable) */}
        {/* ============================================================ */}
        {GALLERY_IMAGES.length > 0 && (
          <HeaderBarSection icon={Camera} label="Project Gallery" variant="dark">
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {GALLERY_IMAGES.map((img, idx) => (
                <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Frame>
              ))}
            </Grid>
            <div className="flex justify-center pt-6">
              <Button variant="outline" asChild>
                <Link href="/gallery">
                  See Full Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </HeaderBarSection>
        )}

        {/* ============================================================ */}
        {/* FINAL CTA (shared template) */}
        {/* ============================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
```

### 3.3 Fill In Content

1. Update `PAGE_CONFIG` with hero content
2. Update `SECTIONS` array with all content sections
3. Update `GALLERY_IMAGES` if page has images
4. Remove unused sections

---

## Phase 4: Asset Verification Pass (CRITICAL)

**WHY THIS EXISTS:** Assets (images, videos) are commonly missed or incomplete during the initial build. This dedicated pass ensures EVERY asset from the WordPress page makes it into the Next.js page.

### 4.1 Asset Audit Process

**DO NOT SKIP THIS PHASE.** Open both pages side-by-side:
- LEFT: WordPress page (https://mosquitocurtains.com/[slug]/)
- RIGHT: Next.js page (http://localhost:3002/[slug]/)

### 4.2 Image Verification Checklist

Go through the WordPress page TOP TO BOTTOM and check off each image:

| Check | Action |
|-------|--------|
| 1. Count WordPress images | Write down the total: ____ images |
| 2. Count Next.js images | Write down the total: ____ images |
| 3. Numbers match? | If NO, find missing images |

For EACH image on WordPress:
- [ ] Hero/header image present?
- [ ] All section images present?
- [ ] All gallery images present?
- [ ] All inline content images present?
- [ ] All product images present?
- [ ] All background images present?

**Image Extraction Reminder:**
```
Right-click image -> Copy image address
Check if already on CloudFront, otherwise note for migration
```

### 4.3 Video Verification Checklist

| Check | Action |
|-------|--------|
| 1. Count WordPress videos | Write down the total: ____ videos |
| 2. Count Next.js videos | Write down the total: ____ videos |
| 3. Numbers match? | If NO, find missing videos |

For EACH video on WordPress:
- [ ] Video ID extracted correctly?
- [ ] Video embedded with `YouTubeEmbed variant="card"`?
- [ ] Video has thumbnail? (see 4.4 below)
- [ ] Vimeo videos handled correctly?

**Video ID Extraction:**
```
YouTube: https://www.youtube.com/watch?v=VIDEO_ID
         https://youtu.be/VIDEO_ID
Vimeo:   https://vimeo.com/VIDEO_ID
```

### 4.4 Video Thumbnail Requirement

**RULE: Every video MUST have a thumbnail.**

If no custom thumbnail exists, use the YouTube auto-generated thumbnail:

```tsx
// YouTube thumbnail URL pattern
const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

// Fallback if maxresdefault doesn't exist
const thumbnailFallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

// Usage in YouTubeEmbed
<YouTubeEmbed 
  videoId="FqNe9pDsZ8M"
  variant="card"
  thumbnail="https://img.youtube.com/vi/FqNe9pDsZ8M/maxresdefault.jpg"
/>
```

**YouTube Thumbnail Quality Options:**
| Size | URL Pattern | Resolution |
|------|-------------|------------|
| Max | `/vi/{id}/maxresdefault.jpg` | 1280x720 |
| High | `/vi/{id}/hqdefault.jpg` | 480x360 |
| Medium | `/vi/{id}/mqdefault.jpg` | 320x180 |
| Default | `/vi/{id}/default.jpg` | 120x90 |

**GOOD NEWS:** The `YouTubeEmbed` component **automatically handles this fallback**. If `maxresdefault.jpg` fails, it falls back to `hqdefault.jpg`. You don't need to specify a thumbnail URL unless you want a custom one.

```tsx
// Component automatically gets YouTube thumbnail - no thumbnail prop needed!
<YouTubeEmbed videoId="FqNe9pDsZ8M" variant="card" />

// Only use thumbnailUrl if you have a custom thumbnail
<YouTubeEmbed 
  videoId="FqNe9pDsZ8M" 
  variant="card"
  thumbnailUrl="https://cloudfront.example.com/custom-thumb.jpg"
/>
```

### 4.5 Asset Verification Sign-Off

Before proceeding to Phase 5, confirm:

- [ ] ALL images from WordPress are present in Next.js
- [ ] ALL videos from WordPress are present in Next.js  
- [ ] ALL videos have thumbnails (YouTube auto-thumb or custom)
- [ ] Image count matches: WordPress ____ = Next.js ____
- [ ] Video count matches: WordPress ____ = Next.js ____

**If counts don't match, DO NOT PROCEED. Find and add the missing assets.**

---

## Phase 5: Quality Checklist

### 5.1 Design System Compliance

- [ ] Imports from `@/lib/design-system` (NOT `/components`)
- [ ] Uses `Container size="xl"` as outermost wrapper
- [ ] Uses `Stack gap="lg"` as direct child of Container
- [ ] Uses `PowerHeaderTemplate` for hero
- [ ] Uses `HeaderBarSection variant="dark"` for content sections
- [ ] Uses `TwoColumn` for text + media layouts
- [ ] Uses `BulletedList` + `ListItem` for features
- [ ] Uses `YouTubeEmbed variant="card"` for videos
- [ ] Ends with `FinalCTATemplate`
- [ ] NO `mb-X`, `mt-X`, `my-X` on direct Stack children
- [ ] NO `PageLayout` wrapper (GlobalLayout handles this)

### 5.2 Content Completeness

- [ ] All text content migrated from WordPress
- [ ] All images migrated and URLs updated (verified in Phase 4)
- [ ] All videos embedded with correct IDs (verified in Phase 4)
- [ ] All video thumbnails present (verified in Phase 4)
- [ ] All links updated to new routes
- [ ] Meta title set (via Next.js metadata)
- [ ] Meta description set
- [ ] Alt text on all images

### 5.3 Mobile Responsiveness

- [ ] Test at 375px width (iPhone SE)
- [ ] Test at 768px width (iPad)
- [ ] Test at 1024px width (laptop)
- [ ] Test at 1440px width (desktop)
- [ ] All text readable on mobile
- [ ] All buttons tappable on mobile
- [ ] Images don't overflow on mobile
- [ ] TwoColumn stacks properly on mobile

### 5.4 Tracking Integration

- [ ] Page wrapped in TrackingProvider (via GlobalLayout)
- [ ] Test that page view is recorded in `page_views` table
- [ ] Verify `page_path` is correct in tracking data

---

## Phase 6: SEO & Metadata

### 6.1 Add Metadata Export

Add metadata to the page file:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Mosquito Curtains',
  description: 'Meta description copied from WordPress or improved.',
  openGraph: {
    title: 'Page Title | Mosquito Curtains',
    description: 'Meta description...',
    images: ['/og-image.jpg'],
  },
}
```

### 6.2 SEO Checklist

- [ ] Title tag is unique and descriptive (50-60 chars)
- [ ] Meta description is compelling (150-160 chars)
- [ ] H1 matches or closely matches title tag
- [ ] Only ONE H1 per page
- [ ] H2s used for section headings
- [ ] Images have descriptive alt text
- [ ] Internal links use correct new routes

---

## Phase 7: Redirect Configuration

If the URL changed, add a redirect.

### 7.1 Update next.config.ts

```typescript
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      // Add your redirect
      {
        source: '/old-wordpress-slug/',
        destination: '/new-nextjs-slug/',
        permanent: true,  // 301 redirect
      },
    ]
  },
}
```

### 7.2 Redirect Testing

- [ ] Old URL redirects to new URL
- [ ] Redirect is 301 (permanent)
- [ ] No redirect loops

---

## Phase 8: Final Review & Completion

### 8.1 Visual Comparison

1. Open WordPress page in one browser tab
2. Open Next.js page in another tab
3. Compare side-by-side
4. Verify all content is present
5. Verify visual hierarchy matches
6. **FINAL ASSET CHECK:** Count images and videos one more time

### 8.2 Update Migration Tracker Doc

Update `PAGE_MIGRATION_TRACKER.md`:

1. Change status from `[TODO]` to `[DONE]`
2. Update Quick Stats at top
3. Add to "Currently Live" list
4. Commit with message: `docs: mark /page-slug/ as complete`

### 8.3 Update Database (REQUIRED)

**After the page is live and verified, update the `site_pages` table:**

```sql
-- Update page status to live
UPDATE site_pages 
SET 
  migration_status = 'live',
  review_status = 'complete',
  went_live_at = NOW(),
  updated_at = NOW()
WHERE slug = '/page-slug/';
```

**Or use the Admin Audit UI:**
1. Go to `/admin/audit`
2. Find the page in the list
3. Click edit and update:
   - Built status will reflect database `migration_status`
   - Set Review to "Complete"
   - Add any notes

### 8.4 Deployment

```bash
# Commit the page
git add src/app/[page-slug]/
git commit -m "feat: migrate /page-slug/ page from WordPress"

# Push to trigger deployment
git push
```

### 8.5 Post-Deployment Verification

After deployment completes:
- [ ] Production page loads correctly
- [ ] All images load on production
- [ ] All videos play on production
- [ ] Mobile view works on production
- [ ] Database status updated to `live`

---

## Templates Reference

### Available Templates (Edit Once, Update Everywhere)

| Template | Purpose | Location |
|----------|---------|----------|
| `PowerHeaderTemplate` | Hero with video + action cards | All category/product pages |
| `WhyChooseUsTemplate` | "Why 92,000+ Customers Choose Us" | Most pages |
| `HowItWorksTemplate` | 3-step process flow | Landing pages |
| `FinalCTATemplate` | Big gradient CTA | All page bottoms |
| `WhoWeAreWhatWeDoTemplate` | Company info section | About-style pages |
| `ProfessionalsCalloutTemplate` | "For Professionals" section | Relevant pages |

### To Edit a Template Globally

1. Find the template in `src/lib/design-system/templates/`
2. Edit the file
3. All pages using that template will update automatically

### Section Containers (Add Your Own Content)

| Container | Purpose | When to Use |
|-----------|---------|-------------|
| `HeaderBarSection` | Colored header bar + content | Most content sections |
| `GradientSection` | Gradient-bordered card | Special sections |
| `CTASection` | Call-to-action block | Mid-page CTAs |
| `TwoColumnSection` | Two-column layout | Text + media |

---

## Common Patterns

### Text + Video Section

```tsx
<HeaderBarSection icon={Bug} label="Section Title" variant="dark">
  <TwoColumn gap="lg" className="items-center">
    <Stack gap="md">
      <Text className="text-gray-600">
        Paragraph content here...
      </Text>
      <BulletedList spacing="sm">
        <ListItem variant="checked" iconColor="#406517">Feature 1</ListItem>
        <ListItem variant="checked" iconColor="#406517">Feature 2</ListItem>
      </BulletedList>
      <div className="pt-2">
        <Button variant="primary" asChild>
          <Link href="/destination">
            Call to Action
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Stack>
    <YouTubeEmbed videoId="VIDEO_ID" title="Title" variant="card" />
  </TwoColumn>
</HeaderBarSection>
```

### Image Gallery Section

```tsx
<HeaderBarSection icon={Camera} label="Gallery" variant="dark">
  <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
    {images.map((img, idx) => (
      <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Frame>
    ))}
  </Grid>
</HeaderBarSection>
```

### FAQ Section

```tsx
<HeaderBarSection icon={HelpCircle} label="Frequently Asked Questions" variant="dark">
  <Stack gap="md">
    {faqs.map((faq, idx) => (
      <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
        <Text className="font-semibold text-gray-900 mb-2">{faq.question}</Text>
        <Text className="text-gray-600">{faq.answer}</Text>
      </div>
    ))}
  </Stack>
</HeaderBarSection>
```

### Centered CTA Button

```tsx
<div className="flex justify-center pt-4">
  <Button variant="primary" asChild>
    <Link href="/start-project">
      Get Started
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</div>
```

---

## Troubleshooting

### Issue: Double padding/margins

**Cause:** Using `PageLayout` wrapper or adding padding to `Container`

**Fix:** Remove `PageLayout` wrapper. GlobalLayout handles this.

### Issue: Uneven section spacing

**Cause:** Using `mb-X` classes on Stack children

**Fix:** Remove all margin classes from direct Stack children. Use `Stack gap="lg"`.

### Issue: Video not displaying

**Cause:** Wrong video ID format

**Fix:** Use only the 11-character ID, not full URL. Example: `FqNe9pDsZ8M`

### Issue: Images stretched/distorted

**Cause:** Not using Frame component

**Fix:** Wrap images in `<Frame ratio="16/9">` or appropriate ratio.

### Issue: Mobile layout broken

**Cause:** Fixed widths or columns

**Fix:** Use responsive classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Summary: The Golden Path

For every page migration:

1. **Extract** all content from WordPress
2. **Map** content to design system components
3. **Create** page using the starter template
4. **Fill in** content from extraction
5. **Check** design system compliance
6. **Test** on mobile and desktop
7. **Add** metadata for SEO
8. **Configure** redirects if URL changed
9. **Compare** visually with WordPress
10. **Update** tracker and commit

**Reference Files:**
- `src/app/screened-porch/page.tsx` - Category page pattern
- `src/app/page.tsx` - Custom hero pattern
- `http://localhost:3002/design-system` - All components
