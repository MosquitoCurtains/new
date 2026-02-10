-- Add is_wordpress_original flag to site_pages
-- TRUE = this page existed on the old WordPress site (from the master CSV audit)
-- FALSE = new page created for the Next.js site (admin, new canonical URLs, etc.)

ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS is_wordpress_original BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.site_pages.is_wordpress_original IS
  'Whether this page URL existed on the original WordPress site. Source of truth: Checked URLS Mosquito Curtains.csv';

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_site_pages_is_wordpress_original
  ON public.site_pages (is_wordpress_original);
