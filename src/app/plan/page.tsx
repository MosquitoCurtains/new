'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Square,
  LayoutGrid,
  Grid3X3,
  Hexagon,
  MessageSquare,
  Home,
  Tent,
  TreePine,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

// Exposure types
const EXPOSURE_TYPES = [
  {
    id: '1-sided',
    title: '1 Sided Exposure',
    description: 'Single opening to cover',
    href: '/plan/1-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/1-Sided-Icon.jpg',
  },
  {
    id: '2-sided',
    title: '2 Sided Exposure',
    description: 'Two adjacent openings',
    href: '/plan/2-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/2-Sided-Icon.jpg',
  },
  {
    id: '3-sided',
    title: '3 Sided Exposure',
    description: 'Three openings to cover',
    href: '/plan/3-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Icon.jpg',
  },
  {
    id: '4-sided',
    title: '4+ Sided Exposure',
    description: 'Four or more openings',
    href: '/plan/4-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/4-Sided-Icon.jpg',
  },
]

// Special project types
const SPECIAL_TYPES = [
  {
    id: 'free-standing',
    title: 'Free Standing',
    description: 'Gazebos, pergolas without walls',
    href: '/plan/free-standing',
    icon: TreePine,
  },
  {
    id: 'hexagons',
    title: 'Hexagons & Octagons',
    description: 'Non-rectangular structures',
    href: '/contact',
    icon: Hexagon,
  },
  {
    id: 'tents',
    title: 'Tents & Awnings',
    description: 'Event tents, awning enclosures',
    href: '/tent-screens',
    icon: Tent,
  },
  {
    id: 'open-deck',
    title: 'Open Deck (No Roof)',
    description: 'Decks without covered roof',
    href: '/contact',
    icon: Home,
  },
]

// Planning resources
const PLANNING_RESOURCES = [
  { title: 'Mesh and Colors', href: '/plan/mesh-colors', description: 'Choose your mesh type and color' },
  { title: 'Curtain Tracking', href: '/plan/tracking', description: 'Understand tracking options' },
  { title: 'Magnetic Doorways', href: '/plan/magnetic-doorways', description: 'How doorways work' },
  { title: 'Sealing The Base', href: '/plan/sealing-base', description: 'Bottom attachment options' },
  { title: 'How To Order', href: '/plan/how-to-order', description: 'Step-by-step ordering guide' },
]

export default function PlanPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="md" className="max-w-3xl mx-auto">
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Planning Your Project
            </Heading>
            <Text className="text-xl text-gray-600">
              This section is for clients who like to plan projects on their own. 
              Start by clicking a structure below that MOST resembles the number of sides in your project.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="accent" asChild>
                <Link href="/work-with-a-planner">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Skip - Work With A Planner
                </Link>
              </Button>
            </div>

            {/* Overview Video */}
            <div className="max-w-2xl mx-auto pt-4">
              <YouTubeEmbed
                videoId={VIDEOS.SHORT_OVERVIEW}
                title="Mosquito Curtains Overview"
                variant="card"
              />
            </div>
          </Stack>
        </section>

        {/* ================================================================
            EXPOSURE TYPES
            ================================================================ */}
        <HeaderBarSection icon={LayoutGrid} label="Select Your Exposure Type" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg">
            {EXPOSURE_TYPES.map((type) => (
              <Link key={type.id} href={type.href} className="group">
                <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1">
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden mb-4">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Heading level={4} className="!mb-1 group-hover:text-[#406517]">{type.title}</Heading>
                  <Text className="text-sm text-gray-600 !mb-0">{type.description}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            SPECIAL PROJECT TYPES
            ================================================================ */}
        <HeaderBarSection icon={Hexagon} label="Special Project Types" variant="dark">
          <Text className="text-center text-gray-600 mb-6">
            If you have one of these project types, you will be working with a planner.
          </Text>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {SPECIAL_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Link key={type.id} href={type.href} className="group">
                  <Card variant="outlined" className="!p-6 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                    <div className="w-12 h-12 bg-[#406517]/10 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:bg-[#406517]/20">
                      <Icon className="w-6 h-6 text-[#406517]" />
                    </div>
                    <Heading level={4} className="!mb-1 !text-base">{type.title}</Heading>
                    <Text className="text-sm text-gray-600 !mb-0">{type.description}</Text>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            PLANNING RESOURCES
            ================================================================ */}
        <HeaderBarSection icon={ArrowRight} label="Planning Resources" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3, desktop: 5 }} gap="md">
            {PLANNING_RESOURCES.map((resource) => (
              <Link key={resource.href} href={resource.href} className="group">
                <Card variant="outlined" className="!p-4 transition-all group-hover:border-[#406517] group-hover:shadow-md h-full">
                  <Heading level={4} className="!mb-1 !text-base group-hover:text-[#406517]">{resource.title}</Heading>
                  <Text className="text-sm text-gray-600 !mb-0">{resource.description}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            NEED HELP
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#B30158]/10 via-white to-[#406517]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Prefer to Have Us Help?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our planning team is here to help you design your project. Send us photos 
            and we'll provide personalized recommendations and a detailed quote.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link href="/work-with-a-planner">
                <MessageSquare className="w-5 h-5 mr-2" />
                Work With A Planner
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </section>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
