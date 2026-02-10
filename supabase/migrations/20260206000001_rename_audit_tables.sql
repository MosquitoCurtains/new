-- =============================================================================
-- Rename audit tables to audit_* prefix for easy finding in Supabase
--
-- seo_audits          -> audit_seo
-- ai_readiness_audits -> audit_ai_readiness
-- performance_audits  -> audit_performance
-- audit_history stays as-is (already prefixed)
-- =============================================================================

-- 1. Drop dependent views first (they reference the old table names)
DROP VIEW IF EXISTS public.page_audit_dashboard CASCADE;
DROP VIEW IF EXISTS public.pages_needing_attention CASCADE;

-- 2. Drop the function that uses seo_audits%ROWTYPE
DROP FUNCTION IF EXISTS public.calculate_seo_score(uuid) CASCADE;

-- 3. Drop old RLS policies (they're bound to the old table names)
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.seo_audits;
DROP POLICY IF EXISTS "Service role full access" ON public.seo_audits;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.ai_readiness_audits;
DROP POLICY IF EXISTS "Service role full access" ON public.ai_readiness_audits;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.performance_audits;
DROP POLICY IF EXISTS "Service role full access" ON public.performance_audits;

-- 4. Rename the tables
ALTER TABLE public.seo_audits RENAME TO audit_seo;
ALTER TABLE public.ai_readiness_audits RENAME TO audit_ai_readiness;
ALTER TABLE public.performance_audits RENAME TO audit_performance;

-- 5. Rename constraints to match new table names
ALTER TABLE public.audit_seo RENAME CONSTRAINT seo_audits_seo_score_check TO audit_seo_score_check;
ALTER TABLE public.audit_seo RENAME CONSTRAINT seo_audits_pkey TO audit_seo_pkey;
ALTER TABLE public.audit_seo RENAME CONSTRAINT seo_audits_page_id_key TO audit_seo_page_id_key;

ALTER TABLE public.audit_ai_readiness RENAME CONSTRAINT ai_readiness_audits_ai_score_check TO audit_ai_readiness_score_check;
ALTER TABLE public.audit_ai_readiness RENAME CONSTRAINT ai_readiness_audits_pkey TO audit_ai_readiness_pkey;
ALTER TABLE public.audit_ai_readiness RENAME CONSTRAINT ai_readiness_audits_page_id_key TO audit_ai_readiness_page_id_key;

ALTER TABLE public.audit_performance RENAME CONSTRAINT performance_audits_performance_score_check TO audit_performance_score_check;
ALTER TABLE public.audit_performance RENAME CONSTRAINT performance_audits_pkey TO audit_performance_pkey;

-- 6. Re-create RLS policies with new table names
CREATE POLICY "Allow read for authenticated users" ON public.audit_seo
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role full access" ON public.audit_seo
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow read for authenticated users" ON public.audit_ai_readiness
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role full access" ON public.audit_ai_readiness
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow read for authenticated users" ON public.audit_performance
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role full access" ON public.audit_performance
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. Re-create the calculate_seo_score function with new table name
CREATE OR REPLACE FUNCTION public.calculate_seo_score(audit_id uuid) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  score INTEGER := 0;
  audit_row audit_seo%ROWTYPE;
BEGIN
  SELECT * INTO audit_row FROM audit_seo WHERE id = audit_id;

  -- Meta title (15 points)
  IF audit_row.has_meta_title AND audit_row.meta_title_ok THEN score := score + 15;
  ELSIF audit_row.has_meta_title THEN score := score + 8;
  END IF;

  -- Meta description (15 points)
  IF audit_row.has_meta_description AND audit_row.meta_description_ok THEN score := score + 15;
  ELSIF audit_row.has_meta_description THEN score := score + 8;
  END IF;

  -- Canonical (5 points)
  IF audit_row.has_canonical THEN score := score + 5; END IF;

  -- OG tags (10 points)
  IF audit_row.has_og_title AND audit_row.has_og_description AND audit_row.has_og_image THEN score := score + 10;
  ELSIF audit_row.has_og_title OR audit_row.has_og_description THEN score := score + 5;
  END IF;

  -- Twitter card (5 points)
  IF audit_row.has_twitter_card THEN score := score + 5; END IF;

  -- H1 (10 points)
  IF audit_row.has_h1 AND audit_row.h1_count = 1 THEN score := score + 10;
  ELSIF audit_row.has_h1 THEN score := score + 5;
  END IF;

  -- Heading hierarchy (5 points)
  IF audit_row.heading_hierarchy_ok THEN score := score + 5; END IF;

  -- Images (10 points)
  IF audit_row.images_have_alt THEN score := score + 10;
  ELSIF audit_row.images_missing_alt <= 2 THEN score := score + 7;
  ELSIF audit_row.images_missing_alt > 0 THEN score := score + 3;
  END IF;

  -- Internal links (5 points)
  IF audit_row.internal_links_count >= 3 THEN score := score + 5;
  ELSIF audit_row.internal_links_count >= 1 THEN score := score + 3;
  END IF;

  -- Sitemap (5 points)
  IF audit_row.has_sitemap_entry THEN score := score + 5; END IF;

  -- Viewport (5 points)
  IF audit_row.viewport_configured THEN score := score + 5; END IF;

  RETURN score;
END;
$$;

-- 8. Re-create the page_audit_dashboard view with new table names
CREATE VIEW public.page_audit_dashboard AS
 SELECT sp.id,
    sp.slug,
    sp.title,
    sp.page_type,
    sp.migration_status,
    sp.migration_priority,
    sp.migration_batch,
    sp.approval_status,
    sp.monthly_pageviews,
    sp.organic_sessions,
    sp.review_status,
    sp.review_notes,
    sp.revision_items,
    sp.reviewed_at,
    sa.seo_score,
    sa.seo_rating,
    sa.has_meta_title,
    sa.has_meta_description,
    sa.has_h1,
    ar.ai_score,
    ar.ai_rating,
    ar.has_structured_data,
    ar.uses_semantic_html,
    pa.performance_score,
    pa.performance_rating,
    pa.lcp_ms,
    pa.cls_score,
    round(((COALESCE(sa.seo_score, 0)::numeric * 0.35) + (COALESCE(ar.ai_score, 0)::numeric * 0.25) + (COALESCE(pa.performance_score, 0)::numeric * 0.40))) AS overall_score,
    sp.updated_at,
    sp.last_audited_at
   FROM public.site_pages sp
     LEFT JOIN public.audit_seo sa ON sa.page_id = sp.id
     LEFT JOIN public.audit_ai_readiness ar ON ar.page_id = sp.id
     LEFT JOIN LATERAL (
       SELECT * FROM public.audit_performance
        WHERE page_id = sp.id
        ORDER BY audited_at DESC
        LIMIT 1
     ) pa ON true;

-- 9. Re-create the pages_needing_attention view with new table names
CREATE VIEW public.pages_needing_attention AS
 SELECT sp.slug,
    sp.title,
    sp.page_type,
    sa.seo_score,
    ar.ai_score,
    pa.performance_score,
    CASE
      WHEN sa.seo_score < 50 THEN 'Poor SEO'
      WHEN ar.ai_score < 50 THEN 'Poor AI Readiness'
      WHEN pa.performance_score < 50 THEN 'Poor Performance'
      WHEN sp.approval_status = 'changes_requested' THEN 'Changes Requested'
      ELSE 'Needs Review'
    END AS attention_reason
   FROM public.site_pages sp
     LEFT JOIN public.audit_seo sa ON sa.page_id = sp.id
     LEFT JOIN public.audit_ai_readiness ar ON ar.page_id = sp.id
     LEFT JOIN LATERAL (
       SELECT * FROM public.audit_performance
        WHERE page_id = sp.id
        ORDER BY audited_at DESC
        LIMIT 1
     ) pa ON true
  WHERE sp.migration_status = 'live'
    AND (sa.seo_score < 50 OR ar.ai_score < 50 OR pa.performance_score < 50
         OR sp.approval_status = 'changes_requested')
  ORDER BY LEAST(COALESCE(sa.seo_score, 100), COALESCE(ar.ai_score, 100), COALESCE(pa.performance_score, 100));

-- 10. Update table comments
COMMENT ON TABLE public.audit_seo IS 'SEO audit results for each page';
COMMENT ON TABLE public.audit_ai_readiness IS 'AI/LLM readiness audit results';
COMMENT ON TABLE public.audit_performance IS 'Core Web Vitals and performance metrics';
