'use client'

import {
  ClipboardCheck,
  Palette,
  GripVertical,
  Wrench,
  CheckCircle,
  Film,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Card,
  Heading,
  YouTubeEmbed,
  HeaderBarSection,
} from '@/lib/design-system'
import { ClearVinylFooter } from '@/components/marketing/ClearVinylFooter'
import { VIDEOS } from '@/lib/constants/videos'

const APRON_COLORS = [
  'Black',
  'Burgundy',
  'Ashen Gray',
  'Cocoa Brown',
  'Royal Blue',
  'Navy',
  'Moss Green',
  'Forest Green',
  'Sandy Tan',
  'No Canvas',
]

export default function ClearVinylPlanningSessionPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Page Header */}
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ClipboardCheck className="w-4 h-4" />
            Planning Session Prep
          </div>
          <Heading level={1} className="!text-3xl md:!text-5xl !mb-4">
            Prepare for Your Clear Vinyl Planning Session
          </Heading>
          <Text className="text-gray-600 max-w-3xl mx-auto text-lg">
            During high season, we are extremely busy and really need our clients prepared.
            Below is the basic information you should know to make our planning session,
            together, as efficient as possible.
          </Text>
        </div>

        {/* Section 1: Know Your Apron Color */}
        <HeaderBarSection icon={Palette} label="Step 1: Know Your Apron Color" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <Heading level={3} className="!mb-2">Know Your Apron Color</Heading>
                <Text className="text-gray-600">
                  Our clear vinyl panels come with a canvas apron (the fabric border around the clear vinyl).
                  Choose from the colors below, or opt for no canvas at all. Watch the video to see the options.
                </Text>
              </div>
            </div>

            <div className="bg-[#406517]/5 rounded-2xl p-6">
              <Heading level={5} className="!mb-3">Available Apron Colors</Heading>
              <div className="flex flex-wrap gap-2">
                {APRON_COLORS.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#406517]" />
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <Card variant="elevated" className="!p-6 max-w-xl mx-auto">
              <YouTubeEmbed
                videoId={VIDEOS.CANVAS_APRONS}
                title="Canvas Aprons Explained"
                variant="card"
                className="mb-4"
              />
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-4 h-4 text-[#406517]" />
                <Heading level={5} className="!mb-0">Canvas Aprons Explained</Heading>
              </div>
              <Text className="text-sm text-gray-500 !mb-0">
                See the different canvas apron color options and how they look on clear vinyl panels.
              </Text>
            </Card>
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
                  For clear vinyl panels, <strong>Velcro is the dominant choice</strong> as it provides
                  a secure, weather-tight seal. Tracking is also available if you prefer panels that slide
                  side to side. Watch the videos below to understand your options.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
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
                  The most popular choice for clear vinyl. Provides a secure, weather-tight seal.
                </Text>
              </Card>
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
                  See how tracking allows panels to slide side to side for easy access.
                </Text>
              </Card>
            </Grid>

            <div className="bg-[#406517]/5 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
              <Text className="text-sm text-gray-700 !mb-0">
                <strong>Quick tip:</strong> Velcro is recommended for clear vinyl because it creates
                a tighter seal against wind and weather.
              </Text>
            </div>
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
                  Our hardware is designed for a clean, professional installation.
                  Learn about marine snaps and L-screws, plus see how our clear vinyl panels are constructed.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.CLEAR_VINYL_CONSTRUCTION}
                  title="Clear Vinyl Panel Construction"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Clear Vinyl Panel Construction</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See how our clear vinyl panels are built with marine-grade materials.
                </Text>
              </Card>
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
            </Grid>
          </Stack>
        </HeaderBarSection>

        <ClearVinylFooter />

      </Stack>
    </Container>
  )
}
