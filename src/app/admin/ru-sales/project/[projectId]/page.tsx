'use client'

import { useParams } from 'next/navigation'
import SalesPageLayout from '../../../sales/SalesPageLayout'

export default function RUSalesProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  return <SalesPageLayout mode="ru" projectId={projectId} />
}
