-- =============================================================================
-- Site Audit System
-- =============================================================================
-- Comprehensive page tracking for:
-- - Migration status (WordPress → Next.js)
-- - SEO auditing and optimization
-- - AI/LLM readiness checks
-- - Performance metrics (Core Web Vitals)
-- - Approval workflow
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------

-- Migration status
CREATE TYPE page_migration_status AS ENUM (
  'not_started',      -- Still on WordPress only
  'content_extracted', -- Content pulled into markdown
  'in_progress',      -- Being built in Next.js
  'review',           -- Built, awaiting review
  'approved',         -- Approved, ready to go live
  'live',             -- Live on Next.js
  'redirect_only',    -- No Next.js page, just redirect
  'deprecated'        -- Page being removed
);

-- Page type for categorization
CREATE TYPE page_type AS ENUM (
  'homepage',
  'product_landing',    -- Main product pages (MC, CV)
  'seo_landing',        -- SEO-focused pages (screened-porch, etc.)
  'category',           -- Product category pages
  'informational',      -- About, contact, shipping, etc.
  'legal',              -- Privacy, terms, returns
  'support',            -- FAQ, care guides, install guides
  'marketing',          -- Landing pages for ads
  'ecommerce',          -- Cart, checkout, orders
  'admin',              -- Admin pages
  'utility'             -- Sitemap, 404, etc.
);

-- Approval status for review workflow
CREATE TYPE approval_status AS ENUM (
  'draft',
  'pending_review',
  'changes_requested',
  'approved',
  'published'
);

-- SEO score rating
CREATE TYPE audit_rating AS ENUM (
  'excellent',   -- 90-100
  'good',        -- 70-89
  'needs_work',  -- 50-69
  'poor',        -- 0-49
  'not_audited'
);

-- -----------------------------------------------------------------------------
-- MAIN PAGES TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Page identification
  slug TEXT NOT NULL UNIQUE,                    -- e.g., '/screened-porch'
  wordpress_url TEXT,                           -- Original WP URL if different
  title TEXT NOT NULL,                          -- Page title for display
  page_type page_type NOT NULL DEFAULT 'informational',
  
  -- Migration tracking
  migration_status page_migration_status NOT NULL DEFAULT 'not_started',
  migration_priority INTEGER DEFAULT 50,        -- 1-100, higher = more important
  migration_batch TEXT,                         -- e.g., 'batch-1-legal'
  migration_notes TEXT,
  
  -- Content info
  has_content_extraction BOOLEAN DEFAULT FALSE,
  content_extraction_path TEXT,                 -- Path to markdown file
  word_count INTEGER,
  has_images BOOLEAN DEFAULT FALSE,
  image_count INTEGER DEFAULT 0,
  has_video BOOLEAN DEFAULT FALSE,
  video_count INTEGER DEFAULT 0,
  
  -- Approval workflow
  approval_status approval_status NOT NULL DEFAULT 'draft',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Analytics (pulled from GA4)
  monthly_pageviews INTEGER DEFAULT 0,
  monthly_sessions INTEGER DEFAULT 0,
  organic_sessions INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_time_on_page INTEGER,                     -- seconds
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_audited_at TIMESTAMPTZ,
  went_live_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- SEO AUDIT TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Overall score
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  seo_rating audit_rating NOT NULL DEFAULT 'not_audited',
  
  -- Meta tags
  has_meta_title BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_title_length INTEGER,
  meta_title_ok BOOLEAN,                        -- 50-60 chars ideal
  
  has_meta_description BOOLEAN DEFAULT FALSE,
  meta_description TEXT,
  meta_description_length INTEGER,
  meta_description_ok BOOLEAN,                  -- 150-160 chars ideal
  
  has_canonical BOOLEAN DEFAULT FALSE,
  canonical_url TEXT,
  
  -- Open Graph
  has_og_title BOOLEAN DEFAULT FALSE,
  has_og_description BOOLEAN DEFAULT FALSE,
  has_og_image BOOLEAN DEFAULT FALSE,
  og_image_url TEXT,
  
  -- Twitter Card
  has_twitter_card BOOLEAN DEFAULT FALSE,
  
  -- Headings
  has_h1 BOOLEAN DEFAULT FALSE,
  h1_count INTEGER DEFAULT 0,
  h1_text TEXT,
  heading_hierarchy_ok BOOLEAN,                 -- Proper h1 > h2 > h3 structure
  
  -- Images
  images_have_alt BOOLEAN,
  images_missing_alt INTEGER DEFAULT 0,
  
  -- Links
  internal_links_count INTEGER DEFAULT 0,
  external_links_count INTEGER DEFAULT 0,
  broken_links_count INTEGER DEFAULT 0,
  
  -- Technical
  has_robots_meta BOOLEAN DEFAULT FALSE,
  is_indexable BOOLEAN DEFAULT TRUE,
  has_sitemap_entry BOOLEAN DEFAULT FALSE,
  
  -- Mobile
  is_mobile_friendly BOOLEAN,
  viewport_configured BOOLEAN DEFAULT FALSE,
  
  -- Issues found
  issues JSONB DEFAULT '[]'::jsonb,             -- Array of issue objects
  recommendations JSONB DEFAULT '[]'::jsonb,    -- Array of recommendation objects
  
  -- Timestamps
  audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  audited_by UUID REFERENCES auth.users(id),
  
  UNIQUE(page_id)  -- One audit per page (updates in place)
);

