'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Square,
  Shield,
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

export default function PorchVinylPanelsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <PowerHeaderTemplate
          title="Porch Vinyl Panels"
          subtitle="Custom clear vinyl panels for your porch. Weather protection that doesn't block your view. Marine-grade quality built to last."
          videoId="ca6GufadXoE"
          variant="compact"
          actions={CV_HERO_ACTIONS}
        />

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* What Are Vinyl Panels */}
        <HeaderBarSection icon={Square} label="What Are Porch Vinyl Panels?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Vinyl-Panels.jpg"
                alt="Clear vinyl panels on porch"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Porch vinyl panels are clear, flexible panels made from marine-grade vinyl that 
                cover the open areas of your porch. They provide weather protection while 
                maintaining your view.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">30-gauge marine-grade vinyl</ListItem>
                <ListItem variant="checked" iconColor="#003365">Crystal clear for unobstructed views</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-fitted to your porch</ListItem>
                <ListItem variant="checked" iconColor="#003365">Removable for warm weather</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Features */}
        <HeaderBarSection icon={Shield} label="Panel Features" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">UV Protected</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                UV inhibitors prevent yellowing and keep panels crystal clear for years.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Zippered Doorways</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Easy entry and exit through zippered sections in your panels.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-2">Sunbrella Borders</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Professional fabric borders in your choice of colors for a finished look.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How They Attach */}
        <HeaderBarSection icon={CheckCircle} label="Attachment Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Snap Attachment</Heading>
              <Text className="text-gray-600 mb-4">
                DOT snaps attach panels to your porch structure. Easy on/off for 
                seasonal use.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Quick removal</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Secure attachment</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Marine-grade hardware</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Zipper Connection</Heading>
              <Text className="text-gray-600 mb-4">
                Panels zip together at the corners for a continuous weather seal 
                around your porch.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Weather-tight seal</ListItem>
                <ListItem variant="arrow" iconColor="#003365">YKK marine zippers</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Professional finish</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Get Custom Vinyl Panels</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Every panel is custom-made to fit your porch exactly. Get a quote today.
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
