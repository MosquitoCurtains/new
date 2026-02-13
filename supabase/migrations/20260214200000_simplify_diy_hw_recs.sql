-- ============================================================================
-- Simplify diy_wizard_hardware_recommendations
--
-- The old table had 15 columns duplicating product data (name, unit_label,
-- category, description_template). The product_sku column was NULL on every
-- row due to migration ordering bugs.
--
-- This migration replaces it with a thin "calc config" table.  The products
-- table is the source of truth for name, price, image, and unit.
--
-- Sections mirror admin/sales: Standard Track, Sealing Sides, Magnetic
-- Doorways, Stucco, Tools.
-- ============================================================================

-- 1. Drop the old bloated table
DROP TABLE IF EXISTS public.diy_wizard_hardware_recommendations;

-- 2. Create the thin replacement
CREATE TABLE public.diy_wizard_hardware_recommendations (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_sku   text NOT NULL,                    -- links to products.sku
    calc_rule     text NOT NULL,                    -- formula key: track_linear_pieces, per_doorway_count, etc.
    calc_params   jsonb NOT NULL DEFAULT '{}',      -- tunable params: {piece_length_inches: 84}, {per_doorway: 2}
    color_match   text,                             -- comma-separated colors, NULL = all colors
    product_types text,                             -- comma-separated types, NULL = all product types
    sort_order    integer NOT NULL DEFAULT 0,
    active        boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint: one recommendation per product_sku + color_match combo
CREATE UNIQUE INDEX idx_diy_hw_rec_sku_color
    ON public.diy_wizard_hardware_recommendations (product_sku, COALESCE(color_match, ''));

-- 3. Seed recommendation rules (matching admin/sales sections)
INSERT INTO public.diy_wizard_hardware_recommendations
    (product_sku, calc_rule, calc_params, color_match, product_types, sort_order)
VALUES
    -- ── Standard Track (recommended when top attachment = tracking) ──
    -- NOTE: Carriers are included with panel orders, not sold separately here.
    ('track_standard_straight', 'track_linear_pieces', '{"piece_length_inches": 84}', NULL, NULL, 10),
    ('track_standard_splice',   'track_splices',       '{}',                          NULL, NULL, 20),
    ('track_standard_endcap',   'track_endcaps',       '{"per_run": 2}',              NULL, NULL, 30),

    -- ── Sealing Sides — color-matched (recommended when side edge = marine_snaps) ──
    ('marine_snap_white', 'per_snap_edge', '{}', 'white,ivory', NULL, 40),
    ('marine_snap_black', 'per_snap_edge', '{}', 'black',       NULL, 50),

    -- ── Magnetic Doorways (recommended when side edge = magnetic_door) ──
    ('block_magnet',        'per_doorway_count', '{"per_doorway": 1}', NULL, NULL, 60),
    ('fiberglass_rod',      'per_doorway_count', '{"per_doorway": 2}', NULL, NULL, 70),
    ('fiberglass_rod_clip', 'per_doorway_count', '{"per_doorway": 2}', NULL, NULL, 80),

    -- ── Stucco (recommended when side edge = stucco_strip) ──
    ('stucco_standard', 'per_stucco_edge', '{}', NULL, NULL, 90),

    -- ── Tools (always recommended for applicable product types) ──
    ('snap_tool', 'fixed_quantity', '{"quantity": 1}', NULL, 'mosquito_curtains,clear_vinyl', 100);

-- 4. Enable RLS (match existing pattern)
ALTER TABLE public.diy_wizard_hardware_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of active recommendations"
    ON public.diy_wizard_hardware_recommendations
    FOR SELECT
    USING (active = true);

CREATE POLICY "Allow service role full access to recommendations"
    ON public.diy_wizard_hardware_recommendations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
