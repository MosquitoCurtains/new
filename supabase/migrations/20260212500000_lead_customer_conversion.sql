-- Lead → Customer conversion support + salesperson field unification
-- Safe to run: user confirmed no order/cart records exist yet.

-- =========================================================================
-- 1. Add 'converted' to leads.status CHECK constraint
-- =========================================================================
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (
  status IN (
    'open', 'pending', 'need_photos', 'invitation_to_plan', 'need_measurements',
    'working_on_quote', 'quote_sent', 'need_decision', 'order_placed',
    'order_on_hold', 'difficult', 'closed', 'converted'
  )
);

-- =========================================================================
-- 2. Customers table: add proper FK fields, drop old text field
-- =========================================================================
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS assigned_salesperson_id uuid
    REFERENCES public.staff(id) ON DELETE SET NULL;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS lead_id uuid
    REFERENCES public.leads(id) ON DELETE SET NULL;

-- Drop the old text-based salesperson column (replaced by assigned_salesperson_id FK)
ALTER TABLE public.customers DROP COLUMN IF EXISTS assigned_salesperson;

CREATE INDEX IF NOT EXISTS idx_customers_assigned_salesperson
  ON public.customers(assigned_salesperson_id);

CREATE INDEX IF NOT EXISTS idx_customers_lead
  ON public.customers(lead_id);

-- =========================================================================
-- 3. Orders: salesperson_id text → uuid FK, drop salesperson_name
-- =========================================================================

-- Drop the denormalized name column (join staff table instead)
ALTER TABLE public.orders DROP COLUMN IF EXISTS salesperson_name;

-- Drop existing index on the text column
DROP INDEX IF EXISTS idx_orders_salesperson_id;

-- Convert salesperson_id from text to uuid (no records to migrate)
ALTER TABLE public.orders
  ALTER COLUMN salesperson_id TYPE uuid USING salesperson_id::uuid;

-- Add FK constraint
ALTER TABLE public.orders
  ADD CONSTRAINT orders_salesperson_id_fkey
    FOREIGN KEY (salesperson_id) REFERENCES public.staff(id) ON DELETE SET NULL;

-- Recreate index
CREATE INDEX idx_orders_salesperson_id ON public.orders(salesperson_id);

-- =========================================================================
-- 4. Carts: add FK on salesperson_id (already uuid), drop salesperson_name
-- =========================================================================

-- Drop the denormalized name column
ALTER TABLE public.carts DROP COLUMN IF EXISTS salesperson_name;

-- Add FK constraint (column is already uuid type from earlier migration)
ALTER TABLE public.carts
  ADD CONSTRAINT carts_salesperson_id_fkey
    FOREIGN KEY (salesperson_id) REFERENCES public.staff(id) ON DELETE SET NULL;

-- =========================================================================
-- 5. Seed notification setting for salesperson_assigned
-- =========================================================================
INSERT INTO public.notification_settings (id, label, description, recipient_emails, is_enabled)
VALUES (
  'salesperson_assigned',
  'Salesperson Auto-Assigned',
  'Sent to a salesperson when they are automatically assigned to a returning customer''s new project.',
  '{}',
  true
)
ON CONFLICT (id) DO NOTHING;
