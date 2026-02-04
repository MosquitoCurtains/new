'use client'

/**
 * InstallationPageTemplate
 * 
 * Template for installation guide pages.
 * Video-heavy with step-by-step instructions.
 * 
 * Usage:
 * ```tsx
 * <InstallationPageTemplate
 *   title="Installation Instructions"
 *   installationTypes={[...]}
 * />
 * ```
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Upload, Heart } from 'lucide-react'
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
} from '../components'
import { FinalCTATemplate } from './index'

export interface InstallationType {
  title: string
  description: string
  href: string
  image: string
}

export interface InstallationStep {
  title: string
  description: string
  videoId?: string
  image?: string
}

export interface InstallationPageTemplateProps {
  /** Page title */
  title: string
  /** Page subtitle */
  subtitle?: string
  /** Installation type options (for hub page) */
  installationTypes?: InstallationType[]
  /** Installation steps (for detail pages) */
  steps?: InstallationStep[]
  /** Main video ID */
  mainVideoId?: string
  /** Show thank you message */
  showThankYou?: boolean
  /** Show care links */
  showCareLinks?: boolean
  /** Custom children */
  children?: ReactNode
}

export function InstallationPageTemplate({
  title,
  subtitle,
  installationTypes = [],
  steps = [],
  mainVideoId,
  showThankYou = true,
  showCareLinks = true,
  children,
}: InstallationPageTemplateProps) {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
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

        {/* Installation Types Grid (for hub page) */}
        {installationTypes.length > 0 && (
          <section>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              {installationTypes.map((type, idx) => (
                <Link key={idx} href={type.href} className="group">
                  <Card variant="elevated" hover className="!p-0 overflow-hidden h-full">
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
                      <Heading level={3} className="!mb-2 group-hover:text-[#406517] transition-colors">
                        {type.title}
                      </Heading>
                      <Text className="text-gray-600 !mb-4">
                        {type.description}
                      </Text>
                      <Button variant="ghost" className="group-hover:text-[#406517]">
                        See Installation <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>
        )}

        {/* Main Video */}
        {mainVideoId && (
          <section>
            <div className="max-w-4xl mx-auto">
              <YouTubeEmbed
                videoId={mainVideoId}
                title={title}
                variant="card"
              />
            </div>
          </section>
        )}

        {/* Installation Steps */}
        {steps.length > 0 && (
          <section>
            <Stack gap="lg">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden"
                >
                  <div className="bg-[#406517] px-6 py-3">
                    <span className="text-white font-semibold">
                      Step {idx + 1}: {step.title}
                    </span>
                  </div>
                  <div className="p-6 md:p-8">
                    <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                      <div>
                        <Text className="text-gray-600">
                          {step.description}
                        </Text>
                      </div>
                      {step.videoId ? (
                        <YouTubeEmbed
                          videoId={step.videoId}
                          title={step.title}
                          variant="card"
                        />
                      ) : step.image ? (
                        <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover"
                          />
                        </Frame>
                      ) : null}
                    </Grid>
                  </div>
                </div>
              ))}
            </Stack>
          </section>
        )}

        {/* Thank You Section */}
        {showThankYou && (
          <section>
            <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#406517]" />
              </div>
              <Heading level={2} className="!mb-4">Thank You For Your Business!</Heading>
              <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
                If you've already ordered, thank you for joining the 92,000+ clients we've served since 2004! 
                We are a small family business and your order means the world to us.
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

        {/* Care Links */}
        {showCareLinks && (
          <section>
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <Heading level={3} className="text-center !mb-6">Caring For Your Curtains</Heading>
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                <Card variant="outlined" className="!p-4 hover:border-[#406517]/50 transition-colors">
                  <Link href="/care/mosquito-curtains" className="flex items-center justify-between">
                    <span className="font-medium">Caring for Mosquito Curtains</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </Card>
                <Card variant="outlined" className="!p-4 hover:border-[#003365]/50 transition-colors">
                  <Link href="/care/clear-vinyl" className="flex items-center justify-between">
                    <span className="font-medium">Caring for Clear Vinyl</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </Card>
              </Grid>
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
