'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeaderBarSectionProps {
  children: ReactNode
  /**
   * Icon to display in header
   */
  icon?: LucideIcon
  /**
   * Header label text
   */
  label: string
  /**
   * Color theme for the header bar
   * @default 'green'
   */
  variant?: 'green' | 'blue' | 'pink' | 'dark'
  /**
   * Optional subtitle in header (desktop only)
   */
  headerSubtitle?: string
  /**
   * Additional className for content area
   */
  className?: string
}

const variantStyles = {
  green: {
    header: 'bg-[#406517]',
    border: 'border-[#406517]/20',
  },
  blue: {
    header: 'bg-[#003365]',
    border: 'border-[#003365]/20',
  },
  pink: {
    header: 'bg-[#B30158]',
    border: 'border-[#B30158]/20',
  },
  dark: {
    header: 'bg-gray-900',
    border: 'border-gray-900/20',
  },
}

/**
 * HeaderBarSection - Section with colored header bar
 * 
 * Edit this component to update ALL header bar sections across the site.
 * 
 * @example
 * ```tsx
 * <HeaderBarSection 
 *   icon={Bug} 
 *   label="Insect Protection"
 *   variant="green"
 * >
 *   <YourContent />
 * </HeaderBarSection>
 * ```
 */
export function HeaderBarSection({
  children,
  icon: Icon,
  label,
  variant = 'green',
  headerSubtitle,
  className,
}: HeaderBarSectionProps) {
  const styles = variantStyles[variant]

  return (
    <section>
      <div className={cn('bg-white border-2 rounded-3xl overflow-hidden', styles.border)}>
        {/* Colored Header Bar */}
        <div className={cn('px-6 py-4 flex items-center justify-between', styles.header)}>
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-white" />}
            <span className="text-white font-semibold text-lg uppercase tracking-wider">
              {label}
            </span>
          </div>
          {headerSubtitle && (
            <span className="text-white/70 text-sm hidden sm:block">
              {headerSubtitle}
            </span>
          )}
        </div>
        
        {/* Content Area */}
        <div className={cn('p-6 md:p-8 lg:p-10', className)}>
          {children}
        </div>
      </div>
    </section>
  )
}
