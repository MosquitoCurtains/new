'use client'

import React from 'react'
import { cn } from '../shared-utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const BRAND_GREEN = '#406517'

const sizeConfig = {
  sm: { container: 20, logoPercent: 0.55, strokeWidth: 2 },
  md: { container: 36, logoPercent: 0.55, strokeWidth: 2.5 },
  lg: { container: 52, logoPercent: 0.55, strokeWidth: 3 },
  xl: { container: 72, logoPercent: 0.55, strokeWidth: 3.5 },
}

/**
 * MC Branded Spinner
 * 
 * Mosquito Curtains logo centered inside a spinning circular ring
 * in brand forest green (#406517).
 * 
 * Sizes:
 * - sm (20px) — inline/button use
 * - md (36px) — default
 * - lg (52px) — page-level loading
 * - xl (72px) — hero / full-page loading
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const c = sizeConfig[size]
    const logoSize = Math.round(c.container * c.logoPercent)
    const r = (c.container / 2) - c.strokeWidth
    const circumference = 2 * Math.PI * r

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center relative', className)}
        style={{ width: c.container, height: c.container }}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {/* Spinning ring */}
        <svg
          className="absolute inset-0 animate-spin"
          width={c.container}
          height={c.container}
          viewBox={`0 0 ${c.container} ${c.container}`}
          fill="none"
        >
          {/* Background track */}
          <circle
            cx={c.container / 2}
            cy={c.container / 2}
            r={r}
            stroke={BRAND_GREEN}
            strokeWidth={c.strokeWidth}
            opacity={0.15}
          />
          {/* Animated arc */}
          <circle
            cx={c.container / 2}
            cy={c.container / 2}
            r={r}
            stroke={BRAND_GREEN}
            strokeWidth={c.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.28} ${circumference * 0.72}`}
          />
        </svg>

        {/* MC Logo */}
        <svg
          width={logoSize}
          height={logoSize}
          viewBox="0 0 512 512"
          fill={BRAND_GREEN}
          className="relative z-10"
          aria-hidden="true"
        >
          <path d="M490.61,475.03c5.74,3.36,11.69,5.82,17.7,7.32-15.07,4.29-30.49,5.56-46.16,5.08-29.66-.92-36.13-11.81-36.13-11.81l-.04-31.03v-.17h-.06s.03-188.35.03-188.35l-.03-188.34h.06v-.17l-8.73,4.43c-23.44,11.9-46.25,28.25-67.79,48.61-21.44,20.28-40.66,42.23-57.15,65.25l-2.26,3.15,1.92,3.36c6.32,11.05,10.53,21.6,12.51,31.35,2.03,9.94,3.06,19.14,3.06,27.36,0,18.02-5.19,30.78-15.85,39.03-10.78,8.36-22.27,12.56-35.08,12.81v.03c-.21,0-.42-.01-.63-.01-.21,0-.42.01-.63.01v-.03c-12.81-.26-24.3-4.45-35.08-12.81-10.66-8.25-15.85-21.02-15.85-39.03,0-8.22,1.03-17.43,3.06-27.36,1.98-9.75,6.19-20.29,12.51-31.35l1.92-3.36-2.26-3.15c-16.49-23.02-35.71-44.97-57.15-65.25-21.54-20.36-44.35-36.71-67.79-48.61l-8.73-4.43v.17h.06s-.03,188.35-.03,188.35l.03,188.34h-.06v.17l-.04,31.03s-6.47,10.88-36.13,11.81c-15.67.49-31.09-.79-46.16-5.08,6.02-1.5,11.96-3.96,17.7-7.32,7.36-4.32,12.55-11.1,15.43-20.13V57.25c-2.89-9.03-8.07-15.81-15.43-20.13-5.74-3.36-11.69-5.82-17.7-7.32,15.07-4.29,30.51-6,46.16-5.08,25.24,1.47,50.26,7.46,74.38,17.81,24.25,10.41,47.68,24.25,69.63,41.14,22.01,16.95,41.6,35.38,58.22,54.76l3.93,4.58,3.93-4.58c16.62-19.39,36.21-37.81,58.22-54.76,21.95-16.89,45.38-30.73,69.63-41.14,24.12-10.34,49.14-16.33,74.38-17.81,15.65-.92,31.09.79,46.16,5.08-6.02,1.5-11.96,3.96-17.7,7.32-7.36,4.32-12.55,11.1-15.43,20.13v397.65c2.89,9.03,8.07,15.81,15.43,20.13ZM275.17,249.49c0-11.95-9.21-25.3-19.17-36.54-9.95,11.24-19.17,24.59-19.17,36.54s8.59,21.63,19.17,21.63,19.17-9.68,19.17-21.63Z" />
        </svg>

        {/* Screen reader text */}
        <span className="sr-only">Loading</span>
      </div>
    )
  }
)
Spinner.displayName = 'Spinner'
