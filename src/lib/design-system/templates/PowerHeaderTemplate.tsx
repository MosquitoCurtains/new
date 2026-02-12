'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { 
  ArrowRight, 
  Sparkles,
  Play,
  Calculator,
  MessageSquare,
  LucideIcon,
} from 'lucide-react'
import { 
  Stack, 
  Heading, 
  Text, 
  Button, 
  Badge,
  YouTubeEmbed,
  TwoColumn,
} from '../components'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'

// ============================================================================
// TYPES
// ============================================================================

export interface PowerHeaderAction {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText: string
  color: string
}

export interface PowerHeaderTemplateProps {
  /**
   * Main page title
   */
  title: string
  /**
   * Subtitle/description (optional - omit for title-only heroes)
   */
  subtitle?: string
  /**
   * Trust badge text (e.g., "Trusted by 92,000+ customers")
   */
  trustBadge?: string
  /**
   * Primary CTA button text
   */
  ctaText?: string
  /**
   * Primary CTA link
   */
  ctaHref?: string
  /**
   * YouTube video ID for overview video
   */
  videoId?: string
  /**
   * Video title for accessibility
   */
  videoTitle?: string
  /**
   * Custom thumbnail URL for video
   */
  thumbnailUrl?: string
  /**
   * Action cards to display
   */
  actions?: PowerHeaderAction[]
  /**
   * Layout variant
   * - 'stacked': Home page style - hero content with divider, content goes in children
   * - 'compact': Hero left, video right, actions in bar (conserves space)
   * @default 'compact'
   */
  variant?: 'stacked' | 'compact'
  /**
   * Divider heading text (stacked variant only)
   * @default 'Get Started'
   */
  dividerHeading?: string
  /**
   * Divider subtext (stacked variant only)
   * @default 'Watch the overview, then plan your project'
   */
  dividerSubtext?: string
  /**
   * Whether to show the divider (stacked variant only)
   * @default true
   */
  showDivider?: boolean
  /**
   * Whether to show the primary CTA button
   * @default true
   */
  showCta?: boolean
  /**
   * Custom CTA slot — when provided, replaces the default CTA button.
   * Useful for rendering multiple buttons or custom anchor links.
   */
  ctaSlot?: ReactNode
  /**
   * Additional content below the header (inside the container for stacked, outside for compact)
   */
  children?: ReactNode
}

// ============================================================================
// DEFAULT ACTIONS
// ============================================================================

const defaultActions: PowerHeaderAction[] = [
  {
    icon: Play,
    title: 'Options',
    description: 'Mesh types, top attachments & usability.',
    href: '/options',
    buttonText: 'Discover',
    color: '#406517',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Get an estimate within 5% of actual cost.',
    href: '/start-project',
    buttonText: 'Calculate',
    color: '#003365',
  },
  {
    icon: MessageSquare,
    title: 'Ordering',
    description: 'Our team will help plan your project!',
    href: '/contact',
    buttonText: 'Contact',
    color: '#B30158',
  },
]

// ============================================================================
// POWER HEADER TEMPLATE
// ============================================================================

/**
 * PowerHeaderTemplate - Flexible hero section for landing pages
 * 
 * Two variants:
 * - 'compact' (default): Hero left, video right, actions in bar (conserves space)
 * - 'stacked': Home page style - centered hero with optional divider, content passed via children
 * 
 * @example Compact variant (default)
 * ```tsx
 * <PowerHeaderTemplate
 *   title="Screened Porch Enclosures"
 *   subtitle="Custom-made mosquito netting panels for any space."
 *   videoId="FqNe9pDsZ8M"
 * />
 * ```
 * 
 * @example Stacked variant with custom content
 * ```tsx
 * <PowerHeaderTemplate
 *   title="Transform Your Outdoor Space"
 *   subtitle="Custom-crafted screen enclosures and clear vinyl panels."
 *   variant="stacked"
 *   dividerHeading="Choose Your Solution"
 *   dividerSubtext="Custom-made to your exact measurements"
 * >
 *   <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
 *     {products.map(p => <ProductCard key={p.title} {...p} />)}
 *   </Grid>
 * </PowerHeaderTemplate>
 * ```
 */
