import { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, Phone, Mail, Clock, MapPin, Heart, Shield, AlertCircle, ChevronRight } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Heading,
  Card,
  HeaderBarSection,
  BulletedList,
  ListItem,
  FinalCTATemplate,
} from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'Returns Policy | Mosquito Curtains',
  description: 'Returns policy for Mosquito Curtains. We accept returns within 6 weeks, no reason required.',
}

export default function ReturnsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] text-sm px-4 py-2 rounded-full mb-4">
            <RotateCcw className="w-4 h-4" />
            <span>Returns accepted within 6 weeks</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Returns Policy
          </Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            We want you happy with your purchase. Returns are accepted within 6 weeks, no reason required.
          </Text>
        </div>

        {/* Contact Info Cards */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#406517]" />
              </div>
            </div>
            <Text className="font-semibold text-gray-900 mb-1">Phone</Text>
            <a href="tel:7706454745" className="text-[#406517] hover:underline">(770) 645-4745</a>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#406517]" />
              </div>
            </div>
            <Text className="font-semibold text-gray-900 mb-1">Email</Text>
            <a href="mailto:help@mosquitocurtains.com" className="text-[#406517] hover:underline">help@mosquitocurtains.com</a>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#406517]" />
              </div>
            </div>
            <Text className="font-semibold text-gray-900 mb-1">Hours</Text>
            <Text className="text-gray-600 text-sm">Mon-Fri: 9am-5pm EST</Text>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#406517]" />
              </div>
            </div>
            <Text className="font-semibold text-gray-900 mb-1">Address</Text>
            <Text className="text-gray-600 text-sm">Alpharetta, GA 30004</Text>
          </Card>
        </Grid>

        {/* Our Commitment */}
        <HeaderBarSection icon={Heart} label="Our Commitment to You" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Solid customer service is not only the ethical way to run a business, it makes for loyal customers who tell their friends. 
              We are highly passionate about our product and our family business. We make every effort to ensure your satisfaction.
            </Text>
            <Card className="p-6 bg-[#406517]/5 border-[#406517]/20">
              <Text className="text-xl font-semibold text-[#406517] text-center">
                We want you happy, then we&apos;ll make you curtains you will love.
              </Text>
            </Card>
            <Text className="text-gray-600">
              If there are any problems with your curtain, we will resolve it quickly to your satisfaction. We sincerely want you happy 
              and we believe you don&apos;t want a small family business to lose money.
            </Text>
            <Text className="text-gray-600">
              You will know if the curtain does not meet your expectations soon after receiving them. While mosquito curtains are designed 
              to last, we would like any returns to be made within <strong>6 weeks</strong> and no reason is required.
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* Product Care Notes */}
        <HeaderBarSection icon={AlertCircle} label="Product Care Notes" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card className="p-6">
              <Text className="font-semibold text-gray-900 mb-3">Mosquito & No-See-Um Netting</Text>
              <Text className="text-gray-600 mb-4">
                The mosquito netting and no-see-um netting are high quality fabrics, but with limits:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">A weed eater will definitely make a hole</ListItem>
                <ListItem variant="dot">Raking the netting repeatedly against a stucco corner, or rose bushes will cause damage</ListItem>
              </BulletedList>
            </Card>
            <Card className="p-6">
              <Text className="font-semibold text-gray-900 mb-3">Clear Vinyl Panels</Text>
              <Text className="text-gray-600 mb-4">
                Clear Vinyl panels are perfectly dense and should be:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Removed in heavy winds over 25mph</ListItem>
                <ListItem variant="dot">Will crack if manipulated at temperatures below minus 10-degrees F</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Measurement Warning */}
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div>
              <Text className="font-semibold text-amber-900 mb-2">Please be careful with your measurements!</Text>
              <Text className="text-amber-800">
                We recognize that ordering such a product online is new to many of you and perhaps a bit of a challenge. 
                If there are any mis-cuts, we resolve them quickly.
              </Text>
            </div>
          </div>
        </Card>

        {/* Reasons for Returns */}
        <HeaderBarSection icon={RotateCcw} label="Reasons for Refunded Returns" variant="dark">
          <Text className="text-gray-600 mb-4">
            Here are some of the reasons customers have returned products (and received full refunds):
          </Text>
          <BulletedList spacing="sm">
            <ListItem variant="dot">Ran into a solvable issue but not interested in discussing remedies</ListItem>
            <ListItem variant="dot">Had an insolvable situation that compromised product effectiveness</ListItem>
            <ListItem variant="dot">Couldn&apos;t block or pad against sharp stucco</ListItem>
            <ListItem variant="dot">Didn&apos;t pre-approve the product with covenant board</ListItem>
            <ListItem variant="dot">Some change of circumstance (discovered termite damage, etc.)</ListItem>
            <ListItem variant="dot">Spouse wasn&apos;t really on board with the purchase</ListItem>
            <ListItem variant="dot">Didn&apos;t read that adhesive-backed Velcro wouldn&apos;t stick to stucco</ListItem>
            <ListItem variant="dot">Didn&apos;t want to believe that there is no good way to screen a retractable awning</ListItem>
            <ListItem variant="dot">No reason offered - just didn&apos;t suit their intended purpose</ListItem>
          </BulletedList>
        </HeaderBarSection>

        {/* Privacy Note */}
        <HeaderBarSection icon={Shield} label="Privacy Policy Note" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We do <strong>NOT</strong> share ANY customer information with 3rd parties, EVER. Our credit card processing is set up 
              in a manner that even we cannot access your credit card numbers for online orders.
            </Text>
            <Text className="text-gray-600">
              At times, clients ask us for the names of clients in the neighborhood so that they can see the product first hand. 
              We politely refuse ALL such requests to protect the privacy of our good clients.
            </Text>
            <Link href="/privacy-policy" className="inline-flex items-center text-[#406517] hover:underline">
              Read our full Privacy Policy
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Stack>
        </HeaderBarSection>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
