'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Wrench,
  Lightbulb,
  Play,
, Camera, Info} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  Frame,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
, TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const RIGGING_IDEAS = [
  {
    title: 'Cable Suspension',
    description: 'Suspend netting from stainless steel cable for clean, minimal installations.',
    uses: ['Large spans', 'Outdoor patios', 'Open ceilings'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Cable-Suspension.jpg',
  },
  {
    title: 'Rope & Pulleys',
    description: 'Create retractable netting systems that can be raised and lowered.',
    uses: ['Adjustable height', 'Seasonal use', 'Event spaces'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Rope-Pulley.jpg',
  },
  {
    title: 'Bungee Tensioning',
    description: 'Use bungee cords for flexible, self-adjusting tension.',
    uses: ['Wind areas', 'Easy install', 'Temporary setups'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Bungee-Tension.jpg',
  },
  {
    title: 'Frame Mounting',
    description: 'Attach netting to existing frames, pergolas, or structures.',
    uses: ['Pergolas', 'Gazebos', 'Existing structures'],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Frame-Mount.jpg',
  },
]

export default function RiggingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/raw-netting" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Raw Netting
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Fasteners & Rigging Ideas
            </Heading>
            <Text className="text-xl text-gray-600">
              Creative ways to hang, tension, and rig your netting for various applications.
            </Text>
          </Stack>
        </section>

        {/* Rigging Methods */}
        <HeaderBarSection icon={Wrench} label="Rigging Methods" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            {RIGGING_IDEAS.map((idea) => (
              <Card key={idea.title} variant="elevated" className="!p-6">
                <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Heading level={4} className="!mb-2">{idea.title}</Heading>
                <Text className="text-gray-600 mb-4">{idea.description}</Text>
                <Text className="text-sm font-semibold text-gray-700 !mb-2">Best For:</Text>
                <BulletedList spacing="sm">
                  {idea.uses.map((use, idx) => (
                    <ListItem key={idx} variant="arrow" iconColor="#406517">{use}</ListItem>
                  ))}
                </BulletedList>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Common Fasteners */}
        <HeaderBarSection icon={Wrench} label="Common Fasteners" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Carabiners</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Quick attach/detach</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">S-Hooks</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Simple hanging</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Turnbuckles</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Adjustable tension</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Rope Clamps</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Cable termination</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Eye Bolts</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Anchor points</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Zip Ties</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Temporary fixes</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Ball Bungees</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Grommet attachment</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Tie Wraps</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Secure bundling</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Tips */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Pro Tips</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Allow for some slack - too tight can tear</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Use stainless steel for outdoor applications</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Plan for wind movement</ListItem>
            </BulletedList>
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Reinforce stress points with extra grommets</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Consider seasonal removal needs</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Test small sections before full install</ListItem>
            </BulletedList>
          </Grid>
        </Card>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Rigging & Installation Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING_DIY}
                title="DIY Netting Projects"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">DIY Netting Projects</Text>
            </div>
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.NETTING_RIGGING}
                title="Netting Rigging Techniques"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Netting Rigging Techniques</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Help With Your Project?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for advice on rigging your specific installation.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting/hardware">
                View Hardware
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Fasteners &amp; Rigging Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Elastic-Cord-1024x1024.jpg"
                  alt="Fasteners &amp; Rigging"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Lasso-Golf-Ball-1024x768.jpg"
                  alt="Fasteners &amp; Rigging"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Golf-Ball-Corners-1024x768.jpg"
                  alt="Fasteners &amp; Rigging"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Wood-Strip-Edge-1024x768.jpg"
                  alt="Fasteners &amp; Rigging"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Cool Tricks With Simple Hardware" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Our core business revolves around making custom netting solutions mostly for porch enclosures, however; we have done much more! We have worked many creative and fun projects, like underwater torpedo targets for the Navy, sniper hides for military, massive 70ft x 40ft outdoor projection screens and more. Sometimes our fancy fabricated solutions might be overkill for your project. Just to tickle your imagination, we want to offer a few creative rigging ideas that you can use with mosquito netting that we have learned mostly from clever clients like you that helped them to create a more cost effective solution. If you have a unique project and are looking for ideas, feel free to give us a call! We’ll be happy to help</Text>
              <Text className="text-gray-600">SHOP MESHES</Text>
              <BulletedList>
                <li>Heavy Mosquito Mesh</li>
                <li>No See Um Mesh</li>
                <li>Shade Screen Mesh</li>
                <li>Theater Scrim</li>
                <li>Industrial Mesh</li>
                <li>Let Us Make It For You</li>
                <li>Buy Attachment Hardware</li>
                <li>Fasteners and Rigging Ideas</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Marine Snaps &amp; Rubber Washers" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We sell marine snaps and rubber washers. You can find them in the attachment hardware page in the menu. To place a marine snap in raw netting, use two rubber washers, one on each side of the mesh (to distribute the load and preventing the snaps from “ripping out”). Place a the female side of a marine snap through the two washers. The male snap is either on a screw stud or adhesive snap to fasten netting to almost any surface. Note: you will need the refundable industrial snap tool to place snaps through these washers.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Marine-Snap-in-Raw-Netting.jpg"
                alt="Marine Snaps &amp; Rubber Washers"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Elastic Cord" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Remember when mom lost the lid to a jar? She placed wax paper over the top of the jar and used a rubber band to seal the wax paper to the jar. Elastic Cord is handy for many projects and best described in a winery vat application to prevent fruit flies that altered the tannics of the wine. Elastic cord is just a giant rubber band that pinches the netting over the top of the vat. They didn’t need an expensive or fancy solution and just wanted something easy to use at the lowest price possible. Sometimes simple is better than expensive!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Elastic-Cord-1024x1024.jpg"
                alt="Elastic Cord"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Duct Tape" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Sound Crazy? Read on. Fold Duct tape in half like a taco and tuck the netting inside (Duct Tape comes in a variety of colors and there is something used in the film industry called Gaffer’s Tape that has a matte textured backing that looks more like cloth). Apply the Duct Tape around the entire perimeter of the netting panel and use an ordinary stapler to secure the corners.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Boat Photos – Yep! Duct Tape!" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                You can apply adhesive-backed Velcro directly to the Duct Tape to join panels or affix to a surface. Not as pretty or as strong as our Custom Solutions, but sometimes the project is more about affordable functionality and less about aesthetics. LIMITATIONS: This method only works with our “Heavy Mesh. You will not be able to use any sort of tracking and can only create a fixed attachment.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Boat-with-duct-tape-on-mesh-1.jpg"
                alt="Boat Photos – Yep! Duct Tape!"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Boy Scout Idea" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Take a marble, round stone or golf ball and wrap netting over the ball. Use a cord to choke a noose around the ball and then tie off the cord. This will not stress the netting and you can pull the “tie off” cord till kingdom come and it won’t rip out. In addition your panel is reusable by repositioning the balls.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Lasso-Golf-Ball-1024x768.jpg"
                alt="Boy Scout Idea"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="PVC Snap Clamps" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                While we do not offer PVC Snap Clamps, You can readily purchase them online. One provider is www.pvcplans.com. PVC Snap Clamps are a convenient way to “Clip” Mosquito Netting to a PVC Tube. They come in a variety of lengths for different gauge tube thicknesses. Often used in gardening applications like “hoop houses” PVC Snap clamps are a great tool for improvised rigging. HINT: They can easily be cut with a hacksaw, so you can save by purchasing long clamps (up to 24″) and cutting them into 2-4″ usable pieces.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/PCV-Snap-Clamps-1A-1.jpg"
                alt="PVC Snap Clamps"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Wood Strip" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                You can wrap the netting a few turns around a wood strip (like a 1″ x 2″) and then nail the wood strip to some surface. Distributing the mounting tension along a long wood strip is far better than simply nailing directly into raw netting which is prone to “rip out”.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Wood-Strip-Edge-1024x768.jpg"
                alt="Wood Strip"
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
