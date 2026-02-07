--
-- PostgreSQL database dump
--

\restrict 4pF0wdWdtG8mKlJau0wuzboNsQIYIJer0Zgh1gfNAhROat36rV0vVtKNhhXHEBT

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: approval_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.approval_status AS ENUM (
    'draft',
    'pending_review',
    'changes_requested',
    'approved',
    'published'
);


--
-- Name: audit_rating; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.audit_rating AS ENUM (
    'excellent',
    'good',
    'needs_work',
    'poor',
    'not_audited'
);


--
-- Name: issue_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.issue_category AS ENUM (
    'assets',
    'content',
    'seo',
    'performance',
    'accessibility',
    'design',
    'functionality',
    'mobile',
    'ai_readiness',
    'legal',
    'other'
);


--
-- Name: issue_severity; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.issue_severity AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'info'
);


--
-- Name: issue_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.issue_status AS ENUM (
    'open',
    'acknowledged',
    'in_progress',
    'blocked',
    'resolved',
    'wont_fix',
    'duplicate'
);


--
-- Name: page_migration_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.page_migration_status AS ENUM (
    'not_started',
    'content_extracted',
    'in_progress',
    'review',
    'approved',
    'live',
    'redirect_only',
    'deprecated'
);


--
-- Name: page_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.page_type AS ENUM (
    'homepage',
    'product_landing',
    'seo_landing',
    'category',
    'informational',
    'legal',
    'support',
    'marketing',
    'ecommerce',
    'admin',
    'utility'
);


--
-- Name: simple_review_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.simple_review_status AS ENUM (
    'pending',
    'complete',
    'needs_revision'
);


