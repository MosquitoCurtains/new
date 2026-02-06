'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  LayoutGrid,
  Ruler,
  Camera,
Info} from 'lucide-react'
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

export default function TwoSidedPage() {
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
              <LayoutGrid className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              2-Sided Exposure
            </Heading>
            <Text className="text-xl text-gray-600">
              Your space has two open sides that need coverage. This is common for corner porches 
              and L-shaped spaces.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={LayoutGrid} label="What Is 2-Sided Exposure?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/2-Sided-Example.jpg"
                alt="2-Sided exposure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A 2-sided exposure means your space has TWO open sides. This typically happens 
                with corner porches where two adjacent sides face the yard.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Common configuration</ListItem>
                <ListItem variant="checked" iconColor="#406517">Corner posts may be involved</ListItem>
                <ListItem variant="checked" iconColor="#406517">Still DIY-friendly</ListItem>
                <ListItem variant="checked" iconColor="#406517">Multiple doorway options</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Scenarios */}
        <HeaderBarSection icon={Camera} label="Common 2-Sided Scenarios" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Corner Porch</Heading>
              <Text className="text-gray-600 !mb-0">
                L-shaped porch with two sides facing the yard and two sides against the house.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Attached Pergola</Heading>
              <Text className="text-gray-600 !mb-0">
                Pergola attached to house with two open sides facing the landscape.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Deck Addition</Heading>
              <Text className="text-gray-600 !mb-0">
                Covered deck extending from corner of home with adjacent open sides.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Corner Considerations */}
        <HeaderBarSection icon={Ruler} label="Corner Post Considerations" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="Y5hh50u3trQ"
              title="2-Sided Exposure Overview"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                The corner where your two sides meet requires special attention. We can seal 
                the curtains together at the corner post or wrap around seamlessly.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Corner post seal options</ListItem>
                <ListItem variant="checked" iconColor="#406517">Continuous wrap possible</ListItem>
                <ListItem variant="checked" iconColor="#406517">Photos help us plan corners</ListItem>
                <ListItem variant="checked" iconColor="#406517">Expert guidance available</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* How to Measure */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4">Measuring Tips for 2-Sided</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Stack gap="md">
              <Heading level={5} className="!text-[#406517]">For Each Side</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#406517">Measure width at top and bottom</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Measure height at each end</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Note column positions and sizes</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Identify any obstructions</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Heading level={5} className="!text-[#406517]">For The Corner</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#406517">Photo the corner post closeup</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Note corner post dimensions</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Show how ceiling meets at corner</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Include wide shot showing both sides</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Plan Your 2-Sided Project?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start with our instant quote or talk to a planner about your corner configuration.
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
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="2 Sided Exposure Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Tracking-400x208-1.jpg"
                  alt="2 Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Velcro-400x208-1.jpg"
                  alt="2 Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Irregular-Tracking-400x208-1.jpg"
                  alt="outdoor curtain track"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Irregular-Columns-W-Velcro-400x208-1.jpg"
                  alt="2 Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Planning a 2-sided Exposure" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">By now you have probably decided on a mesh-type & color and either tracking or Velcro® top attachment. Now you will choose a path and select a panel configuration to size individual panels for sealing to surfaces and positioning magnetic doorways.</Text>
              <Text className="text-gray-600">At this point, we recommend:</Text>
              <BulletedList>
                <li>Watch our planning tutorial to see an example laid out step by step. This is optional but very helpful.</li>
                <li>Determine a path either inside or outside your columns depending on your particular column type.</li>
                <li>Select a configuration to see our configuration-specific detailed planning instructions.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="1) Full Example Planning Session" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We have created full example planning session videos to show you how to plan an entire project! This begins with your panel configuration and goes through guidelines for ordering the hardware you need to put it all together. Choose the video with a tracking or Velcro® top attachment to get off to a fast start.</Text>
              <Text className="text-gray-600">Tracking Planning Session</Text>
              <Text className="text-gray-600">Velcro® Planning Session</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="2) Determine a Path" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">There is a subtle difference in the path curtains will take depending on what type of columns or you have. There are two types of paths to take, an inside hang (inside your columns), or an outside hang (outside your columns).</Text>
              <Text className="text-gray-600">We group columns into two categories – regular columns and irregular columns. The path you take depends on the “shape” of the columns that you have.</Text>
              <Text className="text-gray-600">If you have regular columns and can seal to a perfectly straight edge, we want to take advantage of that opportunity to maximize space and performance of your curtains. You can pass intermediate columns but it is best to terminate panels at CORNER regular columns.</Text>
              <Text className="text-gray-600">If you have irregularly shaped columns, we will need to plan such that we never have to directly seal to a non-linear edge so panels do not terminate at CORNER irregular columns.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Regular or Irregular Columns" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                A regular column has a straight edge that makes for a good sealing surface with marine snaps. We recommend an outside hang ending panels at corner columns.

Irregular columns do not have this straight edge to snap to, so panels will straddle irregular corner columns with our elastic cord to “pinch” the center of the straddling panel to an irregular corner column.

Regular Columns

Irregular Columns
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-1.jpg"
                alt="Regular or Irregular Columns"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="3) Click 1 of 4 Options For Panel Configuration Guidelines" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Now choose a configuration based on your column type for details specific to your application.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Tracking-400x208-1.jpg"
                alt="3) Click 1 of 4 Options For Panel Configuration Guidelines"
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
