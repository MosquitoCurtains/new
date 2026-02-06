'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  Award,
  Wrench,
  Layers,
  Shield,
  Home,
  TreePine,
  Tent,
  Building,
  Play,
  Calculator,
  MessageSquare,
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
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200-1024x768.jpg', alt: 'Clear vinyl porch' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Small-Business-Plastic-Panels-On-Patio-With-Black-Canvas-1200-1024x768.jpg', alt: 'Restaurant plastic panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Winterized-Porch-Plastic-Panels-Black-Canvas-1200-1024x768.jpg', alt: 'Winterized porch' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Winterized-Porch-Plastic-Panels-Black-Canvas-1200-1024x768.jpg', alt: 'Plastic panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200-1024x768.jpg', alt: 'DIY winter enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Gazebo-Clear-Vinyl-Plastic-Porch-Enclosure-Red-1024x768.jpg', alt: 'Gazebo clear vinyl' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Vinyl-Panels-Porch-Chocolate-Brown-1200-1024x768.jpg', alt: 'Clear vinyl panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200-1024x768.jpg', alt: 'Pavilion enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200-1024x768.jpg', alt: 'Restaurant drop panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200-1024x768.jpg', alt: 'Patio weatherproofing' },
]

const PROJECT_TYPES = [
  { title: 'Porches', icon: Home },
  { title: 'Patios', icon: Layers },
  { title: 'Restaurants', icon: Building },
  { title: 'Pergolas', icon: TreePine },
  { title: 'Gazebos', icon: Tent },
  { title: 'Pavilions', icon: Home },
]

const CLEAR_VINYL_HERO_ACTIONS = [
  {
    icon: Play,
    title: 'Options',
    description: 'Thickness, colors & accessories.',
    href: '/clear-vinyl-options',
    buttonText: 'Discover',
    color: '#406517',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Get an estimate within 5% of actual cost.',
    href: '/start-project',
    buttonText: 'Calculate',
    color: '#003365',
  },
  {
    icon: MessageSquare,
    title: 'Contact',
    description: 'Send photos for personalized help!',
    href: '/contact',
    buttonText: 'Contact',
    color: '#B30158',
  },
]

