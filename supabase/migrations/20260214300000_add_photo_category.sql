-- =============================================================================
-- Add category column to project_photos
-- Categories: 'planning' (default) | 'installed'
-- Existing photos are assumed to be planning photos.
-- =============================================================================

ALTER TABLE public.project_photos
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'planning';

-- Validate only allowed values
ALTER TABLE public.project_photos
  ADD CONSTRAINT project_photos_category_check
  CHECK (category IN ('planning', 'installed'));

-- Index for efficient filtering by project + category
CREATE INDEX IF NOT EXISTS idx_project_photos_category
  ON public.project_photos (project_id, category);
