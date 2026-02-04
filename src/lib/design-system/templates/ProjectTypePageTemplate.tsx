'use client'

/**
 * ProjectTypePageTemplate
 * 
 * Template for project type landing pages (porch, patio, garage, pergola, etc.)
 * These are the main SEO landing pages.
 * 
 * Usage:
 * ```tsx
 * <ProjectTypePageTemplate
 *   title="Screened Porch Enclosures"
 *   subtitle="Modular Mosquito Netting Panels custom-made to fit any space."
 *   heroImage="/images/porch-hero.jpg"
 *   benefits={[...]}
 *   galleryImages={[...]}
 *   contentSections={[...]}
 * />
 * ```
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Package, 
  Truck, 
  Shield, 
  Wrench,
  Play,
  Calculator,
  MessageSquare,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  TwoColumn,
  Card,
  FeatureCard,
  Heading,
  Text,
  Button,
  YouTubeEmbed,
  BulletedList,
  ListItem,
  Frame,
} from '../components'
import { 
  FinalCTATemplate,
  GoogleReviews,
} from './index'

export interface Benefit {
  icon: typeof Package
  title: string
  description: string
  color?: string
}

export interface ContentSection {
  title: string
  content: ReactNode
  image?: string
  imageAlt?: string
  videoId?: string
  reversed?: boolean
  bullets?: string[]
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface ProjectTypePageTemplateProps {
  /** Page title (h1) */
  title: string
  /** Subtitle under the title */
  subtitle: string
  /** Hero background image */
  heroImage?: string
  /** 4 benefit cards */
  benefits?: Benefit[]
  /** YouTube video ID for overview */
  overviewVideoId?: string
  /** Gallery images for the page */
  galleryImages?: GalleryImage[]
  /** Content sections (two-column layouts) */
  contentSections?: ContentSection[]
  /** Show the quick connect form */
  showQuickConnect?: boolean
  /** Show Google reviews */
  showReviews?: boolean
  /** Product type for reviews filter */
  productType?: 'mosquito_curtains' | 'clear_vinyl'
  /** Custom children to render */
  children?: ReactNode
}

const DEFAULT_BENEFITS: Benefit[] = [
  { icon: Package, title: 'Custom Kits', description: 'Modular panels custom made to your exact size requirements.', color: '#406517' },
  { icon: Truck, title: 'Delivered Fast', description: 'Delivered at lightning speed in 6-10 business days (US/CA).', color: '#003365' },
  { icon: Shield, title: 'High Quality', description: 'Exceptional Marine-grade quality materials made to last.', color: '#B30158' },
  { icon: Wrench, title: 'DIY Install', description: 'DIY installation in an afternoon with simple tools and fasteners.', color: '#FFA501' },
]

export function ProjectTypePageTemplate({
  title,
  subtitle,
  heroImage,
  benefits = DEFAULT_BENEFITS,
  overviewVideoId,
  galleryImages = [],
  contentSections = [],
  showQuickConnect = true,
  showReviews = true,
  productType = 'mosquito_curtains',
  children,
}: ProjectTypePageTemplateProps) {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <section className="relative">
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 overflow-hidden">
            {heroImage && (
              <div 
                className="absolute inset-0 opacity-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
            )}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  {title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              </div>

              {/* Benefits Grid */}
              <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                {benefits.map((benefit, idx) => (
                  <FeatureCard
                    key={idx}
                    icon={benefit.icon}
                    title={<span style={{ color: benefit.color }}>{benefit.title}</span>}
                    iconColor={benefit.color}
                    variant="elevated"
                    className="text-center !bg-white/80"
                  >
                    <span className="text-sm">{benefit.description}</span>
                  </FeatureCard>
                ))}
              </Grid>
            </div>
          </div>
        </section>

        {/* Video + CTAs Section */}
        {overviewVideoId && (
          <section>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <YouTubeEmbed
                videoId={overviewVideoId}
                title={`${title} Overview`}
                variant="card"
              />
              <Stack gap="md">
                <Card variant="elevated" className="!p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#406517]/10 flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#406517]" />
                    </div>
                    <div className="flex-1">
                      <Heading level={4} className="!mb-1">Options</Heading>
                      <Text size="sm" className="text-gray-600 !mb-0">Mesh types, top attachments & usability.</Text>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link href="/options">
                        Discover <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
                <Card variant="elevated" className="!p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#003365]/10 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-[#003365]" />
                    </div>
                    <div className="flex-1">
                      <Heading level={4} className="!mb-1">Instant Quote</Heading>
                      <Text size="sm" className="text-gray-600 !mb-0">Get an estimate within 5% of actual cost.</Text>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link href="/start-project">
                        Calculate <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
                <Card variant="elevated" className="!p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B30158]/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-[#B30158]" />
                    </div>
                    <div className="flex-1">
                      <Heading level={4} className="!mb-1">Ordering</Heading>
                      <Text size="sm" className="text-gray-600 !mb-0">Our team will help plan your project!</Text>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link href="/contact">
                        Contact <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Stack>
            </Grid>
          </section>
        )}

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section>
            <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <span className="text-white font-semibold text-lg uppercase tracking-wider">
                  Client Installed Projects
                </span>
              </div>
              <div className="p-6">
                <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
                  {galleryImages.slice(0, 10).map((img, idx) => (
                    <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Frame>
                  ))}
                </Grid>
                <div className="flex justify-center pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/gallery">
                      See Full Gallery
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Sections */}
        {contentSections.map((section, idx) => (
          <section key={idx}>
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl p-6 md:p-10">
              <TwoColumn gap="lg" className="items-center">
                <div className={section.reversed ? 'order-2' : ''}>
                  <Stack gap="md">
                    <Heading level={2} className="text-gray-900">
                      {section.title}
                    </Heading>
                    {typeof section.content === 'string' ? (
                      <Text className="text-gray-600">{section.content}</Text>
                    ) : (
                      section.content
                    )}
                    {section.bullets && (
                      <BulletedList spacing="sm">
                        {section.bullets.map((bullet, i) => (
                          <ListItem key={i} variant="checked" iconColor="#406517">
                            {bullet}
                          </ListItem>
                        ))}
                      </BulletedList>
                    )}
                  </Stack>
                </div>
                <div className={section.reversed ? 'order-1' : ''}>
                  {section.videoId ? (
                    <YouTubeEmbed
                      videoId={section.videoId}
                      title={section.title}
                      variant="card"
                    />
                  ) : section.image ? (
                    <Frame ratio="16/10" className="rounded-2xl overflow-hidden">
                      <img
                        src={section.image}
                        alt={section.imageAlt || section.title}
                        className="w-full h-full object-cover"
                      />
                    </Frame>
                  ) : null}
                </div>
              </TwoColumn>
            </div>
          </section>
        ))}

        {/* Custom Children */}
        {children}

        {/* Google Reviews */}
        {showReviews && (
          <section>
            <div className="bg-gradient-to-br from-[#003365]/5 to-[#406517]/5 border-2 border-[#003365]/20 rounded-3xl p-6 md:p-10">
              <div className="text-center mb-6">
                <Heading level={2} className="text-gray-900 !mb-2">
                  What Our Customers Say
                </Heading>
              </div>
              <GoogleReviews 
                featurableId={process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID}
                carouselSpeed={8000}
                minRating={5}
              />
            </div>
          </section>
        )}

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
