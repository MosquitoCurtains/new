'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Tent,
  Shield,
  Wrench,
  Snowflake,
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

export default function TentScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Tent Screen Enclosures"
          subtitle="Custom event tent screen panels made from marine-grade materials. Removable, washable, and built to last for years of outdoor events."
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
        
        {/* Section 1: Custom Event Tent Screen Panels */}
        <HeaderBarSection icon={Tent} label="Custom Event Tent Screen Panels" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                You don't just rent event tents, you rent an outdoor experience. If you have a tent that is 
                unusable because of annoying biting insects, we have a very affordable solution for you.
              </Text>
              <Text className="text-gray-600">
                Mosquito Curtains are a marine-grade quality product to create tent screen panels custom fitted 
                and made to last. We provide magnetic or zippered doorways for easy egress. Our custom curtains 
                are removable, washable and easily self-install in just a few hours.
              </Text>
              <Text className="text-gray-600 font-semibold">
                Typical cost for a 4-sided tent screen enclosure 20ft x 20ft x 9ft tall is less than $1,500.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Custom-fitted to your exact tent dimensions</ListItem>
                <ListItem variant="checked" iconColor="#406517">Magnetic or zippered doorways included</ListItem>
                <ListItem variant="checked" iconColor="#406517">Removable and machine washable</ListItem>
                <ListItem variant="checked" iconColor="#406517">Easy self-installation in a few hours</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Tent Screen Panels Overview"
              variant="card"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Interchangeable Clear Vinyl Winter Panels */}
        <HeaderBarSection icon={Snowflake} label="Interchangeable Clear Vinyl Winter Panels" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Tent-Panels.jpg"
                alt="Clear Vinyl Tent Panels"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Interchangeable with our Screen Enclosures, Clear Vinyl Plastic Tent Panels will winterize 
                your tent from cold, rain and snow. Similar to what is used in restaurants, our 20 mil thick 
                panels have the same attention to quality as our tent Screen Enclosures.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">20 mil thick clear vinyl</ListItem>
                <ListItem variant="checked" iconColor="#406517">Restaurant-grade quality</ListItem>
                <ListItem variant="checked" iconColor="#406517">Protection from cold, rain, and snow</ListItem>
                <ListItem variant="checked" iconColor="#406517">Interchangeable with screen panels</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/clear-vinyl-plastic-patio-enclosures">
                    Learn About Clear Vinyl
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 3: Why Choose Our Tent Screens */}
        <HeaderBarSection icon={Shield} label="Why Choose Our Tent Screens?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600 text-lg font-medium">
                We do things right, and it shows in the quality:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">
                  We add reinforcement prior to stitching so seams are stronger and more durable.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  We only use high quality Marine Grade mesh and thread that is more durable and will last longer.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Our attachment hardware is not clunky and complicated. It's much simpler to install and use.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Solution dyed materials that won't fade, even after years of outdoor use.
                </ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg"
                  alt="Durable mosquito netting holds 240lb man"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg"
                  alt="Quality screen sewing"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 4: Want to Just Rent? */}
        <HeaderBarSection icon={CheckCircle} label="Event Tent Rental Companies" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Event-Tent-Screen.jpg"
                alt="Event Tent with Screen Panels"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600 font-semibold">
                Want to Just Rent Tent Screen Panels?
              </Text>
              <Text className="text-gray-600">
                Unfortunately, we are not in the rental business, but here's an idea. Talk to your event tent 
                rental company who will purchase on your behalf and perhaps waive a screen rental fee for the 
                idea for a product they can offer to their future clients.
              </Text>
              <Text className="text-gray-600">
                After all, it is another opportunity for them to rent products that will fulfill the needs of 
                their good clients, like you!
              </Text>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us to Discuss
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
