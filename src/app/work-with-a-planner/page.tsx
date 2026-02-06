'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  MessageSquare,
  Camera,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
} from 'lucide-react'
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
} from '@/lib/design-system'

// Planning team members
const PLANNING_TEAM = [
  { name: 'Aaron Gorecki', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Aaron.jpg' },
  { name: 'Kurt Jordan', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Kurt.jpg' },
  { name: 'Matt Rier', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Matt.jpg' },
  { name: 'Heather Evans', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Heather.jpg' },
  { name: 'John Hubay', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/John.jpg' },
  { name: 'Iryna Mardanova', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Iryna.jpg' },
  { name: 'Patrick Jordan', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Patrick.jpg' },
  { name: 'Dan McCaskey', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Dan.jpg' },
]

export default function WorkWithAPlannerPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12">
          {/* Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B30158]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="xl" className="items-center">
            <Stack gap="lg">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#B30158]" />
                  <Text className="text-[#B30158] font-semibold uppercase tracking-wider !mb-0">
                    Expert Assistance
                  </Text>
                </div>
                <Heading level={1} className="!text-4xl md:!text-5xl !mb-4">
                  Get Started Fast With a Real Person!
                </Heading>
                <Text className="text-xl text-gray-600">
                  We are happy to help you plan your project with a quick planning session. 
                  For maximum speed and efficiency, photos of your space are extremely helpful.
                </Text>
              </div>

              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#B30158">Upload photos of your space</ListItem>
                <ListItem variant="checked" iconColor="#B30158">Expert reviews your project</ListItem>
                <ListItem variant="checked" iconColor="#B30158">Detailed quote within 24-48 hours</ListItem>
                <ListItem variant="checked" iconColor="#B30158">Personalized recommendations</ListItem>
              </BulletedList>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link href="/start-project?mode=planner">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Planning Session
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:7706454745">
                    <Phone className="w-5 h-5 mr-2" />
                    (770) 645-4745
                  </a>
                </Button>
              </div>
            </Stack>

            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Photo Guidelines Video"
              variant="card"
            />
          </Grid>
        </section>

        {/* ================================================================
            PHOTO GUIDELINES
            ================================================================ */}
        <HeaderBarSection icon={Camera} label="Photo Guidelines" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Stack gap="md">
              <Heading level={3} className="!mb-4">What We Need</Heading>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Large file sizes</strong> - Small images do not provide enough resolution for planning sessions.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Step BACK and zoom OUT</strong> so we can see as much as possible. No close-ups.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Please provide <strong>2-4 high resolution photos</strong> that show all complete sides of your project.
                </ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Heading level={3} className="!mb-4">Examples</Heading>
              <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
                <div>
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden mb-2 border-2 border-[#406517]">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Good-Photo-Example.jpg"
                      alt="Good photo example - shows full side"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Text className="text-sm text-[#406517] font-semibold text-center !mb-0">Good Photo</Text>
                  <Text className="text-xs text-gray-500 text-center !mb-0">Full side visible</Text>
                </div>
                <div>
                  <Frame ratio="4/3" className="rounded-xl overflow-hidden mb-2 border-2 border-[#D03739]">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Bad-Photo-Example.jpg"
                      alt="Bad photo example - too close up"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Text className="text-sm text-[#D03739] font-semibold text-center !mb-0">Bad Photo</Text>
                  <Text className="text-xs text-gray-500 text-center !mb-0">Too close up</Text>
                </div>
              </Grid>
            </Stack>
          </Grid>
          <div className="flex justify-center pt-8">
            <Button variant="accent" size="lg" asChild>
              <Link href="/start-project?mode=planner">
                <Camera className="w-5 h-5 mr-2" />
                Upload Your Photos Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            THE PLANNING TEAM
            ================================================================ */}
        <HeaderBarSection icon={User} label="The Planning Team" variant="dark">
          <Text className="text-center text-gray-600 mb-6">
            Our experienced team is ready to help you plan your perfect outdoor space.
          </Text>
          <Grid responsiveCols={{ mobile: 2, tablet: 4, desktop: 8 }} gap="md">
            {PLANNING_TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <Frame ratio="1/1" className="rounded-full overflow-hidden mb-2 mx-auto w-20 h-20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-sm font-medium text-gray-900 !mb-0">{member.name}</Text>
              </div>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            CONTACT INFORMATION
            ================================================================ */}
        <HeaderBarSection icon={Phone} label="Contact Information" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Phone</Heading>
              <Text className="text-gray-600 !mb-2">(770) 645-4745</Text>
              <Text className="text-sm text-gray-500 !mb-0">Toll Free: (866) 622-0916</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#003365]" />
              </div>
              <Heading level={4} className="!mb-2">Hours</Heading>
              <Text className="text-gray-600 !mb-2">Mon - Fri: 9am - 5pm EST</Text>
              <Text className="text-sm text-gray-500 !mb-0">Saturday: We check messages</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#B30158]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#B30158]" />
              </div>
              <Heading level={4} className="!mb-2">Location</Heading>
              <Text className="text-gray-600 !mb-2">1320 Union Hill Industrial Ct</Text>
              <Text className="text-sm text-gray-500 !mb-0">Suite C, Alpharetta, GA 30004</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            NEED HELP SECTION
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#B30158]/10 via-white to-[#406517]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Help Before Submitting Photos?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            We are here to help. Give us a call and one of our planners will gladly assist you. 
            When you call, our FIRST question will be, "Have you sent photos?"
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link href="/start-project?mode=planner">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Planning Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:7708847705">
                <Phone className="w-5 h-5 mr-2" />
                Call (770) 884-7705
              </a>
            </Button>
          </div>
        </section>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
