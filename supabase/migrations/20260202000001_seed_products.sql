-- Product Seed Data
-- Migration: 20260202000001_seed_products.sql
-- Description: Seeds all products, options, and values for Mosquito Curtains
-- Run this AFTER: 20260202000000_ecommerce_schema.sql

-- ============================================================================
-- CLEAR EXISTING (for re-runs)
-- ============================================================================
TRUNCATE products CASCADE;

-- ============================================================================
-- PANEL PRODUCTS
-- ============================================================================

-- Mesh Panel (Custom sized mosquito netting)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) VALUES
('mesh_panel', 'Mosquito Netting Panel', 'Custom-sized mosquito netting panel with your choice of mesh type, color, and attachments', 'panel', 'sqft', 1.50, true, 1, '{"min_sqft": 10}'::jsonb);

-- Clear Vinyl Panel
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) VALUES
('vinyl_panel', 'Clear Vinyl Panel', 'Heavy-duty 20-gauge clear vinyl panel for weather protection', 'panel', 'sqft', 4.00, true, 2, '{"min_sqft": 10, "gauge": 20}'::jsonb);

-- Scrim Panel (Super tight weave)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) VALUES
('scrim_panel', 'Scrim Netting Panel', 'Ultra-fine scrim netting for maximum bug protection', 'panel', 'sqft', 2.50, true, 3, '{"min_sqft": 10}'::jsonb);

-- Roll-Up Screen Panel
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) VALUES
('rollup_panel', 'Roll-Up Shade Screen Panel', 'Roll-up shade screen with cord mechanism', 'panel', 'sqft', 3.00, true, 4, '{"min_sqft": 10}'::jsonb);

-- ============================================================================
-- TRACK PRODUCTS
-- ============================================================================

-- Straight Track
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('straight_track', 'Straight Track', 'Straight ceiling track for curtain mounting', 'track', 'linear_ft', 3.50, true, 10);

-- 90 Degree Curve
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('curve_90', '90 Degree Curve', '90-degree corner piece for track systems', 'track', 'each', 12.00, true, 11);

-- 135 Degree Curve
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('curve_135', '135 Degree Curve', '135-degree corner piece for angled corners', 'track', 'each', 15.00, true, 12);

-- Splice
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('track_splice', 'Track Splice', 'Splice connector for joining track pieces', 'track', 'each', 5.00, true, 13);

-- End Cap
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('track_endcap', 'Track End Cap', 'End cap to finish track runs', 'track', 'each', 2.50, true, 14);

-- Snap Carriers
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('snap_carriers', 'Snap Carriers', 'Snap carriers that ride in track (2 per foot of panel width recommended)', 'track', 'each', 0.75, true, 15);

-- ============================================================================
-- ATTACHMENT PRODUCTS
-- ============================================================================

-- Marine Snaps
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('marine_snap', 'Marine Snaps', 'Heavy-duty marine snaps with screw studs', 'attachment', 'each', 0.35, true, 20);

-- Adhesive Snaps
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('adhesive_snap', 'Adhesive Marine Snaps', 'Self-adhesive marine snaps for tile, concrete, or metal', 'attachment', 'each', 2.50, true, 21);

-- Chrome Snaps
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('chrome_snap', 'Chrome Snaps', 'Decorative chrome snaps', 'attachment', 'each', 0.50, true, 22);

-- Panel-to-Panel Snaps
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('panel_snap', 'Panel-to-Panel Snaps', 'Snaps for connecting panels together', 'attachment', 'each', 1.67, true, 23);

-- Block Magnets
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('block_magnet', 'Block Magnets', 'Strong block-shaped magnets for magnetic closures', 'attachment', 'each', 1.00, true, 24);

-- Ring Magnets
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('ring_magnet', 'Ring Magnets', 'Ring-shaped magnets for magnetic closures', 'attachment', 'each', 1.50, true, 25);

-- Fiberglass Rods & Clips
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('fiberglass_rod', 'Fiberglass Rod Set', 'Fiberglass rod with mounting clips for magnetic doorways', 'attachment', 'set', 10.00, true, 26);

-- Fiberglass Clip (extra)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('fiberglass_clip', 'Fiberglass Rod Clip', 'Extra clip for fiberglass rods', 'attachment', 'each', 2.00, true, 27);

-- Elastic Cord & D-Rings
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('elastic_cord', 'Elastic Cord & D-Ring Set', 'Elastic cord with D-rings for tension mounting', 'attachment', 'set', 10.00, true, 28);

