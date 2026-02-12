'use client'

/**
 * Admin Mesh Gallery Manager
 *
 * View, reorder, and delete gallery images filtered by mesh type + color.
 * Changes are saved with a single "Save Order" action.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  Loader2,
  Image as ImageIcon,
  Check,
  GripVertical,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'

// ─── Types ───────────────────────────────────────────────────────────────────

interface GalleryImage {
  id: string
  image_url: string
  title: string | null
  sort_order: number
  mesh_type: string | null
  color: string | null
  is_featured: boolean
}

// ─── Config ──────────────────────────────────────────────────────────────────

const MESH_TYPES = [
  { value: 'heavy_mosquito', label: 'Heavy Mosquito' },
  { value: 'no_see_um', label: 'No-See-Um' },
  { value: 'shade', label: 'Shade' },
]

const COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'ivory', label: 'Ivory' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function MeshGalleryAdminPage() {
  const [meshType, setMeshType] = useState('heavy_mosquito')
  const [color, setColor] = useState('black')
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // ── Fetch images ─────────────────────────────────────────────────────────

  const fetchImages = useCallback(async () => {
    setLoading(true)
    setDirty(false)
    setDeleteConfirm(null)

    try {
      const params = new URLSearchParams({
        product_type: 'raw_mesh',
        mesh_type: meshType,
        color: color,
        limit: '200',
      })

      const res = await fetch(`/api/admin/gallery/images?${params}`)
      const data = await res.json()
      setImages(data.images || [])
    } catch (err) {
      console.error('Failed to fetch images:', err)
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [meshType, color])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // ── Reorder helpers ──────────────────────────────────────────────────────

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    // Swap
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp

    // Reassign sort_order
    newImages.forEach((img, i) => {
      img.sort_order = i + 1
    })

    setImages(newImages)
    setDirty(true)
  }

  // ── Save order ───────────────────────────────────────────────────────────

  const saveOrder = async () => {
    setSaving(true)
    try {
      const updates = images.map((img, i) => ({
        id: img.id,
        sort_order: i + 1,
      }))

      const res = await fetch('/api/admin/gallery/images/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      if (!res.ok) throw new Error('Save failed')

      setDirty(false)
      showToast(`Saved order for ${images.length} images`)
    } catch (err) {
      console.error('Failed to save order:', err)
      showToast('Failed to save order')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete image ─────────────────────────────────────────────────────────

  const deleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/images/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      setImages((prev) => {
        const filtered = prev.filter((img) => img.id !== id)
        // Reassign sort_order
        filtered.forEach((img, i) => {
          img.sort_order = i + 1
        })
        return filtered
      })
      setDeleteConfirm(null)
      showToast('Image deleted')
    } catch (err) {
      console.error('Failed to delete image:', err)
      showToast('Failed to delete image')
    }
  }

  // ── Toast helper ─────────────────────────────────────────────────────────

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Container className="py-6 max-w-7xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/admin/galleries"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Galleries
            </Link>
            <Heading level={2}>Mesh Gallery Manager</Heading>
            <Text size="sm" className="text-gray-500 !mb-0">
              Manage images for raw netting product pages. Select a mesh type and color to view, reorder, and delete images.
            </Text>
          </div>

          {dirty && (
            <Button
              variant="primary"
              onClick={saveOrder}
              disabled={saving}
              className="shrink-0"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Order
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mesh Type Selector */}
            <div className="flex-1">
              <Text size="sm" weight="semibold" className="!mb-2 text-gray-700">
                Mesh Type
              </Text>
              <div className="flex flex-wrap gap-2">
                {MESH_TYPES.map((mt) => (
                  <button
                    key={mt.value}
                    onClick={() => setMeshType(mt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      meshType === mt.value
                        ? 'bg-[#406517] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="flex-1">
              <Text size="sm" weight="semibold" className="!mb-2 text-gray-700">
                Color
              </Text>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      color === c.value
                        ? 'bg-[#406517] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor:
                          c.value === 'black' ? '#1a1a1a' :
                          c.value === 'white' ? '#ffffff' :
                          '#f5f0e0',
                      }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Count + Status */}
        <div className="flex items-center gap-3">
          <Badge variant="neutral">
            {loading ? '...' : images.length} images
          </Badge>
          {dirty && (
            <Badge variant="warning">
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : images.length === 0 ? (
          <Card variant="outlined" className="!p-12">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3" />
              <Text size="lg" className="text-gray-500 !mb-1">No images found</Text>
              <Text size="sm" className="text-gray-400 !mb-0">
                No images for {MESH_TYPES.find((m) => m.value === meshType)?.label} - {COLORS.find((c) => c.value === color)?.label}
              </Text>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#406517]/40 transition-colors"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.image_url}
                    alt={image.title || 'Mesh photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Sort order badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[28px] text-center">
                    {index + 1}
                  </div>

                  {/* Featured badge */}
                  {image.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      HERO
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between p-1.5 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>

                  {deleteConfirm === image.id ? (
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        title="Confirm delete"
                      >
                        <Check className="w-3.5 h-3.5 text-red-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-xs text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(image.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom save bar when dirty */}
        {dirty && (
          <div className="sticky bottom-4 z-10">
            <Card variant="elevated" className="!p-3 !border-[#406517]/30 !bg-[#406517]/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Text size="sm" className="text-[#406517] font-medium !mb-0">
                  You have unsaved changes to the image order
                </Text>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={saveOrder}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Order
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Stack>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 fade-in">
          {toast}
        </div>
      )}
    </Container>
  )
}
