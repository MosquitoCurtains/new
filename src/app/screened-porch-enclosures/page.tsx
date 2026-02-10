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

// Testimonials from WordPress - full-res URLs (same as /reviews, 2019/08)
const STATIC_BASE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'
const TESTIMONIALS = [
  {
    quote: "Thank you for the follow-up email about the snap tool. I should have taken a picture during the winter. We had one of the worst winters on record in Maryland. We were able to use our porch all winter long because of the protection and insulation the vinyl Mosquito Curtains provide.",
    author: "Amy & David",
    location: "Maui",
    image: `${STATIC_BASE}/2019/08/Hawaii-Porch-Screen.jpg`,
  },
  {
    quote: "Here is a night shot of the curtains you sent to us last week. Covering the entire courtyard opening had the effect that I wanted and made it a cozy area for guests at dinner. We are once again very happy, satisfied customers of Mosquito Curtains.",
    author: "Bill",
    location: "Wisconsin",
    image: `${STATIC_BASE}/2019/08/Screen-Porch-1.jpg`,
  },
  {
    quote: "We just installed our curtains on a section of our porch and are very pleased. Installation went well, we were very pleased. We have used our porch more in the past week than we did all last summer. Love it!",
    author: "Eric",
    location: "Prince Edward Island",
    image: `${STATIC_BASE}/2019/08/Canadian-Porch.jpg`,
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
            TESTIMONIALS
            ================================================================ */}
        <HeaderBarSection icon={Bug} label="92,000+ Happy Clients Since 2004" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} variant="elevated" className="!p-6">
                <Stack gap="md">
                  <Frame ratio="16/9" className="rounded-lg overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.author}'s project`}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Text className="text-gray-600 italic text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </Text>
                  <Text className="font-semibold text-[#406517] !mb-0">
                    {testimonial.author} | {testimonial.location}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="outline" asChild>
              <Link href="/reviews">
                Read More Reviews
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            QUICK TESTIMONIAL CARDS
            ================================================================ */}
        <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
          <Card className="!p-4">
            <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/White-Porch-Curtains-1.jpg"
                alt="White porch curtains"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Text className="text-xs text-gray-600 italic">
              "We love the curtains. Everyone was sooo helpful and installing was trouble-free."
            </Text>
          </Card>
          <Card className="!p-4">
            <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Shade-Fabric-Porch.jpg"
                alt="Shade fabric porch"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Text className="text-xs text-gray-600 italic">
              "Could not be happier! What a great product. Top quality materials, superior customer service."
            </Text>
          </Card>
          <Card className="!p-4">
            <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen.jpg"
                alt="Garage screen"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Text className="text-xs text-gray-600 italic">
              "I have just come in from our bug free carport to thank you again for the Mosquito Curtain."
            </Text>
          </Card>
          <Card className="!p-4">
            <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Shade-Fabric.jpg"
                alt="Shade fabric"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Text className="text-xs text-gray-600 italic">
              "Thank you for a great product. We have been able to re-claim our porch in the evenings."
            </Text>
          </Card>
        </Grid>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
