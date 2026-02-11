'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Home,
  Car,
  TreePine,
  Tent,
  DoorOpen,
  Building,
  Ship,
  Film,
  Umbrella,
  HelpCircle,
  Layers,
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
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

// Project types grid - matches WordPress
const PROJECT_TYPES = [
  {
    title: 'Porches',
    href: '/screened-porch',
    icon: Home,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Porch.jpg',
  },
  {
    title: 'Patios',
    href: '/screen-patio',
    icon: Layers,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Patio.jpg',
  },
  {
    title: 'Garages',
    href: '/garage-door-screens',
    icon: Car,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Garage.jpg',
  },
  {
    title: 'Pergolas',
    href: '/pergola-screen-curtains',
    icon: TreePine,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Pergola.jpg',
  },
  {
    title: 'Gazebos',
    href: '/gazebo-screen-curtains',
    icon: Tent,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Gazebo.jpg',
  },
  {
    title: 'French Doors',
    href: '/french-door-screens',
    icon: DoorOpen,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-French-Doorway.jpg',
  },
  {
    title: 'Industrial',
    href: '/industrial-netting',
    icon: Building,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Industrial-Application.jpg',
  },
  {
    title: 'Decks',
    href: '/screened-in-decks',
    icon: Layers,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Deck.jpg',
  },
  {
    title: 'Projection',
    href: '/outdoor-projection-screens',
    icon: Film,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Projection-Screen-Mesh.jpg',
  },
  {
    title: 'Awnings',
    href: '/awning-screen-enclosures',
    icon: Umbrella,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Awning.jpg',
  },
  {
    title: 'Boats',
    href: '/boat-screens',
    icon: Ship,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-On-Boat.jpg',
  },
  {
    title: 'Other',
    href: '/contact',
    icon: HelpCircle,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Other-Applications-Question-Mark.jpg',
  },
]

export default function ScreenedPorchEnclosuresPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - Hub page for all project types
            ================================================================ */}
        <PowerHeaderTemplate
          title="Mosquito Netting Solutions"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* ================================================================
            PROJECT TYPES GRID
            ================================================================ */}
        <HeaderBarSection icon={Bug} label="Select A Project Type Below Most Similar to Yours" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {PROJECT_TYPES.map((project) => {
                const Icon = project.icon
                return (
                  <Card key={project.title} variant="elevated" className="!p-0 overflow-hidden group">
                    <Link href={project.href} className="block">
                      <Frame ratio="4/3" className="relative">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                          <Icon className="w-6 h-6 mx-auto mb-1" />
                          <span className="font-semibold text-lg">{project.title}</span>
                        </div>
                      </Frame>
                    </Link>
                  </Card>
                )
              })}
            </Grid>
        </HeaderBarSection>

        {/* ================================================================
            WHY CHOOSE US
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            GALLERY CTA
            ================================================================ */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Heading level={3} className="!mb-4">Want to see a gallery of client installed projects?</Heading>
          <Button variant="primary" asChild>
            <Link href="/gallery/mosquito-netting">
              Click to See Client Gallery
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Card>

        {/* ================================================================
            CLIENT REVIEWS (design-system template: order count + 6 reviews)
            ================================================================ */}
        <ClientReviewsTemplate />

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
