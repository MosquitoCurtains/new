---
name: WordPress Full Migration
overview: Complete fresh rebuild of the entire site using the beautiful design system. Only the homepage is kept - all other existing pages are discarded and rebuilt from WordPress content. Approximately 25+ pages total.
todos:
  - id: cleanup
    content: Delete all existing pages except homepage and design-system
    status: completed
  - id: templates
    content: Create 5 new page templates (ProductPage, ProjectType, Installation, Support, Gallery)
    status: completed
  - id: seo-landing-pages
    content: Build 10 main SEO landing pages (2 product + 8 project type pages)
    status: completed
  - id: planning-options
    content: Build /options planning guide page with mesh types, attachments, hardware
    status: completed
  - id: start-project
    content: Build robust /start-project wizard with instant quote calculator
    status: completed
  - id: my-projects
    content: Build /my-projects page for customer project lookup
    status: completed
  - id: support-pages
    content: Build 6 support pages (about, professionals, contact, shipping, returns, reviews)
    status: completed
  - id: install-pages
    content: Build 4 installation pages (hub + 3 guides) - hub complete, 3 guides have placeholder content needing real WordPress content
    status: in_progress
  - id: care-pages
    content: Build 2 product care pages
    status: completed
  - id: gallery-db
    content: Create 3 gallery tables (gallery_images, galleries, gallery_assignments)
    status: completed
  - id: gallery-admin-images
    content: Build admin interface for image upload and tagging
    status: completed
  - id: gallery-admin-collections
    content: Build admin interface for creating/managing gallery collections
    status: completed
  - id: gallery-public
    content: Build public gallery page with filters
    status: completed
  - id: gallery-collections
    content: Build standalone collection pages (/gallery/[slug]) and embedded galleries
    status: completed
  - id: story-page
    content: Build company story/blog page
    status: completed
  - id: raw-mesh
    content: Build raw mesh fabric store page
    status: completed
isProject: false
---

# WordPress to Next.js Full Site Migration

## What We're Keeping

**ONLY the homepage** (`/`) - This was built with the beautiful design system and templates.

## What We're Deleting (Fresh Rebuild)

These existing Next.js pages were NOT built well and will be deleted:

- `/screened-porch-enclosures` - rebuild fresh
- `/clear-vinyl-plastic-patio-enclosures` - rebuild fresh
- `/options` - rebuild fresh
- `/start-project` - rebuild fresh
- `/experiment` - delete (test page)

---

## Strategy: Batch by Content Pattern

Create reusable page templates first, then batch-process similar pages together for efficiency.

---

## Phase 0: Cleanup

Delete poorly-built existing pages to start fresh:

- `src/app/screened-porch-enclosures/`
- `src/app/clear-vinyl-plastic-patio-enclosures/`
- `src/app/options/`
- `src/app/start-project/`
- `src/app/experiment/`

---

## Phase 1: Foundation Templates

Create reusable templates in `src/lib/design-system/templates/`:

- `ProductPageTemplate` - For main product pages (Mosquito Curtains, Clear Vinyl)
- `ProjectTypePageTemplate` - For all 8 project type pages (porch, patio, garage, etc.)
- `InstallationPageTemplate` - For installation guide pages
- `SupportPageTemplate` - For support/policy pages (shipping, returns, care)
- `GalleryPageTemplate` - For photo gallery pages

---

## Phase 2: Main SEO Landing Pages (10 pages - HIGH PRIORITY)

**These are ALL primary landing pages for SEO.** Customers land on these from Google searches.

### Main Product Landing Pages (2 pages)


| Route                                   | WordPress Source                                           | Description                                    |
| --------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `/screened-porch-enclosures`            | mosquitocurtains.com/screen-porch-enclosures/              | **Main landing for Mosquito Curtains product** |
| `/clear-vinyl-plastic-patio-enclosures` | mosquitocurtains.com/clear-vinyl-plastic-patio-enclosures/ | **Main landing for Clear Vinyl product**       |


### Project Type Landing Pages (8 pages)


| Route                       | WordPress Source                               | Product           |
| --------------------------- | ---------------------------------------------- | ----------------- |
| `/screened-porch`           | mosquitocurtains.com/screened-porch/           | Mosquito Curtains |
| `/screen-patio`             | mosquitocurtains.com/screen-patio/             | Mosquito Curtains |
| `/garage-door-screens`      | mosquitocurtains.com/garage-door-screens/      | Mosquito Curtains |
| `/pergola-screen-curtains`  | mosquitocurtains.com/pergola-screen-curtains/  | Mosquito Curtains |
| `/gazebo-screen-curtains`   | mosquitocurtains.com/gazebo-screen-curtains/   | Mosquito Curtains |
| `/screened-in-decks`        | mosquitocurtains.com/screened-in-decks/        | Mosquito Curtains |
| `/awning-screen-enclosures` | mosquitocurtains.com/awning-screen-enclosures/ | Mosquito Curtains |
| `/industrial-netting`       | mosquitocurtains.com/industrial-netting/       | Mosquito Curtains |


