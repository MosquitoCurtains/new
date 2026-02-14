'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  DoorOpen,
  Layers,
  Settings,
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
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200.jpg', alt: 'Winterized Porch and Patio Enclosure Black' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Plastic-Enclosures-Royal-Blue-Canvas-Dairy-Queen-1200.jpg', alt: 'Plastic Enclosures Royal Blue Canvas Dairy Queen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/35-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Porch-1200.jpg', alt: 'Plastic Enclosure With Cocoa Brown Canvas Porch' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tintes-400.jpg', alt: 'Clear Vinyl Red Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Clear-Plastic-Porch-Enclosure-With-No-Canvas-1200.jpg', alt: 'Clear Plastic Porch Enclosure With No Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200.jpg', alt: 'Clear Vinyl Enclosure Moss Green Canvas Patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10_Plastic-Drop-Panels-Patio-Inside-View-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels Patio Inside View Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/6-Navy-Clear-Vinyl-Enclosure.jpg', alt: 'Navy Clear Vinyl Enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-1200.jpg', alt: 'Weather enclosures for patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg', alt: 'Clear Plastic Winter Panels Porch Gray' },
]

const FEATURES = [
  { icon: Layers, title: 'Multiple Mesh Options', description: 'Mosquito, No-See-Um, Shade/Privacy' },
  { icon: Settings, title: 'Tracking Available', description: 'Allows you to slide your screen side to side' },
  { icon: DoorOpen, title: 'Simple Installation', description: 'Or any handyman can do it for you' },
]

export default function FrenchDoorScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="French Door Screens"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={DoorOpen} label="Client Installed Projects" variant="dark">
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

        <HeaderBarSection icon={DoorOpen} label="Custom-Made French Door Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Tired of Cheaply made products that are difficult to use? Mosquito Curtains offers 
                <strong> custom-made, marine-grade quality French door screens that are made to last</strong>.
              </Text>
              <Text className="text-gray-600">
                Choose from a variety of options including an overhead tracking system that enables you to easily 
                open your French door screen curtains. We may not be the lowest price, but we are certainly the 
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
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="French door screens" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Settings} label="3 French Door Screen Options Explained" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="EVn_xoSSGWE" title="French Door Option 1 - Tracking with Stucco Strip" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 1: Tracking With Stucco Strip</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Our favorite configuration with the doorway to one side for a seamless look. Main panel can 
                either be on left or right when you install.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="KBN9tIq92xw" title="French Door Option 2 - Tracking with Magnetic Doorway" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 2: Tracking With Magnetic Doorway</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Tracking is mounted to the underside of your header beam flush with the most exterior edge. 
                Tracking enables you to slide each screen panel to one side.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <YouTubeEmbed videoId="ddkU7YLDTok" title="French Door Option 3 - Velcro with Magnetic Doorway" variant="card" className="mb-4" />
              <Heading level={4} className="!mb-2">Option 3: Velcro With Magnetic Doorway</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                This solution is not on a track and therefore not capable of sliding. The screen is 
                top-attached using Velcro.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Quality French Door Screens" variant="dark">
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
                Our most important concern is always quality. <strong>Our netting is strong enough to lift a 
                240lb man.</strong> It is "solution dyed" such that the thread is colored and UV protected to 
                its core. Your French Door Screens won't fade or rot prematurely.
              </Text>
              <Heading level={4}>What Makes Our French Door Screens Different?</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Substantial, durable, marine-grade materials that will not fade</ListItem>
                <ListItem variant="checked" iconColor="#406517">Mosquito, no-see-um & privacy/shade mesh types</ListItem>
                <ListItem variant="checked" iconColor="#406517">Overhead tracking enables you to slide from side-to-side</ListItem>
                <ListItem variant="checked" iconColor="#406517">Interchangeable with our Clear Vinyl Winter Panels</ListItem>
                <ListItem variant="checked" iconColor="#406517">Custom-made to the inch because one size doesn't always fit all</ListItem>
                <ListItem variant="checked" iconColor="#406517">System can be used for porch, pergola, gazebo, deck, awning, and more</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
