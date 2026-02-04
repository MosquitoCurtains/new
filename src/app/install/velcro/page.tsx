'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'

const INSTALLATION_STEPS = [
  {
    title: 'Unpack and Organize Materials',
    description: 'Lay out all your materials and verify you have everything. Your kit includes: curtain panels with velcro strips, adhesive velcro for mounting, marine snaps, and magnetic closures.',
    videoId: 'FqNe9pDsZ8M',
  },
  {
    title: 'Clean and Prep Mounting Surfaces',
    description: 'Clean the surfaces where you\'ll attach the velcro strips. Remove dust, dirt, and oils for the best adhesion. The adhesive velcro works on most surfaces including wood, aluminum, and vinyl.',
  },
  {
    title: 'Apply Velcro Strips',
    description: 'Apply the adhesive velcro strips to your overhead mounting surface. Press firmly and allow to cure for maximum hold. The velcro provides a secure but removable attachment.',
    videoId: 'FqNe9pDsZ8M',
  },
  {
    title: 'Attach Curtain Panels',
    description: 'Press the velcro strips on your curtain panels to the mounted velcro. The panels will hang securely in place. Unlike tracking, velcro panels don\'t slide but are more affordable.',
  },
  {
    title: 'Install Marine Snaps',
    description: 'Attach marine snaps to secure the sides of your curtains to posts or walls. These provide a tight seal against insects while allowing easy removal.',
    videoId: '5dWUpGj6lYc',
  },
  {
    title: 'Install Magnetic Doorways',
    description: 'If your project includes doorways, install the magnetic closures for easy entry and exit while maintaining your bug-free seal.',
    videoId: 'QaRUVjmJKEY',
  },
]

export default function VelcroInstallPage() {
  return (
    <InstallationPageTemplate
      title="Velcro Installation Guide"
      subtitle="Step-by-step instructions for installing mosquito curtains with fixed velcro attachment. This is our most affordable option - panels attach securely but don't slide."
      steps={INSTALLATION_STEPS}
      mainVideoId="FqNe9pDsZ8M"
      showThankYou={true}
      showCareLinks={true}
    />
  )
}
