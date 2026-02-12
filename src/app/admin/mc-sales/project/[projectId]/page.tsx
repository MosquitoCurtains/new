'use client'

import { useParams } from 'next/navigation'
import SalesPageLayout from '../../../sales/SalesPageLayout'

export default function MCSalesProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  return <SalesPageLayout mode="mc" projectId={projectId} />
}
