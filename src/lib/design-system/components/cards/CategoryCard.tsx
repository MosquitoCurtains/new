'use client'

import React from 'react'
import { cn } from '../shared-utils'
import { Card } from './Card'

// CategoryCard Component - Square category selection card with icon and label
// Mosquito Curtains Light Theme
interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  category: {
    key: string
    label: string
    icon: React.ElementType
  }
  selected?: boolean
  onClick?: () => void
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
  iconColor?: string
  selectedIconColor?: string
  textSize?: 'xs' | 'sm'
  selectionStyle?: 'ring' | 'border'
}

export const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ 
    category, 
    selected = false, 
    onClick, 
    variant = 'default',
    hover = true,
    iconColor = '#003365', // Navy Blue (secondary)
    selectedIconColor = '#406517', // Forest Green (primary)
    textSize = 'xs',
    selectionStyle = 'ring',
    className = '', 
    ...props 
  }, ref) => {
    const IconComponent = category.icon
    
    const selectionClass = selected 
      ? selectionStyle === 'ring' 
        ? 'ring-2 ring-[#406517] border-[#406517]'
        : 'border border-[#406517]'
      : ''
    
    const textSizeClass = textSize === 'xs' ? 'text-[10px]' : 'text-xs'
    
    return (
      <Card 
        ref={ref}
        variant={variant} 
        hover={hover}
        className={cn(
          'cursor-pointer aspect-square',
          'transition-all duration-300',
          // Override Card's default padding with minimal padding for square aspect ratio
          '!p-1 md:!p-2',
          selectionClass,
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="flex flex-col items-center gap-0.5 md:gap-1 justify-center h-full">
          <IconComponent 
            size={20}
            color={selected ? selectedIconColor : iconColor}
            strokeWidth={2}
            className="flex-shrink-0"
          />
          <span className={cn(
            textSizeClass,
            'font-medium text-center leading-tight text-gray-700 break-words hyphens-auto'
          )}>
            {category.label}
          </span>
        </div>
      </Card>
    )
  }
)
CategoryCard.displayName = 'CategoryCard'
