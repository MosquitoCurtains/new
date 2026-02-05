-- =============================================================================
-- Google Ads API Integration Schema
-- =============================================================================
-- Adds tables for syncing Google Ads campaign data for ROAS calculation
-- =============================================================================

-- -----------------------------------------------------------------------------
-- google_ads_campaigns: Daily campaign metrics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_ads_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Campaign identification
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  campaign_status TEXT, -- ENABLED, PAUSED, REMOVED
  campaign_type TEXT,   -- SEARCH, DISPLAY, SHOPPING, etc.
  
  -- Date for this data
  date DATE NOT NULL,
  
  -- Cost metrics (in micros - divide by 1,000,000 for dollars)
  cost_micros BIGINT DEFAULT 0,
  
  -- Performance metrics
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  
  -- Conversion metrics
  conversions DECIMAL(10,2) DEFAULT 0,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  
  -- Computed metrics (for convenience)
  ctr DECIMAL(5,4) DEFAULT 0,           -- Click-through rate
  avg_cpc_micros BIGINT DEFAULT 0,      -- Average cost per click
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one row per campaign per day
  CONSTRAINT google_ads_campaigns_unique UNIQUE (campaign_id, date)
);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_google_ads_campaigns_date ON google_ads_campaigns(date);
CREATE INDEX IF NOT EXISTS idx_google_ads_campaigns_campaign_id ON google_ads_campaigns(campaign_id);

-- -----------------------------------------------------------------------------
-- google_ads_keywords: Keyword-level performance (optional, detailed tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_ads_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identification
  campaign_id TEXT NOT NULL,
  ad_group_id TEXT NOT NULL,
  keyword_id TEXT NOT NULL,
  keyword_text TEXT NOT NULL,
  match_type TEXT, -- EXACT, PHRASE, BROAD
  
  -- Date for this data
  date DATE NOT NULL,
  
  -- Metrics
  cost_micros BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions DECIMAL(10,2) DEFAULT 0,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  
  -- Quality metrics
  quality_score INTEGER,
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT google_ads_keywords_unique UNIQUE (keyword_id, date)
);

CREATE INDEX IF NOT EXISTS idx_google_ads_keywords_date ON google_ads_keywords(date);
CREATE INDEX IF NOT EXISTS idx_google_ads_keywords_campaign ON google_ads_keywords(campaign_id);

-- -----------------------------------------------------------------------------
-- google_ads_sync_log: Track sync history
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_ads_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  sync_date DATE NOT NULL,
  sync_type TEXT NOT NULL DEFAULT 'daily', -- daily, backfill, manual
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, in_progress, success, failed
  
  -- Stats
  campaigns_synced INTEGER DEFAULT 0,
  keywords_synced INTEGER DEFAULT 0,
  total_cost_micros BIGINT DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- Error tracking
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_ads_sync_log_date ON google_ads_sync_log(sync_date);

-- -----------------------------------------------------------------------------
-- VIEW: campaign_roas - Join campaign spend with order revenue
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW campaign_roas AS
WITH 
-- Daily campaign spend
campaign_spend AS (
  SELECT 
    date,
    SUM(cost_micros) / 1000000.0 AS total_spend,
    SUM(clicks) AS total_clicks,
    SUM(impressions) AS total_impressions,
    SUM(conversions) AS total_conversions
  FROM google_ads_campaigns
  GROUP BY date
),
-- Daily order revenue (from legacy_orders, grouped by date)
order_revenue AS (
  SELECT 
    DATE(order_date) AS date,
    SUM(total) AS total_revenue,
    COUNT(*) AS order_count
  FROM legacy_orders
  WHERE order_date IS NOT NULL
  GROUP BY DATE(order_date)
)
SELECT 
  COALESCE(cs.date, orv.date) AS date,
  cs.total_spend,
  cs.total_clicks,
  cs.total_impressions,
  cs.total_conversions,
  orv.total_revenue,
  orv.order_count,
  -- ROAS calculation
  CASE 
    WHEN cs.total_spend > 0 THEN ROUND(orv.total_revenue / cs.total_spend, 2)
    ELSE NULL 
  END AS roas,
  -- Cost per order
  CASE 
    WHEN orv.order_count > 0 THEN ROUND(cs.total_spend / orv.order_count, 2)
    ELSE NULL
  END AS cost_per_order
