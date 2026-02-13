-- =============================================================================
-- Create instant_quote_pricing table + seed with current hard-coded values
-- =============================================================================
-- Stores all configurable pricing parameters for the Instant Quote calculator.
-- Each row is a single pricing parameter identified by (category, pricing_key).
-- Admin UI at /admin/instant-quote manages these values.
-- =============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.instant_quote_pricing (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    category text NOT NULL,
    pricing_key text NOT NULL,
    value numeric(10,4) NOT NULL,
    display_label text NOT NULL,
    admin_only boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(category, pricing_key)
);

-- 2. Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_instant_quote_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_instant_quote_pricing_updated_at ON public.instant_quote_pricing;
CREATE TRIGGER set_instant_quote_pricing_updated_at
    BEFORE UPDATE ON public.instant_quote_pricing
    FOR EACH ROW
    EXECUTE FUNCTION update_instant_quote_pricing_updated_at();

-- 3. RLS
ALTER TABLE public.instant_quote_pricing ENABLE ROW LEVEL SECURITY;

-- Public read (calculator needs these values)
CREATE POLICY "Public can view instant quote pricing"
    ON public.instant_quote_pricing FOR SELECT
    USING (true);

-- Staff can manage
CREATE POLICY "Staff can manage instant quote pricing"
    ON public.instant_quote_pricing FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.staff
            WHERE staff.auth_user_id = auth.uid()
              AND staff.is_active = true
        )
    );

-- 4. Index for fast lookups
CREATE INDEX idx_iq_pricing_category ON public.instant_quote_pricing(category);

-- =============================================================================
-- SEED DATA: Current hard-coded values from instant-quote.ts
-- Source: Gravity Forms JSON exports dated 1-11-24
-- =============================================================================

-- Mosquito Mesh Prices (per linear foot)
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('mosquito_mesh_price', 'heavy_mosquito', 18.95, 'Heavy Mosquito Mesh', 1),
    ('mosquito_mesh_price', 'no_see_um', 19.95, 'No-See-Um Mesh', 2),
    ('mosquito_mesh_price', 'shade', 20.95, 'Shade Mesh', 3),
    ('mosquito_mesh_price', 'scrim', 20.95, 'Scrim Material', 4);

-- Clear Vinyl Height Prices (per linear foot)
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('vinyl_height_price', 'short', 29.00, 'Shorter Than 78"', 1),
    ('vinyl_height_price', 'medium', 35.00, '78" - 108"', 2),
    ('vinyl_height_price', 'tall', 42.00, 'Taller Than 108"', 3);

-- Clear Vinyl Per-Side Costs
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('vinyl_side_cost', 'short', 80.00, 'Shorter Than 78"', 1),
    ('vinyl_side_cost', 'medium', 85.00, '78" - 108"', 2),
    ('vinyl_side_cost', 'tall', 90.00, 'Taller Than 108"', 3);

-- Mosquito Configuration
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('mosquito_config', 'side_cost', 52.00, 'Per-Side Cost', 1),
    ('mosquito_config', 'markup_multiplier', 1.02, 'Markup Multiplier (e.g. 1.02 = 2%)', 2);

-- Top Attachment Costs (per linear foot) — shared by both product types
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('top_attachment_cost', 'velcro', 0.00, 'Velcro', 1),
    ('top_attachment_cost', 'grommets', 0.00, 'Grommets (For Fixed Awnings)', 2),
    ('top_attachment_cost', 'tracking_under_10', 5.70, 'Tracking < 10FT Tall', 3),
    ('top_attachment_cost', 'tracking_over_10', 8.00, 'Tracking > 10FT Tall', 4);

-- Mosquito Sides Multiplier (display sides -> formula multiplier)
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('mosquito_sides_multiplier', '1', 2, '1 Side', 1),
    ('mosquito_sides_multiplier', '2', 3, '2 Sides', 2),
    ('mosquito_sides_multiplier', '3', 4, '3 Sides', 3),
    ('mosquito_sides_multiplier', '4', 5, '4 Sides', 4),
    ('mosquito_sides_multiplier', '5', 6, 'More Than 4', 5);

-- Vinyl Sides Multiplier (display sides -> formula multiplier)
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('vinyl_sides_multiplier', '1', 2, '1 Side', 1),
    ('vinyl_sides_multiplier', '2', 4, '2 Sides', 2),
    ('vinyl_sides_multiplier', '3', 6, '3 Sides', 3),
    ('vinyl_sides_multiplier', '4', 8, '4 Sides', 4),
    ('vinyl_sides_multiplier', '5', 10, 'More Than 4', 5);

-- Mosquito Shipping Parameters
-- Format: {location}_{param}
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('mosquito_shipping', 'usa_base_fee', 15.00, 'USA Base Fee', 1),
    ('mosquito_shipping', 'usa_rate', 0.0275, 'USA Rate (% of subtotal)', 2),
    ('mosquito_shipping', 'usa_track_surcharge', 30.00, 'USA Tracking Surcharge', 3),
    ('mosquito_shipping', 'canada_base_fee', 55.00, 'Canada Base Fee', 4),
    ('mosquito_shipping', 'canada_rate', 0.03, 'Canada Rate (% of subtotal)', 5),
    ('mosquito_shipping', 'canada_track_surcharge', 50.00, 'Canada Tracking Surcharge', 6),
    ('mosquito_shipping', 'international_base_fee', 40.00, 'International Base Fee', 7),
    ('mosquito_shipping', 'international_rate', 0.05, 'International Rate (% of subtotal)', 8),
    ('mosquito_shipping', 'international_track_surcharge', 70.00, 'International Tracking Surcharge', 9);

-- Vinyl Shipping Parameters
INSERT INTO public.instant_quote_pricing (category, pricing_key, value, display_label, sort_order) VALUES
    ('vinyl_shipping', 'usa_base_fee', 45.00, 'USA Base Fee', 1),
    ('vinyl_shipping', 'usa_rate', 0.06, 'USA Rate (% of subtotal)', 2),
    ('vinyl_shipping', 'usa_track_surcharge', 30.00, 'USA Tracking Surcharge', 3),
    ('vinyl_shipping', 'canada_base_fee', 105.00, 'Canada Base Fee', 4),
    ('vinyl_shipping', 'canada_rate', 0.06, 'Canada Rate (% of subtotal)', 5),
    ('vinyl_shipping', 'canada_track_surcharge', 50.00, 'Canada Tracking Surcharge', 6),
    ('vinyl_shipping', 'international_base_fee', 110.00, 'International Base Fee', 7),
    ('vinyl_shipping', 'international_rate', 0.05, 'International Rate (% of subtotal)', 8),
    ('vinyl_shipping', 'international_track_surcharge', 70.00, 'International Tracking Surcharge', 9);
