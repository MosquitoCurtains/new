-- Gallery System Tables
-- Migration: 20260131000000_gallery_tables.sql
-- Description: Creates tables for gallery images, curated collections, and assignments

-- ============================================================================
-- Table 1: gallery_images - All gallery images with filter tags
-- ============================================================================
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  thumbnail_url text,
  title text,
  description text,
  
  -- Customer option filters (match purchasing options)
  product_type text not null check (product_type in ('mosquito_curtains', 'clear_vinyl', 'raw_mesh')),
  project_type text not null check (project_type in ('porch', 'patio', 'garage', 'pergola', 'gazebo', 'deck', 'awning', 'industrial', 'other')),
  mesh_type text check (mesh_type in ('heavy_mosquito', 'no_see_um', 'shade', 'scrim', null)),
  top_attachment text check (top_attachment in ('tracking', 'velcro', 'grommets', null)),
  color text check (color in ('black', 'white', 'ivory', null)),
  
  -- Metadata
  location text,                 -- city/state for context
  customer_name text,
  is_featured boolean default false,
  sort_order int default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- Table 2: galleries - Named curated collections
-- ============================================================================
create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,     -- 'best-porches', 'customer-favorites'
  name text not null,            -- 'Best Porch Projects'
  description text,
  
  -- Display settings
  is_published boolean default false,
  display_on_page text,          -- '/screened-porch' (for embedded galleries)
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- Table 3: gallery_assignments - Links images to collections
-- ============================================================================
create table if not exists gallery_assignments (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references galleries(id) on delete cascade,
  image_id uuid references gallery_images(id) on delete cascade,
  display_order int default 0,
  
  unique(gallery_id, image_id),
  
  created_at timestamptz default now()
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================
create index if not exists idx_gallery_images_product_type on gallery_images(product_type);
create index if not exists idx_gallery_images_project_type on gallery_images(project_type);
create index if not exists idx_gallery_images_is_featured on gallery_images(is_featured);
create index if not exists idx_galleries_slug on galleries(slug);
create index if not exists idx_galleries_display_on_page on galleries(display_on_page);
create index if not exists idx_gallery_assignments_gallery_id on gallery_assignments(gallery_id);
create index if not exists idx_gallery_assignments_image_id on gallery_assignments(image_id);

-- ============================================================================
-- Triggers for updated_at
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_gallery_images_updated_at on gallery_images;
create trigger update_gallery_images_updated_at
  before update on gallery_images
  for each row execute function update_updated_at_column();

drop trigger if exists update_galleries_updated_at on galleries;
create trigger update_galleries_updated_at
  before update on galleries
  for each row execute function update_updated_at_column();

-- ============================================================================
-- RLS Policies (adjust based on your auth setup)
-- ============================================================================

-- Enable RLS
alter table gallery_images enable row level security;
alter table galleries enable row level security;
alter table gallery_assignments enable row level security;

-- Public read access for published content
create policy "Public can view gallery images"
  on gallery_images for select
  using (true);

create policy "Public can view published galleries"
  on galleries for select
  using (is_published = true);

create policy "Public can view gallery assignments for published galleries"
  on gallery_assignments for select
  using (
    exists (
      select 1 from galleries g 
      where g.id = gallery_assignments.gallery_id 
      and g.is_published = true
    )
  );

-- Admin policies (authenticated users with admin role)
-- Note: Adjust these based on your actual auth/role setup
create policy "Admins can manage gallery images"
  on gallery_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins can manage galleries"
  on galleries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins can manage gallery assignments"
  on gallery_assignments for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- Seed some sample data for development
-- ============================================================================
insert into gallery_images (image_url, title, product_type, project_type, location, is_featured) values
  ('https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', 'Screen Porch Project', 'mosquito_curtains', 'porch', 'Georgia', true),
  ('https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', 'Patio Enclosure', 'mosquito_curtains', 'patio', 'Florida', true),
  ('https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg', 'Garage Door Screen', 'mosquito_curtains', 'garage', 'Texas', false),
  ('https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg', 'Clear Vinyl Patio', 'clear_vinyl', 'patio', 'California', true)
on conflict do nothing;

insert into galleries (slug, name, description, is_published, display_on_page) values
  ('featured', 'Featured Projects', 'Our best customer installations', true, null),
  ('porch-gallery', 'Porch Projects', 'Screen porch installations', true, '/screened-porch')
on conflict do nothing;
