'use client'

import { useParams } from 'next/navigation'
import SalesPageLayout from '../../../sales/SalesPageLayout'

export default function CVSalesProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  return <SalesPageLayout mode="cv" projectId={projectId} />
}
