'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'
import { SHARED_HELPFUL_VIDEOS } from '@/lib/constants/install-videos'

// ============================================================================
// Mosquito Curtains Velcro Installation
// WordPress source: mosquitocurtains.com/mosquito-curtains-velcro-installation/
// Video IDs extracted via deep HTML parsing (scripts/extract-install-content.ts)
// Total: 20 unique videos (verified against YouTube thumbnail endpoint)
// ============================================================================

const INTRO_TEXT =
  'There is a full installation video accompanied by a PDF guide that will take you through the entire installation process. We have also broken the installation video into each logical step below so you can easily watch as you go. The representative porch in this video demonstrates our important techniques. Some of these techniques may not apply to your particular project.'

const PDF_URL =
  'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Curtains-Velcro-Installation.pdf'

const MAIN_VIDEO = {
  title: 'Complete Velcro Installation',
  videoId: 'ppeg-bHYbnM',
  duration: '28:38',
}

const INTRO_VIDEO = {
  title: 'Intro & Tools',
  videoId: 'hoj_v-K7oyI',
  duration: '2:41',
}

const STEPS = [
  { title: 'Mount Adhesive Velcro', videoId: 'A53ZmGrqldM', duration: '1:43' },
  { title: 'Handling Surface Gaps', videoId: 'zYkq1Y6BXpE', duration: '1:15' },
  { title: 'Preparing Your Curtains', videoId: '8CL37S0l8oU', duration: '1:24' },
  { title: 'Magnetic Doorways', videoId: 'VybQ5VyjvKg', duration: '7:19' },
  { title: 'Fiberglass Rods', videoId: 'DJlBOrM5Osc', duration: '2:38' },
  { title: 'Mounting Your Curtains', videoId: 'xsj7Hx5Zgis', duration: '1:43' },
  { title: 'Attaching The Sides', videoId: 'B060Mbf2DAk', duration: '3:01' },
  { title: 'Installing Elastic Cord', videoId: 'pmhdVAbXrf8', duration: '3:52' },
  { title: 'Sealing the Base', videoId: 'GjMOAeHQC_Q', duration: '1:48' },
]

const SUPPLEMENTARY_VIDEOS = [
  { title: 'Velcro Installation Overview', videoId: 'y36Rbkm8sNs', duration: '1:28' },
]

export default function VelcroInstallPage() {
  return (
    <InstallationPageTemplate
      title="Mosquito Curtains Velcro Installation"
      introText={INTRO_TEXT}
      pdfDownloadUrl={PDF_URL}
      mainVideo={MAIN_VIDEO}
      introVideo={INTRO_VIDEO}
      steps={STEPS}
      supplementaryVideos={SUPPLEMENTARY_VIDEOS}
      helpfulVideos={SHARED_HELPFUL_VIDEOS}
      showThankYou={true}
      showCareLinks={true}
    />
  )
}
