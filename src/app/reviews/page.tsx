'use client'

import Link from 'next/link'
import { ArrowRight, Star , Camera, Info} from 'lucide-react'
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
, HeaderBarSection, TwoColumn} from '@/lib/design-system'
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
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Reviews Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                  alt="Bulk Mosquito Netting For Various Projects"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/05/Clear-Vinyl-Israel-Project-for-Website-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Curtains-American-Porch-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Hail-Protection-Net-768x576.jpg"
                  alt="hail net"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Odd-Shaped-Awning-2-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Odd-Shaped-Awning-1-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Insect-Curtains-768x576.jpg"
                  alt="www.mosquitocurtains.com reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Plastic-Window-Curtains-1-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Plastic-Window-Curtains-2-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Insect-Screen-1-768x576.jpg"
                  alt="Mosquito netting reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Insect-Screen-2-768x576.jpg"
                  alt="Mosquito netting reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Ivory-Black-1-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Ivory-Black-2-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Screen-Porch-1-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Screen-Porch-2-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Screen-Patio-1-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Screen-Patio-2-768x576.jpg"
                  alt="Reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/White-Porch-Curtains-2-768x576.jpg"
                  alt="White Mosquito netting curtains for Porch"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/135-Corner-Awning-Curtains-768x576.jpg"
                  alt="Mosquito Curtains customer reviews"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/135-Corner-Awning-Curtains-2-768x576.jpg"
                  alt="135-Corner-Awning-Curtains"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Making our customers happy is our goal." variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We often receive photos of our work from our satisfied customers once they finish installation. We proudly display them here on our website. Read below to see what our customers have to say and how they describe their experiences with us. We would love to work with you too!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="100 Projects in 50 Seconds" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Community Pool


“We wanted to send a photo of the finished project of the pavilion at Highland Reserve. While we didn’t complete the installation in the manner which we originally envisioned, we think we improved upon it. The curtains are stationery, they open at all four walkways. Your team did a superb job of making the custom opening for the fireplace with our measurements while not losing the integrity of the fireplace. We have had two Friday night resident gatherings and a Saturday event to say thank you to our local firefighters. We have used the pavilion more in the past month than we did all last summer, thanks to our new Mosquito Curtains. Thank you Curt to you and your team. We appreciate how easy you made this purchase and this installation for a bunch of “retired day laborers”.”

Ordered from Israel“Amazing company, nothing too much bother to help. Quality of product is the highest, and workmanship the best. Ordered from Israel, arrived and fits perfectly. Cannot speak highly enough of this company and would recommend them to anyone wanting the best. Also purchased their netting screens as well, same quality and workmanship.”– Julian Cohen, Israel

Enjoying the Back Porch Again“Customer Service was great from the beginning, from initial questions, to measuring, ordering and fast shipping. We followed the video on installation and hanging the first one was a learning experience but the rest were a breeze. They look amazing and most importantly I can enjoy my back porch again! I am very allergic to insects and in Texas they are a very hard thing to dodge so these curtains have helped us reclaim our back patio area! (We did add some light weights to the bottom to keep them from swaying in the wind.) Love that I can easily open and close these, depending on our need and the weather. Highly recommend to everyone – thank you Mosquito Curtains!”

American Farmhouse“We have an old farm house with a nice front porch, but for a couple months every summer we couldn’t enjoy it because of the mosquitos. This spring we ordered our curtains from you, they are everything you advertised. The installation was easy, and we have had dinner on the porch more times already this year then ever before. I have told all of our friends about your product and your family run business.”– Walt and Karen, Michigan

Hail Storm“On Wednesday this week, we had just left with some friends to go out for supper. About a half mile from home, an “unexpected” hail storm hit. We had visions of the roof panel ripped to shreds, since the hail stones were at least quarter size. All I could think about was having to replace the screens.  2 hours later, we returned and to our surprise and “RELIEF” there were no holes or rips anywhere!!! As you can see in the pictures, the piles of hail must have been pretty big right after the storm. It was around 80 degrees so they had melted a lot in 2 hours. Your netting is definitely “Heavy Duty”.”

“Air Traffic Control” Odd Shaped Panels (See Outer Corners)“Hi Kurt. The mosquito curtain is in and looks great!!! Installation was actually quite easy. Thanks again for your quick response….We are thoroughly enjoying the space. We have not had dinner in the house since it was installed.”– Michael T.(The awning top takes a path 14″ outside the railing. The panels are slanted in and hang on the inside of the railing. These cuts are very unusual to make this look like slanted windows similar to an air traffic control tower.)

