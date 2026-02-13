/**
 * Tracking Client Library
 * 
 * Handles cookie management, UTM parsing, device detection,
 * and API calls for the customer journey tracking system.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/** Click IDs auto-appended by ad platforms */
export interface ClickIds {
  gclid?: string   // Google Click ID
  fbclid?: string  // Facebook Click ID
}

/**
 * Extended ad platform data extracted from URL params.
 * Google Ads ValueTrack: matchtype, network, creative, placement, adposition, targetid, loc_physical
 * Facebook/Meta: campaign_id, adset_id, adset_name, ad_id, ad_name, site_source, fb_placement
 * Microsoft/Bing: same as Google (different casing resolved at extraction)
 */
export interface AdClickData {
  // Google Ads ValueTrack params
  matchtype?: string    // e (exact), p (phrase), b (broad)
  network?: string      // g (Google Search), s (Search Partner), d (Display), ytv (YouTube Video)
  creative?: string     // Unique ad ID
  placement?: string    // Content site placement (Display Network)
  adposition?: string   // Ad position on page (e.g., 1t2)
  targetid?: string     // kwd-123 (keyword), aud-456 (audience), dsa-789 (dynamic search)
  loc_physical?: string // Geographic location ID
  // Facebook/Meta dynamic macros (resolved at click time)
  campaign_id?: string  // {{campaign.id}}
  adset_id?: string     // {{adset.id}}
  adset_name?: string   // {{adset.name}}
  ad_id?: string        // {{ad.id}}
  ad_name?: string      // {{ad.name}}
  site_source?: string  // {{site_source_name}} — fb, ig, msg, an
  fb_placement?: string // {{placement}} — Facebook_Desktop_Feed, Instagram_Stories, etc.
  [key: string]: string | undefined // Extensible for future params
}

export interface SessionData {
  visitorId: string
  sessionId: string
  landingPage: string
  referrer: string
  utm: UTMParams
  clickIds: ClickIds
  adClickData: AdClickData
  device: DeviceInfo
  isNewVisitor: boolean
  isNewSession: boolean
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
}

export interface PageViewData {
  sessionId: string
  visitorId: string
  pagePath: string
  pageTitle: string
  pageUrl: string
  viewOrder: number
}

export interface TrackingEventData {
  visitorId: string
  sessionId: string
  eventType: string
  eventData?: Record<string, unknown>
  pagePath?: string
}

