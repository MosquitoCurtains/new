'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle,
  Play,
  Wrench,
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
import { VIDEOS, TRACKING_VIDEOS } from '@/lib/constants/videos'

export default function TrackingPage() {
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
            title="Step 2. Two Top Attachment Options"
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* Quick Summary */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#406517">Tracking Attachment allows you to slide curtains from side to side.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Velcro Attachment is fixed in place and doesn&apos;t slide.</ListItem>
            <ListItem variant="arrow" iconColor="#406517">Both are easy to install. Velcro is less expensive (no track hardware).</ListItem>
          </BulletedList>
        </Card>

        {/* Tracking vs Velcro Side by Side - with animated GIFs from WordPress */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
          <Card variant="elevated" className="!p-6 !border-[#406517]/20 text-center">
            <div className="rounded-xl overflow-hidden mb-4">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif"
                alt="Tracking slides side-to-side"
                className="w-full h-auto"
              />
            </div>
            <Heading level={3} className="!mb-2 text-[#406517]">Tracking -- slides side-to-side</Heading>
            <Text className="text-gray-500 !mb-0">Under-mounted</Text>
          </Card>
          <Card variant="elevated" className="!p-6 !border-[#003365]/20 text-center">
            <div className="rounded-xl overflow-hidden mb-4">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif"
                alt="Velcro fixed does not slide"
                className="w-full h-auto"
              />
            </div>
            <Heading level={3} className="!mb-2 text-[#003365]">Velcro (fixed) does NOT slide</Heading>
            <Text className="text-gray-500 !mb-0">Side-mounted &amp; less cost</Text>
          </Card>
        </Grid>

        {/* ================================================================
            OUTDOOR CURTAIN TRACKING
            ================================================================ */}
        <HeaderBarSection icon={SlidersHorizontal} label="Outdoor Curtain Tracking" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-700">
              Outdoor Curtain Tracking is like the old Hot Wheels track you may have played with as a kid. Curved tracking + Splices allow you to create virtually any track configuration for any desired length. Cut your final piece with an ordinary hacksaw. Tracking hardware must be ordered separately.
            </Text>
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Ceiling mounted screws go straight up through the track into some solid surface. No brackets!</ListItem>
              <ListItem variant="arrow" iconColor="#406517"><em>If your overhead surface is a metal waterproof system where screws would cause leaks, a 40mil double-sided VHB tape will adhere the track overhead. (purchased separately at www.Uline.com)</em></ListItem>
              <ListItem variant="arrow" iconColor="#406517">Sleek design at 3/4&quot; x 3/4&quot; x 7ft long</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Powder coated white or black aluminum that quickly cuts using ordinary hacksaw</ListItem>
              <ListItem variant="arrow" iconColor="#406517">Only 4 components: straight tracks, curved tracks, splices, &amp; end caps</ListItem>
            </BulletedList>
          </Stack>
        </HeaderBarSection>

        {/* Tracking Components */}
        <HeaderBarSection icon={Wrench} label="Tracking Components (Available in Black or White)" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 5 }} gap="md">
            <Card variant="outlined" className="!p-4 text-center">
              <div className="rounded-lg overflow-hidden mb-3 aspect-square">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Straight-Track-Black-1-200x200-1.jpg" alt="7ft Straight Track" className="w-full h-full object-contain" />
              </div>
              <Heading level={5} className="!mb-0">7ft Straight Track</Heading>
            </Card>
            <Card variant="outlined" className="!p-4 text-center">
              <div className="rounded-lg overflow-hidden mb-3 aspect-square">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/90-Black-Track-1-1024x1024.jpg" alt="90 Degree Curve" className="w-full h-full object-contain" />
              </div>
              <Heading level={5} className="!mb-0">90 Degree Curve</Heading>
            </Card>
            <Card variant="outlined" className="!p-4 text-center">
              <div className="rounded-lg overflow-hidden mb-3 aspect-square">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/135-Black-Track-1-200x200-1.jpg" alt="135 Degree Curve" className="w-full h-full object-contain" />
              </div>
              <Heading level={5} className="!mb-0">135 Degree Curve (Rare)</Heading>
            </Card>
            <Card variant="outlined" className="!p-4 text-center">
              <div className="rounded-lg overflow-hidden mb-3 aspect-square">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-White-Splice-1024x1024.jpg" alt="Splice" className="w-full h-full object-contain" />
              </div>
              <Heading level={5} className="!mb-0">Splice</Heading>
            </Card>
            <Card variant="outlined" className="!p-4 text-center">
              <div className="rounded-lg overflow-hidden mb-3 aspect-square">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-White-End-Cap-1024x1024.jpg" alt="End Caps" className="w-full h-full object-contain" />
              </div>
              <Heading level={5} className="!mb-0">End Caps</Heading>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            FIXED VELCRO ATTACHMENT
            ================================================================ */}
        <HeaderBarSection icon={CheckCircle} label="Fixed Velcro Attachment" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-700">
              Velcro panels are fixed in place and do not slide. You can still enter and exit through magnetic doorways even though the top is stationary. <strong>Velcro is side-mounted to some surface</strong> as under-mounting is a weak hold.
            </Text>
            <Text className="text-gray-700">
              We double-stitch Loop-sided Velcro to the top of your panel and provide Adhesive-backed hook to apply to your surface that you will reinforce with a staple gun every 12 inches.
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            INSTALLATION VIDEOS
            ================================================================ */}
        <HeaderBarSection icon={Play} label="See Actual Installation of Both Options" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Rather than TELL how either outdoor curtain tracking or Velcro installation works, we&apos;d rather SHOW you with an actual installation.
            </Text>
            <Text className="text-sm text-gray-500 text-center italic">
              Tip: You can adjust play speed. Click &quot;cog gear&quot; in lower right of video to change play speed setting.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              {TRACKING_VIDEOS.map((video) => (
                <div key={video.id}>
                  <YouTubeEmbed
                    videoId={video.id}
                    title={video.title}
                    variant="card"
                  />
                  <Text className="text-center mt-2 font-medium text-sm">{video.title}</Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            WHEN YOU DO NOT HAVE A CLEAR MOUNTING PATH
            ================================================================ */}
        <HeaderBarSection icon={Wrench} label="When You Do Not Have a Clear Mounting Path" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="arrow" iconColor="#406517">Velcro Attachment -- under-mount a wood strip to create a clear path to side mount panels to outer edge of wood strip.</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Tracking (example to right) -- side-mount a wood strip to create a clear path and then under-mount track to wood strip.</ListItem>
                <ListItem variant="arrow" iconColor="#406517">Hint: Home Depot sells synthetic molding made of white PVC composite that will not rot or split and can be painted.</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Columns-Interrupt-Path.jpg" target="_blank" rel="noopener noreferrer">
                <div className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Columns-Interrupt-Path.jpg" alt="Columns interrupt track path" className="w-full h-auto" />
                </div>
                <Text className="text-center text-sm text-gray-500 mt-1">Columns Interrupt Track Path</Text>
              </a>
              <a href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Mounted-Wood-Strips.jpg" target="_blank" rel="noopener noreferrer">
                <div className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Mounted-Wood-Strips.jpg" alt="Side-mount wood strips for clear path" className="w-full h-auto" />
                </div>
                <Text className="text-center text-sm text-gray-500 mt-1">Side-mount Wood Strips For Clear Path</Text>
              </a>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Continue Navigation */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/plan-screen-porch/magnetic-doorways">
                Continue to Step 3 -- Doorways &amp; Fasteners
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
