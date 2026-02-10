'use client'

import Link from 'next/link'
import { ArrowRight, Wrench, ShieldCheck, Bug, Scissors } from 'lucide-react'
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

export default function HardwarePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Attachment Hardware for Raw Netting"
          subtitle="Everything you need to attach your raw netting. Marine snaps, grommets, elastic cord, webbing, velcro, and more. We sell the same hardware we use in our own fabricated products."
          videoId={VIDEOS.MARINE_SNAPS_90_SEC}
          videoTitle="Marine Snaps in 90 Seconds"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Main Hardware Overview */}
        <HeaderBarSection icon={Wrench} label="Popular Attachment Methods" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/12/Raw-Mesh.jpg`}
                alt="Raw mesh netting with hardware attachments"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Buying raw netting usually means you need some way to attach it. We sell the same 
                marine-grade hardware we use in our own fabricated solutions. These items are 
                designed to work with our mesh materials.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Marine Snaps -- the same we use in our products</ListItem>
                <ListItem variant="checked" iconColor="#406517">Grommets / Eyelets -- for lacing or hanging</ListItem>
                <ListItem variant="checked" iconColor="#406517">Elastic Cord -- for stretching and tensioning</ListItem>
                <ListItem variant="checked" iconColor="#406517">Nylon Webbing -- for hems and reinforcement</ListItem>
                <ListItem variant="checked" iconColor="#406517">Velcro / Hook & Loop -- for easy removable attachment</ListItem>
                <ListItem variant="checked" iconColor="#406517">Cable Ties / Zip Ties -- quick and cheap for many uses</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/order/raw-netting-attachments">
                    Shop Hardware <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Hardware Categories */}
        <HeaderBarSection icon={Wrench} label="Hardware Categories" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {[
              {
                title: 'Marine Snaps',
                desc: 'Stainless steel snaps that screw onto surfaces. The same ones we use in all our products. Professional look.',
                price: 'From $0.75 ea',
              },
              {
                title: 'Grommets',
                desc: 'Metal eyelets for reinforcing holes in mesh. Great for lacing cord through or hanging from hooks.',
                price: 'From $0.50 ea',
              },
              {
                title: 'Elastic Cord',
                desc: 'Bungee-style elastic cord in various thicknesses. Excellent for tensioning netting between anchor points.',
                price: 'By the foot',
              },
              {
                title: 'Nylon Webbing',
                desc: '1-inch nylon webbing for hemming edges, creating attachment strips, or reinforcing your netting.',
                price: 'By the yard',
              },
              {
                title: 'Velcro Strips',
                desc: 'Industrial-strength hook and loop. Sew one side to mesh, adhesive the other to your structure.',
                price: 'By the foot',
              },
              {
                title: 'Cable Ties',
                desc: 'UV-rated cable ties for quick attachments. The cheapest and fastest way to attach industrial mesh.',
                price: 'Pack of 100',
              },
            ].map((item) => (
              <Card key={item.title} variant="elevated" className="!p-5">
                <Wrench className="w-6 h-6 text-[#406517] mb-2" />
                <Heading level={5} className="!mb-1">{item.title}</Heading>
                <Text size="sm" className="text-gray-600 !mb-2">{item.desc}</Text>
                <Text size="xs" className="font-semibold text-[#406517] !mb-0">{item.price}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Wrench} label="Hardware Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.MARINE_SNAPS_90_SEC} title="Marine Snaps in 90 Seconds" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Marine Snaps in 90 Sec</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_DIY} title="DIY Netting Projects" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">DIY Rigging Ideas</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.NETTING_RIGGING} title="Netting Rigging" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Netting Rigging Techniques</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* Order CTA */}
        <HeaderBarSection icon={ShieldCheck} label="Ready to Order Hardware?" variant="dark">
          <div className="text-center py-4">
            <Text className="text-gray-600 max-w-2xl mx-auto mb-4">
              Browse our complete hardware catalog. All items are marine-grade quality and designed 
              to work perfectly with our raw netting fabrics.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/order/raw-netting-attachments">
                  Shop Hardware <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/raw-netting/rigging">
                  See Rigging Ideas
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
