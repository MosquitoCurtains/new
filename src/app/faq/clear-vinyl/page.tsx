'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Snowflake, 
  ShoppingCart, 
  Package, 
  Thermometer, 
  Wrench, 
  Settings, 
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Award,
  Wind,
, Camera} from 'lucide-react'
import {
  Container,
  Stack,
  Text,
  Heading,
  Card,
  Button,
  HeaderBarSection,
  FinalCTATemplate,
, Frame, Grid} from '@/lib/design-system'

// FAQ Data organized by category
const FAQ_DATA = {
  basics: {
    title: 'The Basics',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is a Clear Vinyl Enclosure?',
        a: 'A Clear Vinyl Enclosure is a thick (20mil) barrier to cold, rain, winds (up to 25mph) and pollen. These outdoor plastic panels are commonly used in conjunction with a space heater to expand usable living space during the cooler months.',
      },
      {
        q: 'How much will it cost?',
        a: 'The cost depends on your particular patio, porch, or outdoor space. Factors include the size, overall dimensions, the height, custom work to avoid obstacles, angles, etc. As an example, a residential porch project 32ft TOTAL width x 9ft tall using 4 panels with fixed Velcro attachment is $1,258 all-in after shipping to USA.',
      },
      {
        q: 'Is Clear Vinyl Plastic Fire Rated?',
        a: 'Yes. Clear Vinyl Plastic passes what is known as the "NFPA701 small test". In short, they pass a California fire rating standard which is the strictest in the country. Clear Vinyl often has a canvas apron. The canvas is NOT fire rated unless specifically requested (and it is expensive).',
      },
      {
        q: 'Is your product made in America?',
        a: 'Yes. All of our vendors are also American businesses though some may source components outside the U.S. All fabrication is done right here in Atlanta. All employees have been screened by E-verify for DHS eligibility and earn above market wages for respective skills.',
      },
      {
        q: 'What is it made of?',
        a: 'Clear vinyl panels are a double polished marine-grade PVC plastic with a waterproof canvas apron to make up the height difference. We are unique in that our clear vinyl is 72" tall while others have only 54" tall windows. This means taller windows that require less canvas to make up the height difference.',
      },
    ],
  },
  quality: {
    title: 'Quality Materials & Construction',
    icon: Award,
    questions: [
      {
        q: 'Why choose us?',
        a: 'We\'re a family owned business based in Atlanta, GA. We\'ve been in business for over 14 years and have had the pleasure to work with homeowners all over the world fulfilling over 49,000 orders. We have excellent customer reviews and work very hard to make our customers happy. Be assured our products are guaranteed.',
      },
      {
        q: 'What makes your product better?',
        a: 'Made in the USA, Satisfaction Guaranteed, High Quality Materials, easily install & remove on your own, and 25-45% cheaper than our competition. We only use marine-grade PVC plastic and our 72" tall windows are unique in the industry.',
      },
    ],
  },
  weather: {
    title: 'Weather & The Elements',
    icon: Thermometer,
    questions: [
      {
        q: 'How can I warm my space?',
        a: 'Consider an electric radiating heater that is safely placed to avoid fire and burns. Propane space heaters burn cleaner but humans need oxygen and your space needs ventilation. Never use organically fueled heaters (such as kerosene) that produce dangerous toxic gas (carbon monoxide). Be smart about where you place your heater so that it does not melt the clear vinyl plastic.',
      },
      {
        q: 'What are temperature constraints?',
        a: 'Too Cold: Clear vinyl becomes stiff and brittle in temperatures below -15 degrees F (-26 C). Too Hot: Be sure to remove panels when temperatures rise above 75 degrees. ALL clear vinyl shrinks in temperatures above 85 degrees F (26 C) so do not store panels in the attic or garage. Panels will also yellow in the hot summer sun.',
      },
      {
        q: 'What if I am in a windy area?',
        a: 'Mention this to your planner. We have a number of tricks up our sleeve including belted ribs that will brace plastic panels in the wind. In very strong winds, it is best not to compete with Mother Nature and open them up. Since we guarantee performance, we will be the first to tell you if we feel your conditions are not appropriate for our product.',
      },
    ],
  },
  installation: {
    title: 'Installation & Care',
    icon: Wrench,
    questions: [
      {
        q: 'How are the sides and base attached?',
        a: 'Generally, a combination of marine snaps and grommets with L-shaped Screws. We also use belted ribs that is a tension belt fastened between two fixed points (D-Rings). These belted ribs are not attached to the curtain panels themselves.',
      },
      {
        q: 'How is the top attached?',
        a: 'The most common is a "fixed attachment" using Velcro, Marine Snaps, and L-screws through grommets. We also offer a tracking option whereby panels will slide side-to-side, typically used when clients already have our summer insect curtains and want them to be interchangeable.',
      },
      {
        q: 'Is this difficult to install? How long? What tools?',
        a: 'Curtains are installed with minimal home improvement skills. Can you stand on a ladder and hold a drill? Most describe it as a fun little half day project. Velcro Top Attachment takes about 40 min per 10ft of width. Tracking Attachment takes about 60 min per 10ft of width.',
      },
      {
        q: 'How do I care for my curtains?',
        a: 'Curtains like to be washed at least once a year with soap and water to remove any dirt. Curtains should be removed during the summer months as heat will shrink the curtains over time and the summer UV will yellow the clear Vinyl. Store curtains in a climate controlled environment below 85°F (30°C). Do not store in attic or garage.',
      },
      {
        q: 'What is the best path? Inside columns or outside columns?',
        a: 'The most common is what we call an "outside hang" taking a path OUTSIDE your columns. This gives these perfectly dense panels skeletal structure in the wind and aesthetically looks nicer. In addition, with an outside hang fasteners are reinforced in the breeze and not facing in a direction where they are prying loose.',
      },
    ],
  },
  ordering: {
    title: 'Ordering',
    icon: ShoppingCart,
    questions: [
      {
        q: 'What are the available apron colors?',
        a: 'The apron is the canvas portion at the bottom of the vinyl panel. Choose from 9 different canvas colors to match the aesthetic of your house or structure.',
      },
      {
        q: 'Canadian and international orders?',
        a: 'Canadian Orders: Transit times are 3 days to Ontario and up to 7 days to BC. We charge GST/HST and pay taxes along with brokerage fees on your behalf. International Orders: Transit times are generally 5-14 business days. You will pay any customs fees required by your government upon arrival.',
      },
      {
        q: 'Can I reuse tracking for Mosquito Curtains and Clear Vinyl?',
        a: 'Yes! If you currently have our Summer Insect Curtains, you may use the same track and fasteners with Clear Vinyl Panels making them perfectly interchangeable.',
      },
      {
        q: 'What if I\'m not happy with the product?',
        a: 'If you\'re not happy with the product, please return it within 4 weeks for a full refund of your purchase price less shipping charges, hassle-free. If there are any errors or fabrication flaws, we will correct them immediately.',
      },
      {
        q: 'What is the order process?',
        a: 'Get started in less than 10 minutes with our Clear Vinyl Planning Session. Send us photos, have a quick planning call, and receive a precise quote.',
      },
      {
        q: 'What\'s the turn-around time?',
        a: 'Clear vinyl must cure for two days to relax elasticity prior to fabrication. Fabrication takes 1-4 days depending upon workload and complexity. Transit times are 1 to 5 days. You can expect to receive your product in 5 to 10 business days from when you place your order.',
      },
    ],
  },
  special: {
    title: 'Special Situations',
    icon: Settings,
    questions: [
      {
        q: 'Clear Vinyl for restaurants?',
        a: 'Want to lure customers to outdoor dining during cold and rainy climate? Clear Vinyl Plastic Enclosures are an investment that pay for themselves in just a week or two. Keep customers warm by using a space heater and create a cozy al fresco environment year round. Important: The Clear Vinyl is Fire rated but the canvas apron is only fire rated upon request.',
      },
      {
        q: 'Can you cut odd shapes?',
        a: 'There will be some additional charges for custom work, but we can cut slopes, arches, and notches when required.',
      },
    ],
  },
}

