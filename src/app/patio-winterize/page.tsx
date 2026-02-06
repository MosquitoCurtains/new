'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  ThermometerSun,
  Sun,
  CheckCircle,
Camera, Info} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  Frame,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  WhyChooseUsTemplate,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
TwoColumn} from '@/lib/design-system'

export default function PatioWinterizePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Winterize Your Patio"
          subtitle="Transform your covered patio into year-round living space with clear vinyl enclosures. Block the cold while keeping the view."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Benefits */}
        <HeaderBarSection icon={Snowflake} label="Why Winterize Your Patio?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Winter-Patio.jpg"
                alt="Winterized patio with clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Your covered patio has a roof - all it needs is walls to become usable 
                year-round. Clear vinyl provides weather protection without blocking 
                your outdoor views.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Add usable square footage</ListItem>
                <ListItem variant="checked" iconColor="#003365">Keep wind and rain out</ListItem>
                <ListItem variant="checked" iconColor="#003365">Enjoy your patio in any season</ListItem>
                <ListItem variant="checked" iconColor="#003365">Remove panels for summer</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Patio vs Porch */}
        <HeaderBarSection icon={Sun} label="Patios vs Porches" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
              Whether you call it a patio or porch, if you have a covered outdoor space 
              with open sides, we can enclose it. The process is the same.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Attached to House</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Screened porches</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Covered patios</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Sunrooms</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Lanais</ListItem>
                </BulletedList>
              </Stack>
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Freestanding</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Gazebos</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pergolas</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pavilions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pool houses</ListItem>
                </BulletedList>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What To Expect */}
        <HeaderBarSection icon={ThermometerSun} label="Temperature Expectations" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Wind Blocking</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Clear vinyl stops cold wind, instantly making your patio more comfortable.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">10-20° Warmer</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Without supplemental heat, expect 10-20 degrees of wind-chill protection.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Add Heat</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                With a small portable heater, your patio becomes comfortable all winter.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Winterize Your Patio?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for clear vinyl enclosures and extend your outdoor living season.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get Clear Vinyl Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Patio Winterize Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Clear-Vinyl-1481-1024x1024.jpg"
                  alt="Clear Plastic Porch Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Curtain-Vinyl-Interchangeable-2410-1024x1024.jpg"
                  alt="Clear Vinyl Porch Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Gazebo-CV-1745-1024x1024.jpg"
                  alt="Patio Winterize"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                  alt="Patio Winterize"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg"
                  alt="Patio Winterize"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-1-1200-768x576.jpg"
                  alt="Mosquito Netting Mesh Curtains are interchangeable with Clear Vinyl Winter Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-1-1200-768x576.jpg"
                  alt="Clear Vinyl Plastic Porch Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-1-768x576.jpg"
                  alt="Patio Winterize"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
                  alt="Patio Winterize"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Bar-2-200x117-1.jpg"
                  alt="Clear Plastic Patio Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg"
                  alt="Garage Screen Door"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1-300x225.jpg"
                  alt="Shade Fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Clear-Vinyl-1481-1024x1024.jpg"
            alt="Clear Plastic Porch Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Curtain-Vinyl-Interchangeable-2410-1024x1024.jpg"
            alt="Clear Vinyl Porch Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Gazebo-CV-1745-1024x1024.jpg"
            alt="$2,410.00 + Shipping"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Why Enclose Patio for Winter?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are you wasting usable living space in your own home? Think about the possibilities if that porch or patio wasn’t so cold in the winter. A cozy dinner outside, board games with the kids, a hangout for football games, or maybe just a good smooch on a porch swing during a snow storm. Time is precious. Perhaps you can connect with your family the old-fashioned way… just outside your own door.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Winter Patio Panels Interchangeable With Our Summer Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you to enjoy family time just outside your own home. Best of all, the two products are entirely removable & interchangeable such that you can swap them out in the Spring and Fall. Winterize your patio during the cold months with insect protection during warmer months. We designed an easy to self-install product perfect as an afternoon family project that you will all later enjoy, together! Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                alt="Winter Patio Panels Interchangeable With Our Summer Mosquito Curtains"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg"
            alt="Summer Insect Panels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-1-1200-768x576.jpg"
            alt="Mosquito Netting Mesh Curtains are interchangeable with Clear Vinyl Winter Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-1-1200-768x576.jpg"
            alt="Clear Vinyl Plastic Porch Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-1-768x576.jpg"
            alt="Winter Weather Panels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
            alt="Summer Insect Panels"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-1.jpg"
            alt="Plastic Patio Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-4.jpg"
            alt="Clear Vinyl Plastic Patio Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Plastic Enclosure Panels to Winterize Patio" variant="dark">
          <Stack gap="md">
              <Text className="text-gray-600">Protect your porch or patio from old wind, rain, snow or spring pollen with custom-made Clear Vinyl Plastic Enclosures. Used in conjunction with a space heater, our plastic porch enclosures will create a cozy outdoor space while protecting your porch from the damaging elements. Weatherproof your Patio Today!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="All Weather Patio Enclosure Curtains" variant="dark">
          <Stack gap="md">
              <Text className="text-gray-600">Are custom-made with marine-grade quality materials for an affordable all-weather outdoor space. Waterproof all weather plastic curtains will protect you, your family pets, and plants from frosty winter weather. Great for weather-proofing existing screen porches & patios!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