--
-- Name: add_issue_from_template(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_issue_from_template(p_page_id uuid, p_template_shortcode text, p_notes text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_template issue_templates%ROWTYPE;
  v_issue_id UUID;
BEGIN
  SELECT * INTO v_template FROM issue_templates WHERE shortcode = p_template_shortcode;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found: %', p_template_shortcode;
  END IF;
  
  INSERT INTO page_issues (page_id, category, severity, title, description, action_required, notes)
  VALUES (p_page_id, v_template.category, v_template.severity, v_template.title, v_template.description, v_template.action_required, p_notes)
  RETURNING id INTO v_issue_id;
  
  RETURN v_issue_id;
END;
$$;


--
-- Name: FUNCTION add_issue_from_template(p_page_id uuid, p_template_shortcode text, p_notes text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.add_issue_from_template(p_page_id uuid, p_template_shortcode text, p_notes text) IS 'Quickly create an issue from a template shortcode';


--
-- Name: audit_trigger_function(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_trigger_function() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  changed_fields TEXT[];
  old_json JSONB;
  new_json JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_json := to_jsonb(OLD);
    INSERT INTO audit_log (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_json, auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
    -- Find changed fields
    SELECT array_agg(key) INTO changed_fields
    FROM jsonb_each(old_json) o
    FULL OUTER JOIN jsonb_each(new_json) n USING (key)
    WHERE o.value IS DISTINCT FROM n.value;
    
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_fields, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, old_json, new_json, changed_fields, auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_json := to_jsonb(NEW);
    INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, new_json, auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;


--
-- Name: calculate_seo_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_seo_score(audit_id uuid) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  score INTEGER := 0;
  audit_row seo_audits%ROWTYPE;
BEGIN
  SELECT * INTO audit_row FROM seo_audits WHERE id = audit_id;
  
  -- Meta title (15 points)
  IF audit_row.has_meta_title AND audit_row.meta_title_ok THEN
    score := score + 15;
  ELSIF audit_row.has_meta_title THEN
    score := score + 8;
  END IF;
  
  -- Meta description (15 points)
  IF audit_row.has_meta_description AND audit_row.meta_description_ok THEN
    score := score + 15;
  ELSIF audit_row.has_meta_description THEN
    score := score + 8;
  END IF;
  
  -- H1 (10 points)
  IF audit_row.has_h1 AND audit_row.h1_count = 1 THEN
    score := score + 10;
  ELSIF audit_row.has_h1 THEN
    score := score + 5;
  END IF;
  
  -- Heading hierarchy (10 points)
  IF audit_row.heading_hierarchy_ok THEN
    score := score + 10;
  END IF;
  
  -- Open Graph (10 points)
  IF audit_row.has_og_title AND audit_row.has_og_description AND audit_row.has_og_image THEN
    score := score + 10;
  ELSIF audit_row.has_og_title OR audit_row.has_og_description THEN
    score := score + 5;
  END IF;
  
  -- Images with alt (10 points)
  IF audit_row.images_have_alt THEN
    score := score + 10;
  ELSIF audit_row.images_missing_alt = 0 THEN
    score := score + 10;
  ELSIF audit_row.images_missing_alt < 3 THEN
    score := score + 5;
  END IF;
  
  -- Internal links (10 points)
  IF audit_row.internal_links_count >= 3 THEN
    score := score + 10;
  ELSIF audit_row.internal_links_count >= 1 THEN
    score := score + 5;
  END IF;
  
  -- No broken links (10 points)
  IF audit_row.broken_links_count = 0 THEN
    score := score + 10;
  END IF;
  
  -- Mobile friendly (5 points)
  IF audit_row.is_mobile_friendly THEN
    score := score + 5;
  END IF;
  
  -- Canonical URL (5 points)
  IF audit_row.has_canonical THEN
    score := score + 5;
  END IF;
  
  RETURN score;
END;
$$;


--
-- Name: generate_order_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_order_number() RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
  year_part TEXT;
  seq_part TEXT;
  new_number TEXT;
BEGIN
  year_part := to_char(NOW(), 'YY');
  
  -- Get next sequence number for this year
  SELECT LPAD((COALESCE(MAX(
    CASE 
      WHEN order_number ~ ('^MC' || year_part || '-[0-9]+$')
      THEN SUBSTRING(order_number FROM 6)::INTEGER
      ELSE 0
    END
  ), 0) + 1)::TEXT, 5, '0')
  INTO seq_part
  FROM orders
  WHERE order_number LIKE 'MC' || year_part || '-%';
  
  new_number := 'MC' || year_part || '-' || seq_part;
  RETURN new_number;
END;
$_$;


--
-- Name: get_page_health(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_page_health(p_page_id uuid) RETURNS TABLE(total_issues integer, critical_count integer, high_count integer, medium_count integer, low_count integer, open_count integer, resolved_count integer, oldest_open_issue timestamp with time zone, last_updated timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_issues,
    COUNT(*) FILTER (WHERE severity = 'critical')::INTEGER as critical_count,
    COUNT(*) FILTER (WHERE severity = 'high')::INTEGER as high_count,
    COUNT(*) FILTER (WHERE severity = 'medium')::INTEGER as medium_count,
    COUNT(*) FILTER (WHERE severity = 'low')::INTEGER as low_count,
    COUNT(*) FILTER (WHERE status IN ('open', 'acknowledged', 'in_progress'))::INTEGER as open_count,
    COUNT(*) FILTER (WHERE status = 'resolved')::INTEGER as resolved_count,
    MIN(created_at) FILTER (WHERE status IN ('open', 'acknowledged', 'in_progress')) as oldest_open_issue,
    MAX(updated_at) as last_updated
  FROM page_issues
  WHERE page_id = p_page_id;
END;
$$;


--
-- Name: FUNCTION get_page_health(p_page_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_page_health(p_page_id uuid) IS 'Returns issue counts and health metrics for a page';


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: log_pricing_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_pricing_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.value IS DISTINCT FROM NEW.value THEN
    INSERT INTO product_pricing_history (pricing_id, old_value, new_value)
    VALUES (NEW.id, OLD.value, NEW.value);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: log_shipping_rate_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_shipping_rate_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.flat_cost IS DISTINCT FROM NEW.flat_cost THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('shipping_rates', NEW.id, 'flat_cost', OLD.flat_cost::TEXT, NEW.flat_cost::TEXT);
  END IF;
  IF OLD.fee_percent IS DISTINCT FROM NEW.fee_percent THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('shipping_rates', NEW.id, 'fee_percent', OLD.fee_percent::TEXT, NEW.fee_percent::TEXT);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: log_tax_rate_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_tax_rate_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.rate IS DISTINCT FROM NEW.rate THEN
    INSERT INTO shipping_tax_history (table_name, record_id, field_name, old_value, new_value)
    VALUES ('tax_rates', NEW.id, 'rate', OLD.rate::TEXT, NEW.rate::TEXT);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_customer_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_customer_metrics() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers SET
      total_orders = (
        SELECT COUNT(*) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      total_spent = (
        SELECT COALESCE(SUM(total), 0) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      average_order_value = (
        SELECT COALESCE(AVG(total), 0) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      first_order_at = (
        SELECT MIN(created_at) FROM orders WHERE customer_id = NEW.customer_id
      ),
      last_order_at = (
        SELECT MAX(created_at) FROM orders WHERE customer_id = NEW.customer_id
      ),
      updated_at = NOW()
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_customer_on_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_customer_on_event() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Only proceed if we have a customer_id
  IF NEW.customer_id IS NOT NULL THEN
    CASE NEW.event_type
      WHEN 'quote_submitted' THEN
        UPDATE public.customers
        SET 
          customer_status = CASE WHEN customer_status = 'lead' THEN 'quoted' ELSE customer_status END,
          first_quote_at = COALESCE(first_quote_at, NEW.created_at),
          updated_at = NOW()
        WHERE id = NEW.customer_id;
        
      WHEN 'purchase_completed' THEN
        UPDATE public.customers
        SET 
          customer_status = CASE 
            WHEN customer_status IN ('lead', 'quoted') THEN 'customer' 
            WHEN customer_status = 'customer' THEN 'repeat'
            ELSE customer_status 
          END,
          first_purchase_at = COALESCE(first_purchase_at, NEW.created_at),
          updated_at = NOW()
        WHERE id = NEW.customer_id;
        
      ELSE
        -- No status change for other events
        NULL;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_notification_settings_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_notification_settings_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_page_issues_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_page_issues_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Auto-set resolved_at when status changes to resolved
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_page_reviews_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_page_reviews_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Track when status changes
  IF NEW.status != OLD.status THEN
    NEW.reviewed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_product_pricing_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_product_pricing_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_shipping_rates_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_shipping_rates_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_shipping_zones_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_shipping_zones_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_site_pages_review(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_site_pages_review() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.review_status IS DISTINCT FROM OLD.review_status THEN
    NEW.reviewed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_site_pages_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_site_pages_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_tax_rates_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_tax_rates_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: update_visitor_on_session(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_visitor_on_session() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.visitors
  SET 
    last_seen_at = NEW.started_at,
    last_landing_page = NEW.landing_page,
    last_utm_source = NEW.utm_source,
    last_utm_medium = NEW.utm_medium,
    last_utm_campaign = NEW.utm_campaign,
    session_count = session_count + 1,
    updated_at = NOW()
  WHERE id = NEW.visitor_id;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_visitor_pageview_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_visitor_pageview_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.visitors
  SET 
    total_pageviews = total_pageviews + 1,
    updated_at = NOW()
  WHERE id = NEW.visitor_id;
  
  -- Also update session pageview count
  UPDATE public.sessions
  SET 
    pageview_count = pageview_count + 1,
    last_activity_at = NEW.viewed_at,
    updated_at = NOW()
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_readiness_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_readiness_audits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    ai_score integer,
    ai_rating public.audit_rating DEFAULT 'not_audited'::public.audit_rating NOT NULL,
    has_structured_data boolean DEFAULT false,
    structured_data_types text[],
    structured_data_valid boolean,
    structured_data_errors jsonb DEFAULT '[]'::jsonb,
    has_clear_headings boolean DEFAULT false,
    has_faq_section boolean DEFAULT false,
    has_how_to_content boolean DEFAULT false,
    content_is_factual boolean,
    has_specific_details boolean,
    uses_semantic_html boolean DEFAULT false,
    has_main_element boolean DEFAULT false,
    has_article_element boolean DEFAULT false,
    has_nav_element boolean DEFAULT false,
    has_header_footer boolean DEFAULT false,
    has_aria_labels boolean DEFAULT false,
    has_skip_links boolean DEFAULT false,
    form_labels_ok boolean,
    content_in_html boolean DEFAULT true,
    avoids_infinite_scroll boolean DEFAULT true,
    has_clear_content_boundaries boolean,
    has_ai_txt boolean DEFAULT false,
    allows_ai_training boolean DEFAULT true,
    has_author_info boolean DEFAULT false,
    has_publish_date boolean DEFAULT false,
    has_last_updated boolean DEFAULT false,
    has_sources_citations boolean DEFAULT false,
    issues jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    audited_at timestamp with time zone DEFAULT now() NOT NULL,
    audited_by uuid,
    CONSTRAINT ai_readiness_audits_ai_score_check CHECK (((ai_score >= 0) AND (ai_score <= 100)))
);


--
-- Name: TABLE ai_readiness_audits; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_readiness_audits IS 'AI/LLM readiness audit results';


--
-- Name: analytics_sync_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_sync_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sync_date date NOT NULL,
    sync_type text DEFAULT 'daily'::text,
    records_synced integer DEFAULT 0,
    pages_synced integer DEFAULT 0,
    status text DEFAULT 'success'::text,
    error_message text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    duration_ms integer,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE analytics_sync_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.analytics_sync_log IS 'Log of GA4 sync operations for monitoring.';


--
-- Name: legacy_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    imported_at timestamp with time zone DEFAULT now() NOT NULL,
    woo_order_id integer NOT NULL,
    woo_order_key text,
    order_number text NOT NULL,
    order_date timestamp with time zone NOT NULL,
    status text,
    email text NOT NULL,
    billing_first_name text,
    billing_last_name text,
    billing_phone text,
    billing_address_1 text,
    billing_city text,
    billing_state text,
    billing_zip text,
    shipping_first_name text,
    shipping_last_name text,
    shipping_address_1 text,
    shipping_city text,
    shipping_state text,
    shipping_zip text,
    subtotal numeric(10,2),
    tax numeric(10,2),
    shipping numeric(10,2),
    discount numeric(10,2),
    total numeric(10,2),
    payment_method text,
    payment_method_title text,
    transaction_id text,
    salesperson_username text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    utm_content text,
    utm_id text,
    utm_source_platform text,
    utm_creative_format text,
    utm_marketing_tactic text,
    source_type text,
    referrer text,
    device_type text,
    user_agent text,
    session_entry text,
    session_pages integer,
    session_count integer,
    session_start_time timestamp with time zone,
    diagram_attachment_id integer,
    diagram_url text,
    raw_line_items text,
    raw_meta text,
    raw_csv_row jsonb,
    new_order_id uuid,
    customer_id uuid
);


--
-- Name: attribution_analysis; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.attribution_analysis AS
 SELECT COALESCE(utm_source, '(direct)'::text) AS source,
    COALESCE(utm_medium, '(none)'::text) AS medium,
    COALESCE(device_type, 'Unknown'::text) AS device,
    count(*) AS orders,
    sum(total) AS revenue,
    avg(total) AS avg_order_value,
    count(DISTINCT email) AS unique_customers
   FROM public.legacy_orders
  GROUP BY COALESCE(utm_source, '(direct)'::text), COALESCE(utm_medium, '(none)'::text), COALESCE(device_type, 'Unknown'::text)
  ORDER BY (sum(total)) DESC;


--
-- Name: VIEW attribution_analysis; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.attribution_analysis IS 'Marketing attribution analysis from order data';


--
-- Name: audit_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    audit_type text NOT NULL,
    seo_score integer,
    ai_score integer,
    performance_score integer,
    overall_score integer,
    issues_found integer DEFAULT 0,
    issues_fixed integer DEFAULT 0,
    audit_data jsonb,
    audited_at timestamp with time zone DEFAULT now() NOT NULL,
    audited_by uuid
);


--
-- Name: TABLE audit_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.audit_history IS 'Historical audit snapshots for trend analysis';


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    action text NOT NULL,
    user_id uuid,
    user_email text,
    old_data jsonb,
    new_data jsonb,
    changed_fields text[],
    ip_address text,
    user_agent text,
    CONSTRAINT audit_log_action_check CHECK ((action = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: page_audit_sequence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_audit_sequence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    sequence_name text NOT NULL,
    checks jsonb DEFAULT '{"seo_audit": {"notes": null, "status": "pending", "completed_at": null}, "mobile_test": {"notes": null, "status": "pending", "completed_at": null}, "ai_readiness": {"notes": null, "status": "pending", "completed_at": null}, "final_review": {"notes": null, "status": "pending", "completed_at": null}, "content_review": {"notes": null, "status": "pending", "completed_at": null}, "assets_complete": {"notes": null, "status": "pending", "completed_at": null}, "performance_check": {"notes": null, "status": "pending", "completed_at": null}}'::jsonb NOT NULL,
    is_complete boolean DEFAULT false,
    completed_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE page_audit_sequence; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_audit_sequence IS 'Tracks audit checklist progress per page';


--
-- Name: site_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    wordpress_url text,
    title text NOT NULL,
    page_type public.page_type DEFAULT 'informational'::public.page_type NOT NULL,
    migration_status public.page_migration_status DEFAULT 'not_started'::public.page_migration_status NOT NULL,
    migration_priority integer DEFAULT 50,
    migration_batch text,
    migration_notes text,
    has_content_extraction boolean DEFAULT false,
    content_extraction_path text,
    word_count integer,
    has_images boolean DEFAULT false,
    image_count integer DEFAULT 0,
    has_video boolean DEFAULT false,
    video_count integer DEFAULT 0,
    approval_status public.approval_status DEFAULT 'draft'::public.approval_status NOT NULL,
    approved_by uuid,
    approved_at timestamp with time zone,
    review_notes text,
    monthly_pageviews integer DEFAULT 0,
    monthly_sessions integer DEFAULT 0,
    organic_sessions integer DEFAULT 0,
    bounce_rate numeric(5,2),
    avg_time_on_page integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_audited_at timestamp with time zone,
    went_live_at timestamp with time zone,
    review_status public.simple_review_status DEFAULT 'pending'::public.simple_review_status,
    revision_items text,
    reviewed_at timestamp with time zone,
    reviewed_by text
);


--
-- Name: TABLE site_pages; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.site_pages IS 'Master inventory of all site pages with migration and audit status';


--
-- Name: audit_sequence_progress; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.audit_sequence_progress AS
 SELECT sp.slug,
    sp.title,
    pas.sequence_name,
    pas.is_complete,
    ( SELECT count(*) AS count
           FROM jsonb_object_keys(pas.checks) jsonb_object_keys(jsonb_object_keys)) AS total_checks,
    ( SELECT count(*) AS count
           FROM jsonb_each(pas.checks) c(key, value)
          WHERE ((c.value ->> 'status'::text) = 'complete'::text)) AS completed_checks,
    pas.started_at,
    pas.updated_at
   FROM (public.page_audit_sequence pas
     JOIN public.site_pages sp ON ((sp.id = pas.page_id)))
  ORDER BY pas.is_complete, pas.updated_at DESC;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    auth_user_id uuid,
    total_orders integer DEFAULT 0,
    total_spent numeric(12,2) DEFAULT 0,
    average_order_value numeric(10,2) DEFAULT 0,
    first_order_at timestamp with time zone,
    last_order_at timestamp with time zone,
    rfm_recency_score integer,
    rfm_frequency_score integer,
    rfm_monetary_score integer,
    ltv_tier text,
    preferred_products text[],
    acquisition_source text,
    assigned_salesperson text,
    city text,
    state text,
    zip text,
    notes text,
    first_utm_source text,
    first_utm_medium text,
    first_utm_campaign text,
    first_utm_term text,
    first_utm_content text,
    first_landing_page text,
    first_referrer text,
    first_seen_at timestamp with time zone,
    email_captured_at timestamp with time zone,
    first_quote_at timestamp with time zone,
    first_purchase_at timestamp with time zone,
    customer_status text DEFAULT 'lead'::text,
    CONSTRAINT customers_ltv_tier_check CHECK ((ltv_tier = ANY (ARRAY['vip'::text, 'high'::text, 'medium'::text, 'low'::text, 'new'::text]))),
    CONSTRAINT customers_rfm_frequency_score_check CHECK (((rfm_frequency_score >= 1) AND (rfm_frequency_score <= 5))),
    CONSTRAINT customers_rfm_monetary_score_check CHECK (((rfm_monetary_score >= 1) AND (rfm_monetary_score <= 5))),
    CONSTRAINT customers_rfm_recency_score_check CHECK (((rfm_recency_score >= 1) AND (rfm_recency_score <= 5))),
    CONSTRAINT customers_status_check CHECK ((customer_status = ANY (ARRAY['lead'::text, 'quoted'::text, 'customer'::text, 'repeat'::text, 'churned'::text])))
);


--
-- Name: campaign_attribution; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.campaign_attribution AS
 SELECT COALESCE(first_utm_source, '(direct)'::text) AS source,
    COALESCE(first_utm_campaign, '(none)'::text) AS campaign,
    count(DISTINCT id) AS total_customers,
    count(DISTINCT
        CASE
            WHEN (customer_status = 'lead'::text) THEN id
            ELSE NULL::uuid
        END) AS leads,
    count(DISTINCT
        CASE
            WHEN (customer_status = 'quoted'::text) THEN id
            ELSE NULL::uuid
        END) AS quoted,
    count(DISTINCT
        CASE
            WHEN (customer_status = ANY (ARRAY['customer'::text, 'repeat'::text])) THEN id
            ELSE NULL::uuid
        END) AS purchasers,
    sum(total_spent) AS total_revenue,
    avg(total_spent) FILTER (WHERE (total_spent > (0)::numeric)) AS avg_customer_value,
    avg(average_order_value) FILTER (WHERE (average_order_value > (0)::numeric)) AS avg_order_value,
    round((((count(DISTINCT
        CASE
            WHEN (customer_status = ANY (ARRAY['customer'::text, 'repeat'::text])) THEN id
            ELSE NULL::uuid
        END))::numeric / (NULLIF(count(DISTINCT id), 0))::numeric) * (100)::numeric), 2) AS conversion_rate_pct
   FROM public.customers
  GROUP BY COALESCE(first_utm_source, '(direct)'::text), COALESCE(first_utm_campaign, '(none)'::text)
  ORDER BY (sum(total_spent)) DESC NULLS LAST;


--
-- Name: VIEW campaign_attribution; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.campaign_attribution IS 'Campaign performance aggregated by source and campaign.';


--
-- Name: google_ads_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_ads_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id text NOT NULL,
    campaign_name text NOT NULL,
    campaign_status text,
    campaign_type text,
    date date NOT NULL,
    cost_micros bigint DEFAULT 0,
    impressions bigint DEFAULT 0,
    clicks bigint DEFAULT 0,
    conversions numeric(10,2) DEFAULT 0,
    conversion_value numeric(10,2) DEFAULT 0,
    ctr numeric(5,4) DEFAULT 0,
    avg_cpc_micros bigint DEFAULT 0,
    synced_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE google_ads_campaigns; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.google_ads_campaigns IS 'Daily Google Ads campaign performance metrics synced via API';


--
-- Name: campaign_performance; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.campaign_performance AS
 SELECT campaign_id,
    campaign_name,
    campaign_type,
    min(date) AS first_date,
    max(date) AS last_date,
    (sum(cost_micros) / 1000000.0) AS total_spend,
    sum(clicks) AS total_clicks,
    sum(impressions) AS total_impressions,
    sum(conversions) AS total_conversions,
    sum(conversion_value) AS total_conversion_value,
        CASE
            WHEN (sum(impressions) > (0)::numeric) THEN round(((sum(clicks) / sum(impressions)) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS ctr_percent,
        CASE
            WHEN (sum(clicks) > (0)::numeric) THEN round(((sum(cost_micros) / 1000000.0) / sum(clicks)), 2)
            ELSE (0)::numeric
        END AS avg_cpc
   FROM public.google_ads_campaigns
  GROUP BY campaign_id, campaign_name, campaign_type
  ORDER BY (sum(cost_micros) / 1000000.0) DESC;


--
-- Name: VIEW campaign_performance; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.campaign_performance IS 'Campaign-level aggregate performance metrics';


--
-- Name: campaign_roas; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.campaign_roas AS
 WITH campaign_spend AS (
         SELECT google_ads_campaigns.date,
            (sum(google_ads_campaigns.cost_micros) / 1000000.0) AS total_spend,
            sum(google_ads_campaigns.clicks) AS total_clicks,
            sum(google_ads_campaigns.impressions) AS total_impressions,
            sum(google_ads_campaigns.conversions) AS total_conversions
           FROM public.google_ads_campaigns
          GROUP BY google_ads_campaigns.date
        ), order_revenue AS (
         SELECT date(legacy_orders.order_date) AS date,
            sum(legacy_orders.total) AS total_revenue,
            count(*) AS order_count
           FROM public.legacy_orders
          WHERE (legacy_orders.order_date IS NOT NULL)
          GROUP BY (date(legacy_orders.order_date))
        )
 SELECT COALESCE(cs.date, orv.date) AS date,
    cs.total_spend,
    cs.total_clicks,
    cs.total_impressions,
    cs.total_conversions,
    orv.total_revenue,
    orv.order_count,
        CASE
            WHEN (cs.total_spend > (0)::numeric) THEN round((orv.total_revenue / cs.total_spend), 2)
            ELSE NULL::numeric
        END AS roas,
        CASE
            WHEN (orv.order_count > 0) THEN round((cs.total_spend / (orv.order_count)::numeric), 2)
            ELSE NULL::numeric
        END AS cost_per_order
   FROM (campaign_spend cs
     FULL JOIN order_revenue orv ON ((cs.date = orv.date)))
  ORDER BY COALESCE(cs.date, orv.date) DESC;


--
-- Name: VIEW campaign_roas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.campaign_roas IS 'Join campaign spend with order revenue for ROAS calculation';


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id uuid,
    session_id text,
    email text,
    status text DEFAULT 'active'::text NOT NULL,
    subtotal numeric(10,2) DEFAULT 0,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    total numeric(10,2) DEFAULT 0,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    referrer text,
    project_id uuid,
    CONSTRAINT carts_status_check CHECK ((status = ANY (ARRAY['active'::text, 'checkout'::text, 'abandoned'::text, 'converted'::text])))
);


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fingerprint text NOT NULL,
    first_landing_page text,
    first_referrer text,
    first_utm_source text,
    first_utm_medium text,
    first_utm_campaign text,
    first_utm_term text,
    first_utm_content text,
    last_landing_page text,
    last_utm_source text,
    last_utm_medium text,
    last_utm_campaign text,
    first_seen_at timestamp with time zone DEFAULT now(),
    last_seen_at timestamp with time zone DEFAULT now(),
    session_count integer DEFAULT 1,
    total_pageviews integer DEFAULT 0,
    customer_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE visitors; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.visitors IS 'Anonymous visitor tracking with first-touch attribution. Cookie-based identification until email capture.';


--
-- Name: customer_journey; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.customer_journey AS
 SELECT c.id AS customer_id,
    c.email,
    c.first_name,
    c.last_name,
    c.phone,
    c.customer_status,
    c.first_utm_source,
    c.first_utm_medium,
    c.first_utm_campaign,
    c.first_landing_page,
    c.first_referrer,
    c.first_seen_at,
    c.email_captured_at,
    c.first_quote_at,
    c.first_purchase_at,
    c.created_at AS customer_created_at,
    c.total_orders,
    c.total_spent,
    c.average_order_value,
    c.ltv_tier,
    v.session_count,
    v.total_pageviews,
    v.last_seen_at AS visitor_last_seen,
    EXTRACT(day FROM (c.email_captured_at - c.first_seen_at)) AS days_to_email,
    EXTRACT(day FROM (c.first_purchase_at - c.first_seen_at)) AS days_to_purchase,
    EXTRACT(day FROM (c.first_purchase_at - c.email_captured_at)) AS days_email_to_purchase
   FROM (public.customers c
     LEFT JOIN public.visitors v ON ((v.customer_id = c.id)));


--
-- Name: VIEW customer_journey; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.customer_journey IS 'Full customer journey with attribution, lifecycle stages, and metrics.';


--
-- Name: email_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    lead_id uuid,
    from_email text NOT NULL,
    to_email text NOT NULL,
    cc_emails text[],
    bcc_emails text[],
    subject text NOT NULL,
    body_text text,
    body_html text,
    direction text NOT NULL,
    status text DEFAULT 'sent'::text,
    ses_message_id text,
    imap_message_id text,
    imap_uid integer,
    is_reply boolean DEFAULT false,
    reply_to_message_id uuid,
    thread_id text,
    has_attachments boolean DEFAULT false,
    attachment_urls text[],
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    opened_at timestamp with time zone,
    CONSTRAINT email_messages_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
    CONSTRAINT email_messages_status_check CHECK ((status = ANY (ARRAY['sent'::text, 'delivered'::text, 'failed'::text, 'bounced'::text, 'opened'::text, 'received'::text])))
);


--
-- Name: funnel_metrics; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.funnel_metrics AS
 SELECT 'visitors'::text AS stage,
    1 AS stage_order,
    count(*) AS count,
    100.0 AS conversion_rate
   FROM public.visitors
  WHERE (visitors.first_seen_at >= (now() - '30 days'::interval))
UNION ALL
 SELECT 'email_captured'::text AS stage,
    2 AS stage_order,
    count(*) AS count,
    round((((count(*))::numeric / (NULLIF(( SELECT count(*) AS count
           FROM public.visitors
          WHERE (visitors.first_seen_at >= (now() - '30 days'::interval))), 0))::numeric) * (100)::numeric), 2) AS conversion_rate
   FROM public.visitors v
  WHERE ((v.customer_id IS NOT NULL) AND (v.first_seen_at >= (now() - '30 days'::interval)))
UNION ALL
 SELECT 'quoted'::text AS stage,
    3 AS stage_order,
    count(*) AS count,
    round((((count(*))::numeric / (NULLIF(( SELECT count(*) AS count
           FROM public.visitors
          WHERE (visitors.first_seen_at >= (now() - '30 days'::interval))), 0))::numeric) * (100)::numeric), 2) AS conversion_rate
   FROM public.customers c
  WHERE ((c.customer_status = ANY (ARRAY['quoted'::text, 'customer'::text, 'repeat'::text])) AND (c.created_at >= (now() - '30 days'::interval)))
UNION ALL
 SELECT 'purchased'::text AS stage,
    4 AS stage_order,
    count(*) AS count,
    round((((count(*))::numeric / (NULLIF(( SELECT count(*) AS count
           FROM public.visitors
          WHERE (visitors.first_seen_at >= (now() - '30 days'::interval))), 0))::numeric) * (100)::numeric), 2) AS conversion_rate
   FROM public.customers c
  WHERE ((c.customer_status = ANY (ARRAY['customer'::text, 'repeat'::text])) AND (c.first_purchase_at >= (now() - '30 days'::interval)))
  ORDER BY 2;


--
-- Name: VIEW funnel_metrics; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.funnel_metrics IS 'Conversion funnel metrics for last 30 days.';


--
-- Name: galleries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.galleries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    is_published boolean DEFAULT false,
    display_on_page text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: gallery_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    gallery_id uuid,
    image_id uuid,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    thumbnail_url text,
    title text,
    description text,
    product_type text NOT NULL,
    project_type text NOT NULL,
    mesh_type text,
    top_attachment text,
    color text,
    location text,
    customer_name text,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT gallery_images_color_check CHECK ((color = ANY (ARRAY['black'::text, 'white'::text, 'ivory'::text, NULL::text]))),
    CONSTRAINT gallery_images_mesh_type_check CHECK ((mesh_type = ANY (ARRAY['heavy_mosquito'::text, 'no_see_um'::text, 'shade'::text, 'scrim'::text, NULL::text]))),
    CONSTRAINT gallery_images_product_type_check CHECK ((product_type = ANY (ARRAY['mosquito_curtains'::text, 'clear_vinyl'::text, 'raw_mesh'::text]))),
    CONSTRAINT gallery_images_project_type_check CHECK ((project_type = ANY (ARRAY['porch'::text, 'patio'::text, 'garage'::text, 'pergola'::text, 'gazebo'::text, 'deck'::text, 'awning'::text, 'industrial'::text, 'other'::text]))),
    CONSTRAINT gallery_images_top_attachment_check CHECK ((top_attachment = ANY (ARRAY['tracking'::text, 'velcro'::text, 'grommets'::text, NULL::text])))
);


--
-- Name: google_ads_keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_ads_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id text NOT NULL,
    ad_group_id text NOT NULL,
    keyword_id text NOT NULL,
    keyword_text text NOT NULL,
    match_type text,
    date date NOT NULL,
    cost_micros bigint DEFAULT 0,
    impressions bigint DEFAULT 0,
    clicks bigint DEFAULT 0,
    conversions numeric(10,2) DEFAULT 0,
    conversion_value numeric(10,2) DEFAULT 0,
    quality_score integer,
    synced_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE google_ads_keywords; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.google_ads_keywords IS 'Optional keyword-level performance data for detailed analysis';


--
-- Name: google_ads_sync_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_ads_sync_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sync_date date NOT NULL,
    sync_type text DEFAULT 'daily'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    campaigns_synced integer DEFAULT 0,
    keywords_synced integer DEFAULT 0,
    total_cost_micros bigint DEFAULT 0,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    duration_ms integer,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE google_ads_sync_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.google_ads_sync_log IS 'Audit log of Google Ads API sync operations';


--
-- Name: issue_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issue_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category public.issue_category NOT NULL,
    severity public.issue_severity DEFAULT 'medium'::public.issue_severity NOT NULL,
    title text NOT NULL,
    description text,
    action_required text,
    shortcode text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE issue_templates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.issue_templates IS 'Pre-defined issue templates for quick issue creation';


--
-- Name: journey_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journey_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visitor_id uuid NOT NULL,
    session_id uuid,
    customer_id uuid,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    page_path text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT journey_events_event_type_check CHECK ((event_type = ANY (ARRAY['email_captured'::text, 'quote_started'::text, 'quote_submitted'::text, 'photos_uploaded'::text, 'cart_created'::text, 'cart_updated'::text, 'cart_sent'::text, 'checkout_started'::text, 'payment_initiated'::text, 'purchase_completed'::text, 'project_created'::text, 'project_updated'::text])))
);


--
-- Name: TABLE journey_events; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.journey_events IS 'Conversion and milestone events (email capture, quote, purchase, etc).';


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    interest text,
    project_type text,
    message text,
    source text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    referrer text,
    landing_page text,
    session_id text,
    status text DEFAULT 'open'::text NOT NULL,
    assigned_to uuid,
    pipeline_order integer DEFAULT 0,
    CONSTRAINT leads_status_check CHECK ((status = ANY (ARRAY['open'::text, 'pending'::text, 'need_photos'::text, 'invitation_to_plan'::text, 'need_measurements'::text, 'working_on_quote'::text, 'quote_sent'::text, 'need_decision'::text, 'order_placed'::text, 'order_on_hold'::text, 'difficult'::text, 'closed'::text])))
);


--
-- Name: legacy_leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    imported_at timestamp with time zone DEFAULT now() NOT NULL,
    gravity_form_entry_id integer NOT NULL,
    entry_date timestamp with time zone NOT NULL,
    date_updated timestamp with time zone,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    interest text,
    project_type text,
    message text,
    installation_method text,
    has_photos boolean DEFAULT false,
    photo_urls text[],
    worked_with_before boolean DEFAULT false,
    previous_salesperson text,
    source_url text,
    landing_page text,
    gclid text,
    user_agent text,
    user_ip text,
    raw_csv_row jsonb,
    customer_id uuid,
    converted_to_order boolean DEFAULT false,
    first_order_id uuid,
    fbclid text,
    lead_source text
);


--
-- Name: TABLE legacy_leads; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.legacy_leads IS 'Historical leads imported from Gravity Forms contact forms.';


--
-- Name: legacy_lead_by_interest; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_lead_by_interest AS
 SELECT COALESCE(ll.interest, '(not specified)'::text) AS interest,
    count(*) AS total_leads,
    count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END) AS converted_leads,
    round((((count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END))::numeric / (NULLIF(count(*), 0))::numeric) * (100)::numeric), 2) AS conversion_rate_pct,
    COALESCE(sum(lo.total), (0)::numeric) AS total_revenue,
    round(avg(lo.total) FILTER (WHERE (lo.total > (0)::numeric)), 2) AS avg_order_value
   FROM (public.legacy_leads ll
     LEFT JOIN public.legacy_orders lo ON (((lower(ll.email) = lower(lo.email)) AND (lo.order_date >= ll.entry_date))))
  GROUP BY COALESCE(ll.interest, '(not specified)'::text)
  ORDER BY (count(*)) DESC;


--
-- Name: VIEW legacy_lead_by_interest; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_lead_by_interest IS 'Lead performance aggregated by product interest.';


--
-- Name: legacy_lead_by_landing_page; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_lead_by_landing_page AS
 SELECT COALESCE(ll.landing_page, '(unknown)'::text) AS landing_page,
    count(*) AS total_leads,
    count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END) AS converted_leads,
    round((((count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END))::numeric / (NULLIF(count(*), 0))::numeric) * (100)::numeric), 2) AS conversion_rate_pct,
    COALESCE(sum(lo.total), (0)::numeric) AS total_revenue,
    round(avg(lo.total) FILTER (WHERE (lo.total > (0)::numeric)), 2) AS avg_order_value,
    count(
        CASE
            WHEN ll.has_photos THEN 1
            ELSE NULL::integer
        END) AS leads_with_photos
   FROM (public.legacy_leads ll
     LEFT JOIN public.legacy_orders lo ON (((lower(ll.email) = lower(lo.email)) AND (lo.order_date >= ll.entry_date))))
  GROUP BY COALESCE(ll.landing_page, '(unknown)'::text)
  ORDER BY (count(*)) DESC;


--
-- Name: VIEW legacy_lead_by_landing_page; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_lead_by_landing_page IS 'Lead performance aggregated by landing page.';


--
-- Name: legacy_lead_by_salesperson; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_lead_by_salesperson AS
 SELECT COALESCE(ll.previous_salesperson, '(no previous contact)'::text) AS salesperson,
    count(*) AS returning_leads,
    count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END) AS converted_leads,
    round((((count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END))::numeric / (NULLIF(count(*), 0))::numeric) * (100)::numeric), 2) AS conversion_rate_pct,
    COALESCE(sum(lo.total), (0)::numeric) AS total_revenue,
    round(avg(lo.total) FILTER (WHERE (lo.total > (0)::numeric)), 2) AS avg_order_value
   FROM (public.legacy_leads ll
     LEFT JOIN public.legacy_orders lo ON (((lower(ll.email) = lower(lo.email)) AND (lo.order_date >= ll.entry_date))))
  WHERE (ll.worked_with_before = true)
  GROUP BY COALESCE(ll.previous_salesperson, '(no previous contact)'::text)
  ORDER BY (count(*)) DESC;


