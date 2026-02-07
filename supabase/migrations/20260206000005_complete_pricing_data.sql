-- =============================================================================
-- Complete Pricing Data
-- =============================================================================
-- Adds pricing rows that were missing from the initial product_pricing seed.
-- These values were previously only in src/lib/pricing/constants.ts.
-- Now everything lives in the database as the source of truth.

-- Mesh Type Multipliers (used by rollup panels)
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('mesh_multiplier_heavy_mosquito', 'mesh_multipliers', 'Heavy Mosquito Multiplier', 1.00, 'x', 'Mesh type multiplier for rollup & raw material pricing', TRUE, NULL),
  ('mesh_multiplier_no_see_um', 'mesh_multipliers', 'No-See-Um Multiplier', 1.20, 'x', 'Mesh type multiplier for rollup & raw material pricing', TRUE, NULL),
  ('mesh_multiplier_shade', 'mesh_multipliers', 'Shade Multiplier', 1.10, 'x', 'Mesh type multiplier for rollup & raw material pricing', TRUE, NULL),
  ('mesh_multiplier_scrim', 'mesh_multipliers', 'Scrim Multiplier', 0.95, 'x', 'Mesh type multiplier for rollup & raw material pricing', TRUE, NULL),
  ('mesh_multiplier_theater_scrim', 'mesh_multipliers', 'Theater Scrim Multiplier', 0.95, 'x', 'Mesh type multiplier for rollup & raw material pricing', TRUE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Panel Options
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('door_adder', 'panel_options', 'Door Adder (Mesh)', 15.00, '/panel', 'Added when panel has a door', FALSE, NULL),
  ('zipper_per_foot', 'panel_options', 'Zipper Per Foot', 2.50, '/linear ft', 'Per-foot cost for zippered panels', FALSE, NULL),
  ('notch_adder', 'panel_options', 'Notch Adder', 10.00, '/notch', 'Per-notch charge for custom cuts', FALSE, NULL),
  ('vinyl_door_adder', 'panel_options', 'Door Adder (Vinyl)', 25.00, '/panel', 'Added when vinyl panel has a door', FALSE, NULL),
  ('top_adder_standard_track', 'panel_options', 'Top Attach: Standard Track', 0.00, '/panel', NULL, FALSE, NULL),
  ('top_adder_heavy_track', 'panel_options', 'Top Attach: Heavy Track', 0.00, '/panel', NULL, FALSE, NULL),
  ('top_adder_velcro', 'panel_options', 'Top Attach: Velcro', 0.00, '/panel', NULL, FALSE, NULL),
  ('top_adder_special_rigging', 'panel_options', 'Top Attach: Special Rigging', 0.00, '/panel', NULL, FALSE, NULL),
  ('bottom_adder_weighted_hem', 'panel_options', 'Bottom: Weighted Hem', 0.00, '/panel', 'Default bottom option', FALSE, NULL),
  ('bottom_adder_chain_weight', 'panel_options', 'Bottom: Chain Weight', 5.00, '/panel', NULL, FALSE, NULL),
  ('bottom_adder_rod_pocket', 'panel_options', 'Bottom: Rod Pocket', 3.00, '/panel', NULL, FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Scrim Panel Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('scrim_base_sqft', 'scrim_panels', 'Scrim Base Rate', 2.50, '/sqft', 'Price per square foot for scrim panels', FALSE, NULL),
  ('scrim_min_sqft', 'scrim_panels', 'Scrim Minimum Sqft', 10.00, 'sqft', 'Minimum billable square footage', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Roll-Up Panel Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('rollup_base_sqft', 'rollup_panels', 'Roll-Up Base Rate', 3.00, '/sqft', 'Price per square foot for roll-up panels', FALSE, NULL),
  ('rollup_min_sqft', 'rollup_panels', 'Roll-Up Minimum Sqft', 10.00, 'sqft', 'Minimum billable square footage', FALSE, NULL),
  ('rollup_mechanism_adder', 'rollup_panels', 'Roll-Up Mechanism', 20.00, '/panel', 'Roll mechanism fee per panel', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Raw Material Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('raw_mesh_base_sqft', 'raw_materials', 'Raw Mesh Base Rate', 0.75, '/sqft', 'Base price per square foot for raw mesh', FALSE, NULL),
  ('raw_mesh_multiplier_heavy_mosquito', 'raw_materials', 'Raw Heavy Mosquito Mult', 1.00, 'x', 'Material type multiplier', TRUE, 'raw_mesh_base_sqft'),
  ('raw_mesh_multiplier_no_see_um', 'raw_materials', 'Raw No-See-Um Mult', 1.20, 'x', 'Material type multiplier', TRUE, 'raw_mesh_base_sqft'),
  ('raw_mesh_multiplier_shade', 'raw_materials', 'Raw Shade Mult', 1.10, 'x', 'Material type multiplier', TRUE, 'raw_mesh_base_sqft'),
  ('raw_mesh_multiplier_scrim', 'raw_materials', 'Raw Scrim Mult', 1.50, 'x', 'Material type multiplier', TRUE, 'raw_mesh_base_sqft'),
  ('raw_mesh_multiplier_theater_scrim', 'raw_materials', 'Raw Theater Scrim Mult', 1.50, 'x', 'Material type multiplier', TRUE, 'raw_mesh_base_sqft'),
  ('roll_width_multiplier_54', 'raw_materials', 'Roll Width 54" Mult', 1.00, 'x', 'Width multiplier for 54" rolls', TRUE, 'raw_mesh_base_sqft'),
  ('roll_width_multiplier_72', 'raw_materials', 'Roll Width 72" Mult', 1.33, 'x', 'Width multiplier for 72" rolls', TRUE, 'raw_mesh_base_sqft'),
  ('roll_width_multiplier_96', 'raw_materials', 'Roll Width 96" Mult', 1.78, 'x', 'Width multiplier for 96" rolls', TRUE, 'raw_mesh_base_sqft')
ON CONFLICT (id) DO NOTHING;
