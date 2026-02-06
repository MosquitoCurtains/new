-- =============================================================================
-- Page Issues & Notes Tracking System
-- =============================================================================
-- Track specific issues per page with:
-- - Issue type categorization
-- - Notes and context
-- - Timestamps (created, updated, resolved)
-- - Sequential workflow for audits and revisions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------

-- Issue categories
CREATE TYPE issue_category AS ENUM (
  'assets',           -- Images, videos, files
  'content',          -- Text, copy, information
  'seo',              -- Meta tags, headings, structure
  'performance',      -- Speed, Core Web Vitals
  'accessibility',    -- A11y issues
  'design',           -- Design system compliance
  'functionality',    -- Broken features, bugs
  'mobile',           -- Mobile-specific issues
  'ai_readiness',     -- Structured data, semantic HTML
  'legal',            -- Compliance, privacy
  'other'
);

-- Issue severity
CREATE TYPE issue_severity AS ENUM (
  'critical',    -- Blocks launch, must fix immediately
  'high',        -- Should fix before launch
  'medium',      -- Fix soon, not blocking
  'low',         -- Nice to have
  'info'         -- Informational note, not an issue
);

-- Issue status
CREATE TYPE issue_status AS ENUM (
  'open',           -- Newly identified
  'acknowledged',   -- Seen, will address
  'in_progress',    -- Being worked on
  'blocked',        -- Waiting on something
  'resolved',       -- Fixed
  'wont_fix',       -- Decided not to fix
  'duplicate'       -- Same as another issue
);

-- -----------------------------------------------------------------------------
-- PAGE ISSUES TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE page_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Issue details
  category issue_category NOT NULL,
  severity issue_severity NOT NULL DEFAULT 'medium',
  status issue_status NOT NULL DEFAULT 'open',
  
  -- Short title for quick scanning
  title TEXT NOT NULL,
  
  -- Detailed description
  description TEXT,
  
  -- What action is needed
  action_required TEXT,
  
  -- Notes (can be updated over time)
  notes TEXT,
  
  -- For assets issues: which assets are affected
  affected_assets JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"type": "image", "name": "hero.jpg", "issue": "missing alt"}, ...]
  
  -- Linking
  related_issue_id UUID REFERENCES page_issues(id),  -- For duplicates or related
  audit_id UUID,  -- If created from an audit
  
  -- Assignment
  assigned_to TEXT,  -- Could be a name or email
  
  -- Resolution
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- For ordering
  sort_order INTEGER DEFAULT 0
);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_page_issues_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Auto-set resolved_at when status changes to resolved
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER page_issues_updated
  BEFORE UPDATE ON page_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_page_issues_timestamp();

-- -----------------------------------------------------------------------------
-- PAGE NOTES TABLE (General notes, not issues)
-- -----------------------------------------------------------------------------

CREATE TABLE page_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Note content
  note TEXT NOT NULL,
  
  -- Optional categorization
  note_type TEXT DEFAULT 'general',  -- 'general', 'reminder', 'question', 'decision', 'context'
  
  -- Who wrote it
  author TEXT,
  
  -- Pin important notes
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER page_notes_updated
  BEFORE UPDATE ON page_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_page_issues_timestamp();

-- -----------------------------------------------------------------------------
-- AUDIT SEQUENCE TABLE
-- -----------------------------------------------------------------------------
-- Track which audits have been run on each page and when

CREATE TABLE page_audit_sequence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES site_pages(id) ON DELETE CASCADE,
  
  -- Sequence tracking
  sequence_name TEXT NOT NULL,  -- e.g., 'pre_launch_checklist', 'quarterly_review'
  
  -- Individual checks in the sequence
  checks JSONB NOT NULL DEFAULT '{
    "content_review": {"status": "pending", "completed_at": null, "notes": null},
    "assets_complete": {"status": "pending", "completed_at": null, "notes": null},
    "seo_audit": {"status": "pending", "completed_at": null, "notes": null},
    "performance_check": {"status": "pending", "completed_at": null, "notes": null},
    "mobile_test": {"status": "pending", "completed_at": null, "notes": null},
    "ai_readiness": {"status": "pending", "completed_at": null, "notes": null},
    "final_review": {"status": "pending", "completed_at": null, "notes": null}
  }'::jsonb,
  
  -- Overall status
  is_complete BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(page_id, sequence_name)
);

