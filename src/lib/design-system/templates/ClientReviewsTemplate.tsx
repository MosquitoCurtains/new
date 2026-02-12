'use client'

/**
 * ClientReviewsTemplate
 *
 * Pre-built "X+ Happy Clients Since 2004" section with 6 review cards and a
 * "See more reviews" button. The count comes from the same orders-served
 * source as WhyChooseUsTemplate (synced from the database).
 *
 * Usage:
 * ```tsx
 * import { ClientReviewsTemplate } from '@/lib/design-system'
 *
 * <ClientReviewsTemplate />
 * ```
 */

import Link from 'next/link'
import { Bug, ArrowRight } from 'lucide-react'
import { HeaderBarSection, Card, Stack, Frame, Text, Button, Grid } from '../components'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'

const STATIC_BASE =
  'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const CLIENT_REVIEWS = [
  {
    quote:
      "Thank you for the follow-up email about the snap tool. I should have taken a picture during the winter. We had one of the worst winters on record in Maryland. We were able to use our porch all winter long because of the protection and insulation the vinyl Mosquito Curtains provide.",
    author: 'Amy & David',
    location: 'Maui',
    image: `${STATIC_BASE}/2019/08/Hawaii-Porch-Screen.jpg`,
  },
  {
    quote:
      "Here is a night shot of the curtains you sent to us last week. Covering the entire courtyard opening had the effect that I wanted and made it a cozy area for guests at dinner. We are once again very happy, satisfied customers of Mosquito Curtains.",
    author: 'Bill',
    location: 'Wisconsin',
    image: `${STATIC_BASE}/2019/08/Screen-Porch-1.jpg`,
  },
  {
    quote:
      "We just installed our curtains on a section of our porch and are very pleased. Installation went well, we were very pleased. We have used our porch more in the past week than we did all last summer. Love it!",
    author: 'Eric',
    location: 'Prince Edward Island',
    image: `${STATIC_BASE}/2019/08/Canadian-Porch.jpg`,
  },
  {
    quote:
      'Amazing company, nothing too much bother to help. Quality of product is the highest, and workmanship the best. Ordered from Israel, arrived and fits perfectly. Cannot speak highly enough of this company and would recommend them to anyone wanting the best.',
    author: 'Julian Cohen',
    location: 'Israel',
    image: `${STATIC_BASE}/2020/05/Clear-Vinyl-Israel-Project-for-Website.jpg`,
  },
  {
    quote:
      "We have an old farm house with a nice front porch, but for a couple months every summer we couldn't enjoy it because of the mosquitos. This spring we ordered our curtains from you, they are everything you advertised. The installation was easy, and we have had dinner on the porch more times already this year then ever before.",
    author: 'Walt and Karen',
    location: 'Michigan',
    image: `${STATIC_BASE}/2019/08/Mosquito-Curtains-American-Porch.jpg`,
  },
  {
    quote:
      'The curtains turned out great. They are well-made and beautiful. Your website videos answered every question. Installation was easy. You were wonderful to deal with. We sat on the porch without seeing a single mosquito… NOT ONE made it through the curtains. Thank you for an excellent product.',
    author: 'Bill',
    location: 'Wausau, Wisconsin',
    image: `${STATIC_BASE}/2019/08/Screen-Porch-1.jpg`,
  },
]

export function ClientReviewsTemplate() {
  return (
    <HeaderBarSection
      icon={Bug}
      label={ORDERS_SERVED_STRINGS.happyClientsSince2004}
      variant="dark"
    >
      <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
        {CLIENT_REVIEWS.map((review, idx) => (
          <Card key={idx} variant="elevated" className="!p-6">
            <Stack gap="md">
              <Frame ratio="16/9" className="rounded-lg overflow-hidden">
                <img
                  src={review.image}
                  alt={`${review.author}'s project`}
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-gray-600 italic text-sm leading-relaxed">
                &ldquo;{review.quote}&rdquo;
              </Text>
              <Text className="font-semibold text-[#406517] !mb-0">
                {review.author} | {review.location}
              </Text>
            </Stack>
          </Card>
        ))}
      </Grid>
      <div className="flex justify-center pt-6">
        <Button variant="outline" asChild>
          <Link href="/reviews">
            See more reviews
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </HeaderBarSection>
  )
}
