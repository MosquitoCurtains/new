'use client'

import React from 'react'
import { Check, ChevronRight, X } from 'lucide-react'
import { cn } from '../shared-utils'

// ============================================================================
// LIST ITEM COMPONENT - Mosquito Curtains Light Theme
// ============================================================================

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
  icon?: React.ElementType
  iconColor?: string
  variant?: 'default' | 'checked' | 'numbered' | 'primary' | 'secondary' | 'accent' | 'bullet' | 'arrow' | 'x' | 'dot'
  number?: number
  className?: string
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, icon: IconComponent, iconColor = '#406517', variant = 'default', number, className = '', ...props }, ref) => {
    const renderIcon = () => {
      if (variant === 'checked') {
        return (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#406517]/10 border-2 border-[#406517]/30 flex items-center justify-center">
            <Check className="w-3 h-3" style={{ color: iconColor }} strokeWidth={3} />
          </div>
        )
      }
      
      if (variant === 'x') {
        return (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
            <X className="w-3 h-3" style={{ color: iconColor }} strokeWidth={3} />
          </div>
        )
      }
      
      if (variant === 'numbered' && number !== undefined) {
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#406517]/10 flex items-center justify-center font-bold text-sm" style={{ color: iconColor }}>
            {number}
          </div>
        )
      }
      
      if (variant === 'arrow') {
        return <ChevronRight className="flex-shrink-0 w-4 h-4 mt-0.5" style={{ color: iconColor }} strokeWidth={2} />
      }
      
      if (IconComponent) {
        return <IconComponent className="flex-shrink-0 w-5 h-5" style={{ color: iconColor }} strokeWidth={2} />
      }
      
      // 'default', 'bullet', and 'dot' all render the bullet point
      return (
        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: iconColor }} />
      )
    }

    return (
      <li ref={ref} className={cn('flex items-start gap-3 text-gray-700', className)} {...props}>
        {renderIcon()}
        <span className="flex-1">{children}</span>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