--
-- Name: VIEW legacy_lead_by_salesperson; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_lead_by_salesperson IS 'Returning customer lead performance by previous salesperson.';


--
-- Name: legacy_lead_conversion; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_lead_conversion AS
 SELECT ll.id AS lead_id,
    ll.email,
    ll.first_name,
    ll.last_name,
    ll.entry_date AS lead_date,
    ll.interest,
    ll.project_type,
    ll.landing_page,
    ll.previous_salesperson,
    ll.has_photos,
    min(lo.order_date) AS first_order_date,
        CASE
            WHEN (count(lo.id) > 0) THEN true
            ELSE false
        END AS converted,
    EXTRACT(day FROM (min(lo.order_date) - ll.entry_date)) AS days_to_conversion,
    count(lo.id) AS order_count,
    COALESCE(sum(lo.total), (0)::numeric) AS total_revenue
   FROM (public.legacy_leads ll
     LEFT JOIN public.legacy_orders lo ON (((lower(ll.email) = lower(lo.email)) AND (lo.order_date >= ll.entry_date))))
  GROUP BY ll.id, ll.email, ll.first_name, ll.last_name, ll.entry_date, ll.interest, ll.project_type, ll.landing_page, ll.previous_salesperson, ll.has_photos;


--
-- Name: VIEW legacy_lead_conversion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_lead_conversion IS 'Individual lead conversion tracking with order matching.';


--
-- Name: legacy_lead_monthly; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_lead_monthly AS
 SELECT date_trunc('month'::text, ll.entry_date) AS month,
    count(*) AS total_leads,
    count(
        CASE
            WHEN (ll.interest ~~* '%vinyl%'::text) THEN 1
            ELSE NULL::integer
        END) AS vinyl_leads,
    count(
        CASE
            WHEN (ll.interest ~~* '%curtain%'::text) THEN 1
            ELSE NULL::integer
        END) AS curtain_leads,
    count(
        CASE
            WHEN (ll.interest ~~* '%both%'::text) THEN 1
            ELSE NULL::integer
        END) AS both_leads,
    count(
        CASE
            WHEN ll.has_photos THEN 1
            ELSE NULL::integer
        END) AS leads_with_photos,
    count(
        CASE
            WHEN ll.worked_with_before THEN 1
            ELSE NULL::integer
        END) AS returning_leads,
    count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END) AS converted_leads,
    round((((count(
        CASE
            WHEN (lo.email IS NOT NULL) THEN 1
            ELSE NULL::integer
        END))::numeric / (NULLIF(count(*), 0))::numeric) * (100)::numeric), 2) AS conversion_rate_pct
   FROM (public.legacy_leads ll
     LEFT JOIN public.legacy_orders lo ON (((lower(ll.email) = lower(lo.email)) AND (lo.order_date >= ll.entry_date))))
  GROUP BY (date_trunc('month'::text, ll.entry_date))
  ORDER BY (date_trunc('month'::text, ll.entry_date)) DESC;


--
-- Name: VIEW legacy_lead_monthly; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_lead_monthly IS 'Monthly lead volume and conversion trends.';


--
-- Name: legacy_line_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_line_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    legacy_order_id uuid NOT NULL,
    product_name text NOT NULL,
    product_sku text,
    quantity integer DEFAULT 1,
    unit_price numeric(10,2),
    line_total numeric(10,2),
    item_type text,
    raw_meta text,
    parsed_meta jsonb,
    new_line_item_id uuid,
    CONSTRAINT legacy_line_items_item_type_check CHECK ((item_type = ANY (ARRAY['panel'::text, 'track'::text, 'attachment'::text, 'raw_material'::text, 'tool'::text, 'accessory'::text, 'adjustment'::text, 'bundle'::text, 'unknown'::text])))
);


--
-- Name: legacy_product_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_product_mapping (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    legacy_product_name text NOT NULL,
    legacy_item_type text,
    new_product_sku text,
    option_extraction_rules jsonb DEFAULT '{}'::jsonb,
    default_options jsonb DEFAULT '{}'::jsonb,
    notes text
);


--
-- Name: TABLE legacy_product_mapping; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.legacy_product_mapping IS 'Maps legacy WooCommerce product names to normalized product catalog';


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sku text NOT NULL,
    name text NOT NULL,
    description text,
    product_type text NOT NULL,
    pricing_type text NOT NULL,
    base_price numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    image_url text,
    meta jsonb DEFAULT '{}'::jsonb,
    admin_only boolean DEFAULT false,
    CONSTRAINT products_pricing_type_check CHECK ((pricing_type = ANY (ARRAY['sqft'::text, 'linear_ft'::text, 'each'::text, 'set'::text, 'fixed'::text, 'calculated'::text]))),
    CONSTRAINT products_product_type_check CHECK ((product_type = ANY (ARRAY['panel'::text, 'track'::text, 'attachment'::text, 'raw_material'::text, 'tool'::text, 'accessory'::text, 'adjustment'::text])))
);


--
-- Name: legacy_line_items_mapped; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.legacy_line_items_mapped AS
 SELECT li.id,
    li.legacy_order_id,
    li.product_name AS legacy_product_name,
    li.item_type AS legacy_item_type,
    li.quantity,
    li.unit_price,
    li.line_total,
    pm.new_product_sku,
    p.name AS new_product_name,
    p.product_type AS new_product_type,
    pm.default_options,
    pm.option_extraction_rules,
    li.raw_meta,
        CASE
            WHEN (pm.new_product_sku IS NULL) THEN 'unmapped'::text
            WHEN (pm.option_extraction_rules <> '{}'::jsonb) THEN 'needs_option_extraction'::text
            ELSE 'mapped'::text
        END AS mapping_status
   FROM ((public.legacy_line_items li
     LEFT JOIN public.legacy_product_mapping pm ON ((li.product_name = pm.legacy_product_name)))
     LEFT JOIN public.products p ON ((pm.new_product_sku = p.sku)));


--
-- Name: VIEW legacy_line_items_mapped; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.legacy_line_items_mapped IS 'Legacy line items with their mapped new product information';


--
-- Name: legacy_panel_specs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_panel_specs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    legacy_line_item_id uuid NOT NULL,
    panel_number integer DEFAULT 1,
    width_inches integer,
    height_inches integer,
    sqft numeric(10,2),
    mesh_type text,
    color text,
    top_attachment text,
    bottom_attachment text,
    has_door boolean DEFAULT false,
    has_zipper boolean DEFAULT false,
    has_notch boolean DEFAULT false,
    notch_specs text,
    raw_dimension_string text
);


