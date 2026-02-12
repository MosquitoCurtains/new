'use client'

import { useParams } from 'next/navigation'
import SalesPageLayout from '../../../sales/SalesPageLayout'

export default function RNSalesProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  return <SalesPageLayout mode="rn" projectId={projectId} />
}
