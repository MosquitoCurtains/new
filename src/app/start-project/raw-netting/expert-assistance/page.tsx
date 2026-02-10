'use client'

import { ExpertAssistanceFlow } from '@/components/project'
import type { RawMaterialOptions } from '@/components/project'

const defaultOptions: RawMaterialOptions = {
  meshType: 'heavy_mosquito',
  meshColor: 'black',
}

export default function RawNettingExpertAssistancePage() {
  return <ExpertAssistanceFlow productType="raw-netting" options={defaultOptions} />
}
