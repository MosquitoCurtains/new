'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Layers,
  CheckCircle,
  DollarSign,
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

export default function ThreeSidedRegularVelcroPage() {
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
              <span className="px-2 py-1 bg-[#003365]/10 text-[#003365] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Regular Velcro
            </Heading>
            <Text className="text-xl text-gray-600">
              A budget-friendly way to enclose your standard 3-sided porch with 
              fixed velcro-attached curtains.
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
                your 3-sided velcro project for the best results.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">How to measure each opening</ListItem>
                <ListItem variant="checked" iconColor="#003365">Planning your 3-sided layout</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro attachment points</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Velcro-Example.jpg"
                alt="3-sided velcro attachment example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Three open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Rectangular openings throughout</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro attachment (curtains fixed)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Most economical 3-sided option</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#003365]/5 !border-[#003365]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  Velcro-attached curtains stay in place during the season and can be 
                  easily removed for winter storage if desired.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Cost Comparison */}
        <HeaderBarSection icon={DollarSign} label="Budget-Friendly Choice" variant="dark">
          <Card className="!p-6 !bg-green-50 !border-green-200">
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg" className="text-center">
              <Stack gap="sm">
                <Heading level={4} className="!text-green-700">Save on Hardware</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  No track hardware to purchase. Adhesive velcro is included.
                </Text>
              </Stack>
              <Stack gap="sm">
                <Heading level={4} className="!text-green-700">Faster Install</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Velcro installation is quicker than mounting track systems.
                </Text>
              </Stack>
              <Stack gap="sm">
                <Heading level={4} className="!text-green-700">Still Custom-Made</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Same quality custom curtains, just attached differently.
                </Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Good For */}
        <Card className="!p-6">
          <Heading level={3} className="!mb-4 text-center">Velcro Works Great When...</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <BulletedList spacing="sm">
              <ListItem variant="checked" iconColor="#406517">You want to stay on budget</ListItem>
              <ListItem variant="checked" iconColor="#406517">Curtains will stay closed most of the time</ListItem>
              <ListItem variant="checked" iconColor="#406517">You prefer seasonal installation</ListItem>
            </BulletedList>
            <BulletedList spacing="sm">
              <ListItem variant="checked" iconColor="#406517">Quick DIY installation is important</ListItem>
              <ListItem variant="checked" iconColor="#406517">You have magnetic doorways for entry</ListItem>
              <ListItem variant="checked" iconColor="#406517">Simplicity is preferred</ListItem>
            </BulletedList>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get Your Quote?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            3-sided velcro projects are perfect for instant quoting.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan/3-sided">
                View Other Options
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="3-Sided Regular Velcro Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Black-Heavy-Mosquito-Mesh-768x576.jpg"
                  alt="3-Sided Regular Velcro"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/4-Panel-2-768x576.jpg"
                  alt="3-Sided Regular Velcro"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Irregular-Inside-Measure-768x576.jpg"
                  alt="3-Sided Regular Velcro"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/6-Panel-2-768x576.jpg"
                  alt="3-Sided Regular Velcro"
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
                An inside hang is almost never recommended. Instead, take advantage of the skeletal structure of your porch with an outside path for regularly-shaped columns, start with three panels (one for each side).

Only split panels where you need a magnetic doorway to enter and exit (3-6 panels total). Magnetic doorways for Velcro® top attachment work exactly the same way as they do for tracking attachment.

Outside Path – Regular Columns With Velcro®

Panel Configuration Example
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Black-Heavy-Mosquito-Mesh-768x576.jpg"
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
                The configuration diagrams below demonstrate an example from a top view using marine snaps, magnetic doorways, and stucco strips. Watch the video to get an overview on how to measure and some ideas for your panel configuration.

Planning Overview (2:26)
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/11/Irregular-Inside-Measure-768x576.jpg"
                alt="Measurement Tips"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Panel Adjustments (Or Use Calculator Below)" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Once you have your panel configuration, there are a few panel adjustments to make for each panel. The sum width of all your panels needs to be wider than your actual exposure for overlapping magnetic doors or overlapping a structural surface (like a wall or column) and a little more so that you can have a relaxed fit. Use our panel calculator below to help with your calculations.</Text>
              <Text className="text-gray-600">Width & Height Adjustments For Panels On Velcro®</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTSHEIGHT ADJUSTMENTS</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTSHEIGHT ADJUSTMENTS</Text>
              <BulletedList>
                <li>Automatically add 2-inches per panel regardless of width, then</li>
                <li>Add another 1-inch per panel for EACH edge that will snap to some surface</li>
                <li>Subtract 1-in for EACH edge connecting a Stucco Strip, and ignore width of stucco strip</li>
                <li>For Tracking Attachment: Add another 1-in per 10ft of panel width for relaxed fit.</li>
                <li>Velcro – Add 2″ to height from bottom of Velcro® mounting surface to the floor</li>
                <li>This provides 1″ of overlap on top and bottom for mounting panels on your Velcro® strip</li>
                <li>If height of a given panel varies by 2″ or less, use taller height</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Simple Panel Adjustment Calculator (if all heights are the same)" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This simple panel calculator will make your panel adjustments for each panel, one at a time!

Use this calculator by entering the 5 pieces of information required to adjust your panels. Repeat for each panel larger than a stucco strip.

NOTE: If the difference between all 4 heights is less than 1.5-inches, just use the tallest of the 4 heights. If the heights differs more than 1.5-inches, call in your order because we will need to taper the slope.
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
