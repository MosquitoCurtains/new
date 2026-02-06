'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ThermometerSun,
  Shield,
  AlertCircle,
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

export default function InsulatedCurtainPanelsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Insulated Curtain Panels"
          subtitle="Looking for insulated outdoor panels? Our clear vinyl enclosures provide excellent weather protection for your porch or patio."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Important Note */}
        <HeaderBarSection icon={AlertCircle} label="Important: About Insulation" variant="dark">
          <Card className="!p-6 !bg-amber-50 !border-amber-200">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={4} className="!text-amber-800">An Honest Note About Insulation</Heading>
                <Text className="text-amber-900">
                  While we don't sell traditional "insulated" panels with foam cores, our 
                  clear vinyl enclosures provide significant weather protection by blocking 
                  wind and creating a barrier against the elements.
                </Text>
                <Text className="text-amber-900 !mb-0">
                  For true thermal insulation, you'd need rigid panels or construction-grade 
                  windows. Our clear vinyl is designed for weather protection and extending 
                  your outdoor season - not replacing walls.
                </Text>
              </Stack>
              <BulletedList spacing="md">
                <ListItem variant="arrow" iconColor="#92400e">Blocks wind and wind chill</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Keeps rain and snow out</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Creates 10-20°F improvement</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Works great with portable heaters</ListItem>
              </BulletedList>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What We Offer */}
        <HeaderBarSection icon={Shield} label="What We Do Offer" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Winter.jpg"
                alt="Clear vinyl enclosure in winter"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our clear vinyl enclosures are the perfect solution for extending your 
                outdoor living season. Here's what they provide:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Wind blocking</ListItem>
                <ListItem variant="checked" iconColor="#003365">Rain and snow protection</ListItem>
                <ListItem variant="checked" iconColor="#003365">Clear, unobstructed views</ListItem>
                <ListItem variant="checked" iconColor="#003365">Easy installation and removal</ListItem>
                <ListItem variant="checked" iconColor="#003365">Year-round use with small heater</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <HeaderBarSection icon={ThermometerSun} label="How Clear Vinyl Helps" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Wind Barrier</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Stops cold wind from blowing through. This alone can make a 20°F difference 
                in perceived temperature.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ThermometerSun className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Solar Heat Gain</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Clear vinyl lets sunlight in, which warms the enclosed space naturally 
                during sunny days.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Heat Retention</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Add a small portable heater and the enclosed space retains heat effectively 
                for comfortable use.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* The Right Solution */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Is Clear Vinyl Right For You?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Stack gap="md">
              <Text className="font-semibold text-green-700">Clear Vinyl IS Great For:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#15803d">Extending outdoor season</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Wind and rain protection</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Maintaining your view</ListItem>
                <ListItem variant="checked" iconColor="#15803d">DIY installation</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Seasonal use with portable heat</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Text className="font-semibold text-red-700">Clear Vinyl Is NOT For:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#b91c1c">True thermal insulation (R-value)</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Replacing windows or walls</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Heated living space conversion</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Energy-efficient enclosures</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready for Weather Protection?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for clear vinyl enclosures and extend your outdoor season.
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
        <HeaderBarSection icon={Camera} label="Insulated Curtain Panels Gallery" variant="blue">
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
                  alt="Insulated Curtain Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                  alt="Insulated Curtain Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg"
                  alt="Insulated Curtain Panels"
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
                  alt="Insulated Curtain Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
                  alt="Insulated Curtain Panels"
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
        <HeaderBarSection icon={Info} label="Clear Vinyl Plastic Porch Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are you wasting usable living space in your own home? Think about the possibilities if that porch or patio wasn’t so cold in the winter. A cozy dinner outside, board games with the kids, a hangout for football games, or maybe just a good smooch on a porch swing during a snow storm. Time is precious. Perhaps you can connect with your family the old-fashioned way… just outside your own door.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Plastic Enclosures Interchangeable With Our Summer Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you to enjoy family time just outside your own home. Best of all, the two products are entirely removable & interchangeable such that you can swap them out in the Spring and Fall. We designed an easy to self-install product perfect as an afternoon family project that you will all later enjoy, together! Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                alt="Plastic Enclosures Interchangeable With Our Summer Mosquito Curtains"
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
        <HeaderBarSection icon={Info} label="Plastic Enclosure Curtains to Insulate Patio" variant="dark">
          <Stack gap="md">
              <Text className="text-gray-600">Insulate your porch or patio from old wind, rain, snow or spring pollen with custom-made Clear Vinyl Plastic Enclosures. Used in conjunction with a space heater, our plastic porch enclosures will insulate your outdoor space while protecting your porch from the damaging elements. Weatherproof your Patio Today!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="All Weather Insulated Porch Enclosures" variant="dark">
          <Stack gap="md">
              <Text className="text-gray-600">Are custom-made with marine-grade quality materials for an affordable all-weather outdoor space. Waterproof all-weather plastic curtains will protect you, your family pets, and plants from frosty winter weather. Great for weather-proofing existing screen porches & patios!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