export default function ClearVinylPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Clear Vinyl Plastic Enclosures"
          subtitle="Modular Clear Vinyl Panels custom-made to fit any space. One system, limitless applications."
          videoId="ca6GufadXoE"
          videoTitle="Clear Vinyl Overview"
          thumbnailUrl="https://i.ytimg.com/vi/ca6GufadXoE/maxresdefault.jpg"
          variant="compact"
          actions={CLEAR_VINYL_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Snowflake} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.map((img, idx) => (
              <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Frame>
            ))}
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="outline" asChild>
              <Link href="/gallery/clear-vinyl">See Full Gallery<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </HeaderBarSection>

        <HeaderBarSection icon={Award} label="Meticulous Construction Quality at a Better Price" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">We have a perimeter webbing all double-stitched with UV protected marine-grade thread.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We add a special hidden tape to prevent stitching from perforating the plastic you will never know is even there.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We have excellent automation that enables us to keep our costs much lower with perfect stitching.</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed videoId="KTrkT6DHm9k" title="Clear Vinyl Panel Construction" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Wrench} label="There Are Advantages to Self-Installation" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Quick-Clear-Vinyl-Panel-Installation-1920-1024x576.jpg" alt="Quick installation" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">It is about a 4 out of 10 for DIY skills. Folks take pride in their own accomplishment.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Other systems use hardware so complicated to remove, no one removes them and they don't LAST!</ListItem>
                <ListItem variant="checked" iconColor="#406517">You know how it works and can easily troubleshoot wind issues. You have more control!</ListItem>
                <ListItem variant="checked" iconColor="#406517">Initial installation for a 40ft wide enclosure in about 4-6 hours.</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Better Quality Clear Vinyl Enclosure Materials" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">We have rare 72" (tall) goods vs most who have only 54" goods. Larger seamless windows!</ListItem>
                <ListItem variant="checked" iconColor="#406517">We do not heat weld panels together because it is the first thing to fail.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We don't use cheap $2.85/yd plastic canvas aprons that look industrial and cheap.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We use a waterproof canvas similar to a classy Gortex-like material that costs us $10.64/yd.</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Meticulous-Clear-Vinyl-Construction-1920-1024x576.jpg" alt="Quality construction" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Smarter Fastening System" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 !bg-red-50 !border-red-200">
              <Heading level={4} className="!mb-3 text-red-800">This is NOT our Product</Heading>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do-768x576.jpg" alt="What not to do" className="w-full h-full object-cover" />
              </Frame>
            </Card>
            <Card variant="elevated" className="!p-6 !bg-green-50 !border-green-200">
              <Heading level={4} className="!mb-3 text-green-800">This is What We Do</Heading>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/MOSQUITO-CURTAINS-CLEAR-VINYL-EXAMPLE-2400-768x576.jpg" alt="Our quality" className="w-full h-full object-cover" />
              </Frame>
            </Card>
          </Grid>
          <Text className="text-gray-600 text-center mt-4">
            Our system is simple and not intrusive. If it is easy to hang and remove, you will be more inclined 
            to remove them during the hot summer sun that will damage panels prematurely. <strong>Sometimes 
            complicated & expensive isn't better!</strong>
          </Text>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Interchangeable With Our Summer Mosquito Curtains" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you 
              to enjoy family time just outside your own home. Best of all, the two products are entirely 
              <strong> removable & interchangeable</strong> such that you can <strong>swap them out in the 
              Spring and Fall</strong>.
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg" alt="Summer panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Summer Insect Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4-1024x768.jpg" alt="Winter panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Winter Weather Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-1-1200-768x576.jpg" alt="Summer panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Summer Insect Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-1-1200-768x576.jpg" alt="Winter panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Winter Weather Panels</Text>
              </Stack>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="See Our Products In Action" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3}>Versatile Outdoor Solutions</Heading>
              <Text className="text-gray-600">
                Our clear vinyl panels work beautifully on boats, porches, and patios. 
                See how our canvas and netting products protect outdoor spaces in all conditions.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/start-project">Get Your Custom Quote<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
            <YouTubeEmbed videoId="WE2RuQfehiw" title="Boat & Canvas Netting Solutions" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Home} label="We Do All Types Of Enclosures - Residential & Commercial" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
            {PROJECT_TYPES.map((type) => (
              <Card key={type.title} className="!p-4 text-center">
                <type.icon className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                <Heading level={5} className="!mb-0">{type.title}</Heading>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        <Card className="!p-8 !bg-[#003365] text-white text-center">
          <Heading level={2} className="!mb-4 text-white">Clear Vinyl Plastic Porch Enclosures</Heading>
          <Text className="text-white/90 max-w-3xl mx-auto !mb-6">
            Are you wasting usable living space in your own home? Think about the possibilities if that porch 
            or patio wasn't so cold in the winter. A cozy dinner outside, board games with the kids, a hangout 
            for football games, or maybe just a good smooch on a porch swing during a snow storm.
          </Text>
          <Text className="text-white font-semibold !mb-0">
            Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
          </Text>
        </Card>

        <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
          <Card variant="elevated" className="!p-4">
            <Button variant="primary" className="w-full" asChild>
              <Link href="/what-makes-our-clear-vinyl-product-better">Why Our System?</Link>
            </Button>
          </Card>
          <Card variant="elevated" className="!p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/clear-vinyl-self-installation-advantages">Self-Installation</Link>
            </Button>
          </Card>
          <Card variant="elevated" className="!p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/satisfaction-guarantee">Guarantee</Link>
            </Button>
          </Card>
        </Grid>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Clear Vinyl Patio Enclosures Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200-1024x768.jpg"
                  alt="clear vinyl plastic winter enclosure panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Small-Business-Plastic-Panels-On-Patio-With-Black-Canvas-1200-1024x768.jpg"
                  alt="22 Small Business Plastic Panels On Patio With Black Canvas 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Winterized-Porch-Plastic-Panels-Black-Canvas-1200-1024x768.jpg"
                  alt="12 Winterized Porch Plastic Panels Black Canvas 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Winterized-Porch-Plastic-Panels-Black-Canvas-1200-1024x768.jpg"
                  alt="07 Winterized Porch Plastic Panels Black Canvas 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200-1024x768.jpg"
                  alt="DIY Winter Porch Enclosures are a great way to protect porch and patio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Gazebo-Clear-Vinyl-Plastic-Porch-Enclosure-Red-1024x768.jpg"
                  alt="Clear Vinyl Plastic enclosure for Gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Vinyl-Panels-Porch-Chocolate-Brown-1200-1024x768.jpg"
                  alt="how to keep snow off porch with clear plastic curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200-1024x768.jpg"
                  alt="17 Plastic Enclosure With Cocoa Brown Canvas Pavilion 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200-1024x768.jpg"
                  alt="06 Plastic Drop Panels On Restaurant Forest Green Canvas 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01_Plastic-Drop-Panels-On-Porch-Forest-Green-Canvas-1200-1024x768.jpg"
                  alt="01 Plastic Drop Panels On Porch Forest Green Canvas 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200-1024x768.jpg"
                  alt="weatherproofing porch from wind and rain"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-1-768x576.jpg"
                  alt="Clear Vinyl Patio Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2-768x576.jpg"
                  alt="Clear Vinyl Patio Enclosures"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Bar-2-200x117-1.jpg"
                  alt="Clear Plastic Patio Enclosures"
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
              <Text className="text-gray-600">We are happy to help you plan your project with a quick planning session. For maximum speed and efficiency, photos of your space are extremely helpful. Click the buttons below to see photo guidelines. If you have a general question, call us at 770-645-4745.</Text>
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
        <HeaderBarSection icon={Info} label="Plastic Enclosures Interchangeable With Our Summer Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you to enjoy family time just outside your own home. Best of all, the two products are entirely removable & interchangeable such that you can swap them out in the Spring and Fall. We designed an easy to self-install product perfect as an afternoon family project that you will all later enjoy, together! Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3-768x576.jpg"
                alt="Plastic Enclosures Interchangeable With Our Summer Mosquito Curtains"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Plastic Enclosure Curtains For Patio" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Protect your porch or patio from old wind, rain, snow or spring pollen with custom-made Clear Vinyl Plastic Enclosures. Used in conjunction with a space heater, our plastic porch enclosures will create a cozy outdoor space while protecting your porch from the damaging elements. Weatherproof your Patio Today!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="All Weather Patio Enclosure Curtains" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are custom-made with marine-grade quality materials for an affordable all-weather outdoor space. Waterproof all weather plastic curtains will protect you, your family pets, and plants from frosty winter weather. Great for weather-proofing existing screen porches & patios!</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
