'use client'

import Link from 'next/link'
import { ArrowRight, Star, Bug } from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Grid,
  GoogleReviews,
  Frame,
  YouTubeEmbed,
  TwoColumn,
  HeaderBarSection,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { ORDERS_SERVED_FORMATTED, ORDERS_SERVED_COUNT } from '@/lib/constants/orders-served'

// Featured testimonials from WordPress
const FEATURED_TESTIMONIALS = [
  {
    quote: "Thank you for the follow-up email about the snap tool. I should have taken a picture during the winter. We had one of the worst winters on record in Maryland. We were able to use our porch all winter long because of the protection and insulation the vinyl Mosquito Curtains provide. This last month as spring arrived, our porch temperature has been warmer than our actual house temperature. A fantastic product!",
    author: "Amy & David",
    location: "Maui",
    image: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Hawaii-Porch-Screen-200x150-1.jpg",
  },
  {
    quote: "Kurt, Here is a night shot of the curtains you sent to us last week. Covering the entire courtyard opening had the effect that I wanted and made it a cozy area for guests at dinner. If you remember, we had originally only covered the side openings. Hope you like the look as well. We are once again very happy, satisfied customers of Mosquito Curtains.",
    author: "Bill",
    location: "Wisconsin",
    image: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Porch-1-200x150-1.jpg",
  },
  {
    quote: "Hi, We just installed our curtains on a section of our porch and are very pleased. We are now considering installing curtains on the adjoining section. Installation went well, we were very pleased. Thanks for all of your help, Kurt, and for a great product! We have used our porch more in the past week than we did all last summer. Love it!",
    author: "Eric",
    location: "Prince Edward Island",
    image: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Canadian-Porch-200x150-1.jpg",
  },
]

const SHORT_TESTIMONIALS = [
  { quote: "We love the curtains. Everyone was sooo helpful and installing was trouble-free. They are so durable that I'll bet they will last many years." },
  { quote: "Could not be happier! What a great product. Top quality materials, superior customer service and simple homeowner installation." },
  { quote: "I have just come in from our bug free carport to thank you again for the Mosquito Curtain." },
  { quote: "Thank you for a great product. We have been able to re-claim our porch in the evenings. Your customer service is second to none!" },
]

export default function ReviewsPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#FFA501]/10 via-white to-[#406517]/10 border-2 border-[#FFA501]/20 rounded-3xl p-8 md:p-12 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-[#FFA501] text-[#FFA501]" />
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              See what {ORDERS_SERVED_FORMATTED} customers have to say about Mosquito Curtains.
            </p>
            <p className="text-[#406517] font-medium">
              Trusted since 2004
            </p>
          </div>
        </section>

        {/* Google Reviews Widget */}
        <section>
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-10">
            <Heading level={2} className="text-center !mb-6">Google Reviews</Heading>
            <GoogleReviews 
              featurableId={process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID}
              carouselSpeed={8000}
              minRating={5}
            />
          </div>
        </section>

        {/* Featured Testimonials */}
        <section>
          <Heading level={2} className="text-center !mb-8">Featured Customer Stories</Heading>
          <Stack gap="lg">
            {FEATURED_TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} variant="elevated" className="!p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1">
                    <Frame ratio="1/1" className="h-full">
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.author}'s project`}
                        className="w-full h-full object-cover"
                      />
                    </Frame>
                  </div>
                  <div className="md:col-span-3 p-6 flex flex-col justify-center">
                    <Text className="text-gray-600 italic mb-4">
                      "{testimonial.quote}"
                    </Text>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FFA501] text-[#FFA501]" />
                        ))}
                      </div>
                      <Text className="font-medium text-gray-900">
                        {testimonial.author}
                      </Text>
                      <Text className="text-gray-500">| {testimonial.location}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Stack>
        </section>

        {/* Short Testimonials Grid */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            {SHORT_TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} variant="outlined" className="!p-6">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFA501] text-[#FFA501]" />
                  ))}
                </div>
                <Text className="text-gray-600 italic">
                  "{testimonial.quote}"
                </Text>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Customer Video */}
        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Stack gap="md" className="items-center text-center">
              <Heading level={3} className="!mb-0">Hear From Our Customers</Heading>
              <Text className="text-gray-600 max-w-2xl">
                Watch real customers share their experience with Mosquito Curtains.
              </Text>
              <div className="w-full max-w-3xl">
                <YouTubeEmbed videoId={VIDEOS.CUSTOM_NETTING} title="Customer Testimonial" variant="card" />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Stats */}
        <section>
          <div className="bg-[#406517] rounded-3xl p-8 md:p-12">
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg">
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">{ORDERS_SERVED_COUNT.toLocaleString()}+</p>
                <p className="text-white/80">Happy Customers</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">20+</p>
                <p className="text-white/80">Years in Business</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">5★</p>
                <p className="text-white/80">Average Rating</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">USA</p>
                <p className="text-white/80">Made in Atlanta</p>
              </div>
            </Grid>
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card variant="elevated" className="!p-8 text-center">
            <Heading level={2} className="!mb-4">Ready to Join Our Happy Customers?</Heading>
            <Text className="text-gray-600 mb-6 max-w-xl mx-auto">
              Start your project today and see why {ORDERS_SERVED_FORMATTED} customers have trusted Mosquito Curtains 
              for their screen and weather enclosure needs.
            </Text>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/gallery">
                  View Gallery
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Final CTA */}

        <HeaderBarSection icon={Bug} label="Making our customers happy is our goal." variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Clear-Plastic-Porch-Enclosure-With-No-Canvas-1200.jpg"
                alt="Clear Plastic Porch Enclosure With No Canvas"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We often receive photos of our work from our satisfied customers once they finish installation. We proudly display them here on our website. Read below to see what our customers have to say and how they describe their experiences with us. We would love to work with you too!
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>


        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
