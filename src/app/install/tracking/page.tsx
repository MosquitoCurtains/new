'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'

const INSTALLATION_STEPS = [
  {
    title: 'Unpack and Organize Materials',
    description: 'Lay out all your materials and verify you have everything. Your kit includes: tracking hardware, curtain panels, mounting screws, marine snaps, and magnetic closures. Sort items by type to make installation easier.',
    videoId: 'FqNe9pDsZ8M',
  },
  {
    title: 'Install the Tracking Hardware',
    description: 'Mount the tracking hardware to your overhead surface (beam, soffit, or ceiling). Mark pilot holes, drill, and secure with provided screws. Make sure the track is level for smooth curtain operation.',
    videoId: 'FqNe9pDsZ8M',
  },
  {
    title: 'Hang the Curtain Panels',
    description: 'Insert the curtain glides into the track, then attach your curtain panels. The panels hang from the track and can slide side to side like decorative drapes.',
    videoId: 'FqNe9pDsZ8M',
  },
  {
    title: 'Install Marine Snaps',
    description: 'Attach marine snaps to secure the sides of your curtains to posts or walls. Marine snaps provide a secure hold while allowing easy removal for cleaning or seasonal storage.',
    videoId: '5dWUpGj6lYc',
  },
  {
    title: 'Install Magnetic Doorways',
    description: 'If your project includes doorways, install the magnetic closures. These strong rare-earth magnets seal the doorway tight but open easily when you push through.',
    videoId: 'QaRUVjmJKEY',
  },
  {
    title: 'Final Adjustments',
    description: 'Test the operation of your curtains - they should slide smoothly along the track. Make any final adjustments to ensure a proper seal against insects.',
  },
]

export default function TrackingInstallPage() {
  return (
    <InstallationPageTemplate
      title="Tracking Installation Guide"
      subtitle="Step-by-step instructions for installing mosquito curtains with our overhead tracking system. Tracking allows your curtains to slide open and closed like elegant drapes."
      steps={INSTALLATION_STEPS}
      mainVideoId="FqNe9pDsZ8M"
      showThankYou={true}
      showCareLinks={true}
    />
  )
}
