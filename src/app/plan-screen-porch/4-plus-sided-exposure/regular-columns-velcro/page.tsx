'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Ruler, PlayCircle, ShoppingCart } from 'lucide-react'
import { Container, Stack, Grid, Text, Button, Card, Heading, BulletedList, ListItem, FinalCTATemplate, HeaderBarSection, YouTubeEmbed, PowerHeaderTemplate } from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import PanelCalculator from '@/components/plan/PanelCalculator'

export default function FourSidedRegularVelcroPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Hero */}
        <div>
          <Link href="/plan-screen-porch/4-plus-sided-exposure" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to 4+ Sided Exposure
          </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded">4+ Sided</span>
            <span className="px-2 py-1 bg-gray-100 rounded">Regular Columns</span>
            <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Velcro</span>
          </div>
          <PowerHeaderTemplate
            title="4+ Sided Exposure - Regular Columns With Velcro Attachment"
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        <HeaderBarSection icon={Ruler} label="Recommended Panel Configuration & Measuring" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-700">
              An inside hang is almost never recommended. Instead, take advantage of the skeletal structure of your porch with an outside path for regularly-shaped columns, start with one panel for each side.
            </Text>
            <Text className="text-gray-700">
              Only split panels where you need a magnetic doorway to enter and exit. Magnetic doorways for Velcro top attachment work exactly the same way as they do for tracking attachment.
            </Text>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={Ruler} label="Measurement Tips" variant="dark">
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#406517"><strong>IMPORTANT:</strong> Sum width of all sides = Sum of all panel widths.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Divide your project into at least 1 panel for each side ending panels at corner columns. Any side can be further split for a magnetic doorway.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure heights at all 5 corners from UNDERSIDE of header beam to floor, since Velcro is side-mounted.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure the &quot;widths&quot; of each side ALONG the path the curtain will take WITHOUT ANY overlap. Measure to the 1/2 inch and please be accurate.</ListItem>
          </BulletedList>
          <Text className="text-gray-600 mt-4">
            Watch the video using{' '}
            <Link href="/plan-screen-porch/magnetic-doorways" className="text-[#406517] underline font-medium">marine snaps, magnetic doorways, and stucco strips</Link>.
          </Text>
        </HeaderBarSection>

        <HeaderBarSection icon={PlayCircle} label="Planning Overview (2:26)" variant="dark">
          <div className="max-w-2xl mx-auto">
            <YouTubeEmbed videoId={VIDEOS.LAYOUT_PLANNING_OVERVIEW} title="Planning Overview" variant="card" />
          </div>
        </HeaderBarSection>

        <HeaderBarSection icon={Ruler} label="Panel Adjustments (Or Use Calculator Below)" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Once you have your panel configuration, there are a few panel adjustments. Use our panel calculator below.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card className="!p-6 !bg-white !border-[#406517]/20">
                <Heading level={4} className="!mb-4 text-[#406517]">WIDTH ADJUSTMENTS</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">Add another 1-in per 10ft of panel width for relaxed fit.</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Subtract 1-in for EACH edge connecting a Stucco Strip</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Add another 1-inch for EACH edge that will snap to some surface</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Automatically add 2-inches per panel regardless of width</ListItem>
                </BulletedList>
              </Card>
              <Card className="!p-6 !bg-white !border-[#003365]/20">
                <Heading level={4} className="!mb-4 text-[#003365]">HEIGHT ADJUSTMENTS</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">If height varies by 2&quot; or less, use taller height</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">This provides 1&quot; of overlap on top and bottom</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Velcro -- Add 2&quot; to height from bottom of Velcro mounting surface to floor</ListItem>
                </BulletedList>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <PanelCalculator />

        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/order-mesh-panels"><ShoppingCart className="w-5 h-5 mr-2" />I&apos;m Ready To Order<ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
