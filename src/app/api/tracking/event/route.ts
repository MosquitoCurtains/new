import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/tracking/event
 * 
 * Track a conversion or milestone event.
 * 
 * Event types:
 * - email_captured
 * - quote_started
 * - quote_submitted
 * - photos_uploaded
 * - cart_created
 * - cart_updated
 * - cart_sent
 * - checkout_started
 * - payment_initiated
 * - purchase_completed
 * - project_created
 * - project_updated
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      visitorId,
      sessionId,
      eventType,
      eventData,
      pagePath
    } = body
    
    // Validate required fields
    if (!visitorId || !eventType) {
      return NextResponse.json(
        { error: 'visitorId and eventType are required' },
        { status: 400 }
      )
    }
    
    // Validate event type
    const validEventTypes = [
      'email_captured',
      'quote_started',
      'quote_submitted',
      'photos_uploaded',
      'cart_created',
      'cart_updated',
      'cart_sent',
      'checkout_started',
      'payment_initiated',
      'purchase_completed',
      'project_created',
      'project_updated'
    ]
    
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    
    // Get the actual visitor UUID and customer_id
    const { data: visitor } = await supabase
      .from('visitors')
      .select('id, customer_id')
      .eq('fingerprint', visitorId)
      .single()
    
    if (!visitor) {
      console.warn('[Tracking] Visitor not found for event:', visitorId)
      return NextResponse.json({ success: true, warning: 'visitor_not_found' })
    }
    
    // Check if session exists (optional for events)
    let validSessionId: string | null = null
    if (sessionId) {
      const { data: session } = await supabase
        .from('sessions')
        .select('id')
        .eq('id', sessionId)
        .single()
      
      validSessionId = session?.id || null
    }
    
    // Insert journey event
    // Note: Database trigger will update customer status for certain events
    const { error: eventError } = await supabase
      .from('journey_events')
      .insert({
        visitor_id: visitor.id,
        session_id: validSessionId,
        customer_id: visitor.customer_id || null,
        event_type: eventType,
        event_data: eventData || {},
        page_path: pagePath || null,
        created_at: new Date().toISOString()
      })
    
    if (eventError) {
      console.error('[Tracking] Event insert error:', eventError)
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      )
    }
    
    // For conversion events, update session.converted
    const conversionEvents = ['email_captured', 'quote_submitted', 'purchase_completed']
    if (conversionEvents.includes(eventType) && validSessionId) {
      await supabase
        .from('sessions')
        .update({
          converted: true,
          conversion_type: eventType.replace('_', ' '),
          conversion_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', validSessionId)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[Tracking] Event API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
