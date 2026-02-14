'use client'

import { useState } from 'react'
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
  Play,
  ChevronDown,
  SlidersHorizontal,
  Eye,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Button,
  Card,
  Heading,
  Frame,
  YouTubeEmbed,
  HeaderBarSection,
  FinalCTATemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

// ============================================================================
// ACCORDION COMPONENT (for dive-into sections)
// ============================================================================

function AccordionItem({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="p-5 bg-white">{children}</div>}
    </div>
  )
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function FormEntryPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ============================================================ */}
        {/* THANK YOU BANNER */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* PREP SECTION HEADER */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* OVERVIEW VIDEO (cJY1209F5sE with planning thumbnail) */}
        {/* ============================================================ */}
        <Card variant="elevated" className="!p-6 md:!p-8">
          <div className="max-w-3xl mx-auto">
            <YouTubeEmbed
              videoId={VIDEOS.SHORT_OVERVIEW}
              title="Planning Overview"
              variant="card"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg"
            />
          </div>
        </Card>

        {/* ============================================================ */}
        {/* SECTION 1: Know Your Mesh Type & Color */}
        {/* ============================================================ */}
        <HeaderBarSection icon={Layers} label="Step 1: Know Your Mesh Type & Color" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <Heading level={3} className="!mb-2">Know Your Mesh Type & Color</Heading>
                <Text className="text-gray-600 !mb-3">
                  Your project will be made up of a series of mesh panels made from a mesh type
                  and color of your choosing. Watch the video to see how panels are used to create
                  your enclosure.
                </Text>
                <Text className="text-gray-600">
                  There are three mesh types and three colors to choose from.
                  <strong> Over 90 percent of orders choose Black Heavy Mosquito Mesh</strong>.
                  The first exception is our Noseeum mesh where &quot;No-seeum&quot; biting flies
                  are a problem. In this case, customers choose the No-seeum Mesh. The second
                  exception is our Shade Mesh for those trying to create shade in their application.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.LAYOUT_PLANNING_OVERVIEW}
                  title="Panels Explained"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Panels Explained (2:27)</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See how panels are used to create your enclosure and how the modular system works.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.RAW_NETTING_FABRIC}
                  title="Mesh Types"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Mesh Types (1:48)</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Learn about the 3 mesh types and 3 colors available for your mosquito curtains.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.MOSQUITO_NETTING_FABRIC}
                  title="See Through Each Mesh"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">See Through Each Mesh (4:00)</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  See what it looks like looking through each mesh type from the inside.
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

        {/* ============================================================ */}
        {/* SECTION 2: Know Your Top Attachment Preference */}
        {/* ============================================================ */}
        <HeaderBarSection icon={GripVertical} label="Step 2: Know Your Top Attachment Preference" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <Heading level={3} className="!mb-2">Know Your Top Attachment Preference</Heading>
                <Text className="text-gray-600">
                  There are 2 main top attachment types. Tracking and Velcro.
                  A tracking installation allows you to open your curtains sliding them side to side.
                  Velcro is fixed at the top and doesn&apos;t slide. Both are simple to install.
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Track-480-Optimized.gif"
                    alt="Tracking system - curtains slide side to side on overhead track"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Tracking Installation</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Slides side to side on an overhead track for easy open/close access.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif"
                    alt="Velcro attachment - curtains fixed at the top with Velcro"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Velcro Installation</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Fixed at the top with Velcro for a clean, secure look.
                </Text>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* DIVE INTO TRACKING DETAILS (accordion) */}
        {/* ============================================================ */}
        <HeaderBarSection icon={SlidersHorizontal} label="Dive Into Tracking Details" variant="green">
          <Stack gap="sm">
            <AccordionItem title="Important Tracking Video">
              <YouTubeEmbed
                videoId={VIDEOS.TRACKING_OVERVIEW}
                title="Important Tracking Video"
                variant="card"
              />
            </AccordionItem>
            <AccordionItem title="Mounting the Track">
              <YouTubeEmbed
                videoId={VIDEOS.TRACKING_INSTALL}
                title="Mounting the Track"
                variant="card"
              />
            </AccordionItem>
            <AccordionItem title="Mounting Curtains On Track">
              <YouTubeEmbed
                videoId={VIDEOS.MOUNTING_CURTAINS_ON_TRACK}
                title="Mounting Curtains On Track"
                variant="card"
              />
            </AccordionItem>
          </Stack>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* DIVE INTO VELCRO DETAILS (accordion) */}
        {/* ============================================================ */}
        <HeaderBarSection icon={GripVertical} label="Dive Into Velcro Details" variant="green">
          <Stack gap="sm">
            <AccordionItem title="Mounting the Velcro">
              <YouTubeEmbed
                videoId={VIDEOS.TRACKING_OPTIONS}
                title="Mounting the Velcro"
                variant="card"
              />
            </AccordionItem>
            <AccordionItem title="Mounting Curtains on Velcro">
              <YouTubeEmbed
                videoId={VIDEOS.MOUNTING_CURTAINS_ON_VELCRO}
                title="Mounting Curtains on Velcro"
                variant="card"
              />
            </AccordionItem>
          </Stack>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* SECTION 3: Understand Our Simple Attachment Hardware */}
        {/* ============================================================ */}
        <HeaderBarSection icon={Wrench} label="Step 3: Understand Our Simple Attachment Hardware" variant="green">
          <Stack gap="md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#406517] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <Heading level={3} className="!mb-2">Understand Our Simple Attachment Hardware</Heading>
                <Text className="text-gray-600">
                  One of our biggest focal points is the ease of installation and usability
                  of your curtain. For simple installation, we use a series of versatile
                  components like marine snaps to allow you to attach to different surfaces.
                  Our magnetic doorways allow you easy entry and exit between panels and at
                  the edge of panels. Each of these videos is under 90 seconds. Watch them
                  and you will understand most of what you need to know about how your
                  curtains will operate.
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

        {/* ============================================================ */}
        {/* SEE A FULL INSTALLATION */}
        {/* ============================================================ */}
        <HeaderBarSection icon={Play} label="See A Full Installation" variant="green">
          <Stack gap="md">
            <Text className="text-gray-600">
              Watch the appropriate video to see a full installation. This will give you
              a total understanding of how our product works.
            </Text>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.FULL_TRACKING_INSTALL}
                  title="Complete Tracking Installation"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Complete Tracking Installation (39:28)</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Full step-by-step tracking system installation from start to finish.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6">
                <YouTubeEmbed
                  videoId={VIDEOS.FULL_VELCRO_INSTALL}
                  title="Complete Velcro Installation"
                  variant="card"
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-4 h-4 text-[#406517]" />
                  <Heading level={5} className="!mb-0">Complete Velcro Installation (28:38)</Heading>
                </div>
                <Text className="text-sm text-gray-500 !mb-0">
                  Full step-by-step Velcro system installation from start to finish.
                </Text>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
