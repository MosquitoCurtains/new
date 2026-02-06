'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  DoorOpen,
  Magnet,
Camera, Info} from 'lucide-react'
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
  YouTubeEmbed,
TwoColumn} from '@/lib/design-system'
import { VIDEOS, HARDWARE_VIDEOS } from '@/lib/constants/videos'

export default function MagneticDoorwaysPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <DoorOpen className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Magnetic Doorways
            </Heading>
            <Text className="text-xl text-gray-600">
              Our magnetic doorway system provides easy egress while maintaining a complete seal 
              against insects. Walk through hands-free and the magnets seal behind you.
            </Text>
          </Stack>
        </section>

        {/* How It Works */}
        <HeaderBarSection icon={Magnet} label="How Magnetic Doorways Work" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId={VIDEOS.MAGNETIC_DOORWAYS_90_SEC}
              title="Magnetic Doorways in under 90 Seconds"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Our magnetic doorway creates an easy walk-through entrance that seals itself closed 
                behind you. Neodymium magnets (the strongest available) snap the curtain edges 
                together automatically.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Walk through hands-free</ListItem>
                <ListItem variant="checked" iconColor="#406517">Auto-sealing magnetic closure</ListItem>
                <ListItem variant="checked" iconColor="#406517">Neodymium magnets (super strong)</ListItem>
                <ListItem variant="checked" iconColor="#406517">One doorway included per side</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Hardware Demo Videos */}
        <HeaderBarSection icon={DoorOpen} label="Hardware Demo Videos" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Watch these short videos to understand how our attachment hardware works. 
              Each video is under 90 seconds.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              {HARDWARE_VIDEOS.map((video) => (
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
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_1}
                title="Base Sealing Overview"
                variant="card"
              />
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_2}
                title="Base Sealing Details"
                variant="card"
              />
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Doorway Options */}
        <HeaderBarSection icon={DoorOpen} label="Doorway Configurations" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Standard Magnetic Doorway</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Magnetic-Door.jpg"
                  alt="Standard magnetic doorway"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                Our most popular option. Two overlapping curtain edges with magnets create 
                a self-sealing entrance.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Zippered Doorway</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Zippered-Door.jpg"
                  alt="Zippered doorway option"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                An alternative for areas with high foot traffic or where a more secure 
                closure is desired.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Tips */}
        <HeaderBarSection icon={Magnet} label="Tips for Magnetic Doorways" variant="dark">
          <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4} className="!text-[#406517]">Placement Tips</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">Place doorways where you naturally enter/exit</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">One doorway per side is included in price</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Additional doorways can be added</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Consider traffic patterns when planning</ListItem>
                </BulletedList>
              </Stack>
              <Stack gap="md">
                <Heading level={4} className="!text-[#406517]">Installation Tips</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">You'll place the magnets yourself</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">We provide detailed instructions</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Video guide shows step-by-step process</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">A 9-year-old can do it (seriously!)</ListItem>
                </BulletedList>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Continue Planning Your Project</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Now that you understand doorways, continue planning or get help from our team.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/plan">
                Continue Planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project">
                Get a Quote
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Magnetic Doorways Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Snaps-1920-300x200.jpg"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnets-and-Rods-400x225-1-300x169.png"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnetic-Doorway-Illustration-1920x1280-400x267-1-300x200.jpg"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/STUCCO-STRIP-DIAGRAM-1024x791.png"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/NO-STUCCO-STRIP-DIAGRAM-1024x791.png"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Stucco-Strip-Illustration-1920x1280-400x267-1-300x200.jpg"
                  alt="Magnetic Doorways"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="3. Magnetic Doorways &amp; Fasteners" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Panels connect to solid surfaces and to neighboring panels through three main connection types.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Marine Snaps To Seal Sides To Some Surface" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Seal to a wall or column with our stainless steel marine snaps. The female snap is fastened to any top, side, or bottom binding of a curtain panel. The male snap is on a 5/8″ inch screw stud which can be screwed into wood surfaces. Some (regular-shaped) columns are perfectly straight and provide a suitable surface to snap to while others are lathed or tapered (irregularly-shaped).</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="When Ordering Marine Snaps:" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                For each 8ft tall snapped edge in your project, you’ll need:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Snaps-1920-300x200.jpg"
                alt="When Ordering Marine Snaps:"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Magnetic Doorways Seal Panels to Other Panels" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Connecting two panels magnetically serves two purposes. Magnet doorways allow you to pass between panels but also help to create logical gathered swags by strategically creating panel breaks for your porch enclosure.</Text>
              <Text className="text-gray-600">Magnetic doorways are much easier to separate than unsnapping panels from a wall or column. It takes two panels to form a magnetic doorway and they overlap by 1 inch to seal. Be sure to read about stucco strips that are mini panels enabling you to create magnetic connections to a wall using a mini 3″ panelette.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Powerful Neodymium Magnets &amp; Fiberglass Rods" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                These are NOT ordinary refrigerator magnets. Our rare-earth magnets are freakishly strong and seal doorways. You MUST ORDER enough magnets to space them every 12-18 inches depending upon your wind conditions. Fiberglass rods insert vertically up into the side bindings to distribute the load on the magnets and complete the seal between magnets.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnets-and-Rods-400x225-1-300x169.png"
                alt="Powerful Neodymium Magnets &amp; Fiberglass Rods"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="When Ordering Magnetic Doorways:" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                For each 8ft tall magnetic doorway in your project, you’ll need:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Magnetic-Doorway-Illustration-1920x1280-400x267-1-300x200.jpg"
                alt="When Ordering Magnetic Doorways:"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Stucco Strips" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                First, it is still a mystery why we call it a Stucco Strip, since it has absolutely nothing to do with stucco at all and please do not let the term confuse you. The name just stuck many years ago.  As you will learn, a stucco strip is simply a mini 3-inch wide panel. Ideally, you do not want to ever have to unsnap your curtain to draw it open.  There are times (typically against the house) where you may or may not want to unsnap the curtain from the house to draw it to an outer corner.   While it is possible to snap panels directly to the house, we never want you to have to unsnap curtains to open them because it is a pain in the neck with our hard action snaps. Snapping and unsnapping panels may require a ladder when a magnetic connection would be far easier to separate even when panels are tall and out of reach.Stucco Strips are NOT Required, but they sure make drawing far easier if there is no other magnetic connection on a particular side. Again, think of a Stucco Strip as a mini 3-inch wide panel. It is not a fastener, it is technically a panel in every way made of a solid webbing material.

