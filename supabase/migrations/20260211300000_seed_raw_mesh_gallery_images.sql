-- =============================================================================
-- Seed raw mesh product images into gallery_images
-- Source: S3 bucket via media.mosquitocurtains.com CDN
-- Excludes: a1-heavy-mesh-black.jpg (per user request)
-- Total: 122 images across 7 mesh+color groups
-- =============================================================================

DO $$
DECLARE
  cdn constant text := 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/mesh-specific';
  files text[];
  f text;
  i int;
BEGIN

  -- =========================================================================
  -- Heavy Mosquito Mesh — Black  (55 images, a1 excluded)
  -- =========================================================================
  files := ARRAY[
    'd1-heavy-mesh-black.jpg','d2-heavy-mesh-black.jpg','d3-heavy-mesh-black.jpg',
    'd4-heavy-mesh-black.jpg','d5-heavy-mesh-black.jpg','d6-heavy-mesh-black.jpg',
    'd7-heavy-mesh-black.jpg','d8-heavy-mesh-black.jpg','d9-heavy-mesh-black.jpg',
    'd10-heavy-mesh-black.jpg','d11-heavy-mesh-black.jpg','d12-heavy-mesh-black.jpg',
    'd13-heavy-mesh-black.jpg',
    'm1-heavy-mesh-black.jpg','m2-heavy-mesh-black.jpg','m3-heavy-mesh-black.jpg',
    'm4-heavy-mesh-black.jpg','m5-heavy-mesh-black.jpg','m6-heavy-mesh-black.jpg',
    'm7-heavy-mesh-black.jpg','m8-heavy-mesh-black.jpg','m9-heavy-mesh-black.jpg',
    'm10-heavy-mesh-black.jpg','m11-heavy-mesh-black.jpg','m12-heavy-mesh-black.jpg',
    'm13-heavy-mesh-black.jpg','m14-heavy-mesh-black.jpg','m15-heavy-mesh-black.jpg',
    'm16-heavy-mesh-black.jpg','m17-heavy-mesh-black.jpg','m18-heavy-mesh-black.jpg',
    'm19-heavy-mesh-black.jpg','m20-heavy-mesh-black.jpg','m21-heavy-mesh-black.jpg',
    'm22-heavy-mesh-black.jpg','m23-heavy-mesh-black.jpg','m24-heavy-mesh-black.jpg',
    'm25-heavy-mesh-black.jpg','m26-heavy-mesh-black.jpg','m27-heavy-mesh-black.jpg',
    'm28-heavy-mesh-black.jpg','m29-heavy-mesh-black.jpg','m30-heavy-mesh-black.jpg',
    'm31--shade-roof-panel--heavy-mesh-black.jpg',
    'm32--shade-roof-panel--heavy-mesh-black.jpg',
    'm33-heavy-mesh-black.jpg','m34-heavy-mesh-black.jpg','m35-heavy-mesh-black.jpg',
    'm36-heavy-mesh-black.jpg','m37-heavy-mesh-black.jpg','m38-heavy-mesh-black.jpg',
    'm39-heavy-mesh-black.jpg','m40-heavy-mesh-black.jpg','m41-heavy-mesh-black.jpg',
    'm42-heavy-mesh-black.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/heavy-mesh-black/' || f, 'Heavy Mosquito Mesh - Black', 'raw_mesh', 'other', 'heavy_mosquito', 'black', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- Heavy Mosquito Mesh — White  (12 images)
  -- =========================================================================
  files := ARRAY[
    'a1-heavy-mesh-white.jpg','a2-heavy-mesh-white.jpg','a3-heavy-mesh-white.jpg',
    'm1-heavy-mesh-white.jpg','m2-heavy-mesh-white.jpg','m3-heavy-mesh-white.jpg',
    'm4-heavy-mesh-white.jpg','m5-heavy-mesh-white.jpg','m6-heavy-mesh-white.jpg',
    'm7-heavy-mesh-white.jpg','m8-heavy-mesh-white.jpg','m9-heavy-mesh-white.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/heavy-mesh-white/' || f, 'Heavy Mosquito Mesh - White', 'raw_mesh', 'other', 'heavy_mosquito', 'white', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- Heavy Mosquito Mesh — Ivory  (7 images)
  -- =========================================================================
  files := ARRAY[
    'a1-heavy-mesh-ivory.jpg','a2-heavy-mesh-ivory.jpg','a3-heavy-mesh-ivory.jpg',
    'm1-heavy-mesh-ivory.jpg','m2-heavy-mesh-ivory.jpg','m3-heavy-mesh-ivory.jpg',
    'm4-heavy-mesh-ivory.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/heavy-mesh-ivory/' || f, 'Heavy Mosquito Mesh - Ivory', 'raw_mesh', 'other', 'heavy_mosquito', 'ivory', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- No-See-Um Mesh — Black  (26 images)
  -- =========================================================================
  files := ARRAY[
    'a1-no-see-um-mesh-black.jpg','a2-no-see-um-mesh-black.jpg','a3-no-see-um-mesh-black.jpg',
    'd1-no-see-um-mesh-black.jpg','d2-no-see-um-mesh-black.jpg',
    'm1-no-see-um-mesh-black.jpg','m2-no-see-um-mesh-black.jpg','m3-no-see-um-mesh-black.jpg',
    'm4-no-see-um-mesh-black.jpg','m5-no-see-um-mesh-black.jpg','m6-no-see-um-mesh-black.jpg',
    'm7-no-see-um-mesh-black.jpg','m8-no-see-um-mesh-black.jpg','m9-no-see-um-mesh-black.jpg',
    'm10-no-see-um-mesh-black.jpg','m11-no-see-um-mesh-black.jpg','m12-no-see-um-mesh-black.jpg',
    'm13-no-see-um-mesh-black.jpg','m14-no-see-um-mesh-black.jpg','m15-no-see-um-mesh-black.jpg',
    'm16-no-see-um-mesh-black.jpg','m17-no-see-um-mesh-black.jpg','m18-no-see-um-mesh-black.jpg',
    'm19-no-see-um-mesh-black.jpg','m20-no-see-um-mesh-black.jpg','m21-no-see-um-mesh-black.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/no-see-um-mesh-black/' || f, 'No-See-Um Mesh - Black', 'raw_mesh', 'other', 'no_see_um', 'black', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- No-See-Um Mesh — White  (5 images)
  -- =========================================================================
  files := ARRAY[
    'a1-no-see-um-mesh-white.jpg','a2-no-see-um-mesh-white.jpg',
    'm1-no-see-um-mesh-white.jpg','m2-no-see-um-mesh-white.jpg','m3-no-see-um-mesh-white.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/no-see-um-mesh-white/' || f, 'No-See-Um Mesh - White', 'raw_mesh', 'other', 'no_see_um', 'white', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- Shade Mesh — Black  (13 images)
  -- =========================================================================
  files := ARRAY[
    'a1-shade-mesh-black.jpg','a2-shade-mesh-black.jpg','a3-shade-mesh-black.jpg',
    'm1-shade-mesh-black.jpg','m2-shade-mesh-black.jpg','m3-shade-mesh-black.jpg',
    'm4-shade-mesh-black.jpg','m5-shade-mesh-black.jpg','m6-shade-mesh-black.jpg',
    'm7--shade-roof-panel--shade-mesh-black.jpg',
    'm8-shade-mesh-black.jpg','m9-shade-mesh-black.jpg','m10-shade-mesh-black.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/shade-mesh-black/' || f, 'Shade Mesh - Black', 'raw_mesh', 'other', 'shade', 'black', i, i = 1);
    i := i + 1;
  END LOOP;

  -- =========================================================================
  -- Shade Mesh — White  (4 images)
  -- =========================================================================
  files := ARRAY[
    'm1-shade-mesh-white.jpg','m2-shade-mesh-white.jpg',
    'm3-shade-mesh-white.jpg','m4-shade-mesh-white.jpg'
  ];
  i := 1;
  FOREACH f IN ARRAY files LOOP
    INSERT INTO gallery_images (image_url, title, product_type, project_type, mesh_type, color, sort_order, is_featured)
    VALUES (cdn || '/shade-mesh-white/' || f, 'Shade Mesh - White', 'raw_mesh', 'other', 'shade', 'white', i, i = 1);
    i := i + 1;
  END LOOP;

  RAISE NOTICE 'Seeded 122 raw mesh gallery images across 7 mesh+color groups';
END $$;

-- Add indexes for mesh gallery lookups
CREATE INDEX IF NOT EXISTS idx_gallery_images_mesh_type ON gallery_images USING btree (mesh_type);
CREATE INDEX IF NOT EXISTS idx_gallery_images_color ON gallery_images USING btree (color);
CREATE INDEX IF NOT EXISTS idx_gallery_images_mesh_color ON gallery_images USING btree (mesh_type, color, sort_order);
