/**
 * Shared Installation Video Constants
 * 
 * Video IDs extracted from WordPress via deep HTML parsing.
 * See: scripts/extract-install-content.ts
 * See: docs/migrations/install-pages-manifest.json
 * 
 * The "Other Helpful Videos" section appears on ALL 3 installation pages
 * (tracking, velcro, clear vinyl) with identical content.
 */

import type { HelpfulVideo } from '@/lib/design-system/templates/InstallationPageTemplate'

/**
 * Shared "Other Helpful Videos" -- appears on all 3 installation guide pages.
 * Video IDs verified against YouTube thumbnail endpoint (43/43 valid).
 */
export const SHARED_HELPFUL_VIDEOS: HelpfulVideo[] = [
  {
    title: 'Troubleshooting for Wind',
    videoId: 'iJbForzZFZ8',
    duration: '9:49',
  },
  {
    title: 'Panel to Panel Marine Snaps',
    videoId: 'zd_a3vs5y8Y',
    duration: '3:09',
  },
  {
    title: 'Adhesive Back Marine Snaps',
    videoId: 'V96PaQjHvzU',
    duration: '1:11',
    notes: [
      'If you peel and stick and put any "load" on them at all right away they are worthless and will come right off.',
      'If you let them cure for 2 days on masonry, or 6 hours on either Vinyl or aluminum siding, they are fantastic.',
      'They DO NOT work for either Hardi-board or stucco.',
      'To apply, peel and stick and don\'t TOUCH them at all, in fact don\'t even look at them or talk to them until they cure, and by all means, don\'t try to snap to them until the adhesive has fully cured.',
      'If you forgot to let them cure and they come off, use an appropriate adhesive for the surface you are adhering to (like "Liquid Nails for Masonry" at any hardware store).',
      'We\'ve included screw studs as a back up if all else fails. Use masonry drill bit and a little plastic insert to receive the screw (from hardware store).',
    ],
  },
  {
    title: 'Notching Stucco Strip',
    videoId: '28m_3ryXJtA',
    duration: '4:58',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/04/AAA-Notching-Zippered-Stucco-Strip.jpg',
  },
  {
    title: 'Elastic Cord/Belted Rib Alternative',
    videoId: 't1PLQbWRdaI',
    duration: '3:49',
  },
  {
    title: 'Fiberglass Rod Clip',
    videoId: 'x-HLphTKdTI',
    duration: '0:54',
  },
  {
    title: 'Roll Up Technique',
    videoId: 'jGMZACTeOTQ',
    duration: '4:47',
  },
  {
    title: 'Roll Up Shade Screen',
    videoId: 'T_H3cQCINhs',
    duration: '5:25',
  },
]
