-- Add duplicate_canonical_url column to site_pages
-- Used to track WordPress pages that are duplicates of a "new" canonical URL.
-- The page serves real content with <link rel="canonical"> pointing to the new URL.
-- Later, the page can be killed and a 301 redirect put in place.

ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS duplicate_canonical_url TEXT;

COMMENT ON COLUMN public.site_pages.duplicate_canonical_url IS
  'If this page is a duplicate of another, stores the canonical URL. Used for <link rel="canonical"> until the decision is made to kill and redirect.';
