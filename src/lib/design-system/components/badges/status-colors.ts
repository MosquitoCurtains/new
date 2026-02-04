import * as tokens from '../../tokens'

/**
 * STATUS BADGE SYSTEM - Mosquito Curtains
 * Standardized status styling across all features
 */

// Status color constants for consistent theming
export const STATUS_COLORS = {
  active: {
    // Forest Green - Active/Success State
    bg: tokens.colors.primary[500],        // #406517
    text: '#FFFFFF',                       // White
    border: tokens.colors.primary[500],
    bgSubtle: 'rgba(64, 101, 23, 0.2)',
    textSubtle: tokens.colors.primary[500],
    borderSubtle: 'rgba(64, 101, 23, 0.3)',
  },
  draft: {
    // Orange/Highlight - Work in Progress
    bg: tokens.colors.highlight[500],       // #FFA501
    text: '#000000',                        // Black
    border: tokens.colors.highlight[500],
    bgSubtle: 'rgba(255, 165, 1, 0.2)',
    textSubtle: '#FFA501',
    borderSubtle: 'rgba(255, 165, 1, 0.3)',
  },
  complete: {
    // Navy Blue - Completed state
    bg: tokens.colors.secondary[500],       // #003365
    text: '#FFFFFF',                        // White
    border: tokens.colors.secondary[500],
    bgSubtle: 'rgba(0, 51, 101, 0.2)',
    textSubtle: '#0055A5',
    borderSubtle: 'rgba(0, 51, 101, 0.3)',
  },
  paused: {
    // Magenta/Accent - Paused state
    bg: tokens.colors.accent[500],          // #B30158
    text: '#FFFFFF',                        // White
    border: tokens.colors.accent[500],
    bgSubtle: 'rgba(179, 1, 88, 0.2)',
    textSubtle: '#B30158',
    borderSubtle: 'rgba(179, 1, 88, 0.3)',
  },
  archived: {
    // Neutral Gray - Archived/Inactive
    bg: tokens.colors.neutral[600],         // #4B5563
    text: '#FFFFFF',                        // White
    border: tokens.colors.neutral[600],
    bgSubtle: 'rgba(75, 85, 99, 0.2)',
    textSubtle: tokens.colors.neutral[400], // #9CA3AF
    borderSubtle: 'rgba(75, 85, 99, 0.3)',
  },
} as const

export type StatusType = keyof typeof STATUS_COLORS
