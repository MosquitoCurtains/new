'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Layers,
  ListChecks,
  Snowflake,
  Shield,
Camera, Info} from 'lucide-react'
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg" alt="Winter weather panels" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Quality Screened In Deck Materials" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg" alt="Durable mosquito netting" className="w-full h-full object-cover" />
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

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Screened-In Decks Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Screened-in-Deck-Overhead-Box-1200-1024x768.jpg"
                  alt="Screen deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Screened-in-Deck-Simple-Overhead-Wood-Box-1200-1024x768.jpg"
                  alt="Screened In Deck with Simple Frame"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Screened-in-Deck-1200-1024x768.jpg"
                  alt="00 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/38-Screened-in-Deck-Pergola-1200-1024x768.jpg"
                  alt="38 Screened In Deck Pergola 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/46-Screened-In-Deck-1200-1024x768.jpg"
                  alt="46 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/45-Screened-In-Deck-1200-1024x768.jpg"
                  alt="45 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/44-Screened-in-Deck-Frameless-Box-1200-1024x768.jpg"
                  alt="screened in deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/37-Screened-in-Deck-PVC-Frame-1200-1024x768.jpg"
                  alt="Screen enclosure for deck"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/40-Screened-in-Deck-1200-1024x768.jpg"
                  alt="40 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Screened-in-Deck-Simple-Overhead-Wood-Box-1200-1024x768.jpg"
                  alt="Screened In Deck with Simple Overhead Wood Box Frame"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/38-Screened-in-Deck-Pergola-400.jpg"
                  alt="Screened-In Decks"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Screened-in-Deck-Overhead-Box-400.jpg"
                  alt="Screen deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Screened-in-Deck-PVC-Frame-400-300x225.jpg"
                  alt="Simple frame for deck screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/37-Screened-in-Deck-PVC-Frame-400-300x225.jpg"
                  alt="Screen enclosure for deck"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Screened-in-Deck-Simple-Overhead-Wood-Box-400-300x225.jpg"
                  alt="Screened In Deck with Simple Frame"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Pergola-Screen-Panels-1200-300x225.jpg"
                  alt="Pergola Screen Panels for Decks"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Yardistry-Gazebo-Curtains-400-300x225.jpg"
                  alt="Yardistry insect curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Tent-Awning-Screens-400-300x225.jpg"
                  alt="Awning screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Plastic-Enclosures-Royal-Blue-Canvas-Tent-1200-300x225.jpg"
                  alt="how to keep mosquitoes out of an event tent"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/42-Screened-in-Deck-Frameless-Box-1200-300x225.jpg"
                  alt="Screen deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="DIY Install" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">DIY installation in an afternoon with simple tools and fasteners.</Text>
          </Stack>
        </HeaderBarSection>
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Client Installed Projects Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Screened-in-Deck-Overhead-Box-1200-1024x768.jpg"
                  alt="Screen deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Screened-in-Deck-Simple-Overhead-Wood-Box-1200-1024x768.jpg"
                  alt="Screened In Deck with Simple Frame"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Screened-in-Deck-1200-1024x768.jpg"
                  alt="00 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/38-Screened-in-Deck-Pergola-1200-1024x768.jpg"
                  alt="38 Screened In Deck Pergola 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/46-Screened-In-Deck-1200-1024x768.jpg"
                  alt="46 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/45-Screened-In-Deck-1200-1024x768.jpg"
                  alt="45 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/44-Screened-in-Deck-Frameless-Box-1200-1024x768.jpg"
                  alt="screened in deck ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/37-Screened-in-Deck-PVC-Frame-1200-1024x768.jpg"
                  alt="Screen enclosure for deck"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/40-Screened-in-Deck-1200-1024x768.jpg"
                  alt="40 Screened In Deck 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Screened-in-Deck-Simple-Overhead-Wood-Box-1200-1024x768.jpg"
                  alt="Screened In Deck with Simple Overhead Wood Box Frame"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="4 Steps To Plan Your Screened Deck:" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This is an easy to self-install product. Screened Deck projects require our assistance so here is how to proceed as efficiently as possible:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/38-Screened-in-Deck-Pergola-400.jpg"
                alt="4 Steps To Plan Your Screened Deck:"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/37-Screened-in-Deck-PVC-Frame-400-300x225.jpg"
            alt="Screen enclosure for deck"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Screened-in-Deck-Simple-Overhead-Wood-Box-400-300x225.jpg"
            alt="Screened In Deck with Simple Frame"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Pergola-Screen-Panels-1200-300x225.jpg"
            alt="Pergola Screen Panels for Decks"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Tent-Awning-Screens-400-300x225.jpg"
            alt="Awning screens"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Industrial-Netting-Applications-1200-300x225.jpg"
            alt="Commercial Netting Applications"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Screened-in-Deck-Overhead-Box-400-300x225.jpg"
            alt="Screened In Deck Overhead Box"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
            alt="Simple pergola design for screening"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/18-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
            alt="Simple pergola design for screens"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Screened-in-Deck-Simple-Overhead-Wood-Box-400-300x225.jpg"
            alt="Screened In Deck with Simple Frame"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/20-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
            alt="Screen deck ideas"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Screened-in-Deck-Simple-Overhead-Wood-Box-400-300x225.jpg"
            alt="Screened In Deck with Simple Overhead Wood Box Frame"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Get Started Fast With a Real Person!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are happy to help you plan your project with a quick planning session. For maximum speed and efficiency, photos of your space are extremely helpful. Click the buttons below to see photo guidelines. If you have a general question, call us at (770) 645-4745.</Text>
              <BulletedList>
                <li>Please provide 2-4 high resolution photos that show all complete sides of your project.</li>
                <li>Step BACK and zoom OUT so we can see as much as possible. No close-ups.</li>
                <li>Large file sizes – Small images do not provide enough resolution for planning sessions.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Good Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? We can see each full side with fastening surfaces in each high resolution photo.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                alt="Good Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Bad Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? They are too close up so we can’t see ALL fastening surfaces and corner transitions.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                alt="Bad Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Quick Connect Form" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Fill and a planner will connect to discuss your project!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
