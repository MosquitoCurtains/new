'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Wrench,
  Clock,
  DollarSign,
  CheckCircle,
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
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function ClearVinylDIYPage() {
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
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Wrench className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              DIY Clear Vinyl Installation
            </Heading>
            <Text className="text-xl text-gray-600">
              Save thousands by installing your clear vinyl enclosure yourself. It's easier 
              than you think - here's why self-installation is a great choice.
            </Text>
          </Stack>
        </section>

        {/* Why DIY */}
        <HeaderBarSection icon={DollarSign} label="Why Install Yourself?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <Heading level={4} className="!mb-2">Save Thousands</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Professional installation can cost $1,000-$3,000+. DIY saves that money 
                for other home improvements.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <Heading level={4} className="!mb-2">Your Schedule</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                No waiting for contractor availability. Install when it works for you - 
                weekends, evenings, whenever.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <Heading level={4} className="!mb-2">It's Easy</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Basic tools, clear instructions, video guides. If you can hang a picture, 
                you can install clear vinyl.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How Easy Is It */}
        <HeaderBarSection icon={Wrench} label="How Easy Is Installation?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId={VIDEOS.SELF_INSTALL_ADVANTAGES}
              title="Self-Install Advantages"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Our clear vinyl kits come with everything you need. The installation process 
                is straightforward:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Mount the track or velcro strips</ListItem>
                <ListItem variant="checked" iconColor="#406517">Hang the panels</ListItem>
                <ListItem variant="checked" iconColor="#406517">Connect zippers and snaps</ListItem>
                <ListItem variant="checked" iconColor="#406517">Adjust and secure</ListItem>
              </BulletedList>
              <Text className="text-sm text-gray-500 italic !mb-0">
                Average installation time: 2-4 hours for a standard 3-sided porch
              </Text>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Marine Snaps Video */}
        <HeaderBarSection icon={Wrench} label="Marine Snaps in 90 Seconds" variant="dark">
          <YouTubeEmbed
            videoId={VIDEOS.MARINE_SNAPS_90_SEC}
            title="Marine Snaps in under 90 Seconds"
            variant="card"
          />
        </HeaderBarSection>

        {/* Tools Needed */}
        <HeaderBarSection icon={Wrench} label="Basic Tools Required" variant="dark">
          <Card className="!p-6">
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="text-center">
              <Stack gap="sm">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center">
                  <span className="text-3xl">🪛</span>
                </Frame>
                <Text className="text-sm font-medium !mb-0">Drill/Driver</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center">
                  <span className="text-3xl">📏</span>
                </Frame>
                <Text className="text-sm font-medium !mb-0">Tape Measure</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center">
                  <span className="text-3xl">🪜</span>
                </Frame>
                <Text className="text-sm font-medium !mb-0">Step Ladder</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center">
                  <span className="text-3xl">✏️</span>
                </Frame>
                <Text className="text-sm font-medium !mb-0">Pencil</Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Support Available */}
        <HeaderBarSection icon={Users} label="Support When You Need It" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">DIY Doesn't Mean Alone</Heading>
                <Text className="text-gray-600">
                  Even though you're doing the installation, we're here to support you:
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Detailed written instructions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Step-by-step video guides</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Phone/email support during installation</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Video call support if you get stuck</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-gray-600 mb-4">
                  Questions about installation?
                </Text>
                <Button variant="outline" asChild>
                  <Link href="/start-project?mode=planner">
                    Talk to a Planner
                  </Link>
                </Button>
              </div>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Save with DIY?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get a quote for your clear vinyl enclosure and see how much you'll save 
            with self-installation.
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