-- -----------------------------------------------------------------------------
-- AI READINESS AUDIT TABLE
-- -----------------------------------------------------------------------------
-- Tracks how well pages are optimized for AI crawlers and LLMs

CREATE TABLE ai_readiness_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Overall score
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
  ai_rating audit_rating NOT NULL DEFAULT 'not_audited',
  
  -- Structured Data (Schema.org)
  has_structured_data BOOLEAN DEFAULT FALSE,
  structured_data_types TEXT[],                 -- e.g., ['Product', 'FAQPage', 'BreadcrumbList']
  structured_data_valid BOOLEAN,
  structured_data_errors JSONB DEFAULT '[]'::jsonb,
  
  -- Content Quality for AI
  has_clear_headings BOOLEAN DEFAULT FALSE,
  has_faq_section BOOLEAN DEFAULT FALSE,
  has_how_to_content BOOLEAN DEFAULT FALSE,
  content_is_factual BOOLEAN,                   -- Avoids fluff, marketing speak
  has_specific_details BOOLEAN,                 -- Measurements, specs, concrete info
  
  -- Semantic HTML
  uses_semantic_html BOOLEAN DEFAULT FALSE,
  has_main_element BOOLEAN DEFAULT FALSE,
  has_article_element BOOLEAN DEFAULT FALSE,
  has_nav_element BOOLEAN DEFAULT FALSE,
  has_header_footer BOOLEAN DEFAULT FALSE,
  
  -- Accessibility (helps AI parsing)
  has_aria_labels BOOLEAN DEFAULT FALSE,
  has_skip_links BOOLEAN DEFAULT FALSE,
  form_labels_ok BOOLEAN,
  
  -- Content Extraction Friendliness
  content_in_html BOOLEAN DEFAULT TRUE,         -- vs JavaScript-only
  avoids_infinite_scroll BOOLEAN DEFAULT TRUE,
  has_clear_content_boundaries BOOLEAN,
  
  -- AI-specific meta
  has_ai_txt BOOLEAN DEFAULT FALSE,             -- /ai.txt file reference
  allows_ai_training BOOLEAN DEFAULT TRUE,
  
  -- LLM Citation Readiness
  has_author_info BOOLEAN DEFAULT FALSE,
  has_publish_date BOOLEAN DEFAULT FALSE,
  has_last_updated BOOLEAN DEFAULT FALSE,
  has_sources_citations BOOLEAN DEFAULT FALSE,
  
  -- Issues and recommendations
  issues JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  audited_by UUID REFERENCES auth.users(id),
  
  UNIQUE(page_id)
);

-- -----------------------------------------------------------------------------
-- PERFORMANCE AUDIT TABLE (Core Web Vitals)
-- -----------------------------------------------------------------------------

