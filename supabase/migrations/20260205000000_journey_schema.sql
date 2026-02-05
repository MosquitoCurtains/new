-- =============================================================================
-- Customer Journey Database Migration
-- Creates waterfall attribution tracking system
-- =============================================================================

-- =============================================================================
-- PHASE 1: NEW TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- visitors: Anonymous visitor tracking (cookie-based, pre-identification)
-- -----------------------------------------------------------------------------
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT UNIQUE NOT NULL, -- browser cookie/fingerprint (mc_visitor_id)
  
  -- First touch attribution (NEVER changes after creation)
  first_landing_page TEXT,
  first_referrer TEXT,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_utm_term TEXT,
  first_utm_content TEXT,
  
  -- Latest touch (updates each new session)
  last_landing_page TEXT,
  last_utm_source TEXT,
  last_utm_medium TEXT,
  last_utm_campaign TEXT,
  
  -- Metadata
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  session_count INTEGER DEFAULT 1,
  total_pageviews INTEGER DEFAULT 0,
  
  -- Link to identified customer (NULL until email captured)
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for visitors
CREATE INDEX idx_visitors_fingerprint ON public.visitors(fingerprint);
CREATE INDEX idx_visitors_customer_id ON public.visitors(customer_id);
CREATE INDEX idx_visitors_first_seen ON public.visitors(first_seen_at DESC);
CREATE INDEX idx_visitors_last_seen ON public.visitors(last_seen_at DESC);
CREATE INDEX idx_visitors_first_utm_source ON public.visitors(first_utm_source);
CREATE INDEX idx_visitors_first_utm_campaign ON public.visitors(first_utm_campaign);

-- -----------------------------------------------------------------------------
-- sessions: Individual visit sessions with attribution
-- -----------------------------------------------------------------------------
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  
  -- Session attribution (for THIS visit)
  landing_page TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Session metadata
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  
  -- Engagement metrics
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  pageview_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  
  -- Conversion tracking
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT, -- 'email', 'quote', 'purchase'
  conversion_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX idx_sessions_visitor_id ON public.sessions(visitor_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at DESC);
CREATE INDEX idx_sessions_utm_source ON public.sessions(utm_source);
CREATE INDEX idx_sessions_utm_campaign ON public.sessions(utm_campaign);
CREATE INDEX idx_sessions_converted ON public.sessions(converted) WHERE converted = TRUE;
CREATE INDEX idx_sessions_landing_page ON public.sessions(landing_page);

-- -----------------------------------------------------------------------------
-- page_views: Individual page views within sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  
  -- Page data
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_url TEXT,
  
  -- Engagement metrics
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  time_on_page_seconds INTEGER,
  scroll_depth INTEGER, -- 0-100 percentage
  
  -- Sequence within session
  view_order INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for page_views
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_visitor_id ON public.page_views(visitor_id);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_page_views_viewed_at ON public.page_views(viewed_at DESC);

-- -----------------------------------------------------------------------------
-- journey_events: Conversion and milestone events
-- -----------------------------------------------------------------------------
CREATE TABLE public.journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Event info
  event_type TEXT NOT NULL, -- See event_type_check constraint below
  event_data JSONB DEFAULT '{}', -- Flexible payload for event-specific data
  
  -- Context
  page_path TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint for valid event types
ALTER TABLE public.journey_events
ADD CONSTRAINT journey_events_event_type_check 
CHECK (event_type IN (
  'email_captured',
  'quote_started',
  'quote_submitted',
  'photos_uploaded',
  'cart_created',
  'cart_updated',
  'cart_sent',
  'checkout_started',
  'payment_initiated',
  'purchase_completed',
  'project_created',
  'project_updated'
));

-- Indexes for journey_events
CREATE INDEX idx_journey_events_visitor_id ON public.journey_events(visitor_id);
CREATE INDEX idx_journey_events_session_id ON public.journey_events(session_id);
CREATE INDEX idx_journey_events_customer_id ON public.journey_events(customer_id);
CREATE INDEX idx_journey_events_event_type ON public.journey_events(event_type);
CREATE INDEX idx_journey_events_created_at ON public.journey_events(created_at DESC);

-- -----------------------------------------------------------------------------
-- page_analytics: Daily GA4 data sync for historical/aggregate page metrics
-- -----------------------------------------------------------------------------
CREATE TABLE public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  date DATE NOT NULL,
  
  -- Traffic metrics
  pageviews INTEGER DEFAULT 0,
  unique_pageviews INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  organic_sessions INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  
  -- Engagement metrics
  avg_time_on_page DECIMAL(10,2),
  bounce_rate DECIMAL(5,4),
  exit_rate DECIMAL(5,4),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint for upserts
  UNIQUE(page_path, date)
);

