'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { GalleryPageTemplate } from '@/lib/design-system/templates'

// Mock collections data (would come from Supabase in production)
const COLLECTIONS: Record<string, {
  name: string
  description: string
  images: Array<{
    id: string
    src: string
    title?: string
    productType?: 'mosquito_curtains' | 'clear_vinyl' | 'raw_mesh'
    projectType?: string
    location?: string
  }>
}> = {
  'featured': {
    name: 'Featured Projects',
    description: 'Our best customer installations hand-picked by our team.',
    images: [
      {
        id: '1',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Screen Porch Enclosure',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Georgia',
      },
      {
        id: '2',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Patio Screening',
        productType: 'mosquito_curtains',
        projectType: 'Patio',
        location: 'Florida',
      },
      {
        id: '10',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
        title: 'Clear Vinyl Patio',
        productType: 'clear_vinyl',
        projectType: 'Patio',
        location: 'Colorado',
      },
    ],
  },
  'porch-projects': {
    name: 'Best Porch Projects',
    description: 'Beautiful screen porch enclosures from across the country.',
    images: [
      {
        id: '1',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Georgia Porch',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Georgia',
      },
      {
        id: '6',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Virginia Porch',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Virginia',
      },
      {
        id: '11',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
        title: 'Maryland Weather Enclosure',
        productType: 'clear_vinyl',
        projectType: 'Porch',
        location: 'Maryland',
      },
    ],
  },
  'clear-vinyl': {
    name: 'Clear Vinyl Projects',
    description: 'Weather enclosures that let you enjoy your outdoor space year-round.',
    images: [
      {
        id: '10',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
        title: 'Clear Vinyl Patio',
        productType: 'clear_vinyl',
        projectType: 'Patio',
        location: 'Colorado',
      },
      {
        id: '11',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
        title: 'Weather Enclosure',
        productType: 'clear_vinyl',
        projectType: 'Porch',
        location: 'Maryland',
      },
      {
        id: '12',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/85-Screen-Patio-Enclosure-1200-400x300-1.jpg',
        title: 'Winter Panels',
        productType: 'clear_vinyl',
        projectType: 'Patio',
        location: 'Wisconsin',
      },
    ],
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function GalleryCollectionPage({ params }: PageProps) {
  const { slug } = use(params)
  const collection = COLLECTIONS[slug]

  if (!collection) {
    notFound()
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
