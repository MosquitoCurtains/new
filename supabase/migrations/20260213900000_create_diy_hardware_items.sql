-- =============================================================================
-- Create diy_hardware_items table + seed with current recommendation rules
-- =============================================================================
-- Stores the RECOMMENDATION RULES for the DIY Panel Builder's "Track &
-- Attachments" step. Each row defines WHAT to recommend, WHEN to recommend it,
-- and HOW MANY to recommend based on the customer's panel configuration.
--
-- Pricing data is NOT stored here — it lives in the products table and is
-- managed at /admin/pricing. Each row links to a product via product_sku.
--
-- The admin page at /admin/diy-hardware manages these recommendation rules.
-- Calculation logic stays in TypeScript; parameters are stored here so the
-- admin can tune them without code changes.
-- =============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.diy_hardware_items (
    id              uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    item_key        text NOT NULL UNIQUE,             -- stable identifier: 'track_straight', 'track_splice', etc.
    category        text NOT NULL,                    -- grouping: 'track', 'snap', 'magnetic_door', 'stucco', 'tools'
    product_sku     text,                             -- links to products.sku for pricing/images (managed at /admin/pricing)
    name            text NOT NULL,                    -- display name
    description_template text,                        -- supports {qty}, {pieces}, {runs}, {doorways}, {edges} placeholders
    unit_label      text NOT NULL DEFAULT 'each',     -- 'pcs', 'packs', 'sets', 'strips', 'tool'
    calc_rule       text NOT NULL,                    -- identifies the calculation function in code
    calc_params     jsonb DEFAULT '{}',               -- tunable parameters, e.g. {"piece_length_inches": 84}
    color_match     text,                             -- null = all colors, comma-separated otherwise: 'white,ivory' or 'black'
    sort_order      integer DEFAULT 0,
    active          boolean DEFAULT true NOT NULL,
    admin_notes     text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

-- 2. Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_diy_hardware_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_diy_hardware_items_updated_at ON public.diy_hardware_items;
CREATE TRIGGER set_diy_hardware_items_updated_at
    BEFORE UPDATE ON public.diy_hardware_items
    FOR EACH ROW
    EXECUTE FUNCTION update_diy_hardware_items_updated_at();

-- 3. RLS
ALTER TABLE public.diy_hardware_items ENABLE ROW LEVEL SECURITY;

-- Public read (PanelBuilder needs these for recommendations)
CREATE POLICY "Public can view active diy hardware items"
    ON public.diy_hardware_items FOR SELECT
    USING (true);

-- Staff can manage
CREATE POLICY "Staff can manage diy hardware items"
    ON public.diy_hardware_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.staff
            WHERE staff.auth_user_id = auth.uid()
              AND staff.is_active = true
        )
    );

-- 4. Indexes
CREATE INDEX idx_diy_hardware_category ON public.diy_hardware_items(category);
CREATE INDEX idx_diy_hardware_active ON public.diy_hardware_items(active);

-- =============================================================================
-- SEED DATA: Recommendation rules from PanelBuilder.tsx
-- product_sku links to the products table for pricing/image data.
-- =============================================================================

-- ── Track Hardware ──
INSERT INTO public.diy_hardware_items (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'track_straight',
    'track',
    'track_standard_straight',
    'Standard Track (7ft)',
    '{pieces} piece(s) for ~{total_feet}ft of track',
    'pcs',
    'track_linear_pieces',
    '{"piece_length_inches": 84}',
    10,
    'Main track pieces. 7ft (84in) each. Qty = ceil(totalTrackFeet / pieceLength).'
),
(
    'track_splice',
    'track',
    'track_standard_splice',
    'Track Splice Connector',
    'Connects track pieces end-to-end',
    'pcs',
    'track_splices',
    '{}',
    20,
    'Joins track pieces. Qty = (total track pieces) - (number of separate track runs).'
),
(
    'track_endcap',
    'track',
    'track_standard_endcap',
    'Track End Caps',
    '2 per track run ({runs} run(s))',
    'pcs',
    'track_endcaps',
    '{"per_run": 2}',
    30,
    'Caps for each end of a track run. Qty = per_run * number of continuous track runs.'
);

-- ── Marine Snaps ──
INSERT INTO public.diy_hardware_items (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, color_match, sort_order, admin_notes) VALUES
(
    'marine_snap_white',
    'snap',
    'marine_snap_white',
    'Marine Snaps — White',
    'Pack of {pack_qty} — 1 pack per snap edge',
    'packs',
    'per_snap_edge',
    '{}',
    'white,ivory',
    40,
    'White snaps for white/ivory mesh. Qty = number of edges with marine_snaps attachment.'
),
(
    'marine_snap_black',
    'snap',
    'marine_snap_black',
    'Marine Snaps — Black',
    'Pack of {pack_qty} — 1 pack per snap edge',
    'packs',
    'per_snap_edge',
    '{}',
    'black',
    41,
    'Black snaps for black mesh. Qty = number of edges with marine_snaps attachment.'
);

-- ── Magnetic Door Hardware ──
INSERT INTO public.diy_hardware_items (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'block_magnet',
    'magnetic_door',
    'block_magnet',
    'Block Magnets',
    '{per_doorway} per doorway x {doorways} doorway(s)',
    'pcs',
    'per_doorway_count',
    '{"per_doorway": 8}',
    50,
    'Block magnets for magnetic doorways. Default 8 per doorway.'
),
(
    'fiberglass_rod',
    'magnetic_door',
    'fiberglass_rod',
    'Fiberglass Rods',
    '{per_doorway} per doorway x {doorways} doorway(s)',
    'sets',
    'per_doorway_count',
    '{"per_doorway": 2}',
    60,
    'Fiberglass rods for magnetic doorways. Default 2 per doorway.'
);

-- ── Stucco ──
INSERT INTO public.diy_hardware_items (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'stucco_strip',
    'stucco',
    'stucco_standard',
    'Stucco Strip',
    '1 per stucco edge',
    'strips',
    'per_stucco_edge',
    '{}',
    70,
    'Stucco mounting strips. Qty = number of edges with stucco_strip attachment.'
);

-- ── Tools ──
INSERT INTO public.diy_hardware_items (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'snap_tool',
    'tools',
    'snap_tool',
    'Snap Installation Tool',
    'Required for installing snaps. Fully refundable if returned.',
    'tool',
    'fixed_quantity',
    '{"quantity": 1}',
    80,
    'Always recommended. Qty is always 1. Refundable deposit.'
);
