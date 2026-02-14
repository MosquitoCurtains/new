import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/tracking/session
 * 
 * Initialize or update a tracking session.
 * Creates visitor record if new, creates session record.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      visitorId,
      sessionId,
      isNewVisitor,
      isNewSession,
      landingPage,
      referrer,
      utm,
      clickIds,
      adClickData,
      device
    } = body
    
    // Validate required fields
    if (!visitorId || !sessionId) {
      return NextResponse.json(
        { error: 'visitorId and sessionId are required' },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    
    // ---------------------------------------------------------------------------
    // Handle visitor record
    // ---------------------------------------------------------------------------
    if (isNewVisitor) {
      // Create new visitor with first-touch attribution
      const { error: visitorError } = await supabase
        .from('visitors')
        .insert({
          id: visitorId,
          fingerprint: visitorId, // Using visitorId as fingerprint (cookie-based)
          first_landing_page: landingPage,
          first_referrer: referrer,
          first_utm_source: utm?.utm_source || null,
          first_utm_medium: utm?.utm_medium || null,
          first_utm_campaign: utm?.utm_campaign || null,
          first_utm_term: utm?.utm_term || null,
          first_utm_content: utm?.utm_content || null,
          first_gclid: clickIds?.gclid || null,
          first_fbclid: clickIds?.fbclid || null,
          last_landing_page: landingPage,
          last_utm_source: utm?.utm_source || null,
          last_utm_medium: utm?.utm_medium || null,
          last_utm_campaign: utm?.utm_campaign || null,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          session_count: 1,
          total_pageviews: 0
        })
      
      if (visitorError) {
        // If duplicate, that's ok - visitor already exists
        if (!visitorError.message.includes('duplicate')) {
          console.error('[Tracking] Visitor insert error:', visitorError)
        }
      }
    } else {
      // Update existing visitor (last touch data)
      // Note: session_count is updated by database trigger on session insert
      const { error: visitorUpdateError } = await supabase
        .from('visitors')
        .update({
          last_seen_at: new Date().toISOString(),
          last_landing_page: landingPage,
          last_utm_source: utm?.utm_source || null,
          last_utm_medium: utm?.utm_medium || null,
          last_utm_campaign: utm?.utm_campaign || null,
          updated_at: new Date().toISOString()
        })
        .eq('fingerprint', visitorId)
      
      if (visitorUpdateError) {
        console.error('[Tracking] Visitor update error:', visitorUpdateError)
      }
    }
    
    // ---------------------------------------------------------------------------
    // Handle session record (always create for new session)
    // ---------------------------------------------------------------------------
    if (isNewSession) {
      // First, get the visitor's UUID (might be different from fingerprint)
      const { data: visitor } = await supabase
        .from('visitors')
        .select('id')
        .eq('fingerprint', visitorId)
        .single()
      
      const actualVisitorId = visitor?.id || visitorId
      
      // Build ad_click_data JSONB (only include non-empty values)
      const adClickDataClean: Record<string, string> = {}
      if (adClickData && typeof adClickData === 'object') {
        for (const [key, value] of Object.entries(adClickData)) {
          if (value && typeof value === 'string' && value.trim() !== '') {
            adClickDataClean[key] = value
          }
        }
      }

      const { error: sessionError } = await supabase
        .from('sessions')
        .insert({
          id: sessionId,
          visitor_id: actualVisitorId,
          landing_page: landingPage,
          referrer: referrer,
          utm_source: utm?.utm_source || null,
          utm_medium: utm?.utm_medium || null,
          utm_campaign: utm?.utm_campaign || null,
          utm_term: utm?.utm_term || null,
          utm_content: utm?.utm_content || null,
          gclid: clickIds?.gclid || null,
          fbclid: clickIds?.fbclid || null,
          ad_click_data: Object.keys(adClickDataClean).length > 0 ? adClickDataClean : null,
          device_type: device?.type || null,
          browser: device?.browser || null,
          os: device?.os || null,
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          pageview_count: 0,
          converted: false
        })
      
      if (sessionError) {
        // If duplicate, that's ok - session already exists
        if (!sessionError.message.includes('duplicate')) {
          console.error('[Tracking] Session insert error:', sessionError)
        }
      }
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[Tracking] Session API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
