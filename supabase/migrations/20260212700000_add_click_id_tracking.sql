-- ============================================================================
-- Add Click ID & Ad Platform Tracking
-- ============================================================================
-- Captures GCLID (Google), FBCLID (Facebook), and extended ad platform data.
--
-- Architecture:
--   sessions  = source of truth for ALL click data (gclid, fbclid, ad_click_data JSONB)
--   visitors  = first_gclid / first_fbclid (waterfall essentials)
--   customers = first_gclid / first_fbclid (waterfall destination)
--   orders    = already has session_id — JOIN for detail
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. sessions — granular click data lives here
-- ---------------------------------------------------------------------------
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS gclid text,
  ADD COLUMN IF NOT EXISTS fbclid text,
  ADD COLUMN IF NOT EXISTS ad_click_data jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN sessions.gclid IS 'Google Click ID — auto-appended by Google Ads when auto-tagging is ON';
COMMENT ON COLUMN sessions.fbclid IS 'Facebook Click ID — auto-appended by Meta/Facebook Ads';
COMMENT ON COLUMN sessions.ad_click_data IS 'Extended ad platform params: matchtype, network, creative, placement, adposition, targetid, loc_physical, campaign_id, adset_id, ad_id, ad_name, adset_name, site_source, etc.';

-- Index gclid/fbclid for conversion lookups
CREATE INDEX IF NOT EXISTS idx_sessions_gclid ON sessions (gclid) WHERE gclid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_fbclid ON sessions (fbclid) WHERE fbclid IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 2. visitors — first-touch click IDs for waterfall
-- ---------------------------------------------------------------------------
ALTER TABLE visitors
  ADD COLUMN IF NOT EXISTS first_gclid text,
  ADD COLUMN IF NOT EXISTS first_fbclid text;

COMMENT ON COLUMN visitors.first_gclid IS 'GCLID from the visitor''s very first session (first-touch)';
COMMENT ON COLUMN visitors.first_fbclid IS 'FBCLID from the visitor''s very first session (first-touch)';

-- ---------------------------------------------------------------------------
-- 3. customers — waterfall destination
-- ---------------------------------------------------------------------------
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS first_gclid text,
  ADD COLUMN IF NOT EXISTS first_fbclid text;

COMMENT ON COLUMN customers.first_gclid IS 'GCLID waterfalled from visitor first-touch — links to original Google Ads click';
COMMENT ON COLUMN customers.first_fbclid IS 'FBCLID waterfalled from visitor first-touch — links to original Facebook Ads click';

-- Index for ad platform conversion queries
CREATE INDEX IF NOT EXISTS idx_customers_first_gclid ON customers (first_gclid) WHERE first_gclid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_first_fbclid ON customers (first_fbclid) WHERE first_fbclid IS NOT NULL;
