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
  'mosquito-netting': {
    name: 'Mosquito Netting Gallery',
    description: 'Browse our collection of mosquito netting installations. All colors and styles for porches, patios, gazebos, and more.',
    images: [
      {
        id: 'mn-1',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Black Mesh Porch',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Georgia',
      },
      {
        id: 'mn-2',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Patio Mosquito Curtains',
        productType: 'mosquito_curtains',
        projectType: 'Patio',
        location: 'Florida',
      },
      {
        id: 'mn-3',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Pergola Netting',
        productType: 'mosquito_curtains',
        projectType: 'Pergola',
        location: 'Texas',
      },
      {
        id: 'mn-4',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Deck Enclosure',
        productType: 'mosquito_curtains',
        projectType: 'Deck',
        location: 'North Carolina',
      },
      {
        id: 'mn-5',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Gazebo Netting',
        productType: 'mosquito_curtains',
        projectType: 'Gazebo',
        location: 'California',
      },
      {
        id: 'mn-6',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Porch Screen',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Virginia',
      },
    ],
  },
  'white-netting': {
    name: 'White Netting Projects',
    description: 'White mosquito netting creates a bright, airy feel. Perfect for spaces where you want maximum light.',
    images: [
      {
        id: 'wn-1',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'White Netting Porch',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Arizona',
      },
      {
        id: 'wn-2',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'White Mesh Patio',
        productType: 'mosquito_curtains',
        projectType: 'Patio',
        location: 'Tennessee',
      },
      {
        id: 'wn-3',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'White Pergola Screen',
        productType: 'mosquito_curtains',
        projectType: 'Pergola',
        location: 'Texas',
      },
    ],
  },
  'black-netting': {
    name: 'Black Netting Projects',
    description: 'Black mosquito netting offers the best visibility. Easier to see through and blends with darker frames.',
    images: [
      {
        id: 'bn-1',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Black Mesh Porch',
        productType: 'mosquito_curtains',
        projectType: 'Porch',
        location: 'Georgia',
      },
      {
        id: 'bn-2',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Black Netting Patio',
        productType: 'mosquito_curtains',
        projectType: 'Patio',
        location: 'Florida',
      },
      {
        id: 'bn-3',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Black Mesh Deck',
        productType: 'mosquito_curtains',
        projectType: 'Deck',
        location: 'North Carolina',
      },
      {
        id: 'bn-4',
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
        title: 'Black Gazebo Curtains',
        productType: 'mosquito_curtains',
        projectType: 'Gazebo',
        location: 'California',
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
