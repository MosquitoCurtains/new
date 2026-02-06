-- =============================================================================
-- Simple Page Reviews - Extends site_pages from migration 4
-- =============================================================================
-- Adds simple review workflow columns to existing site_pages table:
-- - review_status: pending / complete / needs_revision
-- - review_notes: notes from review
-- - revision_items: bullet list of what needs fixing
-- - reviewed_at: timestamp of last review
-- =============================================================================

-- Add simple review status enum
CREATE TYPE simple_review_status AS ENUM (
  'pending',           -- Not reviewed yet
  'complete',          -- Reviewed and good
  'needs_revision'     -- Reviewed, needs work
);

-- Add simple review columns to site_pages
ALTER TABLE site_pages
ADD COLUMN IF NOT EXISTS review_status simple_review_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS review_notes TEXT,
ADD COLUMN IF NOT EXISTS revision_items TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by TEXT;

-- Update trigger to track review changes
CREATE OR REPLACE FUNCTION update_site_pages_review()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Track when review_status changes
  IF NEW.review_status IS DISTINCT FROM OLD.review_status THEN
    NEW.reviewed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace existing trigger
DROP TRIGGER IF EXISTS site_pages_updated_at ON site_pages;
CREATE TRIGGER site_pages_updated_at
  BEFORE UPDATE ON site_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_site_pages_review();