CREATE TABLE performance_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Overall score
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  performance_rating audit_rating NOT NULL DEFAULT 'not_audited',
  
  -- Core Web Vitals
  lcp_ms INTEGER,                               -- Largest Contentful Paint (ms)
  lcp_rating audit_rating,                      -- good < 2500ms, needs_work < 4000ms
  
  fid_ms INTEGER,                               -- First Input Delay (ms)
  fid_rating audit_rating,                      -- good < 100ms, needs_work < 300ms
  
  cls_score DECIMAL(5,3),                       -- Cumulative Layout Shift
  cls_rating audit_rating,                      -- good < 0.1, needs_work < 0.25
  
  inp_ms INTEGER,                               -- Interaction to Next Paint (ms)
  inp_rating audit_rating,                      -- good < 200ms, needs_work < 500ms
  
  -- Other metrics
  ttfb_ms INTEGER,                              -- Time to First Byte
  fcp_ms INTEGER,                               -- First Contentful Paint
  tti_ms INTEGER,                               -- Time to Interactive
  speed_index INTEGER,
  total_blocking_time_ms INTEGER,
  
  -- Resource metrics
  total_page_size_kb INTEGER,
  html_size_kb INTEGER,
  css_size_kb INTEGER,
  js_size_kb INTEGER,
  image_size_kb INTEGER,
  font_size_kb INTEGER,
  
  -- Request counts
  total_requests INTEGER,
  js_requests INTEGER,
  css_requests INTEGER,
  image_requests INTEGER,
  font_requests INTEGER,
  third_party_requests INTEGER,
  
  -- Lighthouse scores (0-100)
  lighthouse_performance INTEGER,
  lighthouse_accessibility INTEGER,
  lighthouse_best_practices INTEGER,
  lighthouse_seo INTEGER,
  
  -- Device-specific (optional separate tests)
  device_type TEXT DEFAULT 'mobile',            -- 'mobile' or 'desktop'
  
  -- Issues
  issues JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  audited_by UUID REFERENCES auth.users(id)
  
  -- Note: No UNIQUE constraint - can have multiple audits over time
);

-- Index for getting latest audit per page
CREATE INDEX idx_performance_audits_page_latest 
  ON performance_audits(page_id, audited_at DESC);

-- -----------------------------------------------------------------------------
-- AUDIT HISTORY TABLE
-- -----------------------------------------------------------------------------
-- Track all audit runs for historical comparison

CREATE TABLE audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  audit_type TEXT NOT NULL,                     -- 'seo', 'ai', 'performance', 'full'
  
  -- Scores at time of audit
  seo_score INTEGER,
  ai_score INTEGER,
  performance_score INTEGER,
  overall_score INTEGER,
  
  -- Summary
  issues_found INTEGER DEFAULT 0,
  issues_fixed INTEGER DEFAULT 0,
  
  -- Full audit data snapshot
  audit_data JSONB,
  
  -- Timestamps
  audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  audited_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_audit_history_page ON audit_history(page_id, audited_at DESC);

-- -----------------------------------------------------------------------------
-- APPROVAL WORKFLOW TABLE
-- -----------------------------------------------------------------------------
-- Track approval requests and reviews

CREATE TABLE page_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Request info
  requested_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_notes TEXT,
  
  -- Review info
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Decision
  decision TEXT CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  decision_notes TEXT,
  
  -- Checklist items
  checklist JSONB DEFAULT '{
    "content_accurate": null,
    "design_system_compliant": null,
    "seo_optimized": null,
    "mobile_responsive": null,
    "images_optimized": null,
    "links_working": null,
    "performance_acceptable": null
  }'::jsonb,
  
  -- Status
  is_complete BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_page_approvals_page ON page_approvals(page_id, requested_at DESC);
CREATE INDEX idx_page_approvals_pending ON page_approvals(is_complete) WHERE is_complete = FALSE;

-- -----------------------------------------------------------------------------
-- VIEWS
-- -----------------------------------------------------------------------------

-- Dashboard view with all scores
CREATE VIEW page_audit_dashboard AS
SELECT 
  sp.id,
  sp.slug,
  sp.title,
  sp.page_type,
  sp.migration_status,
  sp.migration_priority,
  sp.approval_status,
  sp.monthly_pageviews,
  sp.organic_sessions,
  
  -- SEO
  sa.seo_score,
  sa.seo_rating,
  sa.has_meta_title,
  sa.has_meta_description,
  sa.has_h1,
  
  -- AI Readiness
  ar.ai_score,
  ar.ai_rating,
  ar.has_structured_data,
  ar.uses_semantic_html,
  
  -- Performance (latest)
  pa.performance_score,
  pa.performance_rating,
  pa.lcp_ms,
  pa.cls_score,
  
  -- Calculated overall score
  ROUND(
    (COALESCE(sa.seo_score, 0) * 0.35) + 
    (COALESCE(ar.ai_score, 0) * 0.25) + 
    (COALESCE(pa.performance_score, 0) * 0.40)
  ) AS overall_score,
  
  sp.updated_at,
  sp.last_audited_at

