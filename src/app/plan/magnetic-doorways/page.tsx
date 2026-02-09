'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  DoorOpen,
  Magnet,
  Bug,
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
  YouTubeEmbed,
  TwoColumn,
} from '@/lib/design-system'
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

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
