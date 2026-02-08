-- ============================================================================
-- Migration: Simplify Product Schema (5 tables -> 2)
-- ============================================================================
-- Consolidates products, product_pricing, product_options, option_values,
-- and product_pricing_history into just 2 tables:
--   1. products    — every purchasable variant with its price on the row
--   2. product_options — config for panels, raw materials, and adjustments
--
-- Plus a simple pricing_history audit table.
--
-- See: .cursor/plans/simplify_product_schema_c6d2a95e.plan.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: Drop old tables
-- ============================================================================

DROP TABLE IF EXISTS option_values CASCADE;
DROP TABLE IF EXISTS product_pricing_history CASCADE;
DROP TABLE IF EXISTS pricing_history CASCADE;
DROP TABLE IF EXISTS product_options CASCADE;
DROP TABLE IF EXISTS product_pricing CASCADE;

-- Drop views that reference old schema
DROP VIEW IF EXISTS product_sales_summary CASCADE;

-- Drop old triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- ============================================================================
-- PHASE 2: Handle FK dependencies on products table
-- ============================================================================

-- Remove legacy_product_mapping FK (SKUs are changing)
ALTER TABLE legacy_product_mapping
  DROP CONSTRAINT IF EXISTS legacy_product_mapping_new_product_sku_fkey;

-- Clear any existing line_items (pre-production, no real orders)
DELETE FROM line_item_options;
DELETE FROM line_items;

-- Clear legacy mappings that reference old SKUs
UPDATE legacy_product_mapping SET new_product_sku = NULL WHERE new_product_sku IS NOT NULL;

-- ============================================================================
-- PHASE 3: Alter products table
-- ============================================================================

-- Drop columns no longer needed
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pricing_type_check;
ALTER TABLE products DROP COLUMN IF EXISTS pricing_type;
ALTER TABLE products DROP COLUMN IF EXISTS is_featured;
ALTER TABLE products DROP COLUMN IF EXISTS sort_order;

-- Add new columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'each';
ALTER TABLE products ADD COLUMN IF NOT EXISTS pack_quantity integer NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_category text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_section text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_order integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_step integer DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_min integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_max integer DEFAULT 100;

-- Delete all existing product rows (clean slate)
DELETE FROM products;

-- ============================================================================
-- PHASE 4: Seed products (~52 rows)
-- ============================================================================

INSERT INTO products (sku, name, description, product_type, base_price, unit, pack_quantity, image_url, is_active, admin_only, product_category, category_section, category_order, quantity_step, quantity_min, quantity_max) VALUES

