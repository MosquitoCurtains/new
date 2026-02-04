// Mosquito Curtains Design System
// Design Tokens - Single source of truth for all design values
// Path: /src/lib/design-system/tokens.ts

export const colors = {
  // Primary Brand Color - Forest Green
  primary: {
    50: '#E8F5E9',   // Light green tint
    100: '#C8E6C9',  // Lighter green
    200: '#A5D6A7',  // Light green
    500: '#406517',  // Forest Green (main brand color)
    600: '#365512',  // Darker forest
    700: '#2C440E',  // Dark forest
  },
  
  // Secondary Brand Color - Navy Blue
  secondary: {
    50: '#E3F2FD',   // Light blue tint
    100: '#BBDEFB',  // Lighter blue
    200: '#90CAF9',  // Light blue
    500: '#003365',  // Navy Blue (main)
    600: '#002952',  // Darker navy
    700: '#001F3F',  // Dark navy
  },
  
  // Accent Color - Magenta
  accent: {
    50: '#FCE4EC',   // Light magenta tint
    100: '#F8BBD9',  // Lighter magenta
    200: '#F48FB1',  // Light magenta
    500: '#B30158',  // Magenta (main accent)
    600: '#8E0146',  // Darker magenta
    700: '#6A0135',  // Dark magenta
  },
  
  // Highlight Color - Orange
  highlight: {
    50: '#FFF8E1',   // Light orange tint
    100: '#FFECB3',  // Lighter orange
    200: '#FFE082',  // Light orange
    500: '#FFA501',  // Orange (highlight)
    600: '#FF8F00',  // Darker orange
    700: '#FF6F00',  // Dark orange
  },
  
  // Neutral Colors
  neutral: {
    0: '#000000',    // Pure Black
    50: '#F9F9F9',   // Very Light Gray
    100: '#F3F4F6',  // Light Gray
    200: '#E5E7EB',  // Secondary Text
    300: '#D1D5DB',  // Border Light
    400: '#9CA3AF',  // Tertiary Text
    500: '#6B7280',  // Subtle Text
    600: '#4B5563',  // Disabled Text
    700: '#374151',  // Text Dark
    800: '#1F2937',  // Dark Gray (Cards)
    900: '#111827',  // Darker Gray
    white: '#FFFFFF',
    // Special aliases for clarity
    cardBg: '#FFFFFF',
    inputBg: '#F9FAFB',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },
  
  // Semantic Colors
  semantic: {
    success: '#406517',    // Forest Green / Success
    info: '#003365',       // Navy Blue / Info
    warning: '#FFA501',    // Orange / Warning
    error: '#DC2626',      // Red / Error
    premium: '#B30158',    // Magenta / Premium
  }
} as const

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Pill shape
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Brand-specific shadows
  primary: '0 4px 12px rgba(64, 101, 23, 0.3)',
  secondary: '0 4px 12px rgba(0, 51, 101, 0.3)',
  accent: '0 4px 12px rgba(179, 1, 88, 0.3)',
  highlight: '0 4px 12px rgba(255, 165, 1, 0.3)',
  
  // Button shadows
  button: '0 4px 14px rgba(0, 0, 0, 0.15)',
  buttonHover: '0 6px 20px rgba(64, 101, 23, 0.3)',
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Courier New', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const

export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const

// Brand-specific gradients
export const gradients = {
  primary: 'linear-gradient(135deg, #406517, #5A8F20)',
  secondary: 'linear-gradient(135deg, #003365, #0055A5)',
  accent: 'linear-gradient(135deg, #B30158, #E91E8A)',
  highlight: 'linear-gradient(135deg, #FFA501, #FFCC00)',
  brand: 'linear-gradient(135deg, #406517, #003365)',
  hero: 'linear-gradient(135deg, #406517, #003365, #B30158)',
  heroGlow: 'linear-gradient(135deg, rgba(64, 101, 23, 0.2), rgba(0, 51, 101, 0.1), rgba(179, 1, 88, 0.2))',
} as const

// Animation durations
export const durations = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',   // Standard button/card transitions
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const

// Easing functions
export const easings = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0.5rem 1rem',
      smDesktop: '0.5rem 1.25rem',
      md: '0.625rem 1.25rem',
      mdDesktop: '0.75rem 1.75rem',
      lg: '0.75rem 1.5rem',
      lgDesktop: '1rem 2.5rem',
      xl: '0.875rem 2rem',
      xlDesktop: '1.25rem 3rem',
    },
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.75rem 1rem',
      lg: '1rem 1.25rem',
    },
  },
  card: {
    padding: {
      mobile: '1.5rem',
      desktop: '2rem',
      horizontalMobile: '0.5rem',
      horizontalDesktop: '2rem',
    },
    borderRadius: '1rem',
    borderWidth: '1px',
    paddingClass: 'p-4 md:p-6 lg:p-8',
  },
} as const

// Container widths
export const containers = {
  sm: '48rem',    // 768px
  md: '64rem',    // 1024px
  lg: '80rem',    // 1280px
  xl: '88rem',    // 1408px
  '2xl': '100rem', // 1600px
  full: '100%',
} as const

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  breakpoints,
  gradients,
  durations,
  easings,
  zIndex,
  components,
  containers,
}
