'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola screen curtains' },
]

const CONTENT_SECTIONS = [
  {
    title: 'Pergola Screen Curtains',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Pergolas are beautiful architectural features that provide shade and define outdoor living 
          spaces. But without protection, mosquitoes and other flying insects can make your pergola 
          unusable during peak bug season.
        </Text>
        <Text className="text-gray-600">
          Our custom pergola screen curtains solve this problem elegantly. They hang from your pergola's 
          beams and can be opened like drapes during the day, then closed when the bugs come out at dusk.
        </Text>
      </>
    ),
    bullets: [
      'Custom-made to fit your pergola dimensions',
      'Works with any pergola style - wood, vinyl, or aluminum',
      'Slide open like decorative outdoor drapes',
      'Available in mosquito mesh, no-see-um, or shade fabric',
    ],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    imageAlt: 'Pergola with screen curtains',
  },
  {
    title: 'Why Choose Curtains Over Fixed Screens?',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          Preserve the open, airy feel of your pergola
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Open during the day, close when bugs appear
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Easy to remove for winter storage
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Fraction of the cost of permanent screening
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Elegant draping adds to your outdoor decor
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
]

export default function PergolaScreenCurtainsPage() {
  return (
    <ProjectTypePageTemplate
      title="Pergola Screen Curtains"
      subtitle="Elegant mosquito netting curtains that protect your pergola while preserving its open, airy design."
      benefits={[
        { icon: Package, title: 'Custom Made', description: 'Perfectly sized for your pergola.', color: '#406517' },
        { icon: Truck, title: 'Fast Delivery', description: '6-10 business days shipping.', color: '#003365' },
        { icon: Shield, title: 'Durable', description: 'Marine-grade UV-protected materials.', color: '#B30158' },
        { icon: Wrench, title: 'Easy Setup', description: 'Hang with simple hardware.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={GALLERY_IMAGES}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