-- Tether Clip
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('tether_clip', 'Tether Clip', 'Tether clip to secure bottom of panel to post', 'attachment', 'each', 10.00, true, 29);

-- Belted Rib
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('belted_rib', 'Belted Rib', 'Belted rib for clear vinyl panels', 'attachment', 'each', 15.00, true, 30);

-- Screw Stud
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('screw_stud', 'Screw Studs', 'Screw-in stud for snap attachment', 'attachment', 'each', 0.15, true, 31);

-- L Screw
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('l_screw', 'L Screws', 'L-shaped screws for mounting', 'attachment', 'each', 0.25, true, 32);

-- Rubber Washer
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('rubber_washer', 'Rubber Washers', 'Rubber washers for secure mounting', 'attachment', 'each', 0.20, true, 33);

-- Rod Clip
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('rod_clip', 'Rod Clips', 'Clips for rod mounting', 'attachment', 'each', 2.00, true, 34);

-- ============================================================================
-- ACCESSORY PRODUCTS
-- ============================================================================

-- Adhesive Velcro
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('adhesive_velcro', 'Adhesive Hook Velcro', 'Self-adhesive hook velcro strip', 'accessory', 'linear_ft', 0.50, true, 40);

-- 2" Webbing
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('webbing', '2" Webbing', '2-inch wide webbing for reinforcement', 'accessory', 'linear_ft', 0.40, true, 41);

-- Snap Tape
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('snap_tape', 'Snap Tape', 'Pre-made snap tape strip', 'accessory', 'linear_ft', 2.00, true, 42);

-- Tie-Up Strap
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('tieup_strap', 'Tie-Up Strap', 'Strap for tying up rolled panels', 'accessory', 'each', 2.00, true, 43);

-- Fastwax Cleaner
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('fastwax_cleaner', 'Fastwax Cleaner', 'Vinyl cleaner and protectant', 'accessory', 'each', 15.00, true, 44);

-- Stucco Strip
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('stucco_strip', 'Stucco Strip', 'Mounting strip for stucco walls', 'accessory', 'each', 24.00, true, 45);

-- ============================================================================
-- TOOL PRODUCTS
-- ============================================================================

-- Industrial Snap Tool
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order, meta) VALUES
('industrial_snap_tool', 'Industrial Snap Tool', 'Heavy-duty snap installation tool - FULLY REFUNDABLE if returned', 'tool', 'fixed', 130.00, true, 50, '{"refundable": true, "refund_policy": "100% refund if returned after project completion"}'::jsonb);

-- ============================================================================
-- RAW MATERIAL PRODUCTS
-- ============================================================================

-- Raw Mesh
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('raw_mesh', 'Raw Netting Fabric', 'Unfinished netting fabric by the roll', 'raw_material', 'sqft', 0.75, true, 60);

-- ============================================================================
-- ADJUSTMENT PRODUCTS
-- ============================================================================

-- Price Adjustment (for notches, specials, discounts)
INSERT INTO products (sku, name, description, product_type, pricing_type, base_price, is_active, sort_order) VALUES
('price_adjustment', 'Price Adjustment', 'Custom price adjustment (discount, surcharge, or modification)', 'adjustment', 'calculated', 0, true, 99);

-- ============================================================================
-- PRODUCT OPTIONS
-- ============================================================================

-- Get product IDs for reference
DO $$
DECLARE
  mesh_panel_id UUID;
  vinyl_panel_id UUID;
  scrim_panel_id UUID;
  rollup_panel_id UUID;
  straight_track_id UUID;
  curve_90_id UUID;
  curve_135_id UUID;
  track_splice_id UUID;
  track_endcap_id UUID;
  snap_carriers_id UUID;
  marine_snap_id UUID;
  adhesive_snap_id UUID;
  chrome_snap_id UUID;
  panel_snap_id UUID;
  block_magnet_id UUID;
  ring_magnet_id UUID;
  fiberglass_rod_id UUID;
  fiberglass_clip_id UUID;
  elastic_cord_id UUID;
  tether_clip_id UUID;
  belted_rib_id UUID;
  screw_stud_id UUID;
  l_screw_id UUID;
  rubber_washer_id UUID;
  rod_clip_id UUID;
  adhesive_velcro_id UUID;
  webbing_id UUID;
  snap_tape_id UUID;
  tieup_strap_id UUID;
  stucco_strip_id UUID;
  raw_mesh_id UUID;
  opt_id UUID;
