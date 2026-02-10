-- =============================================================================
-- Lead-Project Integration Migration
-- Adds project_id to email_messages for project-level email threading
-- Adds photo_urls to leads for quick reference
-- =============================================================================

-- 1. Add project_id to email_messages for project-level threading
ALTER TABLE public.email_messages
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_email_messages_project
  ON public.email_messages (project_id);

-- 2. Add photo_urls array to leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS photo_urls text[];
