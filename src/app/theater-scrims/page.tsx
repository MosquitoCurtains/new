'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Theater,
  Lightbulb,
  CheckCircle,
Camera, Info} from 'lucide-react'
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
  WhyChooseUsTemplate,
  YouTubeEmbed,
TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function TheaterScrimsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-full mx-auto flex items-center justify-center">
              <Theater className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Theater Scrims
            </Heading>
            <Text className="text-xl text-gray-600">
              Professional theatrical scrim fabric for stage productions, concerts, 
              events, and creative installations.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Get a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/raw-netting/scrim">
                  View Raw Scrim
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* What Is Scrim */}
        <HeaderBarSection icon={Theater} label="What Is Theatre Scrim?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Theatre-Scrim-Stage.jpg"
                alt="Theatre scrim on stage"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Theatre scrim is a specialized gauze-like fabric that creates magical visual 
                effects on stage. Its unique property: when lit from the front, it appears 
                opaque; when lit from behind, it becomes transparent.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#8B5CF6">Opaque with front lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Transparent with back lighting</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Creates dramatic reveals</ListItem>
                <ListItem variant="checked" iconColor="#8B5CF6">Used by professional productions worldwide</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* The Scrim Effect */}
        <HeaderBarSection icon={Lightbulb} label="The Magical Scrim Effect" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gray-600 opacity-80 rounded-lg"></div>
                <Theater className="w-8 h-8 text-white relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Front Lit</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Audience sees the scrim surface - what's behind is hidden.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-amber-500 opacity-30 rounded-lg"></div>
                <Theater className="w-8 h-8 text-amber-400 relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Back Lit</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Scrim becomes transparent - reveals what's behind it.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-full h-24 bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-amber-500 opacity-50 rounded-lg"></div>
                <Theater className="w-8 h-8 text-white relative z-10" />
              </div>
              <Heading level={5} className="!mb-2">Transition</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Fade between states for stunning reveal moments.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={CheckCircle} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Theatre</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Plays & musicals</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Dance</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Ballet & modern</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Concerts</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Live music</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Corporate</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Events & reveals</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Film/TV</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Production sets</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Museums</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Exhibits</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Retail</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Window displays</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Art</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Installations</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Options */}
        <HeaderBarSection icon={Theater} label="What We Offer" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Raw Scrim Fabric</Heading>
              <Text className="text-gray-600 mb-4">
                Purchase scrim by the yard for your own fabrication. Available in various 
                widths and colors.
              </Text>
              <Button variant="outline" asChild size="sm">
                <Link href="/raw-netting/scrim">
                  View Raw Scrim
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Finished Scrims</Heading>
              <Text className="text-gray-600 mb-4">
                We can sew, hem, add grommets, and finish your scrim to your exact 
                specifications.
              </Text>
              <Button variant="outline" asChild size="sm">
                <Link href="/raw-netting/custom">
                  Custom Orders
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Theater} label="Theater Scrim Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.GARAGE_PROJECTION} title="Projection Screen / Home Theater" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Projection Screen / Home Theater</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.THEATER_SCRIM} title="Theater Scrim Demo" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Theater Scrim Demo</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* Flame Retardant */}
        <Card className="!p-6 !bg-[#8B5CF6]/5 !border-[#8B5CF6]/20">
          <Heading level={3} className="!mb-4 text-center">Flame Retardant Options</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto">
            Many venues require flame retardant (FR) fabrics. We offer both inherently 
            FR scrim and treated options that meet NFPA 701 standards. Ask us about 
            certification documentation for your venue.
          </Text>
        </Card>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#8B5CF6]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Order Theater Scrim?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing on raw scrim fabric or custom finished scrims.
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
        <HeaderBarSection icon={Camera} label="Theater Scrims Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Projection-1-768x768.jpg"
                  alt="Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Projection-2-768x768.jpg"
                  alt="Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Theater-1-768x768.jpg"
                  alt="Theater Scrims"
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
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/06-Theater-Scrims-Projection-Screens-1200-1-768x576.jpg"
                  alt="white theatre scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/09-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="white projection screen for auditorium"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/16-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/11-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/10-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="large theatre scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/08-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="black scrim"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/14-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/02-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="black theater scrims"
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
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1-300x225.jpg"
                  alt="Shade Fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Ordering" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our team will help plan your project!

10% Off Sale until Feb 14th… Coupon = Midwinter26
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Projection-1-768x768.jpg"
                alt="Ordering"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Projection-2-768x768.jpg"
            alt="$370 + Shipping"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2022/01/Theater-1-768x768.jpg"
            alt="$529 + Shipping"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Theater Scrim Colors &amp; Mesh Type" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Imagine a giant, high-resolution, dense mesh sheet (for wind) made of an outdoor marine-grade polyester, bound on all sides and prepared with Velcro or Grommets to your specifications.

We decided to focus on the quality of our theater scrim material and offer flexible rigging techniques where you can hang your theater scrim from any overhead surface including a header beam on your porch.

White
					

					As good as resolution gets for traditional movie projection. Used primarily for outdoor projection screens.

As good as resolution gets for traditional movie projection. Used primarily for outdoor projection screens.

Silver
					

					Some people prefer silver scrim in a theater/movie room. Still can be used outdoors, resolution is very close to white.

Some people prefer silver scrim in a theater/movie room. Still can be used outdoors, resolution is very close to white.

Black
					

					Less visible when not projecting. Often black is used in night clubs when you want an eerie ghostly effect.  Great for light shows.

Less visible when not projecting. Often black is used in night clubs when you want an eerie ghostly effect.  Great for light shows.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Shade-1200-768x576.jpg"
                alt="white shade material"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="White Theater Scrims for a translucent dreamy effect. Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/06-Theater-Scrims-Projection-Screens-1200-1-768x576.jpg"
                  alt="white theatre scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Theater-Scrim-MacBeth-sm.jpg"
                  alt="Theater Scrim MacBeth"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/09-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="white projection screen for auditorium"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Silver / Gray Theater Scrims Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/16-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Silver / Gray Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/11-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Silver / Gray Theater Scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/10-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="large theatre scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Black Theater Scrims offer a ghostly ethereal effect. Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/08-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="black scrim"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/14-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="Black Theater Scrims offer a ghostly ethereal effect."
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/02-Theater-Scrims-Projection-Screens-1200-768x576.jpg"
                  alt="black theater scrims"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Projection Resolution for Theatre Scrim" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Lighting has everything to do with creating the right effect. Images can be viewed from either side of the mesh with nearly equal resolution (rear project or front project). The theatre scrim resolution depends upon:</Text>
              <BulletedList>
                <li>Mesh Color</li>
                <li>Size of desired image</li>
                <li>Projector Lumens (we used 3200 lumens)</li>
                <li>Ambient (surrounding) light</li>
                <li>How close projector must be to project desired image size called “projector throw”. A Shorter throw puts out better resolution.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Get Started Fast With a Real Person!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are happy to help you plan your project with a quick planning session. For maximum speed and efficiency, photos of your space are extremely helpful. Click the buttons below to see photo guidelines. If you have a general question, call us at (770) 645-4745.</Text>
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

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
