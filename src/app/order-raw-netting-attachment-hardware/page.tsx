import OrderShell from '@/app/order/components/OrderShell'
import { RNAttachmentsPage } from '@/app/order/components/pages/RNAttachmentsPage'

export default function Page() {
  return (
    <OrderShell>
      <RNAttachmentsPage />
    </OrderShell>
  )
}
