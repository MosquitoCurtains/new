import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import InvoiceClient from './InvoiceClient'

export default async function InvoicePage({
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

  return (
    <InvoiceClient
      order={order}
      lineItems={lineItems || []}
    />
  )
}
