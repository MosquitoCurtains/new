'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Settings, 
  Palette, 
  SlidersHorizontal,
  MessageSquare,
  Calculator,
  Hammer,
  Camera,
  Images,
  Star,
  DoorOpen,
  Wrench,
} from 'lucide-react'
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
  HeaderBarSection,
  PowerHeaderTemplate,
  BulletedList,
  ListItem,
  Badge,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import type { PowerHeaderAction } from '@/lib/design-system/templates/PowerHeaderTemplate'

// =============================================================================
// HERO ACTIONS - Matching start-project flow
// =============================================================================

const heroActions: PowerHeaderAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project?mode=planner',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote',
    buttonText: 'Calculate',
    color: '#003365',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy',
    buttonText: 'Build',
    color: '#B30158',
  },
]

// =============================================================================
// DATA - Apron Colors
// =============================================================================

const APRON_COLORS = [
  {
    name: 'Black',
    subtitle: 'Most Popular',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Ashen Gray',
    subtitle: 'Modern Neutral',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Cocoa Brown',
    subtitle: 'Warm Earth Tone',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Royal Blue',
    subtitle: 'Bold Accent',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Navy',
    subtitle: 'New Color',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
    isNew: true,
  },
  {
    name: 'Moss Green',
    subtitle: 'Natural Blend',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Forest Green',
    subtitle: 'Classic Green',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'Sandy Tan',
    subtitle: 'Beach Inspired',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
  },
  {
    name: 'No Canvas',
    subtitle: 'Panels < 78in only',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Clear-Vinyl-Plastic-Patio-Enclosures-1200-1024x768.jpg',
    note: 'Only for panels under 78" tall',
  },
]

