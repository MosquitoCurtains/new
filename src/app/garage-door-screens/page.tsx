'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg', alt: 'Garage door screen' },
]

const CONTENT_SECTIONS = [
  {
    title: 'Garage Door Screen Curtains',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Transform your garage into a screened workshop, gym, or entertainment space with our custom 
          garage door screen curtains. Perfect for keeping bugs out while letting fresh air in, our 
          screens work with any garage door opening.
        </Text>
        <Text className="text-gray-600">
          Unlike roll-up garage screens that can be flimsy and hard to use, our curtain system is 
          heavy-duty, easy to operate, and creates a proper seal against insects.
        </Text>
      </>
    ),
    bullets: [
      'Custom-sized for any garage door opening',
      'Works with single, double, or oversized garage doors',
      'Magnetic closure for easy walk-through access',
      'Heavy-duty marine-grade netting that lasts',
    ],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg',
    imageAlt: 'Garage door screen example',
  },
  {
    title: 'Popular Garage Screen Uses',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          Home gym or workout space
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Workshop with ventilation
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Party and entertainment area
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Pet-friendly outdoor space
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Man cave or she shed extension
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
]

export default function GarageDoorScreensPage() {
  return (
    <ProjectTypePageTemplate
      title="Garage Door Screens"
      subtitle="Convert your garage into usable bug-free space with custom-fitted screen curtains for any garage door opening."
      benefits={[
        { icon: Package, title: 'Custom Sized', description: 'Fits any garage door opening perfectly.', color: '#406517' },
        { icon: Truck, title: 'Fast Shipping', description: 'Ready in 6-10 business days.', color: '#003365' },
        { icon: Shield, title: 'Heavy Duty', description: 'Marine-grade materials built to last.', color: '#B30158' },
        { icon: Wrench, title: 'DIY Install', description: 'Simple installation with basic tools.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={GALLERY_IMAGES}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
