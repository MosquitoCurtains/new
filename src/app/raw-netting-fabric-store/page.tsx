'use client'

import Link from 'next/link'
import { ArrowRight, Ruler, Scissors, Info, ShoppingCart, Play } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  TwoColumn,
  Frame,
  Badge,
  BulletedList,
  ListItem,
  YouTubeEmbed,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'

// Raw mesh products
const RAW_PRODUCTS = [
  {
    id: 'heavy-mosquito-black',
    name: 'Heavy Mosquito Mesh - Black',
    price: 4.50,
    unit: 'per linear foot',
    width: '12 feet',
    description: 'Our most popular mesh. Blocks mosquitoes, gnats, and black flies.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    inStock: true,
  },
  {
    id: 'heavy-mosquito-white',
    name: 'Heavy Mosquito Mesh - White',
    price: 4.50,
    unit: 'per linear foot',
    width: '12 feet',
    description: 'Same quality mesh in white for lighter colored spaces.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    inStock: true,
  },
  {
    id: 'no-see-um-black',
    name: 'No-See-Um Mesh - Black',
    price: 5.50,
    unit: 'per linear foot',
    width: '12 feet',
    description: 'Finer weave blocks tiny no-see-um flies common near coastal areas.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    inStock: true,
  },
  {
    id: 'shade-mesh-black',
    name: 'Shade Mesh - Black',
    price: 6.00,
    unit: 'per linear foot',
    width: '12 feet',
    description: 'Provides shade, privacy, and insect protection. Also works as projection screen.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    inStock: true,
  },
]

export default function RawNettingStorePage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 mb-4">
                For DIY Projects & Professionals
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Raw Mosquito Netting & Fabric
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Buy our marine-grade mesh by the foot for your own custom projects. 
                Same quality materials we use in our finished products.
              </p>
            </div>
          </div>
        </section>

        {/* Video Overview */}
        <section>
          <div className="max-w-3xl mx-auto">
            <YouTubeEmbed
              videoId={VIDEOS.RAW_NETTING}
              title="Raw Netting Overview"
              variant="hero"
            />
          </div>
        </section>

        {/* Info Cards */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card variant="outlined" className="!p-4">
              <div className="flex items-start gap-3">
                <Ruler className="w-5 h-5 text-[#406517] mt-0.5" />
                <div>
                  <Text className="font-medium">12 Feet Wide</Text>
                  <Text size="sm" className="text-gray-500">All mesh comes in 12ft wide rolls</Text>
                </div>
              </div>
            </Card>
            <Card variant="outlined" className="!p-4">
              <div className="flex items-start gap-3">
                <Scissors className="w-5 h-5 text-[#003365] mt-0.5" />
                <div>
                  <Text className="font-medium">Cut to Length</Text>
                  <Text size="sm" className="text-gray-500">Order any length you need</Text>
                </div>
              </div>
            </Card>
            <Card variant="outlined" className="!p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#B30158] mt-0.5" />
                <div>
                  <Text className="font-medium">Lock-Stitched Edges</Text>
                  <Text size="sm" className="text-gray-500">Won't unravel when cut</Text>
                </div>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Products */}
        <section>
          <Heading level={2} className="!mb-6">Available Mesh Types</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            {RAW_PRODUCTS.map((product) => (
              <Card key={product.id} variant="elevated" className="!p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <Frame ratio="1/1" className="bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <div className="p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Heading level={4} className="!mb-0">{product.name}</Heading>
                        {product.inStock && (
                          <Badge className="!bg-green-100 !text-green-700 !border-green-200 text-xs">
                            In Stock
                          </Badge>
                        )}
                      </div>
                      <Text className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </Text>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-[#406517]">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">{product.unit}</span>
                      </div>
                      <Text size="sm" className="text-gray-500">
                        Width: {product.width}
                      </Text>
                    </div>
                    <Button variant="primary" className="w-full mt-4">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Use Cases */}
        <section>
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#003365] px-6 py-4">
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Common Uses for Raw Mesh
              </span>
            </div>
            <div className="p-6 md:p-10">
              <TwoColumn gap="lg">
                <div>
                  <Heading level={3} className="!mb-4">DIY Projects</Heading>
                  <BulletedList spacing="sm">
                    <ListItem variant="checked" iconColor="#406517">
                      Custom window screens
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      Garden netting for plants
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      Pet enclosures (catios)
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      RV and camper screens
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      Hammock canopies
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      Projection screens (shade mesh)
                    </ListItem>
                  </BulletedList>
                </div>
                <div>
                  <Heading level={3} className="!mb-4">Commercial & Industrial</Heading>
                  <BulletedList spacing="sm">
                    <ListItem variant="checked" iconColor="#003365">
                      Agricultural pest barriers
                    </ListItem>
                    <ListItem variant="checked" iconColor="#003365">
                      Greenhouse insect protection
                    </ListItem>
                    <ListItem variant="checked" iconColor="#003365">
                      HVAC filter screens
                    </ListItem>
                    <ListItem variant="checked" iconColor="#003365">
                      Theater scrim material
                    </ListItem>
                    <ListItem variant="checked" iconColor="#003365">
                      Research lab barriers
                    </ListItem>
                    <ListItem variant="checked" iconColor="#003365">
                      Bulk restaurant orders
                    </ListItem>
                  </BulletedList>
                </div>
              </TwoColumn>
            </div>
          </div>
        </section>

        {/* Quality Note */}
        <section>
          <Card variant="elevated" className="!p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-[#406517]" />
              </div>
              <div>
                <Heading level={4} className="!mb-2">Same Quality, Just Unfinished</Heading>
                <Text className="text-gray-600">
                  This is the exact same marine-grade mesh we use in our finished curtain products. 
                  It's solution-dyed (won't fade), UV-protected, lock-stitched (won't unravel when cut), 
                  and built to last outdoors. The only difference is you're doing the finishing work yourself.
                </Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Prefer Finished Products? */}
        <section>
          <Card variant="outlined" className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <Heading level={3} className="!mb-1">Prefer Finished Products?</Heading>
                <Text className="text-gray-600 !mb-0">
                  We'll custom-make curtains to your exact specifications, ready to hang.
                </Text>
              </div>
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Start a Custom Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
