import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewLeadNotification } from '@/lib/email/notifications'

/**
 * GET /api/leads?search=...
 * Search leads by email, first_name, or last_name.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    if (!search || search.length < 2) {
      return NextResponse.json({ leads: [] })
    }

    const supabase = createAdminClient()
    const pattern = `%${search}%`

    const { data, error } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name, phone, status, interest')
      .or(`email.ilike.${pattern},first_name.ilike.${pattern},last_name.ilike.${pattern}`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Lead search error:', error)
      return NextResponse.json({ leads: [] })
    }

    return NextResponse.json({ leads: data || [] })
  } catch (error) {
    console.error('Lead GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/leads
 * Update a lead's status or assigned_to.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, assigned_to } = body

    if (!id) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const update: Record<string, unknown> = {}
    if (status !== undefined) update.status = status
    if (assigned_to !== undefined) update.assigned_to = assigned_to

    const { data, error } = await supabase
      .from('leads')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Lead update error:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('Lead PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Map interest to product_type for project creation
const INTEREST_TO_PRODUCT: Record<string, string> = {
  mosquito_curtains: 'mosquito_curtains',
  clear_vinyl: 'clear_vinyl',
  both: 'mosquito_curtains', // default to MC for "both"
  raw_materials: 'raw_materials',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      email,
      firstName,
      lastName,
      phone,
      interest,
      projectType,
      message,
      source = 'quick_connect',
      photo_urls,
      // Journey tracking (UTM is on the session, not stored on leads)
      session_id,
      visitor_id,
    } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Extract photo URL strings for the leads table
    const photoUrlStrings = Array.isArray(photo_urls)
      ? photo_urls.map((p: { url: string }) => p.url)
      : []

    const { data, error } = await supabase
      .from('leads')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        interest,
        project_type: projectType,
        message,
        source,
        photo_urls: photoUrlStrings.length > 0 ? photoUrlStrings : null,
        session_id: session_id || null,
        visitor_id: visitor_id || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // -----------------------------------------------------------------------
    // Auto-create a project if photos were attached
    // -----------------------------------------------------------------------
    let projectData = null
    if (data && Array.isArray(photo_urls) && photo_urls.length > 0) {
      const productType = INTEREST_TO_PRODUCT[interest || ''] || interest || 'mosquito_curtains'

      const { data: project, error: projError } = await supabase
        .from('projects')
        .insert({
          lead_id: data.id,
          email,
          product_type: productType,
          status: 'draft',
          notes: message || null,
          session_id: session_id || null,
          visitor_id: visitor_id || null,
        })
        .select()
        .single()

      if (projError) {
        console.error('Error auto-creating project from lead:', projError)
      } else if (project) {
        projectData = project

        // Save photos to project_photos
        const photoRows = photo_urls
          .filter((p: { url?: string }) => p.url)
          .map((p: { url: string; fileName?: string }) => ({
            project_id: project.id,
            storage_path: p.url,
            filename: p.fileName || 'unknown',
            content_type: guessContentType(p.fileName || ''),
            category: 'planning',
          }))

        if (photoRows.length > 0) {
          const { error: photoErr } = await supabase
            .from('project_photos')
            .insert(photoRows)
          if (photoErr) console.error('Error saving lead project photos:', photoErr)
        }
      }
    }

    // Fire journey event: lead_created
    if (data) {
      supabase
        .from('journey_events')
        .insert({
          visitor_id: visitor_id || null,
          session_id: session_id || null,
          lead_id: data.id,
          event_type: 'lead_created',
          event_data: {
            email,
            source,
            interest,
            has_photos: Array.isArray(photo_urls) && photo_urls.length > 0,
          },
        })
        .then(({ error: evtErr }) => {
          if (evtErr) console.error('Error firing lead_created journey event:', evtErr)
        })
    }

    // Send new lead notification to sales team (fire-and-forget)
    if (data) {
      sendNewLeadNotification({
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email,
        phone: data.phone || undefined,
        interest: data.interest || undefined,
        projectType: data.project_type || undefined,
        message: data.message || undefined,
        source: data.source || source || 'quick_connect',
        createdAt: data.created_at || new Date().toISOString(),
      }).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      lead: data,
      project: projectData,
    })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/** Guess content type from filename */
function guessContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', heic: 'image/heic', pdf: 'application/pdf',
    mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  }
  return map[ext || ''] || 'image/jpeg'
}
