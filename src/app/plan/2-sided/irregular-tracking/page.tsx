'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Ruler,
  PlayCircle,
  ShoppingCart,
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
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import PanelCalculator from '@/components/plan/PanelCalculator'

export default function TwoSidedIrregularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan/2-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to 2-Sided Exposure
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">2-Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Irregular Columns</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-3xl md:!text-4xl">
              2 Sided Exposure - Irregular Columns With Tracking Attachment
            </Heading>
          </Stack>
        </section>

        {/* Recommended Panel Configuration */}
        <HeaderBarSection icon={Ruler} label="Recommended Panel Configuration & Measuring" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-700">
              If you have irregularly-shaped columns, you have one choice, an Inside Hang, where panels take a path INSIDE your columns.
            </Text>
            <Text className="text-gray-700">
              Projects with Irregular-shaped columns are generally 3 panel configurations for ease of use and natural looking swags. Because we cannot fasten a panel directly to the irregularly-shaped corner column, the second panel will straddle the corner column.
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* Measurement Tips */}
        <HeaderBarSection icon={Ruler} label="Measurement Tips" variant="dark">
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#406517"><strong>IMPORTANT:</strong> Sum width of all sides = Sum of all panel widths.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">2 Panel breaks with magnetic doorways are wherever you like on each of the 2 sides.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">We divide your project into 3 individual panels where the second panel will straddle the outer corner.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">If for some reason you don&apos;t have a good under-mounting surface, remember you can make one by side-mounting a 2&quot; x 2&quot; wood strip, then under-mounting track to the wood strip.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure heights at all 3 corners from underside of track mounting surface to floor. The 3 heights could be different and you cannot assume all heights are the same.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Measure the exposed widths of both sides ALONG the path your tracking will take WITHOUT ANY OVERLAP (which we will adjust for momentarily).</ListItem>
          </BulletedList>
          <Text className="text-gray-600 mt-4">
            The configuration diagrams below demonstrate two examples from a top view using{' '}
            <Link href="/plan/magnetic-doorways" className="text-[#406517] underline font-medium">marine snaps, magnetic doorways, and stucco strips</Link>. 
            Watch the video to get an overview on how to measure and some ideas for your panel configuration.
          </Text>
        </HeaderBarSection>

        {/* Planning Overview Video */}
        <HeaderBarSection icon={PlayCircle} label="Planning Overview (2:26)" variant="dark">
          <div className="max-w-2xl mx-auto">
            <YouTubeEmbed
              videoId={VIDEOS.LAYOUT_PLANNING_OVERVIEW}
              title="Planning Overview"
              variant="card"
            />
          </div>
        </HeaderBarSection>

        {/* Panel Adjustments */}
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

        {/* Panel Calculator */}
        <PanelCalculator />

        {/* Ready to Order CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/order-mesh-panels">
                <ShoppingCart className="w-5 h-5 mr-2" />
                I&apos;m Ready To Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
