'use client'

import Link from 'next/link'
import { Bug, ShieldCheck, MapPin, Scissors, ArrowDown, ExternalLink } from 'lucide-react'
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
const NOSEEUM_ROLL_SIZES = [
  { value: '101', label: '101"', priceLabel: '$6.00/ft', pricingKey: 'raw_panel_nsu_101' },
  { value: '123', label: '123"', priceLabel: '$7.00/ft', pricingKey: 'raw_panel_nsu_123' },
]

const NOSEEUM_COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
]

export default function NoSeeUmPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero — no CTA bar */}
        <PowerHeaderTemplate
          title="No-See-Um Mesh Fabric"
          subtitle="Tiny holes with a much denser weave to keep out the pesky biting flies known as no-see-ums. Essential near water where these sand gnats, sand flies, and biting midges are common."
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
          meshType="no_see_um"
          productName="No-See-Um Mesh"
          rollSizes={NOSEEUM_ROLL_SIZES}
          colors={NOSEEUM_COLORS}
        />

        {/* Product Details */}
        <HeaderBarSection icon={Bug} label="When You Need No-See-Um Mesh" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/12/NoSeeUm-Mesh-WooCommerce.jpg`}
                alt="Raw No-See-Um mesh fabric"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card variant="outlined" className="!p-3 !bg-orange-50 !border-orange-200">
                <Text size="sm" className="text-orange-800 !mb-0">
                  <strong>Important:</strong> This mesh has elasticity making it difficult to spline screen. 
                  It is designed for our curtain system, not for fixed screen frames.
                </Text>
              </Card>
              <Text className="text-gray-600">
                Our No-See-Um netting has tiny holes (800 holes per sq inch) with a much denser weave to 
                keep out the pesky, biting flies known as no-see-ums that are commonly found near water.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">800 holes per square inch -- blocks no-see-ums</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution-dyed polyester, made for outdoors</ListItem>
                <ListItem variant="checked" iconColor="#406517">Lock stitch weave -- will not unravel when cut</ListItem>
                <ListItem variant="checked" iconColor="#406517">CA fire rated (NFPA 701 small test)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Clear looking out, denser looking in</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Geographic Areas */}
        <HeaderBarSection icon={MapPin} label="Common No-See-Um Areas" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              No-see-ums are most prevalent in coastal and wetland areas. If you live near any of 
              these regions, no-see-um mesh is strongly recommended over standard mosquito netting.
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
              {[
                'Coastal Florida', 'Gulf Coast', 'South Carolina Lowcountry', 'Outer Banks NC',
                'Chesapeake Bay', 'Hawaiian Islands', 'Caribbean Islands', 'Pacific Northwest Coast',
              ].map((area) => (
                <Card key={area} variant="outlined" className="!p-3 text-center">
                  <MapPin className="w-4 h-4 text-[#406517] mx-auto mb-1" />
                  <Text size="sm" className="font-medium text-gray-700 !mb-0">{area}</Text>
                </Card>
              ))}
            </Grid>
          </Stack>
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

        <FinalCTATemplate productLine="rn" />

      </Stack>
    </Container>
  )
}
