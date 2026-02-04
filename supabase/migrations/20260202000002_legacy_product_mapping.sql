-- ============================================================================
-- LEGACY PRODUCT MAPPING
-- Maps legacy WooCommerce product names to new normalized product catalog
-- ============================================================================

-- ============================================================================
-- ADD MISSING PRODUCTS
-- These products were found in legacy data but not in initial seed
-- ============================================================================

-- Roll Up Shade Screen (rare product)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) 
VALUES ('rollup_shade_screen', 'Roll Up Shade Mesh Screen', 'Roll-up shade mesh screen with cord mechanism', 'panel', 'sqft', 4.50, true, 5, '{"min_sqft": 10}'::jsonb)
ON CONFLICT (sku) DO NOTHING;

-- Attachment Bundle (composite product - expanded during checkout)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta)
VALUES ('attachment_bundle', 'Attachment Items Bundle', 'Bundle of attachment items for panel installation', 'accessory', 'calculated', 0, true, 60, '{"expand_on_checkout": true}'::jsonb)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- Create mapping table
CREATE TABLE IF NOT EXISTS legacy_product_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Legacy identification
  legacy_product_name TEXT NOT NULL,
  legacy_item_type TEXT,
  
  -- New product mapping
  new_product_sku TEXT REFERENCES products(sku),
  
  -- Option extraction rules (JSON)
  -- e.g., {"mesh_type": "extract_from_meta", "color": "extract_from_name"}
  option_extraction_rules JSONB DEFAULT '{}'::jsonb,
  
  -- Default options if not extractable
  default_options JSONB DEFAULT '{}'::jsonb,
  
  -- Notes
  notes TEXT,
  
  UNIQUE(legacy_product_name)
);

-- ============================================================================
-- INSERT MAPPING DATA
-- ============================================================================

-- TOOLS
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, notes) VALUES
('Fully Refundable Industrial Snap Tool', 'tool', 'industrial_snap_tool', 'Direct 1:1 mapping');

-- PANELS
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, option_extraction_rules, notes) VALUES
('Clear Vinyl Panels', 'panel', 'vinyl_panel', 
  '{"thickness": "extract_from_meta", "color": "extract_from_meta"}'::jsonb,
  'Custom-sized vinyl panels'),
('Mesh Panels', 'panel', 'mesh_panel',
  '{"mesh_type": "extract_from_meta", "color": "extract_from_meta"}'::jsonb,
  'Generic mesh panel - mesh type varies'),
('Raw Shark Tooth Scrim', 'panel', 'scrim_panel',
  '{}'::jsonb,
  'Scrim panel product'),
('Roll Up Shade Mesh Screens', 'panel', 'rollup_shade_screen',
  '{"color": "extract_from_meta"}'::jsonb,
  'Roll-up shade screen product');

-- TRACK
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, default_options, notes) VALUES
('Standard Track', 'track', 'straight_track',
  '{"weight": "standard"}'::jsonb,
  'Standard weight track hardware'),
('Heavy Track', 'track', 'straight_track',
  '{"weight": "heavy"}'::jsonb,
  'Heavy duty track hardware'),
('Carriers (heavy)', 'track', 'snap_carriers',
  '{"weight": "heavy"}'::jsonb,
  'Heavy duty carriers');

-- RAW MATERIALS
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, default_options, notes) VALUES
('Raw Heavy Mosquito Mesh', 'raw_material', 'raw_mesh',
  '{"mesh_type": "heavy_mosquito"}'::jsonb,
  'By-the-yard heavy mosquito mesh'),
('Raw No-See-Um Mesh', 'raw_material', 'raw_mesh',
  '{"mesh_type": "no_see_um"}'::jsonb,
  'By-the-yard no-see-um mesh'),
('Raw Shade Mesh', 'raw_material', 'raw_mesh',
  '{"mesh_type": "shade"}'::jsonb,
  'By-the-yard shade mesh'),
('Raw Industrial Mesh', 'raw_material', 'raw_mesh',
  '{"mesh_type": "industrial"}'::jsonb,
  'By-the-yard industrial mesh'),
('Raw Netting Attachment Items', 'raw_material', NULL,
  '{}'::jsonb,
  'Bulk attachment items - needs review');

-- BUNDLES
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, option_extraction_rules, notes) VALUES
('Attachment Items', 'bundle', 'attachment_bundle',
  '{"color": "extract_from_name", "contents": "expand_bundle"}'::jsonb,
  'Bundle of attachment items - may need to expand into individual items');

-- ATTACHMENTS
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, default_options, notes) VALUES
('Zippered Stucco Strips', 'attachment', 'stucco_strip',
  '{"style": "zippered"}'::jsonb,
  'Stucco strips with zipper'),
('Stucco Strips', 'attachment', 'stucco_strip',
  '{}'::jsonb,
  'Standard stucco strips'),
('Belted Ribs', 'attachment', 'belted_rib',
  '{}'::jsonb,
  'Belted rib attachment'),
('Black Marine Snaps (Bags of 10)', 'attachment', 'marine_snap',
  '{"color": "black", "quantity": "10"}'::jsonb,
  'Marine snaps in black');

