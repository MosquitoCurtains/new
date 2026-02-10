-- Add page_status tracking fields to site_pages
-- Tracks the relationship of each page to the original WordPress site.
--
-- page_status values:
--   rebuilt     = WordPress URL rebuilt on new site (same URL or canonical wrapper)
--   redirected  = WordPress URL now 301-redirects to another page
--   new         = Page never existed on WordPress (admin, new features)
--   replacement = New canonical URL that replaced a WordPress URL (has duplicate_canonical_url pointing to it)

-- 1. WordPress post ID
ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS original_post_id INTEGER;

COMMENT ON COLUMN public.site_pages.original_post_id IS
  'Original WordPress post ID from the WP database export.';

-- 2. Page status (relationship to WordPress)
ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS page_status TEXT NOT NULL DEFAULT 'new';

ALTER TABLE public.site_pages
  ADD CONSTRAINT chk_page_status
  CHECK (page_status IN ('rebuilt', 'redirected', 'new', 'replacement'));

COMMENT ON COLUMN public.site_pages.page_status IS
  'Relationship to original WordPress site: rebuilt (same URL), redirected (301), new (never on WP), replacement (new canonical URL for a WP page).';

-- 3. Redirect destination (for redirected pages)
ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS redirect_to_url TEXT;

COMMENT ON COLUMN public.site_pages.redirect_to_url IS
  'For redirected pages: the destination URL they 301-redirect to. NULL for non-redirected pages.';

-- 4. Index for dashboard filtering
CREATE INDEX IF NOT EXISTS idx_site_pages_page_status
  ON public.site_pages (page_status);

CREATE INDEX IF NOT EXISTS idx_site_pages_original_post_id
  ON public.site_pages (original_post_id);
