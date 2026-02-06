'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Maximize,
  Ruler,
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
                videoId="FqNe9pDsZ8M"
                title="Complex Project Planning"
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
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
