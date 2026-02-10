'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Columns2,
  PlayCircle,
  Map,
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
  PowerHeaderTemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function TwoSidedPage() {
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
            title="Planning a 2-sided Exposure"
            subtitle="By now you have probably decided on a mesh-type & color and either tracking or Velcro top attachment. Now you will choose a path and select a panel configuration to size individual panels for sealing to surfaces and positioning magnetic doorways."
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* At this point, we recommend */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Text className="font-medium text-gray-700 !mb-3">At this point, we recommend:</Text>
          <BulletedList spacing="sm">
            <ListItem variant="arrow" iconColor="#406517">Select a configuration to see our configuration-specific detailed planning instructions.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Determine a path either inside or outside your columns depending on your particular column type.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Watch our planning tutorial to see an example laid out step by step. This is optional but very helpful.</ListItem>
          </BulletedList>
        </Card>

        {/* ================================================================
            1) Full Example Planning Session
            ================================================================ */}
        <HeaderBarSection icon={PlayCircle} label="1) Full Example Planning Session" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We have created full example planning session videos to show you how to plan an entire project! This begins with your panel configuration and goes through guidelines for ordering the hardware you need to put it all together. Choose the video with a tracking or Velcro top attachment to get off to a fast start.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <div>
                <YouTubeEmbed
                  videoId={VIDEOS.EXPOSURE_OVERVIEW}
                  title="Tracking Planning Session"
                  variant="card"
                />
                <Text className="text-center mt-2 font-medium">Tracking Planning Session</Text>
              </div>
              <div>
                <YouTubeEmbed
                  videoId={VIDEOS.LAYOUT_PLANNING_OVERVIEW}
                  title="Velcro Planning Session"
                  variant="card"
                />
                <Text className="text-center mt-2 font-medium">Velcro Planning Session</Text>
              </div>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            2) Determine a Path
            ================================================================ */}
        <HeaderBarSection icon={Map} label="2) Determine a Path" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              There is a subtle difference in the path curtains will take depending on what type of columns you have. There are two types of paths to take, an inside hang (inside your columns), or an outside hang (outside your columns).
            </Text>
            <Text className="text-gray-600">
              We group columns into two categories -- regular columns and irregular columns. The path you take depends on the &quot;shape&quot; of the columns that you have.
            </Text>
            <Text className="text-gray-600">
              If you have regular columns and can seal to a perfectly straight edge, we want to take advantage of that opportunity to maximize space and performance of your curtains. You can pass intermediate columns but it is best to terminate panels at CORNER regular columns.
            </Text>
            <Text className="text-gray-600">
              If you have irregularly shaped columns, we will need to plan such that we never have to directly seal to a non-linear edge so panels do not terminate at CORNER irregular columns.
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            Regular or Irregular Columns
            ================================================================ */}
        <HeaderBarSection icon={Columns2} label="Regular or Irregular Columns" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-1.jpg"
                  alt="Regular columns"
                  className="w-full h-auto"
                />
              </div>
              <Heading level={4} className="!mb-4 text-[#406517]">Regular Columns</Heading>
              <Text className="text-gray-600 !mb-0">
                A regular column has a straight edge that makes for a good sealing surface with marine snaps. We recommend an outside hang ending panels at corner columns.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Irregular-Columns-1.jpg"
                  alt="Irregular columns"
                  className="w-full h-auto"
                />
              </div>
              <Heading level={4} className="!mb-4 text-[#003365]">Irregular Columns</Heading>
              <Text className="text-gray-600 !mb-0">
                Irregular columns do not have this straight edge to snap to, so panels will straddle irregular corner columns with our elastic cord to &quot;pinch&quot; the center of the straddling panel to an irregular corner column.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            3) Click 1 of 4 Options For Panel Configuration Guidelines
            ================================================================ */}
        <HeaderBarSection icon={ArrowRight} label="3) Click 1 of 4 Options For Panel Configuration Guidelines" variant="dark">
          <Text className="text-gray-600 text-center mb-6">
            Now choose a configuration based on your column type for details specific to your application.
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Link href="/plan-screen-porch/2-sided-exposure/regular-columns-tracking" className="group">
              <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1 h-full">
                <div className="rounded-xl overflow-hidden mb-3">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Tracking-400x208-1.jpg" alt="Regular Columns With Tracking" className="w-full h-auto" />
                </div>
                <Button variant="primary" className="w-full">Select</Button>
              </Card>
            </Link>
            <Link href="/plan-screen-porch/2-sided-exposure/regular-columns-velcro" className="group">
              <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1 h-full">
                <div className="rounded-xl overflow-hidden mb-3">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Regular-Columns-W-Velcro-400x208-1.jpg" alt="Regular Columns With Velcro" className="w-full h-auto" />
                </div>
                <Button variant="primary" className="w-full">Select</Button>
              </Card>
            </Link>
            <Link href="/plan-screen-porch/2-sided-exposure/irregular-columns-tracking" className="group">
              <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1 h-full">
                <div className="rounded-xl overflow-hidden mb-3">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Irregular-Tracking-400x208-1.jpg" alt="Irregular Columns With Tracking" className="w-full h-auto" />
                </div>
                <Button variant="primary" className="w-full">Select</Button>
              </Card>
            </Link>
            <Link href="/plan-screen-porch/2-sided-exposure/irregular-columns-velcro" className="group">
              <Card variant="elevated" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-lg group-hover:-translate-y-1 h-full">
                <div className="rounded-xl overflow-hidden mb-3">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Irregular-Columns-W-Velcro-400x208-1.jpg" alt="Irregular Columns With Velcro" className="w-full h-auto" />
                </div>
                <Button variant="primary" className="w-full">Select</Button>
              </Card>
            </Link>
          </Grid>
        </HeaderBarSection>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
