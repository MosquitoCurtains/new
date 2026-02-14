'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ThermometerSun,
  Shield,
  AlertCircle,
  CheckCircle,
  Snowflake,
  Bug,
  Sparkle,
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
  PowerHeaderTemplate,
  CV_HERO_ACTIONS,
  TwoColumn,
} from '@/lib/design-system'

export default function InsulatedCurtainPanelsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Insulated Curtain Panels"
          subtitle="Looking for insulated outdoor panels? Our clear vinyl enclosures provide excellent weather protection for your porch or patio."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={CV_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Important Note */}
        <HeaderBarSection icon={AlertCircle} label="Important: About Insulation" variant="dark">
          <Card className="!p-6 !bg-amber-50 !border-amber-200">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={4} className="!text-amber-800">An Honest Note About Insulation</Heading>
                <Text className="text-amber-900">
                  While we don't sell traditional "insulated" panels with foam cores, our 
                  clear vinyl enclosures provide significant weather protection by blocking 
                  wind and creating a barrier against the elements.
                </Text>
                <Text className="text-amber-900 !mb-0">
                  For true thermal insulation, you'd need rigid panels or construction-grade 
                  windows. Our clear vinyl is designed for weather protection and extending 
                  your outdoor season - not replacing walls.
                </Text>
              </Stack>
              <BulletedList spacing="md">
                <ListItem variant="arrow" iconColor="#92400e">Blocks wind and wind chill</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Keeps rain and snow out</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Creates 10-20°F improvement</ListItem>
                <ListItem variant="arrow" iconColor="#92400e">Works great with portable heaters</ListItem>
              </BulletedList>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What We Offer */}
        <HeaderBarSection icon={Shield} label="What We Do Offer" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Winter.jpg"
                alt="Clear vinyl enclosure in winter"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our clear vinyl enclosures are the perfect solution for extending your 
                outdoor living season. Here's what they provide:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Wind blocking</ListItem>
                <ListItem variant="checked" iconColor="#003365">Rain and snow protection</ListItem>
                <ListItem variant="checked" iconColor="#003365">Clear, unobstructed views</ListItem>
                <ListItem variant="checked" iconColor="#003365">Easy installation and removal</ListItem>
                <ListItem variant="checked" iconColor="#003365">Year-round use with small heater</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <HeaderBarSection icon={ThermometerSun} label="How Clear Vinyl Helps" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Wind Barrier</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Stops cold wind from blowing through. This alone can make a 20°F difference 
                in perceived temperature.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ThermometerSun className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Solar Heat Gain</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Clear vinyl lets sunlight in, which warms the enclosed space naturally 
                during sunny days.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Heat Retention</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Add a small portable heater and the enclosed space retains heat effectively 
                for comfortable use.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* The Right Solution */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Is Clear Vinyl Right For You?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Stack gap="md">
              <Text className="font-semibold text-green-700">Clear Vinyl IS Great For:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#15803d">Extending outdoor season</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Wind and rain protection</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Maintaining your view</ListItem>
                <ListItem variant="checked" iconColor="#15803d">DIY installation</ListItem>
                <ListItem variant="checked" iconColor="#15803d">Seasonal use with portable heat</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Text className="font-semibold text-red-700">Clear Vinyl Is NOT For:</Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#b91c1c">True thermal insulation (R-value)</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Replacing windows or walls</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Heated living space conversion</ListItem>
                <ListItem variant="arrow" iconColor="#b91c1c">Energy-efficient enclosures</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready for Weather Protection?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for clear vinyl enclosures and extend your outdoor season.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get Clear Vinyl Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn About Clear Vinyl
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
