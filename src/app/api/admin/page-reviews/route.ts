/**
 * Page Reviews & Audit API
 * 
 * Uses site_pages table from migration 4, with review columns from migration 7/8.
 * Supports fetching detailed SEO and AI audit data via ?type= parameter.
 * 
 * GET  - Fetch pages (type=reviews|seo|ai)
 * PATCH - Update a page's review status and notes
 * POST - Create a new page
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ReviewStatus = 'pending' | 'complete' | 'needs_revision'
export type MigrationStatus = 'not_started' | 'content_extracted' | 'in_progress' | 'review' | 'approved' | 'live' | 'redirect_only' | 'deprecated'

export interface PageReview {
  id: string
  slug: string
  title: string
  wordpress_url: string | null
  page_type: string
  migration_status: MigrationStatus
  migration_priority: number
  migration_batch: string | null
  review_status: ReviewStatus
  review_notes: string | null
  revision_items: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  duplicate_canonical_url: string | null
  is_wordpress_original: boolean
  page_status: 'rebuilt' | 'redirected' | 'new' | 'replacement'
  original_post_id: number | null
  redirect_to_url: string | null
  created_at: string
  updated_at: string
  seo_score?: number | null
  ai_score?: number | null
  performance_score?: number | null
}

// =============================================================================
// GET - Fetch pages with review status, or detailed audit data
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Use admin client (service role) to bypass RLS -- this is an admin endpoint
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'reviews'

    // ----- SEO Audit Details -----
    if (type === 'seo') {
      const { data, error } = await supabase
        .from('audit_seo')
        .select(`
          *,
          site_pages!inner (
            id, slug, title, page_type, migration_status, migration_priority
          )
        `)
        .order('seo_score', { ascending: true, nullsFirst: true })

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({ audits: [], message: 'audit_seo table not found. Run migrations.' })
        }
        throw error
      }

      // Flatten the nested site_pages into each audit row
      const audits = (data || []).map((row: Record<string, unknown>) => {
        const page = row.site_pages as Record<string, unknown> | null
        const { site_pages: _removed, ...audit } = row
        return { ...audit, ...(page || {}) }
      })

      return NextResponse.json({ audits })
    }

    // ----- AI Audit Details -----
    if (type === 'ai') {
      const { data, error } = await supabase
        .from('audit_ai_readiness')
        .select(`
          *,
          site_pages!inner (
            id, slug, title, page_type, migration_status, migration_priority
          )
        `)
        .order('ai_score', { ascending: true, nullsFirst: true })

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({ audits: [], message: 'audit_ai_readiness table not found. Run migrations.' })
        }
        throw error
      }

      const audits = (data || []).map((row: Record<string, unknown>) => {
        const page = row.site_pages as Record<string, unknown> | null
        const { site_pages: _removed, ...audit } = row
        return { ...audit, ...(page || {}) }
      })

      return NextResponse.json({ audits })
    }

    // ----- Default: Page Reviews -----
    // Query site_pages directly with embedded audit scores
    // (the page_audit_dashboard view is missing wordpress_url and other useful fields)
    const { data: sitePages, error: pagesError } = await supabase
      .from('site_pages')
      .select(`
        *,
        audit_seo ( seo_score, seo_rating ),
        audit_ai_readiness ( ai_score, ai_rating )
      `)
      .order('migration_priority', { ascending: false })
      .order('title', { ascending: true })

    if (pagesError) {
      if (pagesError.code === '42P01') {
        return NextResponse.json({ 
          pages: [],
          stats: { total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 },
          message: 'Table not found. Run migrations.'
        })
      }
      throw pagesError
    }

    // Flatten embedded audit scores into page objects
    const pages = (sitePages || []).map((row: Record<string, unknown>) => {
      const seoAudit = row.audit_seo as Record<string, unknown> | null
      const aiAudit = row.audit_ai_readiness as Record<string, unknown> | null
      const { audit_seo: _s, audit_ai_readiness: _a, ...page } = row
      return {
        ...page,
        seo_score: seoAudit?.seo_score ?? null,
        ai_score: aiAudit?.ai_score ?? null,
        performance_score: null, // No performance audit yet
      }
    }) as PageReview[]
    
    const stats = {
      total: pages.length,
      pending: pages.filter(p => p.review_status === 'pending' || !p.review_status).length,
      complete: pages.filter(p => p.review_status === 'complete').length,
      needs_revision: pages.filter(p => p.review_status === 'needs_revision').length,
      built: pages.filter(p => p.migration_status === 'live').length,
    }

    return NextResponse.json({ pages, stats })
  } catch (error) {
    console.error('Error fetching page reviews:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch page reviews' },
      { status: 500 }
    )
  }
}

// =============================================================================
// PATCH - Update a page's review status and notes
// =============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, review_status, review_notes, revision_items, reviewed_by } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (review_status !== undefined) {
      updates.review_status = review_status
      updates.reviewed_at = new Date().toISOString()
    }
    if (review_notes !== undefined) updates.review_notes = review_notes || null
    if (revision_items !== undefined) updates.revision_items = revision_items || null
    if (reviewed_by !== undefined) updates.reviewed_by = reviewed_by || null

    const { data, error } = await supabase
      .from('site_pages')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ page: data })
  } catch (error) {
    console.error('Error updating page review:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update page review' },
      { status: 500 }
    )
  }
}

// =============================================================================
// POST - Create a new page (for adding pages not in tracker)
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, wordpress_url, page_type, migration_priority, migration_batch } = body

    if (!slug || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('site_pages')
      .insert({
        slug,
        title,
        wordpress_url: wordpress_url || null,
        page_type: page_type || 'informational',
        migration_priority: migration_priority || 50,
        migration_batch: migration_batch || null,
        migration_status: 'not_started',
        review_status: 'pending',
      } as never)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ page: data })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create page' },
      { status: 500 }
    )
  }
}
