'use client'

import { GalleryPageTemplate } from '@/lib/design-system/templates'

// Sample gallery images (would come from Supabase in production)
const GALLERY_IMAGES = [
  {
    id: '1',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Screen Porch Enclosure',
    productType: 'mosquito_curtains' as const,
    projectType: 'Porch',
    location: 'Georgia',
  },
  {
    id: '2',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Patio Screening',
    productType: 'mosquito_curtains' as const,
    projectType: 'Patio',
    location: 'Florida',
  },
  {
    id: '3',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Pergola Screen',
    productType: 'mosquito_curtains' as const,
    projectType: 'Pergola',
    location: 'Texas',
  },
  {
    id: '4',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Deck Enclosure',
    productType: 'mosquito_curtains' as const,
    projectType: 'Deck',
    location: 'North Carolina',
  },
  {
    id: '5',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Gazebo Curtains',
    productType: 'mosquito_curtains' as const,
    projectType: 'Gazebo',
    location: 'California',
  },
  {
    id: '6',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Porch Netting',
    productType: 'mosquito_curtains' as const,
    projectType: 'Porch',
    location: 'Virginia',
  },
  {
    id: '7',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Awning Screen',
    productType: 'mosquito_curtains' as const,
    projectType: 'Awning',
    location: 'Arizona',
  },
  {
    id: '8',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    title: 'Backyard Enclosure',
    productType: 'mosquito_curtains' as const,
    projectType: 'Patio',
    location: 'Tennessee',
  },
  {
    id: '9',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg',
    title: 'Garage Door Screen',
    productType: 'mosquito_curtains' as const,
    projectType: 'Garage',
    location: 'Ohio',
  },
  {
    id: '10',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    title: 'Clear Vinyl Patio',
    productType: 'clear_vinyl' as const,
    projectType: 'Patio',
    location: 'Colorado',
  },
  {
    id: '11',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    title: 'Weather Enclosure',
    productType: 'clear_vinyl' as const,
    projectType: 'Porch',
    location: 'Maryland',
  },
  {
    id: '12',
    src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/85-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    title: 'Winter Panels',
    productType: 'clear_vinyl' as const,
    projectType: 'Patio',
    location: 'Wisconsin',
  },
]

// Filter options
const GALLERY_FILTERS = {
  productTypes: [
    { value: 'mosquito_curtains', label: 'Mosquito Curtains' },
    { value: 'clear_vinyl', label: 'Clear Vinyl' },
  ],
  projectTypes: [
    { value: 'Porch', label: 'Porch' },
    { value: 'Patio', label: 'Patio' },
    { value: 'Garage', label: 'Garage' },
    { value: 'Pergola', label: 'Pergola' },
    { value: 'Gazebo', label: 'Gazebo' },
    { value: 'Deck', label: 'Deck' },
    { value: 'Awning', label: 'Awning' },
  ],
}

export default function GalleryPage() {
  return (
    <GalleryPageTemplate
      title="Project Gallery"
      subtitle="Browse real installations from our 92,000+ customers. Filter by product type and project to find inspiration for your space."
      images={GALLERY_IMAGES}
      filters={GALLERY_FILTERS}
      showFilters={true}
    />
  )
}
