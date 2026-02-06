'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  ThermometerSun,
  Droplets,
  Wind,
  Eye,
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
  YouTubeEmbed,
TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function ClearVinylConsiderationsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              What Can Go Wrong With Clear Vinyl
            </Heading>
            <Text className="text-xl text-gray-600">
              We believe in transparency. Here's what you should know about clear vinyl 
              enclosures before you buy - and how we've solved these challenges.
            </Text>
          </Stack>
        </section>

        {/* Video Overview */}
        <YouTubeEmbed
          videoId={VIDEOS.CLEAR_VINYL_WHAT_CAN_GO_WRONG}
          title="What Can Go Wrong With Clear Vinyl"
          variant="card"
        />

        {/* Heat Buildup */}
        <HeaderBarSection icon={ThermometerSun} label="Heat Buildup" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Heat-Consideration.jpg"
                alt="Heat buildup consideration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> Clear vinyl creates a greenhouse effect. 
                  Direct sunlight can make enclosed spaces uncomfortably warm.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Our panels are designed to be easily 
                  removed or rolled up, allowing airflow when needed. Many customers also 
                  add vents or use a combination of clear vinyl and mesh panels.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Condensation */}
        <HeaderBarSection icon={Droplets} label="Condensation" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> When temperature differentials exist between 
                  inside and outside, condensation can form on the vinyl surface.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Proper ventilation reduces condensation. We 
                  recommend vents near the top and bottom of your enclosure. The condensation 
                  that does form wipes away easily.
                </Text>
              </Card>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Condensation-Example.jpg"
                alt="Condensation on clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Wind Noise */}
        <HeaderBarSection icon={Wind} label="Wind Interaction" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Wind-Consideration.jpg"
                alt="Wind and clear vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> In high winds, vinyl panels can flap or 
                  make noise if not properly secured.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> Our marine-grade zippers and heavy-duty 
                  grommets keep panels secure. For high-wind areas, we recommend additional 
                  tie-down points and proper tensioning.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Clarity Over Time */}
        <HeaderBarSection icon={Eye} label="Clarity Over Time" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>The Challenge:</strong> Lower-quality vinyl can yellow, cloud, or 
                  become brittle over time from UV exposure.
                </Text>
              </Card>
              <Card className="!p-4 !bg-green-50 !border-green-200">
                <Text className="text-sm text-green-800 !mb-0">
                  <strong>Our Solution:</strong> We use only premium 30-gauge marine vinyl 
                  with UV inhibitors. Properly cared for, our vinyl stays crystal clear 
                  for years. We've had customers with 10+ year old panels still looking great.
                </Text>
              </Card>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clarity-Example.jpg"
                alt="Clear vinyl clarity"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Our Commitment */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Our Commitment to Quality</Heading>
          <BulletedList spacing="md" className="max-w-2xl mx-auto">
            <ListItem variant="checked" iconColor="#003365">30-gauge premium marine vinyl (thicker than competitors)</ListItem>
            <ListItem variant="checked" iconColor="#003365">UV inhibitors to prevent yellowing</ListItem>
            <ListItem variant="checked" iconColor="#003365">Marine-grade Sunbrella fabric borders</ListItem>
            <ListItem variant="checked" iconColor="#003365">YKK marine zippers and stainless hardware</ListItem>
            <ListItem variant="checked" iconColor="#003365">Satisfaction guarantee</ListItem>
          </BulletedList>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Questions? We're Here to Help</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our planners can discuss your specific situation and help you determine 
            if clear vinyl is right for your space.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="What Can Go Wrong Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do-768x576.jpg"
                  alt="What Can Go Wrong"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/MOSQUITO-CURTAINS-CLEAR-VINYL-EXAMPLE-2400-768x576.jpg"
                  alt="What Can Go Wrong"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Kurt-200x291-1.jpg"
                  alt="What Can Go Wrong"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1.jpg"
                  alt="Shade Fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Full Transparency = Trust" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Let’s start backwards and talk about how clear vinyl panels will eventually meet their demise and it is all about YOUR REASONABLE CARE. Clear Vinyl Plastic does fine in the cooler months but shrinks and yellows in the very hot summer sun and panels need to be cleaned once a year with a conditioner (we provide) to clean the bit of street crud that can accumulate over time and only gets harder to remove.

