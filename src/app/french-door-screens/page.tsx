'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  DoorOpen,
  Layers,
  Settings,
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
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'French door screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'French door netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'French door enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'French door screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'French door insect curtains' },
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="French door screens" className="w-full h-full object-cover" />
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
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg" alt="Durable mosquito netting" className="w-full h-full object-cover" />
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

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="French Door Screens Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-French-Door-Netting-Screen-Closed-768x1024.jpg"
                  alt="French door screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-French-Door-Netting-Screen-Open-768x1024.jpg"
                  alt="French Door screen curtains opened"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/French-Door-Mosquito-Curtain-1200-1024x768.jpg"
                  alt="French Door Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/French-Doors-Mesh-Screen-1024x768.jpg"
                  alt="screening French Door Video"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/French-Door-Mesh-Screen-400-300x225.jpg"
                  alt="French Door Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-768x461.jpg"
                  alt="Custom French door screens 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-PANELS-WITH-MAGNETIC-DOORWAY-2000-768x461.jpg"
                  alt="Garage door screens option 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-MARINE-SNAPS-ON-EACH-END-2000-768x461.jpg"
                  alt="Custom French door screens 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg"
                  alt="Garage Screen Door"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1-300x225.jpg"
                  alt="Shade Fabric"
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
        <HeaderBarSection icon={Info} label="Ordering" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Our team will help plan your project!</Text>
              <Text className="text-gray-600">10% Off Sale until Feb 14th… Coupon = Midwinter26</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Possible Configurations" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Your project will consist of 1 or more panels. The diagrams below demonstrate a few possibilities from a side view using marine snaps, magnetic doorways, and stucco strips.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-768x461.jpg"
                alt="Custom French door screens 1"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Value = Quality For The Cost" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We have a corny slogan internally that we make people happy and then make enclosure solutions that they will brag to their friends about. If you receive your product and it it not right, we will fix it immediately. If you open the box and simply don’t like what you see, we will refund your purchase (less shipping). In our world, no dollar is worth the price of honor. We are a small American family business and we are teaching out children that “work is good.”

We believe we can produce a quality product that will make people happy, earn a living, and leave work each day with our heads up knowing that we fulfilled that promise. Call us and you will hear unflinching passion. You’ll want to join over 53,000 others that are now part of our family of satisfied clients.

As Seen On:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Mosquito-Curtains-Team-1200-1-300x225.jpg"
                alt="Mosquito Curtains Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
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
