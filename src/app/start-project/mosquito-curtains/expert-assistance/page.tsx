'use client'

import { ExpertAssistanceFlow } from '@/components/project'
import type { MeshOptions } from '@/components/project'

const defaultOptions: MeshOptions = {
  meshType: 'heavy_mosquito',
  meshColor: 'black',
  topAttachment: 'velcro',
  velcroColor: 'black',
}

export default function MosquitoCurtainsExpertAssistancePage() {
  return <ExpertAssistanceFlow productType="mosquito-curtains" options={defaultOptions} />
}
