'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  ThermometerSun,
  Sun,
  CheckCircle,
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

export default function PatioWinterizePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Winterize Your Patio"
          subtitle="Transform your covered patio into year-round living space with clear vinyl enclosures. Block the cold while keeping the view."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={CV_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Benefits */}
        <HeaderBarSection icon={Snowflake} label="Why Winterize Your Patio?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Winter-Patio.jpg"
                alt="Winterized patio with clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Your covered patio has a roof - all it needs is walls to become usable 
                year-round. Clear vinyl provides weather protection without blocking 
                your outdoor views.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Add usable square footage</ListItem>
                <ListItem variant="checked" iconColor="#003365">Keep wind and rain out</ListItem>
                <ListItem variant="checked" iconColor="#003365">Enjoy your patio in any season</ListItem>
                <ListItem variant="checked" iconColor="#003365">Remove panels for summer</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Patio vs Porch */}
        <HeaderBarSection icon={Sun} label="Patios vs Porches" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
              Whether you call it a patio or porch, if you have a covered outdoor space 
              with open sides, we can enclose it. The process is the same.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Attached to House</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Screened porches</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Covered patios</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Sunrooms</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Lanais</ListItem>
                </BulletedList>
              </Stack>
              <Stack gap="md">
                <Heading level={4} className="!text-[#003365]">Freestanding</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Gazebos</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pergolas</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pavilions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Pool houses</ListItem>
                </BulletedList>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What To Expect */}
        <HeaderBarSection icon={ThermometerSun} label="Temperature Expectations" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Wind Blocking</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Clear vinyl stops cold wind, instantly making your patio more comfortable.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">10-20° Warmer</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Without supplemental heat, expect 10-20 degrees of wind-chill protection.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Add Heat</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                With a small portable heater, your patio becomes comfortable all winter.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Winterize Your Patio?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for clear vinyl enclosures and extend your outdoor living season.
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

        <FinalCTATemplate 
          primaryCTALink="/start-project/clear-vinyl"
          variant="blue"
        />

      </Stack>
    </Container>
  )
}
