'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  ThermometerSun,
  Shield,
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
  WhyChooseUsTemplate,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

export default function PorchWinterizePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Winterize Your Porch"
          subtitle="Extend your outdoor living season with clear vinyl enclosures. Keep the cold out and the warmth in - enjoy your porch year-round."
          videoId="FqNe9pDsZ8M"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Benefits */}
        <HeaderBarSection icon={Snowflake} label="Why Winterize Your Porch?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Winter-Porch.jpg"
                alt="Winterized porch with clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A winterized porch becomes usable square footage even in the coldest months. 
                Clear vinyl enclosures block wind, rain, and snow while letting natural light 
                flood in.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Extend your outdoor season by months</ListItem>
                <ListItem variant="checked" iconColor="#003365">Block cold wind and precipitation</ListItem>
                <ListItem variant="checked" iconColor="#003365">Maintain your view with crystal clear vinyl</ListItem>
                <ListItem variant="checked" iconColor="#003365">Add a small heater for cozy warmth</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <HeaderBarSection icon={Shield} label="How Porch Winterization Works" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-[#003365]">1</span>
              </div>
              <Heading level={4} className="!mb-2">Clear Vinyl Panels</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Custom-fitted panels cover your open porch areas while maintaining visibility.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-[#003365]">2</span>
              </div>
              <Heading level={4} className="!mb-2">Weather Seal</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Panels zip or snap together to create a weather-tight seal against the elements.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-[#003365]">3</span>
              </div>
              <Heading level={4} className="!mb-2">Easy Entry</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Zippered doorways provide easy access while maintaining the seal.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Temperature Info */}
        <HeaderBarSection icon={ThermometerSun} label="What To Expect" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Without Supplemental Heat</Heading>
                <Text className="text-gray-600 !mb-0">
                  Clear vinyl alone typically provides 10-20 degrees of wind protection. 
                  On a 40°F windy day, your porch will feel like 50-60°F.
                </Text>
              </Stack>
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">With a Small Heater</Heading>
                <Text className="text-gray-600 !mb-0">
                  Add a portable space heater and your enclosed porch becomes comfortable 
                  even in freezing temperatures. Many customers use their porches year-round.
                </Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Winterize Your Porch?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for clear vinyl enclosures and start enjoying your porch year-round.
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
