import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import PackingListClient from './PackingListClient'

export default async function PackingListPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: lineItems } = await supabase
    .from('line_items')
    .select('*, line_item_options(*)')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  // Fetch salesperson contact info
  let salesperson = null
  if (order.salesperson_id) {
    const { data } = await supabase
      .from('staff')
      .select('name, email')
      .eq('id', order.salesperson_id)
      .single()
    salesperson = data
  }

  return (
    <PackingListClient
      order={order}
      lineItems={lineItems || []}
      salesperson={salesperson}
    />
  )
}
