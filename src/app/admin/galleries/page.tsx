'use client'

import { useState } from 'react'
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
} from '@/lib/design-system'

// Mock collections data
const MOCK_COLLECTIONS = [
  {
    id: '1',
    slug: 'featured',
    name: 'Featured Projects',
    description: 'Our best customer installations',
    is_published: true,
    display_on_page: null,
    image_count: 12,
  },
  {
    id: '2',
    slug: 'porch-projects',
    name: 'Best Porch Projects',
    description: 'Beautiful screen porch enclosures',
    is_published: true,
    display_on_page: '/screened-porch',
    image_count: 8,
  },
  {
    id: '3',
    slug: 'clear-vinyl',
    name: 'Clear Vinyl Projects',
    description: 'Weather enclosures for year-round use',
    is_published: true,
    display_on_page: '/clear-vinyl-plastic-patio-enclosures',
    image_count: 6,
  },
  {
    id: '4',
    slug: 'commercial',
    name: 'Commercial Installations',
    description: 'Restaurant and business projects',
    is_published: false,
    display_on_page: '/professionals',
    image_count: 4,
  },
]

export default function AdminGalleriesPage() {
  const [collections, setCollections] = useState(MOCK_COLLECTIONS)
  const [showNewForm, setShowNewForm] = useState(false)

  const togglePublished = (id: string) => {
    setCollections(prev => prev.map(c => 
      c.id === id ? { ...c, is_published: !c.is_published } : c
    ))
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
          <Button variant="primary" onClick={() => setShowNewForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* New Collection Form */}
        {showNewForm && (
          <Card className="!p-6">
            <Heading level={3} className="!mb-4">Create New Collection</Heading>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <Input placeholder="e.g., Best Garage Projects" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <Input placeholder="e.g., garage-projects" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input placeholder="Brief description of this collection" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display on Page (optional)
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">None - Standalone only</option>
                  <option value="/screened-porch">/screened-porch</option>
                  <option value="/screen-patio">/screen-patio</option>
                  <option value="/garage-door-screens">/garage-door-screens</option>
                  <option value="/pergola-screen-curtains">/pergola-screen-curtains</option>
                  <option value="/clear-vinyl-plastic-patio-enclosures">/clear-vinyl</option>
                </select>
              </div>
            </Grid>
            <div className="flex gap-2">
              <Button variant="primary">Create Collection</Button>
              <Button variant="ghost" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        {/* Collections List */}
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
                      {collection.image_count} images • /gallery/{collection.slug}
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
                    onClick={() => togglePublished(collection.id)}
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
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </Stack>

        {collections.length === 0 && (
          <Card className="!p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <Heading level={3} className="!mb-2">No Collections Yet</Heading>
            <Text className="text-gray-500 mb-4">
              Create your first gallery collection to curate images for specific pages.
            </Text>
            <Button variant="primary" onClick={() => setShowNewForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </Card>
        )}

        {/* Help Card */}
        <Card variant="outlined" className="!p-4 !bg-blue-50 !border-blue-200">
          <Text size="sm" className="text-blue-800">
            <strong>Tip:</strong> Set a "Display on Page" to automatically show this collection 
            as an embedded gallery on a specific page. Leave it empty for standalone collections 
            accessible at /gallery/[slug].
          </Text>
        </Card>
      </Stack>
    </Container>
  )
}
