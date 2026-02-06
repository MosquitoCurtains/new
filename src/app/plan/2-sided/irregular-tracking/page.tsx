'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  AlertTriangle,
  Users,
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
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Irregular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              2-Sided Irregular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 2-sided space has arches, angles, or varying heights, and you want 
              sliding tracking for curtain operation.
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
                your irregular-shaped 2-sided tracking project.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">How to measure irregular openings</ListItem>
                <ListItem variant="checked" iconColor="#003365">Planning your layout</ListItem>
                <ListItem variant="checked" iconColor="#003365">Working with arches and angles</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Irregular-Example.jpg"
                alt="Irregular shape example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Two open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings</ListItem>
                <ListItem variant="checked" iconColor="#003365">Tracking for side-to-side operation</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom solutions required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Irregular shapes</strong> include arches, peaked ceilings, 
                  varying heights, angled openings, or any non-rectangular configuration.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Special Considerations */}
        <HeaderBarSection icon={SlidersHorizontal} label="Tracking with Irregular Shapes" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Track Follows Shape</Heading>
              <Text className="text-gray-600 !mb-0">
                Our powder-coated aluminum track can be bent and shaped to follow your 
                ceiling contours, including gentle curves and angles.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Panel Shapes</Heading>
              <Text className="text-gray-600 !mb-0">
                Curtain panels are custom-cut to match your exact opening shape. Arched 
                tops, angled bottoms - we can accommodate almost anything.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planner Required */}
        <HeaderBarSection icon={Users} label="Planner Recommended" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Let's Plan This Together</Heading>
                <Text className="text-gray-600">
                  Irregular shapes require careful planning to ensure proper fit. A quick 
                  video call lets us see your exact configuration and design the right solution.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Verify track routing</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan panel shapes</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Ensure proper measurements</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Get accurate pricing</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free consultation. No obligation.
                </Text>
                <Button variant="primary" asChild>
                  <Link href="/start-project?mode=planner">
                    Schedule Planning Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="2-Sided Irregular Tracking Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/3-panel-2-sided-irregular-768x576.png"
                  alt="2-Sided Irregular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/2-Sided-Measure-Irregular-768x576.jpg"
                  alt="2-Sided Irregular Tracking"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/2-Panels-SS-2-Sided-768x576.png"
                  alt="2-Sided Irregular Tracking"
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
                If you have irregularly-shaped columns, you have one choice, an Inside Hang, where panels take a path INSIDE your columns.

Projects with Irregular-shaped columns are generally 3 panel configurations for ease of use and natural looking swags. Because we cannot fasten a panel directly to the irregularly-shaped corner column, the second panel will straddle the corner column.

Inside Path – Irregular Columns With Tracking

Panel Configuration Example
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/2-Sided-Irregular-Columns-Tracking-Inside-Hang.jpg"
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
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/2-Sided-Measure-Irregular-768x576.jpg"
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
