'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Box,
  Ruler,
  Camera,
  Users,
} from 'lucide-react'
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
} from '@/lib/design-system'

export default function ThreeSidedPage() {
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
              <Box className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Exposure
            </Heading>
            <Text className="text-xl text-gray-600">
              Your space has three open sides. This is the most common configuration for 
              standard screened porches attached to homes.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Box} label="What Is 3-Sided Exposure?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Example.jpg"
                alt="3-Sided exposure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A 3-sided exposure is the classic screened porch configuration. One side is 
                against the house, and three sides are open to the outdoors.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Most popular configuration</ListItem>
                <ListItem variant="checked" iconColor="#406517">Multiple doorway locations</ListItem>
                <ListItem variant="checked" iconColor="#406517">Two corner transitions</ListItem>
                <ListItem variant="checked" iconColor="#406517">DIY installation friendly</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Scenarios */}
        <HeaderBarSection icon={Camera} label="Common 3-Sided Scenarios" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Standard Screened Porch</Heading>
              <Text className="text-gray-600 !mb-0">
                Classic rectangular porch attached to the back of the house.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Covered Deck</Heading>
              <Text className="text-gray-600 !mb-0">
                Roof-covered deck extending from home with three open sides.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Attached Gazebo</Heading>
              <Text className="text-gray-600 !mb-0">
                Gazebo structure connected to home on one side.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planning Video */}
        <HeaderBarSection icon={Ruler} label="Planning Your 3-Sided Project" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="3-Sided Planning Guide"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                With 3 sides to plan, it helps to think of each side independently, then 
                plan how they connect at the corners.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Measure each side separately</ListItem>
                <ListItem variant="checked" iconColor="#406517">Document corner post details</ListItem>
                <ListItem variant="checked" iconColor="#406517">Plan doorway locations</ListItem>
                <ListItem variant="checked" iconColor="#406517">Consider tracking vs. velcro per side</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Recommendation */}
        <HeaderBarSection icon={Users} label="Recommendation: Talk to a Planner" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Free Planning Session</Heading>
                <Text className="text-gray-600">
                  For 3-sided projects, we recommend a quick video call with one of our expert 
                  planners. They'll help you:
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Optimize doorway placement</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan corner transitions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Choose tracking vs. velcro for each side</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Get exact measurements</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center">
                <Text className="text-sm text-gray-500 mb-4">
                  No obligation. No pressure. Just expert help.
                </Text>
                <Button variant="primary" asChild>
                  <Link href="/start-project?mode=planner">
                    Schedule Free Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Still DIY */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Prefer to DIY? That Works Too!</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
            If you're comfortable measuring and planning yourself, our instant quote tool 
            can handle 3-sided projects. Just take plenty of photos!
          </Text>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/start-project?mode=quote">
                Try Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Start?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the path that works best for you.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
