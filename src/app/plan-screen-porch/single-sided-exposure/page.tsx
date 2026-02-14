'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Square,
  Ruler,
  ShoppingCart,
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
  PowerHeaderTemplate,
} from '@/lib/design-system'
import PanelCalculator from '@/components/plan/PanelCalculator'

export default function OneSidedPage() {
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
            title="Garages, French Doors, Single Exposure Alcoves"
            subtitle="This is the easiest of all applications that we often call the &quot;straight shot&quot; because your exposure turns no corners. Generally, the project is divided into 2 panels that come together to form a magnetic doorway so that you can enter easily."
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* Instructional Steps */}
        <HeaderBarSection icon={Ruler} label="Getting Started" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              By now you have probably chosen a mesh-type &amp; color and either (tracking or Velcro) top attachment. At this point, we recommend:
            </Text>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#406517] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Order panels &amp; necessary hardware from our store page or call us for help.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#406517] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Make measurement adjustments using calculator below to give you ORDER measurements.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#406517] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>If you want doorway not in the middle, that is okay. Just allocate widths accordingly.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#406517] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>If magnetic door is in the middle, divide your opening width in 2 equal widths for each panel.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#406517] text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <span>Measure &quot;daylight height and width&quot; of opening WITHOUT overlap.</span>
              </li>
            </ol>
          </Stack>
        </HeaderBarSection>

        {/* Possible Panel Configurations */}
        <HeaderBarSection icon={Square} label="Possible Panel Configurations" variant="dark">
          <Text className="text-gray-600 mb-6">
            Your project will consist of 1 or more panels. The diagrams below demonstrate a few possibilities from a side view using{' '}
            <Link href="/plan-screen-porch/magnetic-doorways" className="text-[#406517] underline font-medium">
              marine snaps, magnetic doorways, and stucco strips
            </Link>.
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2.jpg" target="_blank" rel="noopener noreferrer">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-STUCCO-STRIP-2000-2.jpg"
                  alt="Single panel with stucco strip configuration"
                  className="w-full h-auto"
                />
              </div>
            </a>
            <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-PANELS-WITH-MAGNETIC-DOORWAY-2000-1.jpg" target="_blank" rel="noopener noreferrer">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/2-PANELS-WITH-MAGNETIC-DOORWAY-2000-1.jpg"
                  alt="2 panels with magnetic doorway configuration"
                  className="w-full h-auto"
                />
              </div>
            </a>
            <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/08/SINGLE-PANEL-WITH-2-STUCCO-STRIPS-2000-1536x922-2.jpg" target="_blank" rel="noopener noreferrer">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/08/SINGLE-PANEL-WITH-2-STUCCO-STRIPS-2000-1536x922-2.jpg"
                  alt="Single panel with 2 stucco strips configuration"
                  className="w-full h-auto"
                />
              </div>
            </a>
            <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-MARINE-SNAPS-ON-EACH-END-2000-1.jpg" target="_blank" rel="noopener noreferrer">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/SINGLE-PANEL-WITH-MARINE-SNAPS-ON-EACH-END-2000-1.jpg"
                  alt="Single panel with marine snaps on each end"
                  className="w-full h-auto"
                />
              </div>
            </a>
          </Grid>
        </HeaderBarSection>

        {/* Panel Adjustments */}
        <HeaderBarSection icon={Ruler} label="Panel Adjustments (Or Use Calculator Below)" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Once you have your panel configuration, there are a few panel adjustments to make for each panel. The sum width of all your panels needs to be wider than your actual exposure for overlapping magnetic doors or overlapping a structural surface (like a wall or column) and a little more so that you can have a relaxed fit. Use our panel calculator below to help with your calculations.
            </Text>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              {/* Width Adjustments */}
              <Card className="!p-6 !bg-white !border-[#406517]/20">
                <Heading level={4} className="!mb-4 text-[#406517]">WIDTH ADJUSTMENTS (or use calculator below)</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">For Tracking Attachment: Add another 1-in per 10ft of panel width for relaxed fit</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Subtract 1-in for EACH edge connecting a Stucco Strip, and ignore width of stucco strip</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Add another 1-inch per panel for EACH edge that will snap to some surface</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Automatically add 2-inches per panel regardless of width, then</ListItem>
                </BulletedList>
              </Card>

              {/* Height Adjustments */}
              <Card className="!p-6 !bg-white !border-[#003365]/20">
                <Heading level={4} className="!mb-4 text-[#003365]">HEIGHT ADJUSTMENTS</Heading>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Measuring is done from the bottom of the track mounting surface to the floor.</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">NO height adjustments necessary for tracking. The 1-inch drop in the track will automatically give you a 1-inch overlap with the floor.</ListItem>
                </BulletedList>
              </Card>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Panel Calculator */}
        <PanelCalculator />

        {/* Ready to Order CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Order?</Heading>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/order-mesh-panels">
                <ShoppingCart className="w-5 h-5 mr-2" />
                I&apos;m Ready To Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/plan-screen-porch">
                Back to Planning
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
