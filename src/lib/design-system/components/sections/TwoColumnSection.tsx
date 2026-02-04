'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TwoColumnSectionProps {
  /**
   * Left column content (typically text)
   */
  left: ReactNode
  /**
   * Right column content (typically media)
   */
  right: ReactNode
  /**
   * Reverse column order (media on left, text on right)
   * @default false
   */
  reversed?: boolean
  /**
   * Vertical alignment
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Additional className
   */
  className?: string
}

/**
 * TwoColumnSection - Responsive two-column layout
 * 
 * Edit this component to update ALL two-column sections across the site.
 * Stacks vertically on mobile, side-by-side on tablet+.
 * 
 * @example
 * ```tsx
 * <TwoColumnSection
 *   left={<TextContent />}
 *   right={<YouTubeEmbed videoId="..." />}
 *   reversed={false}
 * />
 * ```
 */
export function TwoColumnSection({
  left,
  right,
  reversed = false,
  align = 'center',
  className,
}: TwoColumnSectionProps) {
  const alignmentClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }[align]

  return (
    <div 
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
        alignmentClass,
        className
      )}
    >
      <div className={cn(reversed && 'lg:order-2')}>
        {left}
      </div>
      <div className={cn(reversed && 'lg:order-1')}>
        {right}
      </div>
    </div>
  )
}
