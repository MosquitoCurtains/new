'use client'

/**
 * Quote Guidance Component
 * 
 * Educational content displayed below the Instant Quote calculator.
 * Contains 4 guidance modals, video embeds, reference examples, and CTAs.
 * Content is product-specific (Mosquito Curtains vs Clear Vinyl).
 * 
 * Mirrors the original WordPress/Elementor page content from:
 *   - /mosquito-curtains-instant-quote/
 *   - /clear-vinyl-instant-quote/
 */

import { useState, useCallback } from 'react'
import { 
  X, 
  HelpCircle, 
  Play, 
  Phone as PhoneIcon, 

  Ruler,
  SlidersHorizontal,
  LayoutGrid,
  Move,
  ImageIcon,
} from 'lucide-react'
import {
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Stack,
  Frame,
  HeaderBarSection,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'mosquito_curtains' | 'clear_vinyl'
type ModalId = 'height' | 'attachment' | 'sides' | 'width' | 'video_overview' | 'video_made' | null

interface QuoteGuidanceProps {
  productType: ProductType
}

// =============================================================================
// LIGHT-THEMED MODAL
// =============================================================================

function GuidanceModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'md' | 'lg' | 'xl'
}) {
  if (!isOpen) return null

  const sizeClass = {
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size]

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl',
          sizeClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between p-5 border-b border-gray-200 rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Content */}
        <div className="p-5 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// VIDEO MODAL
// =============================================================================

function VideoModal({
  isOpen,
  onClose,
  title,
  embedUrl,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  embedUrl: string
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// IMAGE LIGHTBOX
// =============================================================================

function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
}: {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-xl shadow-2xl"
        />
      </div>
    </div>
  )
}

// =============================================================================
// CONTENT DATA
// =============================================================================

const STATIC_BASE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const CONTENT = {
  mosquito_curtains: {
    heroTitle: 'Mosquito Curtains Instant Quote Tool',
    heroSubtitle: 'Modular Outdoor Curtain Systems to Create a Modern & Sleek Outdoor Space',
    videoOverview: `https://www.youtube.com/embed/FqNe9pDsZ8M`,
    videoMade: `https://player.vimeo.com/video/1062636090`,
    attachment: {
      title: 'Top Attachment - Tracking is most popular.',
      description: null,
      items: [
        {
          label: 'Tracking \u2013 slides side-to-side',
          image: `${STATIC_BASE}/2021/01/Track-480-Optimized-1.gif`,
        },
        {
          label: 'Velcro\u00AE (fixed) does NOT slide',
          image: `${STATIC_BASE}/2019/08/Velcro-480-Optimized.gif`,
        },
      ],
    },
    sides: {
      title: 'Calculator assumes 1 magnetic door for each side + all necessary hardware',
      subtitle: null,
      image: `${STATIC_BASE}/2025/03/Number-of-Sides-2-1024x205.png`,
      gif: null,
    },
    width: {
      image: `${STATIC_BASE}/2025/03/Total-Width-Ready-1024x205.png`,
    },
    examples: [
      { image: `${STATIC_BASE}/2025/03/1-Sided-Example-1024x1024.jpg`, label: null },
      { image: `${STATIC_BASE}/2025/09/2-Sided-Example-1024x1024.jpg`, label: null },
      { image: `${STATIC_BASE}/2025/03/3-Sided-Example-1024x1024.jpg`, label: null },
    ],
    showVideoButtons: false,
    showNeedHelp: false,
  },
  clear_vinyl: {
    heroTitle: 'Clear Vinyl Instant Quote Tool',
    heroSubtitle: 'Modular Clear Vinyl Panels Custom-Made to Fit Any Space',
    videoOverview: `https://www.youtube.com/embed/ca6GufadXoE`,
    videoMade: `https://www.youtube.com/embed/KTrkT6DHm9k`,
    attachment: {
      title: 'Top Attachment - Velcro is most popular.',
      description: 'Most Clear Vinyl Applications use Fixed / Velcro Top Attachment. Choosing "tracking" estimates the cost of tracking hardware you will need.',
      items: [
        {
          label: 'Velcro\u00AE (fixed) does NOT slide',
          image: `${STATIC_BASE}/2019/09/CV-TRACK-4-OPTIMIZED.gif`,
        },
        {
          label: 'Tracking \u2013 slides side-to-side',
          image: `${STATIC_BASE}/2019/09/CV-TRACK-12.5-OPTIMIZED.gif`,
        },
      ],
    },
    sides: {
      title: 'Calculator assumes 2 panels per side with zippered entrance + all necessary hardware',
      subtitle: 'Example of 2 panels with zippered entrance:',
      image: `${STATIC_BASE}/2025/03/Number-of-Sides-2-1024x205.png`,
      gif: `${STATIC_BASE}/2019/09/Zipper-12.5-Optimized.gif`,
    },
    width: {
      image: `${STATIC_BASE}/2025/08/CV-Quote-Project-Width-Image-1024x205.jpg`,
    },
    examples: [
      { image: `${STATIC_BASE}/2022/01/Clear-Vinyl-1-1024x1024.jpg`, label: null },
      { image: `${STATIC_BASE}/2022/01/CV-MC-1-1024x1024.jpg`, label: null },
      { image: `${STATIC_BASE}/2022/01/Gazebo-CV-3-1024x1024.jpg`, label: null },
    ],
    showVideoButtons: false,
    showNeedHelp: true,
  },
}

