'use client'

import { useState } from 'react'
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
} from '@/lib/design-system'

// Mock image data (would come from Supabase)
const MOCK_IMAGES = [
  {
    id: '1',
    image_url: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Screen Porch Project',
    product_type: 'mosquito_curtains',
    project_type: 'porch',
    is_featured: true,
    location: 'Georgia',
  },
  {
    id: '2',
    image_url: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Patio Enclosure',
    product_type: 'mosquito_curtains',
    project_type: 'patio',
    is_featured: true,
    location: 'Florida',
  },
  {
    id: '3',
    image_url: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg',
    title: 'Garage Door Screen',
    product_type: 'mosquito_curtains',
    project_type: 'garage',
    is_featured: false,
    location: 'Texas',
  },
  {
    id: '4',
    image_url: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    title: 'Clear Vinyl Patio',
    product_type: 'clear_vinyl',
    project_type: 'patio',
    is_featured: true,
    location: 'California',
  },
]

export default function AdminGalleryPage() {
  const [images, setImages] = useState(MOCK_IMAGES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterProduct, setFilterProduct] = useState<string>('')
  const [filterProject, setFilterProject] = useState<string>('')

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
  }

  const filteredImages = images.filter(img => {
    if (filterProduct && img.product_type !== filterProduct) return false
    if (filterProject && img.project_type !== filterProject) return false
    return true
  })

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Heading level={1} className="!mb-0">Gallery Images</Heading>
            </div>
            <Text className="text-gray-500">
              Manage gallery images and their tags. {images.length} total images.
            </Text>
          </div>
          <Button variant="primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>

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
              <option value="mosquito_curtains">Mosquito Curtains</option>
              <option value="clear_vinyl">Clear Vinyl</option>
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Project Types</option>
              <option value="porch">Porch</option>
              <option value="patio">Patio</option>
              <option value="garage">Garage</option>
              <option value="pergola">Pergola</option>
              <option value="gazebo">Gazebo</option>
              <option value="deck">Deck</option>
              <option value="awning">Awning</option>
              <option value="industrial">Industrial</option>
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
                <Button variant="outline" size="sm">
                  Add to Collection
                </Button>
                <Button variant="danger" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Image Grid */}
        <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
          {filteredImages.map((image) => (
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
                    src={image.image_url}
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
              </div>
              <div className="p-3">
                <Text className="font-medium text-sm truncate">
                  {image.title || 'Untitled'}
                </Text>
                <div className="flex gap-1 mt-1">
                  <Badge variant="neutral" className="text-xs">
                    {image.product_type === 'mosquito_curtains' ? 'MC' : 'CV'}
                  </Badge>
                  <Badge variant="neutral" className="text-xs capitalize">
                    {image.project_type}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        {filteredImages.length === 0 && (
          <Card className="!p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <Heading level={3} className="!mb-2">No Images Found</Heading>
            <Text className="text-gray-500">
              Try adjusting your filters or upload new images.
            </Text>
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
