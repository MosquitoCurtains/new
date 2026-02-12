'use client'

/**
 * InstallationPageTemplate
 *
 * Two modes:
 *  1. Guide page (mainVideo provided) – PowerHeaderTemplate compact hero with
 *     the main video, followed by 3-across video grids that open in modals.
 *  2. Hub page (installationTypes provided) – original card grid layout.
 *
 * Usage (guide):
 * ```tsx
 * <InstallationPageTemplate
 *   title="Tracking Installation Guide"
 *   introText="There is a full installation video..."
 *   pdfDownloadUrl="https://..."
 *   mainVideo={{ title: '...', videoId: '...', duration: '39:59' }}
 *   introVideo={{ title: '...', videoId: '...', duration: '3:46' }}
 *   steps={[...]}
 *   supplementaryVideos={[...]}
 *   helpfulVideos={SHARED_HELPFUL_VIDEOS}
 * />
 * ```
 *
 * Usage (hub):
 * ```tsx
 * <InstallationPageTemplate
 *   title="Installation Instructions"
 *   installationTypes={[...]}
 * />
 * ```
 */

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Play,
  Upload,
  Heart,
  Download,
  Camera,
  Wrench,
  HelpCircle,
  Info,
  LucideIcon,
} from 'lucide-react'
import { ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  YouTubeEmbed,
  Frame,
  VideoLightbox,
} from '../components'
import { FinalCTATemplate } from './FinalCTATemplate'
import { PowerHeaderTemplate } from './PowerHeaderTemplate'
import type { PowerHeaderAction } from './PowerHeaderTemplate'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InstallationType {
  title: string
  description: string
  href: string
  image: string
}

export interface InstallationStep {
  title: string
  description?: string
  videoId?: string
  image?: string
  duration?: string
}

export interface VideoEntry {
  title: string
  videoId: string
  duration?: string
}

export interface HelpfulVideo {
  title: string
  videoId: string
  duration?: string
  notes?: string[]
  image?: string
}

