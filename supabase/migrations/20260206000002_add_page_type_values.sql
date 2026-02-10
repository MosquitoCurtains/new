-- =============================================================================
-- Add missing page_type enum values
-- 
-- The sitemap uses types not in the current enum. Adding them so all pages
-- can be properly categorized.
-- =============================================================================

ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'product';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'ordering';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'landing';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'planning';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'quote';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'faq';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'installation';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'gallery';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'blog';
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'sale';
