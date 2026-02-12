'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit, 
  Image as ImageIcon,
  Filter,
  Star,
  CheckCircle,
  ArrowLeft,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Badge,
  Frame,
  Spinner,
} from '@/lib/design-system'

// ============================================================================
// Types
// ============================================================================

interface GalleryImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  title: string | null
  description: string | null
  product_type: string
  project_type: string
  mesh_type: string | null
  top_attachment: string | null
  color: string | null
  canvas_color: string | null
  location: string | null
  customer_name: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Constants
// ============================================================================

const PRODUCT_TYPES = [
  { value: 'mosquito_curtains', label: 'Mosquito Curtains' },
  { value: 'clear_vinyl', label: 'Clear Vinyl' },
  { value: 'raw_mesh', label: 'Raw Mesh' },
]

const PROJECT_TYPES = [
  { value: 'porch', label: 'Porch' },
  { value: 'patio', label: 'Patio' },
  { value: 'garage', label: 'Garage' },
  { value: 'pergola', label: 'Pergola' },
  { value: 'gazebo', label: 'Gazebo' },
  { value: 'deck', label: 'Deck' },
  { value: 'awning', label: 'Awning' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'boat', label: 'Boat' },
  { value: 'projection', label: 'Projection' },
  { value: 'other', label: 'Other' },
]

const MESH_TYPES = [
  { value: 'heavy_mosquito', label: 'Heavy Mosquito' },
  { value: 'no_see_um', label: 'No-See-Um' },
  { value: 'shade', label: 'Shade' },
  { value: 'scrim', label: 'Scrim' },
]

const COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'ivory', label: 'Ivory' },
]

const CANVAS_COLORS = [
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
]

const TOP_ATTACHMENTS = [
  { value: 'tracking', label: 'Tracking' },
  { value: 'velcro', label: 'Velcro' },
  { value: 'grommets', label: 'Grommets' },
]