-- Track Hardware: Standard
('track_standard_straight', 'Straight Track', '7ft straight track piece', 'track', 30.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Straight-Track-Black-1.jpg', true, false, 'Track Hardware', 'Standard Track', 1, 1, 0, 100),
('track_standard_curve_90', '90° Curve', '90 degree curve connector', 'track', 25.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/90-Black-Track-1.jpg', true, false, 'Track Hardware', 'Standard Track', 2, 1, 0, 100),
('track_standard_curve_135', '135° Curve', '135 degree curve connector', 'track', 25.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/135-Black-Track-1.jpg', true, false, 'Track Hardware', 'Standard Track', 3, 1, 0, 100),
('track_standard_splice', 'Splice', 'Track splice connector', 'track', 7.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-White-Splice.jpg', true, false, 'Track Hardware', 'Standard Track', 4, 1, 0, 100),
('track_standard_endcap', 'End Cap', 'Track end cap', 'track', 1.50, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-White-End-Cap.jpg', true, false, 'Track Hardware', 'Standard Track', 5, 1, 0, 100),
('track_standard_carrier', 'Snap Carrier', 'Curtain snap carrier', 'track', 0.50, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Snap-Carriers-1024.jpg', true, false, 'Track Hardware', 'Standard Track', 6, 1, 0, 100),

-- Track Hardware: Heavy
('track_heavy_straight', 'Straight Track', '7ft heavy straight track piece', 'track', 42.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Heavy-Track-BW.jpg', true, false, 'Track Hardware', 'Heavy Track', 1, 1, 0, 100),
('track_heavy_curve_90', '90° Curve', 'Heavy 90 degree curve connector', 'track', 25.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/90-Heavy-BW.jpg', true, false, 'Track Hardware', 'Heavy Track', 2, 1, 0, 100),
('track_heavy_curve_135', '135° Curve', 'Heavy 135 degree curve connector', 'track', 25.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/135-Heavy-BW.jpg', true, false, 'Track Hardware', 'Heavy Track', 3, 1, 0, 100),
('track_heavy_splice', 'Splice', 'Heavy track splice connector', 'track', 5.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Heavy-Splice-BW.jpg', true, false, 'Track Hardware', 'Heavy Track', 4, 1, 0, 100),
('track_heavy_endcap', 'End Cap', 'Heavy track end cap', 'track', 3.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/End-Cap-Heavy-BW.jpg', true, false, 'Track Hardware', 'Heavy Track', 5, 1, 0, 100),
('track_heavy_carrier', 'Snap Carrier', 'Heavy curtain snap carrier', 'track', 1.25, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Heavy-Track-Carriers.jpg', true, false, 'Track Hardware', 'Heavy Track', 6, 1, 0, 100),

-- Attachment Hardware: Sealing Sides
('marine_snap_black', 'Marine Snaps (Black)', 'Black marine snaps, pack of 10', 'attachment', 15.00, 'each', 10, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Marine-Snap-Pack-of-10.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 1, 1, 0, 100),
('marine_snap_white', 'Marine Snaps (White)', 'White marine snaps, pack of 10', 'attachment', 15.00, 'each', 10, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Marine-Snaps-Pack-of-10.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 2, 1, 0, 100),
('adhesive_snap_clear', 'Adhesive Marine Snaps (Clear)', 'Clear adhesive snaps, pack of 5', 'attachment', 15.00, 'each', 5, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Snap.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 3, 1, 0, 100),
('adhesive_snap_black', 'Adhesive Marine Snaps (Black)', 'Black adhesive snaps, pack of 5', 'attachment', 15.00, 'each', 5, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Snap.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 4, 1, 0, 100),
('adhesive_snap_white', 'Adhesive Marine Snaps (White)', 'White adhesive snaps, pack of 5', 'attachment', 15.00, 'each', 5, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Snap.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 5, 1, 0, 100),
('panel_snap', 'Panel-to-Panel Snaps', 'Snaps for connecting panels, pack of 6', 'attachment', 10.00, 'each', 6, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Panel-to-Panel-Snap.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 6, 1, 0, 100),
('rubber_washer', 'Rubber Washers', 'Rubber washers, pack of 10', 'attachment', 2.00, 'each', 10, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Rubber-Washers.jpg', true, false, 'Attachment Hardware', 'Sealing Sides', 7, 1, 0, 100),

-- Attachment Hardware: Magnetic Doorways
('block_magnet', 'Block Shaped Magnets', 'Rectangular magnets for doorways', 'attachment', 1.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Neodymium-Magnets-10-Pack.jpg', true, false, 'Attachment Hardware', 'Magnetic Doorways', 1, 1, 0, 100),
('fiberglass_rod', 'Fiberglass Rod Set', 'Fiberglass rods for panel support', 'attachment', 10.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Fiberglass-Rod-2-Pack.jpg', true, false, 'Attachment Hardware', 'Magnetic Doorways', 2, 1, 0, 100),
('fiberglass_rod_clip', 'Fiberglass Rod Clips', 'Extra clips for fiberglass rods', 'attachment', 2.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Fiberglass-Rod-Clips.jpg', true, false, 'Attachment Hardware', 'Magnetic Doorways', 3, 1, 0, 100),

-- Attachment Hardware: Elastic Cord & Tethers
('elastic_cord_black', 'Elastic Cord & D-Rings (Black)', 'Black elastic cord with D-rings', 'attachment', 10.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Elastic-Cord.jpg', true, false, 'Attachment Hardware', 'Elastic Cord & Tethers', 1, 1, 0, 100),
('elastic_cord_white', 'Elastic Cord & D-Rings (White)', 'White elastic cord with D-rings', 'attachment', 10.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/White-Elastic-Cord.jpg', true, false, 'Attachment Hardware', 'Elastic Cord & Tethers', 2, 1, 0, 100),
('tether_clip', 'Tether Clips', 'Clips for panel tethering', 'attachment', 10.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Tether-Clip.jpg', true, false, 'Attachment Hardware', 'Elastic Cord & Tethers', 3, 1, 0, 100),
('belted_rib', 'Belted Ribs', 'Reinforcement ribs', 'attachment', 15.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-Belted-Rib.jpg', true, false, 'Attachment Hardware', 'Elastic Cord & Tethers', 4, 1, 0, 100),

-- Other Items (mounting, webbing, tape, velcro, general accessories)
('fastwax', 'Fastwax Cleaner', 'Cleaning solution for vinyl', 'accessory', 15.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Fast-Wax.jpg', true, false, 'Accessories', 'Other Items', 1, 1, 0, 100),
('webbing_black', '2" Webbing (Black)', 'Black 2-inch webbing, by the foot', 'accessory', 0.40, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Webbing.jpg', true, false, 'Accessories', 'Other Items', 2, 1, 0, 200),
('webbing_white', '2" Webbing (White)', 'White 2-inch webbing, by the foot', 'accessory', 0.40, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Webbing.jpg', true, false, 'Accessories', 'Other Items', 3, 1, 0, 200),
('snap_tape_black', 'Snap Tape (Black)', 'Black snap tape, by the foot', 'accessory', 2.00, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/07/Black-Snap-Tape.jpg', true, false, 'Accessories', 'Other Items', 4, 1, 0, 200),
('snap_tape_white', 'Snap Tape (White)', 'White snap tape, by the foot', 'accessory', 2.00, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/07/White-Snap-Tape.jpg', true, false, 'Accessories', 'Other Items', 5, 1, 0, 200),
('tieup_strap', 'Tie-Up Strap', 'Strap for tying up panels', 'accessory', 2.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Tie-Up-Straps-1.jpg', true, false, 'Accessories', 'Other Items', 6, 1, 0, 100),
('velcro_white', 'Adhesive Hook Velcro (White)', 'White self-adhesive velcro, by the foot', 'accessory', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/White-Velcro-1.jpg', true, false, 'Accessories', 'Other Items', 7, 1, 0, 100),
('velcro_black', 'Adhesive Hook Velcro (Black)', 'Black self-adhesive velcro, by the foot', 'accessory', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-Velcro-1.jpg', true, false, 'Accessories', 'Other Items', 8, 1, 0, 100),
('l_screw', 'L Screws', 'L-shaped screws, pack of 4', 'attachment', 1.00, 'each', 4, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/L-Screws-1.jpg', true, false, 'Attachment Hardware', 'Other Items', 9, 1, 0, 100),
('screw_stud_1inch', '1" Screw Studs', 'Screw studs 1 inch, pack of 10', 'attachment', 1.50, 'each', 10, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/1-INCH-SCREW.jpg', true, false, 'Attachment Hardware', 'Other Items', 10, 1, 0, 100),
('screw_stud_2inch', '2" Screw Studs', 'Screw studs 2 inch, pack of 10', 'attachment', 1.50, 'each', 10, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/2-INCH-SCREW.jpg', true, false, 'Attachment Hardware', 'Other Items', 11, 1, 0, 100),

-- Accessories: Stucco
('stucco_standard', 'Standard Stucco Strip', 'Standard stucco mounting strip', 'accessory', 24.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Panel-Example.jpg', true, false, 'Accessories', 'Stucco', 1, 1, 0, 100),
('stucco_zippered', 'Zippered Stucco Strip', 'Zippered stucco mounting strip', 'accessory', 40.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Panel-Example.jpg', true, false, 'Accessories', 'Stucco', 2, 1, 0, 100),

-- Tools
('snap_tool', 'Industrial Snap Tool', 'Fully refundable if returned', 'tool', 130.00, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Industrial-Snap-Tool.jpg', true, false, 'Tools', NULL, 1, 1, 0, 10),

-- Panels (configurable -- use product_options for pricing details)
('mesh_panel', 'Mesh Panel', 'Custom mosquito netting panel', 'panel', 24.00, '/panel', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Panel-Example.jpg', true, false, 'Panels', 'Mesh Panels', 1, 1, 0, 100),
('vinyl_panel', 'Clear Vinyl Panel', 'Custom clear vinyl panel', 'panel', 0, '/panel', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Panel-Example.jpg', true, false, 'Panels', 'Vinyl Panels', 2, 1, 0, 100),
('rollup_shade_screen', 'Roll-Up Shade Screen', 'Roll-up shade screen with mechanism', 'panel', 10.00, '/panel', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/06/Single-Ply.jpg', true, false, 'Panels', 'Roll-Up', 3, 1, 0, 100),

-- Raw Materials (configurable -- use product_options for roll sizes and pricing)
('raw_heavy_mosquito', 'Raw Heavy Mosquito Mesh', 'Raw heavy mosquito mesh by the foot', 'raw_material', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Raw-Mesh.jpg', true, false, 'Raw Materials', 'Mesh', 1, 1, 5, 200),
('raw_no_see_um', 'Raw No-See-Um Mesh', 'Raw no-see-um mesh by the foot', 'raw_material', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Raw-Mesh.jpg', true, false, 'Raw Materials', 'Mesh', 2, 1, 5, 200),
('raw_shade', 'Raw Shade Mesh', 'Raw shade mesh by the foot', 'raw_material', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Raw-Mesh.jpg', true, false, 'Raw Materials', 'Mesh', 3, 1, 5, 200),
('raw_theater_scrim', 'Raw Theater Scrim Mesh', 'Raw theater scrim mesh by the foot', 'raw_material', 0, '/ft', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Raw-Mesh.jpg', true, false, 'Raw Materials', 'Mesh', 4, 1, 5, 200),
('raw_industrial_mesh', 'Raw Industrial Mesh', 'Raw industrial mesh, by foot or by roll', 'raw_material', 0, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Industrial-Mesh-WooCommerce.jpg', true, false, 'Raw Materials', 'Industrial', 5, 1, 1, 200),

-- Adjustments (configurable -- types in product_options)
('adjustment', 'Adjustment', 'Price adjustment or modification', 'adjustment', 0, 'each', 1, 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Product-Adjustment-Image.png', true, false, 'Adjustments', NULL, 1, 1, 0, 100);


-- ============================================================================
-- PHASE 5: Create new product_options table
-- ============================================================================

CREATE TABLE product_options (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_name text NOT NULL,
  option_value text NOT NULL,
  display_label text NOT NULL,
  price decimal(10,2) DEFAULT 0,
  fee decimal(10,2) DEFAULT 0,
  image_url text,
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  admin_only boolean DEFAULT false,
  pricing_key text,
  UNIQUE(product_id, option_name, option_value)
);

-- Indexes
CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_product_options_pricing_key ON product_options(pricing_key) WHERE pricing_key IS NOT NULL;

-- ============================================================================
-- PHASE 6: Seed product_options
-- ============================================================================

-- mesh_panel options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
-- mesh_type (price = rate per linear foot of width)
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'mesh_type', 'heavy_mosquito', 'Heavy Mosquito', 18.00, 0, true, 1, false, 'mesh_heavy_mosquito'),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'mesh_type', 'no_see_um', 'No-See-Um', 19.00, 0, false, 2, false, 'mesh_no_see_um'),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'mesh_type', 'shade', 'Shade', 20.00, 0, false, 3, false, 'mesh_shade'),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'mesh_type', 'scrim', 'Scrim', 19.00, 0, false, 4, true, 'mesh_scrim'),
-- color (no price impact)
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'color', 'black', 'Black', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'color', 'white', 'White', 0, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'color', 'ivory', 'Ivory', 0, 0, false, 3, false, NULL),
-- top_attachment (no price impact)
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'top_attachment', 'standard_track', 'Standard Track (<10ft Tall)', 0, 0, false, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'top_attachment', 'heavy_track', 'Heavy Track (>10ft Tall)', 0, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'top_attachment', 'velcro', 'Velcro', 0, 0, true, 3, false, NULL),
((SELECT id FROM products WHERE sku = 'mesh_panel'), 'top_attachment', 'special_rigging', 'Special Rigging', 0, 0, false, 4, true, NULL);

-- vinyl_panel options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
-- size (price = rate per linear foot, fee = flat panel fee)
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'size', 'short', 'Short (<48")', 28.00, 55.00, false, 1, false, 'vinyl_short'),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'size', 'medium', 'Medium (48"-96")', 34.00, 60.00, true, 2, false, 'vinyl_medium'),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'size', 'tall', 'Tall (>96")', 41.00, 65.00, false, 3, false, 'vinyl_tall'),
-- canvas_color (no price impact)
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'tbd', 'To Be Determined', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'ashen_gray', 'Ashen Gray', 0, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'burgundy', 'Burgundy', 0, 0, false, 3, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'black', 'Black', 0, 0, false, 4, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'cocoa_brown', 'Cocoa Brown', 0, 0, false, 5, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'clear_top_to_bottom', 'Clear (Top to Bottom)', 0, 0, false, 6, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'forest_green', 'Forest Green', 0, 0, false, 7, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'moss_green', 'Moss Green', 0, 0, false, 8, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'navy_blue', 'Navy Blue', 0, 0, false, 9, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'royal_blue', 'Royal Blue', 0, 0, false, 10, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'canvas_color', 'sandy_tan', 'Sandy Tan', 0, 0, false, 11, false, NULL),
-- top_attachment (no price impact)
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'top_attachment', 'standard_track', 'Standard Track (<10ft Tall)', 0, 0, false, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'top_attachment', 'heavy_track', 'Heavy Track (>10ft Tall)', 0, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'top_attachment', 'velcro', 'Velcro', 0, 0, true, 3, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'top_attachment', 'binding_only', 'Binding Only', 0, 0, false, 4, false, NULL),
((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'top_attachment', 'special_rigging', 'Special Rigging', 0, 0, false, 5, true, NULL);

-- rollup_shade_screen options
-- Pricing: $10/screen (base_price) + width(in) × ply rate ($1.00 single / $1.67 double)
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'rollup_shade_screen'), 'ply', 'single', 'Single Ply', 1.00, 0, true, 1, false, 'rollup_ply_single'),
((SELECT id FROM products WHERE sku = 'rollup_shade_screen'), 'ply', 'double', 'Double Ply', 1.67, 0, false, 2, false, 'rollup_ply_double');

-- raw_heavy_mosquito options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'roll_size', '101', '101" Wide', 5.50, 0, true, 1, false, 'raw_heavy_mosquito_101'),
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'roll_size', '123', '123" Wide', 6.00, 0, false, 2, false, 'raw_heavy_mosquito_123'),
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'roll_size', '138', '138" Wide', 6.50, 0, false, 3, false, 'raw_heavy_mosquito_138'),
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'color', 'black', 'Black', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'color', 'white', 'White', 0, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'raw_heavy_mosquito'), 'color', 'ivory', 'Ivory', 0, 0, false, 3, false, NULL);

-- raw_no_see_um options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_no_see_um'), 'roll_size', '101', '101" Wide', 6.00, 0, true, 1, false, 'raw_no_see_um_101'),
((SELECT id FROM products WHERE sku = 'raw_no_see_um'), 'roll_size', '123', '123" Wide', 7.00, 0, false, 2, false, 'raw_no_see_um_123'),
((SELECT id FROM products WHERE sku = 'raw_no_see_um'), 'color', 'black', 'Black', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'raw_no_see_um'), 'color', 'white', 'White', 0, 0, false, 2, false, NULL);

-- raw_shade options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_shade'), 'roll_size', '120', '120" Wide', 7.00, 0, true, 1, false, 'raw_shade_120'),
((SELECT id FROM products WHERE sku = 'raw_shade'), 'color', 'black', 'Black', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'raw_shade'), 'color', 'white', 'White', 0, 0, false, 2, false, NULL);

-- raw_theater_scrim options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_theater_scrim'), 'roll_size', '120', '120" Wide', 7.00, 0, true, 1, false, 'raw_theater_scrim_120'),
((SELECT id FROM products WHERE sku = 'raw_theater_scrim'), 'roll_size', '140', '140" Wide', 7.50, 0, false, 2, false, 'raw_theater_scrim_140'),
((SELECT id FROM products WHERE sku = 'raw_theater_scrim'), 'color', 'white', 'White', 0, 0, true, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'raw_theater_scrim'), 'color', 'silver', 'Silver', 0, 0, false, 2, false, NULL);

-- raw_industrial_mesh options
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_industrial_mesh'), 'purchase_type', 'by_foot', 'By the Foot ($4/ft, 65" roll)', 4.00, 0, true, 1, false, 'raw_industrial_mesh_foot'),
((SELECT id FROM products WHERE sku = 'raw_industrial_mesh'), 'purchase_type', 'by_roll', 'Full Roll (65"x330ft)', 1350.00, 0, false, 2, false, 'raw_industrial_mesh_roll');

-- adjustment options (dropdown choices for adjustment type)
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'heavy_webbing_3pb', '3PB Heavy Webbing', 1.00, 0, false, 1, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'heavy_webbing_4pb', '4PB Heavy Webbing', 1.00, 0, false, 2, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'heavy_webbing_6pb', '6PB Heavy Webbing', 2.00, 0, false, 3, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'velcro_sides', 'Velcro for Sides & Bottom', 1.50, 0, false, 4, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'notch_mesh', 'Notch - Mosquito Curtain', 20.00, 0, false, 5, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'notch_vinyl', 'Notch - Vinyl Panel', 40.00, 0, false, 6, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'slope_mesh', 'Slope - Mosquito Curtain', 1.50, 0, false, 7, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'slope_vinyl', 'Slope - Vinyl Panel', 2.00, 0, false, 8, false, NULL),
((SELECT id FROM products WHERE sku = 'adjustment'), 'type', 'custom', 'Custom', 0, 0, false, 9, false, NULL);


-- ============================================================================
-- PHASE 7: Pricing history audit table
-- ============================================================================

CREATE TABLE pricing_history (
  id serial PRIMARY KEY,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  field_name text NOT NULL,
  old_value decimal(10,4),
  new_value decimal(10,4) NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by text
);

CREATE INDEX idx_pricing_history_record ON pricing_history(table_name, record_id);

-- Audit trigger for products.base_price
CREATE OR REPLACE FUNCTION log_product_price_change() RETURNS trigger AS $$
BEGIN
  IF OLD.base_price IS DISTINCT FROM NEW.base_price THEN
    INSERT INTO pricing_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('products', NEW.id, 'base_price', OLD.base_price, NEW.base_price);
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_price_audit ON products;
CREATE TRIGGER products_price_audit
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION log_product_price_change();

-- Audit trigger for product_options.price and .fee
CREATE OR REPLACE FUNCTION log_option_price_change() RETURNS trigger AS $$
BEGIN
  IF OLD.price IS DISTINCT FROM NEW.price THEN
    INSERT INTO pricing_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('product_options', NEW.id, 'price', OLD.price, NEW.price);
  END IF;
  IF OLD.fee IS DISTINCT FROM NEW.fee THEN
    INSERT INTO pricing_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('product_options', NEW.id, 'fee', OLD.fee, NEW.fee);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS options_price_audit ON product_options;
CREATE TRIGGER options_price_audit
  AFTER UPDATE ON product_options
  FOR EACH ROW EXECUTE FUNCTION log_option_price_change();


-- ============================================================================
-- PHASE 8: RLS policies
-- ============================================================================

-- product_options: readable by everyone
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_options_public_read" ON product_options FOR SELECT USING (true);

-- pricing_history: readable by everyone
ALTER TABLE pricing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing_history_public_read" ON pricing_history FOR SELECT USING (true);


-- ============================================================================
-- PHASE 9: Re-add FK for legacy_product_mapping
-- ============================================================================

ALTER TABLE legacy_product_mapping
  ADD CONSTRAINT legacy_product_mapping_new_product_sku_fkey
  FOREIGN KEY (new_product_sku) REFERENCES products(sku);


COMMIT;
