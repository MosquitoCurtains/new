'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'

const INSTALLATION_TYPES = [
  {
    title: 'Tracking Installation',
    description: 'Installation guide for mosquito curtains with overhead tracking system. Curtains slide side-to-side.',
    href: '/install/tracking',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif',
  },
  {
    title: 'Velcro Installation',
    description: 'Installation guide for fixed velcro attachment. Most affordable option, curtains don\'t slide.',
    href: '/install/velcro',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif',
  },
  {
    title: 'Clear Vinyl Installation',
    description: 'Installation guide for clear vinyl weather panels. Block wind, rain, and cold.',
    href: '/install/clear-vinyl',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
  },
]

export default function InstallPage() {
  return (
    <InstallationPageTemplate
      title="Installation Instructions"
      subtitle="Choose your installation type below to see step-by-step video guides. Our DIY installation is about a level 3 out of 10 - if you can operate a tape measure and handle a few household tools, you can do this!"
      installationTypes={INSTALLATION_TYPES}
      showThankYou={true}
      showCareLinks={true}
    />
  )
}