--
-- Name: line_item_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.line_item_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    line_item_id uuid NOT NULL,
    option_name text NOT NULL,
    option_value text NOT NULL,
    option_display text NOT NULL,
    price_impact numeric(10,2) DEFAULT 0
);


--
-- Name: line_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.line_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    cart_id uuid,
    order_id uuid,
    product_id uuid NOT NULL,
    product_sku text NOT NULL,
    product_name text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    width_inches integer,
    height_inches integer,
    length_feet numeric(10,2),
    unit_price numeric(10,2) NOT NULL,
    line_total numeric(10,2) NOT NULL,
    adjustment_type text,
    adjustment_reason text,
    related_line_item_id uuid,
    original_bundle_name text,
    legacy_order_id uuid,
    panel_specs jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT line_items_adjustment_type_check CHECK ((adjustment_type = ANY (ARRAY['discount'::text, 'surcharge'::text, 'notch'::text, 'special'::text, NULL::text]))),
    CONSTRAINT line_items_check CHECK (((cart_id IS NOT NULL) OR (order_id IS NOT NULL)))
);


--
-- Name: migration_progress; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.migration_progress AS
 SELECT migration_status,
    page_type,
    count(*) AS page_count,
    round(avg(migration_priority)) AS avg_priority,
    sum(monthly_pageviews) AS total_pageviews
   FROM public.site_pages
  GROUP BY migration_status, page_type
  ORDER BY migration_status, page_type;


--
-- Name: VIEW migration_progress; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.migration_progress IS 'Aggregated migration progress by status and type';


--
-- Name: monthly_revenue_by_product_type; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.monthly_revenue_by_product_type AS
 SELECT date_trunc('month'::text, lo.order_date) AS month,
    li.item_type,
    count(DISTINCT lo.id) AS orders,
    sum(li.line_total) AS revenue
   FROM (public.legacy_line_items li
     JOIN public.legacy_orders lo ON ((li.legacy_order_id = lo.id)))
  GROUP BY (date_trunc('month'::text, lo.order_date)), li.item_type
  ORDER BY (date_trunc('month'::text, lo.order_date)) DESC, (sum(li.line_total)) DESC;


--
-- Name: VIEW monthly_revenue_by_product_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.monthly_revenue_by_product_type IS 'Monthly revenue breakdown by product type';


--
-- Name: monthly_roas; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.monthly_roas AS
 WITH monthly_spend AS (
         SELECT date_trunc('month'::text, (google_ads_campaigns.date)::timestamp with time zone) AS month,
            (sum(google_ads_campaigns.cost_micros) / 1000000.0) AS total_spend,
            sum(google_ads_campaigns.clicks) AS total_clicks,
            sum(google_ads_campaigns.impressions) AS total_impressions
           FROM public.google_ads_campaigns
          GROUP BY (date_trunc('month'::text, (google_ads_campaigns.date)::timestamp with time zone))
        ), monthly_revenue AS (
         SELECT date_trunc('month'::text, legacy_orders.order_date) AS month,
            sum(legacy_orders.total) AS total_revenue,
            count(*) AS order_count
           FROM public.legacy_orders
          WHERE (legacy_orders.order_date IS NOT NULL)
          GROUP BY (date_trunc('month'::text, legacy_orders.order_date))
        )
 SELECT COALESCE(ms.month, mr.month) AS month,
    ms.total_spend,
    ms.total_clicks,
    ms.total_impressions,
    mr.total_revenue,
    mr.order_count,
        CASE
            WHEN (ms.total_spend > (0)::numeric) THEN round((mr.total_revenue / ms.total_spend), 2)
            ELSE NULL::numeric
        END AS roas,
        CASE
            WHEN (mr.order_count > 0) THEN round((ms.total_spend / (mr.order_count)::numeric), 2)
            ELSE NULL::numeric
        END AS cost_per_order
   FROM (monthly_spend ms
     FULL JOIN monthly_revenue mr ON ((ms.month = mr.month)))
  ORDER BY COALESCE(ms.month, mr.month) DESC;


--
-- Name: VIEW monthly_roas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.monthly_roas IS 'Monthly aggregated ROAS metrics';


--
-- Name: notification_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_log (
    id integer NOT NULL,
    notification_type text NOT NULL,
    recipient text NOT NULL,
    subject text NOT NULL,
    reference_id text,
    status text DEFAULT 'sent'::text NOT NULL,
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    sent_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_log_status_check CHECK ((status = ANY (ARRAY['sent'::text, 'failed'::text, 'bounced'::text])))
);


--
-- Name: TABLE notification_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.notification_log IS 'Audit trail of all email notifications sent';


--
-- Name: notification_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_log_id_seq OWNED BY public.notification_log.id;


--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_settings (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    recipient_emails text[] DEFAULT '{}'::text[] NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE notification_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.notification_settings IS 'Configurable notification recipients and enable/disable per type';


--
-- Name: COLUMN notification_settings.recipient_emails; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notification_settings.recipient_emails IS 'Array of email addresses. Empty array means customer-only (uses order/lead email).';


--
-- Name: page_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    category public.issue_category NOT NULL,
    severity public.issue_severity DEFAULT 'medium'::public.issue_severity NOT NULL,
    status public.issue_status DEFAULT 'open'::public.issue_status NOT NULL,
    title text NOT NULL,
    description text,
    action_required text,
    notes text,
    affected_assets jsonb DEFAULT '[]'::jsonb,
    related_issue_id uuid,
    audit_id uuid,
    assigned_to text,
    resolution_notes text,
    resolved_at timestamp with time zone,
    resolved_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sort_order integer DEFAULT 0
);


--
-- Name: TABLE page_issues; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_issues IS 'Tracks specific issues per page with severity, status, and resolution workflow';


--
-- Name: open_issues_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.open_issues_summary AS
 SELECT pi.id AS issue_id,
    sp.slug,
    sp.title AS page_title,
    pi.category,
    pi.severity,
    pi.status,
    pi.title AS issue_title,
    pi.action_required,
    pi.assigned_to,
    pi.created_at,
    pi.updated_at,
    (EXTRACT(day FROM (now() - pi.created_at)))::integer AS days_open
   FROM (public.page_issues pi
     JOIN public.site_pages sp ON ((sp.id = pi.page_id)))
  WHERE (pi.status = ANY (ARRAY['open'::public.issue_status, 'acknowledged'::public.issue_status, 'in_progress'::public.issue_status, 'blocked'::public.issue_status]))
  ORDER BY
        CASE pi.severity
            WHEN 'critical'::public.issue_severity THEN 1
            WHEN 'high'::public.issue_severity THEN 2
            WHEN 'medium'::public.issue_severity THEN 3
            WHEN 'low'::public.issue_severity THEN 4
            ELSE 5
        END, pi.created_at;


--
-- Name: option_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.option_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    option_id uuid NOT NULL,
    value text NOT NULL,
    display_value text NOT NULL,
    price_modifier numeric(10,2) DEFAULT 0,
    price_multiplier numeric(10,4) DEFAULT 1,
    is_default boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    meta jsonb DEFAULT '{}'::jsonb,
    admin_only boolean DEFAULT false
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    order_number text NOT NULL,
    customer_id uuid,
    email text NOT NULL,
    billing_first_name text,
    billing_last_name text,
    billing_phone text,
    billing_address_1 text,
    billing_address_2 text,
    billing_city text,
    billing_state text,
    billing_zip text,
    billing_country text DEFAULT 'US'::text,
    shipping_first_name text,
    shipping_last_name text,
    shipping_phone text,
    shipping_address_1 text,
    shipping_address_2 text,
    shipping_city text,
    shipping_state text,
    shipping_zip text,
    shipping_country text DEFAULT 'US'::text,
    status text DEFAULT 'pending'::text NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total numeric(10,2) NOT NULL,
    payment_method text,
    payment_transaction_id text,
    payment_status text DEFAULT 'pending'::text,
    paid_at timestamp with time zone,
    shipped_at timestamp with time zone,
    tracking_number text,
    tracking_url text,
    customer_note text,
    internal_note text,
    assigned_to uuid,
    salesperson_username text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    referrer text,
    source text DEFAULT 'website'::text,
    project_id uuid,
    cart_id uuid,
    diagram_url text,
    legacy_woo_order_id integer,
    legacy_woo_order_key text,
    legacy_raw_data jsonb,
    visitor_id uuid,
    session_id uuid,
    first_utm_source text,
    first_utm_campaign text,
    converting_utm_source text,
    converting_utm_campaign text,
    salesperson_id text,
    salesperson_name text,
    order_source text DEFAULT 'online_self'::text,
    CONSTRAINT orders_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'refunded'::text, 'failed'::text]))),
    CONSTRAINT orders_source_check CHECK ((source = ANY (ARRAY['website'::text, 'admin'::text, 'import'::text, 'api'::text]))),
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'on_hold'::text, 'completed'::text, 'cancelled'::text, 'refunded'::text, 'failed'::text])))
);


--
-- Name: page_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_path text NOT NULL,
    date date NOT NULL,
    pageviews integer DEFAULT 0,
    unique_pageviews integer DEFAULT 0,
    sessions integer DEFAULT 0,
    organic_sessions integer DEFAULT 0,
    new_users integer DEFAULT 0,
    avg_time_on_page numeric(10,2),
    bounce_rate numeric(5,4),
    exit_rate numeric(5,4),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE page_analytics; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_analytics IS 'Daily aggregated page metrics synced from GA4.';


--
-- Name: page_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_approvals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    requested_by uuid,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    request_notes text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    decision text,
    decision_notes text,
    checklist jsonb DEFAULT '{"links_working": null, "seo_optimized": null, "content_accurate": null, "images_optimized": null, "mobile_responsive": null, "performance_acceptable": null, "design_system_compliant": null}'::jsonb,
    is_complete boolean DEFAULT false,
    CONSTRAINT page_approvals_decision_check CHECK ((decision = ANY (ARRAY['approved'::text, 'changes_requested'::text, 'rejected'::text])))
);


--
-- Name: TABLE page_approvals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_approvals IS 'Approval workflow requests and reviews';


--
-- Name: performance_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_audits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    performance_score integer,
    performance_rating public.audit_rating DEFAULT 'not_audited'::public.audit_rating NOT NULL,
    lcp_ms integer,
    lcp_rating public.audit_rating,
    fid_ms integer,
    fid_rating public.audit_rating,
    cls_score numeric(5,3),
    cls_rating public.audit_rating,
    inp_ms integer,
    inp_rating public.audit_rating,
    ttfb_ms integer,
    fcp_ms integer,
    tti_ms integer,
    speed_index integer,
    total_blocking_time_ms integer,
    total_page_size_kb integer,
    html_size_kb integer,
    css_size_kb integer,
    js_size_kb integer,
    image_size_kb integer,
    font_size_kb integer,
    total_requests integer,
    js_requests integer,
    css_requests integer,
    image_requests integer,
    font_requests integer,
    third_party_requests integer,
    lighthouse_performance integer,
    lighthouse_accessibility integer,
    lighthouse_best_practices integer,
    lighthouse_seo integer,
    device_type text DEFAULT 'mobile'::text,
    issues jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    audited_at timestamp with time zone DEFAULT now() NOT NULL,
    audited_by uuid,
    CONSTRAINT performance_audits_performance_score_check CHECK (((performance_score >= 0) AND (performance_score <= 100)))
);


--
-- Name: TABLE performance_audits; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.performance_audits IS 'Core Web Vitals and performance metrics';


--
-- Name: seo_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_audits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    seo_score integer,
    seo_rating public.audit_rating DEFAULT 'not_audited'::public.audit_rating NOT NULL,
    has_meta_title boolean DEFAULT false,
    meta_title text,
    meta_title_length integer,
    meta_title_ok boolean,
    has_meta_description boolean DEFAULT false,
    meta_description text,
    meta_description_length integer,
    meta_description_ok boolean,
    has_canonical boolean DEFAULT false,
    canonical_url text,
    has_og_title boolean DEFAULT false,
    has_og_description boolean DEFAULT false,
    has_og_image boolean DEFAULT false,
    og_image_url text,
    has_twitter_card boolean DEFAULT false,
    has_h1 boolean DEFAULT false,
    h1_count integer DEFAULT 0,
    h1_text text,
    heading_hierarchy_ok boolean,
    images_have_alt boolean,
    images_missing_alt integer DEFAULT 0,
    internal_links_count integer DEFAULT 0,
    external_links_count integer DEFAULT 0,
    broken_links_count integer DEFAULT 0,
    has_robots_meta boolean DEFAULT false,
    is_indexable boolean DEFAULT true,
    has_sitemap_entry boolean DEFAULT false,
    is_mobile_friendly boolean,
    viewport_configured boolean DEFAULT false,
    issues jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    audited_at timestamp with time zone DEFAULT now() NOT NULL,
    audited_by uuid,
    CONSTRAINT seo_audits_seo_score_check CHECK (((seo_score >= 0) AND (seo_score <= 100)))
);


--
-- Name: TABLE seo_audits; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.seo_audits IS 'SEO audit results for each page';


--
-- Name: page_audit_dashboard; Type: VIEW; Schema: public; Owner: -
--

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
    round(((((COALESCE(sa.seo_score, 0))::numeric * 0.35) + ((COALESCE(ar.ai_score, 0))::numeric * 0.25)) + ((COALESCE(pa.performance_score, 0))::numeric * 0.40))) AS overall_score,
    sp.updated_at,
    sp.last_audited_at
   FROM (((public.site_pages sp
     LEFT JOIN public.seo_audits sa ON ((sa.page_id = sp.id)))
     LEFT JOIN public.ai_readiness_audits ar ON ((ar.page_id = sp.id)))
     LEFT JOIN LATERAL ( SELECT performance_audits.id,
            performance_audits.page_id,
            performance_audits.performance_score,
            performance_audits.performance_rating,
            performance_audits.lcp_ms,
            performance_audits.lcp_rating,
            performance_audits.fid_ms,
            performance_audits.fid_rating,
            performance_audits.cls_score,
            performance_audits.cls_rating,
            performance_audits.inp_ms,
            performance_audits.inp_rating,
            performance_audits.ttfb_ms,
            performance_audits.fcp_ms,
            performance_audits.tti_ms,
            performance_audits.speed_index,
            performance_audits.total_blocking_time_ms,
            performance_audits.total_page_size_kb,
            performance_audits.html_size_kb,
            performance_audits.css_size_kb,
            performance_audits.js_size_kb,
            performance_audits.image_size_kb,
            performance_audits.font_size_kb,
            performance_audits.total_requests,
            performance_audits.js_requests,
            performance_audits.css_requests,
            performance_audits.image_requests,
            performance_audits.font_requests,
            performance_audits.third_party_requests,
            performance_audits.lighthouse_performance,
            performance_audits.lighthouse_accessibility,
            performance_audits.lighthouse_best_practices,
            performance_audits.lighthouse_seo,
            performance_audits.device_type,
            performance_audits.issues,
            performance_audits.recommendations,
            performance_audits.audited_at,
            performance_audits.audited_by
           FROM public.performance_audits
          WHERE (performance_audits.page_id = sp.id)
          ORDER BY performance_audits.audited_at DESC
         LIMIT 1) pa ON (true));


