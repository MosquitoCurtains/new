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
 * - ghVp0AfXLU4 - What Can Go Wrong With Clear Vinyl (verified)
 * - spFLG0Bxo8A - Self-Install Advantages (verified)
 * - 5dWUpGj6lYc - Marine Snaps 90 sec (verified)
 * - QaRUVjmJKEY - Magnetic Doorways 90 sec (verified)
 * - dbW9Xp3_InM - Stucco Strips 90 sec (verified)
 * - DBR6a0EBgqI - Garage Door Option 1 (Tracking w/ Stucco Strip)
 * - BNIPsTVRHLg - Garage Door Option 2 (Tracking w/ Magnetic Doorway)
 * - 6HOIhGMuuf8 - Garage Door Option 3 (Velcro On Top)
 * - fGTjgRROz1Q - Man Cave Garage Home Theater (Projection Screens)
 * - 47DB7mSxd5g - Photo Guidelines
 * - OZrqh2tG8Nk - Watch Before You Call or Email (Planner)
 * - HaKS6_QUEko - Camping Net Overview
 * - DtYgknD0eeo - Camping Net Demo
 * - ojYpYC60_Ts - Camping Net Application
 * - Tst-LLmkgyY - Camping Net Setup
 * - qJr6McdLpqE - Camping Net Rigging
 * - GPsN2H01M_I - Camping Net Uses
 * - T_H3cQCINhs - Roll Up Shade Screens
 * - v3W6ehQPiL0 - Tracking System Overview
 * - osA93Zzbk4w - Tracking Demo
 * - f-RxW5_cLQo - Tracking Installation
 * - A53ZmGrqldM - Tracking Options
 * - Y5hh50u3trQ - Exposure Overview (plan sub-pages)
 * - MDPYl7gN4Ec - Layout Planning Overview (plan sub-pages)
 * - ghVp0AfXLU4 - Clear Vinyl Care & Maintenance
 * - _GKwZWtiCE0 - Theater Scrim Demo
 * - SfQwfq5M_Y8 - Company Overview / Opportunities
 * - 0SxYCWqukF8 - FAQ Overview
 * - y3iSh1qt5AA - Professionals / Trade Overview
 * - B3JppKvi5MU - Mounting Curtains On Track (verified from form-entry page)
 * - xsj7Hx5Zgis - Mounting Curtains On Velcro (verified from form-entry page)
 * - gM272jS_fuc - Full Tracking Installation 39:28 (verified from form-entry page)
 * - FHmzUTEmwfU - Full Velcro Installation 28:38 (verified from form-entry page)
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
  CLEAR_VINYL_WHAT_CAN_GO_WRONG: 'ghVp0AfXLU4', // What can go wrong with clear vinyl
  SELF_INSTALL_ADVANTAGES: 'spFLG0Bxo8A',     // Self-install advantages for clear vinyl DIY
  
  // Hardware Demonstration Videos - 90 Second Series (VERIFIED)
  MARINE_SNAPS_90_SEC: '5dWUpGj6lYc',
  MAGNETIC_DOORWAYS_90_SEC: 'QaRUVjmJKEY',
  STUCCO_STRIPS_90_SEC: 'dbW9Xp3_InM',
  
  // Base Sealing Videos (VERIFIED)
  BASE_SEALING_1: 'GjMOAeHQC_Q',
  BASE_SEALING_2: 'zYuClDjL6Og',
  
  // Garage Door Option Videos (VERIFIED)
  GARAGE_OPTION_1_STUCCO: 'DBR6a0EBgqI',      // Garage Door Option 1 - Tracking w/ Stucco Strip
  GARAGE_OPTION_2_MAGNETIC: 'BNIPsTVRHLg',     // Garage Option 2 - Tracking w/ Magnetic Doorway
  GARAGE_OPTION_3_VELCRO: '6HOIhGMuuf8',       // Garage Option 3 - Velcro On Top
  GARAGE_PROJECTION: 'fGTjgRROz1Q',            // Man Cave Garage Home Theater
  
  // Special Applications (VERIFIED)
  BOAT_NETTING: 'WE2RuQfehiw',                // 1.1K views - Pontoon boat netting
  RAW_NETTING: 'WOLgWm9UMq4',                 // 22K views - Raw netting overview
  
  // Raw Netting Sub-Page Videos (VERIFIED)
  RAW_NETTING_FABRIC: 'FsQUjeSYezM',          // Raw netting fabric types
  RAW_NETTING_DIY: '6g43C7dabI4',             // DIY netting projects
  RAW_NETTING_APPLICATIONS: 'ApQTht_b7y8',    // Raw netting applications
  RAW_NETTING_USES: 'vSuqmOoFmk8',           // Raw netting uses
  MOSQUITO_NETTING_FABRIC: 'G6qIngzJz5Y',     // Mosquito netting fabric
  INDUSTRIAL_NETTING: 'up2Hr4cN63s',           // Industrial netting
  NETTING_RIGGING: 'yZa7aIalbuA',             // Netting rigging techniques
  CUSTOM_NETTING: '1OcYlsm5pvw',              // Custom netting orders
  
  // Camping Net Videos (VERIFIED)
  CAMPING_NET_OVERVIEW: 'HaKS6_QUEko',        // Camping net overview
  CAMPING_NET_DEMO: 'DtYgknD0eeo',            // Camping net demo
  CAMPING_NET_APPLICATION: 'ojYpYC60_Ts',      // Camping net application
  CAMPING_NET_SETUP: 'Tst-LLmkgyY',           // Camping net setup
  CAMPING_NET_RIGGING: 'qJr6McdLpqE',         // Camping net rigging
  CAMPING_NET_USES: 'GPsN2H01M_I',            // Camping net uses
  
  // Roll Up Shade Videos (VERIFIED)
  ROLL_UP_SHADE: 'T_H3cQCINhs',               // Roll-up shade screens specific
  
  // Theater Scrim Videos (VERIFIED)
  THEATER_SCRIM: '_GKwZWtiCE0',               // Theater scrim demo
  
  // Care & Maintenance Videos (VERIFIED)
  CLEAR_VINYL_CARE: 'ghVp0AfXLU4',            // Clear vinyl care & maintenance
  
  // Company / About Videos (VERIFIED)
  COMPANY_OVERVIEW: 'SfQwfq5M_Y8',            // Company overview / opportunities
  
  // FAQ Videos (VERIFIED)
  FAQ_OVERVIEW: '0SxYCWqukF8',                // FAQ overview video
  
  // Professional / Trade Videos (VERIFIED)
  PROFESSIONALS_OVERVIEW: 'y3iSh1qt5AA',      // Professionals / trade overview
  
  // Tracking Videos (VERIFIED)
  TRACKING_OVERVIEW: 'v3W6ehQPiL0',           // Tracking system overview
  TRACKING_DEMO: 'osA93Zzbk4w',               // Tracking demo
  TRACKING_INSTALL: 'f-RxW5_cLQo',            // Tracking installation
  TRACKING_OPTIONS: 'A53ZmGrqldM',            // Tracking options
  MOUNTING_CURTAINS_ON_TRACK: 'B3JppKvi5MU',  // Mounting curtains on tracking
  MOUNTING_CURTAINS_ON_VELCRO: 'xsj7Hx5Zgis', // Mounting curtains on velcro
  
  // Exposure & Layout Planning Videos (VERIFIED)
  EXPOSURE_OVERVIEW: 'Y5hh50u3trQ',           // Exposure overview (2/3/4-sided planning)
  LAYOUT_PLANNING_OVERVIEW: 'MDPYl7gN4Ec',    // Layout planning overview (sub-page detail)
  
  // Shared Site-Wide Videos (VERIFIED)
  PHOTO_GUIDELINES: '47DB7mSxd5g',            // Photo Guidelines video
  PLANNER_INTRO: 'OZrqh2tG8Nk',              // "Watch Before You Call or Email"
  
  // Full Installation Videos (VERIFIED)
  FULL_TRACKING_INSTALL: 'gM272jS_fuc',       // Complete tracking installation (39:28)
  FULL_VELCRO_INSTALL: 'FHmzUTEmwfU',         // Complete velcro installation (28:38)

  // =========================================================================
  // FALLBACKS - Use main overview when specific video not available
  // =========================================================================
  OPTIONS_OVERVIEW: 'cJY1209F5sE',            // 13K views - Short overview for options
  TRACKING_INSTALLATION: 'v3W6ehQPiL0',       // Tracking system overview (was FqNe9pDsZ8M fallback)
  VELCRO_INSTALLATION: 'KTrkT6DHm9k',         // Use clear vinyl construction (shows velcro)
  PROJECTION_SCREENS: 'fGTjgRROz1Q',          // Man Cave Garage Home Theater
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
  thumbnailUrl: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg',
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
 * Camping net videos for camping-net page
 */
