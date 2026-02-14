'use client'

import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  Anchor,
  DoorOpen,
  Layers,
  ShieldCheck,
  Cable,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
  PowerHeaderTemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function MagneticDoorwaysPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <div>
          <Link href="/plan-screen-porch" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Planning
          </Link>
          <PowerHeaderTemplate
            title="3. Magnetic Doorways &amp; Fasteners"
            subtitle="Panels connect to solid surfaces and to neighboring panels through three main connection types."
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* ================================================================
            MARINE SNAPS
            ================================================================ */}
        <HeaderBarSection icon={Anchor} label="Marine Snaps To Seal Sides To Some Surface" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-gray-700">
                Seal to a wall or column with our stainless steel marine snaps. The female snap is fastened to any top, side, or bottom binding of a curtain panel. The male snap is on a 5/8&quot; inch screw stud which can be screwed into wood surfaces. Some (regular-shaped) columns are perfectly straight and provide a suitable surface to snap to while others are lathed or tapered (irregularly-shaped).
              </Text>
              <YouTubeEmbed
                videoId={VIDEOS.MARINE_SNAPS_90_SEC}
                title="Marine Snaps in Under 90 Seconds"
                variant="card"
              />
              <Text className="text-center font-medium text-sm">Marine Snaps in Under 90 Seconds</Text>
            </Stack>
            <Stack gap="md">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Snaps-1920.jpg"
                  alt="Marine snaps for mosquito curtains"
                  className="w-full h-auto"
                />
              </div>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Heading level={5} className="!mb-2">When Ordering Marine Snaps:</Heading>
                <Text className="text-sm text-gray-700 !mb-2"><strong>For each 8ft tall snapped edge in your project, you&apos;ll need:</strong></Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">5-8 marine snaps. Space 18&quot; on each side for normal wind conditions. Space 12&quot; in windy conditions.</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">We recommend the fully refundable Industrial Snap Tool as well to complete your project faster and easier.</ListItem>
                </BulletedList>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            MAGNETIC DOORWAYS
            ================================================================ */}
        <HeaderBarSection icon={DoorOpen} label="Magnetic Doorways Seal Panels to Other Panels" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-gray-700">
                Connecting two panels magnetically serves two purposes. Magnet doorways allow you to pass between panels but also help to create logical gathered swags by strategically creating panel breaks for your porch enclosure.
              </Text>
              <Text className="text-gray-700">
                Magnetic doorways are much easier to separate than unsnapping panels from a wall or column. It takes two panels to form a magnetic doorway and they overlap by 1 inch to seal. Be sure to read about stucco strips that are mini panels enabling you to create magnetic connections to a wall using a mini 3&quot; panelette.
              </Text>
              <YouTubeEmbed
                videoId={VIDEOS.MAGNETIC_DOORWAYS_90_SEC}
                title="Magnetic Doorways in Under 90 Seconds"
                variant="card"
              />
              <Text className="text-center font-medium text-sm">Magnetic Doorways in Under 90 Seconds</Text>
            </Stack>
            <Stack gap="md">
              <Heading level={4} className="!mb-2">Powerful Neodymium Magnets &amp; Fiberglass Rods</Heading>
              <Text className="text-gray-700">
                These are NOT ordinary refrigerator magnets. Our rare-earth magnets are freakishly strong and seal doorways. You MUST ORDER enough magnets to space them every 12-18 inches depending upon your wind conditions. Fiberglass rods insert vertically up into the side bindings to distribute the load on the magnets and complete the seal between magnets.
              </Text>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnets-and-Rods-400x225-1.png"
                  alt="Neodymium magnets and fiberglass rods"
                  className="w-full h-auto"
                />
              </div>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Heading level={5} className="!mb-2">When Ordering Magnetic Doorways:</Heading>
                <Text className="text-sm text-gray-700 !mb-2"><strong>For each 8ft tall magnetic doorway in your project, you&apos;ll need:</strong></Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">10-16 magnets. Space 18&quot; on each side for normal wind conditions. Space 12&quot; in windy conditions.</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">2 fiberglass rods. One for each side of the doorway.</ListItem>
                </BulletedList>
              </Card>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnetic-Doorway-Illustration-1920x1280-400x267-1.jpg"
                  alt="Magnetic doorway illustration"
                  className="w-full h-auto"
                />
              </div>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            STUCCO STRIPS
            ================================================================ */}
        <HeaderBarSection icon={Layers} label="Stucco Strips" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-gray-700">
                First, it is still a mystery why we call it a Stucco Strip, since it has absolutely nothing to do with stucco at all and please do not let the term confuse you. The name just stuck many years ago. As you will learn, a stucco strip is simply a mini 3-inch wide panel.
              </Text>
              <Text className="text-gray-700">
                Ideally, you do not want to ever have to unsnap your curtain to draw it open. There are times (typically against the house) where you may or may not want to unsnap the curtain from the house to draw it to an outer corner.
              </Text>
              <Text className="text-gray-700">
                While it is possible to snap panels directly to the house, we never want you to have to unsnap curtains to open them because it is a pain in the neck with our <em>hard action snaps</em>. Snapping and unsnapping panels may require a ladder when a magnetic connection would be far easier to separate even when panels are tall and out of reach.
              </Text>
              <Text className="text-gray-700">
                Stucco Strips are NOT Required, but they sure make drawing far easier if there is no other magnetic connection on a particular side.
              </Text>
              <Text className="text-gray-700">
                <strong>Again, think of a Stucco Strip as a mini 3-inch wide panel.</strong> It is not a fastener, it is technically a panel in every way made of a solid webbing material.
              </Text>
              <Text className="text-gray-700">
                One edge of the 3&quot; Stucco Strip snaps to a structural surface like a wall or column while the other edge is set up for a magnetic connection to a larger panel. The stucco strip always stays snapped to the wall, but because we can use the stucco strip to magnet to a larger panel, the larger panel can be drawn much easier without having to snap and unsnap your porch enclosure.
              </Text>
              <Text className="text-gray-700">
                Because a Stucco Strip is just a mini panel, <strong>it is ordered from the &quot;Panels Page&quot; when you place your order.</strong> Like any other panel, <strong>you will also need to order the magnetic doorway hardware and marine snaps</strong> since stucco strips ALWAYS magnet to some larger panel and the other vertical edge ALWAYS snaps to some surface.
              </Text>
            </Stack>
            <Stack gap="md">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/STUCCO-STRIP-DIAGRAM.png"
                  alt="When might a stucco strip be useful - diagram"
                  className="w-full h-auto"
                />
              </div>
              <Text className="text-center text-sm text-gray-500 italic">When Might a Stucco Strip be Useful? (Click to Enlarge)</Text>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/NO-STUCCO-STRIP-DIAGRAM.png"
                  alt="When you do not need a stucco strip - diagram"
                  className="w-full h-auto"
                />
              </div>
              <Text className="text-center text-sm text-gray-500 italic">When You Do Not Need a Stucco Strip (Click to Enlarge)</Text>
              <YouTubeEmbed
                videoId={VIDEOS.STUCCO_STRIPS_90_SEC}
                title="Stucco Strips in Under 90 Seconds"
                variant="card"
              />
              <Text className="text-center font-medium text-sm">See it in Action (Stucco Strips in Under 90 Seconds)</Text>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Stucco-Strip-Illustration-1920x1280-400x267-1.jpg"
                  alt="Stucco strip illustration"
                  className="w-full h-auto"
                />
              </div>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Heading level={5} className="!mb-2">When Ordering Stucco Strips:</Heading>
                <Text className="text-sm text-gray-700 !mb-2"><strong>For each 8ft tall stucco strip in your project, you&apos;ll need:</strong></Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">10-16 magnets. Space 18&quot; on each side for normal wind conditions. Space 12&quot; in windy conditions.</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">2 fiberglass rods. One for each side of the doorway.</ListItem>
                </BulletedList>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            SEALING THE BASE
            ================================================================ */}
        <HeaderBarSection icon={ShieldCheck} label="Sealing the Base" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-gray-700">
                There is something a bit counter intuitive about securing the base of your curtain. At first, you might think the best way to secure the bottom is to pull it straight down and perhaps tie it down or weight it, however the key to securing the base is <em>horizontal tension.</em>
              </Text>
              <Text className="text-gray-700">
                Weights do not work for outdoor curtains because they aren&apos;t heavy enough and weights drive the base of the curtain into the floor wearing it faster. Instead, use Marine Snaps to secure the base and Elastic Cord described below.
              </Text>
              <Text className="text-gray-700">
                Imagine for a moment, we laid a 20ft belt from the Jolly Green Giant on the sidewalk. If you step on one end, and Mr. Jolly Green stands on the other end, it would be hard to lift the middle of the belt. The little bit of horizontal tension would be enough to keep the belt down. Marine snaps every 6-12ft help to maintain <em>horizontal tension</em> along the base especially in the corners. Generally, this is the spacing of support columns where marine snaps can be placed into the base of the column.
              </Text>
            </Stack>
            <Stack gap="md">
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_1}
                title="Sealing the Base"
                variant="card"
              />
              <Text className="text-center font-medium text-sm">Sealing the Base (1:05)</Text>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            ELASTIC CORD
            ================================================================ */}
        <HeaderBarSection icon={Cable} label='Elastic Cord - "Vertical Ribs"' variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-sm text-gray-500 italic !mb-2">Commonly Used for Tracking Attachment With Path Inside Columns</Text>
              <Text className="text-gray-700">
                Curtains with tracking attachment typically take a path on the <em>inside</em> of your columns often with configurations where panels <em>straddle</em> a corner. Elastic cord &quot;pinches&quot; the curtain to the corner column. Think of elastic cord as a large bungee cord clipped vertically between 2 D-rings. Elastic cord is not attached to the curtain at all. It acts as a false column giving the curtain a corner rib inside the curtain to brace the curtain in the breeze and help to maintain horizontal tension.
              </Text>
              <Text className="text-gray-700">
                These vertical elastic cord ribs can be placed anywhere to add support to the curtain in breezy conditions (not just at corners). The best location is in front of columns to act as a giant rubber band to &quot;pinch&quot; the curtain to the column.
              </Text>
            </Stack>
            <Stack gap="md">
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_2}
                title="Elastic Cord"
                variant="card"
              />
              <Text className="text-center font-medium text-sm">Elastic Cord (0:58)</Text>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/work-with-a-planner">
                Get Started With a Planner
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
