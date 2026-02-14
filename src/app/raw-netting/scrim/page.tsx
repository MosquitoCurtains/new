'use client'

import Link from 'next/link'
import { ArrowRight, Theater, ShieldCheck, Scissors, Bug } from 'lucide-react'
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

export default function ScrimPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Marine Grade Quality Theatre Scrim Material"
          subtitle="Our shark tooth scrim is 100% polyester, suitable for outdoors and made to get wet. If needed, we can seam panels to make ANY size you desire. Available in white or silver."
          videoId={VIDEOS.THEATER_SCRIM}
          videoTitle="Theater Scrim Demo"
          variant="compact"
          actions={RN_HERO_ACTIONS}
        />

        {/* Product Details */}
        <HeaderBarSection icon={Theater} label="What Is Theatre Scrim?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/09/White-Sharks-tooth-Scrim-1200.jpg`}
                alt="White shark tooth theatre scrim material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Theatre scrim (also known as shark tooth scrim) has a unique optical property: 
                when lit from the front, it appears opaque. When lit from behind, it becomes 
                transparent, revealing what's behind it. This creates the classic theatrical 
                reveal effect.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Front-lit: appears opaque (hides what's behind)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Back-lit: becomes transparent (reveals what's behind)</ListItem>
                <ListItem variant="checked" iconColor="#406517">100% polyester, suitable for outdoors</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine-grade quality, made to get wet</ListItem>
                <ListItem variant="checked" iconColor="#406517">Can seam panels for ANY size</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/theater-scrims">
                    See Fabricated Theater Scrims <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* The Scrim Effect */}
        <HeaderBarSection icon={Theater} label="The Scrim Effect" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-5">
              <div className="w-full h-40 rounded-lg bg-gray-200 mb-4 flex items-center justify-center border-2 border-gray-300">
                <div className="text-center">
                  <Text className="font-bold text-gray-700 !mb-1">FRONT-LIT</Text>
                  <Text size="sm" className="text-gray-500 !mb-0">Appears Opaque</Text>
                </div>
              </div>
              <Heading level={4} className="!mb-2">When Lit From Front</Heading>
              <Text size="sm" className="text-gray-600 !mb-0">
                Light hits the scrim from the audience side. The fabric reflects the light and 
                appears solid/opaque. Anything behind the scrim is hidden from view.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <div className="w-full h-40 rounded-lg bg-white mb-4 flex items-center justify-center border-2 border-[#406517]/20" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(64,101,23,0.1))'}}>
                <div className="text-center">
                  <Text className="font-bold text-[#406517] !mb-1">BACK-LIT</Text>
                  <Text size="sm" className="text-[#406517]/70 !mb-0">Becomes Transparent</Text>
                </div>
              </div>
              <Heading level={4} className="!mb-2">When Lit From Behind</Heading>
              <Text size="sm" className="text-gray-600 !mb-0">
                Light comes from behind the scrim. The fabric becomes transparent, revealing 
                actors, sets, or objects positioned behind it. Creates a dramatic reveal effect.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Pricing */}
        <HeaderBarSection icon={Scissors} label="Sizing & Pricing" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Theatre scrim is available in two roll widths. Order by the linear foot. Color does 
              not affect price. Your cost is determined by how much we cut (length) from the 
              particular roll you select.
            </Text>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#406517] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Roll Width</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Price per Linear Foot</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Colors</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Example (20ft)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium">120-inch roll</td>
                    <td className="px-4 py-3 text-[#406517] font-bold">$7.00 / ft</td>
                    <td className="px-4 py-3 text-gray-600">White, Silver</td>
                    <td className="px-4 py-3 text-gray-600">20ft x $7.00 = $140.00</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">140-inch roll</td>
                    <td className="px-4 py-3 text-[#406517] font-bold">$7.50 / ft</td>
                    <td className="px-4 py-3 text-gray-600">White, Silver</td>
                    <td className="px-4 py-3 text-gray-600">20ft x $7.50 = $150.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center pt-2">
              <Button variant="primary" asChild>
                <Link href="/order/raw-netting">
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Common Uses */}
        <HeaderBarSection icon={Theater} label="Common Uses" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {[
              { title: 'Theatre Productions', desc: 'Classic scrim reveals and lighting effects' },
              { title: 'Concerts & Events', desc: 'Projection surfaces and stage backdrops' },
              { title: 'Outdoor Projection', desc: 'Outdoor movie screens and displays' },
              { title: 'Art Installations', desc: 'Creative installations with lighting effects' },
            ].map((use) => (
              <Card key={use.title} variant="outlined" className="!p-3">
                <Text className="font-bold text-gray-900 !mb-0.5 text-sm">{use.title}</Text>
                <Text size="xs" className="text-gray-600 !mb-0">{use.desc}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Theater} label="Scrim Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.THEATER_SCRIM} title="Theater Scrim Demo" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Theater Scrim Demo</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Mesh Types Overview</Text>
            </div>
          </Grid>
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
              <Link href="/raw-netting/custom" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">3. Let Us Make It</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Ready to Hang Custom Panels</Text>
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
