'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../shared-utils'

// ============================================================================
// ITEM LIST CARD - Mosquito Curtains Light Theme
// ============================================================================

interface ItemListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: string[]
  iconColor?: string
  variant?: 'default' | 'elevated'
}

export const ItemListCard = React.forwardRef<HTMLDivElement, ItemListCardProps>(
  ({ title, items, iconColor = '#406517', variant = 'default', className = '', ...props }, ref) => {
    const variants = {
      default: 'rounded-2xl p-6 md:p-8 bg-white border border-gray-200',
      elevated: 'rounded-2xl p-6 md:p-8 bg-white border border-gray-200 shadow-lg'
    }

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        <div className="flex flex-col gap-6 items-stretch">
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-center mb-2 md:mb-3" style={{ color: iconColor }}>
            {title}
          </h3>
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
                <span className="text-gray-700 text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
ItemListCard.displayName = 'ItemListCard'
