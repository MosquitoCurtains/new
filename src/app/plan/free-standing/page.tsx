'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Tent,
  Ruler,
  Users,
  Camera,
  Bug,
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
  TwoColumn,
} from '@/lib/design-system'

export default function FreeStandingPage() {
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
              Free-Standing Structures
            </Heading>
            <Text className="text-xl text-gray-600">
              Gazebos, pergolas, pavilions, and other structures not attached to your home 
              require special planning to ensure a complete seal.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Tent} label="Free-Standing Project Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Free-Standing-Example.jpg"
                alt="Free-standing structure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Free-standing structures present unique challenges and opportunities. Without 
                a wall to attach to, every side becomes an opening that needs planning.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">No house wall to rely on</ListItem>
                <ListItem variant="checked" iconColor="#003365">All sides need curtains</ListItem>
                <ListItem variant="checked" iconColor="#003365">Multiple entry point options</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom solutions for any shape</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Types */}
        <HeaderBarSection icon={Camera} label="Common Free-Standing Structures" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Gazebos</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Gazebo-Example.jpg"
                  alt="Gazebo with mosquito curtains"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                4, 6, or 8-sided gazebos. We've enclosed thousands of gazebos of every brand 
                and style imaginable.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Pergolas</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Pergola-Example.jpg"
                  alt="Pergola with mosquito curtains"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                Freestanding 4-post pergolas are perfect for curtain enclosures. Posts make 
                ideal attachment points.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Pavilions & Pool Houses</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Pavilion-Example.jpg"
                  alt="Pavilion with mosquito curtains"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                Larger pavilions and pool houses benefit from our heavy-duty tracking systems 
                for tall openings.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Structures</Heading>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Custom-Example.jpg"
                  alt="Custom structure with mosquito curtains"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 !mb-0">
                Unique shapes, unusual angles, challenging configurations. If it has posts 
                and a roof, we can enclose it.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Why Talk to Planner */}
        <HeaderBarSection icon={Users} label="Schedule a Planning Call" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Free-Standing = Planner Recommended</Heading>
                <Text className="text-gray-600">
                  Free-standing structures almost always benefit from a planning call. Our 
                  experts have seen every configuration and can help you avoid common mistakes.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Verify post compatibility</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan roof attachment points</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Design corner solutions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Optimize doorway placement</ListItem>
                </BulletedList>
              </Stack>
              <YouTubeEmbed
                videoId="FqNe9pDsZ8M"
                title="Free-Standing Planning"
                variant="card"
              />
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* What to Prepare */}
        <HeaderBarSection icon={Ruler} label="Before Your Call" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
              Have these photos ready to share during your planning call:
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
              <Stack gap="sm" className="text-center">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#003365]" />
                </div>
                <Text className="text-sm font-medium !mb-0">All Four Sides</Text>
                <Text className="text-xs text-gray-500 !mb-0">Wide shots from outside</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#003365]" />
                </div>
                <Text className="text-sm font-medium !mb-0">Corner Posts</Text>
                <Text className="text-xs text-gray-500 !mb-0">Close-ups of each post</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#003365]" />
                </div>
                <Text className="text-sm font-medium !mb-0">Roof/Ceiling</Text>
                <Text className="text-xs text-gray-500 !mb-0">Where track would attach</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#003365]" />
                </div>
                <Text className="text-sm font-medium !mb-0">Inside Views</Text>
                <Text className="text-xs text-gray-500 !mb-0">Looking out each side</Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Enclose Your Structure?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Schedule a free planning call. Our experts have enclosed thousands of 
            free-standing structures.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Schedule Free Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan">
                Back to Planning
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}

        <HeaderBarSection icon={Bug} label="We Want to Help" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/6-Navy-Clear-Vinyl-Enclosure.jpg"
                alt="Navy Clear Vinyl Enclosure"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                These can be a little tricky and we want to help to make sure everything is just right for you. That’s why we recommend that you contact us for this particular project type.
              </Text>
              <Text className="text-gray-600">
                We are about to make planning easier than you could have imagined with a planning session where we will draw on photos you send us as you watch in real time.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">We will direct you to a submission form.</ListItem>
                <ListItem variant="checked" iconColor="#406517">You will send photos and contact info.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We will call you and take care of the rest.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Get excited. We’re about to have some fun!</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>


        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