export const CAMPING_VIDEOS = [
  { id: VIDEOS.CAMPING_NET_OVERVIEW, title: 'Camping Net Overview' },
  { id: VIDEOS.CAMPING_NET_DEMO, title: 'Camping Net Demo' },
  { id: VIDEOS.CAMPING_NET_APPLICATION, title: 'Camping Net Application' },
  { id: VIDEOS.CAMPING_NET_SETUP, title: 'Camping Net Setup' },
  { id: VIDEOS.CAMPING_NET_RIGGING, title: 'Camping Net Rigging' },
  { id: VIDEOS.CAMPING_NET_USES, title: 'Camping Net Uses' },
]

/**
 * Tracking videos for plan/tracking page
 */
export const TRACKING_VIDEOS = [
  { id: VIDEOS.TRACKING_OVERVIEW, title: 'Tracking System Overview' },
  { id: VIDEOS.TRACKING_DEMO, title: 'Tracking Demo' },
  { id: VIDEOS.TRACKING_INSTALL, title: 'Tracking Installation' },
  { id: VIDEOS.TRACKING_OPTIONS, title: 'Tracking Options' },
]

/**
 * Raw netting videos for raw-netting hub page
 */
export const RAW_NETTING_VIDEOS = [
  { id: VIDEOS.RAW_NETTING, title: 'Raw Netting Overview' },
  { id: VIDEOS.RAW_NETTING_FABRIC, title: 'Raw Netting Fabric Types' },
  { id: VIDEOS.RAW_NETTING_DIY, title: 'DIY Netting Projects' },
  { id: VIDEOS.RAW_NETTING_APPLICATIONS, title: 'Raw Netting Applications' },
  { id: VIDEOS.CAMPING_NET_OVERVIEW, title: 'Camping Net Overview' },
  { id: VIDEOS.RAW_NETTING_USES, title: 'Raw Netting Uses' },
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
