'use client'

/**
 * TrackingProvider Component
 * 
 * Provides customer journey tracking context to the entire app.
 * Wraps the application at the root layout level.
 * 
 * Features:
 * - Automatic session initialization
 * - Page view tracking on route changes
 * - Context for tracking events and visitor identification
 * - Attribution data for forms
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { useJourneyTracking, type UseJourneyTrackingReturn } from '@/hooks/useJourneyTracking'

// =============================================================================
// CONTEXT
// =============================================================================

const TrackingContext = createContext<UseJourneyTrackingReturn | null>(null)

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface TrackingProviderProps {
  children: ReactNode
}

export function TrackingProvider({ children }: TrackingProviderProps) {
  const tracking = useJourneyTracking()
  
  return (
    <TrackingContext.Provider value={tracking}>
      {children}
    </TrackingContext.Provider>
  )
}

// =============================================================================
// HOOK TO ACCESS CONTEXT
// =============================================================================

/**
 * Access tracking context from any component
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { trackEvent, identify, getAttribution } = useTracking()
 *   
 *   const handleSubmit = async () => {
 *     // Get attribution for form
 *     const attribution = getAttribution()
 *     
 *     // Track the event
 *     await trackEvent('form_submitted', { formName: 'contact' })
 *     
 *     // Identify visitor
 *     await identify({ email: 'user@example.com' })
 *   }
 * }
 * ```
 */
export function useTracking(): UseJourneyTrackingReturn {
  const context = useContext(TrackingContext)
  
  if (!context) {
    // Return a no-op version if not wrapped in provider
    // This allows components to work without tracking
    return {
      isInitialized: false,
      visitorId: null,
      sessionId: null,
      customerId: null,
      isNewVisitor: false,
      isNewSession: false,
      utm: {},
      firstTouchUTM: {},
      trackEvent: async () => {},
      identify: async () => ({ success: false }),
      getAttribution: () => ({}),
      refreshSession: () => {}
    }
  }
  
  return context
}

// =============================================================================
// EXPORTS
// =============================================================================

export default TrackingProvider
