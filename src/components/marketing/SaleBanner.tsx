'use client'

import React, { useState } from 'react'
import { X, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaleBannerProps {
  message: string
  couponCode?: string
  expiryDate?: string
  className?: string
  dismissible?: boolean
}

export function SaleBanner({ 
  message, 
  couponCode, 
  expiryDate,
  className,
  dismissible = true 
}: SaleBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className={cn(
      'relative bg-gradient-to-r from-[#B30158] to-[#406517] text-white py-3 px-4 text-center',
      className
    )}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Tag className="w-4 h-4" />
        <span className="font-medium">{message}</span>
        {couponCode && (
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
            Code: {couponCode}
          </span>
        )}
        {expiryDate && (
          <span className="text-white/80 text-sm">
            until {expiryDate}
          </span>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
