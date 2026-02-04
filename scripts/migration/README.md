# WooCommerce Migration Scripts

Scripts to import historical WooCommerce orders into the new Supabase database.

## Prerequisites

1. Run the database migrations first:
   - `20260129000000_initial_schema.sql`
   - `20260131000000_gallery_tables.sql` 
   - `20260202000000_ecommerce_schema.sql`
   - `20260202000001_seed_products.sql`

2. Ensure `.env.local` has valid Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

3. Place the WooCommerce CSV export at:
   ```
   All Previous Orders/All woocommerce orders.csv
   ```

## Usage

### Step 1: Parse CSV

Parse the WooCommerce CSV into structured JSON:

```bash
npx ts-node scripts/migration/parse-woocommerce-orders.ts
```

This creates:
- `data/parsed-orders.json` - All parsed orders
- `data/import-stats.json` - Parsing statistics

### Step 2: Import to Supabase

Import the parsed orders into the database:

```bash
npx ts-node scripts/migration/import-to-supabase.ts
```

This populates:
- `legacy_orders` - Order header data
- `legacy_line_items` - Individual products per order
- `legacy_panel_specs` - Extracted panel dimensions
- `customers` - New customers (if not exists)

### Step 3: Extract Customer Metrics

Calculate RFM scores and update customer records:

```bash
npx ts-node scripts/migration/extract-customers.ts
```

This updates customers with:
- Total orders & spend
- RFM scores (Recency, Frequency, Monetary)
- LTV tier (VIP, High, Medium, Low, New)
- Product preferences
- Geographic data

## Data Flow

```
WooCommerce CSV
      │
      ▼
┌─────────────────────┐
│ parse-woocommerce-  │
│ orders.ts           │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ data/parsed-        │
│ orders.json         │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ import-to-          │
│ supabase.ts         │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Supabase Tables:    │
│ - legacy_orders     │
│ - legacy_line_items │
│ - legacy_panel_specs│
│ - customers         │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ extract-            │
│ customers.ts        │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ customers (updated) │
│ - RFM scores        │
│ - LTV tier          │
│ - Preferences       │
└─────────────────────┘
```

## Product Classification

Line items are automatically classified into types:

| Type | Examples |
|------|----------|
| `panel` | Mosquito Curtains, Clear Vinyl Panels, Scrim |
| `track` | Straight Track, 90 Degree Curve, Snap Carriers |
| `tool` | Industrial Snap Tool |
| `attachment` | Marine Snaps, Magnets, Fiberglass Rods |
| `raw_material` | Raw Netting by the Roll |
| `adjustment` | Discounts, Surcharges |
| `bundle` | Attachment Item bundles |
| `unknown` | Unclassified items |

## Panel Spec Extraction

For panel-type items, the parser extracts dimensions from meta fields:

- Width (inches)
- Height (inches)
- Square footage
- Mesh type
- Color
- Top/bottom attachment
- Door/zipper/notch flags

## Error Handling

- Failed orders are logged to `data/import-errors.json`
- Duplicate orders (same `woo_order_id`) are skipped
- Customer creation failures don't stop order import

## Statistics

After parsing, you'll see:
- Total orders processed
- Line items by type
- Panel specs extracted
- Orders with diagrams
- Unique customers
- Unique salespersons
- Total revenue
- Date range

## Troubleshooting

### "Missing Supabase credentials"
Check that `.env.local` exists and has the correct values.

### "Parsed orders file not found"
Run the parser first: `npx ts-node scripts/migration/parse-woocommerce-orders.ts`

### Rate limiting errors
The importer uses batches of 100 with delays. If you still hit limits, increase `RETRY_DELAY_MS` in `import-to-supabase.ts`.

### Memory issues with large CSV
For very large files, consider splitting the CSV first.
