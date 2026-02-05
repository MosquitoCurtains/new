import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/tracking/pageview
 * 
 * Track a page view within a session.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      sessionId,
      visitorId,
      pagePath,
      pageTitle,
      pageUrl,
      viewOrder,
      timeOnPage,
      scrollDepth
    } = body
    
    // Validate required fields
    if (!sessionId || !visitorId || !pagePath) {
      return NextResponse.json(
        { error: 'sessionId, visitorId, and pagePath are required' },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    
    // Get the actual visitor UUID
    const { data: visitor } = await supabase
      .from('visitors')
      .select('id')
      .eq('fingerprint', visitorId)
      .single()
    
    if (!visitor) {
      // Visitor doesn't exist - session tracking may have failed
      // Log but don't fail the request
      console.warn('[Tracking] Visitor not found for pageview:', visitorId)
      return NextResponse.json({ success: true, warning: 'visitor_not_found' })
    }
    
    // Check if session exists
    const { data: session } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .single()
    
    if (!session) {
      console.warn('[Tracking] Session not found for pageview:', sessionId)
      return NextResponse.json({ success: true, warning: 'session_not_found' })
    }
    
    // Insert page view
    // Note: Database trigger will update visitor.total_pageviews and session.pageview_count
    const { error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        visitor_id: visitor.id,
        page_path: pagePath,
        page_title: pageTitle || null,
        page_url: pageUrl || null,
        view_order: viewOrder || 1,
        time_on_page_seconds: timeOnPage || null,
        scroll_depth: scrollDepth || null,
        viewed_at: new Date().toISOString()
      })
    
    if (pageViewError) {
      console.error('[Tracking] PageView insert error:', pageViewError)
      return NextResponse.json(
        { error: 'Failed to track page view' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[Tracking] PageView API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
