'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
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
  PowerHeaderTemplate,
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function SealingBasePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan-screen-porch" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Sealing The Base
            </Heading>
          </Stack>
        </section>

        {/* Horizontal Tension - the key concept from WordPress */}
        <HeaderBarSection icon={ShieldCheck} label="The Key to Sealing the Base: Horizontal Tension" variant="dark">
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

        {/* Elastic Cord */}
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

        {/* More Details */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Text className="text-gray-700 !mb-4">
            For complete details on marine snaps, magnetic doorways, stucco strips, and all fastening hardware, see our full Doorways &amp; Fasteners guide.
          </Text>
          <Button variant="primary" asChild>
            <Link href="/plan-screen-porch/magnetic-doorways">
              View Doorways &amp; Fasteners Guide
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Continue Planning Your Project</Heading>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/plan-screen-porch">
                Continue Planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/work-with-a-planner">
                Work With A Planner
              </Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