-- Indexes for page_analytics
CREATE INDEX idx_page_analytics_page_path ON public.page_analytics(page_path);
CREATE INDEX idx_page_analytics_date ON public.page_analytics(date DESC);
CREATE INDEX idx_page_analytics_organic ON public.page_analytics(organic_sessions DESC);

-- -----------------------------------------------------------------------------
-- traffic_sources: GA4 traffic breakdown by channel
-- -----------------------------------------------------------------------------
CREATE TABLE public.traffic_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  date DATE NOT NULL,
  channel TEXT NOT NULL, -- 'Organic Search', 'Direct', 'Paid Search', 'Referral', etc.
  
  -- Metrics
  sessions INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint for upserts
  UNIQUE(page_path, date, channel)
);

-- Indexes for traffic_sources
CREATE INDEX idx_traffic_sources_page_path ON public.traffic_sources(page_path);
CREATE INDEX idx_traffic_sources_date ON public.traffic_sources(date DESC);
CREATE INDEX idx_traffic_sources_channel ON public.traffic_sources(channel);

-- -----------------------------------------------------------------------------
-- analytics_sync_log: Track GA4 sync history
-- -----------------------------------------------------------------------------
CREATE TABLE public.analytics_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_date DATE NOT NULL,
  sync_type TEXT DEFAULT 'daily', -- 'daily', 'backfill', 'manual'
  
  -- Results
  records_synced INTEGER DEFAULT 0,
  pages_synced INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success', -- 'success', 'partial', 'failed'
  error_message TEXT,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sync log
CREATE INDEX idx_analytics_sync_log_date ON public.analytics_sync_log(sync_date DESC);
CREATE INDEX idx_analytics_sync_log_status ON public.analytics_sync_log(status);

-- =============================================================================
-- PHASE 2: ALTER EXISTING TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Add first-touch attribution columns to customers
-- -----------------------------------------------------------------------------
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS first_utm_source TEXT,
ADD COLUMN IF NOT EXISTS first_utm_medium TEXT,
ADD COLUMN IF NOT EXISTS first_utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS first_utm_term TEXT,
ADD COLUMN IF NOT EXISTS first_utm_content TEXT,
ADD COLUMN IF NOT EXISTS first_landing_page TEXT,
ADD COLUMN IF NOT EXISTS first_referrer TEXT,
ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_captured_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS first_quote_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS first_purchase_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS customer_status TEXT DEFAULT 'lead';

-- Add constraint for customer_status (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customers_status_check'
  ) THEN
    ALTER TABLE public.customers
    ADD CONSTRAINT customers_status_check 
    CHECK (customer_status IN ('lead', 'quoted', 'customer', 'repeat', 'churned'));
  END IF;
END $$;

-- Index for customer attribution queries
CREATE INDEX IF NOT EXISTS idx_customers_first_utm_source ON public.customers(first_utm_source);
CREATE INDEX IF NOT EXISTS idx_customers_first_utm_campaign ON public.customers(first_utm_campaign);
CREATE INDEX IF NOT EXISTS idx_customers_customer_status ON public.customers(customer_status);
CREATE INDEX IF NOT EXISTS idx_customers_first_seen_at ON public.customers(first_seen_at DESC);

-- -----------------------------------------------------------------------------
-- Add journey tracking columns to orders
-- -----------------------------------------------------------------------------
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS visitor_id UUID REFERENCES public.visitors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS first_utm_source TEXT,
ADD COLUMN IF NOT EXISTS first_utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS converting_utm_source TEXT,
ADD COLUMN IF NOT EXISTS converting_utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS salesperson_id TEXT,
ADD COLUMN IF NOT EXISTS salesperson_name TEXT,
ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT 'online_self';

