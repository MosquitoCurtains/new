'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Ruler, PlayCircle, ShoppingCart } from 'lucide-react'
import { Container, Stack, Grid, Text, Button, Card, Heading, BulletedList, ListItem, FinalCTATemplate, HeaderBarSection, YouTubeEmbed } from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import PanelCalculator from '@/components/plan/PanelCalculator'

export default function FourSidedIrregularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Link href="/plan/4-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to 4+ Sided Exposure
        </Link>

        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">4+ Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Irregular Columns</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-3xl md:!text-4xl">
              4+ Sided Exposure - Irregular Columns With Tracking Attachment
            </Heading>
          </Stack>
        </section>

        <HeaderBarSection icon={Ruler} label="Recommended Panel Configuration & Measuring" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-700">
              If you have irregularly-shaped columns, you have one choice, an Inside Hang, where panels take a path INSIDE your columns.
            </Text>
            <Text className="text-gray-700">
              Projects with Irregular-shaped columns use multi-panel configurations. Because we cannot fasten a panel directly to the irregularly-shaped corner columns, panels will straddle the corner columns with elastic cord to &quot;pinch&quot; the curtain to the corner.
            </Text>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={Ruler} label="Measurement Tips" variant="dark">
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#406517"><strong>IMPORTANT:</strong> Sum width of all sides = Sum of all panel widths.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Panel breaks with magnetic doorways are wherever you like on each side.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Panels that straddle corner columns cannot be fastened directly to irregularly-shaped columns.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">If you don&apos;t have a good under-mounting surface, side-mount a 2&quot; x 2&quot; wood strip, then under-mount track to the wood strip.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure heights at all corners from underside of track mounting surface to floor. Heights could be different.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure the exposed widths of all sides ALONG the path your tracking will take WITHOUT ANY OVERLAP.</ListItem>
          </BulletedList>
          <Text className="text-gray-600 mt-4">
            Watch the video using{' '}
            <Link href="/plan/magnetic-doorways" className="text-[#406517] underline font-medium">marine snaps, magnetic doorways, and stucco strips</Link>.
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
                  <ListItem variant="arrow" iconColor="#406517">For Tracking: Add 1-in per 10ft of panel width for relaxed fit</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Subtract 1-in for EACH edge connecting a Stucco Strip</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Add 1-inch for EACH edge that will snap to some surface</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Automatically add 2-inches per panel regardless of width</ListItem>
                </BulletedList>
              </Card>
              <Card className="!p-6 !bg-white !border-[#003365]/20">
                <Heading level={4} className="!mb-4 text-[#003365]">HEIGHT ADJUSTMENTS</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Measuring is done from the bottom of the track mounting surface to the floor.</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">NO height adjustments necessary for tracking. The 1-inch drop provides floor overlap.</ListItem>
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

        <FinalCTATemplate productLine="mc" />
      </Stack>
    </Container>
  )
}
