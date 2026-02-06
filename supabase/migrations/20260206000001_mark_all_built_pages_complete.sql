-- =============================================================================
-- Mark All Built Pages as Complete
-- =============================================================================
-- Generated: Feb 6, 2026
-- Purpose: Set review_status = 'complete' for all pages that exist in the 
--          Next.js codebase. This makes the Supabase database the single 
--          source of truth for page audit status.
-- =============================================================================

-- Valid page_type values:
--   homepage, product_landing, seo_landing, category, informational,
--   legal, support, marketing, ecommerce, admin, utility

INSERT INTO site_pages (slug, title, page_type, migration_status, review_status, reviewed_at, updated_at)
VALUES
  -- HOME
  ('/', 'Home', 'homepage', 'live', 'complete', NOW(), NOW()),
  
  -- CORE PRODUCT PAGES
  ('/screened-porch', 'Screened Porch', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/screened-porch-enclosures', 'Screened Porch Enclosures', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/screen-patio', 'Screen Patio', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/pergola-screen-curtains', 'Pergola Screen Curtains', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/gazebo-screen-curtains', 'Gazebo Screen Curtains', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/screened-in-decks', 'Screened In Decks', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/awning-screen-enclosures', 'Awning Screen Enclosures', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/garage-door-screens', 'Garage Door Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/french-door-screens', 'French Door Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/boat-screens', 'Boat Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/industrial-netting', 'Industrial Netting', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/clear-vinyl-plastic-patio-enclosures', 'Clear Vinyl Plastic Patio Enclosures', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/weather-curtains', 'Weather Curtains', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/roll-up-shade-screens', 'Roll Up Shade Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/outdoor-projection-screens', 'Outdoor Projection Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/hvac-chiller-screens', 'HVAC Chiller Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/tent-screens', 'Tent Screens', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/yardistry-gazebo-curtains', 'Yardistry Gazebo Curtains', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/camping-net', 'Camping Net', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/heavy-track', 'Heavy Track', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/theater-scrims', 'Theater Scrims', 'product_landing', 'live', 'complete', NOW(), NOW()),
  
  -- RAW NETTING
  ('/raw-netting', 'Raw Netting Hub', 'category', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/mosquito-net', 'Raw Netting - Mosquito Net', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/no-see-um', 'Raw Netting - No See Um', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/shade-mesh', 'Raw Netting - Shade Mesh', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/scrim', 'Raw Netting - Scrim', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/industrial', 'Raw Netting - Industrial', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/custom', 'Raw Netting - Custom', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/hardware', 'Raw Netting - Hardware', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/rigging', 'Raw Netting - Rigging', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting/why-us', 'Raw Netting - Why Us', 'product_landing', 'live', 'complete', NOW(), NOW()),
  ('/raw-netting-fabric-store', 'Raw Netting Fabric Store', 'product_landing', 'live', 'complete', NOW(), NOW()),
  
  -- OPTIONS / PLANNING
  ('/options', 'Options Hub', 'category', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl', 'Clear Vinyl Options', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl/apron-colors', 'Clear Vinyl Apron Colors', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl/considerations', 'Clear Vinyl Considerations', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl/diy', 'Clear Vinyl DIY', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl/ordering', 'Clear Vinyl Ordering', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/options/clear-vinyl/quality', 'Clear Vinyl Quality', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/clear-vinyl-options', 'Clear Vinyl Options (alt)', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan', 'Planning Hub', 'category', 'live', 'complete', NOW(), NOW()),
  ('/plan/overview', 'Planning Overview', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/mesh-colors', 'Mesh Colors', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/tracking', 'Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/magnetic-doorways', 'Magnetic Doorways', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/sealing-base', 'Sealing the Base', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/how-to-order', 'How to Order', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/1-sided', '1-Sided Planning', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/2-sided', '2-Sided Planning', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/2-sided/regular-tracking', '2-Sided Regular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/2-sided/regular-velcro', '2-Sided Regular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/2-sided/irregular-tracking', '2-Sided Irregular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/2-sided/irregular-velcro', '2-Sided Irregular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/3-sided', '3-Sided Planning', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/3-sided/regular-tracking', '3-Sided Regular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/3-sided/regular-velcro', '3-Sided Regular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/3-sided/irregular-tracking', '3-Sided Irregular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/3-sided/irregular-velcro', '3-Sided Irregular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/4-sided', '4-Sided Planning', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/4-sided/regular-tracking', '4-Sided Regular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/4-sided/regular-velcro', '4-Sided Regular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/4-sided/irregular-tracking', '4-Sided Irregular Tracking', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/4-sided/irregular-velcro', '4-Sided Irregular Velcro', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/free-standing', 'Free Standing', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/plan/tents-awnings', 'Tents & Awnings', 'informational', 'live', 'complete', NOW(), NOW()),
  
  -- INSTALLATION / CARE
  ('/install', 'Installation Hub', 'support', 'live', 'complete', NOW(), NOW()),
  ('/install/tracking', 'Tracking Installation', 'support', 'live', 'complete', NOW(), NOW()),
  ('/install/velcro', 'Velcro Installation', 'support', 'live', 'complete', NOW(), NOW()),
  ('/install/clear-vinyl', 'Clear Vinyl Installation', 'support', 'live', 'complete', NOW(), NOW()),
  
  -- CONVERSION / START PROJECT
  ('/start-project', 'Start Project', 'ecommerce', 'live', 'complete', NOW(), NOW()),
  ('/work-with-a-planner', 'Work With a Planner', 'ecommerce', 'live', 'complete', NOW(), NOW()),
  ('/quote/mosquito-curtains', 'Mosquito Curtains Quote', 'ecommerce', 'live', 'complete', NOW(), NOW()),
  ('/quote/clear-vinyl', 'Clear Vinyl Quote', 'ecommerce', 'live', 'complete', NOW(), NOW()),
  
  -- SUPPORT / INFO
  ('/about', 'About Us', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/our-story', 'Our Story', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/contact', 'Contact Us', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/reviews', 'Customer Reviews', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/shipping', 'Shipping', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/satisfaction-guarantee', 'Satisfaction Guarantee', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/opportunities', 'Opportunities', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/contractors', 'Contractors', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/professionals', 'Professionals', 'informational', 'live', 'complete', NOW(), NOW()),
  
  -- LEGAL
  ('/privacy-policy', 'Privacy Policy', 'legal', 'live', 'complete', NOW(), NOW()),
  ('/returns', 'Returns', 'legal', 'live', 'complete', NOW(), NOW()),
  
  -- FAQ
  ('/faq', 'FAQ Hub', 'support', 'live', 'complete', NOW(), NOW()),
  ('/faq/mosquito-curtains', 'Mosquito Curtains FAQ', 'support', 'live', 'complete', NOW(), NOW()),
  ('/faq/clear-vinyl', 'Clear Vinyl FAQ', 'support', 'live', 'complete', NOW(), NOW()),
  
  -- CONTENT / MEDIA
  ('/blog', 'Blog Hub', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/gallery', 'Gallery Hub', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/videos', 'Video Library', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/photos', 'Photo Guidelines', 'informational', 'live', 'complete', NOW(), NOW()),
  ('/uploads', 'Client Uploads', 'utility', 'live', 'complete', NOW(), NOW()),
  ('/projects', 'Projects Hub', 'informational', 'live', 'complete', NOW(), NOW()),
  
  -- HUBS
  ('/products', 'Products Hub', 'category', 'live', 'complete', NOW(), NOW()),
  ('/applications', 'Applications Hub', 'category', 'live', 'complete', NOW(), NOW()),
  
  -- SEO LANDING PAGES
  ('/porch-winterize', 'Porch Winterize', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  ('/patio-winterize', 'Patio Winterize', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  ('/porch-vinyl-curtains', 'Porch Vinyl Curtains', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  ('/porch-vinyl-panels', 'Porch Vinyl Panels', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  ('/insulated-curtain-panels', 'Insulated Curtain Panels', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  ('/pollen-protection', 'Pollen Protection', 'seo_landing', 'live', 'complete', NOW(), NOW()),
  
  -- MARKETING / SOCIAL
  ('/sale', 'Sale', 'marketing', 'live', 'complete', NOW(), NOW()),
  ('/fb', 'Facebook Hub', 'marketing', 'live', 'complete', NOW(), NOW()),
  ('/fb/mc-quote', 'FB MC Quote', 'marketing', 'live', 'complete', NOW(), NOW()),
  ('/fb/cv-quote', 'FB CV Quote', 'marketing', 'live', 'complete', NOW(), NOW()),
  ('/reddit', 'Reddit Hub', 'marketing', 'live', 'complete', NOW(), NOW()),
  ('/reddit/mc-quote', 'Reddit MC Quote', 'marketing', 'live', 'complete', NOW(), NOW()),
  
  -- ACCOUNT / ORDER
  ('/my-orders', 'My Orders', 'ecommerce', 'live', 'complete', NOW(), NOW()),
  ('/my-projects', 'My Projects', 'ecommerce', 'live', 'complete', NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
  migration_status = 'live',
  review_status = 'complete',
  reviewed_at = NOW(),
  updated_at = NOW();

-- Summary: 113 pages marked as live + complete
