'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Tent,
  Users,
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

export default function TentsAwningsPage() {
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
            <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Tent className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Tents and Awnings
            </Heading>
            <Text className="text-xl text-gray-600">
              Soft-sided structures like pop-up canopies, event tents, and awnings can also 
              be enclosed with mosquito netting.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Tent} label="Enclosing Soft Structures" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Tent-Example.jpg"
                alt="Tent with mosquito netting"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Pop-up canopies, event tents, camping shelters, and retractable awnings present 
                unique challenges. The soft, flexible nature of the structure means standard 
                attachment methods don't always work.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Pop-up canopy enclosures</ListItem>
                <ListItem variant="checked" iconColor="#003365">Event tent screening</ListItem>
                <ListItem variant="checked" iconColor="#003365">Awning side panels</ListItem>
                <ListItem variant="checked" iconColor="#003365">Camping structure netting</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Types */}
        <HeaderBarSection icon={Tent} label="Common Soft Structure Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Pop-Up Canopies</Heading>
              <Text className="text-gray-600 !mb-0">
                10x10, 10x20, and other portable canopy frames. Custom netting panels 
                attach to the frame for temporary or seasonal use.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Event Tents</Heading>
              <Text className="text-gray-600 !mb-0">
                Larger frame tents and pole tents used for parties and events. 
                Screening entire sides or creating vestibule areas.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Awnings</Heading>
              <Text className="text-gray-600 !mb-0">
                Retractable or fixed awnings can have drop-down side panels to create 
                a screened outdoor space.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Talk to Planner */}
        <HeaderBarSection icon={Users} label="Planner Required for Soft Structures" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">These Projects Need Expert Help</Heading>
                <Text className="text-gray-600">
                  Soft structures vary wildly in construction. A planning call ensures we 
                  understand exactly what you're working with and can design the right solution.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Photos of your specific structure</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Discussion of attachment points</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Custom panel design</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Temporary vs permanent solutions</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free consultation. No obligation.
                </Text>
                <Button variant="primary" asChild>
                  <Link href="/start-project?mode=planner">
                    Schedule Planning Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Alternative: Raw Netting */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">DIY Option: Raw Netting</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
            For simpler applications or if you want to create your own solution, we also sell 
            raw netting by the yard that you can cut and attach yourself.
          </Text>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/raw-netting">
                Explore Raw Netting
                <ArrowRight className="ml-2 w-4 h-4" />
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
