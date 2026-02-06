'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Heart, Users, Award, Clock , Camera} from 'lucide-react'
import { Text, Grid, Card, Heading, YouTubeEmbed, Stack , Frame, HeaderBarSection, TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import { ORDERS_SERVED_COUNT, ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'

const CONTENT_SECTIONS = [
  {
    title: 'Our Story',
    icon: Heart,
    iconColor: '#B30158',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Mosquito Curtains was founded in 2004 by a family who simply wanted to enjoy their 
          screened porch without battling mosquitoes. When we couldn't find a quality solution 
          on the market, we created our own.
        </Text>
        <Text className="text-gray-600 mb-4">
          What started as a solution for our own home has grown into a company that has served 
          over {ORDERS_SERVED_COUNT.toLocaleString()} customers across North America and beyond. We're still family-owned and 
          operated, and we still make every curtain right here in Atlanta, Georgia.
        </Text>
        <Text className="text-gray-600">
          Every order matters to us. We're not a faceless corporation - we're a small team of 
          real people who take pride in craftsmanship and customer service.
        </Text>
      </>
    ),
  },
  {
    title: 'Our Team',
    icon: Users,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Our project planning team includes Kurt, Patrick, Aaron, Dan, John, Matt, Heather, 
          and Iryna. When you call or email, you'll talk to a real person who knows our products 
          inside and out.
        </Text>
        <Text className="text-gray-600">
          Our production team has years of experience crafting custom mosquito netting and 
          clear vinyl panels. Every panel is hand-inspected before shipping to ensure it 
          meets our quality standards.
        </Text>
      </>
    ),
  },
  {
    title: 'Our Promise',
    icon: Award,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          We stand behind every product we sell with our satisfaction guarantee. If you're 
          not happy with your purchase, we'll make it right.
        </Text>
        <Text className="text-gray-600">
          We use only marine-grade materials that are built to last outdoors. Our netting 
          is solution-dyed so it won't fade, and our hardware is stainless steel or 
          powder-coated aluminum. We believe in quality that lasts.
        </Text>
      </>

        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="About Us Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/kurt-square-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/mom-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/patrick-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/bella-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Sport-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Duke-Jordan-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/05/Matt-Rier-New-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/John-Hubay-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/07/Dan-McClaskey-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/10/Heather-1-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Patrick-Jordan-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/08/Iryna-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Trang-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Francisco-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Phon-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Doina-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Sinath-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Mike-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Nancy.-150x150.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Meet the Team" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Mosquito Curtains is a true American small family run business. We believe that starts with treating clients right and we consider them part of our family. With the exception of one project, all gallery photos have been contributed by our good clients because they care about us, too.Mandate to all planners: “If you think there is a better solution than what we offer, show the client and sell the merits of the alternative with vigor. NEVER recommend our product if you believe there is a better solution or if our product is inappropriate for their needs!”Every employee contributes to our ongoing mission – to provide the best product with the best service. We are proud of the broad diversity our E-Verified workers bring to us and pay above market wages with profit sharing because we really do believe in FAMILY!If you care as to what might motivate a husband & wife to completely switch careers, read Bond Sales, Mosquito Curtains & A Rodeo Ghost We hope it encourages you to follow YOUR own true purpose.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Founders" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Kurt JordanFounder / SalesRedondo Beach, CA

Elizabeth JordanCo-Owner & DesignMarietta, GA

Patrick JordanStockroom Boy & PoetAtlanta, GA

Isabella JordanFolding & Curtain HuggerAtlanta, GA

Sport JordanInspirationRavenwood, MO(read more)

Duke JordanDiagrams & EngineeringRedondo Beach, CA
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/kurt-square-150x150.jpg"
                alt="Founders"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Sales" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Aaron GoreckiGeneral Manager / Sales / Smart as hellSouth Chicago, IL

Matt RierPlanner / Sales (Most Accurate)Framingham, MA

John HubayPlanner / Sales (Best Contractor Experience)Geneva, IL

Dan McCaskey

Planner/Sales (Great Customer Service)
Alpharetta, GA

Heather EvansCustomer SupportPortland, ME

Patrick JordanPlanner/Sales (Yep, that’s the owner’s son)Dahlonega, GA

Iryna MardanovaSales assistant, Designer & Happy HeartRivne, Ukraine

Trang DangSeasonal Sales Assistant & cool as dirtSavannah, GA
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                alt="Sales"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="The Inception of a Dream" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">The idea came to us in 1999 when we wanted to screen our own porch. We called a contractor who quoted us $5,000 to screen our porch. Considering what was involved to frame, prime, paint, frame a door, then stretch and staple screening, it was actually a fair price for what was involved. Our main issue was that we had lovely lathed columns and the contractor explained there was no way to staple screening to an irregularly shaped column and he would have to frame around our beautiful architecture, significantly changing the look of our porch.
We knew there had to be a better way. I trekked off to the fabric store and bought some netting and webbing material. Unfortunately, fabric stores only carry 60″ wide goods, so we had to seam them vertically. I took the materials to a tailor with instructions and wow, it turned out a whole lot better than we had imagined. Best of all, it was removable, washable and complemented our architecture for just a fraction of the initial cost.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Perfecting the Product" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">In 2004, the stars had aligned where I wasn’t happy as an institutional bond salesman and was looking for a career change and we decided to go for it (Read Full Story: Bond Sales, Mosquito Curtains & A Rodeo Ghost). We found jumbo sized 144″ rolls and continued to make improvements in the quality of the materials, mounting techniques and our production process. Fifteen years later, we have 17 employees and are growing like a weed. In 2004, it took us 9 hours to make our first curtain. By developing a streamline process and adding automation, not only is the quality far better with perfect stitching, that same curtain is now produced in about 25 minutes.</Text>
          </Stack>
        </HeaderBarSection>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
  { title: 'Reviews', href: '/reviews', description: 'See what customers are saying' },
  { title: 'Satisfaction Guarantee', href: '/satisfaction-guarantee', description: 'Our return policy' },
]

export default function AboutPage() {
  return (
    <SupportPageTemplate
      title="About Us"
      subtitle={`A family business serving ${ORDERS_SERVED_FORMATTED} customers since 2004`}
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    >
      {/* Company Video */}
      <section className="mt-8">
        <Card variant="elevated" className="!p-6 md:!p-8">
          <Stack gap="md" className="items-center text-center">
            <Heading level={3} className="!mb-0">See How We Work</Heading>
            <Text className="text-gray-600 max-w-2xl">
              Watch our team in action - from custom fabrication to quality control, 
              every curtain is made with care right here in Atlanta.
            </Text>
            <div className="w-full max-w-3xl">
              <YouTubeEmbed videoId={VIDEOS.COMPANY_OVERVIEW} title="About Mosquito Curtains" variant="card" />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="mt-8">
        <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#406517]">{ORDERS_SERVED_COUNT.toLocaleString()}+</p>
            <p className="text-sm text-gray-500">Happy Customers</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#003365]">2004</p>
            <p className="text-sm text-gray-500">Founded</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#B30158]">Atlanta</p>
            <p className="text-sm text-gray-500">Made in Georgia</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#FFA501]">Family</p>
            <p className="text-sm text-gray-500">Owned & Operated</p>
          </Card>
        </Grid>
      </section>
    </SupportPageTemplate>
  )
}
