'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Industrial & Commercial Netting Solutions',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Beyond residential use, our marine-grade netting serves a variety of industrial and 
          commercial applications. From agricultural pest control to theater scrim material, our 
          quality mesh is trusted by businesses and organizations of all sizes.
        </Text>
        <Text className="text-gray-600">
          We've supplied netting to the USDA, NASA, film productions, agricultural operations, and 
          countless commercial businesses that need reliable, durable mesh solutions.
        </Text>
      </>
    ),
    bullets: [
      'USDA and NASA are among our satisfied clients',
      'Custom sizes up to 12ft wide by any length',
      'Multiple mesh densities for different applications',
      'Bulk pricing available for large orders',
    ],
  },
  {
    title: 'Industrial Applications',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          <strong>Agriculture:</strong> Crop protection and pest control barriers
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>HVAC:</strong> Large-scale filter screens and air barriers
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Theater:</strong> Scrim material for stage productions
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Construction:</strong> Safety and debris netting
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Research:</strong> Controlled environment barriers
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Restaurants:</strong> Large patio enclosure systems
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
  {
    title: 'Why Choose Our Industrial Netting?',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          When your application demands reliable, long-lasting netting, don't settle for cheap 
          alternatives. Our mesh is solution-dyed for UV resistance, lock-stitched so it won't 
          unravel when cut, and strong enough to withstand commercial demands.
        </Text>
        <Text className="text-gray-600">
          Contact us for bulk pricing and custom specifications. We're happy to work with your 
          engineering team to develop the perfect solution for your industrial application.
        </Text>
      </>
    ),
  },
]

export default function IndustrialNettingPage() {
  return (
    <ProjectTypePageTemplate
      title="Industrial Netting"
      subtitle="Commercial-grade netting solutions for agriculture, HVAC, theater, and industrial applications."
      benefits={[
        { icon: Package, title: 'Custom Sizes', description: 'Up to 12ft wide by any length.', color: '#406517' },
        { icon: Truck, title: 'Bulk Orders', description: 'Fast shipping on large quantities.', color: '#003365' },
        { icon: Shield, title: 'Industrial Grade', description: 'Built for commercial demands.', color: '#B30158' },
        { icon: Wrench, title: 'Lock Stitched', description: 'Won\'t unravel when cut.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={[]}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
