'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Sun,
  Shield,
  Wrench,
  Package,
  Eye,
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

export default function RollUpShadeScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Roll Up Shade Screens"
          subtitle="Custom roll-up shade screens to knock the harsh sun off any area. Single or double-ply options with our durable, fade-resistant shade mesh made to last."
          videoId="T_H3cQCINhs"
          videoTitle="Roll Up Shade Screens Overview"
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
        
        {/* Section 1: Roll Up Shade Screens Overview */}
        <HeaderBarSection icon={Sun} label="Custom Roll Up Shade Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Roll Up Shade Screens are a great option to knock the harsh sun off of any area. These can be 
                made single-ply or double-ply according to your preference. Our Shade Mesh is our own durable 
                recipe made to last and will not fade.
              </Text>
              <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="py-4">
                <div className="text-center">
                  <Text className="text-sm font-semibold text-gray-700">Custom Screens</Text>
                  <Text className="text-xs text-gray-500">Made to your exact size</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-semibold text-gray-700">Delivered Fast</Text>
                  <Text className="text-xs text-gray-500">6-10 business days</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-semibold text-gray-700">High Quality</Text>
                  <Text className="text-xs text-gray-500">Marine-grade materials</Text>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-semibold text-gray-700">DIY Install</Text>
                  <Text className="text-xs text-gray-500">Simple tools only</Text>
                </div>
              </Grid>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Single-ply or double-ply options</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available in Black or White</ListItem>
                <ListItem variant="checked" iconColor="#406517">Incredibly strong shade mesh that won't fade</ListItem>
                <ListItem variant="checked" iconColor="#406517">Easy DIY installation in an afternoon</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="T_H3cQCINhs"
              title="Roll Up Shade Screens"
              variant="card"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Privacy & Visibility */}
        <HeaderBarSection icon={Eye} label="Privacy & Visibility" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Clear-Looking-Out.jpg"
                  alt="Clear looking out through shade screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Privacy-Looking-In.jpg"
                  alt="Privacy looking in through shade screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600 text-lg font-medium">
                See Out, Stay Private
              </Text>
              <Text className="text-gray-600">
                Our shade screens provide excellent visibility when looking out while maintaining privacy from 
                the outside looking in. This makes them perfect for patios, porches, and outdoor living spaces 
                where you want sun protection without sacrificing your view.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Clear visibility looking out</ListItem>
                <ListItem variant="checked" iconColor="#406517">Privacy from outside looking in</ListItem>
                <ListItem variant="checked" iconColor="#406517">Blocks harsh sun while maintaining airflow</ListItem>
                <ListItem variant="checked" iconColor="#406517">Incredibly strong shade mesh material</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 3: What's Included */}
        <HeaderBarSection icon={Package} label="Completing Your Project" variant="dark">
          <TwoColumn gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-lg font-semibold text-[#406517]">We Supply:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Roll of 1/4" Paracord (1)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Boat Cleat (1)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Eye Screws (3)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Elastic Cord with clips and 2 D-Rings to secure bottom</ListItem>
                <ListItem variant="checked" iconColor="#406517">Adhesive Velcro</ListItem>
                <ListItem variant="checked" iconColor="#406517">Custom Sized Shade Panel with top grommets and bottom rod pocket</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Text className="text-lg font-semibold text-[#003365]">You Buy Locally:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">1 inch schedule 40 PVC tube (1)</ListItem>
              </BulletedList>
              <Text className="text-sm text-gray-500 mt-4">
                That's it! We provide everything else you need for a complete installation.
              </Text>
              <div className="pt-4">
                <Button variant="primary" asChild>
                  <Link href="/work-with-a-planner">
                    Work With A Planner
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 4: Quality & Durability */}
        <HeaderBarSection icon={Shield} label="Quality & Durability" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our shade mesh is our own proprietary recipe, designed specifically for outdoor durability. 
                Unlike cheap alternatives that fade after one season, our solution-dyed materials maintain 
                their color year after year.
              </Text>
              <Text className="text-gray-600">
                The mesh is incredibly strong - strong enough to support significant weight without tearing. 
                Combined with our marine-grade hardware and UV-protected thread, you get a product that's 
                truly built to last.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Proprietary fade-resistant recipe</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution-dyed for lasting color</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine-grade attachment hardware</ListItem>
                <ListItem variant="checked" iconColor="#406517">UV-protected threading throughout</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Frame ratio="1/1" className="rounded-2xl overflow-hidden max-w-md mx-auto">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Strong-Shade-Mesh.jpg"
                  alt="Incredibly strong shade mesh"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <YouTubeEmbed
                videoId="WOLgWm9UMq4"
                title="Raw Netting Materials Overview"
                variant="card"
              />
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
