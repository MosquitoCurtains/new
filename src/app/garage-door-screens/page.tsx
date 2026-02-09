'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Car,
  Layers,
  Settings,
  Snowflake,
  Shield,
  Film,
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
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: '16ft garage screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/14-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: '2 car garage screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/13-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Cost to screen garage' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'screens for garage door' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage bug netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage mosquito netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Plastic-Winter-Panels-Garage-Gray-1200.jpg', alt: 'Clear Plastic Winter Panels Garage Gray' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage Door Mosquito Mesh Netting Panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Boat-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage screens' },
]

const FEATURES = [
  { icon: Layers, title: 'Multiple Mesh Options', description: 'Mosquito, No-See-Um, Shade/Privacy' },
  { icon: Settings, title: 'Tracking Available', description: 'Allows you to slide your screen side to side' },
  { icon: Car, title: 'Simple Installation', description: 'Or any handyman can do it for you' },
]

export default function GarageDoorScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Garage Door Screen Enclosures"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Car} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.map((img, idx) => (
              <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Frame>
            ))}
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="outline" asChild>
              <Link href="/gallery">See Full Gallery<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </HeaderBarSection>

        <HeaderBarSection icon={Car} label="Custom-fitted Garage Door Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Tired of Cheaply made products that are difficult to use? Mosquito Curtains offers 
                <strong> custom-made, marine-grade quality retractable garage door screens that are made to last</strong>.
              </Text>
              <Text className="text-gray-600">
                Choose from a variety of options including an overhead tracking system that enables you to easily 
                open your garage door screen curtains. We may not be the lowest price, but we are certainly the 
                best value for the quality and usability you will appreciate.
              </Text>
              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
                {FEATURES.map((feat) => (
                  <Card key={feat.title} className="!p-4 text-center">
                    <feat.icon className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                    <Heading level={5} className="!mb-1">{feat.title}</Heading>
                    <Text className="text-xs text-gray-500 !mb-0">{feat.description}</Text>
                  </Card>
                ))}
              </Grid>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/01-Garage-Door-Mosquito-Mesh-Netting-Panels-Shade-In-1200.jpg" alt="Privacy looking in" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/00-Garage-Door-Mosquito-Mesh-Netting-Panels-Clear-Out-1200.jpg" alt="Clear looking out" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Settings} label="3 Retractable Garage Door Options Explained" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="DBR6a0EBgqI" title="Garage Door Option 1 - Tracking with Stucco Strip" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 1: Tracking With Stucco Strip</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Our favorite configuration with the doorway to one side for a seamless look. Tracking enables 
                you to slide the main panel to one side.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="BNIPsTVRHLg" title="Garage Option 2 - Tracking with Magnetic Doorway" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 2: Tracking With Magnetic Doorway</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Same as Option 1 but with a center magnetic doorway. Tracking enables you to slide each garage 
                screen panel to one side.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="6HOIhGMuuf8" title="Garage Option 3 - Velcro On Top" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 3: Velcro On Top</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Not on a track and therefore not capable of sliding. Unzips and rolls up for fast storage. 
                Cheaper alternative to tracking.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Film} label="Garage Door Projection Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Yep, we make those too for the ultimate caveman who wants a giant Garage Door Projection Screen 
                to project movies in the man cave.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/outdoor-projection-screens">
                  Learn About Projection Screens
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>
            <YouTubeEmbed videoId="fGTjgRROz1Q" title="Man Cave Garage Home Theater" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Snowflake} label="Winter Panels For All-Season Garage Room" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Plastic-Winter-Panels-Garage-Gray-1200.jpg" alt="Clear vinyl garage panels" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Turn that Garage into a three-season room with clear vinyl winter panels that are easily 
                interchangeable with our garage door screens.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/clear-vinyl-plastic-patio-enclosures">
                  See Clear Vinyl Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="What Makes Our Garage Door Screens Different?" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We realize that you have alternatives and want to know what differentiates our system from others. 
              We shoot for marine-grade materials that you can conveniently slide from side to side at an 
              affordable price!
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Substantial, durable, marine-grade materials that will not fade</ListItem>
                <ListItem variant="checked" iconColor="#406517">Mosquito, no-see-um & privacy/shade mesh types</ListItem>
                <ListItem variant="checked" iconColor="#406517">Overhead tracking enables you to slide from side-to-side</ListItem>
                <ListItem variant="checked" iconColor="#406517">Interchangeable with our Clear Vinyl Winter Panels</ListItem>
              </BulletedList>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Custom-made to the inch because one size doesn't always fit all</ListItem>
                <ListItem variant="checked" iconColor="#406517">We offer a white projection material for movies and bugs</ListItem>
                <ListItem variant="checked" iconColor="#406517">System can be used for porch, pergola, gazebo, deck, awning, and more</ListItem>
              </BulletedList>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
