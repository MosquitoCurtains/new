'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Shield, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { Text, Grid, Card, Heading, BulletedList, ListItem } from '@/lib/design-system'
import { ORDERS_SERVED_COUNT, ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'

const CONTENT_SECTIONS = [
  {
    title: 'Our Guarantee',
    icon: Shield,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          We stand behind every product we sell. If you're not satisfied with your purchase, 
          we'll work with you to make it right. Our goal is your complete satisfaction.
        </Text>
        <Text className="text-gray-600">
          We've served over {ORDERS_SERVED_COUNT.toLocaleString()} customers since 2004 because we care about quality and 
          customer service. Your order matters to us.
        </Text>
      </>
    ),
  },
  {
    title: 'Returns & Exchanges',
    icon: RefreshCw,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Because every order is custom-made to your specifications, we cannot accept returns 
          for change of mind. However, we will work with you if:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            The product arrived damaged
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            There is a manufacturing defect
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            We made an error in your order
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            The product doesn't match what was discussed
          </ListItem>
        </BulletedList>
      </>
    ),
  },
  {
    title: 'Before You Order',
    icon: AlertTriangle,
    iconColor: '#FFA501',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          To ensure accuracy and avoid issues:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            Double-check all measurements before submitting
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Review your order confirmation carefully
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Contact us immediately if you notice any errors
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Ask questions before ordering if anything is unclear
          </ListItem>
        </BulletedList>
        <Text className="text-gray-600 mt-4">
          Our planning team is happy to review your measurements and photos before you 
          place your order to ensure everything is correct.
        </Text>
      </>
    ),
  },
  {
    title: 'Quality Promise',
    icon: CheckCircle,
    iconColor: '#B30158',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          All of our products are made with premium, marine-grade materials:
        </Text>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">
            100% polyester mesh that's made to get wet
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Solution-dyed fabric that won't fade
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            UV-protected thread and webbing
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Stainless steel and powder-coated hardware
          </ListItem>
          <ListItem variant="checked" iconColor="#406517">
            Double-polished marine-grade vinyl for clear panels
          </ListItem>
        </BulletedList>
      </>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Contact Us', href: '/contact', description: 'Questions about your order' },
  { title: 'Shipping Info', href: '/shipping', description: 'Delivery timelines' },
  { title: 'Care Instructions', href: '/care/mosquito-curtains', description: 'Maintaining your curtains' },
]

export default function SatisfactionGuaranteePage() {
  return (
    <SupportPageTemplate
      title="Satisfaction Guarantee"
      subtitle="We stand behind every product we sell"
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    >
      {/* Trust Badges */}
      <section className="mt-8">
        <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
          <Card variant="outlined" className="!p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
            <Text size="sm" className="font-medium">Quality Materials</Text>
          </Card>
          <Card variant="outlined" className="!p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#003365]" />
            <Text size="sm" className="font-medium">Hand Inspected</Text>
          </Card>
          <Card variant="outlined" className="!p-4 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#B30158]" />
            <Text size="sm" className="font-medium">We Fix Issues</Text>
          </Card>
          <Card variant="outlined" className="!p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <Text size="sm" className="font-medium">{ORDERS_SERVED_FORMATTED} Customers</Text>
          </Card>
        </Grid>
      </section>
    </SupportPageTemplate>
  )
}
