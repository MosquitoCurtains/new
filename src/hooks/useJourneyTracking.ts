'use client'

/**
 * useJourneyTracking Hook
 * 
 * Provides customer journey tracking functionality:
 * - Session initialization on mount
 * - Page view tracking on route changes
 * - Event tracking for conversions
 * - Visitor identification on email capture
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  initializeSession,
  getCurrentSession,
  trackSession,
  trackPageView,
  trackEvent,
  identifyVisitor,
  refreshSession,
  isDoNotTrack,
  getStoredUTM,
  getFirstTouchUTM,
  type SessionData,
  type UTMParams,
} from '@/lib/tracking/client'

// =============================================================================
// TYPES
// =============================================================================

export interface JourneyTrackingState {
  isInitialized: boolean
  visitorId: string | null
  sessionId: string | null
  customerId: string | null
  isNewVisitor: boolean
  isNewSession: boolean
  utm: UTMParams
  firstTouchUTM: UTMParams & { landing_page?: string; referrer?: string }
}

export interface JourneyTrackingActions {
  /** Track a custom event */
  trackEvent: (eventType: string, eventData?: Record<string, unknown>) => Promise<void>
  /** Identify visitor (link to customer via email) */
  identify: (data: {
    email: string
    firstName?: string
    lastName?: string
    phone?: string
  }) => Promise<{ success: boolean; customerId?: string }>
  /** Get attribution data for form submissions */
  getAttribution: () => {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    referrer?: string
    landing_page?: string
    session_id?: string
    visitor_id?: string
  }
  /** Refresh session (call on user activity) */
  refreshSession: () => void
}

export type UseJourneyTrackingReturn = JourneyTrackingState & JourneyTrackingActions

// =============================================================================
// HOOK
// =============================================================================

