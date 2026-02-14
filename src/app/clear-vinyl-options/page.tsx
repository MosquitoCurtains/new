'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Settings, 
  Palette, 
  SlidersHorizontal,
  MessageSquare,
  Calculator,
  Hammer,
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
import { ClearVinylFooter } from '@/components/marketing/ClearVinylFooter'
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
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy',
    buttonText: 'Build',
    color: '#B30158',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote',
    buttonText: 'Calculate',
    color: '#003365',
  },
]

// =============================================================================
// DATA - Apron Colors with actual WordPress CDN images
// =============================================================================

const APRON_COLORS = [
  {
    name: 'Black',
    subtitle: 'Most Popular',
    swatchColor: '#1a1a1a',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Winterized-Porch-Plastic-Panels-Black-Canvas-1200.jpg',
  },
  {
    name: 'Ashen Gray',
    subtitle: 'Modern Neutral',
    swatchColor: '#4a4a4a',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
  },
  {
    name: 'Cocoa Brown',
    subtitle: 'Warm Earth Tone',
    swatchColor: '#5c4033',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200.jpg',
  },
  {
    name: 'Royal Blue',
    subtitle: 'Bold Accent',
    swatchColor: '#1e3a8a',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Plastic-Enclosures-Royal-Blue-Canvas-Tent-1200.jpg',
  },
  {
    name: 'Navy',
    subtitle: 'New Color',
    swatchColor: '#1e3a5f',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/7-Navy-Clear-Vinyl-Enclosure.jpg',
    isNew: true,
  },
  {
    name: 'Moss Green',
    subtitle: 'Natural Blend',
    swatchColor: '#4a5d23',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Church-1200.jpg',
  },
  {
    name: 'Forest Green',
    subtitle: 'Classic Green',
    swatchColor: '#228b22',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200.jpg',
  },
  {
    name: 'Sandy Tan',
    subtitle: 'Beach Inspired',
    swatchColor: '#c2b280',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-Beach-House-1200.jpg',
  },
  {
    name: 'No Canvas',
    subtitle: 'Panels < 78" only',
    swatchColor: '#f5f5f5',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/18-Clear-Plastic-Gazebo-With-No-Canvas-1200.jpg',
    note: 'Only for panels under 78" tall',
  },
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
          title="Discover Your Options"
          subtitle="This page is designed to give you an overview of your options and a basic understanding of our simple attachment hardware."
          videoId="hhlqknPm8ac"
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

            {/* Color Swatches with Images */}
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {APRON_COLORS.map((color, idx) => (
                <div key={idx} className="text-center">
                  {/* Color Swatch Circle */}
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white shadow-lg"
                    style={{ backgroundColor: color.swatchColor }}
                  />
                  {/* Color Name */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Text className="font-semibold !mb-0 text-sm">{color.name}</Text>
                    {color.isNew && (
                      <Badge variant="primary" className="!text-[10px] !py-0 !px-1">New</Badge>
                    )}
                  </div>
                  {/* Example Image */}
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                    <img
                      src={color.image}
                      alt={`${color.name} apron clear vinyl enclosure`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Frame>
                  {color.note && (
                    <Text size="sm" className="text-[#B30158] !mb-0 !text-xs mt-1">
                      {color.note}
                    </Text>
                  )}
                </div>
              ))}
            </Grid>

            <div className="flex justify-center pt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/gallery?filter=clear_vinyl">
                  See Full Client Gallery By Color
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            STEP 2: TOP ATTACHMENT OPTIONS
            ================================================================ */}
        <HeaderBarSection icon={SlidersHorizontal} label="Step 2: Two Top Attachment Options" variant="dark">
          <Stack gap="lg">
            <div className="text-center max-w-2xl mx-auto">
              <BulletedList spacing="sm" className="inline-block text-left">
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Velcro</strong> is fixed in place and doesn't slide. <strong className="text-[#406517]">95% choose this.</strong>
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Tracking Attachment</strong> allows you to slide panels from side to side.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Both are easy to install. Velcro is less expensive (no track hardware).
                </ListItem>
              </BulletedList>
            </div>

            {/* Centered 1/3 width cards */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {/* Velcro Option */}
              <Card variant="elevated" className="!p-0 overflow-hidden w-full md:w-1/3">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/CV-TRACK-4-OPTIMIZED.gif"
                    alt="Velcro attachment - fixed in place"
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </Frame>
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Heading level={4} className="!mb-0">Velcro (Fixed)</Heading>
                    <Badge variant="primary" className="!bg-[#406517] !text-white !border-0">95% Choose</Badge>
                  </div>
                  <Text size="sm" className="text-gray-500">
                    Does NOT slide - Most affordable option
                  </Text>
                </div>
              </Card>

              {/* Tracking Option */}
              <Card variant="elevated" className="!p-0 overflow-hidden w-full md:w-1/3">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/CV-TRACK-12.5-OPTIMIZED.gif"
                    alt="Tracking attachment - slides side to side"
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </Frame>
                <div className="p-4 text-center">
                  <Heading level={4} className="!mb-1">Tracking System</Heading>
                  <Text size="sm" className="text-gray-500">
                    Slides side-to-side like elegant drapes
                  </Text>
                </div>
              </Card>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            STEP 3: COMPONENTS & USABILITY
            ================================================================ */}
        <HeaderBarSection icon={Settings} label="Step 3: Simple Components & Usability" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center max-w-2xl mx-auto text-sm">
              Easy installation and usability is our focus. Zipper doorways for entry/exit, 
              plus versatile L-screws and marine snaps for any surface.
            </Text>

            {/* 3-Column Grid - All 16:9 */}
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {/* Zipper Doorways */}
              <Card variant="elevated" className="!p-0 overflow-hidden">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Zipper-12.5-Optimized.gif"
                    alt="Zipper doorways demonstration"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="p-3 text-center">
                  <Heading level={4} className="!mb-0 !text-sm">Zipper Doorways</Heading>
                  <Text size="sm" className="text-gray-500 !text-xs">
                    Easy entry and exit between panels
                  </Text>
                </div>
              </Card>

              {/* L-Screws & Marine Snaps */}
              <Card variant="elevated" className="!p-0 overflow-hidden">
                <Frame ratio="16/9">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Snaps-and-L-Screws.jpg"
                    alt="L-Screws, Grommets and Marine Snaps hardware"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="p-3 text-center">
                  <Heading level={4} className="!mb-0 !text-sm">L-Screws & Marine Snaps</Heading>
                  <Text size="sm" className="text-gray-500 !text-xs">
                    Stainless steel for any surface
                  </Text>
                </div>
              </Card>

              {/* Marine Snaps Video */}
              <Card variant="elevated" className="!p-0 overflow-hidden">
                <Frame ratio="16/9">
                  <YouTubeEmbed
                    videoId="5dWUpGj6lYc"
                    variant="card"
                  />
                </Frame>
                <div className="p-3 text-center">
                  <Heading level={4} className="!mb-0 !text-sm">Marine Snaps Video</Heading>
                  <Text size="sm" className="text-gray-500 !text-xs">
                    Under 90 seconds to understand
                  </Text>
                </div>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <ClearVinylFooter />

      </Stack>
    </Container>
  )
}