One edge of the 3″ Stucco Strip snaps to a structural surface like a wall or column while the other edge is set up for a magnetic connection to a larger panel. The stucco strip always stays snapped to the wall, but because we can use the stucco strip to magnet to a larger panel, the larger panel can be drawn much easier without having to snap and unsnap your porch enclosure.

Because a Stucco Strip is just a mini panel, it is ordered from the “Panels Page” when you place your order. Like any other panel, you will also need to order the magnetic doorway hardware and marine snaps since stucco strips ALWAYS magnet to some larger panel and the other vertical edge ALWAYS snaps to some surface.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/STUCCO-STRIP-DIAGRAM-1024x791.png"
                alt="Stucco Strips"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/NO-STUCCO-STRIP-DIAGRAM-1024x791.png"
            alt="When Might a Stucco Strip be Useful? (Click to Enlarge)"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="When Ordering Stucco Strips:" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                For each 8ft tall stucco strip in your project, you’ll need:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Stucco-Strip-Illustration-1920x1280-400x267-1-300x200.jpg"
                alt="When Ordering Stucco Strips:"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Sealing the Base" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">There is something a bit counter intuitive about securing the base of your curtain. At first, you might think the best way to secure the bottom is to pull it straight down and perhaps tie it down or weight it, however the key to securing the base is horizontal tension. Weights do not work for outdoor curtains because they aren’t heavy enough and weights drive the base of the curtain into the floor wearing it faster. Instead, use Marine Snaps to secure the base and Elastic Cord described below.</Text>
              <Text className="text-gray-600">Imagine for a moment, we laid a 20ft belt from the Jolly Green Giant on the side walk. If you step on one end, and Mr. Jolly Green stands on the other end, it would be hard to lift the middle of the belt. The little bit of horizontal tension would be enough to keep the belt down. Marine snaps every 6 – 12ft help to maintain horizontal tension along the base especially in the corners. Generally, this is the spacing of support columns where marine snaps can be placed into the base of the column.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Elastic Cord – “Vertical Ribs”" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Commonly Used for Tracking Attachment With Path Inside Columns</Text>
              <Text className="text-gray-600">Curtains with tracking attachment typically take a path on the inside of your columns often with configurations where panels straddle a corner. Elastic cord “pinches” the curtain to the corner column. Think of elastic cord as a large bungee cord clipped vertically between 2 D-rings. Elastic cord is not attached to the curtain at all. It acts as a false column giving the curtain a corner rib inside the curtain to brace the curtain in the breeze and help to maintain horizontal tension.</Text>
              <Text className="text-gray-600">These vertical elastic cord ribs can be placed anywhere to add support to the curtain in breezy conditions (not just at corners). The best location is in front of columns to act as a giant rubber band to “pinch” the curtain to the column.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
