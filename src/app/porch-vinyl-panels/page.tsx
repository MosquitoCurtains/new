'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Square,
  Shield,
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

export default function PorchVinylPanelsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Porch Vinyl Panels"
          subtitle="Custom clear vinyl panels for your porch. Weather protection that doesn't block your view. Marine-grade quality built to last."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* What Are Vinyl Panels */}
        <HeaderBarSection icon={Square} label="What Are Porch Vinyl Panels?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Vinyl-Panels.jpg"
                alt="Clear vinyl panels on porch"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Porch vinyl panels are clear, flexible panels made from marine-grade vinyl that 
                cover the open areas of your porch. They provide weather protection while 
                maintaining your view.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">30-gauge marine-grade vinyl</ListItem>
                <ListItem variant="checked" iconColor="#003365">Crystal clear for unobstructed views</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-fitted to your porch</ListItem>
                <ListItem variant="checked" iconColor="#003365">Removable for warm weather</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Features */}
        <HeaderBarSection icon={Shield} label="Panel Features" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">UV Protected</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                UV inhibitors prevent yellowing and keep panels crystal clear for years.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Zippered Doorways</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Easy entry and exit through zippered sections in your panels.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Sunbrella Borders</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Professional fabric borders in your choice of colors for a finished look.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How They Attach */}
        <HeaderBarSection icon={CheckCircle} label="Attachment Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Snap Attachment</Heading>
              <Text className="text-gray-600 mb-4">
                DOT snaps attach panels to your porch structure. Easy on/off for 
                seasonal use.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Quick removal</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Secure attachment</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Marine-grade hardware</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Zipper Connection</Heading>
              <Text className="text-gray-600 mb-4">
                Panels zip together at the corners for a continuous weather seal 
                around your porch.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Weather-tight seal</ListItem>
                <ListItem variant="arrow" iconColor="#003365">YKK marine zippers</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Professional finish</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Get Custom Vinyl Panels</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Every panel is custom-made to fit your porch exactly. Get a quote today.
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
        <HeaderBarSection icon={Camera} label="Porch Vinyl Panels Gallery" variant="blue">
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
                  alt="Porch Vinyl Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                  alt="Porch Vinyl Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg"
                  alt="Porch Vinyl Panels"
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
                  alt="Porch Vinyl Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
                  alt="Porch Vinyl Panels"
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
        <HeaderBarSection icon={Info} label="Clear Vinyl Porch Panel Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are you wasting usable living space in your own home? Think about the possibilities if that porch or patio wasn’t so cold in the winter. A cozy dinner outside, board games with the kids, a hangout for football games, or maybe just a good smooch on a porch swing during a snow storm. Time is precious. Perhaps you can connect with your family the old-fashioned way… just outside your own door.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Panels Are Interchangeable With Our Summer Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Porch Panels that will enable you to enjoy family time just outside your own home. Best of all, the two products are entirely removable & interchangeable such that you can swap them out in the Spring and Fall. We designed an easy to self-install product perfect as an afternoon family project that you will all later enjoy, together! Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                alt="Clear Vinyl Panels Are Interchangeable With Our Summer Mosquito Curtains"
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
        <HeaderBarSection icon={Info} label="Plastic Vinyl Enclosure Panels For Screened and Unscreened Porches" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Protect your porch or patio from old wind, rain, snow or spring pollen with custom-made Clear Vinyl Plastic Porch Panels. Used in conjunction with a space heater, our plastic porch enclosures will create a cozy outdoor space while protecting your porch from the damaging elements. Weatherproof your Porch Today!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="All Weather Porch Enclosure Panels" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are custom-made with marine-grade quality materials for an affordable all-weather outdoor space. Waterproof vinyl Porch panels will protect you from wind rain and snow. Great for weather-proofing existing screen porches & patios!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
