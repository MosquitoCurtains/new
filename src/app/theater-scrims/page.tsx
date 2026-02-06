'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Theater,
  Lightbulb,
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
} from '@/lib/design-system'

export default function TheaterScrimsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-full mx-auto flex items-center justify-center">
              <Theater className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Theater Scrims
            </Heading>
            <Text className="text-xl text-gray-600">
              Professional theatrical scrim fabric for stage productions, concerts, 
              events, and creative installations.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Get a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/raw-netting/scrim">
                  View Raw Scrim
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* What Is Scrim */}
        <HeaderBarSection icon={Theater} label="What Is Theatre Scrim?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Theatre-Scrim-Stage.jpg"
                alt="Theatre scrim on stage"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Theatre scrim is a specialized gauze-like fabric that creates magical visual 
                effects on stage. Its unique property: when lit from the front, it appears 
                opaque; when lit from behind, it becomes transparent.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#8B5CF6">Opaque with front lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Transparent with back lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Creates dramatic reveals</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Used by professional productions worldwide</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* The Scrim Effect */}
        <HeaderBarSection icon={Lightbulb} label="The Magical Scrim Effect" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-600 opacity-80 rounded-lg"></div>
                <Theater className="w-8 h-8 text-white relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Front Lit</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Audience sees the scrim surface - what's behind is hidden.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-amber-500 opacity-30 rounded-lg"></div>
                <Theater className="w-8 h-8 text-amber-400 relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Back Lit</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Scrim becomes transparent - reveals what's behind it.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-amber-500 opacity-50 rounded-lg"></div>
                <Theater className="w-8 h-8 text-white relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Transition</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Fade between states for stunning reveal moments.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={CheckCircle} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Theatre</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Plays & musicals</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Dance</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Ballet & modern</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Concerts</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Live music</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Corporate</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Events & reveals</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Film/TV</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Production sets</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Museums</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Exhibits</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Retail</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Window displays</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Art</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Installations</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Options */}
        <HeaderBarSection icon={Theater} label="What We Offer" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Raw Scrim Fabric</Heading>
              <Text className="text-gray-600 mb-4">
                Purchase scrim by the yard for your own fabrication. Available in various 
                widths and colors.
              </Text>
              <Button variant="outline" asChild size="sm">
                <Link href="/raw-netting/scrim">
                  View Raw Scrim
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Finished Scrims</Heading>
              <Text className="text-gray-600 mb-4">
                We can sew, hem, add grommets, and finish your scrim to your exact 
                specifications.
              </Text>
              <Button variant="outline" asChild size="sm">
                <Link href="/raw-netting/custom">
                  Custom Orders
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Flame Retardant */}
        <Card className="!p-6 !bg-[#8B5CF6]/5 !border-[#8B5CF6]/20">
          <Heading level={3} className="!mb-4 text-center">Flame Retardant Options</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto">
            Many venues require flame retardant (FR) fabrics. We offer both inherently 
            FR scrim and treated options that meet NFPA 701 standards. Ask us about 
            certification documentation for your venue.
          </Text>
        </Card>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#8B5CF6]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Order Theater Scrim?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing on raw scrim fabric or custom finished scrims.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting">
                View All Netting
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
