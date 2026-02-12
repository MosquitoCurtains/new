'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { GalleryPageTemplate } from '@/lib/design-system/templates'
import type { GalleryImage } from '@/lib/design-system/templates'
import { Spinner } from '@/lib/design-system'

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
    canvasColor: row.canvas_color || undefined,
    location: row.location || undefined,
    customerName: row.customer_name || undefined,
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function GalleryCollectionPage({ params }: PageProps) {
  const { slug } = use(params)
  const [collection, setCollection] = useState<{ name: string; description: string; images: GalleryImage[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await fetch(`/api/gallery/collections/${slug}`)
        if (res.status === 404) {
          setNotFoundState(true)
          return
        }
        const data = await res.json()
        if (res.ok && data.collection) {
          setCollection({
            name: data.collection.name,
            description: data.collection.description || '',
            images: (data.collection.images || []).map(mapDbToGalleryImage),
          })
        } else {
          setNotFoundState(true)
        }
      } catch (err) {
        console.error('Failed to fetch collection:', err)
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [slug])

  if (notFoundState) {
    notFound()
  }

  if (loading || !collection) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <GalleryPageTemplate
      title={collection.name}
      subtitle={collection.description}
      images={collection.images}
      showFilters={false}
    />
  )
}
