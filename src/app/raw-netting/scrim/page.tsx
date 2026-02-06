'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Theater,
  Lightbulb,
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

export default function ScrimPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/raw-netting" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Raw Netting
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full mx-auto flex items-center justify-center">
              <Theater className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Theatre Scrim
            </Heading>
            <Text className="text-xl text-gray-600">
              Lightweight theatrical netting for stage productions, concerts, events, 
              and creative installations.
            </Text>
          </Stack>
        </section>

        {/* What Is Scrim */}
        <HeaderBarSection icon={Theater} label="What Is Theatre Scrim?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Theatre-Scrim.jpg"
                alt="Theatre scrim material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Theatre scrim is a specialized gauze-like fabric used in stage productions. 
                It appears opaque when lit from the front, but becomes transparent when 
                lit from behind - creating magical reveal effects.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#8B5CF6">Appears opaque with front lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Becomes transparent with back lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Creates dramatic reveal effects</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Flame retardant options available</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Lighting Effect */}
        <HeaderBarSection icon={Lightbulb} label="The Scrim Effect" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-600 rounded-lg"></div>
              </div>
              <Heading level={5} className="!mb-2">Front Lit (Opaque)</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                When lit from the front, the scrim appears solid and hides what's behind it.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-20 h-20 bg-amber-400 rounded-lg opacity-70"></div>
              </div>
              <Heading level={5} className="!mb-2">Back Lit (Transparent)</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                When lit from behind, the scrim becomes transparent, revealing what's there.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={Theater} label="Common Uses" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Theatre</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Stage productions</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Concerts</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Live performances</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Events</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Corporate & private</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Installations</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Art & displays</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <Card className="!p-6 !bg-[#8B5CF6]/5 !border-[#8B5CF6]/20">
          <Heading level={3} className="!mb-4 text-center">Available in Multiple Colors</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto">
            Theatre scrim is available in black, white, gray, and other colors. 
            Black is most common for theatrical use. Contact us for color availability.
          </Text>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#8B5CF6]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Theatre Scrim?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing on theatre scrim and theatrical netting.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/theater-scrims">
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