--
-- Name: page_issues_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.page_issues_summary AS
 SELECT sp.id AS page_id,
    sp.slug,
    sp.title,
    sp.migration_status,
    count(pi.id) FILTER (WHERE (pi.status = ANY (ARRAY['open'::public.issue_status, 'acknowledged'::public.issue_status, 'in_progress'::public.issue_status, 'blocked'::public.issue_status]))) AS open_issues,
    count(pi.id) FILTER (WHERE ((pi.severity = 'critical'::public.issue_severity) AND (pi.status <> 'resolved'::public.issue_status))) AS critical_issues,
    count(pi.id) FILTER (WHERE ((pi.severity = 'high'::public.issue_severity) AND (pi.status <> 'resolved'::public.issue_status))) AS high_issues,
    count(pi.id) FILTER (WHERE (pi.status = 'resolved'::public.issue_status)) AS resolved_issues,
    max(pi.updated_at) AS last_issue_update,
    bool_or(((pi.category = 'assets'::public.issue_category) AND (pi.status <> 'resolved'::public.issue_status))) AS has_asset_issues
   FROM (public.site_pages sp
     LEFT JOIN public.page_issues pi ON ((pi.page_id = sp.id)))
  GROUP BY sp.id, sp.slug, sp.title, sp.migration_status
  ORDER BY (count(pi.id) FILTER (WHERE ((pi.severity = 'critical'::public.issue_severity) AND (pi.status <> 'resolved'::public.issue_status)))) DESC, (count(pi.id) FILTER (WHERE (pi.status = ANY (ARRAY['open'::public.issue_status, 'acknowledged'::public.issue_status, 'in_progress'::public.issue_status, 'blocked'::public.issue_status])))) DESC;


--
-- Name: page_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id uuid NOT NULL,
    note text NOT NULL,
    note_type text DEFAULT 'general'::text,
    author text,
    is_pinned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE page_notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_notes IS 'General notes and comments on pages';


--
-- Name: page_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    visitor_id uuid NOT NULL,
    page_path text NOT NULL,
    page_title text,
    page_url text,
    viewed_at timestamp with time zone DEFAULT now(),
    time_on_page_seconds integer,
    scroll_depth integer,
    view_order integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE page_views; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.page_views IS 'Individual page views within sessions for detailed journey tracking.';


--
-- Name: pages_needing_attention; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.pages_needing_attention AS
 SELECT sp.slug,
    sp.title,
    sp.page_type,
    sa.seo_score,
    ar.ai_score,
    pa.performance_score,
        CASE
            WHEN (sa.seo_score < 50) THEN 'Poor SEO'::text
            WHEN (ar.ai_score < 50) THEN 'Poor AI Readiness'::text
            WHEN (pa.performance_score < 50) THEN 'Poor Performance'::text
            WHEN (sp.approval_status = 'changes_requested'::public.approval_status) THEN 'Changes Requested'::text
            ELSE 'Needs Review'::text
        END AS attention_reason
   FROM (((public.site_pages sp
     LEFT JOIN public.seo_audits sa ON ((sa.page_id = sp.id)))
     LEFT JOIN public.ai_readiness_audits ar ON ((ar.page_id = sp.id)))
     LEFT JOIN LATERAL ( SELECT performance_audits.id,
            performance_audits.page_id,
            performance_audits.performance_score,
            performance_audits.performance_rating,
            performance_audits.lcp_ms,
            performance_audits.lcp_rating,
            performance_audits.fid_ms,
            performance_audits.fid_rating,
            performance_audits.cls_score,
            performance_audits.cls_rating,
            performance_audits.inp_ms,
            performance_audits.inp_rating,
            performance_audits.ttfb_ms,
            performance_audits.fcp_ms,
            performance_audits.tti_ms,
            performance_audits.speed_index,
            performance_audits.total_blocking_time_ms,
            performance_audits.total_page_size_kb,
            performance_audits.html_size_kb,
            performance_audits.css_size_kb,
            performance_audits.js_size_kb,
            performance_audits.image_size_kb,
            performance_audits.font_size_kb,
            performance_audits.total_requests,
            performance_audits.js_requests,
            performance_audits.css_requests,
            performance_audits.image_requests,
            performance_audits.font_requests,
            performance_audits.third_party_requests,
            performance_audits.lighthouse_performance,
            performance_audits.lighthouse_accessibility,
            performance_audits.lighthouse_best_practices,
            performance_audits.lighthouse_seo,
            performance_audits.device_type,
            performance_audits.issues,
            performance_audits.recommendations,
            performance_audits.audited_at,
            performance_audits.audited_by
           FROM public.performance_audits
          WHERE (performance_audits.page_id = sp.id)
          ORDER BY performance_audits.audited_at DESC
         LIMIT 1) pa ON (true))
  WHERE ((sp.migration_status = 'live'::public.page_migration_status) AND ((sa.seo_score < 50) OR (ar.ai_score < 50) OR (pa.performance_score < 50) OR (sp.approval_status = 'changes_requested'::public.approval_status)))
  ORDER BY LEAST(COALESCE(sa.seo_score, 100), COALESCE(ar.ai_score, 100), COALESCE(pa.performance_score, 100));


--
-- Name: VIEW pages_needing_attention; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.pages_needing_attention IS 'Pages with low scores that need work';


--
-- Name: pages_needing_revision; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.pages_needing_revision AS
 SELECT id,
    slug,
    title,
    page_type,
    migration_status,
    review_notes,
    revision_items,
    reviewed_at,
    updated_at
   FROM public.site_pages
  WHERE (review_status = 'needs_revision'::public.simple_review_status)
  ORDER BY migration_priority DESC, updated_at DESC;


--
-- Name: product_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    product_id uuid NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    option_type text NOT NULL,
    is_required boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    meta jsonb DEFAULT '{}'::jsonb,
    admin_only boolean DEFAULT false,
    CONSTRAINT product_options_option_type_check CHECK ((option_type = ANY (ARRAY['select'::text, 'color'::text, 'number'::text, 'dimension'::text])))
);


--
-- Name: product_pricing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_pricing (
    id text NOT NULL,
    category text NOT NULL,
    label text NOT NULL,
    value numeric(10,4) NOT NULL,
    unit text NOT NULL,
    description text,
    is_multiplier boolean DEFAULT false,
    base_price_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    admin_only boolean DEFAULT false
);


--
-- Name: TABLE product_pricing; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.product_pricing IS 'Product pricing that can be edited via admin panel';


--
-- Name: product_pricing_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_pricing_history (
    id integer NOT NULL,
    pricing_id text NOT NULL,
    old_value numeric(10,4),
    new_value numeric(10,4) NOT NULL,
    changed_by text,
    changed_at timestamp with time zone DEFAULT now(),
    reason text
);


--
-- Name: TABLE product_pricing_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.product_pricing_history IS 'Audit trail of all pricing changes';


--
-- Name: product_pricing_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_pricing_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_pricing_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_pricing_history_id_seq OWNED BY public.product_pricing_history.id;


--
-- Name: product_sales_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_sales_summary AS
 SELECT COALESCE(pm.new_product_sku, 'UNMAPPED'::text) AS product_sku,
    COALESCE(p.name, li.product_name) AS product_name,
    li.item_type,
    count(*) AS times_sold,
    sum(li.quantity) AS total_quantity,
    sum(li.line_total) AS total_revenue,
    avg(li.unit_price) AS avg_unit_price,
    min(lo.order_date) AS first_sale,
    max(lo.order_date) AS last_sale
   FROM (((public.legacy_line_items li
     JOIN public.legacy_orders lo ON ((li.legacy_order_id = lo.id)))
     LEFT JOIN public.legacy_product_mapping pm ON ((li.product_name = pm.legacy_product_name)))
     LEFT JOIN public.products p ON ((pm.new_product_sku = p.sku)))
  GROUP BY COALESCE(pm.new_product_sku, 'UNMAPPED'::text), COALESCE(p.name, li.product_name), li.item_type
  ORDER BY (sum(li.line_total)) DESC;


--
-- Name: VIEW product_sales_summary; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.product_sales_summary IS 'Sales summary by product (legacy data mapped to new catalog)';


--
-- Name: project_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_photos (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id uuid NOT NULL,
    storage_path text NOT NULL,
    filename text NOT NULL,
    content_type text,
    size_bytes integer
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id uuid,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    product_type text NOT NULL,
    project_type text,
    mesh_type text,
    top_attachment text,
    total_width integer,
    number_of_sides integer,
    notes text,
    estimated_total numeric(10,2),
    status text DEFAULT 'draft'::text NOT NULL,
    assigned_to uuid,
    share_token text DEFAULT encode(extensions.gen_random_bytes(16), 'hex'::text),
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    referrer text,
    landing_page text,
    session_id text,
    cart_data jsonb DEFAULT '[]'::jsonb,
    lead_id uuid
);


--
-- Name: review_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.review_summary AS
 SELECT count(*) AS total_pages,
    count(*) FILTER (WHERE (migration_status = 'live'::public.page_migration_status)) AS pages_live,
    count(*) FILTER (WHERE ((review_status = 'pending'::public.simple_review_status) OR (review_status IS NULL))) AS pending_review,
    count(*) FILTER (WHERE (review_status = 'complete'::public.simple_review_status)) AS complete,
    count(*) FILTER (WHERE (review_status = 'needs_revision'::public.simple_review_status)) AS needs_revision
   FROM public.site_pages;


--
-- Name: salesperson_performance; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.salesperson_performance AS
 SELECT salesperson_username,
    count(DISTINCT id) AS total_orders,
    count(DISTINCT email) AS unique_customers,
    sum(total) AS total_revenue,
    avg(total) AS avg_order_value,
    min(order_date) AS first_order,
    max(order_date) AS last_order
   FROM public.legacy_orders lo
  WHERE (salesperson_username IS NOT NULL)
  GROUP BY salesperson_username
  ORDER BY (sum(total)) DESC;


--
-- Name: VIEW salesperson_performance; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.salesperson_performance IS 'Sales metrics by salesperson';


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visitor_id uuid NOT NULL,
    landing_page text NOT NULL,
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    utm_content text,
    device_type text,
    browser text,
    os text,
    country text,
    region text,
    city text,
    started_at timestamp with time zone DEFAULT now(),
    ended_at timestamp with time zone,
    last_activity_at timestamp with time zone DEFAULT now(),
    pageview_count integer DEFAULT 0,
    duration_seconds integer,
    converted boolean DEFAULT false,
    conversion_type text,
    conversion_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sessions IS 'Individual browsing sessions linked to visitors. Each visit creates a new session.';


