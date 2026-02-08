'use client'

/**
 * LivePriceDisplay — Animated price that updates as options change.
 *
 * Shows the current calculated price with a brief scale animation when it changes.
 * Used across all order pages for real-time price feedback.
 */

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface LivePriceDisplayProps {
  price: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Show a "per foot" or other unit suffix */
  suffix?: string
  /** If true, dim the display (e.g., when inputs are incomplete) */
  dimmed?: boolean
}

function formatMoney(value: number) {
  return value.toFixed(2)
}

export default function LivePriceDisplay({
  price,
  label = 'Total',
  size = 'md',
  className,
  suffix,
  dimmed = false,
}: LivePriceDisplayProps) {
  const [animating, setAnimating] = useState(false)
  const prevPriceRef = useRef(price)

  useEffect(() => {
    if (price !== prevPriceRef.current && price > 0) {
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 300)
      prevPriceRef.current = price
      return () => clearTimeout(timer)
    }
    prevPriceRef.current = price
  }, [price])

  const sizeClasses = {
    sm: { label: 'text-xs', price: 'text-lg', suffix: 'text-xs' },
    md: { label: 'text-sm', price: 'text-2xl', suffix: 'text-sm' },
    lg: { label: 'text-base', price: 'text-3xl', suffix: 'text-base' },
  }

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {label && (
        <span className={cn(sizeClasses[size].label, 'text-gray-500 font-medium')}>
          {label}
        </span>
      )}
      <span
        className={cn(
          sizeClasses[size].price,
          'font-bold tabular-nums transition-all duration-200',
          dimmed ? 'text-gray-300' : 'text-[#406517]',
          animating && 'scale-110'
        )}
      >
        ${formatMoney(price)}
      </span>
      {suffix && (
        <span className={cn(sizeClasses[size].suffix, 'text-gray-400')}>
          {suffix}
        </span>
      )}
    </div>
  )
}
