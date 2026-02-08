import OrderShell from '@/app/order/components/OrderShell'
import { TrackHardwarePage } from '@/app/order/components/pages/TrackHardwarePage'

export default function Page() {
  return (
    <OrderShell>
      <TrackHardwarePage />
    </OrderShell>
  )
}
