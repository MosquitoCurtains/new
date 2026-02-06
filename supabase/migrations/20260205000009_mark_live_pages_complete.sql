-- Mark all live pages as complete in review workflow
-- Run this AFTER migration 20260205000008_merge_page_reviews.sql

-- Update all pages with migration_status = 'live' to have review_status = 'complete'
UPDATE site_pages 
SET 
  review_status = 'complete',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE migration_status = 'live';

-- Report how many pages were updated
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count 
  FROM site_pages 
  WHERE migration_status = 'live' AND review_status = 'complete';
  
  RAISE NOTICE 'Marked % live pages as complete', updated_count;
END $$;