Build all with comprehensive content, strong CTAs, and full SEO optimization.

---

## Phase 3: Project Planning System (ROBUST - Conversion Critical)

**This is the core conversion funnel.** Options, Instant Quote, and Project Wizard are ONE unified experience.

### Routes


| Route            | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `/options`       | Planning guide: mesh types, attachments, hardware videos |
| `/start-project` | Unified wizard: Options -> Instant Quote -> Save Project |
| `/my-projects`   | Customer project lookup (by email/phone)                 |


### Key Features

**1. Unified Wizard Flow:**

- Step 1: Contact info (lookup key for returning customers)
- Step 2: Product selection (Mosquito Curtains / Clear Vinyl / Both)
- Step 3: Project specs (mesh type, attachment, dimensions, sides)
- Step 4: **Instant Price Calculator** (real-time as user selects)
- Step 5: Photos (optional)
- Step 6: Review & Submit

**2. Instant Quote Calculator:**

- Real-time pricing based on selections
- Matches WordPress sidebar calculator logic
- Shows breakdown: subtotal, shipping estimate, total

**3. Project Persistence:**

- Save progress (uses existing `projects` table)
- Lookup by email/phone for returning customers
- Shareable quote links

**4. Future-Ready:**

- Architecture supports visualizer integration
- Expandable to cart/checkout flow

### Database

- Uses existing `projects` and `project_photos` tables
- May add `project_line_items` for multi-item detailed quotes

---

## Phase 4: Installation Pages (4 pages)

**Status:** Hub page complete. 3 guide pages have placeholder content -- need real WordPress content migrated via deep HTML extraction.

**Related docs:**
- [PAGE_MIGRATION_WORKFLOW.md](PAGE_MIGRATION_WORKFLOW.md) -- Generic migration workflow (Phases 1-8)
- `scripts/extract-install-content.ts` -- Deep HTML extraction script for installation pages
- `docs/migrations/install-pages-manifest.json` -- Extracted content manifests with all video IDs
- `src/lib/design-system/templates/InstallationPageTemplate.tsx` -- Template component

### Routes

| Route | WordPress Source | Status |
| --- | --- | --- |
| `/install` | mosquitocurtains.com/install/ (hub) | Complete |
| `/install/tracking` | mosquitocurtains.com/mosquito-curtains-tracking-installation/ | Placeholder -- needs real content |
| `/install/velcro` | mosquitocurtains.com/mosquito-curtains-velcro-installation/ | Placeholder -- needs real content |
| `/install/clear-vinyl` | mosquitocurtains.com/clear-vinyl-installation/ | Placeholder -- needs real content |

### Page Structure (all 3 guides follow this pattern)

```
1. Title + intro paragraph + PDF download link
2. "Upload Photos" CTA (link to /client-uploads)
3. Complete installation video (full-length, 16-40 min)
4. Intro & Tools video
5. Step-by-step videos (7-9 steps, each a separate short video)
6. Supplementary videos (varies per page)
7. "Caring For Your Curtains" link
8. "Other Helpful Videos" section (SHARED across all 3 pages: 8 videos)
9. Final CTA
```

### Content Inventory (from deep HTML extraction)

**Tracking Installation** -- 23 unique videos
- Main: Complete Tracking Installation (39:59)
- Intro: Intro & Tools (3:46)
- 9 steps: Mounting Track, Snap Carriers, Magnetic Doorways, Fiberglass Rods, Installing Stucco Strips, Mounting Your Curtains, Attaching The Sides, Elastic Cords, Sealing the Base
- 4 supplementary: Project Recap, Standard vs. Heavy Track, Economy Snap Tool, Mounting Track With Double-sided Tape
- PDF: `https://static.mosquitocurtains.com/.../Mosquito-Curtains-Tracking-Installation.pdf`

**Velcro Installation** -- 20 unique videos
- Main: Complete Velcro Installation (28:38)
- Intro: Intro & Tools (2:41)
- 9 steps: Mount Adhesive Velcro, Handling Surface Gaps, Preparing Your Curtains, Magnetic Doorways, Fiberglass Rods, Mounting Your Curtains, Attaching The Sides, Installing Elastic Cord, Sealing the Base
- 1 supplementary: Velcro Installation Overview
- PDF: `https://static.mosquitocurtains.com/.../Mosquito-Curtains-Velcro-Installation.pdf`

