'use client'

import { useState } from 'react'
import { Phone, Mail, Clock, MapPin, Send, CheckCircle, Camera, Info } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
Frame, HeaderBarSection, TwoColumn, BulletedList} from '@/lib/design-system'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: 'mosquito_curtains',
    projectType: 'porch',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <Container size="md">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="!p-8 text-center">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={2} className="!mb-2">Message Sent!</Heading>
            <Text className="text-gray-600 mb-6">
              Thank you for contacting us. A member of our team will get back to you 
              within 1 business day.
            </Text>
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? Our friendly team is here to help you plan your project.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#406517]" />
                </div>
                <div>
                  <Heading level={4} className="!mb-1">Call Us</Heading>
                  <a href="tel:7706454745" className="text-[#406517] font-medium hover:underline">
                    (770) 645-4745
                  </a>
                  <Text size="sm" className="text-gray-500 !mt-1">
                    Fastest way to get help
                  </Text>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#003365]" />
                </div>
                <div>
                  <Heading level={4} className="!mb-1">Email Us</Heading>
                  <a href="mailto:info@mosquitocurtains.com" className="text-[#003365] font-medium hover:underline text-sm">
                    info@mosquitocurtains.com
                  </a>
                  <Text size="sm" className="text-gray-500 !mt-1">
                    We'll reply within 24 hours
                  </Text>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#B30158]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#B30158]" />
                </div>
                <div>
                  <Heading level={4} className="!mb-1">Business Hours</Heading>
                  <Text size="sm" className="text-gray-600">
                    Mon-Fri: 9am - 5pm EST
                  </Text>
                  <Text size="sm" className="text-gray-500">
                    Sat: We check messages
                  </Text>
                </div>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Contact Form */}
        <section>
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-gray-900 px-6 py-4">
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Send Us a Message
              </span>
            </div>
            <div className="p-6 md:p-10">
              <form onSubmit={handleSubmit}>
                <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      value={formState.firstName}
                      onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      value={formState.lastName}
                      onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                      placeholder="Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      I'm Interested In
                    </label>
                    <select
                      value={formState.interest}
                      onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                    >
                      <option value="mosquito_curtains">Mosquito Curtains</option>
                      <option value="clear_vinyl">Clear Vinyl Panels</option>
                      <option value="both">Both Products</option>
                      <option value="raw_materials">Raw Materials</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                    >
                      <option value="porch">Porch / Patio</option>
                      <option value="garage">Garage Door</option>
                      <option value="pergola">Pergola</option>
                      <option value="gazebo">Gazebo</option>
                      <option value="deck">Deck</option>
                      <option value="awning">Awning</option>
                      <option value="industrial">Industrial / Commercial</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </Grid>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <Textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Location */}
        <section>
          <Card variant="outlined" className="!p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFA501]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#FFA501]" />
              </div>
              <div>
                <Heading level={4} className="!mb-1">Location</Heading>
                <Text className="text-gray-600">
                  Made in Atlanta, Georgia<br />
                  Shipping across the USA, Canada, and internationally
                </Text>
              </div>
            </div>
          </Card>
        </section>
      </Stack>
    
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Contact Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/kurt-square-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/05/Matt-Rier-New-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/10/Heather-1-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/07/John-Hubay-New-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/08/Iryna-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Patrick-Jordan-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/07/Dan-McClaskey-150x150.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Get Started Fast With a Real Person!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Every porch is different and we  need to see project photos to plan these correctly. You can upload from your phone or computer. Want to use our Instant Price Estimator? For general questions, write a note below or call us at (770) 645-4745.</Text>
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
        <HeaderBarSection icon={Info} label="These Are Good Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? Because we can see each full side with fastening surfaces in each high resolution photo.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                alt="These Are Good Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="These Are Bad Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? Because they are too close up so we can’t see ALL fastening surfaces and corner transitions.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                alt="These Are Bad Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Contact Information" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">When you call, our FIRST question will be, “Have you sent photos?”</Text>
              <BulletedList>
                <li>(770) 645-4745</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="The Planning Team" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Aaron Gorecki

Kurt Jordan

Matt Rier

Heather Evans

John Hubay

Iryna Mardanova

Patrick Jordan

Dan McCaskey
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                alt="The Planning Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Need help before submitting photos?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are here to help. Give us a call and one of our planners will gladly assist you.</Text>
          </Stack>
        </HeaderBarSection>

        </Container>
  )
}
