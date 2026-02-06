'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Ship,
  Anchor,
  Sailboat,
  Lightbulb,
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
  YouTubeEmbed,
  MC_HERO_ACTIONS,
BulletedList} from '@/lib/design-system'

const MESH_TYPES = [
  'Mosquito Mesh – Black / White / Ivory',
  'No-see-um Mesh – Black / White',
  'Shade Mesh – Black / White',
]

export default function BoatScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Boat Screens"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Ship} label="Pontoon Boat Netting" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Sometimes simplest is best. Just throw a large super quality netting sheet over your bimini and 
                tie it off. Focus on quality netting rather than costly fabricated solutions.
              </Text>
              <Text className="text-gray-600">
                An old boy scout trick is to drape the netting over a golf ball or cork, tie a slip knot, and 
                then tie the other end to anything you want like an improvised weight or tie it off to available 
                rigging. A "Throw Sheet" is easy, faster and relatively inexpensive.
              </Text>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Heading level={5} className="!mb-2">Mesh Types & Colors</Heading>
                {MESH_TYPES.map((type, idx) => (
                  <Text key={idx} className="text-sm text-gray-600 !mb-1">{type}</Text>
                ))}
              </Card>
            </Stack>
            <YouTubeEmbed videoId="qW51xUKK_LU" title="Pontoon Boat Netting" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <Grid responsiveCols={{ mobile: 2, tablet: 5 }} gap="md">
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Tied at corners" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Fully screened in" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Just a throw sheet" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Customized" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="A night on the lake" className="w-full h-full object-cover" />
          </Frame>
        </Grid>

        <HeaderBarSection icon={Anchor} label="Houseboat Porch Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Houseboat screens" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Some houseboats have a porch that is no different than a porch on a house. We will need to 
                assist you. Contact us through our contact form with images or a model number so we can find 
                a stock image online. We'll guide you through your options.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us With Photos<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Anchor} label="Boat Dock Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We can help you keep your boat clean with a custom-made enclosure for your boat dock! Also 
                saves you from getting eaten alive while you're trying to clean up after a day on the lake.
              </Text>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Boat dock screens" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Sailboat} label="Sail Boats And Cruisers" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This is where it gets very tricky as many shapes are very odd. At times, not only are the cuts 
                unusual, but the surfaces are often not even planar, having a three dimensional bubble.
              </Text>
              <Text className="text-gray-600">
                The best way to get a perfect fit is to hire a boat outfitter who will come on site and fit 
                panels much like a tailor might fit a suit. If you are looking for that perfect fit, we sell 
                our marine quality raw netting to boat outfitters all the time for these types of projects.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/mosquito-netting">See Raw Netting Options<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg" alt="Sailboat screens" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Lightbulb} label="Rig it Yourself – Less Expensive Approach" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <YouTubeEmbed videoId="x4RAeh72h9o" title="Golf Ball Trick" variant="card" />
            <Stack gap="md">
              <Text className="text-gray-600">
                Think of your boat net from a practical point of view. Likely, you aren't trying to win any 
                beauty contest, you just want to be able to enjoy a cold drink on your boat as the sun sets 
                without biting insects ruining your good time.
              </Text>
              <Text className="text-gray-600">
                An old boyscout trick is to drape the netting over a golf ball, tie a slip knot, and then tie 
                the other end to anything you want. A "Throw Sheet" is easy, faster and relatively inexpensive. 
                When you are finished, fold it like a large blanket and stow.
              </Text>
              <Text className="text-gray-600">
                This is quality netting that will not unravel when cut and uses the same solution dyed process 
                that Sunbrella uses on their fabrics for maximum fade resistance.
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Stack gap="md">
            <Heading level={3}>A Cool Idea for Windows</Heading>
            <Text className="text-gray-600">
              Rather than make entire panels, we suggested cutting out the current plastic from the canvas. Any 
              tailor could sew Velcro to the canvas. So long as it is angular (not rounded), we can create BOTH 
              Clear Vinyl and mesh panels that simply Velcro to the stitched Velcro on the canvas.
            </Text>
            <Text className="text-gray-600">
              <strong>The result:</strong> Cheap because it's the canvas and the customization of getting 
              everything to line up with the boat fasteners that is expensive… and you have INTERCHANGEABLE 
              panels for BOTH cool weather and the summer bugs.
            </Text>
          </Stack>
        </Card>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Boat Screens Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/06/Boat1-768x578.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/06/Boat2-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Custom-boat-cover-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/15-Mosquito-Mesh-Boat-Screens-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/14-Mosquito-Mesh-Boat-Screens-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Mesh-Boat-Screens-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Mosquito-Mesh-Boat-Screens-House-Boat-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Mosquito-Mesh-Boat-Screens-House-Boat-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Mesh-Boat-Screens-Dock-1200-768x576.jpg"
                  alt="Mosquito Mesh Boat Screens  for Dock"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Mosquito-Mesh-Boat-Screens-Dock-400.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Mosquito-Mesh-Boat-Screens-Dock-1200-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Lasso-Golf-Ball-1-768x576.jpg"
                  alt="Boat Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Golf-Ball-Corners-768x576.jpg"
                  alt="Boat Screens"
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
