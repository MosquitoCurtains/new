'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  TreePine,
  CheckCircle,
  AlertTriangle,
  Wrench,
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

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola screen curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg', alt: 'Pergola insect curtains' },
]

export default function PergolaScreenCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Pergola Screen Curtains"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={TreePine} label="Client Installed Projects" variant="dark">
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

        <HeaderBarSection icon={TreePine} label="Custom-Made Pergola Screen Curtains" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our custom-made Pergola Screens are made from a marine grade quality mosquito netting and bound 
                with a sturdy perimeter webbing. Black Curtains are solution dyed for most robust fade resistance. 
                We also offer white and cream colored curtains.
              </Text>
              <Text className="text-gray-600">
                Our netting is far stronger than cheap quality netting and made to LAST. We offer mosquito, 
                no-see-um, and shade mesh types. Since they are custom-made, we can cut virtually any shape & size.
              </Text>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Pergola screen curtains" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={CheckCircle} label="Pergola Types (Compatibility Considerations)" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600">
              If you already have a pergola, we'll try to work with what you have though some pergolas are much 
              easier than others and some are just plain impossible. If you are planning a pergola, give us a call 
              so we can help make sure whatever you make is compatible with our curtains.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6 !bg-green-50 !border-green-200">
                <Heading level={4} className="!mb-3 text-green-800">Continuous Roof Perimeter & Flush Top (Easy)</Heading>
                <Text className="text-sm text-gray-600">
                  This design is simple to configure as there are no protruding rafters and the perimeter for the 
                  roof panel is more or less the same perimeter frame used to hang the wall panels. If you haven't 
                  yet built your pergola, this type is very compatible with Mosquito Netting Curtains.
                </Text>
              </Card>
              <Card variant="elevated" className="!p-6 !bg-amber-50 !border-amber-200">
                <Heading level={4} className="!mb-3 text-amber-800">Rafters Stacked on Top of Header (Not Easy)</Heading>
                <Text className="text-sm text-gray-600">
                  While this is a very traditional style for pergolas, it is harder to do. The rafters on top of 
                  the header create "rafter gaps" that require additional panel-ettes. Sealing would be far easier 
                  if the tops of those rafters were flush with the headers.
                </Text>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={AlertTriangle} label="Do I Really Need A Roof Panel?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Sometimes, not! Mosquitoes are D-U-M-B. We emit a combination of chemicals that attract mosquitoes 
                that vector directly towards the scent we emit. When they reach a barrier, they tend to bounce and 
                bounce but not move laterally in search of gaps.
              </Text>
              <Text className="text-gray-600">
                The taller your structure, the less likely mosquitoes are to wander up and over the net. However, 
                you never know. Quite often we'll tell clients to hold off on a roof panel which they can always 
                purchase later.
              </Text>
            </Stack>
            <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
              <Heading level={4} className="!mb-3">Tips For Those Planning A Pergola</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Costco sells Yardistry model pergolas that are outstanding quality</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking is UNDER-mounted and Velcro is SIDE-mounted</ListItem>
                <ListItem variant="checked" iconColor="#406517">Keep the overhead rafters within the header beams</ListItem>
                <ListItem variant="checked" iconColor="#406517">Have clear paths and flush surface to create a seal</ListItem>
              </BulletedList>
            </Card>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Quality & Service" variant="dark">
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
              <Heading level={4}>Why Choose Our Pergola Insect Curtains?</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">We add reinforcement prior to stitching so seams are stronger</ListItem>
                <ListItem variant="checked" iconColor="#406517">We only use Marine Grade mesh and thread that is more durable</ListItem>
                <ListItem variant="checked" iconColor="#406517">Our attachment hardware is much simpler and more affordable</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Pergola Screen Curtains Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/18-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="18 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/13-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="13 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="16 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="17 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="Pergola Screen Panels for Decks"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="Pergola insect curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="Pergola Screen Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="03 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="15 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="Pergola Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/22-Pergola-Screen-Panels-1200-768x576.jpg"
                  alt="Insect Curtains for Pergolas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/21-Pergola-Screen-Panels-1200-768x576.jpg"
                  alt="Screens for Pergolas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/05/Deck-Example4-768x576.jpg"
                  alt="Pergola Screen Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/20-Pergola-Screen-Panels-1200-768x576.jpg"
                  alt="20 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/24-Pergola-Screen-Panels-1200-768x576.jpg"
                  alt="24 Pergola Screen Panels 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/23-Pergola-Screen-Panels-1200-1024x768.jpg"
                  alt="Mosquito netting curtains for pergolas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Pergola-Screen-Panels-400-300x225.jpg"
                  alt="Pergola insect curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Pergola-Screen-Panels-400-300x225.jpg"
                  alt="Pergola bug curtain screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/47-Screened-in-Deck-1200-300x225.jpg"
                  alt="Pergola Screen Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
                  alt="Screened In Deck Overhead Box"
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
        <HeaderBarSection icon={Info} label="The Simplest Possible Structures" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                All we really need is an overhead box that is stable so that no one gets hurt. For the project on the right, the client only wanted an overhead shade to block the West Texas sun using our shade mesh. They didn’t have a bug problem, although this would be enough structure to mount wall panels if they did.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/47-Screened-in-Deck-1200-300x225.jpg"
                alt="The Simplest Possible Structures"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
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
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/20-Screened-in-Deck-Overhead-Box-1200-300x225.jpg"
            alt="Screen deck ideas"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Screened-in-Deck-Simple-Overhead-Wood-Box-1200-300x225.jpg"
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
        <HeaderBarSection icon={Info} label="Click the button to learn your customization options." variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                As Seen On:
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/USA_Today_logo_horizontal-300x56.png"
                alt="Mosquito Netting Curtains as featured on USA Today"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
