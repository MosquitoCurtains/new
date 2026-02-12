-- Add project_name column to projects table
-- Allows users to give projects a friendly name for easier identification
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_name text;

-- Optionally, you can backfill existing projects with a default name:
-- UPDATE projects SET project_name = CONCAT(first_name, ' ', last_name, ' - ', product_type) WHERE project_name IS NULL;
