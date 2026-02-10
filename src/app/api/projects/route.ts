import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewLeadNotification } from '@/lib/email/notifications'

// Map product slugs to lead interest values
const PRODUCT_TO_INTEREST: Record<string, string> = {
  mosquito_curtains: 'mosquito_curtains',
  clear_vinyl: 'clear_vinyl',
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
      product,
      projectType,
      meshType,
      topAttachment,
      totalWidth,
      numberOfSides,
      notes,
      estimatedTotal,
      photo_urls,
      cart_data,
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

    if (!product) {
      return NextResponse.json(
        { error: 'Product type is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // -------------------------------------------------------------------------
    // 1. Upsert a LEAD (find existing by email or create new)
    // -------------------------------------------------------------------------
    let leadId: string | null = null
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existingLead) {
      leadId = existingLead.id
    } else {
      const photoUrlStrings = Array.isArray(photo_urls)
        ? photo_urls.map((p: { url: string }) => p.url)
        : []

      const { data: newLead } = await supabase
        .from('leads')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          interest: PRODUCT_TO_INTEREST[product] || product,
          source: 'expert_assistance',
          status: 'open',
          photo_urls: photoUrlStrings.length > 0 ? photoUrlStrings : null,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          referrer,
          landing_page,
          session_id,
        })
        .select('id')
        .single()

      if (newLead) {
        leadId = newLead.id
      }
    }

    // -------------------------------------------------------------------------
    // 2. Check if customer exists, create if not
    // -------------------------------------------------------------------------
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
        })
        .select('id')
        .single()
      
      if (newCustomer) {
        customerId = newCustomer.id
      }
    }

    // -------------------------------------------------------------------------
    // 3. Create the project, linked to the lead
    // -------------------------------------------------------------------------
    const { data, error } = await supabase
      .from('projects')
      .insert({
        customer_id: customerId,
        lead_id: leadId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        product_type: product,
        project_type: projectType,
        mesh_type: meshType,
        top_attachment: topAttachment,
        total_width: totalWidth,
        number_of_sides: numberOfSides,
        notes,
        estimated_total: estimatedTotal,
        cart_data: cart_data || [],
        status: 'draft',
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        referrer,
        landing_page,
        session_id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // -------------------------------------------------------------------------
    // 4. Save photos to project_photos table
    // -------------------------------------------------------------------------
    if (Array.isArray(photo_urls) && photo_urls.length > 0) {
      const photoRows = photo_urls
        .filter((p: { url?: string }) => p.url)
        .map((p: { url: string; key?: string; fileName?: string }) => ({
          project_id: data.id,
          storage_path: p.url,
          filename: p.fileName || p.key?.split('/').pop() || 'unknown',
          content_type: guessContentType(p.fileName || p.key || ''),
        }))

      if (photoRows.length > 0) {
        const { error: photoError } = await supabase
          .from('project_photos')
          .insert(photoRows)

        if (photoError) {
          console.error('Error saving project photos:', photoError)
          // Non-fatal — project was created successfully
        }
      }
    }

    // -------------------------------------------------------------------------
    // 5. Send new lead notification (fire-and-forget)
    // -------------------------------------------------------------------------
    if (leadId) {
      sendNewLeadNotification({
        id: leadId,
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phone: phone || undefined,
        interest: PRODUCT_TO_INTEREST[product] || product,
        projectType: projectType || undefined,
        source: 'expert_assistance',
        createdAt: new Date().toISOString(),
      }).catch(console.error)
    }

    return NextResponse.json({ 
      success: true, 
      project: data,
      leadId,
      shareUrl: `/project/${data.share_token}`
    })
  } catch (error) {
    console.error('Project API error:', error)
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

// Get project by share token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Share token required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('share_token', token)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('Project GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