-- =============================================================================
-- INSERT ALL PAGES (upsert - won't duplicate if already exists)
-- =============================================================================

INSERT INTO site_pages (slug, title, wordpress_url, page_type, migration_status, migration_priority, migration_batch) VALUES

-- ============ CORE PRODUCT PAGES ============
('/', 'Homepage', '/', 'homepage', 'live', 100, 'core'),
('/screened-porch-enclosures', 'Screen Porch Enclosures', '/screened-porch-enclosures/', 'product_landing', 'live', 100, 'core'),
('/clear-vinyl-plastic-patio-enclosures', 'Clear Vinyl Patio Enclosures', '/clear-vinyl-plastic-patio-enclosures/', 'product_landing', 'live', 100, 'core'),
('/screened-porch', 'Screened Porch', '/screened-porch/', 'seo_landing', 'live', 95, 'core'),
('/screen-patio', 'Screen Patio', '/screen-patio/', 'seo_landing', 'live', 95, 'core'),
('/garage-door-screens', 'Garage Door Screens', '/garage-door-screens/', 'seo_landing', 'live', 90, 'core'),
('/pergola-screen-curtains', 'Pergola Screen Curtains', '/pergola-screen-curtains/', 'seo_landing', 'live', 90, 'core'),
('/gazebo-screen-curtains', 'Gazebo Screen Curtains', '/gazebo-screen-curtains/', 'seo_landing', 'live', 85, 'core'),
('/screened-in-decks', 'Screened-In Decks', '/screened-in-decks/', 'seo_landing', 'live', 85, 'core'),
('/awning-screen-enclosures', 'Awning Screen Enclosures', '/awning-screen-enclosures/', 'seo_landing', 'live', 80, 'core'),
('/industrial-netting', 'Industrial Netting', '/industrial-netting/', 'seo_landing', 'live', 75, 'core'),
('/french-door-screens', 'French Door Screens', '/french-door-screens/', 'seo_landing', 'live', 80, 'batch-2-seo'),
('/boat-screens', 'Boat Screens', '/boat-screens/', 'seo_landing', 'live', 75, 'batch-2-seo'),
('/tent-screens', 'Tent Screens', '/tentscreenpanels/', 'seo_landing', 'not_started', 70, 'batch-2-seo'),
('/yardistry-gazebo-curtains', 'Yardistry Gazebo Curtains', '/yardistry-gazebo-curtains/', 'seo_landing', 'not_started', 65, 'batch-2-seo'),
('/hvac-chiller-screens', 'HVAC Chiller Screens', '/hvac-chiller-screens/', 'seo_landing', 'not_started', 50, 'batch-2-seo'),
('/pollen-protection', 'Pollen Protection', '/pollen-protection/', 'seo_landing', 'live', 70, 'batch-2-seo'),
('/weather-curtains', 'Weather Curtains', '/weather-curtains/', 'seo_landing', 'live', 70, 'batch-11-seo'),

-- ============ CONVERSION PAGES ============
('/start-project', 'Start Project', '/start-project/', 'ecommerce', 'live', 100, 'core'),
('/quote/mosquito-curtains', 'MC Instant Quote', '/mosquito-curtains-instant-quote/', 'ecommerce', 'not_started', 98, 'batch-1-conversion'),
('/quote/clear-vinyl', 'CV Instant Quote', '/clear-vinyl-instant-quote/', 'ecommerce', 'not_started', 98, 'batch-1-conversion'),
('/work-with-a-planner', 'Work With A Planner', '/work-with-a-planner/', 'ecommerce', 'not_started', 95, 'batch-1-conversion'),

-- ============ OPTIONS/PLANNING HUB ============
('/options', 'Options Hub', '/options/', 'support', 'live', 85, 'core'),
('/clear-vinyl-options', 'Clear Vinyl Options', '/clear-vinyl-options/', 'support', 'live', 85, 'core'),
('/options/clear-vinyl', 'Options / Clear Vinyl', NULL, 'support', 'live', 85, 'core'),
('/plan', 'Plan Screen Porch Hub', '/plan-screen-porch/', 'support', 'not_started', 85, 'batch-3-planning'),

-- ============ PLANNING SUB-PAGES ============
('/plan/mesh-colors', 'Mesh and Colors', '/plan-screen-porch/mesh-and-colors/', 'support', 'not_started', 80, 'batch-3-planning'),
('/plan/tracking', 'Outdoor Curtain Tracking', '/plan-screen-porch/outdoor-curtain-tracking/', 'support', 'not_started', 80, 'batch-3-planning'),
('/plan/magnetic-doorways', 'Magnetic Doorways', '/plan-screen-porch/magnetic-doorways/', 'support', 'not_started', 70, 'batch-3-planning'),
('/plan/sealing-base', 'Sealing The Base', '/plan-screen-porch/sealing-the-base/', 'support', 'not_started', 70, 'batch-3-planning'),
('/plan/how-to-order', 'How To Order', '/plan-screen-porch/how-to-order/', 'support', 'not_started', 70, 'batch-3-planning'),
('/plan/1-sided', 'Single Sided Exposure', '/plan-screen-porch/single-sided-exposure/', 'support', 'not_started', 65, 'batch-4-planning'),
('/plan/2-sided', '2 Sided Exposure', '/plan-screen-porch/2-sided-exposure/', 'support', 'not_started', 65, 'batch-4-planning'),
('/plan/3-sided', '3 Sided Exposure', '/plan-screen-porch/3-sided-exposure/', 'support', 'not_started', 65, 'batch-4-planning'),
('/plan/4-sided', '4 Plus Sided Exposure', '/plan-screen-porch/4-plus-sided-exposure/', 'support', 'not_started', 65, 'batch-4-planning'),
('/plan/free-standing', 'Free Standing', '/plan-screen-porch/free-standing/', 'support', 'not_started', 60, 'batch-4-planning'),
('/plan/tents-awnings', 'Tents and Awnings', '/plan-screen-porch/tents-and-awnings/', 'support', 'not_started', 60, 'batch-4-planning'),
('/plan/2-sided/regular-tracking', '2-Sided Regular Tracking', '/plan-screen-porch/2-sided-exposure/regular-columns-tracking/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/2-sided/irregular-tracking', '2-Sided Irregular Tracking', '/plan-screen-porch/2-sided-exposure/irregular-columns-tracking/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/2-sided/regular-velcro', '2-Sided Regular Velcro', '/plan-screen-porch/2-sided-exposure/regular-columns-velcro/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/2-sided/irregular-velcro', '2-Sided Irregular Velcro', '/plan-screen-porch/2-sided-exposure/irregular-columns-velcro/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/3-sided/regular-tracking', '3-Sided Regular Tracking', '/plan-screen-porch/3-sided-exposure/regular-columns-tracking/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/3-sided/irregular-tracking', '3-Sided Irregular Tracking', '/plan-screen-porch/3-sided-exposure/irregular-columns-tracking/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/3-sided/regular-velcro', '3-Sided Regular Velcro', '/plan-screen-porch/3-sided-exposure/regular-columns-velcro/', 'support', 'not_started', 40, 'batch-4-planning'),
('/plan/3-sided/irregular-velcro', '3-Sided Irregular Velcro', '/plan-screen-porch/3-sided-exposure/irregular-columns-velcro/', 'support', 'not_started', 40, 'batch-4-planning'),

-- ============ CLEAR VINYL OPTIONS ============
('/options/clear-vinyl/apron-colors', 'Apron Colors', '/apron-colors-to-choose-from/', 'support', 'not_started', 65, 'batch-5-cv-options'),
('/options/clear-vinyl/considerations', 'What Can Go Wrong', '/what-can-go-wrong-with-clear-vinyl/', 'support', 'not_started', 65, 'batch-5-cv-options'),
('/options/clear-vinyl/diy', 'Self-Install Advantages', '/clear-vinyl-self-installation-advantages/', 'support', 'not_started', 65, 'batch-5-cv-options'),
('/options/clear-vinyl/quality', 'What Makes Product Better', '/what-makes-our-clear-vinyl-product-better/', 'support', 'not_started', 65, 'batch-5-cv-options'),
('/options/clear-vinyl/ordering', 'Ordering Clear Vinyl', '/ordering-clear-vinyl/', 'support', 'not_started', 65, 'batch-5-cv-options'),
('/plan/overview', 'Project Planning', '/project-planning/', 'support', 'not_started', 65, 'batch-5-cv-options'),

-- ============ INSTALLATION ============
('/install', 'Install Hub', '/install/', 'support', 'live', 80, 'core'),
('/install/tracking', 'Tracking Installation', '/mosquito-curtains-tracking-installation/', 'support', 'live', 80, 'core'),
('/install/velcro', 'Velcro Installation', '/mosquito-curtains-velcro-installation/', 'support', 'live', 80, 'core'),
('/install/clear-vinyl', 'Clear Vinyl Installation', '/clear-vinyl-installation/', 'support', 'live', 80, 'core'),

-- ============ CARE ============
('/care/mosquito-curtains', 'Care for MC', '/caring-for-mosquito-curtains/', 'support', 'live', 75, 'core'),
('/care/clear-vinyl', 'Care for CV', '/caring-for-clear-vinyl/', 'support', 'live', 75, 'core'),

-- ============ SUPPORT & INFO ============
('/about', 'About Us', '/about/', 'informational', 'live', 70, 'core'),
('/contact', 'Contact', '/contact/', 'informational', 'live', 90, 'core'),
('/shipping', 'Shipping', '/shipping/', 'informational', 'live', 85, 'core'),
('/satisfaction-guarantee', 'Satisfaction Guarantee', '/satisfaction-guarantee/', 'informational', 'live', 75, 'core'),
('/reviews', 'Reviews', '/mosquito-curtains-reviews/', 'informational', 'live', 80, 'core'),
('/professionals', 'Professionals', '/professionals/', 'informational', 'live', 70, 'core'),
('/returns', 'Returns', '/returns/', 'informational', 'live', 75, 'batch-1-legal'),
('/faq', 'FAQ Hub', '/faqs/', 'support', 'live', 85, 'batch-1-legal'),
('/faq/mosquito-curtains', 'MC FAQ', '/mosquito-curtains-faq/', 'support', 'live', 85, 'batch-1-legal'),
('/faq/clear-vinyl', 'CV FAQ', '/clear-vinyl-faq/', 'support', 'not_started', 80, 'batch-6-support'),

-- ============ LEGAL ============
('/privacy-policy', 'Privacy Policy', '/privacy-policy/', 'legal', 'live', 95, 'batch-1-legal'),
('/terms-of-service', 'Terms of Service', '/terms-of-service/', 'legal', 'not_started', 65, 'batch-1-legal'),

-- ============ RAW NETTING ============
('/raw-netting-fabric-store', 'Fabric Store', '/raw-netting-fabric-store/', 'product_landing', 'live', 75, 'core'),
('/raw-netting', 'Mosquito Netting Hub', '/mosquito-netting/', 'product_landing', 'not_started', 75, 'batch-8-raw'),
('/raw-netting/mosquito-net', 'Mosquito Net', '/mosquito-net/', 'seo_landing', 'not_started', 65, 'batch-8-raw'),
('/raw-netting/no-see-um', 'No-See-Um Netting', '/no-see-um-netting-screen/', 'seo_landing', 'not_started', 65, 'batch-8-raw'),
('/raw-netting/shade-mesh', 'Shade Screen Mesh', '/shade-screen-mesh/', 'seo_landing', 'not_started', 65, 'batch-8-raw'),
('/raw-netting/scrim', 'Theatre Scrim', '/theatre-scrim/', 'seo_landing', 'not_started', 60, 'batch-8-raw'),
('/raw-netting/industrial', 'Industrial Mesh', '/industrial-mesh/', 'seo_landing', 'not_started', 60, 'batch-8-raw'),
('/raw-netting/hardware', 'Attachment Hardware', '/mosquito-netting/all-netting-and-attachment-hardware/', 'support', 'not_started', 60, 'batch-8-raw'),
('/raw-netting/custom', 'Netting Ideas / Custom', '/mosquito-netting/let-us-make-it-for-you/', 'support', 'not_started', 55, 'batch-8-raw'),
('/raw-netting/why-us', 'Why Us for Raw Netting', '/mosquito-netting/why-us-for-raw-netting/', 'informational', 'not_started', 45, 'batch-8-raw'),
('/raw-netting/rigging', 'Fasteners & Rigging', '/mosquito-netting/fasteners-and-rigging-ideas/', 'support', 'not_started', 45, 'batch-8-raw'),
('/theater-scrims', 'Theater Scrims', '/theater-scrims/', 'seo_landing', 'not_started', 45, 'batch-8-raw'),

-- ============ MARKETING/SOCIAL ============
('/fb', 'Facebook Hub', '/fb/', 'marketing', 'live', 85, 'batch-7-marketing'),
('/fb/mc-quote', 'FB MC Quote', '/fb/mc-quote/', 'marketing', 'not_started', 85, 'batch-7-marketing'),
('/fb/cv-quote', 'FB CV Quote', '/fb/cv-quote/', 'marketing', 'not_started', 85, 'batch-7-marketing'),
('/reddit', 'Reddit Hub', '/reddit/', 'marketing', 'not_started', 80, 'batch-7-marketing'),
('/reddit/mc-quote', 'Reddit MC Quote', '/reddit/mc-quote/', 'marketing', 'not_started', 80, 'batch-7-marketing'),
('/videos', 'Videos', '/videos/', 'marketing', 'not_started', 60, 'batch-7-marketing'),
('/photos', 'Photos', '/photos/', 'marketing', 'not_started', 60, 'batch-7-marketing'),

-- ============ GALLERY ============
('/gallery', 'Gallery Hub', '/project-gallery/', 'informational', 'live', 75, 'core'),
('/projects', 'Project Series Hub', '/project-series/', 'informational', 'not_started', 65, 'batch-9-gallery'),
('/gallery/mosquito-netting', 'Mosquito Netting Gallery', '/project-gallery/mosquito-netting-1/', 'informational', 'not_started', 55, 'batch-9-gallery'),
('/gallery/clear-vinyl', 'Clear Vinyl Gallery', '/project-gallery/clear-vinyl-plastic-enclosures/', 'informational', 'not_started', 55, 'batch-9-gallery'),

-- ============ BLOG ============
('/blog', 'Blog Hub', '/blog/', 'informational', 'not_started', 55, 'batch-10-blog'),
('/blog/mosquito-history', 'History of Mosquitoes', '/history-of-mans-deadliest-killer/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/mosquito-capitol', 'Where Is Mosquito Capitol', '/where-is-the-mosquito-capitol/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/deck-enclosures', 'Mosquito Enclosures for Decks', '/mosquito-enclosures-for-decks/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/gazebo-history', 'Gazebos Then and Now', '/gazebos-then-and-now/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/beautiful-porches', 'Porch Too Beautiful', '/is-your-porch-too-beautiful-to-screen/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/pollen-porches', 'Pollen in Porches', '/how-to-cope-with-pollen-in-porches-and-gazebos/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/northern-mosquitoes', 'Northern Mosquitoes', '/why-do-mosquitoes-seem-more-intense-in-northern-climates/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/storm-proof', 'Storm Proof Screening', '/finally-a-new-storm-proof-screening/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/west-nile', 'West Nile Effects', '/lasting-effects-of-the-west-nile-virus/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/protection-summary', 'Mosquito Protection Summary', '/a-summary-of-mosquito-protection-ideas/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/our-story', 'Bond Sales Story', '/bond-sales-mosquito-curtains-and-a-rodeo-ghost/', 'informational', 'not_started', 50, 'batch-10-blog'),
('/blog/kids-project', 'Kids Project', '/a-very-cool-project-for-kids-theyll-remember-it-forever/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/martha-stewart', 'Dear Martha Stewart', '/dear-martha-stewart/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/work-is-good', 'Work is Good', '/teaching-children-that-work-is-good/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/golf-course', 'Mulligan Blocker', '/a-new-mulligan-blocker-for-golf-course-residents/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/airlines-humor', 'Airlines Screen Doors', '/air-lines-explore-screen-doors-on-aircraft/', 'informational', 'not_started', 30, 'batch-10-blog'),
('/blog/projection-screens', 'Outdoor Projection Screens', '/outdoor-projection-screens/', 'informational', 'not_started', 30, 'batch-10-blog'),

-- ============ BUSINESS ============
('/opportunities', 'Opportunities', '/opportunities/', 'informational', 'live', 50, 'batch-12-business'),
('/contractors', 'Contractor', '/contractor/', 'informational', 'not_started', 60, 'batch-12-business'),
('/sale', 'Sale', '/sale/', 'ecommerce', 'not_started', 55, 'batch-12-business'),
('/products', 'Products Hub', '/products/', 'ecommerce', 'not_started', 65, 'batch-12-business'),
('/uploads', 'Client Uploads', '/client-uploads/', 'utility', 'not_started', 60, 'batch-12-business'),

-- ============ E-COMMERCE ============
('/cart', 'Shopping Cart', '/cart/', 'ecommerce', 'live', 100, 'core'),
('/my-projects', 'My Projects', NULL, 'ecommerce', 'live', 85, 'core'),
('/my-orders', 'My Orders', NULL, 'ecommerce', 'live', 85, 'core'),
('/our-story', 'Our Story', '/our-story/', 'informational', 'live', 70, 'core'),

-- ============ SEO LANDING PAGES ============
('/porch-winterize', 'Porch Winterize', '/porch-winterize/', 'seo_landing', 'not_started', 60, 'batch-11-seo'),
('/porch-vinyl-panels', 'Porch Vinyl Panels', '/porch-vinyl-panels/', 'seo_landing', 'not_started', 60, 'batch-11-seo'),
('/patio-winterize', 'Patio Winterize', '/patio-winterize/', 'seo_landing', 'not_started', 60, 'batch-11-seo'),
('/porch-vinyl-curtains', 'Porch Vinyl Curtains', '/porch-vinyl-curtains/', 'seo_landing', 'not_started', 60, 'batch-11-seo'),
('/insulated-curtain-panels', 'Insulated Curtain Panels', '/insulated-curtain-panels/', 'seo_landing', 'not_started', 55, 'batch-11-seo'),
('/roll-up-shade-screens', 'Roll Up Shade Screens', '/roll-up-shade-screens/', 'seo_landing', 'not_started', 55, 'batch-11-seo'),
('/camping-net', 'Camping Net', '/camping-net/', 'seo_landing', 'not_started', 45, 'batch-11-seo')

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  wordpress_url = EXCLUDED.wordpress_url,
  page_type = EXCLUDED.page_type,
  migration_priority = EXCLUDED.migration_priority,
  migration_batch = EXCLUDED.migration_batch;

-- =============================================================================
-- UPDATE VIEW to include review status
-- =============================================================================

DROP VIEW IF EXISTS page_audit_dashboard;
CREATE VIEW page_audit_dashboard AS
SELECT 
  sp.id,
  sp.slug,
  sp.title,
  sp.page_type,
  sp.migration_status,
  sp.migration_priority,
  sp.migration_batch,
  sp.approval_status,
  sp.monthly_pageviews,
  sp.organic_sessions,
  
  -- Simple review
  sp.review_status,
  sp.review_notes,
  sp.revision_items,
  sp.reviewed_at,
  
  -- SEO (from seo_audits table)
  sa.seo_score,
  sa.seo_rating,
  sa.has_meta_title,
  sa.has_meta_description,
  sa.has_h1,
  
  -- AI Readiness (from ai_readiness_audits table)
  ar.ai_score,
  ar.ai_rating,
  ar.has_structured_data,
  ar.uses_semantic_html,
  
  -- Performance (latest from performance_audits)
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

-- =============================================================================
-- SIMPLE REVIEW VIEWS
-- =============================================================================

-- Pages by review status
CREATE OR REPLACE VIEW review_summary AS
SELECT 
  COUNT(*) as total_pages,
  COUNT(*) FILTER (WHERE migration_status = 'live') as pages_live,
  COUNT(*) FILTER (WHERE review_status = 'pending') as pending_review,
  COUNT(*) FILTER (WHERE review_status = 'complete') as complete,
  COUNT(*) FILTER (WHERE review_status = 'needs_revision') as needs_revision
FROM site_pages;

-- Pages needing revision
CREATE OR REPLACE VIEW pages_needing_revision AS
SELECT 
  id,
  slug,
  title,
  page_type,
  migration_status,
  review_notes,
  revision_items,
  reviewed_at,
  updated_at
FROM site_pages
WHERE review_status = 'needs_revision'
ORDER BY migration_priority DESC, updated_at DESC;

-- =============================================================================
-- INDEX for review status
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_site_pages_review_status ON site_pages(review_status);
