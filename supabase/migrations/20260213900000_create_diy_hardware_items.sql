-- =============================================================================
-- Create diy_hardware_items table + seed with current hard-coded values
-- =============================================================================
-- Stores all configurable hardware recommendation items for the DIY Panel Builder.
-- Each row represents a hardware item that can be recommended based on the
-- customer's panel configuration. The admin page at /admin/diy-hardware manages
-- these values.
--
-- Calculation logic stays in TypeScript (src/components/plan/PanelBuilder.tsx),
-- but parameters (piece lengths, per-doorway counts, etc.) are stored here
-- so the admin can tune them without code changes.
-- =============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.diy_hardware_items (
    id              uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    item_key        text NOT NULL UNIQUE,             -- stable identifier: 'track_straight', 'track_splice', etc.
    category        text NOT NULL,                    -- grouping: 'track', 'snap', 'magnetic_door', 'stucco', 'tools'
    name            text NOT NULL,                    -- display name
    description_template text,                        -- supports {qty}, {pieces}, {runs}, {doorways}, {edges} placeholders
    image_url       text,                             -- product image
    product_url     text,                             -- link to purchase
    unit_label      text NOT NULL DEFAULT 'each',     -- 'pcs', 'packs', 'sets', 'strips', 'tool'
    unit_price      numeric(10,2) NOT NULL DEFAULT 0, -- price per unit
    pack_quantity   integer DEFAULT 1,                -- units per pack (for marine snaps etc.)
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

-- 4. Index for fast lookups
CREATE INDEX idx_diy_hardware_category ON public.diy_hardware_items(category);
CREATE INDEX idx_diy_hardware_active ON public.diy_hardware_items(active);

-- =============================================================================
-- SEED DATA: Current hard-coded values from PanelBuilder.tsx
-- Prices pulled from current products table defaults
-- =============================================================================

-- ── Track Hardware ──
INSERT INTO public.diy_hardware_items (item_key, category, name, description_template, image_url, unit_label, unit_price, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'track_straight',
    'track',
    'Standard Track (7ft)',
    '{pieces} piece(s) for ~{total_feet}ft of track',
    'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Track-Color-White-Black-700x700.jpg',
    'pcs',
    32.00,
    'track_linear_pieces',
    '{"piece_length_inches": 84}',
    10,
    'Main track pieces. 7ft (84in) each. Quantity = ceil(totalTrackFeet / 7).'
),
(
    'track_splice',
    'track',
    'Track Splice Connector',
    'Connects track pieces end-to-end',
    NULL,
    'pcs',
    5.00,
    'track_splices',
    '{}',
    20,
    'Joins track pieces. Qty = (total pieces) - (number of separate track runs).'
),
(
    'track_endcap',
    'track',
    'Track End Caps',
    '2 per track run ({runs} run(s))',
    NULL,
    'pcs',
    3.00,
    'track_endcaps',
    '{"per_run": 2}',
    30,
    'Caps for each end of a track run. Qty = 2 per continuous track run.'
);

-- ── Marine Snaps ──
INSERT INTO public.diy_hardware_items (item_key, category, name, description_template, image_url, unit_label, unit_price, pack_quantity, calc_rule, calc_params, color_match, sort_order, admin_notes) VALUES
(
    'marine_snap_white',
    'snap',
    'Marine Snaps — White',
    'Pack of {pack_qty} — 1 pack per snap edge',
    '/images/products/marine-snaps.png',
    'packs',
    12.00,
    10,
    'per_snap_edge',
    '{}',
    'white,ivory',
    40,
    'White snaps for white/ivory mesh. Qty = number of edges with marine_snaps attachment.'
),
(
    'marine_snap_black',
    'snap',
    'Marine Snaps — Black',
    'Pack of {pack_qty} — 1 pack per snap edge',
    '/images/products/marine-snaps.png',
    'packs',
    12.00,
    10,
    'per_snap_edge',
    '{}',
    'black',
    41,
    'Black snaps for black mesh. Qty = number of edges with marine_snaps attachment.'
);

-- ── Magnetic Door Hardware ──
INSERT INTO public.diy_hardware_items (item_key, category, name, description_template, image_url, unit_label, unit_price, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'block_magnet',
    'magnetic_door',
    'Block Magnets',
    '{per_doorway} per doorway x {doorways} doorway(s)',
    NULL,
    'pcs',
    2.50,
    'per_doorway_count',
    '{"per_doorway": 8}',
    50,
    'Block magnets for magnetic doorways. Default 8 per doorway.'
),
(
    'fiberglass_rod',
    'magnetic_door',
    'Fiberglass Rods',
    '{per_doorway} per doorway x {doorways} doorway(s)',
    NULL,
    'sets',
    8.00,
    'per_doorway_count',
    '{"per_doorway": 2}',
    60,
    'Fiberglass rods for magnetic doorways. Default 2 per doorway.'
);

-- ── Stucco ──
INSERT INTO public.diy_hardware_items (item_key, category, name, description_template, image_url, unit_label, unit_price, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'stucco_strip',
    'stucco',
    'Stucco Strip',
    '1 per stucco edge',
    NULL,
    'strips',
    15.00,
    'per_stucco_edge',
    '{}',
    70,
    'Stucco mounting strips. Qty = number of edges with stucco_strip attachment.'
);

-- ── Tools ──
INSERT INTO public.diy_hardware_items (item_key, category, name, description_template, image_url, unit_label, unit_price, calc_rule, calc_params, sort_order, admin_notes) VALUES
(
    'snap_tool',
    'tools',
    'Snap Installation Tool',
    'Required for installing snaps. Fully refundable if returned.',
    NULL,
    'tool',
    40.00,
    'fixed_quantity',
    '{"quantity": 1}',
    80,
    'Always recommended. Qty is always 1. Refundable deposit.'
);
