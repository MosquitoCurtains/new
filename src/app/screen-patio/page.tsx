'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Screen patio enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Patio mosquito curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/85-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Outdoor patio screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/86-Screen-Patio-Enclosure-400.jpg', alt: 'Patio enclosure system' },
]

const CONTENT_SECTIONS = [
  {
    title: 'Custom Screen Patio Enclosures',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Transform your patio into a bug-free outdoor living space with our custom-fitted mosquito 
          netting curtains. Perfect for covered patios, our modular system creates an invisible barrier 
          against mosquitoes, gnats, and other flying pests.
        </Text>
        <Text className="text-gray-600">
          Unlike permanent screen enclosures that cost thousands, our patio screen system is affordable, 
          removable, and can be installed in an afternoon. Enjoy your patio again without the bugs!
        </Text>
      </>
    ),
    bullets: [
      'Custom-made to fit any patio shape or size',
      'Marine-grade materials that withstand the elements',
      'Slide open like decorative drapes when not in use',
      'Fraction of the cost of permanent screening',
    ],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    imageAlt: 'Screen patio enclosure example',
  },
  {
    title: 'Why Screen Your Patio?',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          Enjoy outdoor dining without fighting off mosquitoes
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Create additional living space for entertaining
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Protect family and pets from biting insects
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Increase your home's usable square footage
        </ListItem>
      </BulletedList>
    ),
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    imageAlt: 'Patio screening benefits',
    reversed: true,
  },
]

export default function ScreenPatioPage() {
  return (
    <ProjectTypePageTemplate
      title="Screen Patio Enclosures"
      subtitle="Transform your covered patio into a bug-free outdoor living space with custom-fitted mosquito netting curtains."
      benefits={[
        { icon: Package, title: 'Custom Fit', description: 'Made to your exact patio measurements.', color: '#406517' },
        { icon: Truck, title: 'Fast Delivery', description: '6-10 business days to your door.', color: '#003365' },
        { icon: Shield, title: 'Marine Grade', description: 'Built to withstand outdoor conditions.', color: '#B30158' },
        { icon: Wrench, title: 'Easy DIY', description: 'Install yourself in an afternoon.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={GALLERY_IMAGES}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
