'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Tent,
  Layers,
  Sun,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
BulletedList} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo screen curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo insect curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo bug screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo mosquito curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Gazebo netting panels' },
]

export default function GazeboScreenCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Gazebo Screen Enclosures"
          subtitle="Modular Gazebo Curtains custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Tent} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
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

        <HeaderBarSection icon={Shield} label="Gazebo Screen Curtains Made To Last" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We custom-make marine grade quality Outdoor Gazebo Screen Curtains using mosquito netting that is 
                10x stronger than tissue paper thin materials stamped out in China that do not last.
              </Text>
              <Text className="text-gray-600">
                Our black curtains are crystal clear to look through and will not fade (solution dyed) and is 
                strong enough to lift our heaviest 240lb employee. If you are tired of the low quality gazebo 
                screens, we can help.
              </Text>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Looking For Cheap Replacement Screens?</strong> Sorry, not us. Try gardenwinds.com or wayfair.com
                </Text>
              </Card>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden"><img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Elegant enclosure" className="w-full h-full object-cover" /></Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden"><img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg" alt="Super strength" className="w-full h-full object-cover" /></Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Top Attachment Options For Gazebo Curtains" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-3">Tracking Top Attachment</Heading>
              <Text className="text-gray-600 !mb-0">
                Enables you to slide the curtains side to side, creating decorative "swags" when gazebo curtains 
                are pulled back.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-3">Velcro Top Attachment</Heading>
              <Text className="text-gray-600 !mb-0">
                Top will not slide. More common and less expensive. Panels are fixed in place though you may 
                still create magnetic doorways.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Sun} label="Other Gazebo Screen Mesh Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full mb-4 flex items-center justify-center">
                <Sun className="w-6 h-6 text-amber-600" />
              </div>
              <Heading level={4} className="!mb-2">Shade Mesh</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Blocks biting insects and also blocks 80% of sunlight. Outstanding clarity (inside looking out).
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                <Tent className="w-6 h-6 text-blue-600" />
              </div>
              <Heading level={4} className="!mb-2">No-See-Um Screen Mesh</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                For tiny midge flies generally found near large bodies of water. About as big as a ridge and a 
                half of your fingerprint.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full mb-4 flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-cyan-600" />
              </div>
              <Heading level={4} className="!mb-2">Clear Vinyl Winter Panels</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Want a weatherproof gazebo? They are interchangeable with our screens and use the same fasteners. 
                Swap them out seasonally.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Text className="text-lg text-gray-700 !mb-0">
            We believe we can produce a quality product that will make people happy. Call us and you will hear 
            unflinching passion. You'll want to join the <strong>92,000+ others</strong> that are now part of 
            our family of satisfied clients.
          </Text>
        </Card>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Gazebo Screen Curtains Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Screening a gable"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="gazebo screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/14-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Mosquito mesh Curtains for Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Mosquito Netting To Screen Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Gazebo Porch Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Gazebo insect curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Gazebo Patio Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Mosquito Netting On Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Insect curtains for gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Mosquito-Netting-on-Gazebo-1200-1024x768.jpg"
                  alt="Cost to screen gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/10-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
                  alt="Mosquito netting curtains on gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/01-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
                  alt="Gazebo Porch Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/03-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
                  alt="Gazebo Patio Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/11-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
                  alt="Mosquito Netting On Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/22-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
                  alt="Screening a gable"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/21-Gazebo-Clear-Vinyl-Plastic-Porch-Enclosure-Red-768x576.jpg"
                  alt="Clear Vinyl Plastic enclosure for Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/18-Clear-Plastic-Gazebo-With-No-Canvas-1200-768x576.jpg"
                  alt="Clear plastic enclosure for gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/19-Mosquito-Netting-on-Gazebo-1200-300x225.jpg"
                  alt="Gazebo enclosure screens"
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
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/01-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
            alt="Gazebo Porch Curtains"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/03-Mosquito-Netting-on-Gazebo-1200-768x576.jpg"
            alt="Gazebo Patio Curtains"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Insect-Mesh-Holds-Up-240-LB-Man-1200-1-768x576.jpg"
            alt="Quality Mosquito netting"
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
