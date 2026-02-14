'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Home,
  Shield,
  Wrench,
  Maximize,
  CheckCircle,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

export default function YardistryGazeboCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Yardistry Gazebo Screens"
          subtitle="Custom-fitted mosquito netting curtains specifically designed for Yardistry gazebos. Marine-grade quality that won't fade, with designs that maximize your protected space."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            CONTENT SECTIONS
            ================================================================ */}
        
        {/* Section 1: Yardistry Gazebo Mosquito Netting */}
        <HeaderBarSection icon={Home} label="Yardistry Gazebo Mosquito Netting Curtains" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We have done a number of Yardistry Gazebo screen curtains. Clients prefer our curtains for 
                their lasting quality that will not fade. We also offer two designs to maximize your protected 
                space by an extra 50 sq ft.
              </Text>
              <Text className="text-gray-600">
                Yardistry Gazebo Curtains have two methods of attachment: a tracking option where curtains 
                slide from side to side and a less expensive fixed option that do not slide. Our Insect 
                Curtains are interchangeable with our Clear Vinyl Winter Panels for year-round usability.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Available in Black, Ivory, and White</ListItem>
                <ListItem variant="checked" iconColor="#406517">3 mesh types: Mosquito, No-see-um, and Shade Mesh</ListItem>
                <ListItem variant="checked" iconColor="#406517">Design takes a path OUTSIDE your columns to maximize space</ListItem>
                <ListItem variant="checked" iconColor="#406517">Interchangeable with Clear Vinyl Winter Panels</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Yardistry Gazebo Curtains Overview"
              variant="card"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Marine-Grade Strong */}
        <HeaderBarSection icon={Shield} label="Marine-Grade Strong Yardistry Gazebo Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg"
                  alt="Our mesh holds 240 LB man"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Typical-Cheap-Mesh.jpg"
                  alt="Typical cheap mesh comparison"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600">
                This is a very high-quality mosquito netting made from marine-grade materials. IN NO WAY 
                should you compare these to the cheap gazebo net kits you may have seen on aluminum gazebos 
                at home improvement stores that is tissue paper thin at 90 denier.
              </Text>
              <Text className="text-gray-600">
                You could jump off your roof and let the firemen catch you in our netting that is 450 denier 
                (thread weight). We use the same coloring process as Sunbrella so our materials do not fade.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">450 denier thread weight vs 90 denier cheap alternatives</ListItem>
                <ListItem variant="checked" iconColor="#406517">Strong enough to hold a 240 lb man</ListItem>
                <ListItem variant="checked" iconColor="#406517">Sunbrella-quality coloring process - won't fade</ListItem>
                <ListItem variant="checked" iconColor="#406517">Also available in no-see-um mesh and shade mesh</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 3: How to Get Started */}
        <HeaderBarSection icon={Wrench} label="How to Get Started" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600 text-lg font-medium">
                Get Started Fast With a Real Person!
              </Text>
              <Text className="text-gray-600">
                We are happy to help you plan your project with a quick planning session. For maximum speed 
                and efficiency, photos of your space are extremely helpful.
              </Text>
              <Text className="text-gray-600 font-semibold">
                Photo Guidelines:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Large file sizes - Small images do not provide enough resolution</ListItem>
                <ListItem variant="checked" iconColor="#406517">Step BACK and zoom OUT so we can see as much as possible</ListItem>
                <ListItem variant="checked" iconColor="#406517">Please provide 2-4 high resolution photos showing all sides</ListItem>
                <ListItem variant="checked" iconColor="#406517">No close-ups - we need to see complete sides with fastening surfaces</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Contact Us With Photos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Yardistry-Gazebo-Screen.jpg"
                alt="Yardistry Gazebo with Screen Curtains"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 4: Pricing Examples */}
        <HeaderBarSection icon={Maximize} label="Example Yardistry Gazebo Pricing" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center">
              Below are typical pricing examples for Yardistry Gazebo screen enclosures. Your exact price 
              depends on dimensions and options selected.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <div className="bg-white border-2 border-[#406517]/20 rounded-2xl p-6 text-center">
                <Text className="text-2xl font-bold text-[#406517] mb-2">$1,156 + Shipping</Text>
                <Text className="text-gray-600">12x12 Yardistry Gazebo</Text>
                <Text className="text-sm text-gray-500">Standard configuration with tracking</Text>
              </div>
              <div className="bg-white border-2 border-[#406517]/20 rounded-2xl p-6 text-center">
                <Text className="text-2xl font-bold text-[#406517] mb-2">$1,157 + Shipping</Text>
                <Text className="text-gray-600">12x14 Yardistry Gazebo</Text>
                <Text className="text-sm text-gray-500">Standard configuration with tracking</Text>
              </div>
            </Grid>
            <div className="flex justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Get Your Custom Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
