'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle,
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

export default function TrackingPage() {
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
              <SlidersHorizontal className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Outdoor Curtain Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Learn about our tracking system that allows your curtains to slide from side to side 
              for easy operation and beautiful decorative swags.
            </Text>
          </Stack>
        </section>

        {/* Tracking Overview */}
        <HeaderBarSection icon={SlidersHorizontal} label="How Tracking Works" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Tracking System Overview"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Our tracking system enables you to slide curtains open in lovely decorative swags. 
                The track is powder-coated aluminum that mounts to any overhead surface.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Slides from side to side effortlessly</ListItem>
                <ListItem variant="checked" iconColor="#406517">Powder-coated aluminum construction</ListItem>
                <ListItem variant="checked" iconColor="#406517">Under-mounted to overhead surfaces</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available for heights under 10ft and over 10ft</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Tracking vs Velcro */}
        <HeaderBarSection icon={CheckCircle} label="Tracking vs Velcro" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 !border-[#406517]/20">
              <Heading level={3} className="!mb-4 text-[#406517]">Tracking (Most Popular)</Heading>
              <Text className="text-gray-600 mb-4">
                Slides side-to-side for easy operation. Perfect for areas where you want to 
                open and close your curtains regularly.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Slides open and closed</ListItem>
                <ListItem variant="checked" iconColor="#406517">Beautiful swag appearance</ListItem>
                <ListItem variant="checked" iconColor="#406517">Easy daily operation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Premium option</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6 !border-[#003365]/20">
              <Heading level={3} className="!mb-4 text-[#003365]">Velcro (Fixed)</Heading>
              <Text className="text-gray-600 mb-4">
                Does NOT slide. A more economical option for areas where you don't need to 
                open and close the curtains frequently.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">Fixed in place</ListItem>
                <ListItem variant="checked" iconColor="#003365">More economical</ListItem>
                <ListItem variant="checked" iconColor="#003365">Seasonal installation</ListItem>
                <ListItem variant="checked" iconColor="#003365">Simple attachment</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Track Types */}
        <HeaderBarSection icon={SlidersHorizontal} label="Track Height Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Standard Track (Under 10ft Tall)</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Standard-Track.jpg"
                  alt="Standard tracking for under 10ft"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                For projects with ceiling heights under 10 feet. Most residential applications 
                use standard track.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Heavy Track (Over 10ft Tall)</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Heavy-Track.jpg"
                  alt="Heavy tracking for over 10ft"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                For taller projects over 10 feet. Heavier duty construction to support 
                larger curtain panels.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Choose Your Attachment?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Continue planning your project or get help from our expert team.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/plan">
                Continue Planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project">
                Get a Quote
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
