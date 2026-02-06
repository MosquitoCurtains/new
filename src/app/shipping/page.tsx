'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Truck, Globe, MapPin, Clock, Info } from 'lucide-react'
import { Text, Grid, Card, Heading, Frame , HeaderBarSection, Stack, TwoColumn, BulletedList} from '@/lib/design-system'

const CONTENT_SECTIONS = [
  {
    title: 'American Orders',
    icon: Truck,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Your custom made curtain panels will ship out via UPS in 1-4 days from ATLANTA 
          depending upon complexity. Transit times are typically 1-5 business days depending 
          on your location.
        </Text>
        <Text className="text-gray-600 mb-4">
          Sometimes, we send USPS to Alaska and Hawaii as it often arrives faster. 
          <strong> We do NOT require a signature.</strong>
        </Text>
        <Text className="text-gray-600">
          Production time is typically 6-10 business days, plus shipping transit time.
        </Text>
      </>
    ),
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Planner-Image-1920.jpg',
  },
  {
    title: 'Canadian Orders',
    icon: MapPin,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Transit times are 3 days to Ontario and up to 7 days to British Columbia.
        </Text>
        <Text className="text-gray-600 mb-4">
          When you order, we will charge you GST/HST and then pay these taxes along with 
          any brokerage fees on your behalf. The price estimator does not make these 
          calculations, though they are what you would expect in your province.
        </Text>
        <Text className="text-gray-600 font-medium">
          What you pay us is the LAST USD you will pay to receive your order.
        </Text>
      </>
    ),
  },
  {
    title: 'International Orders',
    icon: Globe,
    iconColor: '#B30158',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Transit times are generally 5-14 business days and the carrier is determined 
          based on cost as our actual shipping costs exceed what you will be charged.
        </Text>
        <Text className="text-gray-600 mb-4">
          <strong>You will pay customs fees upon arrival.</strong> These vary by country.
        </Text>
        <Text className="text-gray-600">
          For international orders, we strongly encourage you to email us a digital photo 
          prior to ordering so that we can ensure the accuracy of your order.
        </Text>
      </>
    ),
  },
  {
    title: 'Shipping Cost',
    icon: Clock,
    iconColor: '#FFA501',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Your custom made curtain panels & hardware are totally unique to your application. 
          Because of this, shipping cost calculations vary depending on the order.
        </Text>
        <Text className="text-gray-600">
          Use our <a href="/start-project" className="text-[#406517] hover:underline font-medium">instant quote calculator</a> to 
          estimate what your shipping cost will be depending on your order type and project dimensions.
        </Text>

        <HeaderBarSection icon={Info} label="Shipping & Delivery Information" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">AMERICAN ORDERSYour custom made curtain panels will ship out via UPS in 1-4 days from ATLANTA depending upon complexity. The map shows time in transit. Sometimes, we send USPS to Alaska and Hawaii as it often arrives faster. We do NOT require a signature. CANADIAN ORDERSTransit times are 3 days to Ontario and up to 7 days to BC. When you order, we will charge you GST/HST and then pay these taxes along with any brokerage fees on your behalf. The price estimator does not make these calculations, though they are what you would expect in your province. What you pay us is the LAST USD you will pay to receive your order. INTERNATIONAL ORDERSTransit times are generally 5 -14 business days and the carrier is determined based on cost as our actual shipping costs exceed what you will be charged. You will pay customs fees upon arrival. For international orders, we strongly encourage you to email us a digital photo prior to ordering so that we can ensure the accuracy of your order.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="How To Use This Instant Price Calculator" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">If you haven’t yet explored the website to discover your options, that’s okay for now! This will give you some close idea on cost, quickly & hassle free to determine if our product is worth your time. It should be within about 5% and enough to make a decision. Mesh Type – Mosquito Mesh & Tracking “Top Attachment” are most common but you are free to change. Project Width – is the Sum Width of your ENTIRE project (sum width of ALL Panels). A good guess at project width will provide a reasonable price “guess-timate” Number of Panels – Your project will be divided into some number of individual panels. Typically, it is the number of ENTIRE sides (before exposure turns a corner) + 1, but you can change. For example, a 3-sided or U-Shaped exposure will typically require 4 individual panels (3 sides + 1). Top Attachment – will determine what type, if any, tracking hardware you will need. This estimate should be very close and predicts what fastening hardware you will need. In fact, 90% of the time it will be higher than your actual cost since we would rather have you pleasantly surprised than the other way around. Costs may be a bit more if you have unusual situations requiring custom work like slopes or notches.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="How To Use This Instant Price Calculator" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">A good guess at measurements will provide a good guess at pricing. The calculator estimates all the hardware you will need. 90% of the time your actual price will be a bit lower unless there is a lot of custom work like notches and slopes or unusual circumstances. Project Height – we break pricing into 3 buckets based on the height. Project Width = TOTAL sum width of the ENTIRE project to protect. Number of Panels – More panels means more fasteners & fabrication effort. Introduce a new panel:Top Attachment – Most Clear Vinyl Applications use Fixed / Velcro Top Attachment. Choosing “tracking” estimates the cost of tracking hardware you will need.</Text>
              <BulletedList>
                <li>Where you need an exit. (Panels will “zip together” for egress).</li>
                <li>Where exposures turn a corner.</li>
                <li>When exposures along the same plane get longer than 16ft.</li>
                <li>Panels can span several openings along the same plane.</li>
                <li>Still not sure how many panels? Divide the total project width by 7 and you will be close.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
      </>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Start Your Project', href: '/start-project', description: 'Get an instant estimate' },
  { title: 'Satisfaction Guarantee', href: '/satisfaction-guarantee', description: 'Our return policy' },
  { title: 'Contact Us', href: '/contact', description: 'Questions about your order' },
]

export default function ShippingPage() {
  return (
    <SupportPageTemplate
      title="Shipping & Delivery"
      subtitle="Everything you need to know about shipping your custom order"
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    >
      {/* Shipping Timeline */}
      <section className="mt-8">
        <Card variant="elevated" className="!p-6">
          <Heading level={3} className="!mb-4 text-center">Typical Timeline</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-[#406517] font-bold">1</span>
              </div>
              <Heading level={4}>Order Placed</Heading>
              <Text size="sm" className="text-gray-500">Day 0</Text>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-[#003365] font-bold">2</span>
              </div>
              <Heading level={4}>Production</Heading>
              <Text size="sm" className="text-gray-500">6-10 Business Days</Text>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#B30158]/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-[#B30158] font-bold">3</span>
              </div>
              <Heading level={4}>Delivery</Heading>
              <Text size="sm" className="text-gray-500">1-7 Days Transit</Text>
            </div>
          </Grid>
        </Card>
      </section>
    </SupportPageTemplate>
  )
}
