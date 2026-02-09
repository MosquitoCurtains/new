/**
 * Image URL normalization utility
 *
 * Handles two categories of dimension suffixes in WordPress-hosted images:
 *
 * 1. User's custom sizes (swap small for large):
 *    - `-400x300` -> `-1200x900`
 *    - `-400` (standalone) -> `-1200`
 *
 * 2. WordPress-generated sizes (strip entirely):
 *    - `-300x225`, `-768x576`, `-1024x768`, `-500x500`, etc.
 *    - Any `-NNNxNNN` that is NOT `-400x300` or `-1200x900`
 *
 * 3. WordPress duplicate markers (strip):
 *    - `-1`, `-2`, etc. that appear between or after dimension suffixes
 */

/** Dimension suffixes that are the user's custom sizes (not WP-generated) */
const USER_DIMENSIONS = new Set(['400x300', '1200x900'])

/**
 * Normalizes a static.mosquitocurtains.com image URL by stripping WordPress
 * resolution suffixes and swapping user's small sizes for large ones.
 *
 * @param url - The full image URL
 * @returns The normalized URL pointing to the highest-resolution version
 */
export function normalizeImageUrl(url: string): string {
  // Only process static.mosquitocurtains.com URLs
  if (!url.includes('static.mosquitocurtains.com')) return url

  // Split URL into path (before extension) and extension
  const extMatch = url.match(/^(.+)\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
  if (!extMatch) return url

  let basePath = extMatch[1]
  const ext = extMatch[2]
  const queryString = extMatch[3] || ''

  // Track whether we found the user's -400x300 dimension
  let hadUser400x300 = false
  // Track whether the base already contains -1200 (before any WP suffix)
  let hasStandalone1200 = false

  // Process: strip dimension suffixes from right to left
  // Pattern: one or more occurrences of (-NNNxNNN or -N duplicate marker) at the end
  // We need to strip these iteratively from the end of the path

  let changed = true
  while (changed) {
    changed = false

    // Strip trailing WP duplicate marker: e.g., `-1` at the very end
    // Only if preceded by another dimension or is between dimensions
    const dupMatch = basePath.match(/^(.+)-(\d{1,2})$/)
    if (dupMatch) {
      // Make sure this isn't part of the real filename (e.g., "White-Porch-Curtains-1")
      // Only strip if the preceding part ends with a dimension suffix
      const preceding = dupMatch[1]
      if (preceding.match(/-\d+x\d+$/) || preceding.match(/-\d{3,4}$/)) {
        basePath = preceding
        changed = true
        continue
      }
    }

    // Strip trailing dimension suffix: -NNNxNNN
    const dimMatch = basePath.match(/^(.+)-(\d+x\d+)$/)
    if (dimMatch) {
      const dim = dimMatch[2]
      if (USER_DIMENSIONS.has(dim)) {
        if (dim === '400x300') {
          hadUser400x300 = true
        }
        // Check if what's before this is already a -1200 base
        if (dimMatch[1].match(/-1200$/)) {
          // e.g., "Enclosure-1200-400x300" -> the -400x300 is WP-generated from -1200
          // Just strip it, don't add -1200x900
          basePath = dimMatch[1]
          hadUser400x300 = false
          hasStandalone1200 = true
          changed = true
          continue
        }
        basePath = dimMatch[1]
        changed = true
        continue
      } else {
        // WP-generated dimension - strip it
        basePath = dimMatch[1]
        changed = true
        continue
      }
    }
  }

  // Now apply user size swaps
  if (hadUser400x300 && !hasStandalone1200) {
    basePath = basePath + '-1200x900'
  }

  // Handle standalone -400 -> -1200 (e.g., "Something-400.jpg")
  if (basePath.match(/-400$/)) {
    basePath = basePath.replace(/-400$/, '-1200')
  }

  return `${basePath}.${ext}${queryString}`
}

/**
 * Checks if a URL contains WordPress resolution suffixes that need normalization.
 */
export function hasWpResolutionSuffix(url: string): boolean {
  if (!url.includes('static.mosquitocurtains.com')) return false
  return normalizeImageUrl(url) !== url
}
