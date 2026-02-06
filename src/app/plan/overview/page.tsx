'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Map,
  Camera,
  Ruler,
  CheckCircle,
  HelpCircle,
  Palette,
  Layers,
  DoorOpen,
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

export default function ProjectPlanningOverviewPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning Hub
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Map className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Project Planning Overview
            </Heading>
            <Text className="text-xl text-gray-600">
              Everything you need to know to plan your mosquito curtain or clear vinyl 
              enclosure project from start to finish.
            </Text>
          </Stack>
        </section>

        {/* Overview Video */}
        <HeaderBarSection icon={Map} label="Project Planning in 5 Minutes" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Complete Planning Overview"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Watch our quick overview video to understand the entire planning process. 
                You'll learn about measuring, choosing options, and what to expect.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Understand your project type</ListItem>
                <ListItem variant="checked" iconColor="#406517">Learn what measurements to take</ListItem>
                <ListItem variant="checked" iconColor="#406517">Choose between products</ListItem>
                <ListItem variant="checked" iconColor="#406517">Know what to expect</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Key Decisions */}
        <HeaderBarSection icon={HelpCircle} label="Key Decisions to Make" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#406517]">Mosquito Curtains or Clear Vinyl?</Heading>
              <Text className="text-gray-600 mb-4">
                <strong>Mosquito Curtains:</strong> Perfect for bug protection while maintaining airflow.
                Ideal for warm weather use.
              </Text>
              <Text className="text-gray-600 !mb-0">
                <strong>Clear Vinyl:</strong> Provides weather protection and extends your season.
                Blocks rain, wind, and cold while letting light through.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#003365]">Tracking or Velcro?</Heading>
              <Text className="text-gray-600 mb-4">
                <strong>Tracking:</strong> Curtains slide side-to-side for easy operation. 
                Premium option, ideal for frequent use.
              </Text>
              <Text className="text-gray-600 !mb-0">
                <strong>Velcro:</strong> Fixed position, more economical. Great for seasonal 
                installation or when budget is priority.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* What You'll Need */}
        <HeaderBarSection icon={Camera} label="What You'll Need to Get Started" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Photos</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Photos of each side of your space, from inside and outside. Include 
                ceiling, floor, and corner details.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Measurements</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Basic width and height measurements for each opening. Don't worry about 
                being perfect - we'll verify everything.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Preferences</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Think about color preferences, where you want doorways, and whether you 
                prefer tracking or velcro.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Resources */}
        <HeaderBarSection icon={Map} label="Planning Resources" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/plan/mesh-colors" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Heading level={5} className="!mb-1">Mesh Types & Colors</Heading>
                  <Text className="text-sm text-gray-500 !mb-0">Choose the right mesh for your needs</Text>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </Card>
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/plan/tracking" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Heading level={5} className="!mb-1">Tracking Systems</Heading>
                  <Text className="text-sm text-gray-500 !mb-0">Learn about sliding curtain options</Text>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </Card>
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/plan/magnetic-doorways" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DoorOpen className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Heading level={5} className="!mb-1">Magnetic Doorways</Heading>
                  <Text className="text-sm text-gray-500 !mb-0">Easy egress options</Text>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </Card>
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/plan/how-to-order" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Heading level={5} className="!mb-1">How to Order</Heading>
                  <Text className="text-sm text-gray-500 !mb-0">Step-by-step ordering process</Text>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Start Your Project?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Choose your path: get an instant quote online or schedule a free planning 
            call with our experts.
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
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
