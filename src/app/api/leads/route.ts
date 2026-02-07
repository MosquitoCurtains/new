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
      // Attribution
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_page,
      session_id,
    } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

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
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        referrer,
        landing_page,
        session_id,
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

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
