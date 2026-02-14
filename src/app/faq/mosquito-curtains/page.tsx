'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Bug, 
  ShoppingCart, 
  Package, 
  Ruler, 
  Wrench, 
  Settings, 
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react'
import {
  Container,
  Stack,
  Text,
  Heading,
  Card,
  Button,
  HeaderBarSection,
  FinalCTATemplate,
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

// FAQ Data organized by category
const FAQ_DATA = {
  ordering: {
    title: 'Ordering',
    icon: ShoppingCart,
    questions: [
      {
        q: 'Is this a secure website?',
        a: 'We have several layers of security on this website to ensure that we are squeaky clean. Our first layer is through our host "Liquid Web" which, by itself, has very robust security. You will also notice that the web site address has https:// (the "s" is for secure).',
      },
      {
        q: 'What are the most common mistakes made when ordering?',
        a: 'Generally, 99% of folks do a very good job ordering online. A few forget to add IMPORTANT measurement adjustments. After all, curtains need to be a bit wider than your exposure so that we have enough fabric to seal the sides. The most overlooked items to order are fiberglass rods and marine snaps.',
      },
      {
        q: 'Should I order online or over the phone?',
        a: 'We appreciate when clients order directly online since it greatly helps us to keep costs down. During the height of the season, we can get quite busy, and it really helps if you\'ve read the web site so that you have a basic understanding of our system. If you need help planning a project, we are here for you!',
      },
      {
        q: 'What if I make a mistake?',
        a: 'We will correct the mistake and we don\'t ask who\'s fault it was. Sometimes we ask that you return the incorrect mosquito netting curtains back to us for a correction; and, sometimes we just start over.',
      },
      {
        q: 'What is the difference between Raw Netting and a Mosquito Curtain?',
        a: 'Raw mosquito netting and raw no-see-um netting is just raw fabric with absolutely no means of attachment. Raw netting is often ordered by designers and folks that choose to fabricate their own solution. Mosquito Curtains are finished panels with bindings, ready to hang.',
      },
      {
        q: 'What is the difference between Mosquito Netting and No-see-um Netting?',
        a: 'If you don\'t have a nasty little biting fly called a no-see-um, order mosquito mesh. No-see-ums are smaller than gnats or black flies. If you don\'t know what a no-see-um is, you probably don\'t have them.',
      },
      {
        q: 'Is tracking included in the order?',
        a: 'No. Optional curtain tracking hardware must be ordered on the online store. When you order tracking hardware, we configure your no-see-um or mosquito netting curtains for tracking attachment.',
      },
      {
        q: 'What if my dimensions are larger than what is available on the store page?',
        a: 'We routinely make curtains larger than what you may see on the web site. Our largest mosquito netting curtain panel to date has been 500ft wide x 38ft tall used as a warehouse partition. Call us, we\'ll figure it out.',
      },
      {
        q: 'What if I\'m not happy with the product?',
        a: 'Please return it within 4 weeks for a full refund of your purchase price less shipping charges. See our guarantee.',
      },
      {
        q: 'Is this product made in America?',
        a: 'Everything except the neodymium magnets. We loom, fabricate, and purchase everything else in the USA.',
      },
    ],
  },
  afterOrdering: {
    title: 'After You\'ve Ordered',
    icon: Package,
    questions: [
      {
        q: 'I\'ve received my tracking but my curtains have not arrived?',
        a: 'Orders with tracking come in 2 boxes that typically arrive same day. Every now and then, the boxes arrive on different days.',
      },
      {
        q: 'How do I care for my curtains?',
        a: 'Curtains like to be washed at least once a year to remove any dirt. Washing your curtains will extend the life of your curtains. A great time to do so is when the bug season is over. Most folks give them a quick rinse with a garden hose.',
      },
      {
        q: 'Can I be a reseller of your product?',
        a: 'Yes. There is value helping clients plan and install mosquito netting curtains. Contact us to discuss partnership opportunities.',
      },
    ],
  },
  planning: {
    title: 'Planning',
    icon: Ruler,
    questions: [
      {
        q: 'How many panels should I order?',
        a: 'You want to minimize the number of panels whenever possible. Introduce a new panel only where you need a doorway, have an obstruction, or are trying to create a certain swagging configuration.',
      },
      {
        q: 'What if I need help measuring?',
        a: 'Keep this theme in mind: Your curtains need to be wider than your actual exposure so that you can seal the sides. Width Adjustment: We recommend adding 3″ per panel + 1″ per 10ft of width. Height Adjustment: No adjustment for tracking / 2″ taller than your exposed opening for Velcro Attachment.',
      },
      {
        q: 'Should I use an inside hang or outside hang?',
        a: 'Typically this is only relevant when a curtain panel turns a corner. Velcro attachment generally uses an outside hang (a path around the OUTSIDE of support columns) while tracking attachment generally uses an inside hang.',
      },
      {
        q: 'What if I have non-rectangular shapes?',
        a: 'We have created worksheet links on the PLAN page of the web site addressing most non-rectangular situations. Sometimes the irregularities can get quite complex. We will need enough geometry to replicate your project.',
      },
    ],
  },
  installation: {
    title: 'Installation',
    icon: Wrench,
    questions: [
      {
        q: 'Is this difficult to install? How long? What tools?',
        a: 'Curtains are installed with minimal home improvement skills. Can you stand on a ladder and hold a drill? If the answer is yes, you\'re in business. Most describe it as a fun little half day project. For tracking attachment, you will need a ladder, a drill, a metal file, a hacksaw and a hammer.',
      },
      {
        q: 'I\'m not very handy. Do you have someone who can install this for me?',
        a: 'We emphasize that the product is easy to self install; however, if you are not so inclined, any handyman can easily handle the installation. This product was designed to enable a novice to create a screened space.',
      },
      {
        q: 'Is the tracking side mounted or under mounted?',
        a: 'The tracking is designed to be under mounted; however you can always side mount a wood strip and then undermount the track to the wood strip.',
      },
      {
        q: 'Why do I have to place marine snaps and magnets?',
        a: 'Great question. Early on we tried to do this for customers but it is far more complicated than it may seem. These items aren\'t difficult to place. In fact, we have a video of a 9-year old showing you how. It is easy.',
      },
    ],
  },
  specialSituations: {
    title: 'Special Situations',
    icon: Settings,
    questions: [
      {
        q: 'Will Mosquito Netting Curtains contain my pets?',
        a: 'It depends on the situation. Email us with your situation, and we will provide guidance. Our most durable material is our double thread weight HEAVY mosquito netting mesh.',
      },
      {
        q: 'What if I don\'t have a roof?',
        a: 'Check out some of our screened in deck ideas (open deck with no covered roof).',
      },
      {
        q: 'Do you carry flexible track for a large radius arc?',
        a: 'Our track is pre-bent using a 12in. radius. If you have a broader arc with a wider radius, check out alternative track options at www.konnectinternational.com.',
      },
      {
        q: 'Do you make Curtains for umbrellas?',
        a: 'Not any more. There are other companies who specialize in this sort of thing like gardenwinds.com. If you are after super quality, try www.BugUmbrella.com.',
      },
      {
        q: 'Do You Offer Motorized Solutions?',
        a: 'No. However, we highly recommend the folks at Southern Patio Enclosures who only work on Commercial Applications.',
      },
    ],
  },
  delivery: {
    title: 'Delivery Time',
    icon: Truck,
    questions: [
      {
        q: 'How soon will I receive my order?',
        a: 'Your custom made curtain panels will ship out via UPS in 1-4 days depending upon complexity. American Orders typically arrive within 1-5 business days after shipping. Canadian Orders have transit times of 3 days to Ontario and up to 7 days to BC. International Orders are generally 5-14 business days.',
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

export default function MosquitoCurtainsFAQPage() {
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
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] text-sm px-4 py-2 rounded-full mb-4">
            <Bug className="w-4 h-4" />
            <span>40+ Questions Answered</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Mosquito Curtains FAQ
          </Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about ordering, planning, and installing your mosquito netting curtains.
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

        {/* FAQ Video */}
        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Stack gap="md" className="items-center text-center">
              <Heading level={3} className="!mb-0">Watch Our FAQ Video</Heading>
              <Text className="text-gray-600 max-w-2xl">
                Get answers to the most common questions about mosquito curtains in this quick overview.
              </Text>
              <div className="w-full max-w-3xl">
                <YouTubeEmbed videoId={VIDEOS.FAQ_OVERVIEW} title="Mosquito Curtains FAQ" variant="card" />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Still have questions */}
        <Card className="p-8 bg-gray-50 text-center">
          <Heading level={3} className="!text-xl !mb-3">
            Still have questions?
          </Heading>
          <Text className="text-gray-600 mb-6">
            Our planning team is here to help with any questions about your project.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