export interface IdentifyData {
  visitorId: string
  sessionId: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const VISITOR_COOKIE = 'mc_visitor_id'
const SESSION_COOKIE = 'mc_session_id'
const UTM_COOKIE = 'mc_utm'
const FIRST_TOUCH_COOKIE = 'mc_first_touch'

// Cookie expiry times
const VISITOR_EXPIRY_DAYS = 365
const SESSION_EXPIRY_MINUTES = 30
const UTM_EXPIRY_MINUTES = 30

// =============================================================================
// COOKIE HELPERS
// =============================================================================

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

/**
 * Set a cookie with options
 */
export function setCookie(
  name: string, 
  value: string, 
  options: {
    maxAge?: number  // in seconds
    expires?: Date
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
  } = {}
): void {
  if (typeof document === 'undefined') return
  
  const {
    maxAge,
    expires,
    path = '/',
    domain,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'Lax'
  } = options
  
  let cookieString = `${name}=${encodeURIComponent(value)}`
  
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`
  }
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }
  if (path) {
    cookieString += `; path=${path}`
  }
  if (domain) {
    cookieString += `; domain=${domain}`
  }
  if (secure) {
    cookieString += '; secure'
  }
  cookieString += `; samesite=${sameSite}`
  
  document.cookie = cookieString
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

// =============================================================================
// UUID GENERATION
// =============================================================================

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// =============================================================================
// UTM PARSING
// =============================================================================

/**
 * Extract UTM parameters from URL search params
 */
export function parseUTMFromURL(): UTMParams {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const utm: UTMParams = {}
  
  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')
  const utmTerm = params.get('utm_term')
  const utmContent = params.get('utm_content')
  
  if (utmSource) utm.utm_source = utmSource
  if (utmMedium) utm.utm_medium = utmMedium
  if (utmCampaign) utm.utm_campaign = utmCampaign
  if (utmTerm) utm.utm_term = utmTerm
  if (utmContent) utm.utm_content = utmContent
  
  return utm
}

/**
 * Extract click IDs (GCLID, FBCLID) from URL
 * These are auto-appended by Google Ads and Facebook Ads respectively.
 */
export function parseClickIdsFromURL(): ClickIds {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const ids: ClickIds = {}
  
  const gclid = params.get('gclid')
  const fbclid = params.get('fbclid')
  
  if (gclid) ids.gclid = gclid
  if (fbclid) ids.fbclid = fbclid
  
  return ids
}

/**
 * Extract extended ad platform data from URL params.
 * Captures Google Ads ValueTrack, Facebook dynamic macros, and Bing params.
 */
export function parseAdClickDataFromURL(): AdClickData {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const data: AdClickData = {}
  
  // Google Ads ValueTrack params
  const matchtype = params.get('matchtype')
  const network = params.get('network')
  const creative = params.get('creative')
  const placement = params.get('placement')
  const adposition = params.get('adposition')
  const targetid = params.get('targetid')
  const locPhysical = params.get('loc_physical') || params.get('loc_physical_ms')
  
  if (matchtype) data.matchtype = matchtype
  if (network) data.network = network
  if (creative) data.creative = creative
  if (placement) data.placement = placement
  if (adposition) data.adposition = adposition
  if (targetid) data.targetid = targetid
  if (locPhysical) data.loc_physical = locPhysical
  
  // Facebook/Meta dynamic macro params
  const campaignId = params.get('campaign_id')
  const adsetId = params.get('adset_id')
  const adsetName = params.get('adset_name')
  const adId = params.get('ad_id')
  const adName = params.get('ad_name')
  const siteSource = params.get('site_source')
  const fbPlacement = params.get('fb_placement')
  
  if (campaignId) data.campaign_id = campaignId
  if (adsetId) data.adset_id = adsetId
  if (adsetName) data.adset_name = adsetName
  if (adId) data.ad_id = adId
  if (adName) data.ad_name = adName
  if (siteSource) data.site_source = siteSource
  if (fbPlacement) data.fb_placement = fbPlacement
  
  // Microsoft/Bing Ads (uses same param names as Google mostly, plus adid)
  const adid = params.get('adid')
  if (adid && !data.creative) data.creative = adid // Bing uses adid, map to creative
  
  return data
}

/**
 * Check if there are UTM params or click IDs in the URL
 * (A new click ID should also trigger a new session)
 */
export function hasUTMParams(): boolean {
  if (typeof window === 'undefined') return false
  
  const params = new URLSearchParams(window.location.search)
  return params.has('utm_source') || params.has('gclid') || params.has('fbclid')
}

/**
 * Get stored UTM params from cookie
 */
export function getStoredUTM(): UTMParams {
  const stored = getCookie(UTM_COOKIE)
  if (!stored) return {}
  
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

/**
 * Store UTM params in cookie
 */
export function storeUTM(utm: UTMParams): void {
  if (Object.keys(utm).length === 0) return
  
  setCookie(UTM_COOKIE, JSON.stringify(utm), {
    maxAge: UTM_EXPIRY_MINUTES * 60
  })
}

/**
 * Get first-touch UTM (stored permanently)
 */
export function getFirstTouchUTM(): UTMParams & { landing_page?: string; referrer?: string } {
  const stored = getCookie(FIRST_TOUCH_COOKIE)
  if (!stored) return {}
  
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

/**
 * Store first-touch UTM (only if not already set)
 */
export function storeFirstTouchUTM(data: UTMParams & { landing_page?: string; referrer?: string }): void {
  // Only store if not already set
  if (getCookie(FIRST_TOUCH_COOKIE)) return
  
  setCookie(FIRST_TOUCH_COOKIE, JSON.stringify(data), {
    maxAge: VISITOR_EXPIRY_DAYS * 24 * 60 * 60
  })
}

// =============================================================================
// DEVICE DETECTION
// =============================================================================

/**
 * Detect device type from user agent
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop'
  
  const ua = navigator.userAgent.toLowerCase()
  
  // Check for tablets first (some tablets have 'mobile' in UA)
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return 'tablet'
  }
  
  // Check for mobile
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/.test(ua)) {
    return 'mobile'
  }
  
  return 'desktop'
}

/**
 * Detect browser from user agent
 */
export function getBrowser(): string {
  if (typeof navigator === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('SamsungBrowser')) return 'Samsung'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  if (ua.includes('Trident')) return 'IE'
  if (ua.includes('Edge')) return 'Edge'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  
  return 'Unknown'
}

/**
 * Detect OS from user agent
 */
export function getOS(): string {
  if (typeof navigator === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac OS')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  
  return 'Unknown'
}

/**
 * Get full device info
 */
export function getDeviceInfo(): DeviceInfo {
  return {
    type: getDeviceType(),
    browser: getBrowser(),
    os: getOS()
  }
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Get or create visitor ID
 */
export function getOrCreateVisitorId(): { id: string; isNew: boolean } {
  let visitorId = getCookie(VISITOR_COOKIE)
  let isNew = false
  
  if (!visitorId) {
    visitorId = generateUUID()
    setCookie(VISITOR_COOKIE, visitorId, {
      maxAge: VISITOR_EXPIRY_DAYS * 24 * 60 * 60
    })
    isNew = true
  }
  
  return { id: visitorId, isNew }
}

/**
 * Get or create session ID
 * Creates a new session if:
 * - No session cookie exists
 * - New UTM params are present (new campaign)
 */
export function getOrCreateSessionId(forceNew: boolean = false): { id: string; isNew: boolean } {
  const existingSessionId = getCookie(SESSION_COOKIE)
  const newUTMParams = hasUTMParams()
  
  // Create new session if no existing session OR new UTM params
  if (!existingSessionId || forceNew || newUTMParams) {
    const sessionId = generateUUID()
    setCookie(SESSION_COOKIE, sessionId, {
      maxAge: SESSION_EXPIRY_MINUTES * 60
    })
    return { id: sessionId, isNew: true }
  }
  
  // Refresh session cookie expiry
  setCookie(SESSION_COOKIE, existingSessionId, {
    maxAge: SESSION_EXPIRY_MINUTES * 60
  })
  
  return { id: existingSessionId, isNew: false }
}

/**
 * Refresh session expiry (call on page activity)
 */
export function refreshSession(): void {
  const sessionId = getCookie(SESSION_COOKIE)
  if (sessionId) {
    setCookie(SESSION_COOKIE, sessionId, {
      maxAge: SESSION_EXPIRY_MINUTES * 60
    })
  }
}

// =============================================================================
// REFERRER HELPERS
// =============================================================================

/**
 * Get clean referrer (remove own domain)
 */
export function getReferrer(): string {
  if (typeof document === 'undefined') return ''
  
  const referrer = document.referrer
  
  // If no referrer, return empty
  if (!referrer) return ''
  
  // If referrer is same domain, return empty (internal navigation)
  try {
    const referrerHost = new URL(referrer).hostname
    const currentHost = window.location.hostname
    
    if (referrerHost === currentHost) return ''
    
    return referrer
  } catch {
    return referrer
  }
}

// =============================================================================
// TRACKING API CALLS
// =============================================================================

const API_BASE = '/api/tracking'

/**
 * Initialize or update session
 */
export async function trackSession(data: {
  visitorId: string
  sessionId: string
  isNewVisitor: boolean
  isNewSession: boolean
  landingPage: string
  referrer: string
  utm: UTMParams
  clickIds: ClickIds
  adClickData: AdClickData
  device: DeviceInfo
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('[Tracking] Session error:', error)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Track page view
 */
export async function trackPageView(data: PageViewData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('[Tracking] PageView error:', error)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Track conversion/milestone event
 */
export async function trackEvent(data: TrackingEventData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('[Tracking] Event error:', error)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Identify visitor (link to customer)
 */
export async function identifyVisitor(data: IdentifyData): Promise<{ 
  success: boolean
  customerId?: string
  error?: string 
}> {
  try {
    const response = await fetch(`${API_BASE}/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return { success: false, error: result.message }
    }
    
