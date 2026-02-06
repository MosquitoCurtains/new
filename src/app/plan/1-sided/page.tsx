'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Square,
  Ruler,
  Camera,
Info} from 'lucide-react'
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

export default function OneSidedPage() {
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
              <Square className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              1-Sided Exposure
            </Heading>
            <Text className="text-xl text-gray-600">
              Your space has one open side that needs to be covered. This is the simplest 
              configuration and perfect for DIY installation.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Square} label="What Is 1-Sided Exposure?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/1-Sided-Example.jpg"
                alt="1-Sided exposure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A 1-sided exposure means your porch, patio, or gazebo has only ONE open side 
                that insects can enter through. The other sides are blocked by walls, screens, 
                or other barriers.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Simplest configuration</ListItem>
                <ListItem variant="checked" iconColor="#406517">Perfect for DIY installation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Most economical option</ListItem>
                <ListItem variant="checked" iconColor="#406517">Quick turnaround</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Scenarios */}
        <HeaderBarSection icon={Camera} label="Common 1-Sided Scenarios" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">French Door Entry</Heading>
              <Text className="text-gray-600 !mb-0">
                Covering a single French door or sliding door opening to a patio.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Garage Opening</Heading>
              <Text className="text-gray-600 !mb-0">
                Single garage bay opening for workshop or recreational use.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Carport Entry</Heading>
              <Text className="text-gray-600 !mb-0">
                One open side of a carport for a screened outdoor living space.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How to Measure */}
        <HeaderBarSection icon={Ruler} label="How to Measure" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="How to Measure for 1-Sided"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Measuring for a 1-sided project is straightforward. You'll need to capture 
                the width and height of your opening.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Measure width at top and bottom</ListItem>
                <ListItem variant="checked" iconColor="#406517">Measure height at both ends</ListItem>
                <ListItem variant="checked" iconColor="#406517">Note any obstructions</ListItem>
                <ListItem variant="checked" iconColor="#406517">Take photos from inside and outside</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* What You'll Need */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">What's Included in Your Kit</Heading>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">1</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Curtain Panel(s)</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">2</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Track or Velcro</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">3</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Side Seals</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">4</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Hardware & Instructions</Text>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get a Quote?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            1-sided projects are perfect for our instant quote tool. Get pricing in minutes.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan">
                Back to Planning
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Single Sided Exposure Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2-768x461.jpg"
                  alt="Custom French door screens 1"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-PANELS-WITH-MAGNETIC-DOORWAY-2000-1-768x461.jpg"
                  alt="Garage door screens option 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/08/SINGLE-PANEL-WITH-2-STUCCO-STRIPS-2000-1536x922-2-768x461.jpg"
                  alt="Single Sided Exposure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-MARINE-SNAPS-ON-EACH-END-2000-1-300x180.jpg"
                  alt="Custom French door screens 2"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Panel-Example-600x450-1.jpg"
                  alt="Mosquito Netting Panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Garages, French Doors, Single Exposure Alcoves" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">This is the easiest of all applications that we often call the “straight shot” because your exposure turns no corners. Generally, the project is divided into 2 panels that come together to form a magnetic doorway so that you can enter easily.</Text>
              <Text className="text-gray-600">By now you have probably chosen a mesh-type & color and either (tracking or Velcro) top attachment. At this point, we recommend:</Text>
              <BulletedList>
                <li>Measure “daylight height and width” of opening WITHOUT overlap</li>
                <li>If magnetic door is in the middle, divide your opening width in 2 equal widths for each panel</li>
                <li>If you want doorway not in the middle, that is okay. Just allocate widths accordingly</li>
                <li>Make measurement adjustments using calculator below to give you ORDER measurements</li>
                <li>Order panels & necessary hardware from our store page or call us for help.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Possible Panel Configurations" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Your project will consist of 1 or more panels. The diagrams below demonstrate a few possibilities from a side view using marine snaps, magnetic doorways, and stucco strips.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2-768x461.jpg"
                alt="Custom French door screens 1"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Panel Adjustments (Or Use Calculator Below)" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Once you have your panel configuration, there are a few panel adjustments to make for each panel. The sum width of all your panels needs to be wider than your actual exposure for overlapping magnetic doors or overlapping a structural surface (like a wall or column) and a little more so that you can have a relaxed fit. Use our panel calculator below to help with your calculations.</Text>
              <Text className="text-gray-600">Width & Height Adjustments For Panels On Tracking</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTS (or use calculator below)HEIGHT ADJUSTMENTS</Text>
              <Text className="text-gray-600">WIDTH ADJUSTMENTS (or use calculator below)HEIGHT ADJUSTMENTS</Text>
              <BulletedList>
                <li>Automatically add 2-inches per panel regardless of width, then</li>
                <li>Add another 1-inch per panel for EACH edge that will snap to some surface</li>
                <li>Subtract 1-in for EACH edge connecting a Stucco Strip, and ignore width of stucco strip</li>
                <li>For Tracking Attachment: Add another 1-in per 10ft of panel width for relaxed fit</li>
                <li>NO height adjustments necessary for tracking. The 1-inch drop in the track will automatically give you a 1-inch overlap with the floor.</li>
                <li>Measuring is done from the bottom of the track mounting surface to the floor.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Simple Panel Adjustment Calculator (if all heights are the same)" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This simple panel calculator will make your panel adjustments for each panel, one at a time!

Use this calculator by entering the 5 pieces of information required to adjust your panels. Repeat for each panel larger than a stucco strip.

NOTE: If the difference between all 4 heights is less than 1.5-inches, just use the tallest of the 4 heights. If the heights differs more than 1.5-inches, call in your order because we will need to taper the slope.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Panel-Example-600x450-1.jpg"
                alt="Mosquito Netting Panels"
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
