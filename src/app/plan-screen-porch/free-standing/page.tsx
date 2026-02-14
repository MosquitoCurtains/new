'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  TreePine,
  Phone,
  ChevronDown,
  ChevronUp,
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
  PowerHeaderTemplate,
} from '@/lib/design-system'

function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Card className="!p-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <Heading level={4} className="!mb-0">{title}</Heading>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </Card>
  )
}

export default function FreeStandingPage() {
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
            title="Planning Free Standing Structures"
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* We Want to Help */}
        <Card className="!p-8 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Heading level={2} className="!mb-4">We Want to Help</Heading>
          <Text className="text-gray-700 max-w-2xl mx-auto !mb-6">
            These can be a little tricky and we want to help to make sure everything is just right for you. That&apos;s why we recommend that you{' '}
            <Link href="/contact" className="text-[#406517] underline font-medium">contact us</Link>{' '}
            for this particular project type.
          </Text>
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">
              <Phone className="w-5 h-5 mr-2" />
              Contact Us to Get Started
            </Link>
          </Button>
          <Stack gap="md" className="mt-8 text-left max-w-xl mx-auto">
            <Text className="text-gray-700">
              We are about to make planning easier than you could have imagined with a planning session where we will draw on photos you send us as you watch in real time.
            </Text>
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#406517">Get excited. We&apos;re about to have some fun!</ListItem>
              <ListItem variant="arrow" iconColor="#406517">We will call you and take care of the rest.</ListItem>
              <ListItem variant="arrow" iconColor="#406517">You will send photos and contact info.</ListItem>
              <ListItem variant="arrow" iconColor="#406517">We will direct you to a submission form.</ListItem>
            </BulletedList>
          </Stack>
        </Card>

        {/* ================================================================
            MORE HELPFUL INFORMATION - ACCORDION SECTIONS
            ================================================================ */}
        <HeaderBarSection icon={TreePine} label="More Helpful Information" variant="dark">
          <Heading level={3} className="!mb-4">Unique planning details for:</Heading>
          
          <Stack gap="md">
            {/* AWNINGS */}
            <AccordionSection title="Awnings">
              <Stack gap="md">
                <Text className="text-gray-700">
                  If you are planning an Awning, you will skip steps 2 &amp; 5 in the planning menu above! Your menu should really look like this:
                </Text>
                <div className="rounded-xl overflow-hidden max-w-md">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/03/Skip-Two-Steps-Menu-Image.png" alt="Skip Two Steps" className="w-full h-auto bg-white" />
                </div>
                
                <Heading level={4} className="text-[#406517]">Why you should SKIP Step 2 -- Top Attachment</Heading>
                <Text className="text-gray-700">
                  For Fixed Awnings we use Grommets (instead of either Velcro or Tracking).
                </Text>
                <Text className="text-gray-700">
                  Generally for Fixed Awnings, the top attachment is some overhead bar where the top canvas of the awning is laced to the bar. With this arrangement, neither tracking or Velcro can be secured to a bar with lacing wrapping the bar.
                </Text>
                <Text className="text-gray-700 italic">
                  Aww, but I really wanted to slide these using tracking? The tracking feature is not used as much as you might imagine. You can still enter and exit through magnetic doorways and with our black mesh it is crystal clear to see through.
                </Text>
                <Text className="text-gray-700">
                  For Fixed Awnings, we place grommets along the top of the curtain panel every 6-inches so that you can secure the top of the curtain to the overhead bar using plastic cable &quot;zip ties&quot; (there will be enough space around lacings). By placing a bit of horizontal tension between zip ties, the top of the panel will be taut along the bar and lay nice and flat.
                </Text>
                <Text className="text-gray-700">
                  If you are using our instant price estimator, SELECTING &quot;Velcro&quot; as the top attachment will give you the same estimate as grommets.
                </Text>

                <Heading level={4} className="text-[#406517]">Why you should SKIP Step 5 -- Project Planning</Heading>
                <Text className="text-gray-700 font-medium">
                  We will need to place your order for you over the phone
                </Text>
                <Text className="text-gray-700">
                  Awnings are unique and we would like to personally assist you. The good news is that Fixed Awnings are the easiest of applications. We will explain all the specifics to you in a planning session and show you exactly how to measure from photos you will send to us.
                </Text>
                <Text className="text-gray-700 font-medium">
                  Please Familiarize yourself with Steps 1, 3, &amp; 4 (above)
                </Text>
                <Text className="text-gray-700">
                  Having this information will help you better understand how everything works. Follow along as if it were Velcro Attachment. Eventually you will need this information to self-install your project.
                </Text>
                <Text className="text-gray-700">
                  When you are ready, click the{' '}
                  <Link href="/contact" className="text-[#406517] underline font-medium">Contact Us</Link>{' '}
                  Button and follow the instructions for emailing digital photos. We have software that enables us to draw on your photos AS YOU WATCH. We will simplify everything for you and walk you through the process stress free.
                </Text>
              </Stack>
            </AccordionSection>

            {/* PERGOLAS / OPEN TOP */}
            <AccordionSection title="Pergolas / Open Top Structures">
              <Stack gap="md">
                <Text className="text-gray-700">
                  If you are planning a project with no roof, your planning menu should look like this:
                </Text>
                <div className="rounded-xl overflow-hidden max-w-md">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/03/Skip-One-Step-Menu-Image.png" alt="Skip One Step" className="w-full h-auto bg-white" />
                </div>

                <Heading level={4} className="text-[#406517]">Wondering if We Do Roof Panels?</Heading>
                <Text className="text-gray-700">
                  Yes we make roof panels. In fact, many clients use our black shade mesh that is clear to see through and blocks 80% of sunlight. Just enough to take the edge off but maintain a view of the sky.
                </Text>

                <Heading level={5}>If you are trying to protect against flying insects, you may not need a roof panel.</Heading>
                <Text className="text-gray-700">
                  It has to do with the way mosquitos behave. Think of them as blind and are following their noses. Mosquitos tend to vector directly at their hosts. A mosquito wouldn&apos;t be thinking, &quot;Ha, these knuckleheads forgot to put a roof panel up there. Come on boys, over the top!&quot;
                </Text>
                <Text className="text-gray-700">
                  If a mosquito takes anything but a direct path to you, it is not by intention. They were likely blown up and over the top with a wind current. The necessity of a roof panel is really the height of your pergola and the likelihood of a wind gust getting them up and over.
                </Text>
                <Text className="text-gray-700">
                  So in the interest of our good clients, we tell them there is a good chance a roof panel is not necessary for bugs and there is plenty of time to spend money. Why not do the wall panels and see if you aren&apos;t in the lucky club. Our experience is that 80% of folks are in the lucky club!
                </Text>

                <Heading level={4} className="text-[#406517]">SKIP Step 5 -- Project Planning</Heading>
                <Text className="text-gray-700 font-medium">
                  Please Familiarize yourself with Steps 1-4 (above)
                </Text>
                <Text className="text-gray-700">
                  Having this information will help you better understand how everything works. Eventually you will need this information to self-install your project.
                </Text>
                <Text className="text-gray-700">
                  When you are ready, click the{' '}
                  <Link href="/contact" className="text-[#406517] underline font-medium">Contact Us</Link>{' '}
                  Button at the top of any page and follow the instructions for emailing digital photos. We have software that enables us to draw on your photos AS YOU WATCH. We will simplify everything for you and walk you through the process stress free.
                </Text>
              </Stack>
            </AccordionSection>

            {/* FREE STANDING WITH 5+ SIDES (GAZEBOS) */}
            <AccordionSection title="Free Standing With 5 Or More Sides (Some Gazebos)">
              <Stack gap="md">
                <Text className="text-gray-700">
                  If you are planning a gazebo with 5 or more sides, your planning menu should look like this:
                </Text>
                <div className="rounded-xl overflow-hidden max-w-md">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/03/Skip-One-Step-Menu-Image.png" alt="Skip One Step" className="w-full h-auto bg-white" />
                </div>

                <Heading level={4} className="text-[#406517]">Notes On Top Attachment -- (Step 2)</Heading>
                <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
                  <Text className="text-gray-700">
                    The client with the gazebo shown here wanted tracking in the worst way. He anticipated pretty swags and opening his panels daily. Kurt&apos;s favorite way to handle these is a Velcro attachment taking a path OUTSIDE the columns. Yep, like wrapping a gazebo with a big &quot;soup can label&quot;. The client was thrilled with the results and saved money not having to purchase track hardware and the many panels necessary for a tracking configuration.
                  </Text>
                  <div className="rounded-xl overflow-hidden">
                    <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Mosquito-Netting-on-Gazebo-1200.jpg" alt="Mosquito netting on gazebo" className="w-full h-auto" />
                  </div>
                </Grid>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#406517">You always enter into a bug-free zone and when you want to leave, just leave</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">They are crystal clear to see through and made to get wet</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Configuring an inside hang with tracking is always tricky and expensive</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">The panels are very stable in the wind with skeletal columns behind them</ListItem>
                  <ListItem variant="arrow" iconColor="#406517">Curtains still have magnetic doorways to enter</ListItem>
                </BulletedList>

                <Heading level={4} className="text-[#406517]">SKIP Step 5 -- Project Planning</Heading>
                <Text className="text-gray-700 font-medium">
                  We will need to place your order for you over the phone
                </Text>
                <Text className="text-gray-700">
                  Gazebos are unique and we would like to personally assist you. We will explain all the specifics to you in a planning session and show you exactly how to measure from photos you will send to us. In the meantime:
                </Text>
                <Text className="text-gray-700 font-medium">
                  Please Familiarize yourself with Steps 1-4 (above)
                </Text>
                <Text className="text-gray-700">
                  Having this information will help you better understand how everything works. Eventually you will need this information to self-install your project.
                </Text>
                <Text className="text-gray-700">
                  When you are ready, click the{' '}
                  <Link href="/contact" className="text-[#406517] underline font-medium">Contact Us</Link>{' '}
                  Button at the top of any page and follow the instructions for emailing digital photos. We have software that enables us to draw on your photos AS YOU WATCH. We will simplify everything for you and walk you through the process stress free.
                </Text>
              </Stack>
            </AccordionSection>
          </Stack>
        </HeaderBarSection>

        {/* Application Pages Links */}
        <HeaderBarSection icon={ArrowRight} label="Application pages for more info:" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3, desktop: 5 }} gap="md">
            <Link href="/awning-screen-enclosures" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                <Heading level={5} className="!mb-0 group-hover:text-[#406517]">Awnings</Heading>
              </Card>
            </Link>
            <Link href="/pergola-screen-curtains" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                <Heading level={5} className="!mb-0 group-hover:text-[#406517]">Pergolas</Heading>
              </Card>
            </Link>
            <Link href="/screened-in-decks" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                <Heading level={5} className="!mb-0 group-hover:text-[#406517]">Open Decks (No Roof)</Heading>
              </Card>
            </Link>
            <Link href="/gazebo-screen-curtains" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                <Heading level={5} className="!mb-0 group-hover:text-[#406517]">Free Standing Gazebos</Heading>
              </Card>
            </Link>
            <Link href="/order-mesh-panels" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#406517] group-hover:shadow-md">
                <Heading level={5} className="!mb-0 group-hover:text-[#406517]">Contact Us For Help Ordering</Heading>
              </Card>
            </Link>
          </Grid>
        </HeaderBarSection>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
