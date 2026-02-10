'use client'

import Link from 'next/link'
import { 
  Play, 
  Settings, 
  Palette, 
  SlidersHorizontal,
  MessageSquare,
  Calculator,
  Hammer,
  Images,
  Star,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  YouTubeEmbed,
  Frame,
  HeaderBarSection,
  PowerHeaderTemplate,
  BulletedList,
  ListItem,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import type { PowerHeaderAction } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS, HARDWARE_VIDEOS } from '@/lib/constants/videos'

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
// DATA
// =============================================================================

const MESH_TYPES = [
  {
    name: 'Heavy Mosquito Mesh',
    subtitle: '(90% Choose This in Black)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White', 'Ivory'],
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies.',
  },
  {
    name: 'No-See-Um Mesh',
    subtitle: '(For Tiny Biting Flies)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White'],
    description: 'Finer weave blocks tiny midge flies common near coastal areas.',
  },
  {
    name: 'Shade Mesh',
    subtitle: '(For Shade & Projection)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White'],
    description: 'Provides shade privacy and insect protection. Also works as projection screen.',
  },
]

// HARDWARE_VIDEOS imported from @/lib/constants/videos

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function OptionsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With Project Flow Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Discover Your Options"
          subtitle="This page gives you an overview of your options and a basic understanding of our simple attachment hardware. Use the sections below to learn about each topic."
          videoId={VIDEOS.SHORT_OVERVIEW}
          videoTitle="Mosquito Curtains Options Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={heroActions}
        />

        {/* ================================================================
            STEP 1: MESH TYPES
            ================================================================ */}
        <HeaderBarSection icon={Palette} label="Step 1: Know Your Mesh Type & Color" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Your project will be made up of mesh panels in your choice of mesh type and color. 
              Over 90% of orders choose <strong>Black Heavy Mosquito Mesh</strong>. All materials 
              are durable outdoor polyester, made to get wet and will not fade.
            </Text>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              {MESH_TYPES.map((mesh, idx) => (
                <Card key={idx} variant="elevated" className="!p-0 overflow-hidden text-center">
                  <Frame ratio="1/1">
                    <img
                      src={mesh.image}
                      alt={mesh.name}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <div className="p-4">
                    <Heading level={4} className="!mb-1">{mesh.name}</Heading>
                    <Text size="sm" className="text-[#406517] font-medium !mb-2">
                      {mesh.subtitle}
                    </Text>
                    <Text size="sm" className="text-gray-500 !mb-3">
                      {mesh.description}
                    </Text>
                    <div className="flex justify-center gap-2">
                      {mesh.colors.map((color) => (
                        <span 
                          key={color}
                          className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </Grid>
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
                  <strong>Tracking Attachment</strong> allows you to slide curtains from side to side.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Velcro Attachment</strong> is fixed in place and doesn't slide.
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
              <Card variant="elevated" className="!p-0 overflow-hidden text-center">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif"
                    alt="Velcro attachment demonstration"
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </Frame>
                <div className="p-4">
                  <Heading level={4} className="!mb-1">Velcro Attachment</Heading>
                  <Text size="sm" className="text-gray-500">
                    Fixed in place, most affordable option
                  </Text>
                </div>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            STEP 3: HARDWARE VIDEOS
            ================================================================ */}
        <HeaderBarSection icon={Settings} label="Step 3: Understand Our Simple Attachment Hardware" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              One of our biggest focal points is the ease of installation and usability of your 
              curtains. We use versatile components like marine snaps and magnetic doorways. 
              Each video is under 90 seconds - watch them to understand how your curtains will operate.
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
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate
          primaryCTAText="Start Your Project"
          showPhone={false}
        />

        {/* ================================================================
            QUICK LINKS
            ================================================================ */}
        <section>
          <Heading level={3} className="text-center !mb-6">Want to See More First?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/install">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Play className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                <Heading level={4}>See a Full Installation</Heading>
                <Text size="sm" className="text-gray-500">Watch videos of complete installs</Text>
              </Card>
            </Link>
            <Link href="/gallery">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Images className="w-8 h-8 mx-auto mb-2 text-[#003365]" />
                <Heading level={4}>Client Gallery</Heading>
                <Text size="sm" className="text-gray-500">See completed projects</Text>
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

      </Stack>
    </Container>
  )
}
