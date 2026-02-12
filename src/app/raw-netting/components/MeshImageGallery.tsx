'use client'

/**
 * MeshImageGallery — Renders a grid of mesh images.
 *
 * Accepts pre-fetched images from the parent. Clicking an image fires
 * `onImageClick(globalIndex)` so the parent can control the lightbox.
 */

import { Images } from 'lucide-react'
import { Text, Spinner } from '@/lib/design-system'

export interface GalleryImage {
  id: string
  image_url: string
  title: string | null
  sort_order: number
}

interface MeshImageGalleryProps {
  /** Full list of images (already fetched by parent) */
  images: GalleryImage[]
  /** Whether images are still loading */
  loading: boolean
  /** Index into `images` to start rendering from (default 0) */
  startIndex?: number
  /** Max images to show before "show all" */
  initialCount?: number
  /** Callback when an image is clicked — passes the global index in images[] */
  onImageClick?: (globalIndex: number) => void
}

export default function MeshImageGallery({
  images,
  loading,
  startIndex = 0,
  initialCount = 8,
  onImageClick,
}: MeshImageGalleryProps) {
  const slicedImages = images.slice(startIndex)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Spinner size="lg" className="mb-2" />
        <Text size="sm" className="text-gray-400 !mb-0">Loading photos...</Text>
      </div>
    )
  }

  if (slicedImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Images className="w-10 h-10 mb-2" />
        <Text size="sm" className="text-gray-400 !mb-0">No photos available for this color</Text>
      </div>
    )
  }

  return (
    <div>
      {/* Gallery Grid — uniform 3:2 tiles, 4 across */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 transition-all duration-300">
        {slicedImages.map((image, idx) => {
          const globalIdx = startIndex + idx
          return (
            <button
              key={image.id}
              onClick={() => onImageClick?.(globalIdx)}
              className="relative group rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#406517] focus:ring-offset-2"
            >
              <div className="aspect-[3/2] w-full">
                <img
                  src={image.image_url}
                  alt={image.title || 'Mesh photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={idx < 4 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