// FAQ Accordion Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 px-4 -mx-4 transition-colors"
      >
        <Text className="font-medium text-gray-900 pr-4">{question}</Text>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-4 -mx-4">
          <Text className="text-gray-600">{answer}</Text>
        </div>
      )}
    </div>
  )
}

export default function ClearVinylFAQPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/faq" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All FAQs
        </Link>

        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-[#003365]/10 text-[#003365] text-sm px-4 py-2 rounded-full mb-4">
            <Snowflake className="w-4 h-4" />
            <span>30+ Questions Answered</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Clear Vinyl FAQ
          </Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about ordering, planning, and installing your clear vinyl winter panels.
          </Text>
        </div>

        {/* FAQ Sections */}
        {Object.entries(FAQ_DATA).map(([key, category]) => {
          const Icon = category.icon
          return (
            <HeaderBarSection key={key} icon={Icon} label={category.title} variant="dark">
              <Card className="p-6">
                {category.questions.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.q} answer={faq.a} />
                ))}
              </Card>
            </HeaderBarSection>
          )
        })}

        {/* Still have questions */}
        <Card className="p-8 bg-gray-50 text-center">
          <Heading level={3} className="!text-xl !mb-3">
            Still have questions?
          </Heading>
          <Text className="text-gray-600 mb-6">
            Our planning team is here to help with any questions about your clear vinyl project.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:7708847705">
                Call (770) 884-7705
              </a>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="CV FAQ Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-2-400.jpg"
                  alt="CV FAQ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-2-400.jpg"
                  alt="CV FAQ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-1-400.jpg"
                  alt="CV FAQ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-1-400.jpg"
                  alt="CV FAQ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
