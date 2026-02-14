'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Sun,
  Factory,
  Theater,
  Wrench,
  Scissors,
  ShieldCheck,
} from 'lucide-react'
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
  RN_HERO_ACTIONS,
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS, RAW_NETTING_VIDEOS } from '@/lib/constants/videos'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const NETTING_TYPES = [
  {
    title: 'Heavy Mosquito Netting',
    description: 'Our most popular. Best airflow, incredibly strong, stops gnats & black flies. Available in black, white, or ivory.',
    href: '/raw-netting/mosquito-net',
    icon: Bug,
    image: `${IMG}/2021/08/Mosquito-Mesh-1600.jpg`,
    price: 'From $5.50/ft',
  },
  {
    title: 'No-See-Um Mesh',
    description: 'Very small holes with a much denser weave to keep out no-see-ums. Essential for coastal areas.',
    href: '/raw-netting/no-see-um',
    icon: Bug,
    image: `${IMG}/2021/08/Noseeum-Mesh-1600.jpg`,
    price: 'From $6.00/ft',
  },
  {
    title: 'Shade Mesh',
    description: 'Blocks 80% of sunlight. Black for shade & privacy, white for outdoor projection screens.',
    href: '/raw-netting/shade-mesh',
    icon: Sun,
    image: `${IMG}/2021/08/Shade-Mesh-1600.jpg`,
    price: 'From $7.00/ft',
  },
  {
    title: 'Theatre Scrim',
    description: 'Marine-grade shark tooth scrim for theatre, concerts, events, and projection screens.',
    href: '/raw-netting/scrim',
    icon: Theater,
    image: `${IMG}/2019/09/White-Sharks-tooth-Scrim-1200.jpg`,
    price: 'From $7.00/ft',
  },
  {
    title: 'Industrial Mesh',
    description: 'Extremely durable military-overrun netting. Can zip tie on edges. Incredible price point.',
    href: '/raw-netting/industrial',
    icon: Factory,
    image: `${IMG}/2021/08/Industrial-Mesh-1600.jpg`,
    price: 'From $4.00/ft',
  },
  {
    title: 'Shop All Meshes',
    description: 'See pricing information for all raw netting mesh types. Compare visibility, optical qualities, and colors.',
    href: '/order-mesh-netting-fabrics',
    icon: Scissors,
    image: `${IMG}/2021/08/See-All-Meshes-1600.jpg`,
    price: 'View All',
  },
]

export default function RawNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Raw Netting & Mesh Fabrics"
          subtitle="Giant rolls of raw netting custom-cut to your specifications. Incredibly strong with limitless applications. We're manufacturers who use these exact materials in our own products."
          videoId={VIDEOS.RAW_NETTING}
          videoTitle="Why Us For Raw Netting"
          variant="compact"
          actions={RN_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Product Cards with Real Images */}
        <HeaderBarSection icon={Scissors} label="Shop By Mesh Type" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {NETTING_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Link key={type.title} href={type.href} className="group">
                  <Card variant="elevated" className="h-full overflow-hidden !p-0 !rounded-2xl hover:shadow-lg transition-shadow">
                    <Frame ratio="4/3" className="overflow-hidden">
                      <img
                        src={type.image}
                        alt={type.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Frame>
                    <Stack gap="sm" className="p-4 md:p-5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#406517]" />
                        <Text size="xs" className="font-semibold uppercase tracking-wider text-[#406517] !mb-0">
                          {type.price}
                        </Text>
                      </div>
                      <Heading level={4} className="!text-lg group-hover:text-[#406517] transition-colors !mb-0">
                        {type.title}
                      </Heading>
                      <Text size="sm" className="text-gray-600 !mb-1">{type.description}</Text>
                      <div className="flex items-center font-semibold text-sm text-[#406517]">
                        Shop Now
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Stack>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* Video Demonstrations */}
        <HeaderBarSection icon={Bug} label="Raw Netting Videos" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Watch our videos to learn about raw netting products, fabric types, optical qualities, and how to use them for your projects.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
              {RAW_NETTING_VIDEOS.map((video) => (
                <div key={video.id}>
                  <YouTubeEmbed
                    videoId={video.id}
                    title={video.title}
                    variant="card"
                  />
                  <Text className="text-center mt-2 font-medium text-sm">
                    {video.title}
                  </Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Why Buy From Us */}
        <HeaderBarSection icon={ShieldCheck} label="Why Buy Netting From Us?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/09/Massive-Fabric-Rolls.jpg`}
                alt="Massive rolls of raw netting fabric"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We only offer mesh netting that is going to last. We don't just buy netting and resell it -- 
                we're manufacturers who use these exact materials in our own fabricated solutions. The best 
                reason to buy from us are the ideas we can share.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Same marine-grade quality we use in our products</ListItem>
                <ListItem variant="checked" iconColor="#406517">Very wide rolls up to 12 feet -- sold by the linear foot</ListItem>
                <ListItem variant="checked" iconColor="#406517">Expert advice on applications and rigging</ListItem>
                <ListItem variant="checked" iconColor="#406517">Fast shipping: 3-7 business days (US/CA)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution dyed for maximum fade resistance</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/raw-netting/why-us">
                    Learn More About Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Resources */}
        <HeaderBarSection icon={Wrench} label="Helpful Resources" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card className="!p-5 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/hardware" className="block">
                <Wrench className="w-8 h-8 text-[#406517] mb-3" />
                <Heading level={5} className="!mb-2">Attachment Hardware</Heading>
                <Text className="text-sm text-gray-600 !mb-3">
                  Marine snaps, grommets, velcro, elastic cord, webbing, and more for attaching your netting.
                </Text>
                <span className="text-[#406517] text-sm font-medium inline-flex items-center">
                  View Hardware <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </Link>
            </Card>
            <Card className="!p-5 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/rigging" className="block">
                <Scissors className="w-8 h-8 text-[#406517] mb-3" />
                <Heading level={5} className="!mb-2">Fasteners & Rigging Ideas</Heading>
                <Text className="text-sm text-gray-600 !mb-3">
                  Creative rigging methods: marine snaps, elastic cord, PVC clamps, duct tape tricks, and more.
                </Text>
                <span className="text-[#406517] text-sm font-medium inline-flex items-center">
                  View Ideas <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </Link>
            </Card>
            <Card className="!p-5 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/custom" className="block">
                <ShieldCheck className="w-8 h-8 text-[#406517] mb-3" />
                <Heading level={5} className="!mb-2">Let Us Make It For You</Heading>
                <Text className="text-sm text-gray-600 !mb-3">
                  Custom cut, sewn, hemmed, and finished. We've done tens of thousands of custom projects.
                </Text>
                <span className="text-[#406517] text-sm font-medium inline-flex items-center">
                  Learn More <ArrowRight className="ml-1 w-3 h-3" />
                </span>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Final CTA */}
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