CREATE TRIGGER page_audit_sequence_updated
  BEFORE UPDATE ON page_audit_sequence
  FOR EACH ROW
  EXECUTE FUNCTION update_page_issues_timestamp();

-- -----------------------------------------------------------------------------
-- COMMON ISSUE TEMPLATES
-- -----------------------------------------------------------------------------
-- Pre-defined issues that can be quickly added

CREATE TABLE issue_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template details
  category issue_category NOT NULL,
  severity issue_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  action_required TEXT,
  
  -- For quick selection
  shortcode TEXT UNIQUE,  -- e.g., 'ASSETS_INCOMPLETE', 'META_MISSING'
  
  -- Ordering
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed common templates
INSERT INTO issue_templates (shortcode, category, severity, title, description, action_required, sort_order) VALUES
-- Assets
('ASSETS_INCOMPLETE', 'assets', 'high', 'Assets Incomplete', 'Page is missing required images, videos, or other media assets.', 'Identify and add all missing assets. Check hero images, product photos, and supporting graphics.', 10),
('IMAGES_MISSING_ALT', 'assets', 'medium', 'Images Missing Alt Text', 'One or more images are missing alt text for accessibility and SEO.', 'Add descriptive alt text to all images.', 11),
('IMAGES_NOT_OPTIMIZED', 'assets', 'medium', 'Images Not Optimized', 'Images are too large or not in optimal format (WebP).', 'Compress images and convert to WebP format.', 12),
('VIDEO_MISSING', 'assets', 'medium', 'Video Content Missing', 'Page should have video content but none is present.', 'Add YouTube embed or upload video.', 13),

-- Content
('CONTENT_INCOMPLETE', 'content', 'high', 'Content Incomplete', 'Page content is missing or placeholder text remains.', 'Complete all content sections. Remove placeholder text.', 20),
('CONTENT_NEEDS_REVIEW', 'content', 'medium', 'Content Needs Review', 'Content needs review for accuracy, tone, or completeness.', 'Review and update content as needed.', 21),
('CONTENT_OUTDATED', 'content', 'medium', 'Content Outdated', 'Information on the page is out of date.', 'Update content with current information.', 22),
('SPELLING_GRAMMAR', 'content', 'low', 'Spelling/Grammar Issues', 'Page contains spelling or grammar errors.', 'Proofread and correct errors.', 23),

-- SEO
('META_TITLE_MISSING', 'seo', 'high', 'Meta Title Missing', 'Page is missing a meta title tag.', 'Add unique, descriptive meta title (50-60 chars).', 30),
('META_DESC_MISSING', 'seo', 'high', 'Meta Description Missing', 'Page is missing a meta description.', 'Add compelling meta description (150-160 chars).', 31),
('H1_MISSING', 'seo', 'high', 'H1 Heading Missing', 'Page does not have an H1 heading.', 'Add a single H1 heading with target keyword.', 32),
('HEADING_HIERARCHY', 'seo', 'medium', 'Heading Hierarchy Issues', 'Headings are not properly nested (skipping levels).', 'Fix heading structure: H1 > H2 > H3.', 33),
('OG_TAGS_MISSING', 'seo', 'medium', 'Open Graph Tags Missing', 'Missing Open Graph tags for social sharing.', 'Add og:title, og:description, og:image.', 34),
('INTERNAL_LINKS_LOW', 'seo', 'medium', 'Insufficient Internal Links', 'Page has too few internal links to other pages.', 'Add relevant internal links to related content.', 35),

-- Performance
('SLOW_LCP', 'performance', 'high', 'Slow Largest Contentful Paint', 'LCP is above 2.5 seconds threshold.', 'Optimize hero image, reduce render-blocking resources.', 40),
('HIGH_CLS', 'performance', 'high', 'High Cumulative Layout Shift', 'CLS score is above 0.1 threshold.', 'Add dimensions to images, reserve space for dynamic content.', 41),
('LARGE_PAGE_SIZE', 'performance', 'medium', 'Page Size Too Large', 'Total page size exceeds recommended limit.', 'Optimize images, lazy load below-fold content, minify CSS/JS.', 42),