-- Add constraint for order_source (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_source_check'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT orders_source_check 
    CHECK (order_source IN ('online_self', 'online_sent_cart', 'phone', 'manual', 'legacy'));
  END IF;
END $$;

-- Indexes for order attribution
CREATE INDEX IF NOT EXISTS idx_orders_visitor_id ON public.orders(visitor_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON public.orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_first_utm_source ON public.orders(first_utm_source);
CREATE INDEX IF NOT EXISTS idx_orders_salesperson_id ON public.orders(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_source ON public.orders(order_source);

-- =============================================================================
-- PHASE 3: VIEWS FOR REPORTING
-- =============================================================================

-- -----------------------------------------------------------------------------
-- customer_journey: Full customer journey view with metrics
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_journey AS
SELECT 
  c.id AS customer_id,
  c.email,
  c.first_name,
  c.last_name,
  c.phone,
  c.customer_status,
  
  -- First touch attribution
  c.first_utm_source,
  c.first_utm_medium,
  c.first_utm_campaign,
  c.first_landing_page,
  c.first_referrer,
  
  -- Lifecycle timestamps
  c.first_seen_at,
  c.email_captured_at,
  c.first_quote_at,
  c.first_purchase_at,
  c.created_at AS customer_created_at,
  
  -- Aggregates
  c.total_orders,
  c.total_spent,
  c.average_order_value,
  c.ltv_tier,
  
  -- Visitor metrics (if linked)
  v.session_count,
  v.total_pageviews,
  v.last_seen_at AS visitor_last_seen,
  
  -- Calculated fields
  EXTRACT(DAY FROM (c.email_captured_at - c.first_seen_at)) AS days_to_email,
  EXTRACT(DAY FROM (c.first_purchase_at - c.first_seen_at)) AS days_to_purchase,
  EXTRACT(DAY FROM (c.first_purchase_at - c.email_captured_at)) AS days_email_to_purchase
  
FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id;

-- -----------------------------------------------------------------------------
-- campaign_attribution: Campaign performance metrics
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.campaign_attribution AS
SELECT 
  COALESCE(first_utm_source, '(direct)') AS source,
  COALESCE(first_utm_campaign, '(none)') AS campaign,
  
  -- Customer counts
  COUNT(DISTINCT id) AS total_customers,
  COUNT(DISTINCT CASE WHEN customer_status = 'lead' THEN id END) AS leads,
  COUNT(DISTINCT CASE WHEN customer_status = 'quoted' THEN id END) AS quoted,
  COUNT(DISTINCT CASE WHEN customer_status IN ('customer', 'repeat') THEN id END) AS purchasers,
  
  -- Revenue
  SUM(total_spent) AS total_revenue,
  AVG(total_spent) FILTER (WHERE total_spent > 0) AS avg_customer_value,
  AVG(average_order_value) FILTER (WHERE average_order_value > 0) AS avg_order_value,
  
  -- Conversion rate
  ROUND(
    COUNT(DISTINCT CASE WHEN customer_status IN ('customer', 'repeat') THEN id END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT id), 0) * 100, 
    2
  ) AS conversion_rate_pct
  
FROM public.customers
GROUP BY COALESCE(first_utm_source, '(direct)'), COALESCE(first_utm_campaign, '(none)')
ORDER BY total_revenue DESC NULLS LAST;

-- -----------------------------------------------------------------------------
-- funnel_metrics: Conversion funnel aggregates
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.funnel_metrics AS
SELECT
  'visitors' AS stage,
  1 AS stage_order,
  COUNT(*) AS count,
  100.0 AS conversion_rate
FROM public.visitors
WHERE first_seen_at >= NOW() - INTERVAL '30 days'

UNION ALL

SELECT
  'email_captured' AS stage,
  2 AS stage_order,
  COUNT(*) AS count,
  ROUND(COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM public.visitors WHERE first_seen_at >= NOW() - INTERVAL '30 days'), 0) * 100, 2) AS conversion_rate
FROM public.visitors v
WHERE v.customer_id IS NOT NULL
AND v.first_seen_at >= NOW() - INTERVAL '30 days'

UNION ALL

SELECT
  'quoted' AS stage,
  3 AS stage_order,
  COUNT(*) AS count,
  ROUND(COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM public.visitors WHERE first_seen_at >= NOW() - INTERVAL '30 days'), 0) * 100, 2) AS conversion_rate
FROM public.customers c
WHERE c.customer_status IN ('quoted', 'customer', 'repeat')
AND c.created_at >= NOW() - INTERVAL '30 days'

UNION ALL

SELECT
  'purchased' AS stage,
  4 AS stage_order,
  COUNT(*) AS count,
  ROUND(COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM public.visitors WHERE first_seen_at >= NOW() - INTERVAL '30 days'), 0) * 100, 2) AS conversion_rate
FROM public.customers c
WHERE c.customer_status IN ('customer', 'repeat')
AND c.first_purchase_at >= NOW() - INTERVAL '30 days'

