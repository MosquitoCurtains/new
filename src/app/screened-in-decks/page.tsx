'use client'

import { ProjectTypePageTemplate } from '@/lib/design-system/templates'
import { Package, Truck, Shield, Wrench } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Screen Your Deck Without Breaking the Bank',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Deck screening doesn't have to cost thousands or require permanent construction. Our custom 
          mosquito netting curtains can transform your covered deck into a bug-free zone for a fraction 
          of traditional screening costs.
        </Text>
        <Text className="text-gray-600">
          If your deck has a roof or pergola cover, our curtains can hang from the overhead structure 
          and create an effective barrier against mosquitoes, gnats, and other flying pests.
        </Text>
      </>
    ),
    bullets: [
      'Works with any covered deck configuration',
      'Hang from roof overhang, pergola, or installed track',
      'Removable for winter or when not needed',
      'Costs a fraction of permanent deck screening',
    ],
  },
  {
    title: 'Flexible Options for Decks',
    content: (
      <BulletedList spacing="md">
        <ListItem variant="checked" iconColor="#406517">
          Tracking system lets you slide curtains open and closed
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Velcro attachment for fixed, permanent mounting
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Mix and match - track on some sides, fixed on others
        </ListItem>
        <ListItem variant="checked" iconColor="#406517">
          Magnetic closures for walk-through doorways
        </ListItem>
      </BulletedList>
    ),
    reversed: true,
  },
]

export default function ScreenedInDecksPage() {
  return (
    <ProjectTypePageTemplate
      title="Screened-In Decks"
      subtitle="Transform your covered deck into a bug-free outdoor room with custom mosquito netting curtains."
      benefits={[
        { icon: Package, title: 'Custom Made', description: 'Sized to fit your deck perfectly.', color: '#406517' },
        { icon: Truck, title: 'Quick Ship', description: '6-10 business days to arrive.', color: '#003365' },
        { icon: Shield, title: 'Quality', description: 'Marine-grade materials that last.', color: '#B30158' },
        { icon: Wrench, title: 'DIY Friendly', description: 'Install yourself in a day.', color: '#FFA501' },
      ]}
      overviewVideoId="FqNe9pDsZ8M"
      galleryImages={[]}
      contentSections={CONTENT_SECTIONS}
      showReviews={true}
      productType="mosquito_curtains"
    />
  )
}
