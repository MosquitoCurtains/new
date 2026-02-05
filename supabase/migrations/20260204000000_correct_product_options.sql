-- Correct Product Options Migration
-- Migration: 20260204000000_correct_product_options.sql
-- Description: Corrects product options to match actual Gravity Forms structure
-- 
-- KEY CHANGES:
-- 1. Adds meta columns to product_options and option_values for rich data
-- 2. Mesh Panels: mesh_type, mesh_color (conditional), top_attachment, velcro_color
-- 3. Clear Vinyl: panel_size (height tier pricing), canvas_color, top_attachment, velcro_color
-- 4. Removes incorrect "gauge/thickness" options from vinyl

-- ============================================================================
-- ADD META COLUMNS (if they don't exist)
-- ============================================================================

ALTER TABLE product_options ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;
ALTER TABLE option_values ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- ============================================================================
-- CLEAR EXISTING OPTIONS FOR PANELS (to rebuild correctly)
-- ============================================================================

DELETE FROM option_values WHERE option_id IN (
  SELECT po.id FROM product_options po
  JOIN products p ON po.product_id = p.id
  WHERE p.sku IN ('mesh_panel', 'vinyl_panel')
);

DELETE FROM product_options WHERE product_id IN (
  SELECT id FROM products WHERE sku IN ('mesh_panel', 'vinyl_panel')
);

-- ============================================================================
-- UPDATE VINYL PANEL DESCRIPTION
-- ============================================================================

UPDATE products 
SET description = 'Heavy-duty 20-gauge clear vinyl panel with canvas border for weather protection'
WHERE sku = 'vinyl_panel';

-- ============================================================================
-- MESH PANEL OPTIONS
-- ============================================================================

DO $$
DECLARE
  mesh_panel_id UUID;
  vinyl_panel_id UUID;
  opt_id UUID;
BEGIN
  -- Get Panel IDs
  SELECT id INTO mesh_panel_id FROM products WHERE sku = 'mesh_panel';
  SELECT id INTO vinyl_panel_id FROM products WHERE sku = 'vinyl_panel';

  -- ========================================
  -- MESH PANEL OPTIONS
  -- ========================================
  
  -- 1. Mesh Type (determines price per linear foot)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (mesh_panel_id, 'mesh_type', 'Mesh Type', 'select', true, 1, 
    '{"pricing_type": "per_linear_foot", "help_text": "Choose based on the insects in your area"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order, meta) VALUES
  (opt_id, 'heavy_mosquito', 'Heavy Mosquito Netting', 18.00, true, 1, 
    '{"image": "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg", "description": "Most popular. Blocks mosquitoes, gnats, and black flies.", "colors": ["black", "white", "ivory"]}'::jsonb),
  (opt_id, 'no_see_um', 'No-See-Um Netting', 19.00, false, 2,
    '{"image": "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg", "description": "Finer weave for tiny midge flies common near coastal areas.", "colors": ["black", "white"]}'::jsonb),
  (opt_id, 'shade', 'Shade Netting', 20.00, false, 3,
    '{"image": "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg", "description": "Provides shade, privacy and insect protection. Works as projection screen.", "colors": ["black", "white"]}'::jsonb);
  
  -- 2. Mesh Color (conditional based on mesh_type)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (mesh_panel_id, 'mesh_color', 'Mesh Color', 'color', true, 2,
    '{"conditional": {"field": "mesh_type", "rules": {"heavy_mosquito": ["black", "white", "ivory"], "no_see_um": ["black", "white"], "shade": ["black", "white"]}}}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'black', 'Black', true, 1, '{"hex": "#1a1a1a", "popularity": 90}'::jsonb),
  (opt_id, 'white', 'White', false, 2, '{"hex": "#f5f5f5"}'::jsonb),
  (opt_id, 'ivory', 'Ivory', false, 3, '{"hex": "#FFFFF0", "available_for": ["heavy_mosquito"]}'::jsonb);
  
  -- 3. Top Attachment
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (mesh_panel_id, 'top_attachment', 'Top Attachment', 'select', true, 3,
    '{"help_text": "Track allows sliding, Velcro is fixed in place"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'standard_track', 'Standard Track', false, 1, 
    '{"description": "For panels under 10ft tall. Slides side-to-side.", "image": "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif", "requires_hardware": true}'::jsonb),
  (opt_id, 'heavy_track', 'Heavy Track', false, 2,
    '{"description": "For panels over 10ft tall. Extra durability.", "requires_hardware": true}'::jsonb),
  (opt_id, 'velcro', 'Velcro', true, 3,
    '{"description": "Fixed in place, most affordable option.", "image": "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif", "shows_conditional": "velcro_color"}'::jsonb),
  (opt_id, 'special_rigging', 'Special Rigging', false, 4,
    '{"description": "Custom attachment for unique situations."}'::jsonb);
  
  -- 4. Velcro Color (conditional - only shows when velcro is selected)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (mesh_panel_id, 'velcro_color', 'Velcro Color For Mounting Surface', 'color', false, 4,
    '{"conditional": {"field": "top_attachment", "show_when": ["velcro"]}, "help_text": "Color of velcro strip that attaches to your structure"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'black', 'Black', true, 1, '{"hex": "#1a1a1a"}'::jsonb),
  (opt_id, 'white', 'White', false, 2, '{"hex": "#f5f5f5"}'::jsonb);

  -- ========================================
  -- CLEAR VINYL PANEL OPTIONS
  -- ========================================
  
  -- 1. Panel Size (height-based pricing tier)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (vinyl_panel_id, 'panel_size', 'Panel Size', 'select', true, 1,
    '{"pricing_type": "per_linear_foot", "help_text": "Based on panel height range"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, price_modifier, is_default, sort_order, meta) VALUES
  (opt_id, 'short', 'Short', 28.00, false, 1,
    '{"description": "For shorter panels", "height_range": "Under standard height", "canvas_color_available": false}'::jsonb),
  (opt_id, 'medium', 'Medium', 34.00, true, 2,
    '{"description": "Standard height panels", "height_range": "Standard height", "canvas_color_available": true}'::jsonb),
  (opt_id, 'tall', 'Tall', 41.00, false, 3,
    '{"description": "For taller panels", "height_range": "Above standard height", "canvas_color_available": true}'::jsonb);
  
  -- 2. Canvas Color (the fabric border around vinyl - conditional on panel_size)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (vinyl_panel_id, 'canvas_color', 'Canvas Color', 'color', false, 2,
    '{"conditional": {"field": "panel_size", "show_when": ["medium", "tall"]}, "help_text": "Color of the fabric border around the clear vinyl"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'tbd', 'TBD (To Be Determined)', false, 0, '{"hex": "#cccccc"}'::jsonb),
  (opt_id, 'ashen_gray', 'Ashen Gray', false, 1, '{"hex": "#B2BEB5"}'::jsonb),
  (opt_id, 'burgundy', 'Burgundy', false, 2, '{"hex": "#800020"}'::jsonb),
  (opt_id, 'black', 'Black', true, 3, '{"hex": "#1a1a1a"}'::jsonb),
  (opt_id, 'cocoa_brown', 'Cocoa Brown', false, 4, '{"hex": "#D2691E"}'::jsonb),
  (opt_id, 'clear_top_to_bottom', 'Clear Top To Bottom', false, 5, '{"hex": "#E8F4F8", "description": "No canvas border - all clear vinyl"}'::jsonb),
  (opt_id, 'forest_green', 'Forest Green', false, 6, '{"hex": "#228B22"}'::jsonb),
  (opt_id, 'moss_green', 'Moss Green', false, 7, '{"hex": "#8A9A5B"}'::jsonb),
  (opt_id, 'navy_blue', 'Navy Blue', false, 8, '{"hex": "#000080"}'::jsonb),
  (opt_id, 'royal_blue', 'Royal Blue', false, 9, '{"hex": "#4169E1"}'::jsonb),
  (opt_id, 'sandy_tan', 'Sandy Tan', false, 10, '{"hex": "#D2B48C"}'::jsonb);
  
  -- 3. Top Attachment
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (vinyl_panel_id, 'top_attachment', 'Top Attachment', 'select', true, 3,
    '{"help_text": "How the panel attaches at the top"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'standard_track', 'Standard Track', false, 1,
    '{"description": "For panels under 10ft tall. Slides side-to-side.", "requires_hardware": true}'::jsonb),
  (opt_id, 'heavy_track', 'Heavy Track', false, 2,
    '{"description": "For panels over 10ft tall. Extra durability.", "requires_hardware": true}'::jsonb),
  (opt_id, 'velcro', 'Velcro', true, 3,
    '{"description": "Fixed in place, most affordable option.", "shows_conditional": "velcro_color"}'::jsonb),
  (opt_id, 'binding_only', 'Binding Only', false, 4,
    '{"description": "Just the finished edge, no attachment hardware."}'::jsonb),
  (opt_id, 'special_rigging', 'Special Rigging', false, 5,
    '{"description": "Custom attachment for unique situations."}'::jsonb);
  
  -- 4. Velcro Color (conditional)
  INSERT INTO product_options (product_id, name, display_name, option_type, is_required, sort_order, meta)
  VALUES (vinyl_panel_id, 'velcro_color', 'Velcro Color For Mounting Surface', 'color', false, 4,
    '{"conditional": {"field": "top_attachment", "show_when": ["velcro"]}, "help_text": "Color of velcro strip that attaches to your structure"}'::jsonb)
  RETURNING id INTO opt_id;
  
  INSERT INTO option_values (option_id, value, display_value, is_default, sort_order, meta) VALUES
  (opt_id, 'black', 'Black', true, 1, '{"hex": "#1a1a1a"}'::jsonb),
  (opt_id, 'white', 'White', false, 2, '{"hex": "#f5f5f5"}'::jsonb);

END $$;

-- ============================================================================
-- VERIFY
-- ============================================================================
DO $$
DECLARE
  mesh_option_count INTEGER;
  vinyl_option_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO mesh_option_count 
  FROM product_options po
  JOIN products p ON po.product_id = p.id
  WHERE p.sku = 'mesh_panel';
  
  SELECT COUNT(*) INTO vinyl_option_count 
  FROM product_options po
  JOIN products p ON po.product_id = p.id
  WHERE p.sku = 'vinyl_panel';
  
  RAISE NOTICE 'Product options corrected: Mesh Panel has % options, Vinyl Panel has % options', 
    mesh_option_count, vinyl_option_count;
END $$;