**Clear Vinyl Installation** -- 20 unique videos
- Main: Complete CV Velcro Install (16:19)
- Intro: Intro & Tools (1:43)
- 7 steps: Mounting The Velcro, Position Panels, Mounting Panels, Zipper Doorways, Sealing Sides, Belted Ribs, Sealing The Base
- 3 supplementary: Installation Overview, Mounting Your Track, Snap Carriers (the last 2 are "if mounting on track" extras)
- No PDF found on WordPress page

### Shared "Other Helpful Videos" (8 videos on ALL 3 pages)

| Video | Special Content |
| --- | --- |
| Troubleshooting for Wind (9:49) | Video only |
| Panel to Panel Marine Snaps (3:09) | Video only |
| Adhesive Back Marine Snaps (1:11) | Video + 6 bullet points of curing tips |
| Notching Stucco Strip (4:58) | Video + inline image |
| Elastic Cord/Belted Rib Alternative (3:49) | Video only |
| Fiberglass Rod Clip (0:54) | Video only |
| Roll Up Technique (4:47) | Video only |
| Roll Up Shade Screen (5:25) | Video only |

### Deep HTML Extraction Methodology

WordPress Elementor stores YouTube URLs in `data-settings` JSON attributes on `.elementor-widget-video` elements (not in iframes or standard embeds). The extraction script:

1. Fetches raw HTML with browser-like User-Agent
2. Parses with Cheerio
3. Extracts video IDs from `.elementor-widget-video[data-settings]` JSON (`youtube_url` field)
4. Collects all `h2`/`h3` headings with duration parsing (e.g., "Step 1: Mounting Track 7:47")
5. Maps headings to video IDs in document order (1:1 correspondence)
6. Classifies into: main, intro, step, supplementary, helpful
7. Verifies each video ID via YouTube thumbnail HEAD request
8. Outputs structured JSON manifest

### Template Extension Requirements

The `InstallationPageTemplate` needs these additions to support the real WordPress content:
- `introText` -- paragraph under the title
- `pdfDownloadUrl` -- PDF download button
- `mainVideo` -- "Complete Installation" full-length video
- `introVideo` -- "Intro & Tools" video
- `supplementaryVideos` -- page-specific extra videos
- `helpfulVideos` -- shared "Other Helpful Videos" with notes/images support
- `duration` field on steps -- display video duration
- `description` made optional on steps (each step is primarily a video)

### Installation-Specific Migration Checklist

Beyond the generic [PAGE_MIGRATION_WORKFLOW.md](PAGE_MIGRATION_WORKFLOW.md):

- [ ] Video IDs extracted via DOM parsing (not text scrape)
- [ ] Every heading mapped to correct video ID (1:1 in document order)
- [ ] Duration strings parsed and displayed
- [ ] PDF download links verified (HEAD request returns 200)
- [ ] Shared "Other Helpful Videos" deduplicated (same 8 videos on all pages)
- [ ] Adhesive Back Marine Snaps expandable notes present (6 bullet points)
- [ ] Notching Stucco Strip image present and verified
- [ ] Video count: WordPress = Next.js (tracking: 23, velcro: 20, clear-vinyl: 20)
- [ ] All 43 unique video IDs verified against YouTube thumbnail endpoint

---

## Phase 5: Support/Info Pages (6 pages)


| Route                     | WordPress Source                                |
| ------------------------- | ----------------------------------------------- |
| `/about`                  | mosquitocurtains.com/about/                     |
| `/professionals`          | mosquitocurtains.com/professionals/             |
| `/contact`                | mosquitocurtains.com/contact/                   |
| `/shipping`               | mosquitocurtains.com/shipping/                  |
| `/satisfaction-guarantee` | mosquitocurtains.com/satisfaction-guarantee/    |
| `/reviews`                | mosquitocurtains.com/mosquito-curtains-reviews/ |


---

## Phase 6: Product Care Pages (2 pages)


| Route                     | WordPress Source                                   |
| ------------------------- | -------------------------------------------------- |
| `/care/mosquito-curtains` | mosquitocurtains.com/caring-for-mosquito-curtains/ |
| `/care/clear-vinyl`       | mosquitocurtains.com/caring-for-clear-vinyl/       |


---

## Phase 7: Raw Mesh / Fabric Store (1 page)


| Route                       | WordPress Source                       |
| --------------------------- | -------------------------------------- |
| `/raw-netting-fabric-store` | mosquitocurtains.com/mosquito-netting/ |


**Note:** This page has product listings - will need to decide on simple catalog vs full shop functionality.

---

## Phase 8: Gallery System (Database-Driven with Collections)

**Three tables for full gallery + curated collections functionality.**

### Database Schema

**Table 1: `gallery_images**` - All gallery images with filter tags

