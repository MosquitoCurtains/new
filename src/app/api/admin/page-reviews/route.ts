/**
 * Page Reviews API
 * 
 * Uses site_pages table from migration 4, with review columns from migration 7.
 * 
 * GET  - Fetch all pages with review status
 * PATCH - Update a page's review status and notes
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  created_at: string
  updated_at: string
  // SEO audit data (if available)
  seo_score?: number | null
  // AI audit data (if available)
  ai_score?: number | null
  // Performance audit data (if available)
  performance_score?: number | null
}

// =============================================================================
// GET - Fetch all pages with review status
// =============================================================================

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try to use the dashboard view first (includes audit scores)
    let data: PageReview[] | null = null
    let error = null
    
    // First try the view
    const viewResult = await supabase
      .from('page_audit_dashboard')
      .select('*')
      .order('migration_priority', { ascending: false })
      .order('title', { ascending: true })
    
    if (viewResult.error) {
      // If view doesn't exist, fall back to site_pages table
      const tableResult = await supabase
        .from('site_pages')
        .select('*')
        .order('migration_priority', { ascending: false })
        .order('title', { ascending: true })
      
      data = tableResult.data as PageReview[] | null
      error = tableResult.error
    } else {
      data = viewResult.data as PageReview[] | null
    }

    if (error) {
      // If table doesn't exist yet
      if (error.code === '42P01') {
        return NextResponse.json({ 
          pages: [],
          stats: { total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 },
          message: 'Table not found. Run migrations 20260205000004 and 20260205000007.'
        })
      }
      throw error
    }

    const pages = data || []
    
    // Calculate stats
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

    const supabase = await createClient()

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
      .update(updates)
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

    const supabase = await createClient()

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
      })
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
