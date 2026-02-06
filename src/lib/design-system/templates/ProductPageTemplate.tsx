'use client'

/**
 * ProductPageTemplate
 * 
 * Template for main product landing pages (Mosquito Curtains, Clear Vinyl)
 * These are primary SEO landing pages with project type grids.
 * 
 * Usage:
 * ```tsx
 * <ProductPageTemplate
 *   title="Mosquito Curtains"
 *   subtitle="Screen Patio Enclosures"
 *   projectTypes={[...]}
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
  LucideIcon,
} from 'lucide-react'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'
import {
  Container,
  Stack,
  Grid,
  Card,
  FeatureCard,
  Heading,
  Text,
  Button,
  YouTubeEmbed,
  Frame,
  Badge,
  TwoColumn,
  BulletedList,
  ListItem,
} from '../components'
import { 
  FinalCTATemplate,
  GoogleReviews,
  WhyChooseUsTemplate,
} from './index'

export interface ProjectType {
  title: string
  href: string
  image: string
  description?: string
}

export interface ProductFeature {
  icon: LucideIcon
  title: string
  description: string
  color?: string
}

export interface ProductPageTemplateProps {
  /** Page title (h1) */
  title: string
  /** Subtitle */
  subtitle: string
  /** Hero description */
  description?: string
  /** Overview video ID */
  overviewVideoId?: string
  /** Project types grid */
  projectTypes?: ProjectType[]
  /** Product features */
  features?: ProductFeature[]
  /** Product benefits bullets */
  benefits?: string[]
  /** Show sale banner */
  showSaleBanner?: boolean
  /** Sale text */
  saleText?: string
  /** Custom children */
  children?: ReactNode
}

const DEFAULT_FEATURES: ProductFeature[] = [
  { icon: Package, title: 'Custom Made', description: 'Made to your exact measurements', color: '#406517' },
  { icon: Truck, title: 'Fast Delivery', description: '6-10 business days', color: '#003365' },
  { icon: Shield, title: 'Marine Grade', description: 'Built to last outdoors', color: '#B30158' },
  { icon: Wrench, title: 'Easy DIY', description: 'Install in an afternoon', color: '#FFA501' },
]

export function ProductPageTemplate({
  title,
  subtitle,
  description,
  overviewVideoId,
  projectTypes = [],
  features = DEFAULT_FEATURES,
  benefits = [],
  showSaleBanner = true,
  saleText = '10% Off Sale - Use Code: MIDWINTER26',
  children,
}: ProductPageTemplateProps) {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Sale Banner */}
        {showSaleBanner && (
          <div className="bg-gradient-to-r from-[#B30158] to-[#8B0142] rounded-2xl px-6 py-4 text-center">
            <p className="text-white font-semibold text-lg">
              {saleText}
            </p>
          </div>
        )}

        {/* Hero Section */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 mb-4">
                {ORDERS_SERVED_STRINGS.trustedBy}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4">
                {subtitle}
              </p>
              {description && (
                <p className="text-gray-500 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>

            {/* Features Row */}
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              ))}
            </Grid>

            {/* CTA */}
            <div className="flex justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Project Types Grid */}
        {projectTypes.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <Heading level={2} className="text-gray-900 !mb-2">
                Choose Your Project Type
              </Heading>
              <Text className="text-gray-600">
                Select the application that best matches your space
              </Text>
            </div>
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {projectTypes.map((project, idx) => (
                <Link key={idx} href={project.href} className="group">
                  <Card variant="elevated" hover className="!p-0 overflow-hidden h-full">
                    <Frame ratio="4/3">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Frame>
                    <div className="p-4">
                      <Heading level={4} className="!mb-1 group-hover:text-[#406517] transition-colors">
                        {project.title}
                      </Heading>
                      {project.description && (
                        <Text size="sm" className="text-gray-500 !mb-0">
                          {project.description}
                        </Text>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>
        )}

        {/* Video + Benefits Section */}
        {overviewVideoId && (
          <section>
            <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <span className="text-white font-semibold text-lg uppercase tracking-wider">
                  Product Overview
                </span>
              </div>
              <div className="p-6 md:p-10">
                <TwoColumn gap="lg" className="items-center">
                  <YouTubeEmbed
                    videoId={overviewVideoId}
                    title={`${title} Overview`}
                    variant="card"
                  />
                  <Stack gap="md">
                    <Heading level={3}>Why Choose {title}?</Heading>
                    {benefits.length > 0 && (
                      <BulletedList spacing="sm">
                        {benefits.map((benefit, idx) => (
                          <ListItem key={idx} variant="checked" iconColor="#406517">
                            {benefit}
                          </ListItem>
                        ))}
                      </BulletedList>
                    )}
                    <div className="pt-2">
                      <Button variant="primary" asChild>
                        <Link href="/options">
                          Explore Options
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </Stack>
                </TwoColumn>
              </div>
            </div>
          </section>
        )}

        {/* Custom Children */}
        {children}

        {/* Why Choose Us */}
        <WhyChooseUsTemplate showReviews={true} />

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
