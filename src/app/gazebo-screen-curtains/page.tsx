'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Gazebo Screen Curtains',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Gazebos are meant to be enjoyed, but mosquitoes and gnats can quickly ruin the experience. 
          Our custom gazebo screen curtains create an invisible barrier against bugs while maintaining 
          the elegant look of your outdoor structure.
        </Text>
        <Text className="text-gray-600">
          Unlike the cheap screens that come with some gazebos (you know, the ones you can poke your 
          thumb through), our marine-grade netting is built to last for years of outdoor use.
        </Text>
      </>
    ),
    bullets: [
      'Custom-fitted for any gazebo size or shape',
      'Works with round, square, hexagonal, or octagonal gazebos',
      'Heavy-duty netting that won\'t tear or fade',
      'Multiple mesh options: mosquito, no-see-um, or shade',
    ],
  },
  {
    title: 'Built to Last, Not Like Store-Bought',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          Marine-grade polyester that withstands weather
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Solution-dyed fabric won't fade in the sun
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Reinforced webbing on all edges
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Stainless steel hardware and fasteners
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Strong enough to lift a 240lb man (we've tested it!)
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
]

export default function GazeboScreenCurtainsPage() {
  return (
    <ProjectTypePageTemplate
      title="Gazebo Screen Curtains"
      subtitle="Heavy-duty custom screen curtains that protect your gazebo from bugs - not the flimsy stuff from big box stores."
      benefits={[
        { icon: Package, title: 'Custom Fit', description: 'Made to your gazebo\'s exact dimensions.', color: '#406517' },
        { icon: Truck, title: 'Fast Ship', description: '6-10 business days delivery.', color: '#003365' },
        { icon: Shield, title: 'Built Tough', description: 'Won\'t tear like cheap alternatives.', color: '#B30158' },
        { icon: Wrench, title: 'Easy DIY', description: 'Simple installation process.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={[]}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
