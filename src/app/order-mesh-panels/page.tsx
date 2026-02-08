import OrderShell from '@/app/order/components/OrderShell'
import { MeshPanelsPage } from '@/app/order/components/pages/MeshPanelsPage'

export default function Page() {
  return (
    <OrderShell>
      <MeshPanelsPage />
    </OrderShell>
  )
}
