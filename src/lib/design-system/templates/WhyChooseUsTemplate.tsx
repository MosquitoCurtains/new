'use client'

/**
 * WhyChooseUsTemplate
 * 
 * The "Why X+ Customers Choose Us" section with Google Reviews and feature cards.
 * Edit this template to update ALL instances across the site.
 * 
 * Usage:
 * ```tsx
 * import { WhyChooseUsTemplate } from '@/lib/design-system'
 * 
 * <WhyChooseUsTemplate />
 * // or without reviews:
 * <WhyChooseUsTemplate showReviews={false} />
 * ```
 */

import { Shield, Wrench, Truck, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Heading, Grid, FeatureCard, Button, GoogleReviews } from '../components'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'

export interface WhyChooseUsTemplateProps {
  /** Show Google Reviews carousel (default: true) */
  showReviews?: boolean
  /** Show the CTA button (default: false) */
  showCTA?: boolean
}

export function WhyChooseUsTemplate({ 
  showReviews = true,
  showCTA = false,
}: WhyChooseUsTemplateProps) {
  return (
    <section>
      <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-6">
            <Heading level={2} className="text-gray-900 !mb-2">
              {ORDERS_SERVED_STRINGS.whyChooseUs}
            </Heading>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're not the cheapest. But if you want quality that lasts, we're the only choice.
            </p>
          </div>
          
          {/* Google Reviews Carousel */}
          {showReviews && (
            <div className="w-full mb-8">
              <GoogleReviews 
                featurableId={process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID}
                carouselSpeed={8000}
                minRating={5}
              />
            </div>
          )}
          
          {/* Feature Cards */}
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
            <FeatureCard 
              icon={Shield} 
              title={<span className="text-[#406517]">Marine-Grade Quality</span>}
              iconColor="#406517"
              variant="elevated"
              className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
            >
              Built to last with premium materials that withstand the elements year after year.
            </FeatureCard>

            <FeatureCard 
              icon={Wrench} 
              title={<span className="text-[#003365]">DIY Installation</span>}
              iconColor="#003365"
              variant="elevated"
              className="!bg-[#003365]/5 !border-[#003365]/20 text-center"
            >
              No contractors needed. Install yourself in an afternoon with our easy kit.
            </FeatureCard>

            <FeatureCard 
              icon={Truck} 
              title={<span className="text-[#B30158]">Fast Shipping</span>}
              iconColor="#B30158"
              variant="elevated"
              className="!bg-[#B30158]/5 !border-[#B30158]/20 text-center"
            >
              Custom-made and delivered in 3-8 business days. Not months.
            </FeatureCard>

            <FeatureCard 
              icon={Award} 
              title={<span className="text-[#FFA501]">Satisfaction Guaranteed</span>}
              iconColor="#FFA501"
              variant="elevated"
              className="!bg-[#FFA501]/5 !border-[#FFA501]/20 text-center"
            >
              Not happy? We'll make it right or your money back. Period.
            </FeatureCard>
          </Grid>

          {/* Optional CTA */}
          {showCTA && (
            <div className="flex justify-center pt-6">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Free Instant Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