--
-- Name: shipping_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_rates (
    id integer NOT NULL,
    zone_id integer NOT NULL,
    shipping_class text NOT NULL,
    flat_cost numeric(10,2) DEFAULT 0 NOT NULL,
    fee_percent numeric(5,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT shipping_rates_shipping_class_check CHECK ((shipping_class = ANY (ARRAY['default'::text, 'clear_vinyl'::text, 'straight_track'::text])))
);


--
-- Name: TABLE shipping_rates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shipping_rates IS 'Per-zone shipping rates by class. Clear Vinyl replaces base; Track adds on top.';


--
-- Name: shipping_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_rates_id_seq OWNED BY public.shipping_rates.id;


--
-- Name: shipping_tax_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_tax_history (
    id integer NOT NULL,
    table_name text NOT NULL,
    record_id integer NOT NULL,
    field_name text NOT NULL,
    old_value text,
    new_value text NOT NULL,
    changed_by text,
    changed_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE shipping_tax_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shipping_tax_history IS 'Audit trail for shipping rate and tax rate changes.';


--
-- Name: shipping_tax_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_tax_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_tax_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_tax_history_id_seq OWNED BY public.shipping_tax_history.id;


--
-- Name: shipping_zone_regions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zone_regions (
    id integer NOT NULL,
    zone_id integer NOT NULL,
    country_code text NOT NULL,
    state_code text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE shipping_zone_regions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shipping_zone_regions IS 'Maps country/state pairs to shipping zones. Non-overlapping regions.';


--
-- Name: shipping_zone_regions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_zone_regions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_zone_regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_zone_regions_id_seq OWNED BY public.shipping_zone_regions.id;


--
-- Name: shipping_zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zones (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_fallback boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE shipping_zones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shipping_zones IS 'Shipping zones for rate calculation. Fallback zone used when no region matches.';


--
-- Name: shipping_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_zones_id_seq OWNED BY public.shipping_zones.id;


--
-- Name: sms_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sms_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    lead_id uuid,
    direction text NOT NULL,
    from_number text NOT NULL,
    to_number text NOT NULL,
    body text NOT NULL,
    media_urls text[],
    status text DEFAULT 'queued'::text,
    error_message text,
    twilio_sid text,
    CONSTRAINT sms_messages_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
    CONSTRAINT sms_messages_status_check CHECK ((status = ANY (ARRAY['queued'::text, 'sent'::text, 'delivered'::text, 'failed'::text, 'received'::text])))
);


--
-- Name: staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    auth_user_id uuid NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'sales'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: tax_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_rates (
    id integer NOT NULL,
    country_code text NOT NULL,
    state_code text DEFAULT '*'::text NOT NULL,
    postcode text DEFAULT '*'::text NOT NULL,
    city text DEFAULT '*'::text NOT NULL,
    rate numeric(8,4) DEFAULT 0 NOT NULL,
    tax_name text NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    is_compound boolean DEFAULT false NOT NULL,
    is_shipping_taxable boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE tax_rates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.tax_rates IS 'Tax rates by country/state/postcode. Most specific match wins.';


--
-- Name: tax_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tax_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tax_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tax_rates_id_seq OWNED BY public.tax_rates.id;


--
-- Name: traffic_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.traffic_sources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_path text NOT NULL,
    date date NOT NULL,
    channel text NOT NULL,
    sessions integer DEFAULT 0,
    new_users integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE traffic_sources; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.traffic_sources IS 'Traffic source breakdown by channel, synced from GA4.';


--
-- Name: notification_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_log ALTER COLUMN id SET DEFAULT nextval('public.notification_log_id_seq'::regclass);


--
-- Name: product_pricing_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_pricing_history ALTER COLUMN id SET DEFAULT nextval('public.product_pricing_history_id_seq'::regclass);


--
-- Name: shipping_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates ALTER COLUMN id SET DEFAULT nextval('public.shipping_rates_id_seq'::regclass);


--
-- Name: shipping_tax_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_tax_history ALTER COLUMN id SET DEFAULT nextval('public.shipping_tax_history_id_seq'::regclass);


--
-- Name: shipping_zone_regions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_regions ALTER COLUMN id SET DEFAULT nextval('public.shipping_zone_regions_id_seq'::regclass);


--
-- Name: shipping_zones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zones ALTER COLUMN id SET DEFAULT nextval('public.shipping_zones_id_seq'::regclass);


--
-- Name: tax_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates ALTER COLUMN id SET DEFAULT nextval('public.tax_rates_id_seq'::regclass);


--
-- Name: ai_readiness_audits ai_readiness_audits_page_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_readiness_audits
    ADD CONSTRAINT ai_readiness_audits_page_id_key UNIQUE (page_id);


--
-- Name: ai_readiness_audits ai_readiness_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_readiness_audits
    ADD CONSTRAINT ai_readiness_audits_pkey PRIMARY KEY (id);


--
-- Name: analytics_sync_log analytics_sync_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_sync_log
    ADD CONSTRAINT analytics_sync_log_pkey PRIMARY KEY (id);


--
-- Name: audit_history audit_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_history
    ADD CONSTRAINT audit_history_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: email_messages email_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_pkey PRIMARY KEY (id);


--
-- Name: galleries galleries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_pkey PRIMARY KEY (id);


--
-- Name: galleries galleries_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_slug_key UNIQUE (slug);


--
-- Name: gallery_assignments gallery_assignments_gallery_id_image_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_assignments
    ADD CONSTRAINT gallery_assignments_gallery_id_image_id_key UNIQUE (gallery_id, image_id);


--
-- Name: gallery_assignments gallery_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_assignments
    ADD CONSTRAINT gallery_assignments_pkey PRIMARY KEY (id);


--
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- Name: google_ads_campaigns google_ads_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_ads_campaigns
    ADD CONSTRAINT google_ads_campaigns_pkey PRIMARY KEY (id);


--
-- Name: google_ads_campaigns google_ads_campaigns_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_ads_campaigns
    ADD CONSTRAINT google_ads_campaigns_unique UNIQUE (campaign_id, date);


--
-- Name: google_ads_keywords google_ads_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_ads_keywords
    ADD CONSTRAINT google_ads_keywords_pkey PRIMARY KEY (id);


--
-- Name: google_ads_keywords google_ads_keywords_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_ads_keywords
    ADD CONSTRAINT google_ads_keywords_unique UNIQUE (keyword_id, date);


--
-- Name: google_ads_sync_log google_ads_sync_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_ads_sync_log
    ADD CONSTRAINT google_ads_sync_log_pkey PRIMARY KEY (id);


--
-- Name: issue_templates issue_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issue_templates
    ADD CONSTRAINT issue_templates_pkey PRIMARY KEY (id);


--
-- Name: issue_templates issue_templates_shortcode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issue_templates
    ADD CONSTRAINT issue_templates_shortcode_key UNIQUE (shortcode);


--
-- Name: journey_events journey_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_events
    ADD CONSTRAINT journey_events_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: legacy_leads legacy_leads_gravity_form_entry_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_leads
    ADD CONSTRAINT legacy_leads_gravity_form_entry_id_key UNIQUE (gravity_form_entry_id);


--
-- Name: legacy_leads legacy_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_leads
    ADD CONSTRAINT legacy_leads_pkey PRIMARY KEY (id);


--
-- Name: legacy_line_items legacy_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_line_items
    ADD CONSTRAINT legacy_line_items_pkey PRIMARY KEY (id);


--
-- Name: legacy_orders legacy_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_orders
    ADD CONSTRAINT legacy_orders_pkey PRIMARY KEY (id);


--
-- Name: legacy_orders legacy_orders_woo_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_orders
    ADD CONSTRAINT legacy_orders_woo_order_id_key UNIQUE (woo_order_id);


--
-- Name: legacy_panel_specs legacy_panel_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_panel_specs
    ADD CONSTRAINT legacy_panel_specs_pkey PRIMARY KEY (id);


--
-- Name: legacy_product_mapping legacy_product_mapping_legacy_product_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_product_mapping
    ADD CONSTRAINT legacy_product_mapping_legacy_product_name_key UNIQUE (legacy_product_name);


--
-- Name: legacy_product_mapping legacy_product_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_product_mapping
    ADD CONSTRAINT legacy_product_mapping_pkey PRIMARY KEY (id);


--
-- Name: line_item_options line_item_options_line_item_id_option_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_item_options
    ADD CONSTRAINT line_item_options_line_item_id_option_name_key UNIQUE (line_item_id, option_name);


--
-- Name: line_item_options line_item_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_item_options
    ADD CONSTRAINT line_item_options_pkey PRIMARY KEY (id);


--
-- Name: line_items line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_items_pkey PRIMARY KEY (id);


--
-- Name: notification_log notification_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_log
    ADD CONSTRAINT notification_log_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: option_values option_values_option_id_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_values
    ADD CONSTRAINT option_values_option_id_value_key UNIQUE (option_id, value);


--
-- Name: option_values option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_values
    ADD CONSTRAINT option_values_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: page_analytics page_analytics_page_path_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_analytics
    ADD CONSTRAINT page_analytics_page_path_date_key UNIQUE (page_path, date);


--
-- Name: page_analytics page_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_analytics
    ADD CONSTRAINT page_analytics_pkey PRIMARY KEY (id);


--
-- Name: page_approvals page_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_approvals
    ADD CONSTRAINT page_approvals_pkey PRIMARY KEY (id);


--
-- Name: page_audit_sequence page_audit_sequence_page_id_sequence_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_audit_sequence
    ADD CONSTRAINT page_audit_sequence_page_id_sequence_name_key UNIQUE (page_id, sequence_name);


--
-- Name: page_audit_sequence page_audit_sequence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_audit_sequence
    ADD CONSTRAINT page_audit_sequence_pkey PRIMARY KEY (id);


--
-- Name: page_issues page_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_issues
    ADD CONSTRAINT page_issues_pkey PRIMARY KEY (id);


--
-- Name: page_notes page_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_notes
    ADD CONSTRAINT page_notes_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: performance_audits performance_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_audits
    ADD CONSTRAINT performance_audits_pkey PRIMARY KEY (id);


--
-- Name: product_options product_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_pkey PRIMARY KEY (id);


--
-- Name: product_options product_options_product_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_product_id_name_key UNIQUE (product_id, name);


--
-- Name: product_pricing_history product_pricing_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_pricing_history
    ADD CONSTRAINT product_pricing_history_pkey PRIMARY KEY (id);


--
-- Name: product_pricing product_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_pricing
    ADD CONSTRAINT product_pricing_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: project_photos project_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_photos
    ADD CONSTRAINT project_photos_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_share_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_share_token_key UNIQUE (share_token);


--
-- Name: seo_audits seo_audits_page_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_audits
    ADD CONSTRAINT seo_audits_page_id_key UNIQUE (page_id);


--
-- Name: seo_audits seo_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_audits
    ADD CONSTRAINT seo_audits_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: shipping_rates shipping_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates
    ADD CONSTRAINT shipping_rates_pkey PRIMARY KEY (id);


--
-- Name: shipping_rates shipping_rates_zone_id_shipping_class_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates
    ADD CONSTRAINT shipping_rates_zone_id_shipping_class_key UNIQUE (zone_id, shipping_class);


--
-- Name: shipping_tax_history shipping_tax_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_tax_history
    ADD CONSTRAINT shipping_tax_history_pkey PRIMARY KEY (id);


--
-- Name: shipping_zone_regions shipping_zone_regions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_regions
    ADD CONSTRAINT shipping_zone_regions_pkey PRIMARY KEY (id);


--
-- Name: shipping_zones shipping_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zones
    ADD CONSTRAINT shipping_zones_pkey PRIMARY KEY (id);


--
-- Name: shipping_zones shipping_zones_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zones
    ADD CONSTRAINT shipping_zones_slug_key UNIQUE (slug);


--
-- Name: site_pages site_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_pages
    ADD CONSTRAINT site_pages_pkey PRIMARY KEY (id);


--
-- Name: site_pages site_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_pages
    ADD CONSTRAINT site_pages_slug_key UNIQUE (slug);


--
-- Name: sms_messages sms_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_pkey PRIMARY KEY (id);


--
-- Name: staff staff_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_email_key UNIQUE (email);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: tax_rates tax_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates
    ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (id);


--
-- Name: traffic_sources traffic_sources_page_path_date_channel_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traffic_sources
    ADD CONSTRAINT traffic_sources_page_path_date_channel_key UNIQUE (page_path, date, channel);


--
-- Name: traffic_sources traffic_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.traffic_sources
    ADD CONSTRAINT traffic_sources_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_fingerprint_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_fingerprint_key UNIQUE (fingerprint);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: idx_analytics_sync_log_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_sync_log_date ON public.analytics_sync_log USING btree (sync_date DESC);


--
-- Name: idx_analytics_sync_log_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_sync_log_status ON public.analytics_sync_log USING btree (status);


--
-- Name: idx_audit_history_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_history_page ON public.audit_history USING btree (page_id, audited_at DESC);


--
-- Name: idx_audit_log_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_created ON public.audit_log USING btree (created_at DESC);


--
-- Name: idx_audit_log_record; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_record ON public.audit_log USING btree (record_id);


--
-- Name: idx_audit_log_table; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_table ON public.audit_log USING btree (table_name);


--
-- Name: idx_audit_log_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_user ON public.audit_log USING btree (user_id);


--
-- Name: idx_carts_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carts_customer ON public.carts USING btree (customer_id);


--
-- Name: idx_carts_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carts_email ON public.carts USING btree (email);


--
-- Name: idx_carts_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carts_session ON public.carts USING btree (session_id);


--
-- Name: idx_carts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_carts_status ON public.carts USING btree (status);


--
-- Name: idx_customers_auth_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_auth_user ON public.customers USING btree (auth_user_id);


--
-- Name: idx_customers_customer_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_customer_status ON public.customers USING btree (customer_status);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_email ON public.customers USING btree (email);


--
-- Name: idx_customers_first_seen_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_first_seen_at ON public.customers USING btree (first_seen_at DESC);


--
-- Name: idx_customers_first_utm_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_first_utm_campaign ON public.customers USING btree (first_utm_campaign);


--
-- Name: idx_customers_first_utm_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_first_utm_source ON public.customers USING btree (first_utm_source);


--
-- Name: idx_customers_ltv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_ltv ON public.customers USING btree (ltv_tier);


--
-- Name: idx_customers_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_state ON public.customers USING btree (state);


--
-- Name: idx_email_messages_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_created ON public.email_messages USING btree (created_at DESC);


--
-- Name: idx_email_messages_direction; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_direction ON public.email_messages USING btree (direction);


--
-- Name: idx_email_messages_from; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_from ON public.email_messages USING btree (from_email);


--
-- Name: idx_email_messages_imap_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_email_messages_imap_id_unique ON public.email_messages USING btree (imap_message_id) WHERE (imap_message_id IS NOT NULL);


--
-- Name: idx_email_messages_lead; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_lead ON public.email_messages USING btree (lead_id);


--
-- Name: idx_email_messages_ses_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_email_messages_ses_id_unique ON public.email_messages USING btree (ses_message_id) WHERE (ses_message_id IS NOT NULL);


--
-- Name: idx_email_messages_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_status ON public.email_messages USING btree (status);


--
-- Name: idx_email_messages_thread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_thread ON public.email_messages USING btree (thread_id);


--
-- Name: idx_email_messages_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_messages_to ON public.email_messages USING btree (to_email);


--
-- Name: idx_galleries_display_on_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_galleries_display_on_page ON public.galleries USING btree (display_on_page);


--
-- Name: idx_galleries_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_galleries_slug ON public.galleries USING btree (slug);


--
-- Name: idx_gallery_assignments_gallery_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_assignments_gallery_id ON public.gallery_assignments USING btree (gallery_id);


--
-- Name: idx_gallery_assignments_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_assignments_image_id ON public.gallery_assignments USING btree (image_id);


--
-- Name: idx_gallery_images_is_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_images_is_featured ON public.gallery_images USING btree (is_featured);


--
-- Name: idx_gallery_images_product_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_images_product_type ON public.gallery_images USING btree (product_type);


--
-- Name: idx_gallery_images_project_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_images_project_type ON public.gallery_images USING btree (project_type);


--
-- Name: idx_google_ads_campaigns_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_google_ads_campaigns_campaign_id ON public.google_ads_campaigns USING btree (campaign_id);


--
-- Name: idx_google_ads_campaigns_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_google_ads_campaigns_date ON public.google_ads_campaigns USING btree (date);


--
-- Name: idx_google_ads_keywords_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_google_ads_keywords_campaign ON public.google_ads_keywords USING btree (campaign_id);


--
-- Name: idx_google_ads_keywords_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_google_ads_keywords_date ON public.google_ads_keywords USING btree (date);


--
-- Name: idx_google_ads_sync_log_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_google_ads_sync_log_date ON public.google_ads_sync_log USING btree (sync_date);


--
-- Name: idx_journey_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journey_events_created_at ON public.journey_events USING btree (created_at DESC);


--
-- Name: idx_journey_events_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journey_events_customer_id ON public.journey_events USING btree (customer_id);


--
-- Name: idx_journey_events_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journey_events_event_type ON public.journey_events USING btree (event_type);


--
-- Name: idx_journey_events_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journey_events_session_id ON public.journey_events USING btree (session_id);


--
-- Name: idx_journey_events_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journey_events_visitor_id ON public.journey_events USING btree (visitor_id);


--
-- Name: idx_leads_assigned; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_assigned ON public.leads USING btree (assigned_to);


--
-- Name: idx_leads_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_created ON public.leads USING btree (created_at DESC);


--
-- Name: idx_leads_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_email ON public.leads USING btree (email);


--
-- Name: idx_leads_pipeline; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_pipeline ON public.leads USING btree (pipeline_order, status);


--
-- Name: idx_leads_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_status ON public.leads USING btree (status);


--
-- Name: idx_legacy_leads_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_email ON public.legacy_leads USING btree (email);


--
-- Name: idx_legacy_leads_entry_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_entry_date ON public.legacy_leads USING btree (entry_date DESC);


--
-- Name: idx_legacy_leads_entry_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_entry_id ON public.legacy_leads USING btree (gravity_form_entry_id);


--
-- Name: idx_legacy_leads_interest; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_interest ON public.legacy_leads USING btree (interest);


--
-- Name: idx_legacy_leads_landing_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_landing_page ON public.legacy_leads USING btree (landing_page);


--
-- Name: idx_legacy_leads_salesperson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_leads_salesperson ON public.legacy_leads USING btree (previous_salesperson);


--
-- Name: idx_legacy_line_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_line_items_order ON public.legacy_line_items USING btree (legacy_order_id);


--
-- Name: idx_legacy_line_items_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_line_items_type ON public.legacy_line_items USING btree (item_type);


--
-- Name: idx_legacy_orders_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_date ON public.legacy_orders USING btree (order_date DESC);


--
-- Name: idx_legacy_orders_device; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_device ON public.legacy_orders USING btree (device_type);


--
-- Name: idx_legacy_orders_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_email ON public.legacy_orders USING btree (email);


--
-- Name: idx_legacy_orders_salesperson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_salesperson ON public.legacy_orders USING btree (salesperson_username);


--
-- Name: idx_legacy_orders_source_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_source_type ON public.legacy_orders USING btree (source_type);


--
-- Name: idx_legacy_orders_utm_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_utm_source ON public.legacy_orders USING btree (utm_source);


--
-- Name: idx_legacy_orders_woo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_orders_woo_id ON public.legacy_orders USING btree (woo_order_id);


--
-- Name: idx_legacy_panel_specs_line_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_panel_specs_line_item ON public.legacy_panel_specs USING btree (legacy_line_item_id);


--
-- Name: idx_legacy_product_mapping_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_product_mapping_name ON public.legacy_product_mapping USING btree (legacy_product_name);


--
-- Name: idx_legacy_product_mapping_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_legacy_product_mapping_sku ON public.legacy_product_mapping USING btree (new_product_sku);


--
-- Name: idx_line_item_options_line_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_line_item_options_line_item ON public.line_item_options USING btree (line_item_id);


--
-- Name: idx_line_items_cart; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_line_items_cart ON public.line_items USING btree (cart_id);


--
-- Name: idx_line_items_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_line_items_order ON public.line_items USING btree (order_id);


--
-- Name: idx_line_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_line_items_product ON public.line_items USING btree (product_id);


--
-- Name: idx_notification_log_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_log_reference ON public.notification_log USING btree (reference_id);


--
-- Name: idx_notification_log_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_log_sent_at ON public.notification_log USING btree (sent_at DESC);


--
-- Name: idx_notification_log_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_log_type ON public.notification_log USING btree (notification_type);


--
-- Name: idx_option_values_option; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_option_values_option ON public.option_values USING btree (option_id);


--
-- Name: idx_orders_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_created ON public.orders USING btree (created_at DESC);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_email ON public.orders USING btree (email);


--
-- Name: idx_orders_first_utm_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_first_utm_source ON public.orders USING btree (first_utm_source);


--
-- Name: idx_orders_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_number ON public.orders USING btree (order_number);


--
-- Name: idx_orders_order_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_order_source ON public.orders USING btree (order_source);


--
-- Name: idx_orders_salesperson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_salesperson ON public.orders USING btree (salesperson_username);


--
-- Name: idx_orders_salesperson_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_salesperson_id ON public.orders USING btree (salesperson_id);


--
-- Name: idx_orders_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_session_id ON public.orders USING btree (session_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_visitor_id ON public.orders USING btree (visitor_id);


--
-- Name: idx_page_analytics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_analytics_date ON public.page_analytics USING btree (date DESC);


--
-- Name: idx_page_analytics_organic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_analytics_organic ON public.page_analytics USING btree (organic_sessions DESC);


--
-- Name: idx_page_analytics_page_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_analytics_page_path ON public.page_analytics USING btree (page_path);


--
-- Name: idx_page_approvals_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_approvals_page ON public.page_approvals USING btree (page_id, requested_at DESC);


--
-- Name: idx_page_approvals_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_approvals_pending ON public.page_approvals USING btree (is_complete) WHERE (is_complete = false);


--
-- Name: idx_page_audit_sequence_incomplete; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_audit_sequence_incomplete ON public.page_audit_sequence USING btree (page_id) WHERE (is_complete = false);


--
-- Name: idx_page_audit_sequence_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_audit_sequence_page ON public.page_audit_sequence USING btree (page_id);


--
-- Name: idx_page_issues_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_category ON public.page_issues USING btree (category);


--
-- Name: idx_page_issues_open; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_open ON public.page_issues USING btree (page_id) WHERE (status = ANY (ARRAY['open'::public.issue_status, 'acknowledged'::public.issue_status, 'in_progress'::public.issue_status]));


--
-- Name: idx_page_issues_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_page ON public.page_issues USING btree (page_id);


--
-- Name: idx_page_issues_severity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_severity ON public.page_issues USING btree (severity);


--
-- Name: idx_page_issues_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_status ON public.page_issues USING btree (status);


--
-- Name: idx_page_issues_updated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_issues_updated ON public.page_issues USING btree (updated_at DESC);


--
-- Name: idx_page_notes_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_notes_page ON public.page_notes USING btree (page_id);


--
-- Name: idx_page_notes_pinned; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_notes_pinned ON public.page_notes USING btree (page_id) WHERE (is_pinned = true);


--
-- Name: idx_page_views_page_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_page_path ON public.page_views USING btree (page_path);


--
-- Name: idx_page_views_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_session_id ON public.page_views USING btree (session_id);


--
-- Name: idx_page_views_viewed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_viewed_at ON public.page_views USING btree (viewed_at DESC);


--
-- Name: idx_page_views_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_visitor_id ON public.page_views USING btree (visitor_id);


--
-- Name: idx_performance_audits_page_latest; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_performance_audits_page_latest ON public.performance_audits USING btree (page_id, audited_at DESC);


--
-- Name: idx_pricing_history_changed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pricing_history_changed_at ON public.product_pricing_history USING btree (changed_at);


--
-- Name: idx_pricing_history_pricing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pricing_history_pricing_id ON public.product_pricing_history USING btree (pricing_id);


--
-- Name: idx_product_options_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_options_product ON public.product_options USING btree (product_id);


--
-- Name: idx_product_pricing_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_pricing_category ON public.product_pricing USING btree (category);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_products_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_sku ON public.products USING btree (sku);


--
-- Name: idx_products_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_type ON public.products USING btree (product_type);


--
-- Name: idx_project_photos_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_photos_project ON public.project_photos USING btree (project_id);


--
-- Name: idx_projects_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_created ON public.projects USING btree (created_at DESC);


--
-- Name: idx_projects_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_customer ON public.projects USING btree (customer_id);


--
-- Name: idx_projects_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_email ON public.projects USING btree (email);


--
-- Name: idx_projects_lead; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_lead ON public.projects USING btree (lead_id);


--
-- Name: idx_projects_share_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_share_token ON public.projects USING btree (share_token);


--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);


--
-- Name: idx_sessions_converted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_converted ON public.sessions USING btree (converted) WHERE (converted = true);


--
-- Name: idx_sessions_landing_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_landing_page ON public.sessions USING btree (landing_page);


--
-- Name: idx_sessions_started_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_started_at ON public.sessions USING btree (started_at DESC);


--
-- Name: idx_sessions_utm_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_utm_campaign ON public.sessions USING btree (utm_campaign);


--
-- Name: idx_sessions_utm_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_utm_source ON public.sessions USING btree (utm_source);


--
-- Name: idx_sessions_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_visitor_id ON public.sessions USING btree (visitor_id);


--
-- Name: idx_shipping_rates_zone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_rates_zone ON public.shipping_rates USING btree (zone_id);


--
-- Name: idx_shipping_tax_history_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_tax_history_date ON public.shipping_tax_history USING btree (changed_at);


--
-- Name: idx_shipping_tax_history_record; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_tax_history_record ON public.shipping_tax_history USING btree (table_name, record_id);


--
-- Name: idx_shipping_zones_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_zones_sort ON public.shipping_zones USING btree (sort_order);


--
-- Name: idx_site_pages_approval; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_approval ON public.site_pages USING btree (approval_status);


--
-- Name: idx_site_pages_batch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_batch ON public.site_pages USING btree (migration_batch);


--
-- Name: idx_site_pages_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_priority ON public.site_pages USING btree (migration_priority DESC);


--
-- Name: idx_site_pages_review_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_review_status ON public.site_pages USING btree (review_status);


--
-- Name: idx_site_pages_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_status ON public.site_pages USING btree (migration_status);


--
-- Name: idx_site_pages_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_pages_type ON public.site_pages USING btree (page_type);


--
-- Name: idx_sms_messages_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sms_messages_created ON public.sms_messages USING btree (created_at DESC);


--
-- Name: idx_sms_messages_direction; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sms_messages_direction ON public.sms_messages USING btree (direction);


--
-- Name: idx_sms_messages_from; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sms_messages_from ON public.sms_messages USING btree (from_number);


--
-- Name: idx_sms_messages_lead; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sms_messages_lead ON public.sms_messages USING btree (lead_id);


--
-- Name: idx_sms_messages_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sms_messages_to ON public.sms_messages USING btree (to_number);


--
-- Name: idx_sms_messages_twilio_sid_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_sms_messages_twilio_sid_unique ON public.sms_messages USING btree (twilio_sid) WHERE (twilio_sid IS NOT NULL);


--
-- Name: idx_staff_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_staff_active ON public.staff USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_staff_auth_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_staff_auth_user ON public.staff USING btree (auth_user_id);


--
-- Name: idx_tax_rates_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tax_rates_lookup ON public.tax_rates USING btree (country_code, state_code, postcode);


--
-- Name: idx_traffic_sources_channel; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_traffic_sources_channel ON public.traffic_sources USING btree (channel);


--
-- Name: idx_traffic_sources_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_traffic_sources_date ON public.traffic_sources USING btree (date DESC);


--
-- Name: idx_traffic_sources_page_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_traffic_sources_page_path ON public.traffic_sources USING btree (page_path);


--
-- Name: idx_visitors_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_customer_id ON public.visitors USING btree (customer_id);


--
-- Name: idx_visitors_fingerprint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_fingerprint ON public.visitors USING btree (fingerprint);


--
-- Name: idx_visitors_first_seen; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_first_seen ON public.visitors USING btree (first_seen_at DESC);


--
-- Name: idx_visitors_first_utm_campaign; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_first_utm_campaign ON public.visitors USING btree (first_utm_campaign);


--
-- Name: idx_visitors_first_utm_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_first_utm_source ON public.visitors USING btree (first_utm_source);


--
-- Name: idx_visitors_last_seen; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_last_seen ON public.visitors USING btree (last_seen_at DESC);


--
-- Name: idx_zone_regions_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zone_regions_lookup ON public.shipping_zone_regions USING btree (country_code, state_code);


--
-- Name: idx_zone_regions_zone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zone_regions_zone ON public.shipping_zone_regions USING btree (zone_id);


--
-- Name: customers audit_customers; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_customers AFTER INSERT OR DELETE OR UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: orders audit_orders; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_orders AFTER INSERT OR DELETE OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: products audit_products; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_products AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: notification_settings notification_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_notification_settings_timestamp();


--
-- Name: page_audit_sequence page_audit_sequence_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER page_audit_sequence_updated BEFORE UPDATE ON public.page_audit_sequence FOR EACH ROW EXECUTE FUNCTION public.update_page_issues_timestamp();


--
-- Name: page_issues page_issues_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER page_issues_updated BEFORE UPDATE ON public.page_issues FOR EACH ROW EXECUTE FUNCTION public.update_page_issues_timestamp();


--
-- Name: page_notes page_notes_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER page_notes_updated BEFORE UPDATE ON public.page_notes FOR EACH ROW EXECUTE FUNCTION public.update_page_issues_timestamp();


--
-- Name: product_pricing pricing_change_log; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER pricing_change_log AFTER UPDATE ON public.product_pricing FOR EACH ROW EXECUTE FUNCTION public.log_pricing_change();


--
-- Name: product_pricing product_pricing_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER product_pricing_updated_at BEFORE UPDATE ON public.product_pricing FOR EACH ROW EXECUTE FUNCTION public.update_product_pricing_timestamp();


--
-- Name: page_analytics set_page_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_page_analytics_updated_at BEFORE UPDATE ON public.page_analytics FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: sessions set_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: visitors set_visitors_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_visitors_updated_at BEFORE UPDATE ON public.visitors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: shipping_rates shipping_rate_change_log; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER shipping_rate_change_log AFTER UPDATE ON public.shipping_rates FOR EACH ROW EXECUTE FUNCTION public.log_shipping_rate_change();


--
-- Name: shipping_rates shipping_rates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER shipping_rates_updated_at BEFORE UPDATE ON public.shipping_rates FOR EACH ROW EXECUTE FUNCTION public.update_shipping_rates_timestamp();


--
-- Name: shipping_zones shipping_zones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER shipping_zones_updated_at BEFORE UPDATE ON public.shipping_zones FOR EACH ROW EXECUTE FUNCTION public.update_shipping_zones_timestamp();


--
-- Name: site_pages site_pages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER site_pages_updated_at BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.update_site_pages_review();


--
-- Name: tax_rates tax_rate_change_log; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tax_rate_change_log AFTER UPDATE ON public.tax_rates FOR EACH ROW EXECUTE FUNCTION public.log_tax_rate_change();


--
-- Name: tax_rates tax_rates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tax_rates_updated_at BEFORE UPDATE ON public.tax_rates FOR EACH ROW EXECUTE FUNCTION public.update_tax_rates_timestamp();


--
-- Name: journey_events trigger_update_customer_on_event; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_customer_on_event AFTER INSERT ON public.journey_events FOR EACH ROW EXECUTE FUNCTION public.update_customer_on_event();


--
-- Name: page_views trigger_update_pageview_counts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_pageview_counts AFTER INSERT ON public.page_views FOR EACH ROW EXECUTE FUNCTION public.update_visitor_pageview_count();


--
-- Name: sessions trigger_update_visitor_on_session; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_visitor_on_session AFTER INSERT ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_visitor_on_session();


--
-- Name: carts update_carts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_customer_on_order; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_customer_on_order AFTER INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_customer_metrics();


--
-- Name: customers update_customers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: email_messages update_email_messages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_messages_updated_at BEFORE UPDATE ON public.email_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: galleries update_galleries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: gallery_images update_gallery_images_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leads update_leads_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: line_items update_line_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_line_items_updated_at BEFORE UPDATE ON public.line_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: projects update_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: staff update_staff_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ai_readiness_audits ai_readiness_audits_audited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_readiness_audits
    ADD CONSTRAINT ai_readiness_audits_audited_by_fkey FOREIGN KEY (audited_by) REFERENCES auth.users(id);


--
-- Name: ai_readiness_audits ai_readiness_audits_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_readiness_audits
    ADD CONSTRAINT ai_readiness_audits_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: audit_history audit_history_audited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_history
    ADD CONSTRAINT audit_history_audited_by_fkey FOREIGN KEY (audited_by) REFERENCES auth.users(id);


--
-- Name: audit_history audit_history_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_history
    ADD CONSTRAINT audit_history_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: carts carts_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: customers customers_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: email_messages email_messages_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: email_messages email_messages_reply_to_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_messages
    ADD CONSTRAINT email_messages_reply_to_message_id_fkey FOREIGN KEY (reply_to_message_id) REFERENCES public.email_messages(id) ON DELETE SET NULL;


--
-- Name: line_items fk_line_items_order; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT fk_line_items_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: gallery_assignments gallery_assignments_gallery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_assignments
    ADD CONSTRAINT gallery_assignments_gallery_id_fkey FOREIGN KEY (gallery_id) REFERENCES public.galleries(id) ON DELETE CASCADE;


--
-- Name: gallery_assignments gallery_assignments_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_assignments
    ADD CONSTRAINT gallery_assignments_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.gallery_images(id) ON DELETE CASCADE;


--
-- Name: journey_events journey_events_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_events
    ADD CONSTRAINT journey_events_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: journey_events journey_events_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_events
    ADD CONSTRAINT journey_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;


--
-- Name: journey_events journey_events_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_events
    ADD CONSTRAINT journey_events_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: leads leads_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.staff(id) ON DELETE SET NULL;


--
-- Name: legacy_leads legacy_leads_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_leads
    ADD CONSTRAINT legacy_leads_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: legacy_line_items legacy_line_items_legacy_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_line_items
    ADD CONSTRAINT legacy_line_items_legacy_order_id_fkey FOREIGN KEY (legacy_order_id) REFERENCES public.legacy_orders(id) ON DELETE CASCADE;


--
-- Name: legacy_line_items legacy_line_items_new_line_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_line_items
    ADD CONSTRAINT legacy_line_items_new_line_item_id_fkey FOREIGN KEY (new_line_item_id) REFERENCES public.line_items(id) ON DELETE SET NULL;


--
-- Name: legacy_orders legacy_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_orders
    ADD CONSTRAINT legacy_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: legacy_orders legacy_orders_new_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_orders
    ADD CONSTRAINT legacy_orders_new_order_id_fkey FOREIGN KEY (new_order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: legacy_panel_specs legacy_panel_specs_legacy_line_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_panel_specs
    ADD CONSTRAINT legacy_panel_specs_legacy_line_item_id_fkey FOREIGN KEY (legacy_line_item_id) REFERENCES public.legacy_line_items(id) ON DELETE CASCADE;


--
-- Name: legacy_product_mapping legacy_product_mapping_new_product_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_product_mapping
    ADD CONSTRAINT legacy_product_mapping_new_product_sku_fkey FOREIGN KEY (new_product_sku) REFERENCES public.products(sku);


--
-- Name: line_item_options line_item_options_line_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_item_options
    ADD CONSTRAINT line_item_options_line_item_id_fkey FOREIGN KEY (line_item_id) REFERENCES public.line_items(id) ON DELETE CASCADE;


--
-- Name: line_items line_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: line_items line_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: line_items line_items_related_line_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_items_related_line_item_id_fkey FOREIGN KEY (related_line_item_id) REFERENCES public.line_items(id) ON DELETE SET NULL;


--
-- Name: option_values option_values_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.option_values
    ADD CONSTRAINT option_values_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.product_options(id) ON DELETE CASCADE;


--
-- Name: orders orders_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.staff(id) ON DELETE SET NULL;


--
-- Name: orders orders_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE SET NULL;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: orders orders_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: orders orders_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;


--
-- Name: orders orders_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE SET NULL;


--
-- Name: page_approvals page_approvals_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_approvals
    ADD CONSTRAINT page_approvals_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: page_approvals page_approvals_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_approvals
    ADD CONSTRAINT page_approvals_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES auth.users(id);


--
-- Name: page_approvals page_approvals_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_approvals
    ADD CONSTRAINT page_approvals_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: page_audit_sequence page_audit_sequence_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_audit_sequence
    ADD CONSTRAINT page_audit_sequence_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: page_issues page_issues_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_issues
    ADD CONSTRAINT page_issues_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: page_issues page_issues_related_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_issues
    ADD CONSTRAINT page_issues_related_issue_id_fkey FOREIGN KEY (related_issue_id) REFERENCES public.page_issues(id);


--
-- Name: page_notes page_notes_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_notes
    ADD CONSTRAINT page_notes_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: page_views page_views_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- Name: page_views page_views_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: performance_audits performance_audits_audited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_audits
    ADD CONSTRAINT performance_audits_audited_by_fkey FOREIGN KEY (audited_by) REFERENCES auth.users(id);


--
-- Name: performance_audits performance_audits_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_audits
    ADD CONSTRAINT performance_audits_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: product_options product_options_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_pricing product_pricing_base_price_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_pricing
    ADD CONSTRAINT product_pricing_base_price_id_fkey FOREIGN KEY (base_price_id) REFERENCES public.product_pricing(id);


--
-- Name: product_pricing_history product_pricing_history_pricing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_pricing_history
    ADD CONSTRAINT product_pricing_history_pricing_id_fkey FOREIGN KEY (pricing_id) REFERENCES public.product_pricing(id);


--
-- Name: project_photos project_photos_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_photos
    ADD CONSTRAINT project_photos_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.staff(id) ON DELETE SET NULL;


--
-- Name: projects projects_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: projects projects_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: seo_audits seo_audits_audited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_audits
    ADD CONSTRAINT seo_audits_audited_by_fkey FOREIGN KEY (audited_by) REFERENCES auth.users(id);


--
-- Name: seo_audits seo_audits_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_audits
    ADD CONSTRAINT seo_audits_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.site_pages(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: shipping_rates shipping_rates_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates
    ADD CONSTRAINT shipping_rates_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.shipping_zones(id) ON DELETE CASCADE;


--
-- Name: shipping_zone_regions shipping_zone_regions_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_regions
    ADD CONSTRAINT shipping_zone_regions_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.shipping_zones(id) ON DELETE CASCADE;


--
-- Name: site_pages site_pages_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_pages
    ADD CONSTRAINT site_pages_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id);


--
-- Name: sms_messages sms_messages_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_messages
    ADD CONSTRAINT sms_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: staff staff_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: visitors visitors_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: galleries Admins can manage galleries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage galleries" ON public.galleries USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: gallery_assignments Admins can manage gallery assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage gallery assignments" ON public.gallery_assignments USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: gallery_images Admins can manage gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: legacy_leads Allow anon read legacy_leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anon read legacy_leads" ON public.legacy_leads FOR SELECT TO anon USING (true);


--
-- Name: legacy_leads Allow authenticated read legacy_leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated read legacy_leads" ON public.legacy_leads FOR SELECT TO authenticated USING (true);


--
-- Name: issue_templates Allow read for authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated" ON public.issue_templates FOR SELECT TO authenticated USING (true);


--
-- Name: page_audit_sequence Allow read for authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated" ON public.page_audit_sequence FOR SELECT TO authenticated USING (true);


--
-- Name: page_issues Allow read for authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated" ON public.page_issues FOR SELECT TO authenticated USING (true);


--
-- Name: page_notes Allow read for authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated" ON public.page_notes FOR SELECT TO authenticated USING (true);


--
-- Name: ai_readiness_audits Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.ai_readiness_audits FOR SELECT TO authenticated USING (true);


--
-- Name: audit_history Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.audit_history FOR SELECT TO authenticated USING (true);


--
-- Name: page_approvals Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.page_approvals FOR SELECT TO authenticated USING (true);


--
-- Name: performance_audits Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.performance_audits FOR SELECT TO authenticated USING (true);


--
-- Name: seo_audits Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.seo_audits FOR SELECT TO authenticated USING (true);


--
-- Name: site_pages Allow read for authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read for authenticated users" ON public.site_pages FOR SELECT TO authenticated USING (true);


--
-- Name: legacy_leads Allow read legacy_leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read legacy_leads" ON public.legacy_leads FOR SELECT USING (true);


--
-- Name: legacy_orders Allow read legacy_orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read legacy_orders" ON public.legacy_orders FOR SELECT USING (true);


--
-- Name: leads Anyone can create leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);


--
-- Name: projects Anyone can create projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create projects" ON public.projects FOR INSERT WITH CHECK (true);


--
-- Name: products Anyone can view active products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING ((is_active = true));


--
-- Name: line_item_options Anyone can view line item options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view line item options" ON public.line_item_options FOR SELECT USING (true);


--
-- Name: line_items Anyone can view line items for accessible carts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view line items for accessible carts" ON public.line_items FOR SELECT USING (((cart_id IN ( SELECT carts.id
   FROM public.carts
  WHERE (carts.session_id IS NOT NULL))) OR (EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true))))));