FROM campaign_spend cs
FULL OUTER JOIN order_revenue orv ON cs.date = orv.date
ORDER BY COALESCE(cs.date, orv.date) DESC;

-- -----------------------------------------------------------------------------
-- VIEW: monthly_roas - Monthly aggregated ROAS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW monthly_roas AS
WITH 
monthly_spend AS (
  SELECT 
    DATE_TRUNC('month', date) AS month,
    SUM(cost_micros) / 1000000.0 AS total_spend,
    SUM(clicks) AS total_clicks,
    SUM(impressions) AS total_impressions
  FROM google_ads_campaigns
  GROUP BY DATE_TRUNC('month', date)
),
monthly_revenue AS (
  SELECT 
    DATE_TRUNC('month', order_date) AS month,
    SUM(total) AS total_revenue,
    COUNT(*) AS order_count
  FROM legacy_orders
  WHERE order_date IS NOT NULL
  GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
  COALESCE(ms.month, mr.month) AS month,
  ms.total_spend,
  ms.total_clicks,
  ms.total_impressions,
  mr.total_revenue,
  mr.order_count,
  CASE 
    WHEN ms.total_spend > 0 THEN ROUND(mr.total_revenue / ms.total_spend, 2)
    ELSE NULL 
  END AS roas,
  CASE 
    WHEN mr.order_count > 0 THEN ROUND(ms.total_spend / mr.order_count, 2)
    ELSE NULL
  END AS cost_per_order
FROM monthly_spend ms
FULL OUTER JOIN monthly_revenue mr ON ms.month = mr.month
ORDER BY COALESCE(ms.month, mr.month) DESC;

-- -----------------------------------------------------------------------------
-- VIEW: campaign_performance - Campaign-level metrics with totals
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW campaign_performance AS
SELECT 
  campaign_id,
  campaign_name,
  campaign_type,
  MIN(date) AS first_date,
  MAX(date) AS last_date,
  SUM(cost_micros) / 1000000.0 AS total_spend,
  SUM(clicks) AS total_clicks,
  SUM(impressions) AS total_impressions,
  SUM(conversions) AS total_conversions,
  SUM(conversion_value) AS total_conversion_value,
  -- Calculated metrics
  CASE 
    WHEN SUM(impressions) > 0 
    THEN ROUND(SUM(clicks)::DECIMAL / SUM(impressions) * 100, 2)
    ELSE 0 
  END AS ctr_percent,
  CASE 
    WHEN SUM(clicks) > 0 
    THEN ROUND(SUM(cost_micros) / 1000000.0 / SUM(clicks), 2)
    ELSE 0 
  END AS avg_cpc
FROM google_ads_campaigns
GROUP BY campaign_id, campaign_name, campaign_type
ORDER BY total_spend DESC;

-- -----------------------------------------------------------------------------
-- RLS Policies (admin only)
-- -----------------------------------------------------------------------------
ALTER TABLE google_ads_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_ads_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_ads_sync_log ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access to google_ads_campaigns"
  ON google_ads_campaigns FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to google_ads_keywords"
  ON google_ads_keywords FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to google_ads_sync_log"
  ON google_ads_sync_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE google_ads_campaigns IS 'Daily Google Ads campaign performance metrics synced via API';
COMMENT ON TABLE google_ads_keywords IS 'Optional keyword-level performance data for detailed analysis';
COMMENT ON TABLE google_ads_sync_log IS 'Audit log of Google Ads API sync operations';
COMMENT ON VIEW campaign_roas IS 'Join campaign spend with order revenue for ROAS calculation';
COMMENT ON VIEW monthly_roas IS 'Monthly aggregated ROAS metrics';
COMMENT ON VIEW campaign_performance IS 'Campaign-level aggregate performance metrics';
