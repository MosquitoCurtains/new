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
, Camera, Info} from 'lucide-react'
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
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/14-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: '2 car garage screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/13-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Garage screen cost' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: '16ft garage screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Boat-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Garage screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Garage door screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Garage bug netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Garage-Door-Mosquito-Mesh-Netting-Panels-Shade-In-1200-1024x768.jpg', alt: 'Garage screen door' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Commercial garage screen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Garage mosquito netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Garage-Door-Mosquito-Mesh-Netting-Panels-Clear-Out-1200-1024x768.jpg', alt: 'Garage door screens' },
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
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/01-Garage-Door-Mosquito-Mesh-Netting-Panels-Shade-In-1200-768x576.jpg" alt="Privacy looking in" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/00-Garage-Door-Mosquito-Mesh-Netting-Panels-Clear-Out-1200-768x576.jpg" alt="Clear looking out" className="w-full h-full object-cover" />
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Plastic-Winter-Panels-Garage-Gray-1200-768x576.jpg" alt="Clear vinyl garage panels" className="w-full h-full object-cover" />
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

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Garage Door Screens Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/14-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="2 car garage screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/13-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Cost to screen garage"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="16ft garage screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Boat-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Garage screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Garage door screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Garage bug netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Garage-Door-Mosquito-Mesh-Netting-Panels-Shade-In-1200-1024x768.jpg"
                  alt="Garage Screen Door"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Commercial garage screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg"
                  alt="Garage mosquito netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Garage-Door-Mosquito-Mesh-Netting-Panels-Clear-Out-1200-1024x768.jpg"
                  alt="Garage Door Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/02-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-768x576.jpg"
                  alt="Garage door insect screen curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-768x576.jpg"
                  alt="16ft garage screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2-768x461.jpg"
                  alt="Custom French door screens 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-PANELS-WITH-MAGNETIC-DOORWAY-2000-1-768x461.jpg"
                  alt="Garage door screens option 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-2-STUCCO-STRIPS-2000-768x461.jpg"
                  alt="Custom French door screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-MARINE-SNAPS-ON-EACH-END-2000-1-300x180.jpg"
                  alt="Custom French door screens 2"
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
        <HeaderBarSection icon={Info} label="Custom Shapes" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Multiple Mesh Options						
					
				
									
						Mosquito, No-See-Um, Shade/Privacy</Text>
              <Text className="text-gray-600">Tracking Available						
					
				
									
						Allows you to slide your screen side to side</Text>
              <Text className="text-gray-600">Simple Installation						
					
				
									
						Or any handyman can do it for you</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="PROJECTION SCREEN WITH ROD" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Velcro On Top</Text>
              <Text className="text-gray-600">This solution is not on a track and therefore not capable of sliding. The screen is top-attached using Velcro. You can unzip the side and roll it up for storage and even remove the screens by pulling it off the Velcro attachments.</Text>
              <Text className="text-gray-600">This solution is not on a track and therefore not capable of sliding. The screen is top-attached using Velcro. You can unzip the side and roll it up for storage and even remove the screens by pulling it off the Velcro attachments.</Text>
              <BulletedList>
                <li>Unzips and rolls up for fast storage</li>
                <li>Cheaper alternative to tracking solutions</li>
                <li>Detaches from Velcro attachments for easy removal</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Possible Panel Configurations" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Your project will consist of 1 or more panels. The diagrams below demonstrate a few possibilities from a side view using marine snaps, magnetic doorways, and stucco strips.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2-768x461.jpg"
                alt="Custom French door screens 1"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Our Integrity Saves You Money" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We have a corny slogan internally that we make people happy and then make garage screen enclosure solutions that they will brag to their friends about. If you receive your product and it it not right, we will fix it immediately. If you open the box and simply don’t like what you see, we will refund your purchase (less shipping). In our world, no dollar is worth the price of honor. We are a small American family business and we are teaching out children that “work is good.”

We believe we can produce a quality product that will make people happy, earn a living, and leave work each day with our heads up knowing that we fulfilled that promise. Call us and you will hear unflinching passion. You’ll want to join over 53,000 others that are now part of our family of satisfied clients.

As Seen On:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Mosquito-Curtains-Team-1200-1-768x576.jpg"
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
