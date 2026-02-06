'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Sun,
  Ruler,
  CheckCircle,
  Play,
  Camera,
  Info,
} from 'lucide-react'
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
TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function ShadeMeshPage() {
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
              <Sun className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Shade Screen Mesh
            </Heading>
            <Text className="text-xl text-gray-600">
              Multi-purpose shade fabric that provides sun protection, privacy, and 
              insect blocking all in one material.
            </Text>
          </Stack>
        </section>

        {/* Product Info */}
        <HeaderBarSection icon={Sun} label="Product Details" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Mesh.jpg"
                alt="Shade mesh material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Shade mesh is a denser weave than standard mosquito netting. It blocks 
                a significant amount of sunlight while still allowing air to flow and 
                keeping insects out.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Blocks harsh sunlight</ListItem>
                <ListItem variant="checked" iconColor="#406517">Provides privacy</ListItem>
                <ListItem variant="checked" iconColor="#406517">Still blocks insects</ListItem>
                <ListItem variant="checked" iconColor="#406517">Allows airflow</ListItem>
                <ListItem variant="checked" iconColor="#406517">UV resistant</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Shade Levels */}
        <HeaderBarSection icon={CheckCircle} label="Shade Levels Available" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">50%</span>
              </div>
              <Heading level={5}>50% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Moderate shade while maintaining good visibility and airflow.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">70%</span>
              </div>
              <Heading level={5}>70% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Good balance of shade and visibility. Most popular option.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">90%</span>
              </div>
              <Heading level={5}>90% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Maximum shade and privacy. Ideal for full sun exposure.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <HeaderBarSection icon={Sun} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="lg" className="max-w-md mx-auto">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-3" />
              <Heading level={5}>Black</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Maximum heat absorption</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>White</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Reflects heat</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={Sun} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Patios</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Sun-exposed areas</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Greenhouses</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Plant protection</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Carports</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Vehicle shade</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Pool Areas</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Privacy + shade</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Shade Mesh Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING}
                title="Raw Netting Overview"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Raw Netting Overview</Text>
            </div>
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING_FABRIC}
                title="Raw Netting Fabric Types"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Raw Netting Fabric Types</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Shade Mesh?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing and availability on shade screen mesh.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting">
                View All Netting
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Shade Screen Mesh Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/NoSeeUm-Mesh-WooCommerce-100x100.jpg"
                  alt="Shade Screen Mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Shark-Tooth-Scrim-WooCommerce-100x100.jpg"
                  alt="Shade Screen Mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/12/Shade-Mesh-WooCommerce-700x394.jpg"
                  alt="Raw Shade Mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/11/Mosquito-Netting-Mesh-Sold-in-Large-Sheets-768x432.jpg"
                  alt="Shade Screen Mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/11/Strong-Mosquito-Netting-Mesh-768x432.jpg"
                  alt="Shade Screen Mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Shade Mesh Fabric" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Black Shade Mesh will not fade and blocks both insects and 80% of sunlight. Best shade screen material for visibility.White Shade Mesh – This shade screen material is used primarily for outdoor projection screens.Common uses for black shade screen material are to screen windows for either shade, privacy or both. Our Black Shade Screen fabric has interesting optical qualities. While inside, you see out rather clearly, but when outside looking in, the shade screen fabric is rather opaque and good for privacy. In addition, this shade screen mesh has been lab tested to block 80% of sunlight. We also have a roll-up shade screen design you can view here.

Incredibly Strong Shade Screen

Sold by Foot from Massive Rolls

Why Us For Raw Netting (1:54)

Mesh Types Overview (1:48)

10% Off Sale until Feb 14th… Coupon = Midwinter26

Multi-PurposeLooking for a quality mesh fabric that will protect you from sun and insects? Perhaps your project is for a purpose other than shade. Our mesh netting fabric can do just that.

100% Polyester Made To Get WetOur Mosquito Netting Fabric is 100% polyester made for outdoors and made to get wet.

Sold by the Foot From Massive RollsCommon bolts of fabric are 54-60″ wide. OUR mesh fabric rolls are VERY WIDE from 100″ – 140″. Order by the linear foot from the respective roll. Use the order form to determine the cost.

CA Fire RatedNetting Fabrics are CA fire rated (NFPA 701 small test).

Will Not Unravel On EdgeOur unique mesh netting weave is a “lock stitch” such that it will not unravel when cut.

Solution DyedNetting materials are solution dyed for maximum fade resistance.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/11/Mosquito-Netting-Mesh-Sold-in-Large-Sheets-768x432.jpg"
                alt="Shade Mesh Fabric"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Shade Screen Netting Specs Table" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Click table to enlarge.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/05/All-Mesh-Netting-Specifications-Table-New.jpg"
                alt="Shade Screen Netting Specs Table"
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
