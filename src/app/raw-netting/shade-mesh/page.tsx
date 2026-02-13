'use client'

import Link from 'next/link'
import { Sun, ShieldCheck, Eye, Bug, ArrowDown, ExternalLink } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  TwoColumn,
  Frame,
  Text,
  Card,
  Button,
  Heading,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import RawNettingProductOrder from '../components/RawNettingProductOrder'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

// ---------------------------------------------------------------------------
// Product config for the order section
// ---------------------------------------------------------------------------
const SHADE_ROLL_SIZES = [
  { value: '120', label: '120"', priceLabel: '$7.00/ft', pricingKey: 'raw_panel_shade_120' },
]

const SHADE_COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
]

export default function ShadeMeshPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero — no CTA bar */}
        <PowerHeaderTemplate
          title="Shade Screen Mesh Fabric"
          subtitle="Blocks 80% of sunlight plus insects. Black shade screen has interesting optical qualities: clear looking out, opaque looking in for privacy. White shade mesh is ideal for outdoor projection screens."
          videoId={VIDEOS.RAW_NETTING}
          videoTitle="Why Us For Raw Netting"
          variant="compact"
          actions={[]}
          ctaSlot={
            <>
              <Button variant="primary" size="lg" asChild>
                <a href="#order-now">
                  Order Now
                  <ArrowDown className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/screened-porch-enclosures" target="_blank" rel="noopener noreferrer">
                  See Fabricated Solutions
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </>
          }
        />

        {/* ORDER SECTION — moved up, right after hero */}
        <RawNettingProductOrder
          meshType="shade"
          productName="Shade Mesh"
          rollSizes={SHADE_ROLL_SIZES}
          colors={SHADE_COLORS}
        />

        {/* Product Details */}
        <HeaderBarSection icon={Sun} label="Product Details" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2021/08/Shade-Mesh-1600.jpg`}
                alt="Shade screen mesh fabric"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our shade screen mesh has been lab tested to block 80% of sunlight. While inside, 
                you see out rather clearly, but when outside looking in, the shade screen fabric 
                is rather opaque and good for privacy. This makes it excellent for shade, privacy, 
                or both.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Blocks 80% of sunlight (lab tested)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Clear visibility looking out, opaque looking in</ListItem>
                <ListItem variant="checked" iconColor="#406517">Also blocks insects</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution-dyed for maximum fade resistance</ListItem>
                <ListItem variant="checked" iconColor="#406517">100% polyester, made for outdoors</ListItem>
                <ListItem variant="checked" iconColor="#406517">White shade mesh used for outdoor projection screens</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Common Applications */}
        <HeaderBarSection icon={Sun} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {[
              { title: 'Patio Shade', desc: 'Block sun and insects on patios and decks' },
              { title: 'Greenhouses', desc: 'Control sunlight and temperature for plants' },
              { title: 'Carports', desc: 'Add shade and privacy to carport areas' },
              { title: 'Pool Areas', desc: 'Shade and insect protection around pools' },
              { title: 'Privacy Screens', desc: 'Opaque looking in for visual privacy' },
              { title: 'Projection Screens', desc: 'White shade mesh for outdoor movie nights' },
              { title: 'Roll-Up Shades', desc: 'Custom roll-up shade screen designs' },
              { title: 'Window Screens', desc: 'Shade windows for privacy and cooling' },
            ].map((app) => (
              <Card key={app.title} variant="outlined" className="!p-3">
                <Text className="font-bold text-gray-900 !mb-0.5 text-sm">{app.title}</Text>
                <Text size="xs" className="text-gray-600 !mb-0">{app.desc}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Specs Table */}
        <HeaderBarSection icon={ShieldCheck} label="Specifications" variant="dark">
          <div className="flex justify-center">
            <a href={`${IMG}/2024/05/All-Mesh-Netting-Specifications-Table-New.jpg`} target="_blank" rel="noopener noreferrer">
              <img
                src={`${IMG}/2024/05/All-Mesh-Netting-Specifications-Table-New.jpg`}
                alt="All mesh netting specifications comparison table"
                className="w-full max-w-4xl rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              />
            </a>
          </div>
          <Text size="sm" className="text-gray-500 text-center mt-3">Click table to enlarge</Text>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Bug} label="Product Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Why Us For Raw Netting</Text>
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

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
