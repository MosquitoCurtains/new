'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Droplets, Sun, Wind, AlertTriangle } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Cleaning Your Mosquito Curtains',
    icon: Droplets,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Our mosquito netting is made from marine-grade polyester that's designed to get wet 
          and handle outdoor conditions. Cleaning is simple:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            <strong>Light Cleaning:</strong> Spray with a garden hose to remove dust and debris
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Deeper Cleaning:</strong> Use mild soap and water, then rinse thoroughly
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Stubborn Stains:</strong> A soft brush with soapy water works well
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Air Dry:</strong> Let curtains dry naturally - they dry quickly
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Weather & UV Protection',
    icon: Sun,
    iconColor: '#FFA501',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Your curtains are built to withstand outdoor conditions:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            <strong>UV Protected:</strong> Solution-dyed fabric won't fade in sunlight
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Rain Safe:</strong> 100% polyester is made to get wet
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Mold Resistant:</strong> Material won't mildew or rot
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Tear Resistant:</strong> Marine-grade netting is incredibly strong
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Seasonal Storage',
    icon: Wind,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          If you want to remove your curtains for winter (not required, but some prefer it):
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            Clean curtains before storage
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Make sure curtains are completely dry
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Fold loosely (don't compress tightly)
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Store in a dry location
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Leave hardware installed - it's weather resistant
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Things to Avoid',
    icon: AlertTriangle,
    iconColor: '#B30158',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          To maximize the life of your curtains, avoid these:
        </Text>
        <BulletedList spacing="sm">
          <ListItem iconColor="#B30158">
            <strong>Bleach:</strong> Can damage the fabric and weaken fibers
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Pressure Washing:</strong> Too strong - can damage mesh
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Machine Washing:</strong> Not necessary and can cause damage
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Machine Drying:</strong> High heat can damage the material
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Harsh Chemicals:</strong> Stick to mild soap and water
          </ListItem>
        </BulletedList>
      </>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Clear Vinyl Care', href: '/care/clear-vinyl', description: 'Care for vinyl panels' },
  { title: 'Installation Guide', href: '/install', description: 'Installation instructions' },
  { title: 'Contact Support', href: '/contact', description: 'Questions about care' },
]

export default function MosquitoCurtainsCarePage() {
  return (
    <SupportPageTemplate
      title="Caring for Mosquito Curtains"
      subtitle="Simple care tips to keep your curtains looking great for years"
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    />
  )
}
