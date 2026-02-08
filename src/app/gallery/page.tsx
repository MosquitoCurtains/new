'use client'

import { useState, useEffect } from 'react'
import { GalleryPageTemplate } from '@/lib/design-system/templates'
import type { GalleryImage } from '@/lib/design-system/templates'
import { ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'

// Filter options
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
  ],
}

/**
 * Map database row to GalleryImage template interface
 */
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
    location: row.location || undefined,
    customerName: row.customer_name || undefined,
  }
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/gallery/images?limit=200')
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
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#406517] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <GalleryPageTemplate
      title="Project Gallery"
      subtitle={`Browse real installations from our ${ORDERS_SERVED_FORMATTED} customers. Filter by product type and project to find inspiration for your space.`}
      images={images}
      filters={GALLERY_FILTERS}
      showFilters={true}
    />
  )
}