// ============================================================================
// Component
// ============================================================================

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterProduct, setFilterProduct] = useState<string>('')
  const [filterProject, setFilterProject] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    image_url: '',
    thumbnail_url: '',
    title: '',
    description: '',
    product_type: 'mosquito_curtains',
    project_type: 'porch',
    mesh_type: '',
    top_attachment: '',
    color: '',
    canvas_color: '',
    location: '',
    customer_name: '',
    is_featured: false,
  })

  // Fetch images
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterProduct) params.set('product_type', filterProduct)
      if (filterProject) params.set('project_type', filterProject)

      const res = await fetch(`/api/admin/gallery/images?${params}`)
      const data = await res.json()
      if (res.ok) {
        setImages(data.images)
        setTotal(data.total)
      }
    } catch (err) {
      console.error('Failed to fetch images:', err)
    } finally {
      setLoading(false)
    }
  }, [filterProduct, filterProject])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // Toggle select
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      image_url: '',
      thumbnail_url: '',
      title: '',
      description: '',
      product_type: 'mosquito_curtains',
      project_type: 'porch',
      mesh_type: '',
      top_attachment: '',
      color: '',
      canvas_color: '',
      location: '',
      customer_name: '',
      is_featured: false,
    })
    setEditingImage(null)
    setShowAddForm(false)
  }

  // Open edit form
  const openEdit = (image: GalleryImage) => {
    setFormData({
      image_url: image.image_url,
      thumbnail_url: image.thumbnail_url || '',
      title: image.title || '',
      description: image.description || '',
      product_type: image.product_type,
      project_type: image.project_type,
      mesh_type: image.mesh_type || '',
      top_attachment: image.top_attachment || '',
      color: image.color || '',
      canvas_color: image.canvas_color || '',
      location: image.location || '',
      customer_name: image.customer_name || '',
      is_featured: image.is_featured,
    })
    setEditingImage(image)
    setShowAddForm(true)
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Get presigned URL
      const presignRes = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadType: 'gallery-image',
        }),
      })

      if (!presignRes.ok) {
        const err = await presignRes.json()
        alert(`Upload error: ${err.error}`)
        return
      }

      const { presignedUrl, publicUrl } = await presignRes.json()

      // Upload to S3
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Save image (create or update)
  const saveImage = async () => {
    if (!formData.image_url) {
      alert('Image URL is required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        mesh_type: formData.mesh_type || null,
        top_attachment: formData.top_attachment || null,
        color: formData.color || null,
        canvas_color: formData.canvas_color || null,
        thumbnail_url: formData.thumbnail_url || null,
        location: formData.location || null,
        customer_name: formData.customer_name || null,
      }

      const url = editingImage
        ? `/api/admin/gallery/images/${editingImage.id}`
        : '/api/admin/gallery/images'
      
      const res = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        resetForm()
        fetchImages()
      } else {
        const err = await res.json()
        alert(`Save failed: ${err.error}`)
      }
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save image')
    } finally {
      setSaving(false)
    }
  }

  // Delete selected images
  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedIds.length} image(s)? This cannot be undone.`)) return

    try {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`/api/admin/gallery/images/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedIds([])
      fetchImages()
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete some images')
    }
  }

  // Toggle featured
  const toggleFeatured = async (image: GalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/images/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !image.is_featured }),
      })
      fetchImages()
    } catch (err) {
      console.error('Toggle featured failed:', err)
    }
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Heading level={1} className="!mb-0">Gallery Images</Heading>
            </div>
            <Text className="text-gray-500">
              {loading ? 'Loading...' : `${total} total images in the gallery system.`}
            </Text>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/galleries">Manage Collections</Link>
            </Button>
            <Button variant="primary" onClick={() => { resetForm(); setShowAddForm(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="!p-6">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="!mb-0">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </Heading>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Image URL + Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.image_url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://media.mosquitocurtains.com/..."
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Preview */}
              {formData.image_url && (
                <div className="md:col-span-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Screen Porch Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Georgia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                <select
                  value={formData.product_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {PRODUCT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {PROJECT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesh Type</label>
                <select
                  value={formData.mesh_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, mesh_type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">None</option>
                  {MESH_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">None</option>
                  {COLORS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Color</label>
                <select
                  value={formData.canvas_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, canvas_color: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">None</option>
                  {CANVAS_COLORS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Attachment</label>
                <select
                  value={formData.top_attachment}
                  onChange={(e) => setFormData(prev => ({ ...prev, top_attachment: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">None</option>
                  {TOP_ATTACHMENTS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <Input
                  value={formData.customer_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="Optional"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                  Featured Image
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" onClick={saveImage} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {editingImage ? 'Update Image' : 'Add Image'}
              </Button>
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="!p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Text className="text-sm font-medium text-gray-600">Filter:</Text>
            </div>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Products</option>
              {PRODUCT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Project Types</option>
              {PROJECT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {(filterProduct || filterProject) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => { setFilterProduct(''); setFilterProject(''); }}
              >
                Clear
              </Button>
            )}

            {selectedIds.length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <Text className="text-sm text-gray-500">
                  {selectedIds.length} selected
                </Text>
                <Button variant="danger" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Image Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
            {images.map((image) => (
              <Card 
                key={image.id} 
                variant={selectedIds.includes(image.id) ? 'elevated' : 'default'}
                className={`!p-0 overflow-hidden cursor-pointer ${
                  selectedIds.includes(image.id) ? 'ring-2 ring-[#406517]' : ''
                }`}
                onClick={() => toggleSelect(image.id)}
              >
                <div className="relative">
                  <Frame ratio="4/3">
                    <img
                      src={image.thumbnail_url || image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  {selectedIds.includes(image.id) && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-[#406517] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  {image.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="!bg-[#FFA501] !text-white !border-0">
                        <Star className="w-3 h-3 mr-1" /> Featured
                      </Badge>
                    </div>
                  )}
                  {/* Action buttons on hover */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(image) }}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFeatured(image) }}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"
                    >
                      <Star className={`w-3.5 h-3.5 ${image.is_featured ? 'text-[#FFA501] fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <Text className="font-medium text-sm truncate">
                    {image.title || 'Untitled'}
                  </Text>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="neutral" className="text-xs">
                      {image.product_type === 'mosquito_curtains' ? 'MC' : image.product_type === 'clear_vinyl' ? 'CV' : 'RM'}
                    </Badge>
                    <Badge variant="neutral" className="text-xs capitalize">
                      {image.project_type.replace('_', ' ')}
                    </Badge>
                    {image.color && (
                      <Badge variant="neutral" className="text-xs capitalize">
                        {image.color}
                      </Badge>
                    )}
                  </div>
                  {image.location && (
                    <Text className="text-xs text-gray-400 mt-1 !mb-0">{image.location}</Text>
                  )}
                  {/* Edit button always visible */}
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(image) }}
                    className="mt-2 text-xs text-[#406517] hover:underline"
                  >
                    Edit Details
                  </button>
                </div>
              </Card>
            ))}
          </Grid>
        )}

        {!loading && images.length === 0 && (
          <Card className="!p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <Heading level={3} className="!mb-2">No Images Found</Heading>
            <Text className="text-gray-500">
              {filterProduct || filterProject 
                ? 'Try adjusting your filters or add new images.'
                : 'Upload your first gallery image to get started.'
              }
            </Text>
            <Button variant="primary" className="mt-4" onClick={() => { resetForm(); setShowAddForm(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Image
            </Button>
          </Card>
        )}

        {/* Quick Links */}
        <Card variant="outlined" className="!p-4">
          <div className="flex items-center justify-between">
            <Text className="text-gray-600">
              Manage curated collections to feature on specific pages.
            </Text>
            <Button variant="outline" asChild>
              <Link href="/admin/galleries">
                Manage Collections
              </Link>
            </Button>
          </div>
        </Card>
      </Stack>
    </Container>
  )
}
