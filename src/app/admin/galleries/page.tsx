'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  FolderOpen,
  ArrowLeft,
  ExternalLink,
  Save,
  X,
  Loader2,
  Images,
  GripVertical,
  Check,
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

interface Collection {
  id: string
  slug: string
  name: string
  description: string | null
  is_published: boolean
  display_on_page: string | null
  image_count: number
  created_at: string
  updated_at: string
}

interface GalleryImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  title: string | null
  product_type: string
  project_type: string
  is_featured: boolean
}

// ============================================================================
// Component
// ============================================================================

export default function AdminGalleriesPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [saving, setSaving] = useState(false)

  // Image picker state
  const [pickingForCollection, setPickingForCollection] = useState<string | null>(null)
  const [availableImages, setAvailableImages] = useState<GalleryImage[]>([])
  const [collectionImages, setCollectionImages] = useState<GalleryImage[]>([])
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    is_published: false,
    display_on_page: '',
  })

  // Fetch collections
  const fetchCollections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gallery/collections')
      const data = await res.json()
      if (res.ok) {
        setCollections(data.collections)
      }
    } catch (err) {
      console.error('Failed to fetch collections:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  // Reset form
  const resetForm = () => {
    setFormData({ slug: '', name: '', description: '', is_published: false, display_on_page: '' })
    setEditingCollection(null)
    setShowNewForm(false)
  }

  // Open edit
  const openEdit = (collection: Collection) => {
    setFormData({
      slug: collection.slug,
      name: collection.name,
      description: collection.description || '',
      is_published: collection.is_published,
      display_on_page: collection.display_on_page || '',
    })
    setEditingCollection(collection)
    setShowNewForm(true)
  }

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Save collection
  const saveCollection = async () => {
    if (!formData.slug || !formData.name) {
      alert('Name and slug are required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        description: formData.description || null,
        display_on_page: formData.display_on_page || null,
      }

      const url = editingCollection
        ? `/api/admin/gallery/collections/${editingCollection.id}`
        : '/api/admin/gallery/collections'

      const res = await fetch(url, {
        method: editingCollection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        resetForm()
        fetchCollections()
      } else {
        const err = await res.json()
        alert(`Save failed: ${err.error}`)
      }
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  // Delete collection
  const deleteCollection = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? Images will NOT be deleted, only the collection.`)) return

    try {
      await fetch(`/api/admin/gallery/collections/${id}`, { method: 'DELETE' })
      fetchCollections()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  // Toggle published
  const togglePublished = async (collection: Collection) => {
    try {
      await fetch(`/api/admin/gallery/collections/${collection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !collection.is_published }),
      })
      fetchCollections()
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  // Open image picker for a collection
  const openImagePicker = async (collectionId: string) => {
    setPickingForCollection(collectionId)
    setLoadingImages(true)
    setSelectedImageIds([])

    try {
      // Fetch all images and collection's current images in parallel
      const [allRes, collRes] = await Promise.all([
        fetch('/api/admin/gallery/images?limit=200'),
        fetch(`/api/admin/gallery/collections/${collectionId}`),
      ])

      const allData = await allRes.json()
      const collData = await collRes.json()

      const currentImageIds = new Set(
        (collData.collection?.images || []).map((img: any) => img.id)
      )

      setCollectionImages(collData.collection?.images || [])
      setAvailableImages(
        (allData.images || []).filter((img: GalleryImage) => !currentImageIds.has(img.id))
      )
    } catch (err) {
      console.error('Failed to load images:', err)
    } finally {
      setLoadingImages(false)
    }
  }

  // Add selected images to collection
  const addImagesToCollection = async () => {
    if (!pickingForCollection || selectedImageIds.length === 0) return

    try {
      const res = await fetch(`/api/admin/gallery/collections/${pickingForCollection}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_ids: selectedImageIds }),
      })

      if (res.ok) {
        // Refresh
        await openImagePicker(pickingForCollection)
        setSelectedImageIds([])
        fetchCollections()
      }
    } catch (err) {
      console.error('Add images failed:', err)
    }
  }

  // Remove image from collection
  const removeImageFromCollection = async (imageId: string) => {
    if (!pickingForCollection) return

    try {
      await fetch(`/api/admin/gallery/collections/${pickingForCollection}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_ids: [imageId] }),
      })
      await openImagePicker(pickingForCollection)
      fetchCollections()
    } catch (err) {
      console.error('Remove image failed:', err)
    }
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin/gallery" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Heading level={1} className="!mb-0">Gallery Collections</Heading>
            </div>
            <Text className="text-gray-500">
              Create and manage curated image collections for different pages.
            </Text>
          </div>
          <Button variant="primary" onClick={() => { resetForm(); setShowNewForm(true) }}>
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* New/Edit Collection Form */}
        {showNewForm && (
          <Card className="!p-6">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="!mb-0">
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </Heading>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const name = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: editingCollection ? prev.slug : generateSlug(name),
                    }))
                  }}
                  placeholder="e.g., Best Garage Projects"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., garage-projects"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this collection"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display on Page (optional)
                </label>
                <Input
                  value={formData.display_on_page}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, display_on_page: e.target.value }))}
                  placeholder="e.g., /screened-porch"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Published (visible to public)
                </label>
              </div>
            </Grid>
            <div className="flex gap-2">
              <Button variant="primary" onClick={saveCollection} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {editingCollection ? 'Update' : 'Create'} Collection
              </Button>
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </Card>
        )}

        {/* Image Picker Modal */}
        {pickingForCollection && (
          <Card className="!p-6">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="!mb-0">
                Manage Collection Images
              </Heading>
              <button
                onClick={() => { setPickingForCollection(null); setSelectedImageIds([]) }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingImages ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Current images in collection */}
                {collectionImages.length > 0 && (
                  <div className="mb-6">
                    <Text className="text-sm font-medium text-gray-600 mb-2">
                      In this collection ({collectionImages.length}):
                    </Text>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {collectionImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <Frame ratio="4/3">
                            <img
                              src={img.thumbnail_url || img.image_url}
                              alt={img.title || 'Image'}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </Frame>
                          <button
                            onClick={() => removeImageFromCollection(img.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available images to add */}
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  Available images ({availableImages.length}):
                </Text>
                {availableImages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                      {availableImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImageIds(prev =>
                            prev.includes(img.id)
                              ? prev.filter(i => i !== img.id)
                              : [...prev, img.id]
                          )}
                          className={`relative rounded-lg overflow-hidden ${
                            selectedImageIds.includes(img.id) ? 'ring-2 ring-[#406517]' : ''
                          }`}
                        >
                          <Frame ratio="4/3">
                            <img
                              src={img.thumbnail_url || img.image_url}
                              alt={img.title || 'Image'}
                              className="w-full h-full object-cover"
                            />
                          </Frame>
                          {selectedImageIds.includes(img.id) && (
                            <div className="absolute top-1 left-1 w-5 h-5 bg-[#406517] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedImageIds.length > 0 && (
                      <Button variant="primary" onClick={addImagesToCollection}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add {selectedImageIds.length} Image{selectedImageIds.length > 1 ? 's' : ''} to Collection
                      </Button>
                    )}
                  </>
                ) : (
                  <Text className="text-sm text-gray-400">
                    All images are already in this collection.
                  </Text>
                )}
              </>
            )}
          </Card>
        )}

        {/* Collections List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <Stack gap="md">
            {collections.map((collection) => (
              <Card key={collection.id} variant="outlined" className="!p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Heading level={4} className="!mb-0">{collection.name}</Heading>
                        {collection.is_published ? (
                          <Badge className="!bg-green-100 !text-green-700 !border-green-200">
                            Published
                          </Badge>
                        ) : (
                          <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <Text size="sm" className="text-gray-500 !mb-0">
                        {collection.image_count} images &middot; /gallery/{collection.slug}
                      </Text>
                      {collection.display_on_page && (
                        <Text size="sm" className="text-[#406517] !mb-0">
                          Embedded on {collection.display_on_page}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openImagePicker(collection.id)}
                    >
                      <Images className="w-4 h-4 mr-1" /> Images
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => togglePublished(collection)}
                    >
                      {collection.is_published ? (
                        <><EyeOff className="w-4 h-4 mr-1" /> Unpublish</>
                      ) : (
                        <><Eye className="w-4 h-4 mr-1" /> Publish</>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/gallery/${collection.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(collection)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteCollection(collection.id, collection.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </Stack>
        )}

        {!loading && collections.length === 0 && (
          <Card className="!p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <Heading level={3} className="!mb-2">No Collections Yet</Heading>
            <Text className="text-gray-500 mb-4">
              Create your first gallery collection to curate images for specific pages.
            </Text>
            <Button variant="primary" onClick={() => { resetForm(); setShowNewForm(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </Card>
        )}

        {/* Help Card */}
        <Card variant="outlined" className="!p-4 !bg-blue-50 !border-blue-200">
          <Text size="sm" className="text-blue-800">
            <strong>Tip:</strong> Set a &quot;Display on Page&quot; to automatically show this collection 
            as an embedded gallery on a specific page. Leave it empty for standalone collections 
            accessible at /gallery/[slug].
          </Text>
        </Card>
      </Stack>
    </Container>
  )
}
