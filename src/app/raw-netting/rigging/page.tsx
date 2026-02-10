'use client'

import Link from 'next/link'
import { ArrowRight, Scissors, Wrench, Bug, ShieldCheck } from 'lucide-react'
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
  MC_HERO_ACTIONS,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

export default function RiggingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Fasteners & Rigging Ideas"
          subtitle="Creative ways to attach and rig your raw netting. Marine snaps, elastic cord, PVC pipe frames, duct tape tricks, and dozens of methods used by our customers worldwide."
          videoId={VIDEOS.NETTING_RIGGING}
          videoTitle="Netting Rigging Techniques"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Overview */}
        <HeaderBarSection icon={Scissors} label="Attachment Methods Overview" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/09/Massive-Fabric-Rolls.jpg`}
                alt="Massive fabric rolls of raw netting"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                One of the best reasons to buy raw netting from us is the ideas we can share. 
                We've seen thousands of creative applications from our customers over the years. 
                Here are the most popular methods for attaching and rigging raw netting.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Marine Snaps -- professional, removable attachment</ListItem>
                <ListItem variant="checked" iconColor="#406517">Elastic Cord / Bungee -- stretches to tension netting</ListItem>
                <ListItem variant="checked" iconColor="#406517">PVC Pipe Frames -- build custom frame structures</ListItem>
                <ListItem variant="checked" iconColor="#406517">Duct Tape Hems -- quick, cheap, surprisingly durable</ListItem>
                <ListItem variant="checked" iconColor="#406517">Zip Ties / Cable Ties -- fast attachment to structures</ListItem>
                <ListItem variant="checked" iconColor="#406517">Grommets & Lacing -- thread cord through eyelets</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Rigging Methods Detail */}
        <HeaderBarSection icon={Wrench} label="Popular Rigging Methods" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-5">
              <Wrench className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">Marine Snaps</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                The same stainless steel snaps we use in our professional products. Screw the 
                base into your structure, snap the mesh on and off. The most professional-looking 
                method and easy to remove for cleaning.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Permanent/semi-permanent installations
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <Scissors className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">Elastic Cord / Bungee</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                Thread elastic cord through grommets or fold mesh over the cord and staple. 
                The stretch keeps constant tension on the netting even in wind. Works great 
                with PVC pipe frames.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Temporary or seasonal setups
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <Wrench className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">PVC Pipe Frames</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                Build a frame from PVC pipe and fittings, then wrap or attach mesh using elastic 
                cord, zip ties, or PVC clamps. Lightweight, cheap, and easy to assemble. Perfect 
                for garden beds, porches, and temporary enclosures.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Gardens, raised beds, temporary enclosures
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <Scissors className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">Duct Tape Hems</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                Fold the mesh edge over and duct tape it to create a reinforced hem. Surprisingly 
                durable and waterproof. The cheapest way to finish raw netting edges. Works 
                particularly well with industrial mesh.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Budget projects, quick fixes
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <Wrench className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">Zip Ties / Cable Ties</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                UV-rated cable ties are the fastest way to attach mesh to fences, railings, 
                PVC frames, or any structure with holes or bars. Our industrial mesh is thick 
                enough to zip tie directly on edges.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Industrial mesh, fences, railings
              </Text>
            </Card>
            <Card variant="elevated" className="!p-5">
              <Scissors className="w-7 h-7 text-[#406517] mb-3" />
              <Heading level={4} className="!mb-2">Velcro / Hook & Loop</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">
                Sew or glue the loop side to your mesh, adhesive the hook side to your structure. 
                Creates an easily removable attachment that can be opened and closed repeatedly.
              </Text>
              <Text size="xs" className="text-[#406517] font-medium !mb-0">
                Best for: Doorways, windows, removable panels
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Bug} label="Rigging Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.NETTING_RIGGING} title="Netting Rigging Techniques" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Rigging Techniques</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_DIY} title="DIY Netting Projects" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">DIY Netting Projects</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.MARINE_SNAPS_90_SEC} title="Marine Snaps in 90 Seconds" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Marine Snaps in 90 Sec</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <HeaderBarSection icon={ShieldCheck} label="Need Hardware?" variant="dark">
          <div className="text-center py-4">
            <Text className="text-gray-600 max-w-2xl mx-auto mb-4">
              Shop our complete hardware catalog -- marine snaps, grommets, elastic cord, webbing, 
              velcro, and more. All marine-grade quality.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/raw-netting/hardware">
                  Shop Hardware <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/raw-netting/custom">
                  Or Let Us Make It For You
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
              <Link href="/raw-netting/hardware" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">2. Shop Hardware</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Snaps, Cord, Webbing & More</Text>
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
