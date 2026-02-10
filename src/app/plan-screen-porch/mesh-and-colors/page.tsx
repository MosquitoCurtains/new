'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Palette,
  Bug,
  Sun,
  Eye,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
  TwoColumn,
  PowerHeaderTemplate,
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
        
        {/* Hero */}
        <div>
          <Link href="/plan-screen-porch" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Planning
          </Link>
          <PowerHeaderTemplate
            title="Mesh Types and Colors"
            subtitle="Choose the right mesh type and color for your project. Each mesh type has specific benefits depending on your needs."
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

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
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mesh-Types.jpg"
                    alt={mesh.title}
                    className="w-full h-auto"
                  />
                </div>
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
              <Link href="/plan-screen-porch">
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
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