-- Design
('DESIGN_INCONSISTENT', 'design', 'medium', 'Design System Inconsistency', 'Page does not follow design system patterns.', 'Update to use design system components.', 50),
('MOBILE_LAYOUT_BROKEN', 'mobile', 'high', 'Mobile Layout Issues', 'Page does not display correctly on mobile devices.', 'Fix responsive layout issues.', 51),

-- AI Readiness
('NO_STRUCTURED_DATA', 'ai_readiness', 'medium', 'No Structured Data', 'Page is missing Schema.org structured data.', 'Add appropriate JSON-LD structured data.', 60),
('SEMANTIC_HTML_MISSING', 'ai_readiness', 'low', 'Semantic HTML Incomplete', 'Page is not using semantic HTML elements.', 'Use main, article, section, nav elements appropriately.', 61),

-- Functionality
('BROKEN_LINKS', 'functionality', 'high', 'Broken Links', 'Page contains one or more broken links.', 'Fix or remove broken links.', 70),
('FORM_NOT_WORKING', 'functionality', 'critical', 'Form Not Working', 'A form on the page is not submitting correctly.', 'Debug and fix form submission.', 71),

-- Legal
('PRIVACY_LINK_MISSING', 'legal', 'high', 'Privacy Policy Link Missing', 'Page with data collection is missing privacy policy link.', 'Add link to privacy policy.', 80)
ON CONFLICT (shortcode) DO NOTHING;

