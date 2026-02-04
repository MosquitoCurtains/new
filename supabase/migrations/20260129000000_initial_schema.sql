-- Mosquito Curtains Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user ON customers(auth_user_id);

-- ============================================================================
-- STAFF TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'sales' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_auth_user ON staff(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active) WHERE is_active = true;

-- ============================================================================
-- LEADS TABLE (Quick Connect Forms)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Contact Info
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- Interest
  interest TEXT, -- curtains, vinyl, both, netting
  project_type TEXT, -- porch, deck, pergola, etc.
  message TEXT,
  
  -- Source Tracking
  source TEXT, -- quick_connect, start_project, contact_form
  
  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  landing_page TEXT,
  session_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' NOT NULL, -- new, contacted, qualified, converted, closed
  assigned_to UUID REFERENCES staff(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);

-- ============================================================================
-- PROJECTS TABLE (Start a Project Wizard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Customer Link
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  -- Contact Info (denormalized for quick access)
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- Project Details
  product_type TEXT NOT NULL, -- curtains, vinyl, both, netting
  project_type TEXT, -- porch, deck, pergola, etc.
  mesh_type TEXT, -- heavy, noseeums, shade
  top_attachment TEXT, -- velcro, tracking-short, tracking-tall
  total_width INTEGER,
  number_of_sides INTEGER,
  notes TEXT,
  
  -- Pricing
  estimated_total DECIMAL(10,2),
  
  -- Status & Assignment
  status TEXT DEFAULT 'draft' NOT NULL, -- draft, quoted, in_cart, ordered, completed
  assigned_to UUID REFERENCES staff(id) ON DELETE SET NULL,
  
  -- Sharing
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  
  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  landing_page TEXT,
  session_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_projects_email ON projects(email);
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_share_token ON projects(share_token);

-- ============================================================================
-- PROJECT PHOTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_project_photos_project ON project_photos(project_id);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- Public can insert leads (for forms)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Public can insert projects (for wizard)
CREATE POLICY "Anyone can create projects" ON projects
  FOR INSERT WITH CHECK (true);

-- Public can view their own projects by share_token
CREATE POLICY "Anyone can view projects by share token" ON projects
  FOR SELECT USING (share_token IS NOT NULL);

-- Staff can view all leads
CREATE POLICY "Staff can view all leads" ON leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Staff can update leads
CREATE POLICY "Staff can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Staff can view all projects
CREATE POLICY "Staff can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Staff can update projects
CREATE POLICY "Staff can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Customers can view their own projects
CREATE POLICY "Customers can view own projects" ON projects
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
