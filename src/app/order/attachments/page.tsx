import type { Metadata } from 'next'
import { AttachmentsPage } from '@/app/order/components/pages/AttachmentsPage'

export const metadata: Metadata = {
  title: 'Order Attachment Items',
  alternates: { canonical: '/order-attachments' },
}

export default function Page() { return <AttachmentsPage /> }
