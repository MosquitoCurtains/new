-- =============================================================================
-- Consolidate all raw netting into ONE canonical product: raw_netting_panel
-- =============================================================================
-- Replaces 5 separate SKUs (raw_heavy_mosquito, raw_no_see_um, raw_shade,
-- raw_theater_scrim, raw_industrial_mesh) with a single configurable product.
--
-- A "plain sheet by the foot" is simply a panel with edge_finish = none.
--
-- Product Options:
--   1. mesh_type                    — 5 types
--   2. color                        — 5 colors (valid_for constraints)
--   3. roll_width_<mesh_type>       — per-mesh roll widths with $/ft pricing
--   4. edge_finish                  — 23 finishing options (binding, webbing, etc.)
--   5. purchase_type                — by_foot (default) or full_roll (industrial)
--
-- Pricing model:
--   Mesh cost  = roll_width.price × panel_width_in_feet
--   Edge cost  = SUM(edge_finish.price × edge_length_ft) for 4 edges
--   Full roll  = purchase_type 'full_roll' flat price (industrial only)
--   Webbing    = price IS NULL → requires manual quote
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. Insert the canonical product
-- =============================================================================

INSERT INTO products (
  sku, name, description, product_type, base_price, unit, pack_quantity,
  image_url, is_active, admin_only,
  product_category, category_section, category_order,
  quantity_step, quantity_min, quantity_max
) VALUES (
  'raw_netting_panel',
  'Raw Netting Panel',
  'Custom raw netting panel — choose mesh type, color, roll width, and optional edge finishing (binding, grommets, velcro, or heavy webbing) on all four sides. Plain sheets are panels with no edge finishing.',
  'panel',
  0,
  '/panel',
  1,
  'https://media.mosquitocurtains.com/site-assets/raw-netting-images/mosquito-mesh-1600.jpg',
  true,
  false,
  'Raw Netting Panels',
  'Custom Panels',
  1,
  1, 0, 100
)
ON CONFLICT (sku) DO NOTHING;

-- =============================================================================
-- 2. Mesh Type options (no price — price comes from roll_width_*)
-- =============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'mesh_type', 'heavy_mosquito', 'Heavy Mosquito', 0, 0, true,  1, NULL),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'mesh_type', 'no_see_um',      'No-See-Um',      0, 0, false, 2, NULL),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'mesh_type', 'shade',           'Shade',           0, 0, false, 3, NULL),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'mesh_type', 'theater_scrim',   'Theater Scrim',   0, 0, false, 4, NULL),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'mesh_type', 'industrial',      'Industrial',      0, 0, false, 5, NULL)
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- =============================================================================
-- 3. Color options (with valid_for mesh_type constraints)
-- =============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, valid_for) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'color', 'black',       'Black',       0, 0, true,  1, '{heavy_mosquito,no_see_um,shade}'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'color', 'white',       'White',       0, 0, false, 2, '{heavy_mosquito,no_see_um,shade,theater_scrim}'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'color', 'ivory',       'Ivory',       0, 0, false, 3, '{heavy_mosquito}'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'color', 'silver',      'Silver',      0, 0, false, 4, '{theater_scrim}'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'color', 'olive_green', 'Olive Green', 0, 0, false, 5, '{industrial}')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- =============================================================================
-- 4. Roll Width options — separate option_name per mesh type
--    price = per linear foot mesh rate
-- =============================================================================

-- Heavy Mosquito roll widths
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_heavy_mosquito', '101', '101" Wide', 5.50, 0, true,  1, 'raw_panel_hm_101'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_heavy_mosquito', '123', '123" Wide', 6.00, 0, false, 2, 'raw_panel_hm_123'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_heavy_mosquito', '138', '138" Wide', 6.50, 0, false, 3, 'raw_panel_hm_138')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- No-See-Um roll widths
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_no_see_um', '101', '101" Wide', 6.00, 0, true,  1, 'raw_panel_nsu_101'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_no_see_um', '123', '123" Wide', 7.00, 0, false, 2, 'raw_panel_nsu_123')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- Shade roll widths
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_shade', '120', '120" Wide', 7.00, 0, true, 1, 'raw_panel_shade_120')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- Theater Scrim roll widths
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_theater_scrim', '120', '120" Wide', 7.00, 0, true,  1, 'raw_panel_scrim_120'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_theater_scrim', '140', '140" Wide', 7.50, 0, false, 2, 'raw_panel_scrim_140')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- Industrial roll widths
INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'roll_width_industrial', '65', '65" Wide', 4.00, 0, true, 1, 'raw_panel_ind_65')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- =============================================================================
-- 5. Purchase Type option
-- =============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key, valid_for) VALUES
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'purchase_type', 'by_foot',   'By the Foot',                    0,    0, true,  1, NULL, NULL),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'purchase_type', 'full_roll', 'Full Roll (65" x 330ft)', 1350.00, 0, false, 2, 'raw_panel_ind_full_roll', '{industrial}')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- =============================================================================
-- 6. Edge Finish options (price = per linear foot, NULL = quote needed)
--    Each panel edge (top, right, bottom, left) references one of these.
-- =============================================================================

INSERT INTO product_options (product_id, option_name, option_value, display_label, price, fee, is_default, sort_order, pricing_key) VALUES
-- Raw edge
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'none', 'None (raw edge)', 0, 0, true, 0, NULL),

