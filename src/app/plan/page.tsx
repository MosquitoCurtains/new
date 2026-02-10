'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  LayoutGrid,
  Hexagon,
  MessageSquare,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  BulletedList,
  ListItem,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

// Exposure types - images from WordPress /plan-screen-porch/ (2021/01 folder)
const EXPOSURE_TYPES = [
  {
    id: '1-sided',
    title: '1 Sided Exposure',
    href: '/plan/1-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/01-One-Sided-Exposure.jpg',
  },
  {
    id: '2-sided',
    title: '2 Sided Exposure',
    href: '/plan/2-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/02-L-Shaped-Exposure.jpg',
  },
  {
    id: '3-sided',
    title: '3 Sided Exposure',
    href: '/plan/3-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/03-U-Shaped-Exposure.jpg',
  },
  {
    id: '4-sided',
    title: '4+ Sided Exposure',
    href: '/plan/4-sided',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/04-4-Sides-Wrapping.jpg',
  },
]

// Special project types - images from WordPress /plan-screen-porch/ (2021/01 folder)
const SPECIAL_TYPES = [
  {
    id: 'free-standing',
    title: 'Free Standing',
    href: '/plan/free-standing',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/05-Free-Standing-Structures.jpg',
  },
  {
    id: 'hexagons',
    title: 'Hexagons & Octagons',
    href: '/plan/free-standing',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/06-Hexagons-and-Octagons.jpg',
  },
  {
    id: 'tents',
    title: 'Tents & Awnings',
    href: '/plan/free-standing',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/07-Tents-and-Awnings.jpg',
  },
  {
    id: 'open-deck',
    title: 'Open Deck (No Roof)',
    href: '/plan/free-standing',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/08-Open-Decks-No-Roof.jpg',
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
            <Text className="text-lg text-gray-600">
              This section is for clients who like to plan projects on their own. Sometimes folks would prefer one of our planners to assist them.
            </Text>
            <BulletedList spacing="md" className="text-left max-w-2xl mx-auto">
              <ListItem variant="arrow" iconColor="#406517">
                <strong>(A) To Plan your own project</strong>, start by clicking a structure below that MOST resembles the # of sides in your project.
              </ListItem>
              <ListItem variant="arrow" iconColor="#406517">
                <strong>(B) To skip this step</strong> and have one of our planners help you, follow the instructions on our{' '}
                <Link href="/contact" className="text-[#406517] underline font-medium">CONTACT US</Link> page.
              </ListItem>
            </BulletedList>

            {/* Overview Video */}
            <div className="max-w-2xl mx-auto pt-4">
              <YouTubeEmbed
                videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW}
                title="Planning Overview"
                variant="card"
              />
            </div>
          </Stack>
        </section>

        {/* ================================================================
            EXPOSURE TYPES - "Select one of the exposure types below"
            ================================================================ */}
        <HeaderBarSection icon={LayoutGrid} label="Select one of the exposure types below" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg">
            {EXPOSURE_TYPES.map((type) => (
              <Link key={type.id} href={type.href} className="group">
                <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-auto"
                    />
                  </div>
                  <Heading level={4} className="!mb-0 group-hover:text-[#406517]">{type.title}</Heading>
                </Card>
              </Link>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            SPECIAL PROJECT TYPES - with real images from WordPress
            ================================================================ */}
        <HeaderBarSection icon={Hexagon} label="If you have one of these project types, you will be working with a planner." variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {SPECIAL_TYPES.map((type) => (
              <Link key={type.id} href={type.href} className="group">
                <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-auto"
                    />
                  </div>
                  <Heading level={4} className="!mb-0 group-hover:text-[#406517]">{type.title}</Heading>
                </Card>
              </Link>
            ))}
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
            and we&apos;ll provide personalized recommendations and a detailed quote.
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
