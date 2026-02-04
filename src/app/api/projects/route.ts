import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    // Check if customer exists, create if not
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

    // Create project
    const { data, error } = await supabase
      .from('projects')
      .insert({
        customer_id: customerId,
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

    return NextResponse.json({ 
      success: true, 
      project: data,
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
