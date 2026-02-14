import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewLeadNotification } from '@/lib/email/notifications'
import { createCartFromBuilder } from '@/lib/cart/createCartFromBuilder'

// Map product slugs to lead interest values
const PRODUCT_TO_INTEREST: Record<string, string> = {
  mosquito_curtains: 'mosquito_curtains',
  clear_vinyl: 'clear_vinyl',
  raw_materials: 'raw_materials',
}

/** Validate UUID format — attribution IDs should never block the lead flow */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function safeUuid(val: unknown): string | undefined {
  if (typeof val === 'string' && UUID_RE.test(val)) return val
  return undefined
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
      projectName,
      meshType,
      topAttachment,
      totalWidth,
      numberOfSides,
      notes,
      description,
      estimatedTotal,
      photo_urls,
      cart_data,
      existingProjectId,
      // Session tracking — attribution only, never block the lead flow
      session_id: raw_session_id,
    } = body

    // Sanitize: only pass session_id if it's a valid UUID (FK to sessions table)
    const session_id = safeUuid(raw_session_id)

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
      // Update contact info on existing lead if we have new data
      const updates: Record<string, unknown> = {}
      if (firstName) updates.first_name = firstName
      if (lastName) updates.last_name = lastName
      if (phone) updates.phone = phone
      if (description) updates.message = description
      if (projectType) updates.project_type = projectType
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase.from('leads').update(updates).eq('id', leadId)
        if (updateError) {
          console.error('Error updating lead:', updateError.message, updateError.code)
        }
      }
    } else {
      const photoUrlStrings = Array.isArray(photo_urls)
        ? photo_urls.map((p: { url: string }) => p.url)
        : []

      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          interest: PRODUCT_TO_INTEREST[product] || product,
          project_type: projectType,
          message: description || null,
          source: projectType === 'expert_review' ? 'diy_builder_expert_review' : 'diy_builder',
          status: 'open',
          photo_urls: photoUrlStrings.length > 0 ? photoUrlStrings : null,
          session_id,
        })
        .select('id')
        .single()

      if (leadError) {
        console.error('Error creating lead:', leadError.message, leadError.code, leadError.details)
      }

      if (newLead) {
        leadId = newLead.id
      }
    }

    // -------------------------------------------------------------------------
    // 2. Create or update the project, linked to the lead
    // -------------------------------------------------------------------------
    const projectPayload = {
      lead_id: leadId,
      email,
      product_type: product,
      project_type: projectType,
      project_name: projectName || null,
      mesh_type: meshType,
      top_attachment: topAttachment,
      total_width: totalWidth,
      number_of_sides: numberOfSides,
      notes,
      estimated_total: estimatedTotal,
      cart_data: cart_data || [],
      status: projectType === 'expert_review' ? 'submitted' : 'draft',
      session_id,
    }

    let data: Record<string, unknown> | null = null
    let error: { message: string; code?: string; details?: string; hint?: string } | null = null

    if (existingProjectId && safeUuid(existingProjectId)) {
      // Update existing project instead of creating a duplicate
      const result = await supabase
        .from('projects')
        .update(projectPayload)
        .eq('id', existingProjectId)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Create new project
      const result = await supabase
        .from('projects')
        .insert(projectPayload)
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error || !data) {
      console.error('Error saving project:', error?.message, error?.code, error?.details, error?.hint)
      return NextResponse.json(
        { error: `Failed to save project: ${error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // -------------------------------------------------------------------------
    // 3. Create a real cart with priced line items from builder cart_data
    // -------------------------------------------------------------------------
    // If updating an existing project, remove old carts to prevent duplicates
    if (existingProjectId && safeUuid(existingProjectId)) {
      const { data: oldCarts } = await supabase
        .from('carts')
        .select('id')
        .eq('project_id', existingProjectId)
      if (oldCarts && oldCarts.length > 0) {
        const oldCartIds = oldCarts.map((c: { id: string }) => c.id)
        // Delete line_item_options → line_items → carts (FK order)
        await supabase.from('line_item_options').delete().in('line_item_id',
          (await supabase.from('line_items').select('id').in('cart_id', oldCartIds)).data?.map((li: { id: string }) => li.id) || []
        )
        await supabase.from('line_items').delete().in('cart_id', oldCartIds)
        await supabase.from('carts').delete().in('id', oldCartIds)
      }
    }

    let cartResult: { cartId: string; cartTotal: number; itemCount: number } | null = null
    if (Array.isArray(cart_data) && cart_data.length > 0) {
      try {
        cartResult = await createCartFromBuilder({
          supabase,
          projectId: data.id as string,
          product,
          cartData: cart_data,
          leadId,
          sessionId: session_id,
          visitorId: (data.visitor_id as string) || undefined,
          email,
        })
      } catch (cartErr) {
        // Non-fatal — project + lead already saved successfully
        console.error('[Projects API] Cart creation failed (non-fatal):', cartErr)
      }
    }

    // -------------------------------------------------------------------------
    // 4. Save photos to project_photos table
    // -------------------------------------------------------------------------
    // If updating existing project, clear old photo records to prevent duplicates
    if (existingProjectId && safeUuid(existingProjectId) && Array.isArray(photo_urls) && photo_urls.length > 0) {
      await supabase.from('project_photos').delete().eq('project_id', data.id)
    }

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
      shareUrl: `/project/${data.share_token}`,
      cartId: cartResult?.cartId || null,
      cartTotal: cartResult?.cartTotal || null,
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