--
-- Name: option_values Anyone can view option values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view option values" ON public.option_values FOR SELECT USING (true);


--
-- Name: product_options Anyone can view product options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view product options" ON public.product_options FOR SELECT USING (true);


--
-- Name: projects Anyone can view projects by share token; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view projects by share token" ON public.projects FOR SELECT USING ((share_token IS NOT NULL));


--
-- Name: analytics_sync_log Authenticated users can read analytics_sync_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read analytics_sync_log" ON public.analytics_sync_log FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: legacy_leads Authenticated users can read legacy_leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read legacy_leads" ON public.legacy_leads FOR SELECT TO authenticated USING (true);


--
-- Name: page_analytics Authenticated users can read page_analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read page_analytics" ON public.page_analytics FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: traffic_sources Authenticated users can read traffic_sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read traffic_sources" ON public.traffic_sources FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: orders Customers can view own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.auth_user_id = auth.uid()))));


--
-- Name: projects Customers can view own projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can view own projects" ON public.projects FOR SELECT USING ((customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.auth_user_id = auth.uid()))));


--
-- Name: gallery_assignments Public can view gallery assignments for published galleries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view gallery assignments for published galleries" ON public.gallery_assignments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.galleries g
  WHERE ((g.id = gallery_assignments.gallery_id) AND (g.is_published = true)))));


