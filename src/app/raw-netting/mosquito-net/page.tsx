'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Bug,
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

export default function MosquitoNetPage() {
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
              <Bug className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Mosquito Netting
            </Heading>
            <Text className="text-xl text-gray-600">
              Premium mosquito mesh fabric sold by the yard. The same solution-dyed 
              material we use in our professional curtain products.
            </Text>
          </Stack>
        </section>

        {/* Product Info */}
        <HeaderBarSection icon={Bug} label="Product Details" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Roll.jpg"
                alt="Mosquito netting material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our heavy-duty mosquito netting is designed to keep out mosquitoes, gnats, 
                and black flies while allowing air to flow freely through.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">450 denier (super strong)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution-dyed (won't fade)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Blocks mosquitoes, gnats, black flies</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available by the yard or roll</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <HeaderBarSection icon={CheckCircle} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 3, tablet: 3 }} gap="lg" className="max-w-xl mx-auto">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-3" />
              <Heading level={5}>Black</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Most Popular</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>White</Heading>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-[#F5F5DC] border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>Ivory</Heading>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Sizing */}
        <HeaderBarSection icon={Ruler} label="Sizing & Pricing" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center">
              Available in various widths. Contact us for current pricing and availability.
            </Text>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Width</th>
                    <th className="text-left py-3 font-semibold">Common Uses</th>
                    <th className="text-left py-3 font-semibold">Sold As</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">54" Wide</td>
                    <td>Smaller panels, patching</td>
                    <td>By the yard</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">72" Wide</td>
                    <td>Standard panels, most projects</td>
                    <td>By the yard or roll</td>
                  </tr>
                  <tr>
                    <td className="py-3">108" Wide</td>
                    <td>Large panels, fewer seams</td>
                    <td>By the yard or roll</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </HeaderBarSection>

        {/* Common Uses */}
        <HeaderBarSection icon={Bug} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Porch Screens</Heading>
              <Text className="text-xs text-gray-500 !mb-0">DIY screening projects</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Bed Canopies</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Indoor/outdoor sleeping</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Garden Protection</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Keep pests off plants</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Event Tents</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Temporary enclosures</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Mosquito Netting Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.MOSQUITO_NETTING_FABRIC}
                title="Mosquito Netting Fabric"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Mosquito Netting Fabric</Text>
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
          <Heading level={2} className="!mb-4">Ready to Order?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing and to place your order for mosquito netting.
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
        <HeaderBarSection icon={Camera} label="Mosquito Net Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-1024x768.jpg"
                  alt="Large mosquito netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Ivory-Mosquito-netting-1200-1024x768.jpg"
                  alt="ivory mosquito net fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Ivory-Mosquito-netting-1200-768x576.jpg"
                  alt="ivory mosquito net fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-no-see-um-1200-768x576.jpg"
                  alt="black noseeum mosquito netting mesh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-no-see-um-1200-768x576.jpg"
                  alt="white no-see-um netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Shade-1200-768x576.jpg"
                  alt="black shade fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Shade-1200-768x576.jpg"
                  alt="white shade material"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Gray-Sharks-tooth-Scrim-1200-768x576.jpg"
                  alt="Gray Scrim material"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Sharks-tooth-Scrim-1200-768x576.jpg"
                  alt="White Theatre scrim"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Mosquito Net Fabric" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Massive Netting Rolls Up To 144″

Strong Netting Lifts 240lb Man

10% Off Sale until Feb 14th… Coupon = Midwinter26
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-1024x768.jpg"
                alt="Large mosquito netting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="“Standard” Compared To Our “Heavy”Mosquito Net Fabric" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">This is $1/ft less expensive than our Heavy Mosquito Fabric and can be considered equivalent to high quality mosquito net you might see elsewhere online (there is very cheap garbage mesh netting online that is tissue paper thin and very fragile). Our Heavy Mosquito Mesh (different) is our own durable recipe made to last and considering that most of Insect Net cost is in the looming and not the thread, heavy mosquito net is really a better value. Nonetheless, if your project doesn’t require the uber-quality, why not save a little?</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Standard Mosquito Net Fabric" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Black Mosquito Netting

White Mosquito Netting

Ivory Mosquito Netting
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Mosquito-Netting-1200.jpg"
                alt="black mosquito netting mesh"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Other Mesh Types" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We have several other mesh netting fabric to choose from! Each of these raw netting meshes serve a particular purpose in our fabricated solutions. We sell them here in raw netting pieces cut by the linear foot from huge rolls to custom fit your needs. Scroll down to see and navigate to our different meshes.</Text>
              <Text className="text-gray-600">Compare Optical Qualities</Text>
              <Text className="text-gray-600">Mesh Types Overview</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Heavy Mosquito Mesh Fabric" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Standard mosquito netting is half the thread weight and less expensive than our Heavy Mosquito Mesh but looks very similar.

Black Standard Mosquito Mesh

White Standard Mosquito Mesh

Ivory Standard Mosquito Mesh
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Mosquito-Netting-1200.jpg"
                alt="black mosquito netting mesh"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="No-See-Um Mesh Fabric" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Noseeum netting has smaller holes with a much denser weave to keep out the pesky, biting flies known as no-see-ums (because they’re too small to see) that live near water.

Black No-see-um Netting

White No-see-um Netting
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-no-see-um-1200-768x576.jpg"
                alt="black noseeum mosquito netting mesh"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Shade | Outdoor Projection" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Black Shade Mesh – will not fade and blocks both insects and 80% of sunlight. Best Visibility.

White Shade Mesh – is used primarily for outdoor projection screens.

Black Shade Mesh

White Projection Screen
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Black-Shade-1200-768x576.jpg"
                alt="black shade fabric"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Shark Tooth Scrim Mesh" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Used for indoor projection and theater scrims.

Silver Theater Scrim

White Theater Scrim
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Gray-Sharks-tooth-Scrim-1200-768x576.jpg"
                alt="Gray Scrim material"
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
