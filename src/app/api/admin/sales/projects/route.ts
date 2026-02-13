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
    let leadVisitorId: string | null = null
    let leadSessionId: string | null = null

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
        .select('id, email, first_name, last_name, phone, visitor_id, session_id')
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
        leadVisitorId = existingLead.visitor_id || null
        leadSessionId = existingLead.session_id || null
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
          .select('id, email, first_name, last_name, phone, visitor_id, session_id')
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
        leadVisitorId = newLead.visitor_id || null
        leadSessionId = newLead.session_id || null
      }
    } else {
      // Fetch existing lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, phone, visitor_id, session_id')
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
      leadVisitorId = lead.visitor_id || null
      leadSessionId = lead.session_id || null
    }

    // Create the project linked to the lead — contact info lives on the lead
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        lead_id: leadId,
        email: leadEmail,
        product_type: product_type || 'curtains',
        project_name: project_name || null,
        status: 'draft',
        assigned_to: assigned_to || null,
        cart_data: [],
        visitor_id: leadVisitorId,
        session_id: leadSessionId,
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

    // Fire journey event: project_created
    supabase
      .from('journey_events')
      .insert({
        visitor_id: leadVisitorId,
        session_id: leadSessionId,
        lead_id: leadId,
        project_id: project.id,
        event_type: 'project_created',
        event_data: {
          product_type: product_type || 'curtains',
          assigned_to: assigned_to || null,
          source: 'admin_sales',
        },
      })
      .then(({ error: evtErr }) => {
        if (evtErr) console.error('Error firing project_created journey event:', evtErr)
      })

    // =====================================================================
    // Auto-assign returning customers to their last active salesperson
    // Only runs when no explicit assigned_to was provided
    // =====================================================================
    let autoAssignedStaff: { id: string; name: string; email: string } | null = null

    if (!assigned_to && leadEmail) {
      try {
        // Check if a customer record exists for this email
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id, assigned_salesperson_id')
          .eq('email', leadEmail)
          .single()

        if (existingCustomer) {
          // Find the most recent project for this customer (excluding the new one)
          const { data: prevProject } = await supabase
            .from('projects')
            .select('assigned_to')
            .eq('customer_id', existingCustomer.id)
            .not('id', 'eq', project.id)
            .not('assigned_to', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          const prevSalespersonId = prevProject?.assigned_to || existingCustomer.assigned_salesperson_id

          if (prevSalespersonId) {
            // Check if that salesperson is still active
            const { data: staffMember } = await supabase
              .from('staff')
              .select('id, name, email, is_active')
              .eq('id', prevSalespersonId)
              .single()

            if (staffMember?.is_active) {
              // Auto-assign the new project
              await supabase
                .from('projects')
                .update({ assigned_to: staffMember.id })
                .eq('id', project.id)

              // Update customer's current salesperson
              await supabase
                .from('customers')
                .update({ assigned_salesperson_id: staffMember.id })
                .eq('id', existingCustomer.id)

              // Update lead's assigned_to as well
              await supabase
                .from('leads')
                .update({ assigned_to: staffMember.id })
                .eq('id', leadId)

              autoAssignedStaff = { id: staffMember.id, name: staffMember.name, email: staffMember.email }

              // Send notification to the auto-assigned salesperson
              const { sendSalespersonAssignedNotification } = await import('@/lib/email/notifications')
              sendSalespersonAssignedNotification({
                salespersonName: staffMember.name,
                salespersonEmail: staffMember.email,
                customerName: [leadFirstName, leadLastName].filter(Boolean).join(' ') || 'Unknown',
                customerEmail: leadEmail,
                productType: product_type || 'curtains',
                projectId: project.id,
              }).catch((err: unknown) => console.error('Auto-assign notification error:', err))
            }
          }
        }
      } catch (autoAssignErr) {
        // Auto-assign is non-blocking
        console.error('Auto-assign error (non-blocking):', autoAssignErr)
      }
    }

    return NextResponse.json({
      success: true,
      project,
      shareUrl: `/project/${project.share_token}`,
      autoAssigned: autoAssignedStaff,
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

    // Flatten lead contact info onto projects for backward compat
    const projects = (data || []).map((p: Record<string, unknown>) => {
      const lead = p.leads as {
        first_name: string | null; last_name: string | null; phone: string | null;
      } | null
      return {
        ...p,
        first_name: lead?.first_name || null,
        last_name: lead?.last_name || null,
        phone: lead?.phone || null,
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Sales projects GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