    return { success: true, customerId: result.customerId }
  } catch (error) {
    console.error('[Tracking] Identify error:', error)
    return { success: false, error: 'Network error' }
  }
}

// =============================================================================
// HIGH-LEVEL HELPERS
// =============================================================================

/**
 * Initialize tracking session (call on app mount)
 * Returns session data for use in the app
 */
export function initializeSession(): SessionData {
  const { id: visitorId, isNew: isNewVisitor } = getOrCreateVisitorId()
  const { id: sessionId, isNew: isNewSession } = getOrCreateSessionId()
  
  const landingPage = typeof window !== 'undefined' ? window.location.pathname : '/'
  const referrer = getReferrer()
  const utm = parseUTMFromURL()
  const clickIds = parseClickIdsFromURL()
  const adClickData = parseAdClickDataFromURL()
  const device = getDeviceInfo()
  
  // Store UTM for this session
  if (Object.keys(utm).length > 0) {
    storeUTM(utm)
  }
  
  // Store first-touch data (only on new visitor)
  if (isNewVisitor) {
    storeFirstTouchUTM({
      ...utm,
      landing_page: landingPage,
      referrer: referrer
    })
  }
  
  return {
    visitorId,
    sessionId,
    landingPage,
    referrer,
    utm,
    clickIds,
    adClickData,
    device,
    isNewVisitor,
    isNewSession
  }
}

/**
 * Get current session data (without initialization)
 */
export function getCurrentSession(): { visitorId: string | null; sessionId: string | null } {
  return {
    visitorId: getCookie(VISITOR_COOKIE),
    sessionId: getCookie(SESSION_COOKIE)
  }
}

/**
 * Check if user has opted out of tracking (DNT)
 */
export function isDoNotTrack(): boolean {
  if (typeof navigator === 'undefined') return false
  
  return navigator.doNotTrack === '1' || 
         navigator.doNotTrack === 'yes' ||
         (window as unknown as { doNotTrack?: string }).doNotTrack === '1'
}