export function useJourneyTracking(): UseJourneyTrackingReturn {
  const pathname = usePathname()
  const pageViewCount = useRef(0)
  const isInitializing = useRef(false)
  const lastTrackedPath = useRef<string | null>(null)
  
  const [state, setState] = useState<JourneyTrackingState>({
    isInitialized: false,
    visitorId: null,
    sessionId: null,
    customerId: null,
    isNewVisitor: false,
    isNewSession: false,
    utm: {},
    firstTouchUTM: {}
  })

  // ---------------------------------------------------------------------------
  // Initialize session on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Skip if already initialized or initializing
    if (state.isInitialized || isInitializing.current) return
    
    // Check Do Not Track
    if (isDoNotTrack()) {
      console.log('[Tracking] Do Not Track enabled, skipping')
      setState(prev => ({ ...prev, isInitialized: true }))
      return
    }
    
    // Prevent double initialization in React strict mode
    isInitializing.current = true
    
    const init = async () => {
      try {
        // Initialize local session (sets cookies)
        const sessionData = initializeSession()
        
        // Get first touch data
        const firstTouchUTM = getFirstTouchUTM()
        
        // Send to backend
        await trackSession({
          visitorId: sessionData.visitorId,
          sessionId: sessionData.sessionId,
          isNewVisitor: sessionData.isNewVisitor,
          isNewSession: sessionData.isNewSession,
          landingPage: sessionData.landingPage,
          referrer: sessionData.referrer,
          utm: sessionData.utm,
          device: sessionData.device
        })
        
        // Update state
        setState({
          isInitialized: true,
          visitorId: sessionData.visitorId,
          sessionId: sessionData.sessionId,
          customerId: null, // Will be set on identify
          isNewVisitor: sessionData.isNewVisitor,
          isNewSession: sessionData.isNewSession,
          utm: sessionData.utm,
          firstTouchUTM
        })
        
        // Track initial page view
        pageViewCount.current = 1
        lastTrackedPath.current = sessionData.landingPage
        
        await trackPageView({
          sessionId: sessionData.sessionId,
          visitorId: sessionData.visitorId,
          pagePath: sessionData.landingPage,
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          viewOrder: 1
        })
        
      } catch (error) {
        console.error('[Tracking] Initialization error:', error)
        // Still mark as initialized to prevent retry loops
        setState(prev => ({ ...prev, isInitialized: true }))
      }
    }
    
    init()
  }, [state.isInitialized])

  // ---------------------------------------------------------------------------
  // Track page views on route changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Skip if not initialized or same path
    if (!state.isInitialized || !state.visitorId || !state.sessionId) return
    if (lastTrackedPath.current === pathname) return
    
    // Update tracking
    lastTrackedPath.current = pathname
    pageViewCount.current += 1
    
    trackPageView({
      sessionId: state.sessionId,
      visitorId: state.visitorId,
      pagePath: pathname,
      pageTitle: typeof document !== 'undefined' ? document.title : '',
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      viewOrder: pageViewCount.current
    }).catch(error => {
      console.error('[Tracking] PageView error:', error)
    })
    
    // Refresh session on activity
    refreshSession()
    
  }, [pathname, state.isInitialized, state.visitorId, state.sessionId])

  // ---------------------------------------------------------------------------
  // Track custom event
  // ---------------------------------------------------------------------------
  const handleTrackEvent = useCallback(async (
    eventType: string, 
    eventData?: Record<string, unknown>
  ): Promise<void> => {
    if (!state.visitorId || !state.sessionId) {
      console.warn('[Tracking] Cannot track event - session not initialized')
      return
    }
    
    await trackEvent({
      visitorId: state.visitorId,
      sessionId: state.sessionId,
      eventType,
      eventData,
      pagePath: pathname
    })
    
    // Refresh session on activity
    refreshSession()
  }, [state.visitorId, state.sessionId, pathname])

  // ---------------------------------------------------------------------------
  // Identify visitor (link to customer)
  // ---------------------------------------------------------------------------
  const handleIdentify = useCallback(async (data: {
    email: string
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<{ success: boolean; customerId?: string }> => {
    if (!state.visitorId || !state.sessionId) {
      console.warn('[Tracking] Cannot identify - session not initialized')
      return { success: false }
    }
    
    const result = await identifyVisitor({
      visitorId: state.visitorId,
      sessionId: state.sessionId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    })
    
    if (result.success && result.customerId) {
      setState(prev => ({ ...prev, customerId: result.customerId! }))
      
      // Track the email capture event
      await trackEvent({
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        eventType: 'email_captured',
        eventData: { email: data.email },
        pagePath: pathname
      })
    }
    
    return result
  }, [state.visitorId, state.sessionId, pathname])

  // ---------------------------------------------------------------------------
  // Get attribution data for form submissions
  // ---------------------------------------------------------------------------
  const getAttribution = useCallback(() => {
    const storedUTM = getStoredUTM()
    const firstTouch = getFirstTouchUTM()
    const { visitorId, sessionId } = getCurrentSession()
    
    return {
      // Use stored UTM (from current session) if available
      utm_source: storedUTM.utm_source || firstTouch.utm_source,
      utm_medium: storedUTM.utm_medium || firstTouch.utm_medium,
      utm_campaign: storedUTM.utm_campaign || firstTouch.utm_campaign,
      utm_content: storedUTM.utm_content || firstTouch.utm_content,
      utm_term: storedUTM.utm_term || firstTouch.utm_term,
      referrer: firstTouch.referrer,
      landing_page: firstTouch.landing_page,
      session_id: sessionId || undefined,
      visitor_id: visitorId || undefined
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------
  return {
    // State
    isInitialized: state.isInitialized,
    visitorId: state.visitorId,
    sessionId: state.sessionId,
    customerId: state.customerId,
    isNewVisitor: state.isNewVisitor,
    isNewSession: state.isNewSession,
    utm: state.utm,
    firstTouchUTM: state.firstTouchUTM,
    
    // Actions
    trackEvent: handleTrackEvent,
    identify: handleIdentify,
    getAttribution,
    refreshSession
  }
}

export default useJourneyTracking