export interface InstallationPageTemplateProps {
  /** Page title */
  title: string
  /** Page subtitle (for hub page) */
  subtitle?: string
  /** Intro paragraph text (for guide pages) */
  introText?: string
  /** PDF download URL */
  pdfDownloadUrl?: string
  /** Installation type options (for hub page) */
  installationTypes?: InstallationType[]
  /** Main "Complete Installation" video */
  mainVideo?: VideoEntry
  /** "Intro & Tools" video */
  introVideo?: VideoEntry
  /** Installation steps (for detail pages) */
  steps?: InstallationStep[]
  /** Main video ID (legacy - use mainVideo instead) */
  mainVideoId?: string
  /** Additional page-specific videos */
  supplementaryVideos?: VideoEntry[]
  /** Section heading for supplementary videos */
  supplementaryHeading?: string
  /** Shared "Other Helpful Videos" section */
  helpfulVideos?: HelpfulVideo[]
  /** Show thank you / upload photos section */
  showThankYou?: boolean
  /** Show care links */
  showCareLinks?: boolean
  /** Override the Curtain Care action link (defaults to /care/mosquito-curtains) */
  careHref?: string
  /** Custom children */
  children?: ReactNode
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Section heading with icon and optional video count */
function SectionHeading({
  icon: Icon,
  title,
  count,
}: {
  icon: LucideIcon
  title: string
  count?: number
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-[#406517]/10 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#406517]" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span className="text-sm text-gray-400 font-medium">
          {count} video{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

/** Thumbnail card for the video grid – click to open modal */
function VideoGridCard({
  videoId,
  title,
  duration,
  stepNumber,
  hasDetails,
  onClick,
}: {
  videoId: string
  title: string
  duration?: string
  stepNumber?: number
  hasDetails?: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="text-left group w-full">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-gray-200">
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#406517]/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#406517] transition-all">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
            {duration}
          </div>
        )}

        {/* Step number badge */}
        {stepNumber !== undefined && (
          <div className="absolute top-2 left-2 w-7 h-7 bg-[#406517] rounded-full flex items-center justify-center shadow">
            <span className="text-white text-xs font-bold">{stepNumber}</span>
          </div>
        )}

        {/* Details indicator (notes / image) */}
        {hasDetails && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow">
            <Info className="w-3.5 h-3.5 text-[#003365]" />
          </div>
        )}
      </div>

      {/* Title */}
      <p className="font-medium text-gray-900 text-sm group-hover:text-[#406517] transition-colors leading-snug">
        {stepNumber !== undefined ? `Step ${stepNumber}: ${title}` : title}
      </p>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main Template
// ---------------------------------------------------------------------------

export function InstallationPageTemplate({
  title,
  subtitle,
  introText,
  pdfDownloadUrl,
  installationTypes = [],
  mainVideo,
  introVideo,
  steps = [],
  mainVideoId,
  supplementaryVideos = [],
  supplementaryHeading,
  helpfulVideos = [],
  showThankYou = true,
  showCareLinks = true,
  careHref = '/care/mosquito-curtains',
  children,
}: InstallationPageTemplateProps) {
  const [activeVideo, setActiveVideo] = useState<{
    videoId: string
    title: string
    notes?: string[]
    image?: string
  } | null>(null)

  // =========================================================================
  // GUIDE PAGE LAYOUT  (mainVideo → PowerHeader + video grids with modals)
  // =========================================================================
  if (mainVideo) {
    // Build actions bar for PowerHeader
    const installActions: PowerHeaderAction[] = [
      ...(pdfDownloadUrl
        ? [
            {
              icon: Download,
              title: 'PDF Guide',
              description: 'Download the complete installation PDF.',
              href: pdfDownloadUrl,
              buttonText: 'Download',
              color: '#406517',
            },
          ]
        : []),
      {
        icon: Upload,
        title: 'Share Photos',
        description: 'Show off your finished project!',
        href: '/client-uploads',
        buttonText: 'Upload',
        color: '#003365',
      },
      {
        icon: Heart,
        title: 'Curtain Care',
        description: 'Keep your curtains looking great.',
        href: careHref,
        buttonText: 'Learn More',
        color: '#B30158',
      },
    ]

    const stepVideoCount = steps.filter((s) => s.videoId).length
    const allVideosCount =
      (introVideo ? 1 : 0) + stepVideoCount + supplementaryVideos.length

    return (
      <Container size="xl">
        <Stack gap="xl">
          {/* ============================================================ */}
          {/* POWER HEADER — main video in compact hero                    */}
          {/* ============================================================ */}
          <PowerHeaderTemplate
            variant="compact"
            title={title}
            subtitle={introText || subtitle}
            videoId={mainVideo.videoId}
            videoTitle={mainVideo.title}
            thumbnailUrl={`https://i.ytimg.com/vi/${mainVideo.videoId}/hqdefault.jpg`}
            actions={installActions}
            showCta={false}
          />

          {/* ============================================================ */}
          {/* INSTALLATION VIDEOS — 3-across grid                          */}
          {/* Intro + numbered steps + supplementary (no step numbers)     */}
          {/* ============================================================ */}
          {allVideosCount > 0 && (
            <section>
              <SectionHeading
                icon={Wrench}
                title="Installation Videos"
                count={allVideosCount}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {introVideo && (
                  <VideoGridCard
                    videoId={introVideo.videoId}
                    title={introVideo.title}
                    duration={introVideo.duration}
                    onClick={() =>
                      setActiveVideo({
                        videoId: introVideo.videoId,
                        title: introVideo.title,
                      })
                    }
                  />
                )}
                {steps.map(
                  (step, idx) =>
                    step.videoId && (
                      <VideoGridCard
                        key={idx}
                        videoId={step.videoId}
                        title={step.title}
                        duration={step.duration}
                        stepNumber={idx + 1}
                        onClick={() =>
                          setActiveVideo({
                            videoId: step.videoId!,
                            title: `Step ${idx + 1}: ${step.title}`,
                          })
                        }
                      />
                    )
                )}
                {supplementaryVideos.map((video, idx) => (
                  <VideoGridCard
                    key={`supp-${idx}`}
                    videoId={video.videoId}
                    title={video.title}
                    duration={video.duration}
                    onClick={() =>
                      setActiveVideo({
                        videoId: video.videoId,
                        title: video.title,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* OTHER HELPFUL VIDEOS — 3-across grid                         */}
          {/* ============================================================ */}
          {helpfulVideos.length > 0 && (
            <section>
              <SectionHeading
                icon={HelpCircle}
                title="Other Helpful Videos"
                count={helpfulVideos.length}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpfulVideos.map((video, idx) => (
                  <VideoGridCard
                    key={idx}
                    videoId={video.videoId}
                    title={video.title}
                    duration={video.duration}
                    hasDetails={!!(video.notes?.length || video.image)}
                    onClick={() =>
                      setActiveVideo({
                        videoId: video.videoId,
                        title: video.title,
                        notes: video.notes,
                        image: video.image,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* CARE LINKS                                                   */}
          {/* ============================================================ */}
          {showCareLinks && (
            <section>
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                <Heading level={3} className="text-center !mb-6">
                  Caring For Your Curtains
                </Heading>
                <Text className="text-gray-600 text-center mb-6">
                  Follow these simple guidelines to keep your curtains in great
                  shape for years to come!
                </Text>
                <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                  <Card
                    variant="outlined"
                    className="!p-4 hover:border-[#406517]/50 transition-colors"
                  >
                    <Link
                      href="/care/mosquito-curtains"
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">
                        Caring for Mosquito Curtains
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </Card>
                  <Card
                    variant="outlined"
                    className="!p-4 hover:border-[#003365]/50 transition-colors"
                  >
                    <Link
                      href="/care/clear-vinyl"
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">
                        Caring for Clear Vinyl
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </Card>
                </Grid>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* UPLOAD PHOTOS CTA                                            */}
          {/* ============================================================ */}
          {showThankYou && (
            <section>
              <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-2 border-[#406517]/20 rounded-3xl p-8 md:p-10 text-center">
                <div className="w-14 h-14 bg-[#406517]/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-[#406517]" />
                </div>
                <Heading level={2} className="!mb-2 !text-xl">
                  We love showing off your DIY handy work!
                </Heading>
                <Text className="text-gray-600 max-w-xl mx-auto mb-4">
                  When your installation is complete, please visit our client
                  uploads page to upload photos and videos of your project!
                </Text>
                <Button variant="primary" asChild>
                  <Link href="/client-uploads">
                    <Upload className="mr-2 w-4 h-4" />
                    Upload Photos of Your Finished Project
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* Custom Children */}
          {children}

          {/* Final CTA */}
          <FinalCTATemplate />

          {/* ============================================================ */}
          {/* VIDEO MODAL                                                  */}
          {/* ============================================================ */}
          <VideoLightbox
            videoId={activeVideo?.videoId || ''}
            title={activeVideo?.title}
            isOpen={!!activeVideo}
            onClose={() => setActiveVideo(null)}
            notes={activeVideo?.notes}
            image={activeVideo?.image}
          />
        </Stack>
      </Container>
    )
  }

  // =========================================================================
  // HUB PAGE LAYOUT  (no mainVideo → original card grid)
  // =========================================================================
  const resolvedMainVideoId = mainVideoId

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* HERO */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </section>

        {/* INSTALLATION TYPES GRID */}
        {installationTypes.length > 0 && (
          <section>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              {installationTypes.map((type, idx) => (
                <Link key={idx} href={type.href} className="group">
                  <Card
                    variant="elevated"
                    hover
                    className="!p-0 overflow-hidden h-full"
                  >
                    <Frame ratio="16/9">
                      <img
                        src={type.image}
                        alt={type.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-[#406517] ml-1" />
                        </div>
                      </div>
                    </Frame>
                    <div className="p-6">
                      <Heading
                        level={3}
                        className="!mb-2 group-hover:text-[#406517] transition-colors"
                      >
                        {type.title}
                      </Heading>
                      <Text className="text-gray-600 !mb-4">
                        {type.description}
                      </Text>
                      <Button
                        variant="ghost"
                        className="group-hover:text-[#406517]"
                      >
                        See Installation{' '}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>
        )}

        {/* Legacy main video */}
        {resolvedMainVideoId && (
          <section>
            <div className="max-w-4xl mx-auto">
              <YouTubeEmbed
                videoId={resolvedMainVideoId}
                title={title}
                variant="card"
              />
            </div>
          </section>
        )}

        {/* Thank You (hub page) */}
        {showThankYou && (
          <section>
            <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#406517]" />
              </div>
              <Heading level={2} className="!mb-4">
                Thank You For Your Business!
              </Heading>
              <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
                If you&apos;ve already ordered, thank you for joining the{' '}
                {ORDERS_SERVED_FORMATTED} clients we&apos;ve served since 2004!
                We are a small family business and your order means the world to
                us.
              </Text>
              <Button variant="primary" asChild>
                <Link href="/client-uploads">
                  <Upload className="mr-2 w-4 h-4" />
                  Upload Photos of Your Finished Project
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Custom Children */}
        {children}

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
