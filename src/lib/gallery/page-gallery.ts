/**
 * Gallery image helper for product pages.
 *
 * Maps page slugs to gallery_images.project_type and provides
 * a server-side helper to fetch relevant gallery images.
 */

import { createAdminClient } from '@/lib/supabase/admin'

// ─── Slug to project_type mapping ────────────────────────────────────────────

type ProjectType =
  | 'porch'
  | 'patio'
  | 'gazebo'
  | 'deck'
  | 'pergola'
  | 'garage'
  | 'awning'
  | 'industrial'
  | 'projection'
  | 'boat'
  | 'other'

type ProductType = 'mosquito_curtains' | 'clear_vinyl' | 'raw_mesh'

interface GalleryQuery {
  projectTypes: ProjectType[]
  productType?: ProductType
}

/**
 * Maps a page slug to the gallery query filters.
 * Returns null if no mapping exists (page has no associated gallery images).
 */
export function getGalleryQueryForSlug(slug: string): GalleryQuery | null {
  const s = slug.replace(/^\//, '').replace(/\/$/, '')

  // Porch pages
  if (
    s.startsWith('screened-porch') ||
    s.startsWith('porch-') ||
    s === 'screened-porch-enclosures'
  ) {
    return { projectTypes: ['porch'] }
  }

  // Patio pages
  if (s.startsWith('screen-patio') || s.startsWith('patio-')) {
    return { projectTypes: ['patio'] }
  }

  // Gazebo pages
  if (s.includes('gazebo')) {
    return { projectTypes: ['gazebo'] }
  }

  // Deck pages
  if (s.includes('deck')) {
    return { projectTypes: ['deck'] }
  }

  // Pergola pages
  if (s.includes('pergola')) {
    return { projectTypes: ['pergola'] }
  }

  // Garage pages
  if (s.includes('garage')) {
    return { projectTypes: ['garage'] }
  }

  // Awning pages
  if (s.includes('awning')) {
    return { projectTypes: ['awning'] }
  }

  // Industrial pages
  if (s.includes('industrial') || s.includes('hvac')) {
    return { projectTypes: ['industrial'] }
  }

  // Projection pages
  if (s.includes('projection')) {
    return { projectTypes: ['projection'] }
  }

  // Boat pages
  if (s.includes('boat')) {
    return { projectTypes: ['boat'] }
  }

  // Clear vinyl pages
  if (s.includes('clear-vinyl') || s.includes('vinyl-panel') || s.includes('winterize')) {
    return { projectTypes: ['porch', 'patio', 'deck'], productType: 'clear_vinyl' }
  }

  // Weather curtains
  if (s.includes('weather-curtain') || s.includes('insulated')) {
    return { projectTypes: ['porch', 'patio'], productType: 'clear_vinyl' }
  }

  // French door screens
  if (s.includes('french-door')) {
    return { projectTypes: ['porch', 'patio'] }
  }

  // Tent screens
  if (s.includes('tent')) {
    return { projectTypes: ['other'] }
  }

  // Homepage / general pages - featured mix
  if (s === '' || s === 'reviews' || s === 'about' || s === 'our-story') {
    return { projectTypes: ['porch', 'patio', 'gazebo', 'pergola', 'garage'] }
  }

  return null
}

// ─── Database query ──────────────────────────────────────────────────────────

export interface GalleryImage {
  src: string
  alt: string
}

/**
 * Fetches gallery images from the database for a given page slug.
 *
 * @param slug - The page slug (e.g., "/screened-porch" or "screened-porch")
 * @param limit - Maximum number of images to return (default 10)
 * @returns Array of { src, alt } objects ready for rendering
 */
export async function getGalleryImagesForPage(
  slug: string,
  limit: number = 10
): Promise<GalleryImage[]> {
  const query = getGalleryQueryForSlug(slug)
  if (!query) return []

  const supabase = createAdminClient()

  let dbQuery = supabase
    .from('gallery_images')
    .select('image_url, thumbnail_url, title, description, project_type')
    .in('project_type', query.projectTypes)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (query.productType) {
    dbQuery = dbQuery.eq('product_type', query.productType)
  }

  const { data, error } = await dbQuery

  if (error || !data) {
    console.error('Failed to fetch gallery images:', error)
    return []
  }

  return data.map((img) => ({
    src: img.image_url,
    alt:
      img.title ||
      img.description ||
      `${img.project_type} project photo`,
  }))
}
