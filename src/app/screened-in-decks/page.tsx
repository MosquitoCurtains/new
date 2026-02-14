'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Layers,
  ListChecks,
  Snowflake,
  Shield,
  Bug,
  Award,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const FRAME_OPTIONS = [
  { title: 'PVC Frame', description: 'A simple option using 2-3" PVC depending on size and is easily removable.' },
  { title: 'Simple Overhead Wood Box', description: 'Essentially a Pergola without rafters, very easy, inexpensive, & very compatible.' },
  { title: 'Pergola', description: 'Careful, not all designs are compatible. More involved but nice looking.', href: '/pergola-screen-curtains' },
  { title: 'Pavilion Kit (Yardistry Gazebos)', description: 'Essentially a pergola with hard shell roof. Check out Yardistry models from Costco.', href: '/yardistry-gazebo-curtains' },
  { title: 'Fixed Awning', description: 'Fixed Awnings are easy. Retractable awnings are not practical.', href: '/awning-screen-enclosures' },
  { title: 'Pole Tent', description: 'Often used for restaurants looking for a seasonally removable structure.', href: '/tent-screens' },
]

export default function ScreenedInDecksPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Screened Deck Enclosures"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={ListChecks} label="4 Steps To Plan Your Screened Deck" variant="dark">
          <Card variant="elevated" className="!p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
              <Stack gap="sm" className="text-center">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">1</div>
                <Text className="text-sm !mb-0">Carefully read the website for our methods and Screened Deck Ideas</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">2</div>
                <Text className="text-sm !mb-0">Fill out our form with digital photos of the entire space</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">3</div>
                <Text className="text-sm !mb-0">We will help you plan by conducting an online planning session</Text>
              </Stack>
              <Stack gap="sm" className="text-center">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">4</div>
                <Text className="text-sm !mb-0">We can draw on your photos as you watch and guide you</Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Frame Options For Screened Deck (Open Deck With No Covered Roof)" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We only offer a DIY product so the frame is up to you. If you currently have no covered roof, 
              speak to us BEFORE you build a frame to ensure compatibility with our deck screen enclosure methods.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              {FRAME_OPTIONS.map((option) => (
                <Card key={option.title} variant="elevated" className="!p-4">
                  <Heading level={5} className="!mb-2">{option.title}</Heading>
                  <Text className="text-sm text-gray-600 !mb-2">{option.description}</Text>
                  {option.href && (
                    <Link href={option.href} className="text-sm text-[#406517] hover:underline">
                      Learn more <ArrowRight className="inline w-3 h-3" />
                    </Link>
                  )}
                </Card>
              ))}
            </Grid>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={Snowflake} label="Interchangeable With Winter Weather Curtains" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Yes, we also make Winter Weather Panels for decks to block cold wind rain and snow. We use the 
                same methods and you can use the same fasteners such that both products are completely 
                interchangeable. Swap them out seasonally when the weather changes.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/clear-vinyl-plastic-patio-enclosures">
                  See Clear Vinyl Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200.jpg" alt="Winter weather panels" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Quality Screened In Deck Materials" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg" alt="Durable mosquito netting" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg" alt="Quality screen sewing" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our most important concern is always quality. The cheap gazebo screens you may have seen at home 
                improvement stores are garbage. <strong>Our netting is strong enough to lift a 240lb man.</strong>
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Solution dyed - thread is colored and UV protected to its core</ListItem>
                <ListItem variant="checked" iconColor="#406517">Your curtains won't fade or rot prematurely</ListItem>
                <ListItem variant="checked" iconColor="#406517">All fasteners are stainless steel</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking hardware is powder-coated aluminum</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
