/**
 * Centralized Video Constants for Mosquito Curtains
 * 
 * All YouTube video IDs used across the site are defined here.
 * This makes it easy to update videos across multiple pages at once.
 * 
 * To find a video ID: Go to YouTube video, the ID is after "v=" in the URL
 * Example: https://www.youtube.com/watch?v=FqNe9pDsZ8M -> ID is "FqNe9pDsZ8M"
 * 
 * VERIFIED VIDEO IDS (checked Feb 2026):
 * - FqNe9pDsZ8M - Main Overview (82K views)
 * - ZjxrDItgV8w - Custom Fitted / Mesh Types (28K views)
 * - KmobG8rofx0 - Quality & Materials (7.7K views)
 * - KTrkT6DHm9k - Clear Vinyl Panel Construction (8.4K views)
 * - WE2RuQfehiw - Boat/Canvas Netting (1.1K views)
 * - WOLgWm9UMq4 - Raw Netting (22K views)
 * - cJY1209F5sE - Short Overview (13K views)
 * - hhlqknPm8ac - Canvas Aprons (1.9K views)
 * - ca6GufadXoE - Clear Vinyl Overview (verified)
 * - 5dWUpGj6lYc - Marine Snaps 90 sec (verified)
 * - QaRUVjmJKEY - Magnetic Doorways 90 sec (verified)
 * - dbW9Xp3_InM - Stucco Strips 90 sec (verified)
 * 
 * INVALID VIDEO IDS (do NOT use):
 * - e7nP-iD3J9U - Does not exist
 * - Z8xnPvdDWhs - Does not exist
 * - 8yLxXvkSM7s - Does not exist
 * - X5BsXKFCJkU - Does not exist
 */

// =============================================================================
// MAIN PRODUCT OVERVIEW VIDEOS
// =============================================================================

export const VIDEOS = {
  // Core Hero/Overview Videos (VERIFIED)
  MOSQUITO_CURTAINS_OVERVIEW: 'FqNe9pDsZ8M', // 82K views - Main overview
  CUSTOM_FITTED: 'ZjxrDItgV8w',               // 28K views - Custom fitting / mesh types
  QUALITY_MATERIALS: 'KmobG8rofx0',           // 7.7K views - Quality & materials
  SHORT_OVERVIEW: 'cJY1209F5sE',              // 13K views - Short overview
  
  // Clear Vinyl Videos (VERIFIED)
  CLEAR_VINYL_OVERVIEW: 'ca6GufadXoE',        // Clear vinyl intro
  CLEAR_VINYL_CONSTRUCTION: 'KTrkT6DHm9k',    // 8.4K views - Velcro roll-up panels
  CANVAS_APRONS: 'hhlqknPm8ac',               // 1.9K views - Canvas aprons for clear vinyl
  
  // Hardware Demonstration Videos - 90 Second Series (VERIFIED)
  MARINE_SNAPS_90_SEC: '5dWUpGj6lYc',
  MAGNETIC_DOORWAYS_90_SEC: 'QaRUVjmJKEY',
  STUCCO_STRIPS_90_SEC: 'dbW9Xp3_InM',
  
  // Special Applications (VERIFIED)
  BOAT_NETTING: 'WE2RuQfehiw',                // 1.1K views - Pontoon boat netting
  RAW_NETTING: 'WOLgWm9UMq4',                 // 22K views - Raw netting overview
  
  // =========================================================================
  // FALLBACKS - Use main overview when specific video not available
  // =========================================================================
  OPTIONS_OVERVIEW: 'cJY1209F5sE',            // 13K views - Short overview for options
  TRACKING_INSTALLATION: 'FqNe9pDsZ8M',       // Use main overview for tracking install
  VELCRO_INSTALLATION: 'KTrkT6DHm9k',         // Use clear vinyl construction (shows velcro)
  PHOTO_GUIDELINES: 'FqNe9pDsZ8M',            // Use main overview for photo guidelines
  PROJECTION_SCREENS: 'FqNe9pDsZ8M',          // Use main overview for projection
} as const

// =============================================================================
// VIDEO COLLECTIONS BY PAGE TYPE
// =============================================================================

/**
 * Hero video for mosquito curtain landing pages
 * Use this for: screened-porch, screen-patio, pergola, gazebo, deck, awning, etc.
 */
export const MOSQUITO_HERO_VIDEO = {
  videoId: VIDEOS.MOSQUITO_CURTAINS_OVERVIEW,
  title: 'Mosquito Curtains Overview',
  thumbnailUrl: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg',
}

/**
 * Hero video for clear vinyl landing pages
 * Use this for: clear-vinyl-plastic-patio-enclosures, weather-curtains, etc.
 */
export const CLEAR_VINYL_HERO_VIDEO = {
  videoId: VIDEOS.CLEAR_VINYL_OVERVIEW,
  title: 'Clear Vinyl Overview',
  thumbnailUrl: 'https://i.ytimg.com/vi/ca6GufadXoE/maxresdefault.jpg',
}

/**
 * Hardware videos for options/planning pages
 */
export const HARDWARE_VIDEOS = [
  { id: VIDEOS.MARINE_SNAPS_90_SEC, title: 'Marine Snaps in under 90 Seconds' },
  { id: VIDEOS.MAGNETIC_DOORWAYS_90_SEC, title: 'Magnetic Doorways in under 90 Seconds' },
  { id: VIDEOS.STUCCO_STRIPS_90_SEC, title: 'Stucco Strips in under 90 Seconds' },
]

/**
 * Installation videos collection
 */
export const INSTALLATION_VIDEOS = {
  tracking: {
    full: { id: VIDEOS.TRACKING_INSTALLATION, title: 'Complete Tracking Installation', duration: '39:59' },
  },
  velcro: {
    full: { id: VIDEOS.VELCRO_INSTALLATION, title: 'Complete Velcro Installation', duration: '28:38' },
  },
  clearVinyl: {
    full: { id: VIDEOS.CLEAR_VINYL_CONSTRUCTION, title: 'Clear Vinyl Installation', duration: '' },
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'maxresdefault'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Get YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Get YouTube watch URL from video ID
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}
