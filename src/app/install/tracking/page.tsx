'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'
import { SHARED_HELPFUL_VIDEOS } from '@/lib/constants/install-videos'

// ============================================================================
// Mosquito Curtains Tracking Installation
// WordPress source: mosquitocurtains.com/mosquito-curtains-tracking-installation/
// Video IDs extracted via deep HTML parsing (scripts/extract-install-content.ts)
// Total: 23 unique videos (verified against YouTube thumbnail endpoint)
// ============================================================================

const INTRO_TEXT =
  'There is a full installation video accompanied by a PDF guide that will take you through the entire installation process. We have also broken the installation video into each logical step below so you can easily watch as you go. The representative porch in this video demonstrates our important techniques. Some of these techniques may not apply to your particular project.'

const PDF_URL =
  'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Curtains-Tracking-Installation.pdf'

const MAIN_VIDEO = {
  title: 'Complete Tracking Installation',
  videoId: 'SSg8GjlHJwY',
  duration: '39:59',
}

const INTRO_VIDEO = {
  title: 'Intro & Tools',
  videoId: '3BJkAgANU3k',
  duration: '3:46',
}

const STEPS = [
  { title: 'Mounting Track', videoId: 'Afrp9s8LlHw', duration: '7:47' },
  { title: 'Snap Carriers', videoId: 'lYwtKCtb8-I', duration: '0:53' },
  { title: 'Magnetic Doorways', videoId: 'TbQqNsK24as', duration: '7:33' },
  { title: 'Fiberglass Rods', videoId: 'DJlBOrM5Osc', duration: '2:38' },
  { title: 'Installing Stucco Strips', videoId: 'bv6IiEeM_Lk', duration: '2:27' },
  { title: 'Mounting Your Curtains', videoId: 'B3JppKvi5MU', duration: '1:54' },
  { title: 'Attaching The Sides', videoId: 'njVgXY-9cmc', duration: '4:05' },
  { title: 'Elastic Cords \u2013 Tracking', videoId: 'pmhdVAbXrf8', duration: '3:52' },
  { title: 'Sealing the Base', videoId: 'GjMOAeHQC_Q', duration: '1:05' },
]

const SUPPLEMENTARY_VIDEOS = [
  { title: 'Project Recap', videoId: 'dC-9UByQyOI', duration: '4:00' },
  { title: 'Standard vs. Heavy Track', videoId: 'yZoLw0PDPaY', duration: '2:41' },
  { title: 'Economy Snap Tool', videoId: 'Dytuz4r0ciM', duration: '4:42' },
  { title: 'Mounting Track With Double-sided Tape', videoId: 'luCAqhSjNEk', duration: '3:44' },
]

export default function TrackingInstallPage() {
  return (
    <InstallationPageTemplate
      title="Mosquito Curtains Tracking Installation"
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
