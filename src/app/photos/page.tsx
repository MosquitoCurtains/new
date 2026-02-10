'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Camera,
  Bug,
  Snowflake,
  Home,
  TreePine,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Heading,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  TwoColumn,
} from '@/lib/design-system'

// Photo galleries
const GALLERY_SECTIONS = [
  {
    id: 'porches',
    icon: Home,
    label: 'Screened Porches',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Screened porch with mosquito netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Mosquito curtains on porch' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Screen porch enclosure' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Porch mosquito screen' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Custom porch curtains' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Insect screen porch' },
    ]
  },
  {
    id: 'gazebos',
    icon: TreePine,
    label: 'Gazebos & Pergolas',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Yardistry-Gazebo-Screen.jpg', alt: 'Yardistry gazebo with screens' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Pergola screen installation' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Gazebo mosquito netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Outdoor structure screening' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Pergola netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Yardistry-Gazebo-Screen.jpg', alt: 'Custom gazebo screens' },
    ]
  },
  {
    id: 'mosquito',
    icon: Bug,
    label: 'Mosquito Curtain Projects',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Mosquito curtain installation' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Black mesh curtains' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'White netting project' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200.jpg', alt: 'Screen patio enclosure' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Patio screen project' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Custom mosquito curtains' },
    ]
  },
  {
    id: 'clear-vinyl',
    icon: Snowflake,
    label: 'Clear Vinyl Projects',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Clear vinyl enclosure' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-1.jpg', alt: 'Clear vinyl 3-sided' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-2.jpg', alt: 'Clear vinyl with kink' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-3.jpg', alt: 'Clear vinyl 4+ sides' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Tent-Panels.jpg', alt: 'Clear vinyl tent panels' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Quality.jpg', alt: 'Clear vinyl quality' },
    ]
  },
]

export default function PhotosPage() {
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
            <div className="w-16 h-16 bg-[#B30158]/10 rounded-full mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#B30158]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Photo Gallery
            </Heading>
            <Text className="text-xl text-gray-600">
              Browse through thousands of customer-installed projects for inspiration. 
              See what's possible with Mosquito Curtains.
            </Text>
            <Button variant="primary" asChild className="w-fit mx-auto">
              <Link href="/gallery">
                View Full Gallery
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Stack>
        </section>

        {/* ================================================================
            GALLERY SECTIONS
            ================================================================ */}
        {GALLERY_SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <HeaderBarSection key={section.id} icon={Icon} label={section.label} variant="dark">
              <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
                {section.images.map((img, idx) => (
                  <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden cursor-pointer group">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Frame>
                ))}
              </Grid>
              <div className="flex justify-center pt-6">
                <Button variant="outline" asChild>
                  <Link href={`/gallery/${section.id}`}>
                    See More {section.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </HeaderBarSection>
          )
        })}

        {/* ================================================================
            CTA
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Like What You See?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start your project today and join 92,000+ happy customers who transformed 
            their outdoor spaces with Mosquito Curtains.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/gallery">
                View Full Gallery
              </Link>
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

        <HeaderBarSection icon={Bug} label="Submit photos to our team!" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Clear-Plastic-Porch-Enclosure-With-No-Canvas-1200.jpg"
                alt="Clear Plastic Porch Enclosure With No Canvas"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We have shipped over 92,090 custom orders to people all over the world! We are happy to help you plan your project. Please appreciate that efficiency enables us to keep prices down. Clients who submit proper photos get first priority!
              </Text>
              <Text className="text-gray-600">
                Once your photos are submitted using the form below, we will contact you for a planning session where we draw on your photos as you watch and answer all of your questions.
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Bug} label="Photo Guidelines" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Please provide just 2-4 high resolution photos that show as much as possible in each frame</ListItem>
                <ListItem variant="checked" iconColor="#406517">Step BACK and zoom OUT so we can see as much as possible. No close-ups.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Large file sizes – Small images are impossible to use for planning sessions. (Each photo at least 500kb)</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/35-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Porch-1200.jpg"
                alt="Plastic Enclosure With Cocoa Brown Canvas Porch"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