ORDER BY stage_order;

-- =============================================================================
-- PHASE 4: ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sync_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for API routes)
CREATE POLICY "Service role has full access to visitors"
  ON public.visitors FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to sessions"
  ON public.sessions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to page_views"
  ON public.page_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to journey_events"
  ON public.journey_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to page_analytics"
  ON public.page_analytics FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to traffic_sources"
  ON public.traffic_sources FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to analytics_sync_log"
  ON public.analytics_sync_log FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users (admin) can read analytics
CREATE POLICY "Authenticated users can read page_analytics"
  ON public.page_analytics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read traffic_sources"
  ON public.traffic_sources FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read analytics_sync_log"
  ON public.analytics_sync_log FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- PHASE 5: FUNCTIONS AND TRIGGERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Function: Update visitor last_seen and session_count
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_visitor_on_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.visitors
  SET 
    last_seen_at = NEW.started_at,
    last_landing_page = NEW.landing_page,
    last_utm_source = NEW.utm_source,
    last_utm_medium = NEW.utm_medium,
    last_utm_campaign = NEW.utm_campaign,
    session_count = session_count + 1,
    updated_at = NOW()
  WHERE id = NEW.visitor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On new session, update visitor
CREATE TRIGGER trigger_update_visitor_on_session
  AFTER INSERT ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_visitor_on_session();

-- -----------------------------------------------------------------------------
-- Function: Update visitor pageview count
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_visitor_pageview_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.visitors
  SET 
    total_pageviews = total_pageviews + 1,
    updated_at = NOW()
  WHERE id = NEW.visitor_id;
  
  -- Also update session pageview count
  UPDATE public.sessions
  SET 
    pageview_count = pageview_count + 1,
    last_activity_at = NEW.viewed_at,
    updated_at = NOW()
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On new page_view, update counts
CREATE TRIGGER trigger_update_pageview_counts
  AFTER INSERT ON public.page_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_visitor_pageview_count();

-- -----------------------------------------------------------------------------
-- Function: Update customer status on events
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_customer_on_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if we have a customer_id
  IF NEW.customer_id IS NOT NULL THEN
    CASE NEW.event_type
      WHEN 'quote_submitted' THEN
        UPDATE public.customers
        SET 
          customer_status = CASE WHEN customer_status = 'lead' THEN 'quoted' ELSE customer_status END,
          first_quote_at = COALESCE(first_quote_at, NEW.created_at),
          updated_at = NOW()
        WHERE id = NEW.customer_id;
        
      WHEN 'purchase_completed' THEN
        UPDATE public.customers
        SET 
          customer_status = CASE 
            WHEN customer_status IN ('lead', 'quoted') THEN 'customer' 
            WHEN customer_status = 'customer' THEN 'repeat'
            ELSE customer_status 
          END,
          first_purchase_at = COALESCE(first_purchase_at, NEW.created_at),
          updated_at = NOW()
        WHERE id = NEW.customer_id;
        
      ELSE
        -- No status change for other events
        NULL;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On journey event, update customer
CREATE TRIGGER trigger_update_customer_on_event
  AFTER INSERT ON public.journey_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_on_event();

-- -----------------------------------------------------------------------------
-- Function: updated_at trigger for new tables
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_visitors_updated_at
  BEFORE UPDATE ON public.visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_page_analytics_updated_at
  BEFORE UPDATE ON public.page_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.visitors IS 'Anonymous visitor tracking with first-touch attribution. Cookie-based identification until email capture.';
COMMENT ON TABLE public.sessions IS 'Individual browsing sessions linked to visitors. Each visit creates a new session.';
COMMENT ON TABLE public.page_views IS 'Individual page views within sessions for detailed journey tracking.';
COMMENT ON TABLE public.journey_events IS 'Conversion and milestone events (email capture, quote, purchase, etc).';
COMMENT ON TABLE public.page_analytics IS 'Daily aggregated page metrics synced from GA4.';
COMMENT ON TABLE public.traffic_sources IS 'Traffic source breakdown by channel, synced from GA4.';
COMMENT ON TABLE public.analytics_sync_log IS 'Log of GA4 sync operations for monitoring.';

COMMENT ON VIEW public.customer_journey IS 'Full customer journey with attribution, lifecycle stages, and metrics.';
COMMENT ON VIEW public.campaign_attribution IS 'Campaign performance aggregated by source and campaign.';
COMMENT ON VIEW public.funnel_metrics IS 'Conversion funnel metrics for last 30 days.';
