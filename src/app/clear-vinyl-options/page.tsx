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
  Phone,
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
  TwoColumn,
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
                <Link href="/gallery?category=clear-vinyl">
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

        {/* ================================================================
            HOW TO GET STARTED
            ================================================================ */}
        <section className="bg-[#003365] rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <Heading level={2} className="!text-white !mb-2">How to Get Started</Heading>
            <Heading level={3} className="!text-white/90 !mb-4 !font-normal">
              Get Started Fast With a Real Person!
            </Heading>
            <Text className="!text-white/80 max-w-2xl mx-auto">
              We are happy to help you plan your project with a quick planning session. For maximum 
              speed and efficiency, photos of your space are extremely helpful. 
              <strong className="text-white"> If you have a general question, call us at{' '}
                <a href="tel:7706454745" className="underline hover:no-underline">770-645-4745</a>.
              </strong>
            </Text>
          </div>

          {/* Photo Guidelines */}
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="mb-8">
            <Card variant="elevated" className="!p-6 !bg-white">
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
            <Card variant="outlined" className="!p-6 !bg-white !border-red-200">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" asChild className="!bg-white !text-[#003365] hover:!bg-gray-100">
              <Link href="/start-project?mode=planner">
                <Camera className="mr-2 w-5 h-5" />
                Send Us Your Photos
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="!border-white !text-white hover:!bg-white/10">
              <a href="tel:7706454745">
                <Phone className="mr-2 w-5 h-5" />
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </section>

        {/* ================================================================
            LEARN MORE SECTION
            ================================================================ */}
        <section>
          <Heading level={3} className="text-center !mb-6">Learn More</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            <Link href="/our-story">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Why Our System?</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">Important considerations to make.</Text>
                <Text size="sm" className="text-[#406517] font-medium">See What Makes Us Better →</Text>
              </Card>
            </Link>
            <Link href="/install/clear-vinyl">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Self-Installation</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">Is it really that easy?</Text>
                <Text size="sm" className="text-[#406517] font-medium">See a Full Installation →</Text>
              </Card>
            </Link>
            <Link href="/satisfaction-guarantee">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Guarantee</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">It's all about choices and care.</Text>
                <Text size="sm" className="text-[#406517] font-medium">Satisfaction Guarantee →</Text>
              </Card>
            </Link>
            <Link href="/clear-vinyl-options">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Options</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">Apron colors, top attachments and usability.</Text>
                <Text size="sm" className="text-[#406517] font-medium">Discover Your Options →</Text>
              </Card>
            </Link>
            <Link href="/start-project?mode=quote">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Instant Quote</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">Get an estimate within 5% of actual cost.</Text>
                <Text size="sm" className="text-[#406517] font-medium">Instant Price Calculator →</Text>
              </Card>
            </Link>
            <Link href="/start-project?mode=planner">
              <Card variant="outlined" hover className="!p-6">
                <Heading level={4} className="!mb-1">Ordering</Heading>
                <Text size="sm" className="text-gray-500 !mb-3">Our team will help plan your project!</Text>
                <Text size="sm" className="text-[#406517] font-medium">Send Us Photos →</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        {/* Back to Clear Vinyl Home */}
        <div className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link href="/clear-vinyl-plastic-patio-enclosures">
              Return to Clear Vinyl HomePage
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
