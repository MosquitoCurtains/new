-- ============================================================================
-- Migration: Add valid_for column to product_options + seed missing options
-- ============================================================================
-- Adds a text[] column for expressing conditional dependencies between options.
-- Example: color "ivory" is only valid when mesh_type IN ('heavy_mosquito').
-- NULL means "valid for all" (no constraint).
-- Idempotent: safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add valid_for column (skip if already exists)
-- ============================================================================

ALTER TABLE product_options ADD COLUMN IF NOT EXISTS valid_for text[];

-- ============================================================================
-- STEP 2: Add missing silver color for mesh_panel
-- ============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key, valid_for)
VALUES (
  (SELECT id FROM products WHERE sku = 'mesh_panel'),
  'color', 'silver', 'Silver', 0, 0, false, 4, false, NULL, '{scrim}'
)
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- ============================================================================
-- STEP 3: Set valid_for constraints on existing mesh_panel colors
-- ============================================================================

UPDATE product_options
SET valid_for = '{heavy_mosquito, no_see_um, shade}'
WHERE product_id = (SELECT id FROM products WHERE sku = 'mesh_panel')
  AND option_name = 'color'
  AND option_value = 'black';

UPDATE product_options
SET valid_for = '{heavy_mosquito, no_see_um, shade, scrim}'
WHERE product_id = (SELECT id FROM products WHERE sku = 'mesh_panel')
  AND option_name = 'color'
  AND option_value = 'white';

UPDATE product_options
SET valid_for = '{heavy_mosquito}'
WHERE product_id = (SELECT id FROM products WHERE sku = 'mesh_panel')
  AND option_name = 'color'
  AND option_value = 'ivory';

-- ============================================================================
-- STEP 4: Add velcro_color options for mesh_panel
-- ============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key)
VALUES
  ((SELECT id FROM products WHERE sku = 'mesh_panel'), 'velcro_color', 'black', 'Black', 0, 0, true, 1, false, NULL),
  ((SELECT id FROM products WHERE sku = 'mesh_panel'), 'velcro_color', 'white', 'White', 0, 0, false, 2, false, NULL)
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- ============================================================================
-- STEP 5: Add velcro_color options for vinyl_panel
-- ============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key)
VALUES
  ((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'velcro_color', 'black', 'Black', 0, 0, true, 1, false, NULL),
  ((SELECT id FROM products WHERE sku = 'vinyl_panel'), 'velcro_color', 'white', 'White', 0, 0, false, 2, false, NULL)
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- ============================================================================
-- STEP 6: Add color options for ALL track products
-- ============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, admin_only, pricing_key)
SELECT p.id, 'color', v.option_value, v.display_label, 0, 0, v.is_default, v.sort_order, false, NULL
FROM products p
CROSS JOIN (VALUES
  ('white', 'White', true, 1),
  ('black', 'Black', false, 2)
) AS v(option_value, display_label, is_default, sort_order)
WHERE p.product_type = 'track'
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

COMMIT;