Clear Vinyl“Thank you for the follow-up email about the snap tool.  I should have taken a picture during the winter.  We had one of the worst winters on record in Maryland.  We were able to use our porch all winter long because of the protection and insulation the vinyl Mosquito Curtains provide.  This last month as spring arrived, our porch temperature has been warmer than our actual house temperature. A fantastic product!”

Re-Order“Kurt, Here is a night shot of the curtains you sent to us last week. Covering the entire courtyard opening had the effect that I wanted and made it a cozy area for guests at dinner. If you remember, we had originally only covered the side openings. Hope you like the look as well. We are once again very happy, satisfied customers of Mosquito Curtains.”

A Warm Football Season“The installation was easy. I have an upright propane heater on the porch which we used to have to run on high when it is cold, now with the curtains up it has yet to go past low.”

Smokin Happy“Sorry it has taken me so long to let you know how the job came out. Suffice it to say, I am extremely happy with the outcome. All the adjustments came out just as I wished, and the curtains are performing as advertised. I am really impressed with the magnetic closure system. It works perfectly. The dog learned how to use them in the first hour… Thanks so much for all your efforts. You guys really have the process down. You can list me as a happy customer.”– Best Regards – Bill, Houston

A Gift From One Good Friend To Another“Thank you so much for helping me on this project for my good friends, it really came out excellent everyone was impressed by the quality and the neatness of the curtains. My friends were very grateful!”– Essam

Happy Couple“The curtains turned out great. They are well-made and beautiful. Your website videos answered every question. Installation was easy. You were wonderful to deal with. Last evening, my wife and I sat out on our porch.  Our grandson stopped by for a minute and stood outside the screens just to say “Hello.” Mosquitos immediately swarmed around him… We sat on the porch without seeing a single mosquito… NOT ONE made it through the curtains… Thank you for an excellent product and being a company that DELIVERS on its promises.”– Bill Wausau, Wisconsin

A Canadian Porch“Hi, We just installed our curtains on a section of our porch and are very pleased. We are now considering installing curtains on the adjoining section. Installation went well, we were very pleased. Thanks for all of your help, Kurt, and for a great product! We have used our porch more in the past week than we did all last summer. Love it!”

Just Pretty Photos“We love the curtains. Everyone was sooo helpful and installing was trouble-free. They are so durable that I’ll bet they will last many years.”

Awesome“Here are some shots of our awesome mosquito curtain. You can see the corner column and the different height ceilings that was so difficult.  You all did a great job helping and I am so appreciative. I have already had several people ask me where I got them.”

Service“We like the screens very much and have shown them to neighbors and friends. We have struggled with the decision of screening in our porch because we like the openness and our view. By choosing the Mosquito Curtains we are enjoying the best of both worlds. Thanks for your help. Support after the sale was just as important as being satisfied with the curtains. We would recommend the curtains to others.”

Mosquito NO Vacancy“Thanks for all of your help on this Arron. As you can see it turned out pretty damn nice. Very happy with the curtain and now the Mosquitos will have to find somewhere else to go. Lol. Thanks again.”– Thane

A Life Saver (Navy SEAL)“Hello, my name is XXXXX,  I am hoping that your company can provide a solution to my dilemma. I am a Navy Seal stationed in YYYYY and I am soon deploying back to Iraq. We are looking for a company that can provide us with mosquito netting. We use mosquito netting to conceal us when we are inside buildings. It makes it very difficult to see into the rooms where we are setting up our hides and it cuts down on the glare immensely.”We played with various curtain meshes and made double ply curtains that had qualities that would enable him to see out but would block the visibility into his concealment position. We donated curtains to this particular soldier as we didn’t want his safety to depend on one minute of procurement bureaucracy. This was his response:“Hey Kurt, sorry i am so late in replying to you. I have been in Iraq for about a month re-enlisting. Your stuff was amazing, I cant talk enough about it. I’m sure it probably saved my skin a few times to0. We had people so close to the hide site that I was sure that we were busted but they never saw us. The stuff worked great also, I was able to try all the methods of attachment that we spoke about and they all worked great.  The magnets worked every time I needed them to and so did the screw in buttons. It was great, I got into some trouble on one occasion and had to leave in a real hurry. I happened to be using the magnets at the time and it was awesome. I just grabbed and yanked and I was gone in 2 minutes.  Fabulous. I shot through it on a number of occasions and it didn’t affect the bullet flight in any way what so ever. I loved the stuff.  If you want to get ahold of me again, then just email me back whenever you want to, I’ll try and be more prompt about replying to you. Thanks again Kurt, your stuff was a real lifesaver (literally). Sincerely, XXXXXXX”

