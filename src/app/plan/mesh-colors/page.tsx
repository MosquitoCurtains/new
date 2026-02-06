'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Palette,
  Bug,
  Sun,
  Eye,
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
  TwoColumn,
} from '@/lib/design-system'

const MESH_TYPES = [
  {
    id: 'heavy-mosquito',
    title: 'Heavy Mosquito Mesh',
    description: 'Our most popular mesh for mosquitoes, gnats, and black flies. Solution-dyed for fade resistance.',
    features: ['Blocks mosquitoes, gnats, black flies', '450 denier (super strong)', 'Solution-dyed - won\'t fade', 'Available in Black, White, Ivory'],
    colors: ['Black', 'White', 'Ivory'],
    icon: Bug,
  },
  {
    id: 'no-see-um',
    title: 'No-See-Um Mesh',
    description: 'Designed to keep out tiny midge flies common near coastal areas. Finer weave than mosquito mesh.',
    features: ['Blocks no-see-ums & tiny midges', 'Tighter weave for smaller insects', 'Coastal area protection', 'Available in Black, White'],
    colors: ['Black', 'White'],
    icon: Eye,
  },
  {
    id: 'shade',
    title: 'Shade Mesh',
    description: 'Provides shade, privacy, and biting insect protection. Perfect for sunny spaces.',
    features: ['Blocks harsh sunlight', 'Provides privacy', 'Still blocks insects', 'Available in Black, White'],
    colors: ['Black', 'White'],
    icon: Sun,
  },
]

