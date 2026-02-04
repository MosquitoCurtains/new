'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Awning Screen Enclosures',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Retractable awnings create wonderful shaded spaces, but they don't keep the bugs out. Our 
          custom screen curtains work with your existing awning to create a fully enclosed, bug-free 
          outdoor living area.
        </Text>
        <Text className="text-gray-600">
          Whether you have a fixed awning or retractable model, we can create screens that attach 
          seamlessly and provide complete protection from mosquitoes and other flying insects.
        </Text>
      </>
    ),
    bullets: [
      'Custom-designed for your specific awning',
      'Works with retractable and fixed awnings',
      'Grommet attachment option for fixed awnings',
      'Tracking system for retractable awning compatibility',
    ],
  },
  {
    title: 'Awning-Specific Solutions',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          <strong>Fixed Awnings:</strong> Grommets allow easy attachment to awning frame
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Retractable Awnings:</strong> Curtains can be stored when awning retracts
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Partial Enclosure:</strong> Screen just the sides you need
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          <strong>Full Enclosure:</strong> Complete protection all around
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
]

export default function AwningScreenEnclosuresPage() {
  return (
    <ProjectTypePageTemplate
      title="Awning Screen Enclosures"
      subtitle="Add bug protection to your awning with custom screen curtains designed for your specific setup."
      benefits={[
        { icon: Package, title: 'Custom Fit', description: 'Made for your awning type and size.', color: '#406517' },
        { icon: Truck, title: 'Fast Ship', description: '6-10 business days delivery.', color: '#003365' },
        { icon: Shield, title: 'Durable', description: 'UV-protected marine-grade materials.', color: '#B30158' },
        { icon: Wrench, title: 'Easy Install', description: 'Multiple attachment options.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={[]}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
