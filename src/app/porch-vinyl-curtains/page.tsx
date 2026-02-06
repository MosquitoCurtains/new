'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Square,
  Shield,
  CheckCircle,
, Camera, Info} from 'lucide-react'
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
, TwoColumn} from '@/lib/design-system'

export default function PorchVinylCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Porch Vinyl Curtains"
          subtitle="Heavy-duty clear vinyl curtains for your porch. Block wind, rain, and cold while maintaining your view. Custom-made to fit your space perfectly."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* What Are Vinyl Curtains */}
        <HeaderBarSection icon={Square} label="What Are Porch Vinyl Curtains?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Vinyl-Curtains.jpg"
                alt="Clear vinyl curtains on porch"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Porch vinyl curtains are flexible clear panels that hang from your porch 
                ceiling or roof line. They can be rolled up or down depending on the weather.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">30-gauge marine-grade vinyl</ListItem>
                <ListItem variant="checked" iconColor="#003365">Roll up when not needed</ListItem>
                <ListItem variant="checked" iconColor="#003365">Blocks wind, rain, and cold</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-made to your dimensions</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Curtains vs Panels */}
        <HeaderBarSection icon={CheckCircle} label="Curtains vs Panels" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#003365]">Vinyl Curtains</Heading>
              <Text className="text-gray-600 mb-4">
                Hang from tracking or velcro at the top. Can be rolled up and secured 
                when not in use.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Roll up for storage</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Quick deployment</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Stays in place year-round</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#003365]">Vinyl Panels</Heading>
              <Text className="text-gray-600 mb-4">
                Snap or zip in place. Removed entirely and stored flat during off-season.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Completely removable</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Store flat</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Seasonal installation</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Features */}
        <HeaderBarSection icon={Shield} label="Quality Features" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">UV Protected</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Won't yellow</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Crystal Clear</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Unobstructed view</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Marine Grade</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Built to last</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Custom Fit</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Made for you</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Get Custom Vinyl Curtains</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Every curtain is custom-made to fit your porch exactly. Get a quote today.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Porch Vinyl Curtains Gallery" variant="blue">
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
                  alt="Porch Vinyl Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                  alt="Porch Vinyl Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg"
                  alt="Porch Vinyl Curtains"
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
                  alt="Porch Vinyl Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
                  alt="Porch Vinyl Curtains"
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
        <HeaderBarSection icon={Info} label="Clear Vinyl Plastic Porch Curtains" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are you wasting usable living space in your own home? Think about the possibilities if that porch or patio wasn’t so cold in the winter. A cozy dinner outside, board games with the kids, a hangout for football games, or maybe just a good smooch on a porch swing during a snow storm. Time is precious. Perhaps you can connect with your family the old-fashioned way… just outside your own door.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Curtains Interchangeable With Our Summer Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you to enjoy family time just outside your own home. Best of all, the two products are entirely removable & interchangeable such that you can swap them out in the Spring and Fall. Roll up Clear Vinyl Curtains or push to one side. We designed an easy to self-install product perfect as an afternoon family project that you will all later enjoy, together! Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                alt="Clear Vinyl Curtains Interchangeable With Our Summer Mosquito Curtains"
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
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Bar-2-200x117-1.jpg"
            alt="Clear Plastic Patio Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-3.jpg"
            alt="Clear vinyl Patio Enclosures"
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
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-6.jpg"
            alt="Clear Plastic Enclosures for Patio"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-5.jpg"
            alt="Winter Patio Enclosures"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Clear Vinyl Plastic Enclosure Curtains For Porch" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Protect your porch or patio from old wind, rain, snow or spring pollen with custom-made Clear Vinyl Outdoor Curtains. Used in conjunction with a space heater, our plastic porch enclosures will create a cozy outdoor space while protecting your porch from the damaging elements. Weatherproof your Porch Today!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="All Weather Porch Enclosure Curtains" variant="dark">
          <Stack gap="md">
              <Text className="text-gray-600">Are custom-made with marine-grade quality materials for an affordable all-weather outdoor space. Waterproof all weather plastic curtains will protect you, your family pets, and plants from frosty winter weather. Great for weather-proofing existing screen porches & patios!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
