'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Wrench,
  Lightbulb,
  Play,
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

const RIGGING_IDEAS = [
  {
    title: 'Cable Suspension',
    description: 'Suspend netting from stainless steel cable for clean, minimal installations.',
    uses: ['Large spans', 'Outdoor patios', 'Open ceilings'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Cable-Suspension.jpg',
  },
  {
    title: 'Rope & Pulleys',
    description: 'Create retractable netting systems that can be raised and lowered.',
    uses: ['Adjustable height', 'Seasonal use', 'Event spaces'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Rope-Pulley.jpg',
  },
  {
    title: 'Bungee Tensioning',
    description: 'Use bungee cords for flexible, self-adjusting tension.',
    uses: ['Wind areas', 'Easy install', 'Temporary setups'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Bungee-Tension.jpg',
  },
  {
    title: 'Frame Mounting',
    description: 'Attach netting to existing frames, pergolas, or structures.',
    uses: ['Pergolas', 'Gazebos', 'Existing structures'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Frame-Mount.jpg',
  },
]

export default function RiggingPage() {
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
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Fasteners & Rigging Ideas
            </Heading>
            <Text className="text-xl text-gray-600">
              Creative ways to hang, tension, and rig your netting for various applications.
            </Text>
          </Stack>
        </section>

        {/* Rigging Methods */}
        <HeaderBarSection icon={Wrench} label="Rigging Methods" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            {RIGGING_IDEAS.map((idea) => (
              <Card key={idea.title} variant="elevated" className="!p-6">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Heading level={4} className="!mb-2">{idea.title}</Heading>
                <Text className="text-gray-600 mb-4">{idea.description}</Text>
                <Text className="text-sm font-semibold text-gray-700 !mb-2">Best For:</Text>
                <BulletedList spacing="sm">
                  {idea.uses.map((use, idx) => (
                    <ListItem key={idx} variant="arrow" iconColor="#406517">{use}</ListItem>
                  ))}
                </BulletedList>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Common Fasteners */}
        <HeaderBarSection icon={Wrench} label="Common Fasteners" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Carabiners</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Quick attach/detach</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">S-Hooks</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Simple hanging</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Turnbuckles</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Adjustable tension</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Rope Clamps</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Cable termination</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Eye Bolts</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Anchor points</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Zip Ties</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Temporary fixes</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Ball Bungees</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Grommet attachment</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Tie Wraps</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Secure bundling</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Tips */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Pro Tips</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Allow for some slack - too tight can tear</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Use stainless steel for outdoor applications</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Plan for wind movement</ListItem>
            </BulletedList>
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Reinforce stress points with extra grommets</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Consider seasonal removal needs</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Test small sections before full install</ListItem>
            </BulletedList>
          </Grid>
        </Card>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Rigging & Installation Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING_DIY}
                title="DIY Netting Projects"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">DIY Netting Projects</Text>
            </div>
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.NETTING_RIGGING}
                title="Netting Rigging Techniques"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Netting Rigging Techniques</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Help With Your Project?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for advice on rigging your specific installation.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting/hardware">
                View Hardware
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
