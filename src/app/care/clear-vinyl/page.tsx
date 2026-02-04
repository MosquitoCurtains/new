'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Droplets, Thermometer, FoldVertical, AlertTriangle } from 'lucide-react'
import { Text, BulletedList, ListItem } from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'Cleaning Clear Vinyl',
    icon: Droplets,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Keep your clear vinyl panels crystal clear with proper cleaning:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            <strong>Regular Cleaning:</strong> Rinse with clean water to remove dust
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Deeper Cleaning:</strong> Use mild soap and water with a soft cloth
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Stubborn Spots:</strong> Warm soapy water and gentle rubbing
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Dry Carefully:</strong> Use a soft, lint-free cloth to prevent water spots
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Polish (Optional):</strong> Use a vinyl polish for extra clarity
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Temperature Considerations',
    icon: Thermometer,
    iconColor: '#FFA501',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Clear vinyl behaves differently at different temperatures:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            <strong>Cold Weather:</strong> Vinyl becomes more rigid - this is normal
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Hot Weather:</strong> Vinyl becomes more flexible
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Installation Tip:</strong> Install at moderate temperatures for best results
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Direct Sun:</strong> Panels may feel warm but won't be damaged
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Storage Tips',
    icon: FoldVertical,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          If you remove vinyl panels for summer (when using mosquito curtains instead):
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            <strong>Never Fold:</strong> Always roll vinyl panels to avoid creases
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Clean First:</strong> Make sure panels are clean and dry
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Roll Loosely:</strong> Don't roll too tightly
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Store Flat or Upright:</strong> Keep rolls horizontal or vertical
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            <strong>Moderate Temperature:</strong> Store in a climate-controlled area if possible
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
          Protect your vinyl panels by avoiding these:
        </Text>
        <BulletedList spacing="sm">
          <ListItem iconColor="#B30158">
            <strong>Folding:</strong> Creates permanent creases - always roll
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Abrasive Cleaners:</strong> Can scratch the surface
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Paper Towels:</strong> Can scratch - use soft cloths only
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Ammonia-Based Cleaners:</strong> Can cloud the vinyl
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Pressure Washing:</strong> Too aggressive for vinyl
          </ListItem>
          <ListItem iconColor="#B30158">
            <strong>Sharp Objects:</strong> Vinyl can puncture - handle carefully
          </ListItem>
        </BulletedList>
      </>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Mosquito Curtains Care', href: '/care/mosquito-curtains', description: 'Care for mesh curtains' },
  { title: 'Installation Guide', href: '/install/clear-vinyl', description: 'Installation instructions' },
  { title: 'Contact Support', href: '/contact', description: 'Questions about care' },
]

export default function ClearVinylCarePage() {
  return (
    <SupportPageTemplate
      title="Caring for Clear Vinyl Panels"
      subtitle="Keep your vinyl panels crystal clear and in great condition"
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    />
  )
}