// Shared height buckets (same for both products)
const HEIGHT_BUCKETS = [
  {
    label: 'Shorter than 78"',
    description: 'No Canvas Required',
    image: `${STATIC_BASE}/2019/08/12-Clear-Plastic-With-No-Canvas-1200-1024x768.jpg`,
  },
  {
    label: '78" - 108"',
    description: 'Canvas On Bottom Only',
    image: `${STATIC_BASE}/2020/11/7-Navy-Clear-Vinyl-Enclosure-1024x768.jpg`,
  },
  {
    label: 'Taller than 108"',
    description: 'Canvas on Top & Bottom',
    image: `${STATIC_BASE}/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200-1024x768.jpg`,
  },
]


// =============================================================================
// GUIDANCE TRIGGER BUTTON
// =============================================================================

function GuidanceButton({
  label,
  onClick,
  color = '#406517',
}: {
  label: string
  onClick: () => void
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
      style={{
        backgroundColor: `${color}10`,
        color: color,
        border: `1.5px solid ${color}30`,
      }}
    >
      <HelpCircle className="w-4 h-4" />
      {label}
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function QuoteGuidance({ productType }: QuoteGuidanceProps) {
  const [activeModal, setActiveModal] = useState<ModalId>(null)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  const content = CONTENT[productType]
  const isMosquito = productType === 'mosquito_curtains'
  const brandColor = isMosquito ? '#406517' : '#003365'

  const closeModal = useCallback(() => setActiveModal(null), [])
  const closeLightbox = useCallback(() => setLightboxImage(null), [])

  return (
    <>
      <Stack gap="xl">
        {/* ============================================================
            VIDEO BUTTONS (Clear Vinyl only)
            ============================================================ */}
        {content.showVideoButtons && (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveModal('video_overview')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: brandColor }}
            >
              <Play className="w-4 h-4" />
              Product Overview Video
            </button>
            <button
              onClick={() => setActiveModal('video_made')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ color: brandColor, borderColor: brandColor }}
            >
              <Play className="w-4 h-4" />
              Watch How They&apos;re Made
            </button>
          </div>
        )}

        {/* ============================================================
            4 GUIDANCE SECTIONS
            ============================================================ */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
            <Heading level={3} className="!text-base !mb-0 text-gray-700 uppercase tracking-wider">
              Understanding Your Quote
            </Heading>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
          </div>

          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            {/* 1. Height Guidance */}
            <Card variant="outlined" className="!p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveModal('height')}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}10` }}>
                  <Ruler className="w-5 h-5" style={{ color: brandColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Heading level={4} className="!mb-0.5 !text-sm">Project Height</Heading>
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#406517] transition-colors" />
                  </div>
                  <Text size="xs" className="text-gray-500 !mb-0">We break pricing into 3 buckets based on height</Text>
                </div>
              </div>
            </Card>

            {/* 2. Top Attachment Guidance */}
            <Card variant="outlined" className="!p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveModal('attachment')}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}10` }}>
                  <SlidersHorizontal className="w-5 h-5" style={{ color: brandColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Heading level={4} className="!mb-0.5 !text-sm">Top Attachment</Heading>
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#406517] transition-colors" />
                  </div>
                  <Text size="xs" className="text-gray-500 !mb-0">
                    {isMosquito ? 'Tracking is most popular' : 'Velcro is most popular'}
                  </Text>
                </div>
              </div>
            </Card>

            {/* 3. Number of Sides Guidance */}
            <Card variant="outlined" className="!p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveModal('sides')}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}10` }}>
                  <LayoutGrid className="w-5 h-5" style={{ color: brandColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Heading level={4} className="!mb-0.5 !text-sm">Number of Sides</Heading>
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#406517] transition-colors" />
                  </div>
                  <Text size="xs" className="text-gray-500 !mb-0">
                    {isMosquito
                      ? '1 magnetic door per side + all hardware'
                      : '2 panels per side with zippered entrance'}
                  </Text>
                </div>
              </div>
            </Card>

            {/* 4. Total Width Guidance */}
            <Card variant="outlined" className="!p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveModal('width')}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}10` }}>
                  <Move className="w-5 h-5" style={{ color: brandColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Heading level={4} className="!mb-0.5 !text-sm">Total Project Width</Heading>
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#406517] transition-colors" />
                  </div>
                  <Text size="xs" className="text-gray-500 !mb-0">Add up width of all open sides</Text>
                </div>
              </div>
            </Card>
          </Grid>
        </div>

        {/* ============================================================
            EXAMPLES SECTION
            ============================================================ */}
        <HeaderBarSection
          icon={ImageIcon}
          label="Examples for Reference"
          variant={isMosquito ? 'green' : 'blue'}
          headerSubtitle="Click to enlarge"
        >
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            {content.examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxImage({ src: example.image, alt: example.label || `Example ${idx + 1}` })}
                className="group relative rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
              >
                <Frame ratio="1/1">
                  <img
                    src={example.image}
                    alt={example.label || `Example ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </Frame>
                {example.label && (
                  <div className="p-3 bg-white">
                    <Text size="sm" className="font-semibold text-gray-900 !mb-0">{example.label}</Text>
                  </div>
                )}
              </button>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* ============================================================
            NEED HELP SECTION (Clear Vinyl only)
            ============================================================ */}
        {content.showNeedHelp && (
          <Card variant="elevated" className="!p-6 text-center !bg-gradient-to-br !from-[#003365]/5 !via-white !to-[#003365]/5 !border-[#003365]/20">
            <Heading level={3} className="!text-lg !mb-2">Need help before submitting photos?</Heading>
            <Text className="text-gray-600 !mb-4">
              We are here to help. Give us a call and one of our planners will gladly assist you.
            </Text>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:7708847705" className="inline-flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                Call Us: (770) 884-7705
              </a>
            </Button>
          </Card>
        )}

      </Stack>

      {/* ================================================================
          MODALS
          ================================================================ */}

      {/* Video: Product Overview */}
      <VideoModal
        isOpen={activeModal === 'video_overview'}
        onClose={closeModal}
        title="Product Overview"
        embedUrl={content.videoOverview}
      />

      {/* Video: How They're Made */}
      <VideoModal
        isOpen={activeModal === 'video_made'}
        onClose={closeModal}
        title="How They're Made"
        embedUrl={content.videoMade}
      />

      {/* Modal 1: Project Height Guidance */}
      <GuidanceModal
        isOpen={activeModal === 'height'}
        onClose={closeModal}
        title="Project Height Guidance"
        size="xl"
      >
        <Stack gap="md">
          <Heading level={3} className="!text-lg text-center" style={{ color: brandColor }}>
            We break pricing into 3 buckets based on the height.
          </Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            {HEIGHT_BUCKETS.map((bucket) => (
              <div key={bucket.label} className="text-center">
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                  <img
                    src={bucket.image}
                    alt={bucket.label}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <Heading level={4} className="!mb-1">{bucket.label}</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">{bucket.description}</Text>
              </div>
            ))}
          </Grid>
        </Stack>
      </GuidanceModal>

      {/* Modal 2: Top Attachment Guidance */}
      <GuidanceModal
        isOpen={activeModal === 'attachment'}
        onClose={closeModal}
        title="Top Attachment Guidance"
      >
        <Stack gap="md">
          <Heading level={3} className="!text-lg text-center" style={{ color: brandColor }}>
            {content.attachment.title}
          </Heading>
          {content.attachment.description && (
            <Text className="text-gray-600 text-center">{content.attachment.description}</Text>
          )}
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            {content.attachment.items.map((item) => (
              <div key={item.label} className="text-center">
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-3 bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <Text className="font-medium text-gray-900 !mb-0">{item.label}</Text>
              </div>
            ))}
          </Grid>
        </Stack>
      </GuidanceModal>

      {/* Modal 3: Number of Sides Guidance */}
      <GuidanceModal
        isOpen={activeModal === 'sides'}
        onClose={closeModal}
        title="Number of Sides Guidance"
      >
        <Stack gap="md">
          <Heading level={3} className="!text-lg text-center" style={{ color: brandColor }}>
            {content.sides.title}
          </Heading>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img
              src={content.sides.image}
              alt="Number of sides diagram"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          {content.sides.subtitle && (
            <>
              <Heading level={4} className="!text-base text-center !mb-0">{content.sides.subtitle}</Heading>
              {content.sides.gif && (
                <div className="rounded-xl overflow-hidden border border-gray-200 max-w-md mx-auto">
                  <img
                    src={content.sides.gif}
                    alt="Panel entrance example"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            </>
          )}
        </Stack>
      </GuidanceModal>

      {/* Modal 4: Total Project Width Guidance */}
      <GuidanceModal
        isOpen={activeModal === 'width'}
        onClose={closeModal}
        title="Total Project Width Guidance"
      >
        <Stack gap="md">
          <Heading level={3} className="!text-lg text-center" style={{ color: brandColor }}>
            Total Project Width - Add up width of all open sides.
          </Heading>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img
              src={content.width.image}
              alt="Total width measurement diagram"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </Stack>
      </GuidanceModal>

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={true}
          onClose={closeLightbox}
          src={lightboxImage.src}
          alt={lightboxImage.alt}
        />
      )}
    </>
  )
}

export default QuoteGuidance
