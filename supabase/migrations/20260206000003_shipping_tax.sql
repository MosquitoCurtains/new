-- =============================================================================
-- Shipping Zones, Rates & Tax Rates
-- =============================================================================
-- Database-driven shipping and tax calculation system.
-- Shipping uses zone-based rates with shipping class overrides:
--   - Clear Vinyl REPLACES the base shipping cost
--   - Straight Track ADDS to the shipping cost (ships in separate box)
-- Tax rates support country/state/postcode specificity.

-- =============================================================================
-- Shipping Zones
-- =============================================================================

CREATE TABLE IF NOT EXISTS shipping_zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_zones_sort ON shipping_zones(sort_order);

-- =============================================================================
-- Shipping Zone Regions (maps countries/states to zones)
-- =============================================================================

CREATE TABLE IF NOT EXISTS shipping_zone_regions (
  id SERIAL PRIMARY KEY,
  zone_id INTEGER NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  state_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zone_regions_lookup ON shipping_zone_regions(country_code, state_code);
CREATE INDEX IF NOT EXISTS idx_zone_regions_zone ON shipping_zone_regions(zone_id);

-- =============================================================================
-- Shipping Rates (per zone, per shipping class)
-- =============================================================================

CREATE TABLE IF NOT EXISTS shipping_rates (
  id SERIAL PRIMARY KEY,
  zone_id INTEGER NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
  shipping_class TEXT NOT NULL CHECK (shipping_class IN ('default', 'clear_vinyl', 'straight_track')),
  flat_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  fee_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zone_id, shipping_class)
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON shipping_rates(zone_id);

-- =============================================================================
-- Tax Rates
-- =============================================================================

CREATE TABLE IF NOT EXISTS tax_rates (
  id SERIAL PRIMARY KEY,
  country_code TEXT NOT NULL,
  state_code TEXT NOT NULL DEFAULT '*',
  postcode TEXT NOT NULL DEFAULT '*',
  city TEXT NOT NULL DEFAULT '*',
  rate DECIMAL(8,4) NOT NULL DEFAULT 0,
  tax_name TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  is_compound BOOLEAN NOT NULL DEFAULT FALSE,
  is_shipping_taxable BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_rates_lookup ON tax_rates(country_code, state_code, postcode);

-- =============================================================================
-- Audit History (for shipping rate and tax rate changes)
-- =============================================================================

CREATE TABLE IF NOT EXISTS shipping_tax_history (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_tax_history_record ON shipping_tax_history(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tax_history_date ON shipping_tax_history(changed_at);

-- =============================================================================
-- Update Timestamp Triggers
-- =============================================================================

CREATE OR REPLACE FUNCTION update_shipping_zones_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shipping_zones_updated_at ON shipping_zones;
CREATE TRIGGER shipping_zones_updated_at
  BEFORE UPDATE ON shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_shipping_zones_timestamp();

CREATE OR REPLACE FUNCTION update_shipping_rates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shipping_rates_updated_at ON shipping_rates;
CREATE TRIGGER shipping_rates_updated_at
  BEFORE UPDATE ON shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_shipping_rates_timestamp();

CREATE OR REPLACE FUNCTION update_tax_rates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tax_rates_updated_at ON tax_rates;
CREATE TRIGGER tax_rates_updated_at
  BEFORE UPDATE ON tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_rates_timestamp();

-- =============================================================================
-- Audit Triggers (log changes to shipping_rates and tax_rates)
-- =============================================================================

CREATE OR REPLACE FUNCTION log_shipping_rate_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.flat_cost IS DISTINCT FROM NEW.flat_cost THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('shipping_rates', NEW.id, 'flat_cost', OLD.flat_cost::TEXT, NEW.flat_cost::TEXT);
  END IF;
  IF OLD.fee_percent IS DISTINCT FROM NEW.fee_percent THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('shipping_rates', NEW.id, 'fee_percent', OLD.fee_percent::TEXT, NEW.fee_percent::TEXT);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shipping_rate_change_log ON shipping_rates;
CREATE TRIGGER shipping_rate_change_log
  AFTER UPDATE ON shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION log_shipping_rate_change();

CREATE OR REPLACE FUNCTION log_tax_rate_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.rate IS DISTINCT FROM NEW.rate THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('tax_rates', NEW.id, 'rate', OLD.rate::TEXT, NEW.rate::TEXT);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tax_rate_change_log ON tax_rates;
CREATE TRIGGER tax_rate_change_log
  AFTER UPDATE ON tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION log_tax_rate_change();

-- =============================================================================
-- Seed: Shipping Zones
-- =============================================================================

INSERT INTO shipping_zones (name, slug, sort_order, is_fallback) VALUES
  ('Eastern US',  'eastern_us',  1, FALSE),
  ('Western US',  'western_us',  2, FALSE),
  ('HI, AK, PR',  'hi_ak_pr',   3, FALSE),
  ('Canada',       'canada',     4, FALSE),
  ('Rest of World','rest_of_world', 99, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- Seed: Shipping Zone Regions
-- =============================================================================

-- Eastern US States (35 states + DC + Armed Forces = 39 regions)
INSERT INTO shipping_zone_regions (zone_id, country_code, state_code)
SELECT z.id, 'US', s.code
FROM shipping_zones z,
     (VALUES
       ('AL'),('AR'),('CT'),('DE'),('DC'),('FL'),('GA'),
       ('IL'),('IN'),('IA'),('KS'),('KY'),('LA'),('ME'),
       ('MD'),('MA'),('MI'),('MN'),('MS'),('MO'),('NH'),
       ('NJ'),('NY'),('NC'),('OH'),('OK'),('PA'),('RI'),
       ('SC'),('TN'),('TX'),('VT'),('VA'),('WV'),('WI'),
       ('AA'),('AE'),('AP')
     ) AS s(code)
WHERE z.slug = 'eastern_us';

-- Western US States (14 states)
INSERT INTO shipping_zone_regions (zone_id, country_code, state_code)
SELECT z.id, 'US', s.code
FROM shipping_zones z,
     (VALUES
       ('AZ'),('CA'),('CO'),('ID'),('MT'),('NE'),('NV'),
       ('NM'),('ND'),('OR'),('SD'),('UT'),('WA'),('WY')
     ) AS s(code)
WHERE z.slug = 'western_us';

-- HI, AK, PR
INSERT INTO shipping_zone_regions (zone_id, country_code, state_code)
SELECT z.id, 'US', s.code
FROM shipping_zones z,
     (VALUES ('HI'),('AK'),('PR')) AS s(code)
WHERE z.slug = 'hi_ak_pr';

-- Canada (all 13 provinces/territories)
INSERT INTO shipping_zone_regions (zone_id, country_code, state_code)
SELECT z.id, 'CA', s.code
FROM shipping_zones z,
     (VALUES
       ('AB'),('BC'),('MB'),('NB'),('NL'),('NS'),('NT'),
       ('NU'),('ON'),('PE'),('QC'),('SK'),('YT')
     ) AS s(code)
WHERE z.slug = 'canada';

-- Rest of World has NO regions (it is the fallback zone)

-- =============================================================================
-- Seed: Shipping Rates
-- =============================================================================

-- Eastern US: Base $8 + 3.5%, Vinyl $30 + 3%, Track $30
INSERT INTO shipping_rates (zone_id, shipping_class, flat_cost, fee_percent)
SELECT z.id, r.class, r.flat, r.pct
FROM shipping_zones z,
     (VALUES
       ('default',        8.00,  3.50),
       ('clear_vinyl',   30.00,  3.00),
       ('straight_track', 30.00, 0.00)
     ) AS r(class, flat, pct)
WHERE z.slug = 'eastern_us';

-- Western US: Base $10 + 4%, Vinyl $45 + 3%, Track $45
INSERT INTO shipping_rates (zone_id, shipping_class, flat_cost, fee_percent)
SELECT z.id, r.class, r.flat, r.pct
FROM shipping_zones z,
     (VALUES
       ('default',        10.00, 4.00),
       ('clear_vinyl',    45.00, 3.00),
       ('straight_track', 45.00, 0.00)
     ) AS r(class, flat, pct)
WHERE z.slug = 'western_us';

-- HI, AK, PR: Base $50 + 5%, Vinyl $90, Track $90
INSERT INTO shipping_rates (zone_id, shipping_class, flat_cost, fee_percent)
SELECT z.id, r.class, r.flat, r.pct
FROM shipping_zones z,
     (VALUES
       ('default',        50.00, 5.00),
       ('clear_vinyl',    90.00, 0.00),
       ('straight_track', 90.00, 0.00)
     ) AS r(class, flat, pct)
WHERE z.slug = 'hi_ak_pr';

-- Canada: Base $55 + 4.5%, Vinyl $95 + 3%, Track $70
INSERT INTO shipping_rates (zone_id, shipping_class, flat_cost, fee_percent)
SELECT z.id, r.class, r.flat, r.pct
FROM shipping_zones z,
     (VALUES
       ('default',         55.00, 4.50),
       ('clear_vinyl',     95.00, 3.00),
       ('straight_track',  70.00, 0.00)
     ) AS r(class, flat, pct)
WHERE z.slug = 'canada';

-- Rest of World: Base $110 + 3.5%, Vinyl $90 + 5%, Track $45
INSERT INTO shipping_rates (zone_id, shipping_class, flat_cost, fee_percent)
SELECT z.id, r.class, r.flat, r.pct
FROM shipping_zones z,
     (VALUES
       ('default',        110.00, 3.50),
       ('clear_vinyl',     90.00, 5.00),
       ('straight_track',  45.00, 0.00)
     ) AS r(class, flat, pct)
WHERE z.slug = 'rest_of_world';

-- =============================================================================
-- Seed: Tax Rates
-- =============================================================================

-- US Georgia state tax: 7%
INSERT INTO tax_rates (country_code, state_code, postcode, city, rate, tax_name, priority, is_shipping_taxable) VALUES
  ('US', 'GA', '*', '*', 7.0000, 'Georgia', 1, FALSE);

-- US Alpharetta GA 30004: 0% (local pickup override)
INSERT INTO tax_rates (country_code, state_code, postcode, city, rate, tax_name, priority, is_shipping_taxable) VALUES
  ('US', 'GA', '30004', 'ALPHARETTA', 0.0000, 'Internal Zero', 1, TRUE);

-- Canadian provincial tax rates (HST/GST/PST)
INSERT INTO tax_rates (country_code, state_code, postcode, city, rate, tax_name, priority, is_shipping_taxable) VALUES
  ('CA', 'AB', '*', '*',  5.0000, 'Alberta',               1, FALSE),
  ('CA', 'BC', '*', '*', 12.0000, 'British Columbia',      1, FALSE),
  ('CA', 'MB', '*', '*', 12.0000, 'Manitoba',              1, FALSE),
  ('CA', 'NB', '*', '*', 15.0000, 'New-Brunswick',         1, FALSE),
  ('CA', 'NL', '*', '*', 15.0000, 'Newfoundland and Labrador', 1, FALSE),
  ('CA', 'NS', '*', '*', 15.0000, 'Nova Scotia',           1, FALSE),
  ('CA', 'NT', '*', '*',  5.0000, 'Northwest Territories', 1, FALSE),
  ('CA', 'NU', '*', '*',  5.0000, 'Nunavut',               1, FALSE),
  ('CA', 'ON', '*', '*', 13.0000, 'Ontario',               1, FALSE),
  ('CA', 'PE', '*', '*', 15.0000, 'Prince Edward Island',  1, FALSE),
  ('CA', 'QC', '*', '*', 14.9750, 'Quebec',                1, FALSE),
  ('CA', 'SK', '*', '*', 11.0000, 'Saskatchewan',          1, FALSE),
  ('CA', 'YT', '*', '*',  5.0000, 'Yukon',                 1, FALSE);

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE shipping_zones IS 'Shipping zones for rate calculation. Fallback zone used when no region matches.';
COMMENT ON TABLE shipping_zone_regions IS 'Maps country/state pairs to shipping zones. Non-overlapping regions.';
COMMENT ON TABLE shipping_rates IS 'Per-zone shipping rates by class. Clear Vinyl replaces base; Track adds on top.';
COMMENT ON TABLE tax_rates IS 'Tax rates by country/state/postcode. Most specific match wins.';
COMMENT ON TABLE shipping_tax_history IS 'Audit trail for shipping rate and tax rate changes.';