--
-- Name: gallery_images Public can view gallery images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view gallery images" ON public.gallery_images FOR SELECT USING (true);


--
-- Name: galleries Public can view published galleries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view published galleries" ON public.galleries FOR SELECT USING ((is_published = true));


--
-- Name: email_messages Service role can insert email messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert email messages" ON public.email_messages FOR INSERT WITH CHECK (true);


--
-- Name: sms_messages Service role can insert sms messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert sms messages" ON public.sms_messages FOR INSERT WITH CHECK (true);


--
-- Name: ai_readiness_audits Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.ai_readiness_audits TO service_role USING (true) WITH CHECK (true);


--
-- Name: audit_history Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.audit_history TO service_role USING (true) WITH CHECK (true);


--
-- Name: issue_templates Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.issue_templates TO service_role USING (true) WITH CHECK (true);


--
-- Name: page_approvals Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.page_approvals TO service_role USING (true) WITH CHECK (true);


--
-- Name: page_audit_sequence Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.page_audit_sequence TO service_role USING (true) WITH CHECK (true);


--
-- Name: page_issues Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.page_issues TO service_role USING (true) WITH CHECK (true);


--
-- Name: page_notes Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.page_notes TO service_role USING (true) WITH CHECK (true);


--
-- Name: performance_audits Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.performance_audits TO service_role USING (true) WITH CHECK (true);


--
-- Name: seo_audits Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.seo_audits TO service_role USING (true) WITH CHECK (true);


--
-- Name: site_pages Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.site_pages TO service_role USING (true) WITH CHECK (true);


--
-- Name: google_ads_campaigns Service role full access to google_ads_campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access to google_ads_campaigns" ON public.google_ads_campaigns USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


--
-- Name: google_ads_keywords Service role full access to google_ads_keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access to google_ads_keywords" ON public.google_ads_keywords USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


--
-- Name: google_ads_sync_log Service role full access to google_ads_sync_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access to google_ads_sync_log" ON public.google_ads_sync_log USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


--
-- Name: legacy_leads Service role full access to legacy_leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access to legacy_leads" ON public.legacy_leads TO service_role USING (true) WITH CHECK (true);


--
-- Name: analytics_sync_log Service role has full access to analytics_sync_log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to analytics_sync_log" ON public.analytics_sync_log USING ((auth.role() = 'service_role'::text));


--
-- Name: journey_events Service role has full access to journey_events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to journey_events" ON public.journey_events USING ((auth.role() = 'service_role'::text));


--
-- Name: page_analytics Service role has full access to page_analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to page_analytics" ON public.page_analytics USING ((auth.role() = 'service_role'::text));


--
-- Name: page_views Service role has full access to page_views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to page_views" ON public.page_views USING ((auth.role() = 'service_role'::text));


--
-- Name: sessions Service role has full access to sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to sessions" ON public.sessions USING ((auth.role() = 'service_role'::text));


--
-- Name: traffic_sources Service role has full access to traffic_sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to traffic_sources" ON public.traffic_sources USING ((auth.role() = 'service_role'::text));


--
-- Name: visitors Service role has full access to visitors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to visitors" ON public.visitors USING ((auth.role() = 'service_role'::text));


--
-- Name: legacy_line_items Staff can access legacy line items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can access legacy line items" ON public.legacy_line_items USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: legacy_orders Staff can access legacy orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can access legacy orders" ON public.legacy_orders USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: legacy_panel_specs Staff can access legacy panel specs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can access legacy panel specs" ON public.legacy_panel_specs USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: email_messages Staff can manage email messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage email messages" ON public.email_messages USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: option_values Staff can manage option values; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage option values" ON public.option_values USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: orders Staff can manage orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage orders" ON public.orders USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: product_options Staff can manage product options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage product options" ON public.product_options USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: products Staff can manage products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage products" ON public.products USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: sms_messages Staff can manage sms messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can manage sms messages" ON public.sms_messages USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: leads Staff can update leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update leads" ON public.leads FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: projects Staff can update projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can update projects" ON public.projects FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: carts Staff can view all carts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all carts" ON public.carts FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: leads Staff can view all leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all leads" ON public.leads FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: orders Staff can view all orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all orders" ON public.orders FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: projects Staff can view all projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view all projects" ON public.projects FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: audit_log Staff can view audit log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff can view audit log" ON public.audit_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.staff
  WHERE ((staff.auth_user_id = auth.uid()) AND (staff.is_active = true)))));


--
-- Name: carts Users can create carts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create carts" ON public.carts FOR INSERT WITH CHECK (true);


--
-- Name: line_item_options Users can manage line item options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage line item options" ON public.line_item_options USING (true);


--
-- Name: line_items Users can manage line items in own cart; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage line items in own cart" ON public.line_items USING ((cart_id IN ( SELECT carts.id
   FROM public.carts
  WHERE (carts.session_id IS NOT NULL))));


--
-- Name: carts Users can update own cart; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own cart" ON public.carts FOR UPDATE USING (((session_id IS NOT NULL) OR (customer_id IN ( SELECT customers.id
   FROM public.customers
  WHERE (customers.auth_user_id = auth.uid())))));


--
-- Name: carts Users can view own cart by session; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own cart by session" ON public.carts FOR SELECT USING ((session_id IS NOT NULL));


--
-- Name: ai_readiness_audits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_readiness_audits ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_sync_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_sync_log ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_history ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: carts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

--
-- Name: customers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

--
-- Name: email_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: galleries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery_assignments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery_assignments ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

--
-- Name: google_ads_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.google_ads_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: google_ads_keywords; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.google_ads_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: google_ads_sync_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.google_ads_sync_log ENABLE ROW LEVEL SECURITY;

--
-- Name: issue_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.issue_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: journey_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;

--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: legacy_leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.legacy_leads ENABLE ROW LEVEL SECURITY;

--
-- Name: legacy_line_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.legacy_line_items ENABLE ROW LEVEL SECURITY;

--
-- Name: legacy_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.legacy_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: legacy_panel_specs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.legacy_panel_specs ENABLE ROW LEVEL SECURITY;

--
-- Name: line_item_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.line_item_options ENABLE ROW LEVEL SECURITY;

--
-- Name: line_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.line_items ENABLE ROW LEVEL SECURITY;

--
-- Name: option_values; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.option_values ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: page_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: page_approvals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_approvals ENABLE ROW LEVEL SECURITY;

--
-- Name: page_audit_sequence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_audit_sequence ENABLE ROW LEVEL SECURITY;

--
-- Name: page_issues; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_issues ENABLE ROW LEVEL SECURITY;

--
-- Name: page_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: page_views; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

--
-- Name: performance_audits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.performance_audits ENABLE ROW LEVEL SECURITY;

--
-- Name: product_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: project_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: seo_audits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: site_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

--
-- Name: sms_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: staff; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

--
-- Name: traffic_sources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.traffic_sources ENABLE ROW LEVEL SECURITY;

--
-- Name: visitors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 4pF0wdWdtG8mKlJau0wuzboNsQIYIJer0Zgh1gfNAhROat36rV0vVtKNhhXHEBT