BEGIN
  -- Get Panel IDs
  SELECT id INTO mesh_panel_id FROM products WHERE sku = 'mesh_panel';
  SELECT id INTO vinyl_panel_id FROM products WHERE sku = 'vinyl_panel';
  SELECT id INTO scrim_panel_id FROM products WHERE sku = 'scrim_panel';
  SELECT id INTO rollup_panel_id FROM products WHERE sku = 'rollup_panel';
  
  -- Get Track IDs
  SELECT id INTO straight_track_id FROM products WHERE sku = 'straight_track';
  SELECT id INTO curve_90_id FROM products WHERE sku = 'curve_90';
  SELECT id INTO curve_135_id FROM products WHERE sku = 'curve_135';
  SELECT id INTO track_splice_id FROM products WHERE sku = 'track_splice';
  SELECT id INTO track_endcap_id FROM products WHERE sku = 'track_endcap';
  SELECT id INTO snap_carriers_id FROM products WHERE sku = 'snap_carriers';
  
  -- Get Attachment IDs
  SELECT id INTO marine_snap_id FROM products WHERE sku = 'marine_snap';
  SELECT id INTO adhesive_snap_id FROM products WHERE sku = 'adhesive_snap';
  SELECT id INTO chrome_snap_id FROM products WHERE sku = 'chrome_snap';
  SELECT id INTO panel_snap_id FROM products WHERE sku = 'panel_snap';
  SELECT id INTO block_magnet_id FROM products WHERE sku = 'block_magnet';
  SELECT id INTO ring_magnet_id FROM products WHERE sku = 'ring_magnet';
  SELECT id INTO fiberglass_rod_id FROM products WHERE sku = 'fiberglass_rod';
  SELECT id INTO fiberglass_clip_id FROM products WHERE sku = 'fiberglass_clip';
  SELECT id INTO elastic_cord_id FROM products WHERE sku = 'elastic_cord';
  SELECT id INTO tether_clip_id FROM products WHERE sku = 'tether_clip';
  SELECT id INTO belted_rib_id FROM products WHERE sku = 'belted_rib';
  SELECT id INTO screw_stud_id FROM products WHERE sku = 'screw_stud';
  SELECT id INTO l_screw_id FROM products WHERE sku = 'l_screw';
  SELECT id INTO rubber_washer_id FROM products WHERE sku = 'rubber_washer';
  SELECT id INTO rod_clip_id FROM products WHERE sku = 'rod_clip';
  
  -- Get Accessory IDs
  SELECT id INTO adhesive_velcro_id FROM products WHERE sku = 'adhesive_velcro';
  SELECT id INTO webbing_id FROM products WHERE sku = 'webbing';
  SELECT id INTO snap_tape_id FROM products WHERE sku = 'snap_tape';
  SELECT id INTO tieup_strap_id FROM products WHERE sku = 'tieup_strap';
  SELECT id INTO stucco_strip_id FROM products WHERE sku = 'stucco_strip';
  
  -- Get Raw Material ID
  SELECT id INTO raw_mesh_id FROM products WHERE sku = 'raw_mesh';

  -- ========================================
  -- MESH PANEL OPTIONS
  -- ========================================
  
  -- Mesh Type Option
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (mesh_panel_id, 'mesh_type', 'Mesh Type', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'heavy_mosquito', 'Heavy Mosquito Netting', 1.00, true, 1),
  (opt_id, 'no_see_um', 'No-See-Um Netting', 1.20, false, 2),
  (opt_id, 'shade', 'Shade Netting', 1.10, false, 3);
  
  -- Color Option (mesh panel)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (mesh_panel_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2),
  (opt_id, 'gray', 'Gray', false, 3);
  
  -- Top Attachment Option
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (mesh_panel_id, 'top_attachment', 'Top Attachment', 'select', true, 3)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order) VALUES
  (opt_id, 'velcro', 'Velcro Strip', 0, true, 1),
  (opt_id, 'tracking_short', 'Short Track Snaps (3-4")', 2.00, false, 2),
  (opt_id, 'tracking_tall', 'Tall Track Snaps (10-12")', 4.00, false, 3),
  (opt_id, 'grommets', 'Grommets', 0, false, 4);
  
  -- Bottom Option
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (mesh_panel_id, 'bottom_option', 'Bottom Option', 'select', false, 4)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order) VALUES
  (opt_id, 'weighted_hem', 'Weighted Hem', 0, true, 1),
  (opt_id, 'chain_weight', 'Chain Weight', 5.00, false, 2),
  (opt_id, 'rod_pocket', 'Rod Pocket', 3.00, false, 3);
  
  -- ========================================
  -- VINYL PANEL OPTIONS
  -- ========================================
  
  -- Gauge Option
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (vinyl_panel_id, 'gauge', 'Vinyl Gauge', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '20_gauge', '20 Gauge (Standard)', 1.00, true, 1),
  (opt_id, '30_gauge', '30 Gauge (Heavy Duty)', 1.25, false, 2),
  (opt_id, '40_gauge', '40 Gauge (Extra Heavy)', 1.50, false, 3);
  
  -- Tint Option
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (vinyl_panel_id, 'tint', 'Tint', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'clear', 'Clear', true, 1),
  (opt_id, 'tinted', 'Smoke Tinted', false, 2);
  
  -- Top Attachment for Vinyl
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (vinyl_panel_id, 'top_attachment', 'Top Attachment', 'select', true, 3)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order) VALUES
  (opt_id, 'velcro', 'Velcro Strip', 0, true, 1),
  (opt_id, 'grommets', 'Grommets', 0, false, 2),
  (opt_id, 'snaps', 'Snaps', 0, false, 3);
  
  -- ========================================
  -- TRACK OPTIONS (Weight, Color, Length)
  -- ========================================
  
  -- Straight Track Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (straight_track_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.40, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (straight_track_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'white', 'White', true, 1),
  (opt_id, 'brown', 'Brown', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (straight_track_id, 'length', 'Length (feet)', 'select', true, 3)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order) VALUES
  (opt_id, '4', '4 ft', 0, false, 1),
  (opt_id, '5', '5 ft', 0, false, 2),
  (opt_id, '6', '6 ft', 0, false, 3),
  (opt_id, '7', '7 ft', 0, true, 4),
  (opt_id, '8', '8 ft', 0, false, 5),
  (opt_id, 'custom', 'Custom Length', 0, false, 6);
  
  -- Curve 90 Options (Weight, Color)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (curve_90_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.40, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (curve_90_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'white', 'White', true, 1),
  (opt_id, 'brown', 'Brown', false, 2);
  
  -- Curve 135 Options (Weight, Color)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (curve_135_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.40, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (curve_135_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'white', 'White', true, 1),
  (opt_id, 'brown', 'Brown', false, 2);
  
  -- Splice Options (Weight, Color)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (track_splice_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.40, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (track_splice_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'white', 'White', true, 1),
  (opt_id, 'brown', 'Brown', false, 2);
  
  -- End Cap Options (Weight, Color, Quantity)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (track_endcap_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.40, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (track_endcap_id, 'color', 'Color', 'color', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'white', 'White', true, 1),
  (opt_id, 'brown', 'Brown', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (track_endcap_id, 'quantity', 'Quantity', 'select', true, 3)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '2', '2 Pack', 1.00, true, 1),
  (opt_id, '4', '4 Pack', 2.00, false, 2),
  (opt_id, '6', '6 Pack', 3.00, false, 3),
  (opt_id, '8', '8 Pack', 4.00, false, 4);
  
  -- Snap Carriers Options (Weight, Quantity)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (snap_carriers_id, 'weight', 'Track Weight', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard Weight', 1.00, true, 1),
  (opt_id, 'heavy', 'Heavy Duty', 1.20, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (snap_carriers_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 Pack', 1.00, true, 1),
  (opt_id, '20', '20 Pack', 2.00, false, 2),
  (opt_id, '30', '30 Pack', 3.00, false, 3),
  (opt_id, '50', '50 Pack', 5.00, false, 4),
  (opt_id, '100', '100 Pack', 10.00, false, 5);
  
  -- ========================================
  -- ATTACHMENT OPTIONS (Color, Quantity, Size)
  -- ========================================
  
  -- Marine Snap Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (marine_snap_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (marine_snap_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 Pack', 1.00, true, 1),
  (opt_id, '20', '20 Pack', 2.00, false, 2),
  (opt_id, '30', '30 Pack', 3.00, false, 3),
  (opt_id, '50', '50 Pack', 5.00, false, 4),
  (opt_id, '100', '100 Pack', 10.00, false, 5);
  
  -- Adhesive Snap Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (adhesive_snap_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2),
  (opt_id, 'clear', 'Clear', false, 3);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (adhesive_snap_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 Pack', 1.00, true, 1),
  (opt_id, '20', '20 Pack', 2.00, false, 2),
  (opt_id, '30', '30 Pack', 3.00, false, 3);
  
  -- Block Magnet Quantity
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (block_magnet_id, 'quantity', 'Quantity', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 Pack', 1.00, true, 1),
  (opt_id, '20', '20 Pack', 2.00, false, 2),
  (opt_id, '30', '30 Pack', 3.00, false, 3),
  (opt_id, '50', '50 Pack', 5.00, false, 4);
  
  -- Fiberglass Rod Quantity
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (fiberglass_rod_id, 'quantity', 'Quantity', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '2', '2 Sets', 1.00, true, 1),
  (opt_id, '4', '4 Sets', 2.00, false, 2),
  (opt_id, '6', '6 Sets', 3.00, false, 3);
  
  -- Elastic Cord Color
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (elastic_cord_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (elastic_cord_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '1', '1 Set', 1.00, true, 1),
  (opt_id, '2', '2 Sets', 2.00, false, 2),
  (opt_id, '4', '4 Sets', 4.00, false, 3);
  
  -- Screw Stud Size & Quantity
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (screw_stud_id, 'size', 'Size', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, '1_inch', '1 inch', true, 1),
  (opt_id, '2_inch', '2 inch', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (screw_stud_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 Pack', 1.00, true, 1),
  (opt_id, '20', '20 Pack', 2.00, false, 2),
  (opt_id, '50', '50 Pack', 5.00, false, 3),
  (opt_id, '100', '100 Pack', 10.00, false, 4);
  
  -- ========================================
  -- ACCESSORY OPTIONS (Color, Length)
  -- ========================================
  
  -- Adhesive Velcro Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (adhesive_velcro_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (adhesive_velcro_id, 'length', 'Length', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 ft', 1.00, true, 1),
  (opt_id, '20', '20 ft', 2.00, false, 2),
  (opt_id, '30', '30 ft', 3.00, false, 3),
  (opt_id, '50', '50 ft', 5.00, false, 4);
  
  -- Webbing Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (webbing_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (webbing_id, 'length', 'Length', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '10', '10 ft', 1.00, true, 1),
  (opt_id, '25', '25 ft', 2.50, false, 2),
  (opt_id, '50', '50 ft', 5.00, false, 3);
  
  -- Snap Tape Options
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (snap_tape_id, 'color', 'Color', 'color', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (snap_tape_id, 'length', 'Length', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '5', '5 ft', 1.00, true, 1),
  (opt_id, '10', '10 ft', 2.00, false, 2);
  
  -- Stucco Strip Options (Zippered or not)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (stucco_strip_id, 'type', 'Type', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order) VALUES
  (opt_id, 'standard', 'Standard', 0, true, 1),
  (opt_id, 'zippered', 'Zippered', 16.00, false, 2);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (stucco_strip_id, 'quantity', 'Quantity', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '1', '1 Strip', 1.00, true, 1),
  (opt_id, '2', '2 Strips', 2.00, false, 2),
  (opt_id, '3', '3 Strips', 3.00, false, 3),
  (opt_id, '4', '4 Strips', 4.00, false, 4);
  
  -- ========================================
  -- RAW MESH OPTIONS
  -- ========================================
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (raw_mesh_id, 'material_type', 'Material Type', 'select', true, 1)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, 'heavy_mosquito', 'Heavy Mosquito Netting', 1.00, true, 1),
  (opt_id, 'no_see_um', 'No-See-Um Netting', 1.20, false, 2),
  (opt_id, 'shade', 'Shade Netting', 1.10, false, 3),
  (opt_id, 'scrim', 'Scrim Netting', 1.50, false, 4);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (raw_mesh_id, 'roll_width', 'Roll Width', 'select', true, 2)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_multiplier, is_default, sort_order) VALUES
  (opt_id, '54', '54 inches', 1.00, true, 1),
  (opt_id, '72', '72 inches', 1.33, false, 2),
  (opt_id, '96', '96 inches', 1.78, false, 3);
  
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order)
  VALUES (raw_mesh_id, 'color', 'Color', 'color', true, 3)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order) VALUES
  (opt_id, 'black', 'Black', true, 1),
  (opt_id, 'white', 'White', false, 2),
  (opt_id, 'gray', 'Gray', false, 3);

END $$;

-- ============================================================================
-- VERIFY
-- ============================================================================
DO $$
DECLARE
  product_count INTEGER;
  option_count INTEGER;
  value_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  SELECT COUNT(*) INTO option_count FROM product_options;
  SELECT COUNT(*) INTO value_count FROM option_values;
  
  RAISE NOTICE 'Seed complete: % products, % options, % values', product_count, option_count, value_count;
END $$;
