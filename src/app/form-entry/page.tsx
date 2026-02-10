'use client'

import Link from 'next/link'
import {
  CheckCircle2,
  ClipboardCheck,
  Layers,
  GripVertical,
  Wrench,
  ArrowRight,
  CheckCircle,
  Film,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Button,
  Card,
  Heading,
  YouTubeEmbed,
  HeaderBarSection,
  FinalCTATemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function FormEntryPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Thank You Banner */}
        <div className="bg-[#406517] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <Heading level={1} className="!text-3xl md:!text-5xl !mb-3 !text-white">
              We&apos;ve received your contact form!
            </Heading>
            <Text className="text-white/80 text-lg max-w-2xl mx-auto !mb-0">
              A member of our planning team will be in touch soon.
            </Text>
          </div>
        </div>

        {/* Prep Section Header */}
        <div className="text-center py-4 md:py-8">
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ClipboardCheck className="w-4 h-4" />
            Planning Session Prep
          </div>
          <Heading level={2} className="!text-2xl md:!text-4xl !mb-4">
            Next Step: Prepare for Your Planning Session
          </Heading>
          <Text className="text-gray-600 max-w-3xl mx-auto text-lg">
            During high season, we are extremely busy and really need our clients prepared.
            Below is the basic information you should know to make our planning session,
            together, as efficient as possible.
          </Text>
        </div>

        {/* Section 1: Know Your Mesh Type & Color */}
        <HeaderBarSection icon={Layers} label="Step 1: Know Your Mesh Type & Color" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <Heading level={3} className="!mb-2">Know Your Mesh Type & Color</Heading>
                <Text className="text-gray-600">
                  There are 3 mesh types and 3 colors. Over 90% of our customers choose
                  <strong> Black Heavy Mosquito Mesh</strong>. Watch the videos below to understand
                  your options.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.CUSTOM_FITTED}
                  title="Mesh Types Explained"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Mesh Types Explained</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Learn about the 3 mesh types and 3 colors available for your mosquito curtains.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW}
                  title="Panels Explained"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Panels Explained</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See how our modular panel system works and how panels are custom-made to fit.
                </Text>
              </Card>
            </Grid>

            <div className="bg-[#406517]/5 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
              <Text className="text-sm text-gray-700 !mb-0">
                <strong>Quick tip:</strong> If you are unsure, Black Heavy Mosquito Mesh is our most popular choice
                and works great for most applications.
              </Text>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Section 2: Know Your Top Attachment Preference */}
        <HeaderBarSection icon={GripVertical} label="Step 2: Know Your Top Attachment Preference" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <Heading level={3} className="!mb-2">Know Your Top Attachment Preference</Heading>
                <Text className="text-gray-600">
                  There are two ways to attach your panels at the top:
                  <strong> Tracking</strong> (slides side to side) and <strong>Velcro</strong> (fixed in place).
                  Watch the videos below to decide which is right for you.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.TRACKING_OVERVIEW}
                  title="Tracking System Overview"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Tracking System Overview</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See how our overhead tracking allows panels to slide side to side for easy access.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.VELCRO_INSTALLATION}
                  title="Velcro Installation"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Velcro Installation</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Learn how Velcro top attachment works for a fixed, clean look.
                </Text>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Section 3: Understand Our Simple Attachment Hardware */}
        <HeaderBarSection icon={Wrench} label="Step 3: Understand Our Simple Attachment Hardware" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <Heading level={3} className="!mb-2">Understand Our Simple Attachment Hardware</Heading>
                <Text className="text-gray-600">
                  Our hardware is simple, effective, and designed for easy installation.
                  Learn about marine snaps, magnetic doorways, and stucco strips in under 90 seconds each.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.MARINE_SNAPS_90_SEC}
                  title="Marine Snaps in 90 Seconds"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Marine Snaps</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Learn how marine snaps work in under 90 seconds.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.MAGNETIC_DOORWAYS_90_SEC}
                  title="Magnetic Doorways in 90 Seconds"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Magnetic Doorways</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See how magnetic doorways create easy walk-through access.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.STUCCO_STRIPS_90_SEC}
                  title="Stucco Strips in 90 Seconds"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Stucco Strips</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Discover how stucco strips attach to textured surfaces.
                </Text>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Full Installation Videos Link */}
        <Card variant="elevated" className="!p-8 text-center">
          <Heading level={3} className="!mb-3">Want to See Full Installation Videos?</Heading>
          <Text className="text-gray-600 mb-6">
            Watch our complete step-by-step installation guides for tracking and Velcro systems.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" asChild>
              <Link href="/install/tracking">
                Tracking Installation Guide
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/install/velcro">
                Velcro Installation Guide
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
