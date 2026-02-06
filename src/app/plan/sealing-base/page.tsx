'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Layers,
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

const SEALING_OPTIONS = [
  {
    id: 'weighted-hem',
    title: 'Weighted Hem (Most Popular)',
    description: 'A chain sewn into the bottom hem creates weight that keeps curtains from blowing around while allowing them to swing freely.',
    features: ['Chain sewn inside hem', 'Curtains can swing freely', 'Great for tracking systems', 'Recommended for most projects'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Weighted-Hem.jpg',
  },
  {
    id: 'floor-seal',
    title: 'Floor Seal',
    description: 'Velcro strip adheres to the floor for a tighter seal. Perfect for areas where keeping every bug out is critical.',
    features: ['Velcro attaches to floor', 'Maximum bug protection', 'Great for dining areas', 'Tighter seal than weighted'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Floor-Seal.jpg',
  },
  {
    id: 'railing-seal',
    title: 'Railing/Knee Wall Seal',
    description: 'Velcro attaches to the top of a railing or knee wall for projects that don\'t go to the floor.',
    features: ['Attaches to railing tops', 'Works with half-walls', 'Deck railing compatible', 'Velcro seal system'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Railing-Seal.jpg',
  },
]

export default function SealingBasePage() {
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
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Sealing The Base
            </Heading>
            <Text className="text-xl text-gray-600">
              Complete your bug protection by sealing the bottom of your curtains. 
              Choose the right option based on your space and needs.
            </Text>
          </Stack>
        </section>

        {/* Overview Videos */}
        <HeaderBarSection icon={Layers} label="Base Sealing Options" variant="dark">
          <Stack gap="lg">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_1}
                title="Base Sealing Overview"
                variant="card"
              />
              <YouTubeEmbed
                videoId={VIDEOS.BASE_SEALING_2}
                title="Base Sealing Details"
                variant="card"
              />
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600">
                How you seal the base depends on your setup. Most customers choose the weighted hem 
                for its balance of protection and ease of use.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Three sealing options available</ListItem>
                <ListItem variant="checked" iconColor="#406517">Choose based on your floor type</ListItem>
                <ListItem variant="checked" iconColor="#406517">Works with railings and knee walls</ListItem>
                <ListItem variant="checked" iconColor="#406517">Your planner can help you decide</ListItem>
              </BulletedList>
            </Stack>
          </Stack>
        </HeaderBarSection>

        {/* Sealing Options */}
        {SEALING_OPTIONS.map((option, index) => (
          <Card key={option.id} variant="elevated" className="!p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              {index % 2 === 0 ? (
                <>
                  <Stack gap="md">
                    <Heading level={3}>{option.title}</Heading>
                    <Text className="text-gray-600">{option.description}</Text>
                    <BulletedList spacing="sm">
                      {option.features.map((feature, idx) => (
                        <ListItem key={idx} variant="checked" iconColor="#406517">{feature}</ListItem>
                      ))}
                    </BulletedList>
                  </Stack>
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.title}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                </>
              ) : (
                <>
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.title}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Stack gap="md">
                    <Heading level={3}>{option.title}</Heading>
                    <Text className="text-gray-600">{option.description}</Text>
                    <BulletedList spacing="sm">
                      {option.features.map((feature, idx) => (
                        <ListItem key={idx} variant="checked" iconColor="#406517">{feature}</ListItem>
                      ))}
                    </BulletedList>
                  </Stack>
                </>
              )}
            </Grid>
          </Card>
        ))}

        {/* Which To Choose */}
        <HeaderBarSection icon={ShieldCheck} label="Which Option Is Right For You?" variant="dark">
          <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              <Stack gap="sm">
                <Heading level={4} className="!text-[#406517]">Weighted Hem</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Best for: Tracking systems, areas where you want curtains to swing, 
                  most residential porches
                </Text>
              </Stack>
              <Stack gap="sm">
                <Heading level={4} className="!text-[#406517]">Floor Seal</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Best for: Maximum bug protection, dining areas, spaces where 
                  no bugs can enter
                </Text>
              </Stack>
              <Stack gap="sm">
                <Heading level={4} className="!text-[#406517]">Railing Seal</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Best for: Decks with railings, balconies, knee walls, 
                  partial enclosures
                </Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Continue Planning Your Project</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Now that you understand base sealing, continue planning or get help from our team.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/plan">
                Continue Planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project">
                Get a Quote
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
