'use client'

import { InstallationPageTemplate } from '@/lib/design-system/templates'
import { SHARED_HELPFUL_VIDEOS } from '@/lib/constants/install-videos'

// ============================================================================
// Clear Vinyl Installation
// WordPress source: mosquitocurtains.com/clear-vinyl-installation/
// Video IDs extracted via deep HTML parsing (scripts/extract-install-content.ts)
// Total: 20 unique videos (verified against YouTube thumbnail endpoint)
// ============================================================================

const INTRO_TEXT =
  'There is a full installation video accompanied by a PDF guide that will take you through the entire installation process. We have also broken the installation video into each logical step below so you can easily watch as you go. The representative porch in this video demonstrates our important techniques. Some of these techniques may not apply to your particular project.\n\n(See additional videos below if you are mounting on track.)'

const MAIN_VIDEO = {
  title: 'Complete CV Velcro Install',
  videoId: 'spFLG0Bxo8A',
  duration: '16:19',
}

const INTRO_VIDEO = {
  title: 'Intro & Tools',
  videoId: 'gokKVV2dq8k',
  duration: '1:43',
}

const STEPS = [
  { title: 'Mounting The Velcro', videoId: 'c5udYJ858mw', duration: '1:38' },
  { title: 'Position Panels', videoId: '-Vj9cdicuxg', duration: '1:09' },
  { title: 'Mounting Panels', videoId: '6vXW9n3sObw', duration: '3:26' },
  { title: 'Zipper Doorways', videoId: 'ctXrsA7dN4E', duration: '1:02' },
  { title: 'Sealing Sides', videoId: 'GiIejVc2LGk', duration: '4:03' },
  { title: 'Belted Ribs', videoId: '0Ok4bmy7tMs', duration: '1:32' },
  { title: 'Sealing The Base', videoId: 'b2gvYmXKCi8', duration: '1:05' },
]

const SUPPLEMENTARY_VIDEOS = [
  { title: 'Installation Overview', videoId: 'ePV0S4_Aabc', duration: '1:06' },
]

const MOUNTING_ON_TRACK_VIDEOS = [
  { title: 'Mounting Your Track', videoId: 'f-RxW5_cLQo', duration: '7:46' },
  { title: 'Snap Carriers', videoId: 'lYwtKCtb8-I', duration: '0:53' },
]

export default function ClearVinylInstallPage() {
  return (
    <InstallationPageTemplate
      title="Clear Vinyl Installation"
      introText={INTRO_TEXT}
      mainVideo={MAIN_VIDEO}
      introVideo={INTRO_VIDEO}
      steps={STEPS}
      supplementaryVideos={[...SUPPLEMENTARY_VIDEOS, ...MOUNTING_ON_TRACK_VIDEOS]}
      supplementaryHeading="Additional Videos If You Are Mounting On Track"
      helpfulVideos={SHARED_HELPFUL_VIDEOS}
      showThankYou={true}
      showCareLinks={true}
      careHref="/care/clear-vinyl"
    />
  )
}
