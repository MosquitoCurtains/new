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
} from '@/lib/design-system'

export default function TwoSidedRegularTrackingPage() {
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
              <span className="px-2 py-1 bg-gray-100 rounded">Regular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              2-Sided Regular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 2-sided space has regular rectangular openings and you want tracking 
              for easy side-to-side curtain operation.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/2-Sided-Regular-Track.jpg"
                alt="2-sided regular tracking configuration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Two open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#406517">Rectangular/square openings (no arches)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking lets curtains slide open</ListItem>
                <ListItem variant="checked" iconColor="#406517">Perfect for daily opening/closing</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  <strong>Regular shape</strong> means your openings are rectangular with 
                  consistent height across the width. No arches, angles, or stepped ceilings.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Track at Corner */}
        <HeaderBarSection icon={SlidersHorizontal} label="Corner Track Solutions" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">L-Shaped Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Track bends at the corner, allowing curtains to slide around the corner post. 
                Great for creating one continuous opening feel.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Separate Tracks</Heading>
              <Text className="text-gray-600 !mb-0">
                Each side has its own track that terminates at the corner. Curtains seal 
                to the corner post for maximum bug protection.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Pricing Estimate */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Ready for a Quote?</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
            2-sided regular tracking projects are perfect for our instant quote tool. 
            Upload photos and get pricing in minutes.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan/2-sided">
                View Other Options
              </Link>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
