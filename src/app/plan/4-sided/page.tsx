'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Maximize,
  Ruler,
  Users,
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

export default function FourSidedPage() {
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
            <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Maximize className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              4+ Sided Exposure
            </Heading>
            <Text className="text-xl text-gray-600">
              Your space has four or more open sides. This is common for gazebos, pergolas, 
              and freestanding structures.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Maximize} label="What Is 4+ Sided Exposure?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/4-Sided-Example.jpg"
                alt="4+ Sided exposure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A 4+ sided exposure means your structure is open on all sides. This includes 
                gazebos, pergolas, pavilions, and other freestanding structures.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Complete enclosure</ListItem>
                <ListItem variant="checked" iconColor="#003365">Multiple entry points possible</ListItem>
                <ListItem variant="checked" iconColor="#003365">All corners need attention</ListItem>
                <ListItem variant="checked" iconColor="#003365">Hexagonal/octagonal shapes included</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Structures */}
        <HeaderBarSection icon={Maximize} label="Common 4+ Sided Structures" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-2">Gazebos</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                4, 6, or 8-sided
              </Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-2">Pergolas</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Freestanding 4-post
              </Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-2">Pavilions</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Open-air structures
              </Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-2">Pool Houses</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                4-sided cabanas
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Why Talk to a Planner */}
        <HeaderBarSection icon={Users} label="We Recommend Talking to a Planner" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Complex Projects Need Expert Eyes</Heading>
                <Text className="text-gray-600">
                  4+ sided projects have multiple corners, potential odd angles, and lots of 
                  design decisions. A 15-minute video call saves hours of guesswork.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">All corners planned correctly</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Optimal doorway placement</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Custom measurements</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Special shape accommodation</ListItem>
                </BulletedList>
              </Stack>
              <YouTubeEmbed
                videoId="Y5hh50u3trQ"
                title="4+ Sided Exposure Overview"
                variant="card"
              />
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What to Prepare */}
        <HeaderBarSection icon={Ruler} label="What to Have Ready" variant="dark">
          <Card className="!p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Photos Needed</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Wide shot from each side (outside)</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Inside shots looking out each direction</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Close-up of each corner post</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Ceiling/roof detail at corners</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Floor/base condition</ListItem>
                </BulletedList>
              </Stack>
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Measurements Helpful</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Overall width and depth</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Height at posts</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Post dimensions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Angle measurements (if not square)</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Don't worry if approximate - we'll verify</ListItem>
                </BulletedList>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Schedule Your Free Planning Call</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our experts have done thousands of 4+ sided projects. Let us help you get it right.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Schedule Free Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan">
                Back to Planning
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="4 Plus Sided Exposure Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Tracking-400x208-1.jpg"
                  alt="4 Plus Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Velcro-400x208-1.jpg"
                  alt="4 Plus Sided Exposure"
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
                  alt="4 Plus Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Planning a 4+ Sided Exposure" variant="green">
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
