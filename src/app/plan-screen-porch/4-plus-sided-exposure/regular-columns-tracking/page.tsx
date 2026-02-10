'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Ruler, PlayCircle, ShoppingCart } from 'lucide-react'
import { Container, Stack, Grid, Text, Button, Card, Heading, BulletedList, ListItem, FinalCTATemplate, HeaderBarSection, YouTubeEmbed, PowerHeaderTemplate } from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import PanelCalculator from '@/components/plan/PanelCalculator'

export default function FourSidedRegularTrackingPage() {
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
            <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
          </div>
          <PowerHeaderTemplate
            title="4+ Sided Exposure - Regular Columns With Tracking Top Attachment"
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        <Card className="!p-6 !bg-white">
          <Stack gap="md">
            <Text className="text-gray-700">
              There are 4 sided wrap-around porches and sometimes 5 or even 6 sides. Everything here is conceptually the same for any number of sides, but just involves more panels. For this explanation, we will use 4-sided.
            </Text>
            <Text className="text-gray-700">
              Unless there is an obstruction or some other compelling reason, we recommend an &quot;outside path&quot; ending panels at corner columns. Each of the 4 sides will be split into 2 separate panels (or panel + stucco strip) for a total of 8 panels (5-sided = 10 panels, etc...). If for some reason you must take an inside path, select{' '}
              <Link href="/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment" className="text-[#406517] underline font-medium">Irregular Columns With Tracking</Link>.
            </Text>
            <Text className="text-gray-700">
              Typically, the track spans between house surfaces and columns, screws to the underside of the ceiling or header beam, and T-bones into the exterior edge of the column. Curtains are a bit wider than the track and a few inches will hang off the track to seal to outer edge of the column or house. Click photos to see in detail.
            </Text>
          </Stack>
        </Card>

        <HeaderBarSection icon={Ruler} label="Measurement Tips" variant="dark">
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#406517"><strong>IMPORTANT:</strong> Sum width of all sides = Sum of all panel widths.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">We then will divide your project into 8 individual panels (for ease of use) that can be split anywhere you choose.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">If for some reason you don&apos;t have a good under-mounting surface, remember you can make one by side-mounting a 2&quot;x 2&quot; wood strip, then under-mounting track to the wood strip.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure heights at all 5 corners from UNDERSIDE of track mounting surface to floor.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure the &quot;daylight widths&quot; or space BETWEEN house and columns on the sides ALONG the path the curtain will take WITHOUT ANY overlap (we&apos;ll adjust for overlap later). Measure to the 1/2 inch and please be accurate.</ListItem>
          </BulletedList>
          <Text className="text-gray-600 mt-4">
            The configuration diagrams demonstrate examples using{' '}
            <Link href="/plan-screen-porch/magnetic-doorways" className="text-[#406517] underline font-medium">marine snaps, magnetic doorways, and stucco strips</Link>. Watch the video for an overview.
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
              Once you have your panel configuration, there are a few panel adjustments to make for each panel. The sum width of all your panels needs to be wider than your actual exposure for overlapping magnetic doors or overlapping a structural surface (like a wall or column) and a little more so that you can have a relaxed fit. Use our panel calculator below to help with your calculations.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card className="!p-6 !bg-white !border-[#406517]/20">
                <Heading level={4} className="!mb-4 text-[#406517]">WIDTH ADJUSTMENTS (or use calculator below)</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">For Tracking Attachment: Add another 1-in per 10ft of panel width for relaxed fit</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Subtract 1-in for EACH edge connecting a Stucco Strip, and ignore width of stucco strip</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Add another 1-inch per panel for EACH edge that will snap to some surface</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Automatically add 2-inches per panel regardless of width, then</ListItem>
                </BulletedList>
              </Card>
              <Card className="!p-6 !bg-white !border-[#003365]/20">
                <Heading level={4} className="!mb-4 text-[#003365]">HEIGHT ADJUSTMENTS</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Measuring is done from the bottom of the track mounting surface to the floor.</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">NO height adjustments necessary for tracking. The 1-inch drop in the track will automatically give you a 1-inch overlap with the floor.</ListItem>
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
