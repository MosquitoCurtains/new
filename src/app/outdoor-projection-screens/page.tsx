'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Monitor,
  Palette,
  Wrench,
  Ghost,
  Maximize,
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
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

export default function OutdoorProjectionScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Giant Projection Screens"
          subtitle="Custom outdoor projection screens made from marine-grade materials. Weatherproof, affordable, and available in ANY size. Perfect for backyard movies, events, and Halloween displays."
          videoId="FqNe9pDsZ8M"
          videoTitle="Projection Screens Overview"
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
        
        {/* Section 1: Your Projection Screen Choices */}
        <HeaderBarSection icon={Monitor} label="Your Projection Screen Choices" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                There are a variety of outdoor projection screens on the market. Ours is made from marine-grade 
                materials made to get wet, can be hung from any overhead surface or improvised frame, is easy 
                to use, and is VERY affordable.
              </Text>
              <Text className="text-gray-600 font-semibold">
                We can make ANY size. As an example, 18ft wide x 10ft tall = $315.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="x" iconColor="#D03739">Inflatables - pricey, bulky, stinky and LOUD (air blower)</ListItem>
                <ListItem variant="x" iconColor="#D03739">Screens with embedded Frame - not weatherproof if storm comes</ListItem>
                <ListItem variant="checked" iconColor="#406517">Our Screens - inexpensive, convenient, made to get wet!</ListItem>
                <ListItem variant="checked" iconColor="#406517">Hang from any overhead surface, between trees, or simple frames</ListItem>
                <ListItem variant="checked" iconColor="#406517">Sometimes simple, using marine quality materials, is best!</ListItem>
              </BulletedList>
            </Stack>
            <Grid responsiveCols={{ mobile: 1, tablet: 1 }} gap="md">
              <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Garage-Projection-Screen.jpg"
                  alt="Amazing resolution on garage projection"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Poolside-Movie.jpg"
                    alt="Poolside movie at dusk"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Projected-Art-Show.jpg"
                    alt="Groovy music and projected art show"
                    className="w-full h-full object-cover"
                  />
                </Frame>
              </Grid>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Projection Screen Colors */}
        <HeaderBarSection icon={Palette} label="Projection Screen Colors" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Imagine a giant, high-resolution, dense mesh sheet (for wind) made of an outdoor marine-grade 
              polyester, bound on all sides and prepared with Velcro or Grommets to your specifications. 
              We decided to focus on the quality of our outdoor projection screen material and offer flexible 
              rigging techniques.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg" className="pt-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4 bg-white">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/White-Projection-Screen.jpg"
                    alt="White projection screen"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-xl font-bold mb-2">White</Text>
                <Text className="text-sm text-gray-600">
                  As good as resolution gets for traditional movie projection. Used primarily for outdoor screens.
                </Text>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4 bg-gray-200">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Silver-Theater-Scrim.jpg"
                    alt="Silver theater scrim"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-xl font-bold mb-2">Silver</Text>
                <Text className="text-sm text-gray-600">
                  Some people prefer silver scrim in a theater/movie room. Still can be used outdoors, very close to white.
                </Text>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4 bg-gray-900">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Black-Projection-Screen.jpg"
                    alt="Black projection screen"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-xl font-bold mb-2">Black</Text>
                <Text className="text-sm text-gray-600">
                  Less visible when not projecting. Often used in night clubs for an eerie ghostly effect. Great for light shows.
                </Text>
              </div>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Section 3: Rigging Ideas */}
        <HeaderBarSection icon={Wrench} label="Rigging Ideas For Projection Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                As much as possible, we want to rig your projection screen from some existing overhead surface 
                if there is one. If you don't have an overhead frame, we'll help with creative ideas like:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">A simple PVC Frame</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tethered vertical posts (like improvised volleyball nets)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Strung between two trees</ListItem>
                <ListItem variant="checked" iconColor="#406517">Whatever happens to be available in your outdoor space</ListItem>
              </BulletedList>
              <Text className="text-gray-600">
                If you would like to conveniently roll up your outdoor projection screen and leave it outside, 
                we will explain how.
              </Text>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Discuss Rigging Options
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/PVC-Frame-Projection.jpg"
                  alt="20x10 PVC Frame for projection"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/200-Sqft-Screen.jpg"
                  alt="Watch games on 200 sq ft screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 4: Halloween Projection Screens */}
        <HeaderBarSection icon={Ghost} label="Halloween Projection Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Halloween-Projection.jpg"
                alt="Halloween projection screen display"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Lighting has everything to do with creating the right effect. Images can be viewed from either 
                side of the mesh with nearly equal resolution. The resolution depends upon:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#8B5CF6">Mesh Color (black vs white for different effects)</ListItem>
                <ListItem variant="arrow" iconColor="#8B5CF6">Size of desired image</ListItem>
                <ListItem variant="arrow" iconColor="#8B5CF6">Projector Lumens (we used 3200 lumens)</ListItem>
                <ListItem variant="arrow" iconColor="#8B5CF6">Ambient (surrounding) light</ListItem>
                <ListItem variant="arrow" iconColor="#8B5CF6">How close projector must be ("projector throw")</ListItem>
              </BulletedList>
              <Text className="text-gray-600 text-sm">
                A shorter throw puts out better resolution. Black creates an eerie ghostly effect while white 
                provides maximum brightness.
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 5: 3D Mapping */}
        <HeaderBarSection icon={Maximize} label="3D Mapping Projection Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                There is a relatively new technology called 3D mapping that uses many projectors to create a 
                3-dimensional effect. Our Largest 3D-projection to date was 70ft wide x 40ft tall.
              </Text>
              <Text className="text-gray-600 font-semibold">
                Our point here is that we are not limited by size or rigging techniques to support large screens.
              </Text>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Contact Our Planning Team
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <div className="bg-[#406517]/5 border-2 border-[#406517]/20 rounded-2xl p-8">
              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
                <div className="text-center">
                  <Text className="text-3xl font-bold text-[#406517]">$387</Text>
                  <Text className="text-sm text-gray-600">+ Shipping</Text>
                  <Text className="text-xs text-gray-500 mt-1">Example Size</Text>
                </div>
                <div className="text-center">
                  <Text className="text-3xl font-bold text-[#406517]">$554</Text>
                  <Text className="text-sm text-gray-600">+ Shipping</Text>
                  <Text className="text-xs text-gray-500 mt-1">Example Size</Text>
                </div>
                <div className="text-center">
                  <Text className="text-3xl font-bold text-[#406517]">$2,143</Text>
                  <Text className="text-sm text-gray-600">+ Shipping</Text>
                  <Text className="text-xs text-gray-500 mt-1">Large Format</Text>
                </div>
              </Grid>
            </div>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