FROM site_pages sp
LEFT JOIN seo_audits sa ON sa.page_id = sp.id
LEFT JOIN ai_readiness_audits ar ON ar.page_id = sp.id
LEFT JOIN LATERAL (
  SELECT * FROM performance_audits 
  WHERE page_id = sp.id 
  ORDER BY audited_at DESC 
  LIMIT 1
) pa ON TRUE;

-- Migration progress view
CREATE VIEW migration_progress AS
SELECT 
  migration_status,
  page_type,
  COUNT(*) as page_count,
  ROUND(AVG(migration_priority)) as avg_priority,
  SUM(monthly_pageviews) as total_pageviews
FROM site_pages
GROUP BY migration_status, page_type
ORDER BY migration_status, page_type;

-- Pages needing attention view
CREATE VIEW pages_needing_attention AS
SELECT 
  sp.slug,
  sp.title,
  sp.page_type,
  sa.seo_score,
  ar.ai_score,
  pa.performance_score,
  CASE 
    WHEN sa.seo_score < 50 THEN 'Poor SEO'
    WHEN ar.ai_score < 50 THEN 'Poor AI Readiness'
    WHEN pa.performance_score < 50 THEN 'Poor Performance'
    WHEN sp.approval_status = 'changes_requested' THEN 'Changes Requested'
    ELSE 'Needs Review'
  END as attention_reason
FROM site_pages sp
LEFT JOIN seo_audits sa ON sa.page_id = sp.id
LEFT JOIN ai_readiness_audits ar ON ar.page_id = sp.id
LEFT JOIN LATERAL (
  SELECT * FROM performance_audits 
  WHERE page_id = sp.id 
  ORDER BY audited_at DESC 
  LIMIT 1
) pa ON TRUE
WHERE 
  sp.migration_status = 'live'
  AND (
    sa.seo_score < 50 
    OR ar.ai_score < 50 
    OR pa.performance_score < 50
    OR sp.approval_status = 'changes_requested'
  )
ORDER BY 
  LEAST(
    COALESCE(sa.seo_score, 100), 
    COALESCE(ar.ai_score, 100), 
    COALESCE(pa.performance_score, 100)
  );

-- -----------------------------------------------------------------------------
-- FUNCTIONS
-- -----------------------------------------------------------------------------

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_site_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_pages_updated_at
  BEFORE UPDATE ON site_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_site_pages_updated_at();

