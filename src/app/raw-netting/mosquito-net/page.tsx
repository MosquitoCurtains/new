'use client'

import Link from 'next/link'
import { Bug, ShieldCheck, Flame, Scissors, Droplets, ArrowDown, ExternalLink } from 'lucide-react'
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import RawNettingProductOrder from '../components/RawNettingProductOrder'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

// ---------------------------------------------------------------------------
// Product config for the order section
// ---------------------------------------------------------------------------
const MOSQUITO_ROLL_SIZES = [
  { value: '101', label: '101"', priceLabel: '$5.50/ft', pricingKey: 'raw_panel_hm_101' },
  { value: '123', label: '123"', priceLabel: '$6.00/ft', pricingKey: 'raw_panel_hm_123' },
  { value: '138', label: '138"', priceLabel: '$6.50/ft', pricingKey: 'raw_panel_hm_138' },
]

const MOSQUITO_COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
  { value: 'ivory', label: 'Ivory', color: '#fffff0' },
]

export default function MosquitoNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero — no CTA bar */}
        <PowerHeaderTemplate
          title='Our "Heavy" Mosquito Netting Fabric'
          subtitle="Our most popular raw netting. Best value, quality, and airflow. Incredibly strong unlike cheap meshes you see elsewhere. Its rectangular pattern stops even gnats and black flies."
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
          meshType="heavy_mosquito"
          productName="Heavy Mosquito Mesh"
          rollSizes={MOSQUITO_ROLL_SIZES}
          colors={MOSQUITO_COLORS}
        />

        {/* Product Details */}
        <HeaderBarSection icon={Bug} label="Product Details" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/12/Heavy-Mosquito-Netting-WooCommerce.jpg`}
                alt="Raw Heavy Mosquito Netting Mesh"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Heavy Mosquito Netting is our most popular and offers the best value and quality 
                for the price. It also has the best airflow. This mosquito netting is incredibly 
                strong unlike the other cheap meshes that you see elsewhere. Our Heavy Mosquito 
                Netting Mesh is our own durable recipe made to last.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">450 denier, solution-dyed polyester</ListItem>
                <ListItem variant="checked" iconColor="#406517">Lock stitch weave -- will not unravel when cut</ListItem>
                <ListItem variant="checked" iconColor="#406517">CA fire rated (NFPA 701 small test)</ListItem>
                <ListItem variant="checked" iconColor="#406517">100% polyester, made for outdoors and made to get wet</ListItem>
                <ListItem variant="checked" iconColor="#406517">Rectangular pattern stops gnats & black flies</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Feature Images */}
        <HeaderBarSection icon={ShieldCheck} label="Incredibly Strong Netting" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Looking for a quality mesh fabric that will protect you from mosquitoes and other insects? 
                Perhaps your project is for a purpose other than insects. Our mesh netting fabric can do just that.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Multi-purpose: insects, privacy, shade, and more</ListItem>
                <ListItem variant="checked" iconColor="#406517">100% polyester made for outdoors and made to get wet</ListItem>
                <ListItem variant="checked" iconColor="#406517">Sold by the foot from massive rolls</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2021/11/Strong-Mosquito-Netting-Mesh.jpg`}
                alt="Strong mosquito netting mesh"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* Feature Properties */}
        <HeaderBarSection icon={Flame} label="Material Properties" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {[
              { icon: Flame, title: 'CA Fire Rated', desc: 'NFPA 701 small test certified. Safe for indoor and outdoor use.' },
              { icon: Scissors, title: 'Will Not Unravel', desc: 'Our unique lock stitch weave will not unravel when cut on any edge.' },
              { icon: Droplets, title: 'Solution Dyed', desc: 'Netting materials are solution dyed for maximum fade resistance.' },
              { icon: ShieldCheck, title: 'Made to Get Wet', desc: '100% polyester fabric made for outdoors and made to get wet.' },
              { icon: Bug, title: 'Stops Gnats', desc: 'Rectangular pattern is fine enough to stop gnats and black flies.' },
              { icon: Scissors, title: 'Massive Rolls', desc: 'Rolls are 100"-140" wide. Much wider than standard 54-60" fabric bolts.' },
            ].map((feat) => (
              <Card key={feat.title} variant="outlined" className="!p-4">
                <feat.icon className="w-6 h-6 text-[#406517] mb-2" />
                <Text className="font-bold text-gray-900 !mb-1">{feat.title}</Text>
                <Text size="sm" className="text-gray-600 !mb-0">{feat.desc}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Specs Table Image */}
        <HeaderBarSection icon={Bug} label="Heavy Mosquito Netting Specs Table" variant="dark">
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
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Why Us For Raw Netting</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Mesh Types Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.MOSQUITO_NETTING_FABRIC} title="Mosquito Netting Fabric" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Optical Qualities</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_DIY} title="Rigging Ideas" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Rigging Ideas</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_APPLICATIONS} title="Strong Net" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Applications</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_USES} title="Versatile Uses" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Versatile Uses</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* Cross-links */}
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
                <Heading level={5} className="text-[#406517] !mb-1">2. Rigging Ideas & Attachments</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Helpful Ideas & Attachment Items</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/custom" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">3. Let Us Make It For You</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Ready to Hang Custom Panels</Text>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        <WhyChooseUsTemplate />
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