export default function MeshColorsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Palette className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Mesh Types and Colors
            </Heading>
            <Text className="text-xl text-gray-600">
              Choose the right mesh type and color for your project. Each mesh type has specific 
              benefits depending on your needs.
            </Text>
          </Stack>
        </section>

        {/* Mesh & Fabric Video */}
        <HeaderBarSection icon={Bug} label="Understanding Our Mesh & Fabric Options" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3}>Mesh Types Explained</Heading>
              <Text className="text-gray-600">
                Watch this overview of our different mesh and fabric options to understand 
                which type is best for your specific insect and environmental needs.
              </Text>
            </Stack>
            <YouTubeEmbed videoId="FsQUjeSYezM" title="Mesh & Fabric Options" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        {/* Mesh Types */}
        {MESH_TYPES.map((mesh) => {
          const Icon = mesh.icon
          return (
            <HeaderBarSection key={mesh.id} icon={Icon} label={mesh.title} variant="dark">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                <Stack gap="md">
                  <Text className="text-gray-600">{mesh.description}</Text>
                  <BulletedList spacing="sm">
                    {mesh.features.map((feature, idx) => (
                      <ListItem key={idx} variant="checked" iconColor="#406517">{feature}</ListItem>
                    ))}
                  </BulletedList>
                  <div className="flex items-center gap-2 pt-2">
                    <Text className="font-semibold !mb-0">Available Colors:</Text>
                    <div className="flex gap-2">
                      {mesh.colors.map((color) => (
                        <span 
                          key={color}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            color === 'Black' ? 'bg-gray-900 text-white' : 
                            color === 'White' ? 'bg-gray-100 text-gray-900 border' :
                            'bg-[#F5F5DC] text-gray-900 border'
                          }`}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </Stack>
                <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mesh-Types.jpg"
                    alt={mesh.title}
                    className="w-full h-full object-cover"
                  />
                </Frame>
              </Grid>
            </HeaderBarSection>
          )
        })}

        {/* Color Options Video */}
        <HeaderBarSection icon={Palette} label="Choosing Your Color" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <YouTubeEmbed videoId="G6qIngzJz5Y" title="Color Options Guide" variant="card" />
            <Stack gap="md">
              <Heading level={3}>Color Options Guide</Heading>
              <Text className="text-gray-600">
                See our mesh colors in real-world settings. This video walks through black, white, 
                and ivory options so you can choose the best match for your home.
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Color Comparison */}
        <HeaderBarSection icon={Palette} label="Color Comparison" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-4" />
              <Heading level={4} className="!mb-2">Black</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Most popular. Provides best visibility looking out. Virtually invisible from inside.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-20 h-20 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-4" />
              <Heading level={4} className="!mb-2">White</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Bright, clean look. More visible but matches white trim. Great for traditional homes.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-20 h-20 bg-[#F5F5DC] border-2 border-gray-200 rounded-full mx-auto mb-4" />
              <Heading level={4} className="!mb-2">Ivory</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Warm, neutral tone. Complements cream and beige color schemes.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Choose Your Mesh?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Continue planning your project or get help from our expert team.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/plan">
                Continue Planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project">
                Get a Quote
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Mesh and Colors Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/3-MESH-TYPES-1920-One-Inch-1920-1024x576.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/11/Mosquito-Netting-Mesh-Sold-in-Large-Sheets-768x432.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/002-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                  alt="White Mosquito netting curtains on a porch"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/008-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                  alt="White porch screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/82-Screen-Patio-Enclosure-1200-300x225.jpg"
                  alt="Screen Porch Enclosure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/15-Mosquito-Netting-on-Gazebo-1200-300x225.jpg"
                  alt="Insect curtains for gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/027-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                  alt="wedding decoration material"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/01-Mosquito-Netting-on-Gazebo-1200-300x225.jpg"
                  alt="Gazebo Porch Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/28-Tent-Awning-Screens-1200-300x225.jpg"
                  alt="Tent screen panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/033-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                  alt="White wedding fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/045-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                  alt="Ivory tulle"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/04/A-Shade-2-300x225.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/04/A-Shade-1-300x225.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Shade-Screens-for-Porch-and-Patio-400-300x225.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Theater-Scrims-Projection-Screens-400-300x225.jpg"
                  alt="white projection screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Pool-Theater-300x169.jpg"
                  alt="Outdoor theater screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg"
                  alt="Mesh and Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/3-MESH-TYPES-1920-One-Inch-1920-1024x576.jpg"
            alt="See Through Each Mesh (4:00)"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Mesh types and colors to choose from" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                All fabrics are 100% polyester. 90% of orders choose Heavy Mosquito Mesh because it allows the best air flow & visibility.

No-see-um mesh is a finer weave for a very particular biting midge fly that is about as big as a ridge and a half of your fingerprint. Shade Mesh blocks both flying insects and 80% of the sunlight.

This page will give you the details on each so you can make a decision on what best fits your application. Black has best clarity and white is “milky” to see through. See a video comparison here.

All Meshes Are Incredibly Strong. Strong Netting Lifts 240lb Man
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/11/Mosquito-Netting-Mesh-Sold-in-Large-Sheets-768x432.jpg"
                alt="Mesh types and colors to choose from"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Heavy Mosquito Mesh (90% of all orders)" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Heavy Mosquito Mesh has the best air flow with a hole count of 230 holes per sq inch in a rectangular grid pattern that will also stop small gnats and black flies (all flies except “no-see-ums”). It’s density blocks about 20-25% of the wind and a driving rain won’t travel as far as without. If you don’t have no-see-um biting flies or don’t require shade, this is the mesh to choose.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="When to Choose Heavy Mosquito Netting?" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                White Mosquito

White Mosquito

Black Mosquito

Black Mosquito

Ivory Mosquito

Heavy Mosquito Mesh (90% Choose This in Black)

Black

White

Ivory
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/002-White-Mosquito-Netting-Curtains-1200-300x225.jpg"
                alt="White Mosquito netting curtains on a porch"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="No-See-Um-Mesh" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">No-see-um Mesh looks more like a gorgeous black or white “sheer material” with an 800+ hole count used in coastal areas with extremely tiny biting flies known as no-see-ums (because they are too small to see).  It’s density blocks about 30-35% of the wind and a driving rain won’t travel as far as without.
A “No-see-um” is a tiny biting fly about as big as a ridge and a half of your fingerprint found near marshes, some lakes and mostly southern coastal areas. Mosquito mesh is better for “black flies” up north. If you are unfamiliar with the term “noseeum”, you probably don’t have them. The term has nothing to do with visibility.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="When to Choose No-See-Um Netting?" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Black NoSeeUm

Black NoSeeUm

White NoSeeUm

White NoSeeUm

Noseeum Mesh 
(For Tiny Biting Flies)

Black

White
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/01-Mosquito-Netting-on-Gazebo-1200-300x225.jpg"
                alt="Gazebo Porch Curtains"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="When to Choose Shade Mesh Netting?" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Black Shade

Black Shade

Black Shade

White Shade

White Shade

Shade Mesh  (For Shade & Projection)

Black

White
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/04/A-Shade-2-300x225.jpg"
                alt="When to Choose Shade Mesh Netting?"
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
