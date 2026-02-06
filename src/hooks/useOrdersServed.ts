/**
 * useOrdersServed Hook
 * 
 * Fetches and returns the current "orders served" count for display.
 * Includes caching and fallback behavior.
 * 
 * Usage:
 * const { count, formatted, isLoading } = useOrdersServed()
 * 
 * Returns:
 * - count: The raw number (e.g., 92035)
 * - formatted: Display string (e.g., "92,035+")
 * - isLoading: Whether the data is still loading
 */

'use client'

import { useState, useEffect } from 'react'

interface OrdersServedData {
  count: number
  formatted: string
  source: string
}

interface UseOrdersServedReturn {
  count: number
  formatted: string
  isLoading: boolean
  error: Error | null
}

// Default fallback values
const DEFAULT_COUNT = 92000
const DEFAULT_FORMATTED = '92,000+'

// Module-level cache for SSR/ISR
let cachedData: OrdersServedData | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function useOrdersServed(): UseOrdersServedReturn {
  const [data, setData] = useState<OrdersServedData | null>(cachedData)
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOrdersServed = async () => {
      // Check if we have valid cached data
      const now = Date.now()
      if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
        setData(cachedData)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/stats/orders-served', {
          next: { revalidate: 3600 } // Revalidate every hour
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders served count')
        }

        const result: OrdersServedData = await response.json()
        
        // Update cache
        cachedData = result
        cacheTimestamp = now
        
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Error fetching orders served:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        // Use fallback values on error
        setData({
          count: DEFAULT_COUNT,
          formatted: DEFAULT_FORMATTED,
          source: 'client-fallback'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrdersServed()
  }, [])

  return {
    count: data?.count ?? DEFAULT_COUNT,
    formatted: data?.formatted ?? DEFAULT_FORMATTED,
    isLoading,
    error
  }
}

/**
 * Format a number as orders served display string
 * Useful for server-side rendering with a known count
 */
export function formatOrdersServed(count: number): string {
  return `${count.toLocaleString('en-US')}+`
}

/**
 * Get static fallback value for SSR
 * Will be replaced by actual value on client hydration
 */
export const ORDERS_SERVED_FALLBACK = {
  count: DEFAULT_COUNT,
  formatted: DEFAULT_FORMATTED
}