```sql
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  thumbnail_url text,
  title text,
  description text,
  
  -- Customer option filters (match purchasing options)
  product_type text not null,    -- 'mosquito_curtains' | 'clear_vinyl' | 'raw_mesh'
  project_type text not null,    -- 'porch' | 'patio' | 'garage' | 'pergola' | 'gazebo' | 'deck' | 'awning' | 'industrial'
  mesh_type text,                -- 'heavy_mosquito' | 'no_see_um' | 'shade' | 'scrim'
  top_attachment text,           -- 'tracking' | 'velcro' | 'grommets'
  color text,                    -- mesh/panel color
  
  -- Metadata
  location text,                 -- city/state for context
  customer_name text,
  is_featured boolean default false,
  
  created_at timestamptz default now()
);
```

**Table 2: `galleries**` - Named curated collections

```sql
create table galleries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,     -- 'best-porches', 'customer-favorites'
  name text not null,            -- 'Best Porch Projects'
  description text,
  
  -- Display settings
  is_published boolean default false,
  display_on_page text,          -- '/screened-porch' (for embedded galleries)
  
  created_at timestamptz default now()
);
```

**Table 3: `gallery_assignments**` - Links images to collections

```sql
create table gallery_assignments (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references galleries(id) on delete cascade,
  image_id uuid references gallery_images(id) on delete cascade,
  display_order int default 0,
  
  unique(gallery_id, image_id)
);
```

### Routes


| Route              | Purpose                              |
| ------------------ | ------------------------------------ |
| `/gallery`         | Main filterable gallery (all images) |
| `/gallery/[slug]`  | Standalone curated gallery page      |
| `/admin/gallery`   | Admin: manage all images             |
| `/admin/galleries` | Admin: create/edit collections       |


### Use Cases

1. **Main Gallery** (`/gallery`): Filter all images by customer options
2. **Embedded Galleries**: Show "Best Porches" collection on `/screened-porch` page
3. **Standalone Collections**: `/gallery/customer-favorites`, `/gallery/before-after`
4. **Admin Workflow**: Upload image -> tag filters -> add to collections

### Admin Features

- Drag-drop upload to S3/CloudFront
- Tag images with all filter options
- Create named collections (galleries)
- Drag images into collections with custom order
- Set which page a collection appears on

---

## Phase 9: Blog/Story Page (1 page)


| Route        | WordPress Source                                                     |
| ------------ | -------------------------------------------------------------------- |
| `/our-story` | mosquitocurtains.com/bond-sales-mosquito-curtains-and-a-rodeo-ghost/ |


---

## Execution Approach

For each page migration:

1. **Fetch WordPress content** - Extract all text, images, videos, lists, CTAs
2. **Map to design system** - Use appropriate section components:
  - `GradientSection` for feature highlights
  - `HeaderBarSection` for content with icons
  - `CTASection` for conversion points
  - `TwoColumnSection` for content + media layouts
3. **Apply templates** - Use existing templates (WhyChooseUs, HowItWorks, FinalCTA) where appropriate
4. **Preserve SEO** - Keep page titles, meta descriptions, headings structure
5. **Images** - Reference existing CloudFront URLs

---

## Estimated Scope

- **Pages to DELETE:** 5 (screened-porch-enclosures, clear-vinyl, options, start-project, experiment)
- **Pages to KEEP:** 2 (homepage, design-system)
- **New page templates:** 5
- **Database migrations:** 1 (3 gallery tables)
- **Pages to BUILD:** 32+ total
  - 10 main SEO landing pages (2 product + 8 project types)
  - 3 project planning pages (options, start-project wizard, my-projects)
  - 4 installation pages
  - 6 support pages
  - 2 care pages
  - 5 gallery pages (main gallery, admin images, admin collections, dynamic collection pages)
  - 1 story page
  - 1 raw mesh store

---

## Recommended Order

1. **Phase 0:** Delete poorly-built pages (clean slate)
2. **Phase 1:** Create 5 page templates (enables batch processing)
3. **Phase 2:** Main SEO landing pages (10 pages - 2 product + 8 project types)
4. **Phase 3:** Project Planning System (conversion critical):
  - `/options` planning guide
    - `/start-project` unified wizard with instant quote
    - `/my-projects` customer lookup
5. **Phase 4:** Installation pages (4 pages - video-focused)
6. **Phase 5:** Support pages (6 pages - straightforward content)
7. **Phase 6:** Care pages (2 pages)
8. **Phase 7:** Raw mesh store (1 page)
9. **Phase 8:** Gallery System (database + collections):
  - Create 3 gallery tables migration
    - Build admin image management
    - Build admin collections management
    - Build public filterable gallery
    - Build dynamic collection pages
10. **Phase 9:** Story page (1 page)