-- Function to calculate SEO score
CREATE OR REPLACE FUNCTION calculate_seo_score(audit_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  audit_row seo_audits%ROWTYPE;
BEGIN
  SELECT * INTO audit_row FROM seo_audits WHERE id = audit_id;
  
  -- Meta title (15 points)
  IF audit_row.has_meta_title AND audit_row.meta_title_ok THEN
    score := score + 15;
  ELSIF audit_row.has_meta_title THEN
    score := score + 8;
  END IF;
  
  -- Meta description (15 points)
  IF audit_row.has_meta_description AND audit_row.meta_description_ok THEN
    score := score + 15;
  ELSIF audit_row.has_meta_description THEN
    score := score + 8;
  END IF;
  
  -- H1 (10 points)
  IF audit_row.has_h1 AND audit_row.h1_count = 1 THEN
    score := score + 10;
  ELSIF audit_row.has_h1 THEN
    score := score + 5;
  END IF;
  
  -- Heading hierarchy (10 points)
  IF audit_row.heading_hierarchy_ok THEN
    score := score + 10;
  END IF;
  
  -- Open Graph (10 points)
  IF audit_row.has_og_title AND audit_row.has_og_description AND audit_row.has_og_image THEN
    score := score + 10;
  ELSIF audit_row.has_og_title OR audit_row.has_og_description THEN
    score := score + 5;
  END IF;
  
  -- Images with alt (10 points)
  IF audit_row.images_have_alt THEN
    score := score + 10;
  ELSIF audit_row.images_missing_alt = 0 THEN
    score := score + 10;
  ELSIF audit_row.images_missing_alt < 3 THEN
    score := score + 5;
  END IF;
  
  -- Internal links (10 points)
  IF audit_row.internal_links_count >= 3 THEN
    score := score + 10;
  ELSIF audit_row.internal_links_count >= 1 THEN
    score := score + 5;
  END IF;
  
  -- No broken links (10 points)
  IF audit_row.broken_links_count = 0 THEN
    score := score + 10;
  END IF;
  
  -- Mobile friendly (5 points)
  IF audit_row.is_mobile_friendly THEN
    score := score + 5;
  END IF;
  
  -- Canonical URL (5 points)
  IF audit_row.has_canonical THEN
    score := score + 5;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_readiness_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_approvals ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (adjust based on your auth setup)
-- For now, allow authenticated users to read, but only admins to write

CREATE POLICY "Allow read for authenticated users" ON site_pages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON seo_audits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON ai_readiness_audits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON performance_audits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON audit_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON page_approvals
  FOR SELECT TO authenticated USING (true);

-- Service role can do everything
CREATE POLICY "Service role full access" ON site_pages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON seo_audits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON ai_readiness_audits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON performance_audits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON audit_history
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON page_approvals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- SEED DATA: Initial page inventory from migration tracker
-- -----------------------------------------------------------------------------

-- Insert pages from migration tracker (status based on current progress)
INSERT INTO site_pages (slug, wordpress_url, title, page_type, migration_status, migration_priority, migration_batch) VALUES
-- Already Live (from 10-page test)
('/privacy-policy', '/privacy-policy/', 'Privacy Policy', 'legal', 'live', 95, 'batch-1-legal'),
('/returns', '/returns/', 'Returns Policy', 'legal', 'live', 90, 'batch-1-legal'),
('/faq', '/mc-faq/', 'FAQ Hub', 'support', 'live', 85, 'batch-1-legal'),
('/faq/mosquito-curtains', '/mosquito-curtains-faq/', 'Mosquito Curtains FAQ', 'support', 'live', 85, 'batch-1-legal'),
('/french-door-screens', '/french-door-screens/', 'French Door Screens', 'seo_landing', 'live', 80, 'batch-2-seo'),
('/boat-screens', '/boat-screens/', 'Boat Screens', 'seo_landing', 'live', 75, 'batch-2-seo'),
('/weather-curtains', '/weather-curtains/', 'Weather Curtains', 'seo_landing', 'live', 70, 'batch-2-seo'),
('/pollen-protection', '/pollen-protection/', 'Pollen Protection', 'seo_landing', 'live', 70, 'batch-2-seo'),
('/fb', '/fb/', 'Facebook Landing', 'marketing', 'live', 65, 'batch-3-marketing'),
('/opportunities', '/opportunities/', 'Career Opportunities', 'informational', 'live', 50, 'batch-6-company'),

-- Previously built pages
('/', '/', 'Homepage', 'homepage', 'live', 100, 'core'),
('/screened-porch-enclosures', '/screened-porch-enclosures/', 'Mosquito Curtains', 'product_landing', 'live', 100, 'core'),
('/clear-vinyl-plastic-patio-enclosures', '/clear-vinyl-plastic-patio-enclosures/', 'Clear Vinyl Enclosures', 'product_landing', 'live', 100, 'core'),
('/screened-porch', '/screened-porch/', 'Screened Porch', 'seo_landing', 'live', 95, 'core'),
('/screen-patio', '/screen-patio/', 'Screen Patio', 'seo_landing', 'live', 95, 'core'),
('/garage-door-screens', '/garage-door-screens/', 'Garage Door Screens', 'seo_landing', 'live', 90, 'core'),
('/pergola-screen-curtains', '/pergola-screen-curtains/', 'Pergola Screens', 'seo_landing', 'live', 90, 'core'),
('/gazebo-screen-curtains', '/gazebo-screen-curtains/', 'Gazebo Screens', 'seo_landing', 'live', 85, 'core'),
('/screened-in-decks', '/screened-in-decks/', 'Screened-In Decks', 'seo_landing', 'live', 85, 'core'),
('/awning-screen-enclosures', '/awning-screen-enclosures/', 'Awning Enclosures', 'seo_landing', 'live', 80, 'core'),
('/industrial-netting', '/industrial-netting/', 'Industrial Netting', 'seo_landing', 'live', 75, 'core'),
('/start-project', '/start-project/', 'Start Project', 'ecommerce', 'live', 100, 'core'),
('/cart', '/cart/', 'Shopping Cart', 'ecommerce', 'live', 100, 'core'),
('/about', '/about/', 'About Us', 'informational', 'live', 70, 'core'),
('/contact', '/contact/', 'Contact', 'informational', 'live', 90, 'core'),
('/shipping', '/shipping/', 'Shipping', 'informational', 'live', 85, 'core'),
('/reviews', '/reviews/', 'Reviews', 'informational', 'live', 80, 'core'),
('/gallery', '/gallery/', 'Gallery', 'informational', 'live', 75, 'core'),
('/options', '/options/', 'Options Guide', 'support', 'live', 85, 'core'),
('/install', '/install/', 'Installation Hub', 'support', 'live', 80, 'core'),
('/care/mosquito-curtains', '/care/mosquito-curtains/', 'MC Care Guide', 'support', 'live', 75, 'core'),
('/care/clear-vinyl', '/care/clear-vinyl/', 'CV Care Guide', 'support', 'live', 75, 'core'),

-- High priority TODO pages
('/instant-quote', '/mc-instant-quote/', 'Instant Quote Calculator', 'ecommerce', 'not_started', 98, 'batch-1-legal'),
('/mosquito-netting-fabric', '/mosquito-netting-fabric/', 'Mosquito Netting Fabric', 'product_landing', 'not_started', 92, 'batch-4-products'),
('/clear-vinyl-mesh-combo', '/clear-vinyl-mesh-combo/', 'Clear Vinyl Mesh Combo', 'product_landing', 'not_started', 90, 'batch-4-products'),
('/horse-stall-screens', '/horse-stall-screens/', 'Horse Stall Screens', 'seo_landing', 'not_started', 85, 'batch-2-seo'),
('/bug-off-screen-doors', '/bug-off-screen-doors/', 'Bug Off Screen Doors', 'seo_landing', 'not_started', 80, 'batch-2-seo'),
('/retractable-screens', '/retractable-screens/', 'Retractable Screens', 'seo_landing', 'not_started', 78, 'batch-2-seo'),

-- Medium priority
('/sample-kit', '/sample-kit/', 'Sample Kit', 'ecommerce', 'not_started', 75, 'batch-5-support'),
('/measure-guide', '/how-to-measure/', 'How to Measure', 'support', 'not_started', 75, 'batch-5-support'),
('/attachment-guide', '/attachment-systems/', 'Attachment Guide', 'support', 'not_started', 70, 'batch-5-support'),
('/terms-of-service', '/terms-of-service/', 'Terms of Service', 'legal', 'not_started', 65, 'batch-1-legal'),

-- Lower priority SEO pages
('/patio-curtains', '/patio-curtains/', 'Patio Curtains', 'seo_landing', 'not_started', 60, 'batch-7-seo'),
('/outdoor-curtains', '/outdoor-curtains/', 'Outdoor Curtains', 'seo_landing', 'not_started', 60, 'batch-7-seo'),
('/mosquito-netting', '/mosquito-netting/', 'Mosquito Netting', 'seo_landing', 'not_started', 58, 'batch-7-seo'),
('/porch-curtains', '/porch-curtains/', 'Porch Curtains', 'seo_landing', 'not_started', 55, 'batch-7-seo'),
('/porch-enclosure', '/porch-enclosure/', 'Porch Enclosure', 'seo_landing', 'not_started', 55, 'batch-7-seo')

ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX idx_site_pages_status ON site_pages(migration_status);
CREATE INDEX idx_site_pages_type ON site_pages(page_type);
CREATE INDEX idx_site_pages_priority ON site_pages(migration_priority DESC);
CREATE INDEX idx_site_pages_approval ON site_pages(approval_status);
CREATE INDEX idx_site_pages_batch ON site_pages(migration_batch);

-- -----------------------------------------------------------------------------
-- COMMENTS
-- -----------------------------------------------------------------------------

COMMENT ON TABLE site_pages IS 'Master inventory of all site pages with migration and audit status';
COMMENT ON TABLE seo_audits IS 'SEO audit results for each page';
COMMENT ON TABLE ai_readiness_audits IS 'AI/LLM readiness audit results';
COMMENT ON TABLE performance_audits IS 'Core Web Vitals and performance metrics';
COMMENT ON TABLE audit_history IS 'Historical audit snapshots for trend analysis';
COMMENT ON TABLE page_approvals IS 'Approval workflow requests and reviews';
COMMENT ON VIEW page_audit_dashboard IS 'Combined view of all audit scores for dashboard display';
COMMENT ON VIEW migration_progress IS 'Aggregated migration progress by status and type';
COMMENT ON VIEW pages_needing_attention IS 'Pages with low scores that need work';
