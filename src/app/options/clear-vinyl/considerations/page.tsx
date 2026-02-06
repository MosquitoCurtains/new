'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  ThermometerSun,
  Droplets,
  Wind,
  Eye,
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
import { VIDEOS } from '@/lib/constants/videos'

export default function ClearVinylConsiderationsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              What Can Go Wrong With Clear Vinyl
            </Heading>
            <Text className="text-xl text-gray-600">
              We believe in transparency. Here's what you should know about clear vinyl 
              enclosures before you buy - and how we've solved these challenges.
            </Text>
          </Stack>
        </section>

        {/* Video Overview */}
        <YouTubeEmbed
          videoId={VIDEOS.CLEAR_VINYL_WHAT_CAN_GO_WRONG}
          title="What Can Go Wrong With Clear Vinyl"
          variant="card"
        />

        {/* Heat Buildup */}
        <HeaderBarSection icon={ThermometerSun} label="Heat Buildup" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Heat-Consideration.jpg"
                alt="Heat buildup consideration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> Clear vinyl creates a greenhouse effect. 
                  Direct sunlight can make enclosed spaces uncomfortably warm.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Our panels are designed to be easily 
                  removed or rolled up, allowing airflow when needed. Many customers also 
                  add vents or use a combination of clear vinyl and mesh panels.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Condensation */}
        <HeaderBarSection icon={Droplets} label="Condensation" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> When temperature differentials exist between 
                  inside and outside, condensation can form on the vinyl surface.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Proper ventilation reduces condensation. We 
                  recommend vents near the top and bottom of your enclosure. The condensation 
                  that does form wipes away easily.
                </Text>
              </Card>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Condensation-Example.jpg"
                alt="Condensation on clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Wind Noise */}
        <HeaderBarSection icon={Wind} label="Wind Interaction" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Wind-Consideration.jpg"
                alt="Wind and clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> In high winds, vinyl panels can flap or 
                  make noise if not properly secured.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Our marine-grade zippers and heavy-duty 
                  grommets keep panels secure. For high-wind areas, we recommend additional 
                  tie-down points and proper tensioning.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Clarity Over Time */}
        <HeaderBarSection icon={Eye} label="Clarity Over Time" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> Lower-quality vinyl can yellow, cloud, or 
                  become brittle over time from UV exposure.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> We use only premium 30-gauge marine vinyl 
                  with UV inhibitors. Properly cared for, our vinyl stays crystal clear 
                  for years. We've had customers with 10+ year old panels still looking great.
                </Text>
              </Card>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clarity-Example.jpg"
                alt="Clear vinyl clarity"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Our Commitment */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Our Commitment to Quality</Heading>
          <BulletedList spacing="md" className="max-w-2xl mx-auto">
            <ListItem variant="checked" iconColor="#003365">30-gauge premium marine vinyl (thicker than competitors)</ListItem>
            <ListItem variant="checked" iconColor="#003365">UV inhibitors to prevent yellowing</ListItem>
            <ListItem variant="checked" iconColor="#003365">Marine-grade Sunbrella fabric borders</ListItem>
            <ListItem variant="checked" iconColor="#003365">YKK marine zippers and stainless hardware</ListItem>
            <ListItem variant="checked" iconColor="#003365">Satisfaction guarantee</ListItem>
          </BulletedList>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Questions? We're Here to Help</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our planners can discuss your specific situation and help you determine 
            if clear vinyl is right for your space.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
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