export function PowerHeaderTemplate({
  title,
  subtitle,
  trustBadge = ORDERS_SERVED_STRINGS.trustedBy,
  ctaText = 'Start Your Project',
  ctaHref = '/start-project',
  videoId,
  videoTitle = 'Overview Video',
  thumbnailUrl,
  actions = defaultActions,
  variant = 'compact',
  dividerHeading = 'Get Started',
  dividerSubtext = 'Watch the overview, then plan your project',
  showDivider = true,
  showCta = true,
  ctaSlot,
  children,
}: PowerHeaderTemplateProps) {
  
  if (variant === 'compact') {
    return (
      <section className="relative">
        {/* Background blurs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
        </div>
        
        {/* Main container */}
        <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl overflow-hidden">
          
          {/* Hero Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {videoId ? (
              <TwoColumn gap="lg" className="items-center">
                {/* Left: Hero Content */}
                <Stack gap="md" className="text-center md:text-left">
                  {trustBadge && (
                    <div className="flex justify-center md:justify-start">
                      <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {trustBadge}
                      </Badge>
                    </div>
                  )}
                  
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                    {title}
                  </h1>
                  
                  {subtitle && (
                    <p className="text-base md:text-lg text-gray-600">
                      {subtitle}
                    </p>
                  )}
                  
                  {ctaSlot ? (
                    <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                      {ctaSlot}
                    </div>
                  ) : showCta ? (
                    <div className="pt-2 flex justify-center md:justify-start">
                      <Button variant="primary" size="lg" asChild>
                        <Link href={ctaHref}>
                          {ctaText}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </Stack>
                
                {/* Right: Video */}
                <YouTubeEmbed
                  videoId={videoId}
                  title={videoTitle}
                  variant="card"
                  thumbnailUrl={thumbnailUrl}
                />
              </TwoColumn>
            ) : (
              /* Centered: Hero Content (no video) */
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <Stack gap="md" className="w-full items-center">
                  {trustBadge && (
                    <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {trustBadge}
                    </Badge>
                  )}
                  
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                    {title}
                  </h1>
                  
                  {subtitle && (
                    <p className="text-base md:text-lg text-gray-600">
                      {subtitle}
                    </p>
                  )}
                  
                  {ctaSlot ? (
                    <div className="pt-2 flex flex-wrap gap-3 justify-center">
                      {ctaSlot}
                    </div>
                  ) : showCta ? (
                    <div className="pt-2">
                      <Button variant="primary" size="lg" asChild>
                        <Link href={ctaHref}>
                          {ctaText}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </Stack>
              </div>
            )}
          </div>
          
          {/* Actions Bar - only when actions provided */}
          {actions && actions.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {actions.map((action, idx) => (
                    <Link
                      key={idx}
                      href={action.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <action.icon className="w-6 h-6" style={{ color: action.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base">{action.title}</p>
                        <p className="text-sm text-gray-500 truncate hidden lg:block">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))}
              </div>
            </div>
          )}
          
        </div>
        
        {children}
      </section>
    )
  }
  
  // 'stacked' variant - Home page style container
  return (
    <section className="relative">
      {/* Background blurs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
      </div>
      
      {/* Main container with gradient border */}
      <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
        
        {/* Hero Content - Centered */}
        <div className={`flex flex-col items-center text-center space-y-4 ${(showDivider || children) ? 'mb-8' : ''}`}>
          {trustBadge && (
            <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
              <Sparkles className="w-4 h-4 mr-2" />
              {trustBadge}
            </Badge>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {showCta && (
            <div className="pt-1">
              <Button variant="primary" size="lg" asChild>
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Divider */}
        {showDivider && (
          <div className={`flex items-center gap-4 ${children ? 'mb-6' : ''}`}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <div className="text-center px-4">
              <Heading level={3} className="!text-lg !mb-0 text-gray-900">{dividerHeading}</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">{dividerSubtext}</Text>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        )}
        
        {/* Content area - passed via children */}
        {children}
        
      </div>
    </section>
  )
}
