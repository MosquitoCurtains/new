'use client'

import { ExpertAssistanceFlow } from '@/components/project'
import type { VinylOptions } from '@/components/project'

const defaultOptions: VinylOptions = {
  panelSize: 'medium',
  canvasColor: 'black',
  topAttachment: 'velcro',
  velcroColor: 'black',
}

export default function ClearVinylExpertAssistancePage() {
  return <ExpertAssistanceFlow productType="clear-vinyl" options={defaultOptions} />
}
