'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Camera,
  Bug,
  Snowflake,
  Home,
  TreePine,
, Info} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Heading,
  Frame,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
, Card, TwoColumn} from '@/lib/design-system'

// Photo galleries
const GALLERY_SECTIONS = [
  {
    id: 'porches',
    icon: Home,
    label: 'Screened Porches',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Screened porch with mosquito netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Mosquito curtains on porch' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Screen porch enclosure' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Porch mosquito screen' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Custom porch curtains' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Insect screen porch' },
    ]
  },
  {
    id: 'gazebos',
    icon: TreePine,
    label: 'Gazebos & Pergolas',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Yardistry-Gazebo-Screen.jpg', alt: 'Yardistry gazebo with screens' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola screen installation' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo mosquito netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Outdoor structure screening' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola netting' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Yardistry-Gazebo-Screen.jpg', alt: 'Custom gazebo screens' },
    ]
  },
  {
    id: 'mosquito',
    icon: Bug,
    label: 'Mosquito Curtain Projects',
    images: [
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Mosquito curtain installation' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Black mesh curtains' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'White netting project' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Screen patio enclosure' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg', alt: 'Patio screen project' },
      { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Custom mosquito curtains' },
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
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Photos Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/kurt-square-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/matt-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Heather-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/John-Hubay-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/08/Iryna-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Patrick-Jordan-150x150.jpg"
                  alt="Photos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Submit photos to our team!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We have shipped over 92,084 custom orders to people all over the world! We are happy to help you plan your project. Please appreciate that efficiency enables us to keep prices down. Clients who submit proper photos get first priority! Once your photos are submitted using the form below, we will contact you for a planning session where we draw on your photos as you watch and answer all of your questions.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="These Are Good Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? Because we can see all fastening surfaces of the entire project in each high resolution photo.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                alt="These Are Good Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="These Are Bad Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? Because they are too close up we can’t see ALL fastening surfaces and corner transitions.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                alt="These Are Bad Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="The Planning Team" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Aaron Gorecki

Kurt Jordan

Matt Rier

Heather Evans

John Hubay

Iryna Mardanova

Patrick Jordan
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                alt="The Planning Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Need help before submitting photos?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are here to help. Give us a call and one of our planners will gladly assist you.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
