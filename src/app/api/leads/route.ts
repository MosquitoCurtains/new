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
        status: 'new',
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

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
