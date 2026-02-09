'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  FolderOpen,
  Images,
  Bug,
  Snowflake,
  Home,
  TreePine,
  Tent,
  Warehouse,
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

const GALLERY_COLLECTIONS = [
  {
    title: 'All Projects',
    description: 'Browse our complete gallery of customer installations.',
    href: '/gallery',
    icon: Images,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg',
    count: '500+',
  },
  {
    title: 'Mosquito Netting',
    description: 'All mosquito curtain installations - porches, patios, gazebos, and more.',
    href: '/gallery/mosquito-netting',
    icon: Bug,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200.jpg',
    count: '300+',
  },
  {
    title: 'White Netting',
    description: 'White mesh creates a bright, airy feel while keeping bugs out.',
    href: '/gallery/white-netting',
    icon: Bug,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200.jpg',
    count: '100+',
  },
  {
    title: 'Black Netting',
    description: 'Black mesh offers better visibility and blends with dark frames.',
    href: '/gallery/black-netting',
    icon: Bug,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200.jpg',
    count: '200+',
  },
  {
    title: 'Clear Vinyl Enclosures',
    description: 'Weather-blocking panels that extend your outdoor season.',
    href: '/gallery/clear-vinyl',
    icon: Snowflake,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200.jpg',
    count: '150+',
  },
  {
    title: 'Featured Projects',
    description: 'Hand-picked installations showcasing our best work.',
    href: '/gallery/featured',
    icon: Images,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg',
    count: '50+',
  },
]

const PROJECT_TYPES = [
  {
    title: 'Porch Projects',
    href: '/gallery/porch-projects',
    icon: Home,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200.jpg',
  },
  {
    title: 'Pergola Projects',
    href: '/pergola',
    icon: TreePine,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg',
  },
  {
    title: 'Gazebo Projects',
    href: '/gazebo',
    icon: Tent,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200.jpg',
  },
  {
    title: 'Yardistry Gazebos',
    href: '/yardistry-gazebo-curtains',
    icon: Warehouse,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/05/Yardistry-Application.jpg',
  },
]

export default function ProjectsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Project Gallery
            </Heading>
            <Text className="text-xl text-gray-600">
              Browse real customer installations for inspiration. See how our curtains 
              look in spaces like yours.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/gallery">
                  Browse All Projects
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* Gallery Collections */}
        <HeaderBarSection icon={Images} label="Browse by Collection" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {GALLERY_COLLECTIONS.map((collection) => {
              const Icon = collection.icon
              return (
                <Card key={collection.title} variant="elevated" className="!p-0 overflow-hidden group">
                  <Link href={collection.href} className="block">
                    <Frame ratio="4/3" className="relative">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            <span className="font-semibold">{collection.title}</span>
                          </div>
                          <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                            {collection.count}
                          </span>
                        </div>
                      </div>
                    </Frame>
                    <div className="p-4">
                      <Text className="text-sm text-gray-600 !mb-0">{collection.description}</Text>
                    </div>
                  </Link>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* Project Types */}
        <HeaderBarSection icon={FolderOpen} label="Browse by Project Type" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {PROJECT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Card key={type.title} variant="elevated" className="!p-0 overflow-hidden group">
                  <Link href={type.href} className="block">
                    <Frame ratio="1/1" className="relative">
                      <img
                        src={type.image}
                        alt={type.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-center">
                        <Icon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">{type.title}</span>
                      </div>
                    </Frame>
                  </Link>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* Submit Your Project */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Heading level={3} className="!mb-4">Share Your Project</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
            Completed your installation? We'd love to feature your project in our gallery. 
            Email photos to share with our community.
          </Text>
          <Button variant="outline" asChild>
            <Link href="/start-project">
              Contact Us
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
