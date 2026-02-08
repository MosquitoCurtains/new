import OrderShell from '@/app/order/components/OrderShell'
import { AttachmentsPage } from '@/app/order/components/pages/AttachmentsPage'

export default function Page() {
  return (
    <OrderShell>
      <AttachmentsPage />
    </OrderShell>
  )
}
