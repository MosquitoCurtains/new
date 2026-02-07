-- =============================================================================
-- Product Pricing Table
-- =============================================================================
-- Stores product pricing that can be edited via admin panel
-- Falls back to hardcoded constants if no database value exists

CREATE TABLE IF NOT EXISTS product_pricing (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  is_multiplier BOOLEAN DEFAULT FALSE,
  base_price_id TEXT REFERENCES product_pricing(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_product_pricing_category ON product_pricing(category);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_product_pricing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_pricing_updated_at ON product_pricing;
CREATE TRIGGER product_pricing_updated_at
  BEFORE UPDATE ON product_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_product_pricing_timestamp();

-- =============================================================================
-- Seed Initial Pricing Data
-- =============================================================================

-- Mesh & Scrim Panel Pricing (Scrim is a type of mesh)
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('mesh_heavy_mosquito', 'mesh_panels', 'Heavy Mosquito', 18.00, '/linear ft', NULL, FALSE, NULL),
  ('mesh_no_see_um', 'mesh_panels', 'No-See-Um', 19.00, '/linear ft', NULL, FALSE, NULL),
  ('mesh_shade', 'mesh_panels', 'Shade', 20.00, '/linear ft', NULL, FALSE, NULL),
  ('mesh_scrim', 'mesh_panels', 'Scrim', 17.00, '/linear ft', 'Scrim panels use mesh pricing formula', FALSE, NULL),
  ('mesh_panel_fee', 'mesh_panels', 'Per-Panel Fee', 24.00, '/panel', 'Flat fee added to every panel', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Clear Vinyl Panel Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('vinyl_short', 'vinyl_panels', 'Short Panels (<48")', 28.00, '/linear ft', NULL, FALSE, NULL),
  ('vinyl_medium', 'vinyl_panels', 'Medium Panels (48-96")', 34.00, '/linear ft', NULL, FALSE, NULL),
  ('vinyl_tall', 'vinyl_panels', 'Tall Panels (>96")', 41.00, '/linear ft', NULL, FALSE, NULL),
  ('vinyl_panel_fee', 'vinyl_panels', 'Per-Panel Fee', 30.00, '/panel', 'Flat fee added to every panel', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Track Hardware Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('track_std_per_foot', 'track_hardware', 'Standard Track', 3.50, '/linear ft', NULL, FALSE, NULL),
  ('track_heavy_multiplier', 'track_hardware', 'Heavy Track Multiplier', 1.40, 'x', 'Applied to standard rate', TRUE, 'track_std_per_foot'),
  ('track_curve_90', 'track_hardware', '90° Curve', 12.00, '/piece', NULL, FALSE, NULL),
  ('track_curve_135', 'track_hardware', '135° Curve', 15.00, '/piece', NULL, FALSE, NULL),
  ('track_splice', 'track_hardware', 'Splice', 5.00, '/piece', NULL, FALSE, NULL),
  ('track_endcap', 'track_hardware', 'End Cap', 2.50, '/piece', NULL, FALSE, NULL),
  ('track_carrier', 'track_hardware', 'Snap Carrier', 0.75, '/piece', NULL, FALSE, NULL),
  ('carrier_heavy_multiplier', 'track_hardware', 'Heavy Carrier Multiplier', 1.20, 'x', 'Applied to carrier rate', TRUE, 'track_carrier')
ON CONFLICT (id) DO NOTHING;

-- Attachment Items Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('marine_snap', 'attachments', 'Marine Snap', 0.35, '/each', NULL, FALSE, NULL),
  ('adhesive_snap_bw', 'attachments', 'Adhesive Snap (Black/White)', 2.00, '/each', NULL, FALSE, NULL),
  ('adhesive_snap_clear', 'attachments', 'Adhesive Snap (Clear)', 3.00, '/each', NULL, FALSE, NULL),
  ('chrome_snap', 'attachments', 'Chrome Snap', 0.50, '/each', NULL, FALSE, NULL),
  ('panel_snap', 'attachments', 'Panel-to-Panel Snap', 1.67, '/each', NULL, FALSE, NULL),
  ('block_magnet', 'attachments', 'Block Magnet', 1.00, '/each', NULL, FALSE, NULL),
  ('ring_magnet', 'attachments', 'Ring Magnet', 1.50, '/each', NULL, FALSE, NULL),
  ('fiberglass_rod', 'attachments', 'Fiberglass Rod Set', 10.00, '/set', NULL, FALSE, NULL),
  ('fiberglass_clip', 'attachments', 'Fiberglass Clip', 2.00, '/each', NULL, FALSE, NULL),
  ('elastic_cord', 'attachments', 'Elastic Cord Set', 10.00, '/set', NULL, FALSE, NULL),
  ('tether_clip', 'attachments', 'Tether Clip', 10.00, '/each', NULL, FALSE, NULL),
  ('belted_rib', 'attachments', 'Belted Rib', 15.00, '/each', NULL, FALSE, NULL),
  ('screw_stud', 'attachments', 'Screw Stud', 0.15, '/each', NULL, FALSE, NULL),
  ('l_screw', 'attachments', 'L Screw', 0.25, '/each', NULL, FALSE, NULL),
  ('rubber_washer', 'attachments', 'Rubber Washer', 0.20, '/each', NULL, FALSE, NULL),
  ('rod_clip', 'attachments', 'Rod Clip', 2.00, '/each', NULL, FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Accessories Pricing
INSERT INTO product_pricing (id, category, label, value, unit, description, is_multiplier, base_price_id) VALUES
  ('adhesive_velcro', 'accessories', 'Adhesive Velcro', 0.50, '/foot', NULL, FALSE, NULL),
  ('webbing', 'accessories', 'Webbing', 0.40, '/foot', NULL, FALSE, NULL),
  ('snap_tape', 'accessories', 'Snap Tape', 2.00, '/foot', NULL, FALSE, NULL),
  ('tieup_strap', 'accessories', 'Tie-Up Strap', 2.00, '/each', NULL, FALSE, NULL),
  ('fastwax', 'accessories', 'Fastwax Cleaner', 15.00, '/bottle', NULL, FALSE, NULL),
  ('stucco_standard', 'accessories', 'Stucco Strip (Standard)', 24.00, '/inch height', NULL, FALSE, NULL),
  ('stucco_zippered', 'accessories', 'Stucco Strip (Zippered)', 40.00, '/inch height', NULL, FALSE, NULL),
  ('snap_tool', 'accessories', 'Industrial Snap Tool', 130.00, '/tool', 'Fully refundable', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Note: Shipping uses a custom formula, not flat rate pricing.
-- Shipping calculation will be built as a separate feature.

-- =============================================================================
-- Pricing History Table (for audit trail)
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_pricing_history (
  id SERIAL PRIMARY KEY,
  pricing_id TEXT NOT NULL REFERENCES product_pricing(id),
  old_value DECIMAL(10,4),
  new_value DECIMAL(10,4) NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_pricing_history_pricing_id ON product_pricing_history(pricing_id);
CREATE INDEX IF NOT EXISTS idx_pricing_history_changed_at ON product_pricing_history(changed_at);

-- Function to log pricing changes
CREATE OR REPLACE FUNCTION log_pricing_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.value IS DISTINCT FROM NEW.value THEN
    INSERT INTO product_pricing_history (pricing_id, old_value, new_value)
    VALUES (NEW.id, OLD.value, NEW.value);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pricing_change_log ON product_pricing;
CREATE TRIGGER pricing_change_log
  AFTER UPDATE ON product_pricing
  FOR EACH ROW
  EXECUTE FUNCTION log_pricing_change();

-- =============================================================================
-- RLS Policies (enable for production)
-- =============================================================================

-- For now, allow all access (admin-only page)
-- ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_pricing_history ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE product_pricing IS 'Product pricing that can be edited via admin panel';
COMMENT ON TABLE product_pricing_history IS 'Audit trail of all pricing changes';
