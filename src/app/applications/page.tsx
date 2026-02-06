'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Grid3X3,
  Home,
  TreePine,
  Tent,
  Warehouse,
  Sun,
  Film,
  Building,
  Leaf,
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
  FinalCTATemplate,
  HeaderBarSection,
  WhyChooseUsTemplate,
} from '@/lib/design-system'

const APPLICATION_TYPES = [
  {
    title: 'Screened Porch',
    description: 'The most popular application. Enclose your porch with mosquito curtains for bug-free relaxation.',
    href: '/screened-porch',
    icon: Home,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Porch-Application.jpg',
  },
  {
    title: 'Pergola',
    description: 'Add privacy and bug protection to your pergola without blocking the view.',
    href: '/pergola',
    icon: TreePine,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Pergola-Application.jpg',
  },
  {
    title: 'Gazebo',
    description: 'Custom-fit curtains for gazebos of all shapes - hexagonal, octagonal, rectangular.',
    href: '/gazebo',
    icon: Tent,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Gazebo-Application.jpg',
  },
  {
    title: 'Yardistry Gazebo',
    description: 'Perfect-fit curtains specifically designed for Yardistry gazebo dimensions.',
    href: '/yardistry-gazebo-curtains',
    icon: Warehouse,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/05/Yardistry-Application.jpg',
  },
  {
    title: 'Outdoor Projection Screens',
    description: 'High-quality screens for backyard movie nights and outdoor presentations.',
    href: '/outdoor-projection-screens',
    icon: Film,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Projection-Application.jpg',
  },
  {
    title: 'Roll Up Shade Screens',
    description: 'Retractable shade screens that roll up when not in use.',
    href: '/roll-up-shade-screens',
    icon: Sun,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Screen-Application.jpg',
  },
  {
    title: 'Tents & Awnings',
    description: 'Enclose tents, canopies, and awning structures with custom netting.',
    href: '/tent-screens',
    icon: Tent,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Tent-Application.jpg',
  },
  {
    title: 'Camping Net',
    description: 'Portable and durable mosquito netting solutions for camping trips.',
    href: '/camping-net',
    icon: Leaf,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Camping-Application.jpg',
  },
  {
    title: 'HVAC Chiller Screens',
    description: 'Protective mesh screens for commercial HVAC and chiller units.',
    href: '/hvac-chiller-screens',
    icon: Building,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/HVAC-Application.jpg',
  },
]

export default function ApplicationsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Grid3X3 className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Applications
            </Heading>
            <Text className="text-xl text-gray-600">
              See how our custom curtains work for different structures. From porches 
              to pergolas, gazebos to commercial applications.
            </Text>
          </Stack>
        </section>

        {/* Applications Grid */}
        <HeaderBarSection icon={Grid3X3} label="Project Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {APPLICATION_TYPES.map((app) => {
              const Icon = app.icon
              return (
                <Card key={app.title} variant="elevated" className="!p-0 overflow-hidden group hover:shadow-xl transition-all">
                  <Link href={app.href} className="block">
                    <Frame ratio="4/3" className="relative">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#406517]" />
                      </div>
                    </Frame>
                    <div className="p-5">
                      <Heading level={4} className="!mb-2 group-hover:text-[#406517] transition-colors">
                        {app.title}
                      </Heading>
                      <Text className="text-sm text-gray-600 !mb-0">{app.description}</Text>
                    </div>
                  </Link>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* Don't See Your Application */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20 text-center">
          <Heading level={3} className="!mb-4">Don't See Your Application?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
            We've made curtains for structures we'd never heard of before. If you have 
            an outdoor space that needs protection, we can probably help. Talk to us!
          </Text>
          <Button variant="primary" asChild>
            <Link href="/start-project?mode=planner">
              Discuss Your Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Card>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
