'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'

const INSTALLATION_STEPS = [
  {
    title: 'Unpack and Organize Materials',
    description: 'Lay out your clear vinyl panels and all hardware. Your kit includes: clear vinyl panels, velcro strips (or tracking hardware if ordered), marine snaps, and zipper connectors for multi-panel setups.',
    videoId: 'ca6GufadXoE',
  },
  {
    title: 'Handle Vinyl Panels Carefully',
    description: 'Clear vinyl panels should be handled with care to avoid scratches and creases. Unroll panels flat and allow them to relax at room temperature before installation. Do not fold vinyl.',
    videoId: 'ca6GufadXoE',
  },
  {
    title: 'Install Top Attachment',
    description: 'Most clear vinyl installations use velcro top attachment (fixed in place). If you ordered tracking, follow the tracking installation guide. Mount the velcro or tracking to your overhead surface.',
  },
  {
    title: 'Hang the Vinyl Panels',
    description: 'Attach the vinyl panels to your mounted velcro or tracking hardware. For multi-panel installations, panels will zip together at the seams for a tight weather seal.',
    videoId: 'ca6GufadXoE',
  },
  {
    title: 'Install Marine Snaps',
    description: 'Secure the sides and bottom of your vinyl panels with marine snaps. This creates a tight seal against wind and weather.',
    videoId: '5dWUpGj6lYc',
  },
  {
    title: 'Final Adjustments',
    description: 'Test your installation by checking for gaps where wind could enter. Adjust snap placement if needed. Your clear vinyl panels should provide complete weather protection.',
  },
]

export default function ClearVinylInstallPage() {
  return (
    <InstallationPageTemplate
      title="Clear Vinyl Installation Guide"
      subtitle="Step-by-step instructions for installing clear vinyl weather panels. Create a warm, cozy outdoor space protected from wind, rain, and cold."
      steps={INSTALLATION_STEPS}
      mainVideoId="ca6GufadXoE"
      showThankYou={true}
      showCareLinks={true}
    />
  )
}