-- ADJUSTMENTS
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, option_extraction_rules, notes) VALUES
('Adjustment', 'adjustment', 'price_adjustment',
  '{"reason": "extract_from_meta"}'::jsonb,
  'Price adjustments - extract reason from order notes/meta');

-- UNKNOWN / NEEDS REVIEW
INSERT INTO legacy_product_mapping (legacy_product_name, legacy_item_type, new_product_sku, notes) VALUES
('Tie Up Straps', 'unknown', NULL, 'NEEDS REVIEW: May need new product'),
('Camping Net', 'unknown', NULL, 'NEEDS REVIEW: One-off product?');

-- ============================================================================
-- CREATE RECONCILIATION VIEW
-- Shows legacy line items with their mapped new products
-- ============================================================================

CREATE OR REPLACE VIEW legacy_line_items_mapped AS
SELECT 
  li.id,
  li.legacy_order_id,
  li.product_name AS legacy_product_name,
  li.item_type AS legacy_item_type,
  li.quantity,
  li.unit_price,
  li.line_total,
  pm.new_product_sku,
  p.name AS new_product_name,
  p.product_type AS new_product_type,
  pm.default_options,
  pm.option_extraction_rules,
  li.raw_meta,
  CASE 
    WHEN pm.new_product_sku IS NULL THEN 'unmapped'
    WHEN pm.option_extraction_rules != '{}'::jsonb THEN 'needs_option_extraction'
    ELSE 'mapped'
  END AS mapping_status
FROM legacy_line_items li
LEFT JOIN legacy_product_mapping pm ON li.product_name = pm.legacy_product_name
LEFT JOIN products p ON pm.new_product_sku = p.sku;

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Product sales summary (legacy data mapped to new products)
CREATE OR REPLACE VIEW product_sales_summary AS
SELECT 
  COALESCE(pm.new_product_sku, 'UNMAPPED') AS product_sku,
  COALESCE(p.name, li.product_name) AS product_name,
  li.item_type,
  COUNT(*) AS times_sold,
  SUM(li.quantity) AS total_quantity,
  SUM(li.line_total) AS total_revenue,
  AVG(li.unit_price) AS avg_unit_price,
  MIN(lo.order_date) AS first_sale,
  MAX(lo.order_date) AS last_sale
FROM legacy_line_items li
JOIN legacy_orders lo ON li.legacy_order_id = lo.id
LEFT JOIN legacy_product_mapping pm ON li.product_name = pm.legacy_product_name
LEFT JOIN products p ON pm.new_product_sku = p.sku
GROUP BY COALESCE(pm.new_product_sku, 'UNMAPPED'), COALESCE(p.name, li.product_name), li.item_type
ORDER BY total_revenue DESC;

-- Monthly revenue by product type
CREATE OR REPLACE VIEW monthly_revenue_by_product_type AS
SELECT 
  DATE_TRUNC('month', lo.order_date) AS month,
  li.item_type,
  COUNT(DISTINCT lo.id) AS orders,
  SUM(li.line_total) AS revenue
FROM legacy_line_items li
JOIN legacy_orders lo ON li.legacy_order_id = lo.id
GROUP BY DATE_TRUNC('month', lo.order_date), li.item_type
ORDER BY month DESC, revenue DESC;

-- Salesperson performance
CREATE OR REPLACE VIEW salesperson_performance AS
SELECT 
  lo.salesperson_username,
  COUNT(DISTINCT lo.id) AS total_orders,
  COUNT(DISTINCT lo.email) AS unique_customers,
  SUM(lo.total) AS total_revenue,
  AVG(lo.total) AS avg_order_value,
  MIN(lo.order_date) AS first_order,
  MAX(lo.order_date) AS last_order
FROM legacy_orders lo
WHERE lo.salesperson_username IS NOT NULL
GROUP BY lo.salesperson_username
ORDER BY total_revenue DESC;

-- Attribution analysis
CREATE OR REPLACE VIEW attribution_analysis AS
SELECT 
  COALESCE(utm_source, '(direct)') AS source,
  COALESCE(utm_medium, '(none)') AS medium,
  COALESCE(device_type, 'Unknown') AS device,
  COUNT(*) AS orders,
  SUM(total) AS revenue,
  AVG(total) AS avg_order_value,
  COUNT(DISTINCT email) AS unique_customers
FROM legacy_orders
GROUP BY COALESCE(utm_source, '(direct)'), COALESCE(utm_medium, '(none)'), COALESCE(device_type, 'Unknown')
ORDER BY revenue DESC;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_legacy_product_mapping_name ON legacy_product_mapping(legacy_product_name);
CREATE INDEX IF NOT EXISTS idx_legacy_product_mapping_sku ON legacy_product_mapping(new_product_sku);

COMMENT ON TABLE legacy_product_mapping IS 'Maps legacy WooCommerce product names to normalized product catalog';
COMMENT ON VIEW legacy_line_items_mapped IS 'Legacy line items with their mapped new product information';
COMMENT ON VIEW product_sales_summary IS 'Sales summary by product (legacy data mapped to new catalog)';
COMMENT ON VIEW monthly_revenue_by_product_type IS 'Monthly revenue breakdown by product type';
COMMENT ON VIEW salesperson_performance IS 'Sales metrics by salesperson';
COMMENT ON VIEW attribution_analysis IS 'Marketing attribution analysis from order data';
