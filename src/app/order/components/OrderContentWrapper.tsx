'use client'

/**
 * Reserves right margin on desktop so main content is not covered by the cart sidebar.
 * Matches admin sales: margin-right 48px (collapsed) or 288px (expanded).
 */

import { useCartContext } from '@/contexts/CartContext'
import { cn } from '@/lib/utils'

export default function OrderContentWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { sidebarCollapsed } = useCartContext()

  return (
    <div
      className={cn(
        'transition-[margin-right] duration-300 ease-in-out',
        sidebarCollapsed ? 'md:mr-12' : 'md:mr-72',
        className
      )}
    >
      {children}
    </div>
  )
}
