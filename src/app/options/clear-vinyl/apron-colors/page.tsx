'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Palette,
  CheckCircle,
Camera, Info} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  Frame,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const APRON_COLORS = [
  { name: 'Black', hex: '#1a1a1a', description: 'Most popular. Classic look that complements most exteriors.' },
  { name: 'White', hex: '#ffffff', description: 'Bright and clean. Perfect for white-trimmed homes.' },
  { name: 'Tan', hex: '#d2b48c', description: 'Warm neutral. Blends with natural wood and earth tones.' },
  { name: 'Brown', hex: '#6b4423', description: 'Rich, deep tone. Complements dark wood and rustic settings.' },
  { name: 'Gray', hex: '#808080', description: 'Modern neutral. Works with contemporary architecture.' },
  { name: 'Green', hex: '#3a5f0b', description: 'Natural accent. Blends with outdoor greenery.' },
]

export default function ApronColorsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Palette className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Clear Vinyl Apron Colors
            </Heading>
            <Text className="text-xl text-gray-600">
              Choose the perfect frame color for your clear vinyl panels. The "apron" is 
              the colored fabric border that frames your clear vinyl.
            </Text>
          </Stack>
        </section>

        {/* What Is The Apron */}
        <HeaderBarSection icon={CheckCircle} label="What Is The Apron?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Apron-Example.jpg"
                alt="Clear vinyl apron example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                The apron is the marine-grade Sunbrella fabric border that surrounds your 
                clear vinyl panel. It provides:
              </Text>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#003365] mt-0.5 flex-shrink-0" />
                  <span>A finished, professional appearance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#003365] mt-0.5 flex-shrink-0" />
                  <span>Protection for vinyl edges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#003365] mt-0.5 flex-shrink-0" />
                  <span>Attachment points for hardware</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#003365] mt-0.5 flex-shrink-0" />
                  <span>Color coordination with your home</span>
                </li>
              </ul>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Related Videos */}
        <HeaderBarSection icon={Palette} label="Related Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed
              videoId={VIDEOS.BOAT_NETTING}
              title="Boat & Canvas Aprons"
              variant="card"
            />
            <YouTubeEmbed
              videoId={VIDEOS.CANVAS_APRONS}
              title="Canvas Aprons for Clear Vinyl"
              variant="card"
            />
          </Grid>
        </HeaderBarSection>

        {/* Color Options */}
        <HeaderBarSection icon={Palette} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="lg">
            {APRON_COLORS.map((color) => (
              <Card key={color.name} variant="elevated" className="!p-6 text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 shadow-inner"
                  style={{ 
                    backgroundColor: color.hex,
                    border: color.name === 'White' ? '2px solid #e5e5e5' : 'none'
                  }}
                />
                <Heading level={4} className="!mb-2">{color.name}</Heading>
                <Text className="text-sm text-gray-600 !mb-0">{color.description}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Tips */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Color Selection Tips</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Stack gap="md">
              <Text className="font-semibold !mb-1">Match Your Trim</Text>
              <Text className="text-gray-600 text-sm !mb-0">
                If your home has dark trim, choose black or brown. Light trim? White or tan works beautifully.
              </Text>
            </Stack>
            <Stack gap="md">
              <Text className="font-semibold !mb-1">Consider Visibility</Text>
              <Text className="text-gray-600 text-sm !mb-0">
                Darker aprons are less visible from inside, letting the clear vinyl 
                "disappear" more into the background.
              </Text>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get a Quote?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Select your apron color during the quote process. Our team can also help 
            you choose the perfect match.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get Clear Vinyl Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Apron Colors Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Winterized-Porch-Plastic-Panels-Black-Canvas-400-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Black-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-400-300x225.jpg"
                  alt="clear vinyl plastic winter enclosure panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Gray-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Cocoa-Brown-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Plastic-Enclosures-Royal-Blue-Canvas-Tent-1200-300x225.jpg"
                  alt="Plastic awning enclosure with blue apron"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Blue-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/7-Navy-Clear-Vinyl-Enclosure-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Navy-CV-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Church-400-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Moss-Green-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200-300x225.jpg"
                  alt="Insulating porch panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Forest-Green-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-Beach-House-1200-300x225.jpg"
                  alt="Protect porch for winter"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Sandy-Tan-Clear-Vinyl-Canvas-256-200x200-1-150x150.png"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/18-Clear-Plastic-Gazebo-With-No-Canvas-1200-300x225.jpg"
                  alt="Clear plastic enclosure for gazebo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200-300x225.jpg"
                  alt="DIY Winter Porch Enclosures are a great way to protect porch and patio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Small-Business-Plastic-Panels-On-Patio-With-Black-Canvas-1200-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Winterized-Porch-Plastic-Panels-Black-Canvas-1200-300x225.jpg"
                  alt="Apron Colors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Clear Vinyl Enclosure Taller Windows" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">While most of the industry uses 54″ (tall) clear vinyl, we offer a very rare 72″ clear vinyl for our enclosures. It is rare, because of the extruding process. What that means to you is taller clear vinyl enclosure windows for you and less canvas apron filler which makes fabrication less costly. For projects less than 9ft tall, we need only place canvas at the bottom requiring less sewing. Only for taller vinyl enclosures do we need to distribute canvas top and bottom.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Better Quality Canvas Aprons For Vinyl Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Many providers try to save money by using a vinyl apron that is glossy and rather “industrial looking”. That just isn’t what makes a real craftsman proud of their work and we do not use it. Instead, we splurge on a canvas that costs us 4x what vinyl aprons cost, but it is a lovely Gortex-like material that is far classier looking for your clear vinyl enclosure.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