Typically panels go up in the fall and MUST be completely removed when temperatures are consistently above 80°F (just after pollen season) and stored in a cool dry place below 75°F. Anyone who tells you differently… well, let’s just say we don’t share the same ethics in business.

Clear Vinyl Plastic Enclosures are perfectly dense and subject to wind loads that depend on a number of factors. More fixed fasteners will distribute the stress on those fasteners, so please use what is recommended by your planner. If you have significant winds, TELL YOUR PLANNER. We will either show you how to brace for significant winds, or in some cases, we will recommend another provider with more robust (though intrusive) hardware.

Like any material fabric, Clear Vinyl Winter Panels are vulnerable to sharp objects and very hot objects (like a BBQ). Follow these care guidelines and you will get 8-12 years out of them… Or don’t, and you will get about half that life. Lastly, when comparing products consider the hardware used, usability, ease of removal, and fabrication quality. All will affect the look and longevity of your new enclosure.

What Not To Do!

What We Do
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do-768x576.jpg"
                alt="Full Transparency = Trust"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Caring For Clear Vinyl Winter Panels" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Caring for your curtains is extremely important! We put our hearts into making these with extreme attention to detail. Take care of them properly and they will last you many fun seasons. We love getting calls from clients saying their clear vinyl winter panels have lasted way longer than they anticipated! These are the people who took an hour a year to take them down, wash them, and store them in a cool, dry place for next season.</Text>
              <BulletedList>
                <li>Take down your curtains before summer</li>
                <li>Wash with soap and water and condition with FastWax</li>
                <li>Store in a cool, dry place like under a bed indoors</li>
                <li>Take advantage of our simple hardware to make your enclosure last</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Here Is An Extreme Example" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                In 2020, Lake Havasu experienced 3 weeks with temperatures above 108 degrees. These were rolled up on a metal bar that was even hotter and the scorching bar melted holes in the direct sun. The curtains shrunk and became misshaped .

COMPLETELY remove curtains when temperatures approach 80 degrees and store in a cool dry place (NOT in a garage or attic).  A good rule of thumb is to remove them right after pollen season.

What Not To Do!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-left-up-during-summer-in-108-degrees-small.jpg"
                alt="Here Is An Extreme Example"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Expected Life Depends On Your Reasonable Care" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">The mosquito netting, no-see-um netting & Clear Vinyl are high quality fabrics, but with limits. A weed eater will definitely make a hole, raking the netting repeatedly against a stucco corner, or sharp object will wear a hole. Curtains are vulnerable to sharp objects and hot objects that will melt panels such as cigarettes, BBQs and hot gas blowers (gardeners should be made aware).</Text>
              <Text className="text-gray-600">Clear Vinyl panels are perfectly dense and should be removed in heavy winds over 25mph and will crack if manipulated at temperatures below minus 10-degrees Fahrenheit. We ask you to please be careful with your measurements! We recognize that ordering such a product online is new to many of you and perhaps a bit of a challenge. If there are any miscuts or defects, we will simply correct the error to your satisfaction. Your backstop is that you are free return the curtain for a complete refund of your purchase (not including original or return shipping charges) within 6 weeks of your purchase date. It is an easy guarantee to make since after more than 54,000 orders, we’ve had only a handful of returns.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Privacy Policy" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We do NOT share ANY customer information with 3rd parties, EVER. Our credit card processing is set up in a manner that even we cannot access your credit card numbers for online orders. Credit cards are directly processed through PayPal processing. You will notice https:// in the URL signifying that our site is secured with an SSL certificate for your protection.</Text>
              <Text className="text-gray-600">At times, clients ask us for the names of clients in the neighborhood so that they can see the product, first hand. We politely refuse ALL such requests to protect the privacy of our good clients. We cannot afford background checks and we would rather miss the business than subject anyone to unforeseen risk, however remote.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Plastic Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Is great for protecting people plants and pets from the winter elements. We encourage you to remove them during the hot summer months. It isn’t a huge request because they are easy to remove and there is no need for them in the summer, anyways. Remember these are perfectly dense so do you really want to sit behind a magnifying glass in the hot summer sun? Wouldn’t it be better to have our interchangeable mosquito netting curtains that will enable the cool breeze to pass?</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
