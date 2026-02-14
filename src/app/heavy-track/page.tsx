'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Layers,
  Wind,
  CheckCircle,
  AlertCircle,
  Ruler,
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
  WhyChooseUsTemplate,
} from '@/lib/design-system'

export default function HeavyTrackPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Layers className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Heavy Duty Track System
            </Heading>
            <Text className="text-xl text-gray-600">
              Our upgraded tracking system for larger openings, heavier panels, or 
              high-wind areas. Built for commercial-grade durability.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project?mode=quote">
                  Get a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/plan-screen-porch/outdoor-curtain-tracking">
                  Compare Track Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* What Is Heavy Track */}
        <HeaderBarSection icon={Layers} label="Heavy Duty Track System" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Heavy-Track-System.jpg"
                alt="Heavy duty track system"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our heavy duty track is an upgraded version of our standard tracking 
                system. It uses thicker aluminum, larger rollers, and reinforced 
                mounting hardware for demanding applications.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Thicker aluminum extrusion</ListItem>
                <ListItem variant="checked" iconColor="#406517">Heavy-duty rollers and carriers</ListItem>
                <ListItem variant="checked" iconColor="#406517">Reinforced mounting brackets</ListItem>
                <ListItem variant="checked" iconColor="#406517">Smooth, quiet operation</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* When to Use */}
        <HeaderBarSection icon={CheckCircle} label="When Heavy Track Is Recommended" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-blue-600" />
              </div>
              <Heading level={4} className="!mb-2">Large Openings</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                For openings over 12 feet wide or panels over 10 feet tall. Heavy 
                track handles the extra weight with ease.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
              <Heading level={4} className="!mb-2">Heavy Panels</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Clear vinyl panels or thick shade mesh weigh more than standard netting. 
                Heavy track is built for the load.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full mb-4 flex items-center justify-center">
                <Wind className="w-6 h-6 text-amber-600" />
              </div>
              <Heading level={4} className="!mb-2">High Wind Areas</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Coastal properties and open areas with consistent wind benefit from 
                the extra rigidity of heavy track.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Standard vs Heavy */}
        <HeaderBarSection icon={AlertCircle} label="Standard vs Heavy Track" variant="dark">
          <Card className="!p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4}>Standard Track</Heading>
                <Text className="text-sm text-gray-600">
                  Perfect for most residential applications
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#406517">Openings up to 12 feet</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Mosquito mesh panels</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Normal wind conditions</ListItem>
                  <ListItem variant="checked" iconColor="#406517">More economical</ListItem>
                </BulletedList>
              </Stack>
              <Stack gap="md">
                <Heading level={4}>Heavy Duty Track</Heading>
                <Text className="text-sm text-gray-600">
                  For demanding applications
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#003365">Openings over 12 feet</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Clear vinyl or heavy mesh</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Coastal or high-wind areas</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Commercial applications</ListItem>
                </BulletedList>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Heavy Duty Track?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Not sure which track system you need? Our planners will recommend the 
            right solution based on your specific situation.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
