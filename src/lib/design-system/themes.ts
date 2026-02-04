/**
 * Theme System for Startup Design System
 * All themes use CSS variables for easy customization
 */

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export interface Theme {
  name: string
  displayName: string
  description: string
  colors: {
    primary: ColorScale
    secondary: ColorScale
    accent: ColorScale
  }
}

/**
 * Default Theme - Modern Blue & Purple
 */
export const defaultTheme: Theme = {
  name: 'default',
  displayName: 'Default',
  description: 'A modern, professional blue and purple palette',
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6', // Main primary
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    secondary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6', // Main secondary
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    accent: {
      50: '#FCE7F3',
      100: '#FBCFE8',
      200: '#F9A8D4',
      300: '#F472B6',
      400: '#EC4899',
      500: '#DB2777', // Main accent
      600: '#BE185D',
      700: '#9F1239',
      800: '#881337',
      900: '#701A35',
    },
  },
}

/**
 * Startup Theme - Vibrant & Energetic
 */
export const startupTheme: Theme = {
  name: 'startup',
  displayName: 'Startup',
  description: 'Bold, vibrant colors for high-energy brands',
  colors: {
    primary: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E', // Vibrant red
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
    },
    secondary: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981', // Vibrant green
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    accent: {
      50: '#FEF3C7',
      100: '#FEF08A',
      200: '#FDE047',
      300: '#FACC15',
      400: '#EAB308',
      500: '#CA8A04', // Vibrant gold
      600: '#A16207',
      700: '#854D0E',
      800: '#713F12',
      900: '#422006',
    },
  },
}

/**
 * Corporate Theme - Professional & Conservative
 */
export const corporateTheme: Theme = {
  name: 'corporate',
  displayName: 'Corporate',
  description: 'Professional navy and gray for enterprise applications',
  colors: {
    primary: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9',
      600: '#0284C7',
      700: '#0369A1', // Navy blue
      800: '#075985',
      900: '#0C4A6E',
    },
    secondary: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B', // Slate gray
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    accent: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4', // Cyan accent
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
    },
  },
}

/**
 * Minimal Theme - Black, White & One Accent
 */
export const minimalTheme: Theme = {
  name: 'minimal',
  displayName: 'Minimal',
  description: 'Clean black and white with a single accent color',
  colors: {
    primary: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373', // Neutral gray
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    secondary: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A', // Zinc gray
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // Bright orange accent
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
  },
}

/**
 * Neon Theme - High Contrast Cyberpunk
 */
export const neonTheme: Theme = {
  name: 'neon',
  displayName: 'Neon',
  description: 'High-contrast neon colors for bold, modern interfaces',
  colors: {
    primary: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E', // Neon green
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    secondary: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Neon teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    accent: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7', // Neon purple
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#581C87',
    },
  },
}

/**
 * Mosquito Curtains Theme - Custom Brand Colors
 * Based on user-provided color palette
 */
export const mosquitoCurtainsTheme: Theme = {
  name: 'mosquito-curtains',
  displayName: 'Mosquito Curtains',
  description: 'Custom brand palette with earth tones and vibrant accents',
  colors: {
    primary: {
      50: '#F5F8F0',
      100: '#E8F0DB',
      200: '#D1E1B7',
      300: '#B9D293',
      400: '#A2C36F',
      500: '#406517', // Olive green (main brand)
      600: '#365411',
      700: '#2C430E',
      800: '#22320A',
      900: '#182107',
    },
    secondary: {
      50: '#E6F0F8',
      100: '#CCE0F0',
      200: '#99C1E1',
      300: '#66A2D2',
      400: '#3383C3',
      500: '#003365', // Navy blue (main brand)
      600: '#002951',
      700: '#001F3D',
      800: '#001429',
      900: '#000A15',
    },
    accent: {
      50: '#FFF5E6',
      100: '#FFEACC',
      200: '#FFD699',
      300: '#FFC166',
      400: '#FFAD33',
      500: '#FFA501', // Orange (main brand)
      600: '#CC8401',
      700: '#996301',
      800: '#664200',
      900: '#332100',
    },
  },
}

/**
 * All available themes
 */
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  startup: startupTheme,
  corporate: corporateTheme,
  minimal: minimalTheme,
  neon: neonTheme,
  'mosquito-curtains': mosquitoCurtainsTheme,
}

/**
 * Apply a theme to the document by setting CSS variables
 */
export function applyTheme(themeName: string): void {
  const theme = themes[themeName]
  if (!theme) {
    console.warn(`Theme "${themeName}" not found. Using default theme.`)
    return
  }

  const root = document.documentElement

  // Apply primary colors
  Object.entries(theme.colors.primary).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color)
  })

  // Apply secondary colors
  Object.entries(theme.colors.secondary).forEach(([shade, color]) => {
    root.style.setProperty(`--color-secondary-${shade}`, color)
  })

  // Apply accent colors
  Object.entries(theme.colors.accent).forEach(([shade, color]) => {
    root.style.setProperty(`--color-accent-${shade}`, color)
  })

  // Store current theme in localStorage
  localStorage.setItem('theme', themeName)
}

/**
 * Get the current theme from localStorage or return default
 */
export function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'default'
  return localStorage.getItem('theme') || 'default'
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): void {
  const currentTheme = getCurrentTheme()
  applyTheme(currentTheme)
}




