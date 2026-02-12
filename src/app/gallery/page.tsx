'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { GalleryPageTemplate } from '@/lib/design-system/templates'
import type { GalleryImage } from '@/lib/design-system/templates'
import { ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'
import { Spinner } from '@/lib/design-system'

// ============================================================================
// Filter options — context-aware, shown/hidden based on product type
// ============================================================================

const GALLERY_FILTERS = {
  productTypes: [
    { value: 'mosquito_curtains', label: 'Mosquito Curtains' },
    { value: 'clear_vinyl', label: 'Clear Vinyl' },
    { value: 'raw_mesh', label: 'Raw Mesh' },
  ],
  projectTypes: [
    { value: 'porch', label: 'Porch' },
    { value: 'patio', label: 'Patio' },
    { value: 'garage', label: 'Garage' },
    { value: 'pergola', label: 'Pergola' },
    { value: 'gazebo', label: 'Gazebo' },
    { value: 'deck', label: 'Deck' },
    { value: 'awning', label: 'Awning' },
    { value: 'boat', label: 'Boat' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'projection', label: 'Projection' },
    { value: 'other', label: 'Other' },
  ],
  // CV only — canvas/apron color
  canvasColors: [
    { value: 'ashen_gray', label: 'Ashen Gray' },
    { value: 'black', label: 'Black' },
    { value: 'burgundy', label: 'Burgundy' },
    { value: 'cocoa_brown', label: 'Cocoa Brown' },
    { value: 'forest_green', label: 'Forest Green' },
    { value: 'moss_green', label: 'Moss Green' },
    { value: 'navy', label: 'Navy' },
    { value: 'no_canvas', label: 'No Canvas' },
    { value: 'royal_blue', label: 'Royal Blue' },
    { value: 'sandy_tan', label: 'Sandy Tan' },
  ],
}

// ============================================================================
// Map DB row -> GalleryImage template interface
// ============================================================================

function mapDbToGalleryImage(row: any): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    thumbnail: row.thumbnail_url || undefined,
    title: row.title || undefined,
    description: row.description || undefined,
    productType: row.product_type,
    projectType: row.project_type,
    meshType: row.mesh_type || undefined,
    topAttachment: row.top_attachment || undefined,
    color: row.color || undefined,
    canvasColor: row.canvas_color || undefined,
    location: row.location || undefined,
    customerName: row.customer_name || undefined,
  }
}

// ============================================================================
// Page
// ============================================================================

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  // Read initial product type from URL: ?filter=clear_vinyl or ?category=clear-vinyl
  const filterParam = searchParams.get('filter') || searchParams.get('category')
  const initialProductType = filterParam
    ? filterParam.replace(/-/g, '_') // normalize hyphens to underscores
    : undefined

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/gallery/images?limit=500')
        const data = await res.json()
        if (res.ok) {
          setImages((data.images || []).map(mapDbToGalleryImage))
        }
      } catch (err) {
        console.error('Failed to fetch gallery images:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <GalleryPageTemplate
      title="Project Gallery"
      subtitle={`Browse real installations from our ${ORDERS_SERVED_FORMATTED} customers. Filter by product type and project to find inspiration for your space.`}
      images={images}
      filters={GALLERY_FILTERS}
      initialProductType={initialProductType}
      showFilters={true}
    />
  )
}
