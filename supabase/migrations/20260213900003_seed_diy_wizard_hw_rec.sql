-- =============================================================================
-- Seed diy_wizard_hardware_recommendations — PART 2: Seed data
-- =============================================================================
-- Run AFTER the schema fix migration (20260213900002).
-- Each row links to a product in the products table via product_sku.
-- =============================================================================

-- ── Track Hardware ──
INSERT INTO public.diy_wizard_hardware_recommendations
    (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes)
VALUES
    ('track_straight', 'track', 'track_standard_straight', 'Standard Track (7ft)',
     '{pieces} piece(s) for ~{total_feet}ft of track', 'pcs', 'track_linear_pieces',
     '{"piece_length_inches": 84}', 10,
     'Main track pieces. 7ft (84in) each. Qty = ceil(totalTrackFeet / pieceLength).'),
    ('track_splice', 'track', 'track_standard_splice', 'Track Splice Connector',
     'Connects track pieces end-to-end', 'pcs', 'track_splices',
     '{}', 20,
     'Joins track pieces. Qty = (total track pieces) - (number of separate track runs).'),
    ('track_endcap', 'track', 'track_standard_endcap', 'Track End Caps',
     '2 per track run ({runs} run(s))', 'pcs', 'track_endcaps',
     '{"per_run": 2}', 30,
     'Caps for each end of a track run. Qty = per_run * number of continuous track runs.')
ON CONFLICT (item_key) DO NOTHING;

-- ── Marine Snaps ──
INSERT INTO public.diy_wizard_hardware_recommendations
    (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, color_match, sort_order, admin_notes)
VALUES
    ('marine_snap_white', 'snap', 'marine_snap_white', 'Marine Snaps — White',
     'Pack of {pack_qty} — 1 pack per snap edge', 'packs', 'per_snap_edge',
     '{}', 'white,ivory', 40,
     'White snaps for white/ivory mesh. Qty = number of edges with marine_snaps attachment.'),
    ('marine_snap_black', 'snap', 'marine_snap_black', 'Marine Snaps — Black',
     'Pack of {pack_qty} — 1 pack per snap edge', 'packs', 'per_snap_edge',
     '{}', 'black', 41,
     'Black snaps for black mesh. Qty = number of edges with marine_snaps attachment.')
ON CONFLICT (item_key) DO NOTHING;

-- ── Magnetic Door Hardware ──
INSERT INTO public.diy_wizard_hardware_recommendations
    (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes)
VALUES
    ('block_magnet', 'magnetic_door', 'block_magnet', 'Block Magnets',
     '{per_doorway} per doorway x {doorways} doorway(s)', 'pcs', 'per_doorway_count',
     '{"per_doorway": 8}', 50,
     'Block magnets for magnetic doorways. Default 8 per doorway.'),
    ('fiberglass_rod', 'magnetic_door', 'fiberglass_rod', 'Fiberglass Rods',
     '{per_doorway} per doorway x {doorways} doorway(s)', 'sets', 'per_doorway_count',
     '{"per_doorway": 2}', 60,
     'Fiberglass rods for magnetic doorways. Default 2 per doorway.')
ON CONFLICT (item_key) DO NOTHING;

-- ── Stucco ──
INSERT INTO public.diy_wizard_hardware_recommendations
    (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes)
VALUES
    ('stucco_strip', 'stucco', 'stucco_standard', 'Stucco Strip',
     '1 per stucco edge', 'strips', 'per_stucco_edge',
     '{}', 70,
     'Stucco mounting strips. Qty = number of edges with stucco_strip attachment.')
ON CONFLICT (item_key) DO NOTHING;

-- ── Tools ──
INSERT INTO public.diy_wizard_hardware_recommendations
    (item_key, category, product_sku, name, description_template, unit_label, calc_rule, calc_params, sort_order, admin_notes)
VALUES
    ('snap_tool', 'tools', 'snap_tool', 'Snap Installation Tool',
     'Required for installing snaps. Fully refundable if returned.', 'tool', 'fixed_quantity',
     '{"quantity": 1}', 80,
     'Always recommended. Qty is always 1. Refundable deposit.')
ON CONFLICT (item_key) DO NOTHING;
