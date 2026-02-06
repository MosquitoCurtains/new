'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle,
  PlayCircle,
, Camera, Info} from 'lucide-react'
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
, TwoColumn} from '@/lib/design-system'

export default function ThreeSidedRegularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan/3-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to 3-Sided Exposure
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">3-Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Regular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Regular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              The classic screened porch setup - three rectangular sides with sliding 
              track for easy curtain operation.
            </Text>
          </Stack>
        </section>

        {/* Layout Planning Video */}
        <HeaderBarSection icon={PlayCircle} label="Layout Planning Overview" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="MDPYl7gN4Ec"
              title="Layout Planning Overview"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Watch our layout planning overview to understand how to measure and plan 
                your 3-sided regular tracking project for the best results.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">How to measure each opening</ListItem>
                <ListItem variant="checked" iconColor="#406517">Planning your 3-sided layout</ListItem>
                <ListItem variant="checked" iconColor="#406517">Corner and doorway planning</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Regular-Track.jpg"
                alt="3-sided regular tracking configuration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Three open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#406517">Rectangular openings throughout</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking for sliding operation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Most popular configuration</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  This is our most common project type. Thousands of homeowners have enclosed 
                  their standard screened porches with this setup.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Corner Options */}
        <HeaderBarSection icon={SlidersHorizontal} label="Corner Track Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Continuous Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Track runs continuously around all three sides. Curtains can slide 
                around corners for maximum flexibility.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Separate Per Side</Heading>
              <Text className="text-gray-600 !mb-0">
                Each side has independent track. More common and easier to install, 
                with curtains sealing at corner posts.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* DIY Friendly */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Perfect for DIY!</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
            3-sided regular tracking is straightforward enough for DIY but complex 
            enough to benefit from our instant quote tool's guidance.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
              </Link>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="3-Sided Regular Tracking Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/07/00-Black-Heavy-Mosquito-Mesh-768x576.jpg"
                  alt="3-Sided Regular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/5-stucco-768x576.jpg"
                  alt="3-Sided Regular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-Sided-Regular-Measure-768x576.png"
                  alt="3-Sided Regular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/6-Panels-Regular-768x576.jpg"
                  alt="3-Sided Regular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Panel-Example-600x450-1.jpg"
                  alt="Mosquito Netting Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Recommended Panel Configuration &amp; Measuring" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Unless there is an obstruction or some other compelling reason, we recommend an “outside path” ENDING panels at corner columns. Each of the 3 sides will be split into 2 separate panels (or panel + stucco strip) for a total of 6 panels. If for some reason you must take an inside path, select Irregular Columns With Tracking.

Typically, the track spans between house surfaces and columns, screws to the underside of the ceiling or header beam, and T-bones into the exterior edge of the column. Curtains are a bit wider than the track and a few inches will hang off the track to seal to outer edge of the column or house. Click photos to see in detail.

Outside Path – Regular Columns With Tracking

Panel Configuration Example
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/07/00-Black-Heavy-Mosquito-Mesh-768x576.jpg"
                alt="Recommended Panel Configuration &amp; Measuring"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Measurement Tips" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                The configuration diagrams below demonstrate two examples from a top view using marine snaps, magnetic doorways, and stucco strips. Watch the video to get an overview on how to measure and some ideas for your panel configuration.

Planning Overview (2:26)
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-Sided-Regular-Measure-768x576.png"
                alt="Measurement Tips"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Panel Adjustments (Or Use Calculator Below)" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Once you have your panel configuration, there are a few panel adjustments to make for each panel. The sum width of all your panels needs to be wider than your actual exposure for overlapping magnetic doors or overlapping a structural surface (like a wall or column) and a little more so that you can have a relaxed fit. Use our panel calculator below to help with your calculations.</Text>
              <Text className="text-gray-600">Width & Height Adjustments For Panels On Tracking</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTS (or use calculator below)HEIGHT ADJUSTMENTS</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTS (or use calculator below)HEIGHT ADJUSTMENTS</Text>
              <BulletedList>
                <li>Automatically add 2-inches per panel regardless of width, then</li>
                <li>Add another 1-inch per panel for EACH edge that will snap to some surface</li>
                <li>Subtract 1-in for EACH edge connecting a Stucco Strip, and ignore width of stucco strip</li>
                <li>For Tracking Attachment: Add another 1-in per 10ft of panel width for relaxed fit</li>
                <li>NO height adjustments necessary for tracking. The 1-inch drop in the track will automatically give you a 1-inch overlap with the floor.</li>
                <li>Measuring is done from the bottom of the track mounting surface to the floor.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Simple Panel Adjustment Calculator (if all heights are the same)" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This simple panel calculator will make your panel adjustments for each panel, one at a time!

Use this calculator by entering the 5 pieces of information required to adjust your panels. Repeat for each panel larger than a stucco strip.

NOTE: If the difference between all 4 heights is less than 1.5-inches, just use the tallest of the 4 heights. If the heights differs more than 1.5-inches, call in your order because we will need to taper the slope.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Panel-Example-600x450-1.jpg"
                alt="Mosquito Netting Panels"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
