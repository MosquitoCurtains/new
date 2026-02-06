/**
 * OrdersServedCount Component
 * 
 * Displays the current "orders served" count dynamically.
 * Uses a client-side hook to fetch the latest value.
 * 
 * Usage:
 * <OrdersServedCount />                    // "92,035+"
 * <OrdersServedCount suffix=" customers" /> // "92,035+ customers"
 * <OrdersServedCount prefix="Over " />      // "Over 92,035+"
 */

'use client'

import { useOrdersServed } from '@/hooks/useOrdersServed'

interface OrdersServedCountProps {
  /** Text to show before the count */
  prefix?: string
  /** Text to show after the count (default: "+") */
  suffix?: string
  /** CSS class name for styling */
  className?: string
  /** Whether to show loading skeleton */
  showLoading?: boolean
}

export function OrdersServedCount({
  prefix = '',
  suffix = '+',
  className = '',
  showLoading = false
}: OrdersServedCountProps) {
  const { count, isLoading } = useOrdersServed()

  if (isLoading && showLoading) {
    return (
      <span className={`inline-block animate-pulse bg-gray-200 rounded ${className}`}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    )
  }

  const formattedCount = count.toLocaleString('en-US')

  return (
    <span className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  )
}

/**
 * Static version for server components
 * Shows fallback value that will be replaced by JS on hydration
 */
export function OrdersServedCountStatic({
  prefix = '',
  suffix = '+',
  className = '',
  fallbackCount = 92000
}: OrdersServedCountProps & { fallbackCount?: number }) {
  const formattedCount = fallbackCount.toLocaleString('en-US')

  return (
    <span className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  )
}

export default OrdersServedCount
