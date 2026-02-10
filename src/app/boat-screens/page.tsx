'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Ship,
  Anchor,
  Sailboat,
  Lightbulb,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

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
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Tied at corners" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Fully screened in" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Just a throw sheet" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Customized" className="w-full h-full object-cover" />
          </Frame>
          <Frame ratio="4/3" className="rounded-xl overflow-hidden">
            <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="A night on the lake" className="w-full h-full object-cover" />
          </Frame>
        </Grid>

        <HeaderBarSection icon={Anchor} label="Houseboat Porch Screens" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Houseboat screens" className="w-full h-full object-cover" />
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/32-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Boat dock screens" className="w-full h-full object-cover" />
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Sailboat screens" className="w-full h-full object-cover" />
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

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
