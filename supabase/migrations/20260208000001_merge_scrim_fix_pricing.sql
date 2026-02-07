-- =============================================================================
-- Merge Scrim into Mesh, Fix Pricing from Gravity Forms, Admin-Only Flags
-- =============================================================================
-- All pricing values verified against Gravity Forms JSON exports.
-- This migration replaces incorrect/stale data and adds new features.

-- =============================================================================
-- 1a. Fix mesh panel rates
-- =============================================================================
-- mesh_scrim was 17.00, correct is 19.00
UPDATE product_pricing SET value = 19.00, description = 'Scrim panels use mesh pricing formula at $19/linear ft including inches'
  WHERE id = 'mesh_scrim';

-- =============================================================================
-- 1b. Fix clear vinyl panel fees (tiered by panel height)
-- =============================================================================
-- Old: single vinyl_panel_fee = $30 (was wrong)
-- New: three tiers from Gravity Forms
DELETE FROM product_pricing WHERE id = 'vinyl_panel_fee';

INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('vinyl_panel_fee_short',  'vinyl_panels', 'Per-Panel Fee (Short <48")',   55.00, '/panel', 'Panel fee for short panels under 48"',    FALSE, NULL),
  ('vinyl_panel_fee_medium', 'vinyl_panels', 'Per-Panel Fee (Medium 48-96")', 60.00, '/panel', 'Panel fee for medium panels 48-96"',     FALSE, NULL),
  ('vinyl_panel_fee_tall',   'vinyl_panels', 'Per-Panel Fee (Tall >96")',    65.00, '/panel', 'Panel fee for tall panels over 96"',       FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- =============================================================================
-- 1c. Remove non-products
-- =============================================================================
-- These were never real products - they don't exist in Gravity Forms
DELETE FROM product_pricing_history WHERE pricing_id IN (
  'door_adder', 'zipper_per_foot', 'notch_adder', 'vinyl_door_adder',
  'scrim_base_sqft', 'scrim_min_sqft'
);
DELETE FROM product_pricing WHERE id IN (
  'door_adder', 'zipper_per_foot', 'notch_adder', 'vinyl_door_adder',
  'scrim_base_sqft', 'scrim_min_sqft'
);

-- =============================================================================
-- 1d. Add per-piece track selling prices (from Gravity Forms)
-- =============================================================================
-- The old system used per-foot rates with multipliers.
-- The real Gravity Forms use flat per-piece prices.

-- Remove old per-foot track pricing that doesn't match reality
DELETE FROM product_pricing_history WHERE pricing_id IN (
  'track_std_per_foot', 'track_heavy_multiplier', 'carrier_heavy_multiplier'
);
DELETE FROM product_pricing WHERE id IN (
  'track_std_per_foot', 'track_heavy_multiplier', 'carrier_heavy_multiplier'
);

-- Update existing track pieces with correct Gravity Forms prices
UPDATE product_pricing SET value = 25.00, unit = '/piece', description = 'Standard 90 degree curve' WHERE id = 'track_curve_90';
UPDATE product_pricing SET value = 25.00, unit = '/piece', description = 'Standard 135 degree curve' WHERE id = 'track_curve_135';
UPDATE product_pricing SET value = 7.00,  unit = '/piece', description = 'Standard splice connector' WHERE id = 'track_splice';
UPDATE product_pricing SET value = 1.50,  unit = '/piece', description = 'Standard end cap (sold in packs of 2)' WHERE id = 'track_endcap';
UPDATE product_pricing SET value = 0.50,  unit = '/piece', description = 'Standard snap carrier (sold in packs of 10)' WHERE id = 'track_carrier';

-- Standard Track per-piece prices
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('track_std_7ft', 'track_hardware', 'Standard 7ft Straight Track', 30.00, '/piece', '7ft standard straight track piece', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- Heavy Track per-piece prices
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('track_heavy_7ft',       'track_hardware', 'Heavy 7ft Straight Track',  42.00, '/piece', '7ft heavy straight track piece', FALSE, NULL),
  ('track_heavy_curve_90',  'track_hardware', 'Heavy 90° Curve',           25.00, '/piece', 'Heavy duty 90 degree curve',     FALSE, NULL),
  ('track_heavy_curve_135', 'track_hardware', 'Heavy 135° Curve',          25.00, '/piece', 'Heavy duty 135 degree curve',    FALSE, NULL),
  ('track_heavy_splice',    'track_hardware', 'Heavy Splice',              5.00,  '/piece', 'Heavy duty splice connector',    FALSE, NULL),
  ('track_heavy_endcap',    'track_hardware', 'Heavy End Cap',             3.00,  '/piece', 'Heavy duty end cap',             FALSE, NULL),
  ('track_heavy_carrier',   'track_hardware', 'Heavy Carrier',             1.25,  '/piece', 'Heavy snap carrier (pack of 10)', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- Rename existing standard pieces for clarity
UPDATE product_pricing SET label = 'Standard 90° Curve'   WHERE id = 'track_curve_90';
UPDATE product_pricing SET label = 'Standard 135° Curve'  WHERE id = 'track_curve_135';
UPDATE product_pricing SET label = 'Standard Splice'      WHERE id = 'track_splice';
UPDATE product_pricing SET label = 'Standard End Cap'     WHERE id = 'track_endcap';
UPDATE product_pricing SET label = 'Standard Carrier'     WHERE id = 'track_carrier';

-- Also rename existing track_curve IDs to track_std_ for consistency
-- We keep the old IDs but add standard-prefixed aliases
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('track_std_curve_90',  'track_hardware', 'Standard 90° Curve',  25.00, '/piece', 'Standard 90 degree curve', FALSE, NULL),
  ('track_std_curve_135', 'track_hardware', 'Standard 135° Curve', 25.00, '/piece', 'Standard 135 degree curve', FALSE, NULL),
  ('track_std_splice',    'track_hardware', 'Standard Splice',     7.00,  '/piece', 'Standard splice connector', FALSE, NULL),
  ('track_std_endcap',    'track_hardware', 'Standard End Cap',    1.50,  '/piece', 'Standard end cap (pair)', FALSE, NULL),
  ('track_std_carrier',   'track_hardware', 'Standard Carrier',    0.50,  '/piece', 'Standard snap carrier (pack of 10)', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- =============================================================================
-- 1e. Replace raw materials pricing (linear ft price grid)
-- =============================================================================
-- Old: sqft-based with multipliers. New: flat per-linear-foot by material+width.

-- Clean up old sqft-based raw material pricing
DELETE FROM product_pricing_history WHERE pricing_id IN (
  'raw_mesh_base_sqft',
  'raw_mesh_multiplier_heavy_mosquito', 'raw_mesh_multiplier_no_see_um',
  'raw_mesh_multiplier_shade', 'raw_mesh_multiplier_scrim', 'raw_mesh_multiplier_theater_scrim',
  'roll_width_multiplier_54', 'roll_width_multiplier_72', 'roll_width_multiplier_96'
);
DELETE FROM product_pricing WHERE id IN (
  'raw_mesh_base_sqft',
  'raw_mesh_multiplier_heavy_mosquito', 'raw_mesh_multiplier_no_see_um',
  'raw_mesh_multiplier_shade', 'raw_mesh_multiplier_scrim', 'raw_mesh_multiplier_theater_scrim',
  'roll_width_multiplier_54', 'roll_width_multiplier_72', 'roll_width_multiplier_96'
);

-- New linear ft price grid from Gravity Forms
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('raw_heavy_mosquito_101', 'raw_materials', 'Raw Heavy Mosquito 101"', 5.50,  '/linear ft', 'Heavy Mosquito mesh, 101" roll width', FALSE, NULL),
  ('raw_heavy_mosquito_123', 'raw_materials', 'Raw Heavy Mosquito 123"', 6.00,  '/linear ft', 'Heavy Mosquito mesh, 123" roll width', FALSE, NULL),
  ('raw_heavy_mosquito_138', 'raw_materials', 'Raw Heavy Mosquito 138"', 6.50,  '/linear ft', 'Heavy Mosquito mesh, 138" roll width', FALSE, NULL),
  ('raw_no_see_um_101',      'raw_materials', 'Raw No-See-Um 101"',      6.00,  '/linear ft', 'No-See-Um mesh, 101" roll width',      FALSE, NULL),
  ('raw_no_see_um_123',      'raw_materials', 'Raw No-See-Um 123"',      7.00,  '/linear ft', 'No-See-Um mesh, 123" roll width',      FALSE, NULL),
  ('raw_shade_120',           'raw_materials', 'Raw Shade 120"',          7.00,  '/linear ft', 'Shade mesh, 120" roll width',           FALSE, NULL),
  ('raw_theater_scrim_120',   'raw_materials', 'Raw Theater Scrim 120"',  7.00,  '/linear ft', 'Theater Scrim, 120" roll width',        FALSE, NULL),
  ('raw_theater_scrim_140',   'raw_materials', 'Raw Theater Scrim 140"',  7.50,  '/linear ft', 'Theater Scrim, 140" roll width',        FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- =============================================================================
-- 1f. Add admin_only column to ALL product tables
-- =============================================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS admin_only BOOLEAN DEFAULT FALSE;
ALTER TABLE product_options ADD COLUMN IF NOT EXISTS admin_only BOOLEAN DEFAULT FALSE;
ALTER TABLE option_values ADD COLUMN IF NOT EXISTS admin_only BOOLEAN DEFAULT FALSE;
ALTER TABLE product_pricing ADD COLUMN IF NOT EXISTS admin_only BOOLEAN DEFAULT FALSE;

-- Set admin_only = TRUE on $0 freebies (not shown to public customers)
UPDATE product_pricing SET admin_only = TRUE WHERE id IN (
  'adhesive_velcro',   -- FREE velcro
  'l_screw',           -- FREE L screws
  'screw_stud'         -- FREE screw studs
);

-- Scrim is only available through sales, not on the storefront
UPDATE product_pricing SET admin_only = TRUE WHERE id = 'mesh_scrim';

-- Clear vinyl panels are sales-only
UPDATE product_pricing SET admin_only = TRUE WHERE category = 'vinyl_panels';

-- Set admin_only = TRUE on "Special Rigging" option value
-- (only salespeople can select this attachment type)
UPDATE option_values SET admin_only = TRUE
  WHERE value = 'special_rigging';


-- =============================================================================
-- 1g. Fix attachment item prices to match Gravity Forms
-- =============================================================================
-- Marine Snaps: $1.50/snap (pack of 10 = $15)
UPDATE product_pricing SET value = 1.50, description = '$1.50/snap, pack of 10 = $15' WHERE id = 'marine_snap';

-- Adhesive Snaps B/W: $3.00/snap (pack of 5 = $15)
UPDATE product_pricing SET value = 3.00, description = '$3/snap, pack of 5 = $15' WHERE id = 'adhesive_snap_bw';

-- Panel-to-Panel snap: $1.67/snap (pack of 6 = $10)
UPDATE product_pricing SET value = 1.67, description = '$1.67/snap, pack of 6 = $10' WHERE id = 'panel_snap';

-- Rubber washer: $0.20/washer (pack of 10 = $2)
UPDATE product_pricing SET value = 0.20, description = '$0.20/washer, pack of 10 = $2' WHERE id = 'rubber_washer';

-- Webbing: $0.40/ft (pack of 10ft = $4)
UPDATE product_pricing SET value = 0.40, description = '$0.40/ft, 10ft = $4' WHERE id = 'webbing';

-- Snap tape: $2.00/ft (pack of 5ft = $10)
UPDATE product_pricing SET value = 2.00, description = '$2/ft, 5ft = $10' WHERE id = 'snap_tape';

-- $0 freebies: set value and mark admin_only
UPDATE product_pricing SET value = 0.00, admin_only = TRUE, description = 'FREE - admin only' WHERE id = 'adhesive_velcro';
UPDATE product_pricing SET admin_only = TRUE, description = 'FREE - admin only' WHERE id = 'l_screw';
UPDATE product_pricing SET admin_only = TRUE, description = 'FREE - admin only' WHERE id = 'screw_stud';

-- =============================================================================
-- Done! All pricing now matches Gravity Forms exports.
-- =============================================================================