Worth Every Penny“I want to let you know that we love our curtains. This is the first year that we actually sat outside in our backyard and were not bitten to death by mosquitoes. Thanks to our beautiful curtains!!! They not only do the job of keeping the nasty mosquitoes out but also look beautiful. There are certain things we spend our money on and say to ourselves, “that was not worth it”, but with the mosquito curtains, “WORTH EVERY PENNY””

Superb“I’m in love with the Mosquito Curtains. We live in Norfolk, Virginia, which is part of the Great Dismal Swamp. The mosquitoes can be quite vicious here, but so can the hurricanes. Mosquito Curtains are an awesome convertible solution, easy up for protection against mosquitoes and easy down for the hurricanes. The quality and workmanship was superb. The website was quite informative with all the photos and videos. The production and shipping was super fast. The printed instructions included useful tips like heating a screwdriver to reseal the cut after the magnet insertion. We are extremely pleased with the product.”

To The Family at MC’s“Hello Denise, Kurt, Everett, Isabella, Patrick and everyone else! Just wanted to let you know that the curtains fit perfectly considering the odd measurements we had to deal with! And they look great too! I had ‘stumbled’ across your site looking for a solution for my particular awning and even first considered making them myself. I can sew and am a hacker at heart. But, hey, why reinvent the wheel?? But spending close to $1000, ‘blind’ off the web can sometimes be a scary thing. I think the fact that you are a family-run business is what really sold me: I knew that attention to detail and service would be paramount! And I was not wrong.Your presentation, product, quality and attention to detail were excellent! And I really appreciated the personal call-back from you and Kurt ‘just to make sure’ of the odd dimensions of the panels. I suspect that I will soon become a reseller too. Not that I necessarily want to – but I’m sure that everyone I know will be asking me where I got them and if they can get them too! There are very few places – especially here in the greater Montreal area – that sells curtains like these at such reasonable prices. I do need another hobby so what the heck! PS: Tell Isabella and Patrick that they did an excellent job!”– Quebec , Canada

Sleeping Outside“Hi Kurt, I hope everything is going well with you and your family. We ordered before and we are extremely happy with your service, quality and simplicity of design. Within a couple of hours of receiving the shipment, we had a whole “new” outdoors living space. We now spend most of our days there (we are more or less retired –at least during the summer months.) It is unbelievably relaxing, peaceful just lying down and listening to music and watching our ravine beyond our backyard. Because we don’t have to fight bugs, we sometimes just fall asleep there. Thank you very much for all you are doing, I hope everyone hears about what you do, and I hope you prosper in your enterprise.– Regards, Jim (ON, Canada)

Blast From the Past“Dear Matt: We just completed our third summer of enjoying our Mosquito Curtains on our deck up here in Wisconsin north woods. Just wanted to let you know that if it were not for your wonderful curtains, we would have not been able to enjoy summer outdoors especially this year. Record rain amounts made for billions of mosquitos morning, noon and night! The ease of putting them up and then taking them down in the fall is absolutely great! So, today, when we were in the process of taking them down I thought of how much we appreciate them and just wanted to share our complete satisfaction with you! Thanks much!”

Sarcastically Satisfied (funny)“I am writing in response to the service I received several weeks ago from one of your employees, Gary Richmond. During the initial contact and subsequent emails back and forth to finalize my design, I was very uncomfortable with Gary’s responsiveness and full knowledge of the product. We exchanged ideas on how to best install the product and finalized a solution. I was very disappointed when he called me several times to clarify any issues and finally take my order. He was also very dishonest in setting delivery expectations, the products arrived in half the time he stated…Seriously, I am extremely impressed with the support Gary provided. He was constantly providing alternative methods (thinking out of the box) during the design of my curtain system and walked me step by step to ensure my order was complete. It has become commonplace to receive mediocre support these days, but your company has raised the bar in supporting its customers. Due to my very busy schedule, I have not yet fully installed the entire product, but after inspecting the contents of my shipment, I know I have received quality components. I am very exited to complete the installation this weekend and showcase my patio to friends and neighbors. I am planning on providing Gary several photo’s of the before/after installation. Thank you for a great product and support.”– Dan SaezHey Dan, Thanks for the note on Gary’s delinquent service. We have fired him and he’ll have to go back to living under that bridge again. We also beat his ass as he left and everyone took a turn shouting, “You disappointed Dan!” We did send him off with a bottle of cologne to help him with his chances of finding another job. I look forward to your photos and our family sincerely hopes your family is happy with the product. – Kurt