-- 1" Binding (no grommets, no velcro)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in', '1" Binding', 1.00, 0, false, 10, 'edge_binding_1in'),

-- 1" Binding + Grommets (4 spacing options)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_grommets_6',   '1" Binding — Grommets every 6"',          1.00, 0, false, 11, 'edge_binding_1in_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_grommets_12',  '1" Binding — Grommets every 12"',         1.00, 0, false, 12, 'edge_binding_1in_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_grommets_24',  '1" Binding — Grommets every 24"',         1.00, 0, false, 13, 'edge_binding_1in_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_grommets_5eq', '1" Binding — 5 Equally Spaced Grommets',  1.00, 0, false, 14, 'edge_binding_1in_grom'),

-- 1" Binding + Velcro (no grommets)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_velcro', '1" Binding with Velcro', 1.50, 0, false, 20, 'edge_binding_1in_velcro'),

-- 1" Binding + Velcro + Grommets (4 spacing options)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_velcro_grommets_6',   '1" Binding + Velcro — Grommets every 6"',          1.50, 0, false, 21, 'edge_binding_1in_velcro_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_velcro_grommets_12',  '1" Binding + Velcro — Grommets every 12"',         1.50, 0, false, 22, 'edge_binding_1in_velcro_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_velcro_grommets_24',  '1" Binding + Velcro — Grommets every 24"',         1.50, 0, false, 23, 'edge_binding_1in_velcro_grom'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'binding_1in_velcro_grommets_5eq', '1" Binding + Velcro — 5 Equally Spaced Grommets',  1.50, 0, false, 24, 'edge_binding_1in_velcro_grom'),

-- 3" Webbing + Grommets (quote needed — price = NULL)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_3in_6',   '3" Webbing — Grommets every 6"',          NULL, 0, false, 30, 'edge_webbing_3in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_3in_12',  '3" Webbing — Grommets every 12"',         NULL, 0, false, 31, 'edge_webbing_3in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_3in_24',  '3" Webbing — Grommets every 24"',         NULL, 0, false, 32, 'edge_webbing_3in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_3in_5eq', '3" Webbing — 5 Equally Spaced Grommets',  NULL, 0, false, 33, 'edge_webbing_3in'),

-- 4" Webbing + Grommets (quote needed)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_4in_6',   '4" Webbing — Grommets every 6"',          NULL, 0, false, 40, 'edge_webbing_4in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_4in_12',  '4" Webbing — Grommets every 12"',         NULL, 0, false, 41, 'edge_webbing_4in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_4in_24',  '4" Webbing — Grommets every 24"',         NULL, 0, false, 42, 'edge_webbing_4in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_4in_5eq', '4" Webbing — 5 Equally Spaced Grommets',  NULL, 0, false, 43, 'edge_webbing_4in'),

-- 6" Webbing + Grommets (quote needed)
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_6in_6',   '6" Webbing — Grommets every 6"',          NULL, 0, false, 50, 'edge_webbing_6in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_6in_12',  '6" Webbing — Grommets every 12"',         NULL, 0, false, 51, 'edge_webbing_6in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_6in_24',  '6" Webbing — Grommets every 24"',         NULL, 0, false, 52, 'edge_webbing_6in'),
((SELECT id FROM products WHERE sku = 'raw_netting_panel'), 'edge_finish', 'webbing_6in_5eq', '6" Webbing — 5 Equally Spaced Grommets',  NULL, 0, false, 53, 'edge_webbing_6in')
ON CONFLICT (product_id, option_name, option_value) DO NOTHING;

-- =============================================================================
-- 7. Deprecate old SKUs (mark inactive, keep data for historical orders)
-- =============================================================================

UPDATE products SET is_active = false
WHERE sku IN (
  'raw_heavy_mosquito',
  'raw_no_see_um',
  'raw_shade',
  'raw_theater_scrim',
  'raw_industrial_mesh'
);

-- =============================================================================
-- 8. Update legacy product mapping to point at canonical product
-- =============================================================================

UPDATE legacy_product_mapping
SET new_product_sku = 'raw_netting_panel'
WHERE new_product_sku IN (
  'raw_mesh',
  'raw_heavy_mosquito',
  'raw_no_see_um',
  'raw_shade',
  'raw_theater_scrim',
  'raw_industrial_mesh'
);

-- =============================================================================
-- 9. Verify
-- =============================================================================

DO $$
DECLARE
  prod_id uuid;
  opt_count integer;
  deprecated_count integer;
BEGIN
  SELECT id INTO prod_id FROM products WHERE sku = 'raw_netting_panel';
  IF prod_id IS NULL THEN
    RAISE EXCEPTION 'Product raw_netting_panel was not created!';
  END IF;

  SELECT COUNT(*) INTO opt_count FROM product_options WHERE product_id = prod_id;
  SELECT COUNT(*) INTO deprecated_count FROM products
    WHERE sku IN ('raw_heavy_mosquito','raw_no_see_um','raw_shade','raw_theater_scrim','raw_industrial_mesh')
      AND is_active = false;

  RAISE NOTICE 'raw_netting_panel: % product_options, % old SKUs deprecated', opt_count, deprecated_count;
END $$;

COMMIT;