-- -----------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Quick add issue from template
CREATE OR REPLACE FUNCTION add_issue_from_template(
  p_page_id UUID,
  p_template_shortcode TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_template issue_templates%ROWTYPE;
  v_issue_id UUID;
BEGIN
  SELECT * INTO v_template FROM issue_templates WHERE shortcode = p_template_shortcode;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found: %', p_template_shortcode;
  END IF;
  
  INSERT INTO page_issues (page_id, category, severity, title, description, action_required, notes)
  VALUES (p_page_id, v_template.category, v_template.severity, v_template.title, v_template.description, v_template.action_required, p_notes)
  RETURNING id INTO v_issue_id;
  
  RETURN v_issue_id;
END;
$$ LANGUAGE plpgsql;

-- Get page health summary
CREATE OR REPLACE FUNCTION get_page_health(p_page_id UUID)
RETURNS TABLE (
  total_issues INTEGER,
  critical_count INTEGER,
  high_count INTEGER,
  medium_count INTEGER,
  low_count INTEGER,
  open_count INTEGER,
  resolved_count INTEGER,
  oldest_open_issue TIMESTAMPTZ,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_issues,
    COUNT(*) FILTER (WHERE severity = 'critical')::INTEGER as critical_count,
    COUNT(*) FILTER (WHERE severity = 'high')::INTEGER as high_count,
    COUNT(*) FILTER (WHERE severity = 'medium')::INTEGER as medium_count,
    COUNT(*) FILTER (WHERE severity = 'low')::INTEGER as low_count,
    COUNT(*) FILTER (WHERE status IN ('open', 'acknowledged', 'in_progress'))::INTEGER as open_count,
    COUNT(*) FILTER (WHERE status = 'resolved')::INTEGER as resolved_count,
    MIN(created_at) FILTER (WHERE status IN ('open', 'acknowledged', 'in_progress')) as oldest_open_issue,
    MAX(updated_at) as last_updated
  FROM page_issues
  WHERE page_id = p_page_id;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- VIEWS
-- -----------------------------------------------------------------------------

-- All open issues across site
CREATE VIEW open_issues_summary AS
SELECT 
  pi.id as issue_id,
  sp.slug,
  sp.title as page_title,
  pi.category,
  pi.severity,
  pi.status,
  pi.title as issue_title,
  pi.action_required,
  pi.assigned_to,
  pi.created_at,
  pi.updated_at,
  EXTRACT(DAY FROM NOW() - pi.created_at)::INTEGER as days_open
FROM page_issues pi
JOIN site_pages sp ON sp.id = pi.page_id
WHERE pi.status IN ('open', 'acknowledged', 'in_progress', 'blocked')
ORDER BY 
  CASE pi.severity 
    WHEN 'critical' THEN 1 
    WHEN 'high' THEN 2 
    WHEN 'medium' THEN 3 
    WHEN 'low' THEN 4 
    ELSE 5 
  END,
  pi.created_at;

-- Issues by page with counts
CREATE VIEW page_issues_summary AS
SELECT 
  sp.id as page_id,
  sp.slug,
  sp.title,
  sp.migration_status,
  COUNT(pi.id) FILTER (WHERE pi.status IN ('open', 'acknowledged', 'in_progress', 'blocked')) as open_issues,
  COUNT(pi.id) FILTER (WHERE pi.severity = 'critical' AND pi.status != 'resolved') as critical_issues,
  COUNT(pi.id) FILTER (WHERE pi.severity = 'high' AND pi.status != 'resolved') as high_issues,
  COUNT(pi.id) FILTER (WHERE pi.status = 'resolved') as resolved_issues,
  MAX(pi.updated_at) as last_issue_update,
  BOOL_OR(pi.category = 'assets' AND pi.status != 'resolved') as has_asset_issues
FROM site_pages sp
LEFT JOIN page_issues pi ON pi.page_id = sp.id
GROUP BY sp.id, sp.slug, sp.title, sp.migration_status
ORDER BY 
  COUNT(pi.id) FILTER (WHERE pi.severity = 'critical' AND pi.status != 'resolved') DESC,
  COUNT(pi.id) FILTER (WHERE pi.status IN ('open', 'acknowledged', 'in_progress', 'blocked')) DESC;

-- Audit sequence progress
CREATE VIEW audit_sequence_progress AS
SELECT 
  sp.slug,
  sp.title,
  pas.sequence_name,
  pas.is_complete,
  (SELECT COUNT(*) FROM jsonb_object_keys(pas.checks)) as total_checks,
  (
    SELECT COUNT(*) 
    FROM jsonb_each(pas.checks) AS c(key, value) 
    WHERE value->>'status' = 'complete'
  ) as completed_checks,
  pas.started_at,
  pas.updated_at
FROM page_audit_sequence pas
JOIN site_pages sp ON sp.id = pas.page_id
ORDER BY pas.is_complete, pas.updated_at DESC;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

ALTER TABLE page_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_audit_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_templates ENABLE ROW LEVEL SECURITY;

-- Read for authenticated
CREATE POLICY "Allow read for authenticated" ON page_issues
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated" ON page_notes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated" ON page_audit_sequence
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated" ON issue_templates
  FOR SELECT TO authenticated USING (true);

-- Service role full access
CREATE POLICY "Service role full access" ON page_issues
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON page_notes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON page_audit_sequence
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON issue_templates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX idx_page_issues_page ON page_issues(page_id);
CREATE INDEX idx_page_issues_status ON page_issues(status);
CREATE INDEX idx_page_issues_severity ON page_issues(severity);
CREATE INDEX idx_page_issues_category ON page_issues(category);
CREATE INDEX idx_page_issues_open ON page_issues(page_id) WHERE status IN ('open', 'acknowledged', 'in_progress');
CREATE INDEX idx_page_issues_updated ON page_issues(updated_at DESC);

CREATE INDEX idx_page_notes_page ON page_notes(page_id);
CREATE INDEX idx_page_notes_pinned ON page_notes(page_id) WHERE is_pinned = TRUE;

CREATE INDEX idx_page_audit_sequence_page ON page_audit_sequence(page_id);
CREATE INDEX idx_page_audit_sequence_incomplete ON page_audit_sequence(page_id) WHERE is_complete = FALSE;

-- -----------------------------------------------------------------------------
-- COMMENTS
-- -----------------------------------------------------------------------------

COMMENT ON TABLE page_issues IS 'Tracks specific issues per page with severity, status, and resolution workflow';
COMMENT ON TABLE page_notes IS 'General notes and comments on pages';
COMMENT ON TABLE page_audit_sequence IS 'Tracks audit checklist progress per page';
COMMENT ON TABLE issue_templates IS 'Pre-defined issue templates for quick issue creation';
COMMENT ON FUNCTION add_issue_from_template IS 'Quickly create an issue from a template shortcode';
COMMENT ON FUNCTION get_page_health IS 'Returns issue counts and health metrics for a page';
