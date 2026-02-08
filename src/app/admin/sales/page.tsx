import { redirect } from 'next/navigation'

/**
 * /admin/sales redirects to /admin/mc-sales (the default mode).
 */
export default function SalesRedirect() {
  redirect('/admin/mc-sales')
}
