// Placeholder storage data hook

import { useState, useEffect } from 'react'

export interface StorageData {
  used: number
  total: number
  percentage: number
}

export function useStorageData() {
  const [data, setData] = useState<StorageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // TODO: Implement actual storage data fetching
    setData({
      used: 0,
      total: 1000000000, // 1GB
      percentage: 0,
    })
    setLoading(false)
  }, [])

  return { data, loading, error }
}