const HARDWARE_VIDEOS = [
  { id: '5dWUpGj6lYc', title: 'Marine Snaps in under 90 Seconds' },
  { id: 'QaRUVjmJKEY', title: 'Magnetic Doorways in under 90 Seconds' },
  { id: 'dbW9Xp3_InM', title: 'Stucco Strips in under 90 Seconds' },
]

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ClearVinylOptionsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With Project Flow Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Clear Vinyl Options"
          subtitle="This page gives you an overview of your apron color choices, top attachment options, and a basic understanding of our simple attachment hardware."
          videoId="ca6GufadXoE"
          videoTitle="Clear Vinyl Apron Colors Walkthrough"
          variant="compact"
          actions={heroActions}
        />

        {/* ================================================================
            STEP 1: APRON COLORS
            ================================================================ */}
        <HeaderBarSection icon={Palette} label="Step 1: Choose Your Apron Color" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              The apron is the colored canvas border that surrounds your clear vinyl panel. Choose a color 
              that complements your outdoor space. <strong>Black is our most popular choice</strong> and 
              works well with most settings.
            </Text>

            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {APRON_COLORS.map((color, idx) => (
                <Card key={idx} variant="elevated" className="!p-0 overflow-hidden text-center">
                  <Frame ratio="4/3">
                    <img
                      src={color.image}
                      alt={`${color.name} apron clear vinyl panel`}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <div className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Heading level={4} className="!mb-0 !text-sm">{color.name}</Heading>
                      {color.isNew && (
                        <Badge variant="primary" className="!text-xs !py-0 !px-1.5">New</Badge>
                      )}
                    </div>
                    <Text size="sm" className="text-gray-500 !mb-0 !text-xs">
                      {color.subtitle}
                    </Text>
                    {color.note && (
                      <Text size="sm" className="text-[#B30158] !mb-0 !text-xs mt-1">
                        {color.note}
                      </Text>
                    )}
                  </div>
                </Card>
              ))}
            </Grid>

            <div className="flex justify-center pt-2">
              <Button variant="outline" asChild>
                <Link href="/gallery?category=clear-vinyl">
                  See Full Client Gallery By Color
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            STEP 2: TOP ATTACHMENT
            ================================================================ */}
        <HeaderBarSection icon={SlidersHorizontal} label="Step 2: Two Top Attachment Options" variant="dark">
          <Stack gap="lg">
            <div className="text-center">
              <BulletedList spacing="sm" className="inline-block text-left">
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Velcro Attachment</strong> is fixed in place and doesn't slide. <strong className="text-[#406517]">95% choose this.</strong>
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Tracking Attachment</strong> allows you to slide panels from side to side.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Both are easy to install. Velcro is less expensive (no track hardware).
                </ListItem>
              </BulletedList>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-0 overflow-hidden text-center">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif"
                    alt="Velcro attachment demonstration"
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </Frame>
                <div className="p-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Heading level={4} className="!mb-0">Velcro (Fixed)</Heading>
                    <Badge variant="primary" className="!bg-[#406517] !text-white !border-0">95% Choose</Badge>
                  </div>
                  <Text size="sm" className="text-gray-500">
                    Does NOT slide - Most affordable option
                  </Text>
                </div>
              </Card>
              <Card variant="elevated" className="!p-0 overflow-hidden text-center">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif"
                    alt="Tracking attachment demonstration"
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </Frame>
                <div className="p-4">
                  <Heading level={4} className="!mb-1">Tracking System</Heading>
                  <Text size="sm" className="text-gray-500">
                    Slides side-to-side like elegant drapes
                  </Text>
                </div>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            STEP 3: COMPONENTS & USABILITY
            ================================================================ */}
        <HeaderBarSection icon={Settings} label="Step 3: Simple Components & Usability" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              One of our biggest focal points is the ease of installation and usability of your panels. 
              Our zipper doorways allow easy entry and exit between panels. For simple installation, 
              we use versatile components like L-screws and marine snaps to attach to different surfaces.
            </Text>

            {/* Zipper Doorways */}
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#003365]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DoorOpen className="w-6 h-6 text-[#003365]" />
                  </div>
                  <div>
                    <Heading level={4} className="!mb-2">Zipper Doorways</Heading>
                    <Text size="sm" className="text-gray-600">
                      Easy entry and exit between panels and at the edge of panels. Zippers are 
                      heavy-duty and weatherproof for durability in outdoor conditions.
                    </Text>
                  </div>
                </div>
              </Card>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-6 h-6 text-[#406517]" />
                  </div>
                  <div>
                    <Heading level={4} className="!mb-2">L-Screws, Grommets & Marine Snaps</Heading>
                    <Text size="sm" className="text-gray-600">
                      Versatile attachment hardware that works on wood, vinyl, aluminum, and more. 
                      All stainless steel for outdoor durability.
                    </Text>
                  </div>
                </div>
              </Card>
            </Grid>

            {/* Hardware Videos */}
            <div className="pt-4">
              <Heading level={4} className="text-center !mb-4">Watch How It Works</Heading>
              <Text className="text-gray-600 text-center max-w-2xl mx-auto !mb-6">
                Each video is under 90 seconds - watch them to understand how your panels will operate.
              </Text>
              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
                {HARDWARE_VIDEOS.map((video) => (
                  <div key={video.id}>
                    <YouTubeEmbed
                      videoId={video.id}
                      title={video.title}
                      variant="card"
                    />
                    <Text className="text-center mt-2 font-medium text-sm">
                      {video.title}
                    </Text>
                  </div>
                ))}
              </Grid>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            PHOTO GUIDELINES
            ================================================================ */}
        <HeaderBarSection icon={Camera} label="Photo Guidelines for Planning" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-2xl mx-auto">
              We're happy to help you plan your project with a quick planning session. For maximum 
              speed and efficiency, photos of your space are extremely helpful.
            </Text>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-[#406517] flex-shrink-0 mt-0.5" />
                  <div>
                    <Heading level={4} className="!mb-1">Good Photos</Heading>
                    <Text size="sm" className="text-gray-500">
                      Step BACK, zoom OUT. We need to see full sides with fastening surfaces.
                    </Text>
                  </div>
                </div>
                <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="sm">
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                      alt="Good photo example 1"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-2-Big-1024x768.jpg"
                      alt="Good photo example 2"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                </Grid>
              </Card>
              <Card variant="outlined" className="!p-6 !border-red-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">X</span>
                  </div>
                  <div>
                    <Heading level={4} className="!mb-1">Bad Photos</Heading>
                    <Text size="sm" className="text-gray-500">
                      Too close up - we can't see all fastening surfaces and corner transitions.
                    </Text>
                  </div>
                </div>
                <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="sm">
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden opacity-60">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-1-Big-1024x768.jpg"
                      alt="Bad photo example 1"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden opacity-60">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                      alt="Bad photo example 2"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                </Grid>
              </Card>
            </Grid>

            <div className="flex justify-center pt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project?mode=planner">
                  Send Us Your Photos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            QUICK LINKS
            ================================================================ */}
        <section>
          <Heading level={3} className="text-center !mb-6">Want to See More First?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/install/clear-vinyl">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Play className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                <Heading level={4}>See a Full Installation</Heading>
                <Text size="sm" className="text-gray-500">Watch clear vinyl install videos</Text>
              </Card>
            </Link>
            <Link href="/gallery?category=clear-vinyl">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Images className="w-8 h-8 mx-auto mb-2 text-[#003365]" />
                <Heading level={4}>Client Gallery</Heading>
                <Text size="sm" className="text-gray-500">See completed clear vinyl projects</Text>
              </Card>
            </Link>
            <Link href="/reviews">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-[#FFA501]" />
                <Heading level={4}>Reviews</Heading>
                <Text size="sm" className="text-gray-500">What customers are saying</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        {/* Back to Clear Vinyl Home */}
        <div className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link href="/clear-vinyl-plastic-patio-enclosures">
              Return to Clear Vinyl Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