Excellent“Hello Folks, I just finished installing the replacement curtain you sent and want to tell you how perfect it is.  We are so happy with the end result.  We feel like we added another room to our home.  The new curtain touches the floor just as it should and we can now install a few marine snaps to hold it in place.  Since we received our first order, we have sat on our patio daily which is quite a change from past years.  We had a deer run thru our yard this morning while we were sitting on the patio. It wasn’t 15 yards from us! A number of our friends have come over and are so impressed with the curtains and their effectiveness.  Most of the visitors are amazed how you really don’t “see” the curtain when you look out.  Again we want to thank you for replacing the first curtain due to its length.  I will definitely tell all of our visitors how easy you folks were to work with.”– Two happy customers, Ferdinand, IN

Entertainment Pavilion North Dakota“Thanks for the curtains…you will be getting more work up here. They liked them so much, they want vinyl to cover our sound booth and perhaps the back of this structure.”

Orchid Grower“I have the vinyl curtains up and they look great, and fit also. I could not be more pleased. Thanks for all of your help on my order.”

Creative Lady“Hi Kurt, love the curtains. Fairly easy to install and no mosquitos. Thanks for all the help. This woman was very imaginative and noticed a track attachment surface in between, and above, the lower double header beams. By the way, these lovely well designed and priced cedar pergolas are available through Lawn Masters who sells them at many Home Depot Stores.”

Passing It On“Hi Steve, finally got the curtains up and absolutely love them!!! Had lots of compliments and passed on your name! Thank you for the great service!”– Russell and Andrea

USDA Bee Study“Kurt- bees are happily flying, foraging and nesting this past week in the cage, with no escapes once we plugged the wee holes at the tops of the zippers. Those zippers, BTW, slide beautifully, valuable when you only have one hand free when exiting the cage. Light transmission is excellent, and there seems to be no impedance of air flow with the cooling system. Pictures are tricky in the confined space, but here is an example.– Yours, Jim C. USDA-ARS Utah

Great Doing Business With You“Hi Steve, I finished up my curtain install and was able to enjoy it on both days this past weekend. The product arrived promptly and was exactly as we had discussed. I am hoping to have many years of added enjoyment as a result of this investment. I already have a neighbor interested and will be forwarding your contact information if he wants to move forward. Attached are a few pictures of the finished product. Hope to see them up on your website. Glad to promote your product. Once again it was great doing business with you and I will certainly promote your product.”– Regards, Kevin M.

Mahalo from Maui!“Dear Mosquito Curtains, Our little curtain turned out great, thank you so much! It’s been so nice to enjoy the view without the unwanted company of mosquitos! Thought you might find this idea interesting for the bottom edge, we are going to try velcro-ing little sandbags to the bottom edge of the curtain (a boat-cover trick).  If it still needs elastic cords in the corner, we’ll install the hooks in the floor, after the deck is tiled.”– Amy & David.

Great Product“Steve, Could not be happier! What a great product. Top quality materials, superior customer service and simple homeowner installation. Thanks for all your guidance and help.”– Jim

Extremely Impressed“Hi Kurt, I know I’m pretty late getting these to you, but I figured better late than never! I got everything installed, and I’ve used them a few times. I’m extremely impressed! They make a world of difference when the mosquitos start to come out in the evening! I can actually use the porch after the sun goes down now!– Jason”

Very Happy After 5 Years“Our 5th season of use. Your wonderful service and quality of product has transformed our deck into the favorite room at the cottage. So simple but so awesome. Open and close the screens in under one minute. We have extreme weather conditions here on the Northumberland Strait / west side of Prince Edward Island, Canada. Your screens still look like new in spite of strong winds carrying salt and sand spray continually. Feel free to use this as a testimonial. Many Thanks.”– Eric

Oh Canada“Hi Kurt, I have just come in from our bug free carport to thank you again for the Mosquito Curtain. This is the first warm and humid day we have had this year. The mosquitoes nearly carried me away while I was gardening so I put the tools away and sat down on the swing in the carport.”

Clear Vinyl“This was one of the best things we have ever spent our money on.”– Kevin.

New Brunswick“Hello Kurt, Recently, I hosted a couple of large groups for a BBQ in my backyard and received a lot of compliments for the mosquito curtains. A few asked where I got the curtains and how they could order. So you may get some more business from New Brunswick Canada.My wife and I are delighted with the results, and at a fraction of the cost of a less preferable option would have been. Thank you for your helpful advice, courteous service and prompt delivery.”

Great Product“Thank you, Steve for a great product. We have been able to re-claim our porch in the evenings. Your customer service is second to none!”-Dave
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                alt="Bulk Mosquito Netting For Various Projects"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
