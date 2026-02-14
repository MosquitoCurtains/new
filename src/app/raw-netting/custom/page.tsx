'use client'

import Link from 'next/link'
import { ArrowRight, Scissors, ShieldCheck, Bug, Layers, Wrench } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  TwoColumn,
  Frame,
  Text,
  Button,
  Card,
  Heading,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  RN_HERO_ACTIONS,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

export default function CustomNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Let Us Make It For You"
          subtitle="Not everyone is a DIY person. We custom-make finished netting panels to your exact measurements. Hemmed edges, grommets, marine snaps, velcro -- whatever you need. We've done tens of thousands of custom projects since 2003."
          videoId={VIDEOS.CUSTOM_NETTING}
          videoTitle="Custom Netting Orders"
          variant="compact"
          actions={RN_HERO_ACTIONS}
        />

        {/* What We Do */}
        <HeaderBarSection icon={Scissors} label="What We Custom Make" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/09/Massive-Fabric-Rolls.jpg`}
                alt="Massive rolls of raw netting ready for custom fabrication"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We're manufacturers -- not just a retailer. We custom-make thousands of netting 
                panels every year for customers who want a ready-to-hang solution. Tell us your 
                measurements and how you want to attach it, and we'll fabricate it for you.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Custom cut to your exact measurements</ListItem>
                <ListItem variant="checked" iconColor="#406517">Hemmed edges (sewn, not raw)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Grommets installed at your spacing</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine snaps attached -- ready to snap on</ListItem>
                <ListItem variant="checked" iconColor="#406517">Velcro attachment option</ListItem>
                <ListItem variant="checked" iconColor="#406517">Multiple panels sewn together for larger areas</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Project Types */}
        <HeaderBarSection icon={Layers} label="Popular Custom Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {[
              {
                title: 'Porch & Patio Panels',
                desc: 'Custom mosquito curtain panels with marine snaps for your porch, patio, or gazebo. Our core business.',
                link: '/screened-porch',
              },
              {
                title: 'Boat & Marine Netting',
                desc: 'Marine-grade netting custom fit for pontoon boats, sailboats, and dock areas.',
                link: '/boat-screens',
              },
              {
                title: 'Garage Door Screens',
                desc: 'Custom panels that fit your garage opening. Multiple attachment methods available.',
                link: '/garage-door-screens',
              },
              {
                title: 'French Door Screens',
                desc: 'Custom mosquito netting for french doors with magnetic closures.',
                link: '/french-door-screens',
              },
              {
                title: 'Industrial Enclosures',
                desc: 'Custom industrial mesh for loading docks, warehouses, and agricultural applications.',
                link: '/industrial-netting',
              },
              {
                title: 'Theatre Scrims',
                desc: 'Custom theatre scrim panels seamed to any size for stage productions and events.',
                link: '/theater-scrims',
              },
            ].map((project) => (
              <Link key={project.title} href={project.link} className="group block">
                <Card variant="elevated" className="h-full !p-5 hover:shadow-lg transition-shadow">
                  <Heading level={5} className="group-hover:text-[#406517] transition-colors !mb-2">
                    {project.title}
                  </Heading>
                  <Text size="sm" className="text-gray-600 !mb-2">{project.desc}</Text>
                  <span className="text-[#406517] text-sm font-medium inline-flex items-center">
                    Learn More <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <HeaderBarSection icon={Wrench} label="How It Works" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 4 }} gap="md">
            {[
              { step: '1', title: 'Send Measurements', desc: 'Provide width, height, and photos of your space.' },
              { step: '2', title: 'Choose Options', desc: 'Select mesh type, color, and attachment method.' },
              { step: '3', title: 'We Fabricate', desc: 'We custom-make your panels in our facility.' },
              { step: '4', title: 'Delivered Fast', desc: 'Shipped in 3-7 business days (US/CA).' },
            ].map((s) => (
              <Card key={s.step} variant="outlined" className="!p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#406517] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <Text className="font-bold text-gray-900 !mb-1">{s.title}</Text>
                <Text size="sm" className="text-gray-600 !mb-0">{s.desc}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Video */}
        <HeaderBarSection icon={Bug} label="Custom Netting Video" variant="dark">
          <div className="max-w-2xl mx-auto">
            <YouTubeEmbed videoId={VIDEOS.CUSTOM_NETTING} title="Custom Netting Orders" variant="card" />
          </div>
        </HeaderBarSection>

        {/* CTA */}
        <HeaderBarSection icon={ShieldCheck} label="Ready to Start?" variant="dark">
          <div className="text-center py-4">
            <Text className="text-gray-600 max-w-2xl mx-auto mb-4">
              Tell us about your project and we'll provide a quote. Photos are helpful but not 
              required. We've worked with tens of thousands of customers since 2003.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Start Your Project <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </HeaderBarSection>

        {/* Quick Links */}
        <HeaderBarSection icon={Bug} label="Raw Netting Store Quick Links" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/order-mesh-netting-fabrics" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">1. See All Meshes</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Several Mesh Types & Colors</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/rigging" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">2. Rigging Ideas</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Helpful Ideas & Attachment Items</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/hardware" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">3. Shop Hardware</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Snaps, Cord, Webbing & More</Text>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        <FinalCTATemplate 
          title="Ready to Order Your Fabric?"
          subtitle="Browse our full selection of raw mesh and netting fabric, or let us help you with a custom order."
          primaryCTAText="Shop Raw Netting"
          primaryCTALink="/order/raw-netting"
          variant="dark"
        />

      </Stack>
    </Container>
  )
}
