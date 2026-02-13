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
     .select('id, email, first_gclid, first_fbclid')
     .eq('email', email.toLowerCase())
     .single()
    
    let customerId: string
    
    if (existingCustomer) {
      // Customer exists - use existing ID
      customerId = existingCustomer.id
      
      // Update customer with any new info
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          phone: phone || undefined,
          // Waterfall click IDs (only if not already set)
          first_gclid: existingCustomer.first_gclid || visitor.first_gclid || undefined,
          first_fbclid: existingCustomer.first_fbclid || visitor.first_fbclid || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
      
      if (updateError) {
        console.error('[Tracking] Customer update error:', updateError)
      }
      
    } else {
      // Create new customer (attribution is derived via visitor JOIN)
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          email: email.toLowerCase(),
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          // Waterfall click IDs from visitor
          first_gclid: visitor.first_gclid || null,
          first_fbclid: visitor.first_fbclid || null,
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
