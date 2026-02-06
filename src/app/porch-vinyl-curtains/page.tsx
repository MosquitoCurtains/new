'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Square,
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

export default function PorchVinylCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Porch Vinyl Curtains"
          subtitle="Heavy-duty clear vinyl curtains for your porch. Block wind, rain, and cold while maintaining your view. Custom-made to fit your space perfectly."
          videoId="FqNe9pDsZ8M"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* What Are Vinyl Curtains */}
        <HeaderBarSection icon={Square} label="What Are Porch Vinyl Curtains?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Vinyl-Curtains.jpg"
                alt="Clear vinyl curtains on porch"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Porch vinyl curtains are flexible clear panels that hang from your porch 
                ceiling or roof line. They can be rolled up or down depending on the weather.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">30-gauge marine-grade vinyl</ListItem>
                <ListItem variant="checked" iconColor="#003365">Roll up when not needed</ListItem>
                <ListItem variant="checked" iconColor="#003365">Blocks wind, rain, and cold</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-made to your dimensions</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Curtains vs Panels */}
        <HeaderBarSection icon={CheckCircle} label="Curtains vs Panels" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#003365]">Vinyl Curtains</Heading>
              <Text className="text-gray-600 mb-4">
                Hang from tracking or velcro at the top. Can be rolled up and secured 
                when not in use.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Roll up for storage</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Quick deployment</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Stays in place year-round</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4 text-[#003365]">Vinyl Panels</Heading>
              <Text className="text-gray-600 mb-4">
                Snap or zip in place. Removed entirely and stored flat during off-season.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Completely removable</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Store flat</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Seasonal installation</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Features */}
        <HeaderBarSection icon={Shield} label="Quality Features" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">UV Protected</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Won't yellow</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Crystal Clear</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Unobstructed view</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Marine Grade</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Built to last</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Custom Fit</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Made for you</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Get Custom Vinyl Curtains</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Every curtain is custom-made to fit your porch exactly. Get a quote today.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More
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
