import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/sales/projects
 * Create a new sales project from a lead.
 * Accepts lead_id (existing) OR email/name/phone (creates new lead).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      lead_id,
      email,
      first_name,
      last_name,
      phone,
      product_type,
      assigned_to,
      project_name,
    } = body

    const supabase = createAdminClient()

    let leadId = lead_id
    let leadEmail = email
    let leadFirstName = first_name
    let leadLastName = last_name
    let leadPhone = phone

    // If no lead_id, create a new lead
    if (!leadId) {
      if (!email) {
        return NextResponse.json(
          { error: 'Either lead_id or email is required' },
          { status: 400 }
        )
      }

      // Check if lead already exists with this email
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, phone')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existingLead) {
        leadId = existingLead.id
        leadEmail = existingLead.email
        leadFirstName = existingLead.first_name || first_name
        leadLastName = existingLead.last_name || last_name
        leadPhone = existingLead.phone || phone
      } else {
        const { data: newLead, error: leadError } = await supabase
          .from('leads')
          .insert({
            email,
            first_name,
            last_name,
            phone,
            interest: product_type || 'curtains',
            source: 'admin_sales',
            status: 'open',
          })
          .select('id, email, first_name, last_name, phone')
          .single()

        if (leadError || !newLead) {
          console.error('Error creating lead:', leadError)
          return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
          )
        }

        leadId = newLead.id
        leadEmail = newLead.email
        leadFirstName = newLead.first_name
        leadLastName = newLead.last_name
        leadPhone = newLead.phone
      }
    } else {
      // Fetch existing lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, phone')
        .eq('id', leadId)
        .single()

      if (!lead) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        )
      }

      leadEmail = lead.email
      leadFirstName = lead.first_name
      leadLastName = lead.last_name
      leadPhone = lead.phone
    }

    // Create the project linked to the lead
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        lead_id: leadId,
        email: leadEmail,
        first_name: leadFirstName,
        last_name: leadLastName,
        phone: leadPhone,
        product_type: product_type || 'curtains',
        project_name: project_name || null,
        status: 'draft',
        assigned_to: assigned_to || null,
        cart_data: [],
      })
      .select('*')
      .single()

    if (projectError || !project) {
      console.error('Error creating project:', projectError)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // Update lead status to pending (picked up by sales)
    await supabase
      .from('leads')
      .update({ status: 'pending', assigned_to: assigned_to || null })
      .eq('id', leadId)

    return NextResponse.json({
      success: true,
      project,
      shareUrl: `/project/${project.share_token}`,
    })
  } catch (error) {
    console.error('Sales project POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/sales/projects
 * List active sales projects, optionally filtered by assigned_to.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignedTo = searchParams.get('assigned_to')
    const status = searchParams.get('status')
    const leadId = searchParams.get('lead_id')

    const supabase = createAdminClient()

    let query = supabase
      .from('projects')
      .select(`
        *,
        leads!lead_id (
          id, email, first_name, last_name, phone, status, interest
        )
      `)
      .not('lead_id', 'is', null)
      .order('updated_at', { ascending: false })

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (leadId) {
      query = query.eq('lead_id', leadId)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({ projects: data || [] })
  } catch (error) {
    console.error('Sales projects GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
