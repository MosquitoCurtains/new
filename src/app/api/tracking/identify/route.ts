import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/tracking/identify
 * 
 * Link a visitor to a customer record via email.
 * Creates customer if doesn't exist, links visitor to customer,
 * and copies first-touch attribution to customer record.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      visitorId,
      sessionId,
      email,
      firstName,
      lastName,
      phone
    } = body
    
    // Validate required fields
    if (!visitorId || !email) {
      return NextResponse.json(
        { error: 'visitorId and email are required' },
        { status: 400 }
      )
    }
    
    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    
    // ---------------------------------------------------------------------------
    // Get visitor record with first-touch attribution
    // ---------------------------------------------------------------------------
    const { data: visitor, error: visitorError } = await supabase
      .from('visitors')
      .select('*')
      .eq('fingerprint', visitorId)
      .single()
    
    if (visitorError || !visitor) {
      console.warn('[Tracking] Visitor not found for identify:', visitorId)
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      )
    }
    
    // ---------------------------------------------------------------------------
   // Check if customer already exists
   // ---------------------------------------------------------------------------
   const { data: existingCustomer } = await supabase
     .from('customers')
     .select('id, email, first_utm_source, first_utm_medium, first_utm_campaign, first_utm_term, first_utm_content, first_landing_page, first_referrer, first_seen_at')
     .eq('email', email.toLowerCase())
     .single()
    
    let customerId: string
    
    if (existingCustomer) {
      // Customer exists - use existing ID
      customerId = existingCustomer.id
      
      // Update customer with any new info (but don't overwrite first-touch if already set)
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          phone: phone || undefined,
          // Only set first-touch fields if not already set
          first_utm_source: existingCustomer.first_utm_source || visitor.first_utm_source || undefined,
          first_utm_medium: existingCustomer.first_utm_medium || visitor.first_utm_medium || undefined,
          first_utm_campaign: existingCustomer.first_utm_campaign || visitor.first_utm_campaign || undefined,
          first_utm_term: existingCustomer.first_utm_term || visitor.first_utm_term || undefined,
          first_utm_content: existingCustomer.first_utm_content || visitor.first_utm_content || undefined,
          first_landing_page: existingCustomer.first_landing_page || visitor.first_landing_page || undefined,
          first_referrer: existingCustomer.first_referrer || visitor.first_referrer || undefined,
          first_seen_at: existingCustomer.first_seen_at || visitor.first_seen_at || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
      
      if (updateError) {
        console.error('[Tracking] Customer update error:', updateError)
      }
      
    } else {
      // Create new customer with first-touch attribution from visitor
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          email: email.toLowerCase(),
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          first_utm_source: visitor.first_utm_source,
          first_utm_medium: visitor.first_utm_medium,
          first_utm_campaign: visitor.first_utm_campaign,
          first_utm_term: visitor.first_utm_term,
          first_utm_content: visitor.first_utm_content,
          first_landing_page: visitor.first_landing_page,
          first_referrer: visitor.first_referrer,
          first_seen_at: visitor.first_seen_at,
          email_captured_at: new Date().toISOString(),
          customer_status: 'lead'
        })
        .select('id')
        .single()
      
      if (insertError || !newCustomer) {
        console.error('[Tracking] Customer insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        )
      }
      
      customerId = newCustomer.id
    }
    
    // ---------------------------------------------------------------------------
    // Link visitor to customer
    // ---------------------------------------------------------------------------
    const { error: linkError } = await supabase
      .from('visitors')
      .update({
        customer_id: customerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', visitor.id)
    
    if (linkError) {
      console.error('[Tracking] Visitor link error:', linkError)
    }
    
    // ---------------------------------------------------------------------------
    // Update session with conversion
    // ---------------------------------------------------------------------------
    if (sessionId) {
      await supabase
        .from('sessions')
        .update({
          converted: true,
          conversion_type: 'email',
          conversion_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    }
    
    return NextResponse.json({ 
      success: true, 
      customerId,
      isNewCustomer: !existingCustomer
    })
    
  } catch (error) {
    console.error('[Tracking] Identify API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
