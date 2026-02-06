'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  BookOpen,
  Calendar,
  Tag,
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
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'
import { BLOG_POSTS, getAllCategories } from './blog-data'

export default function BlogPage() {
  const categories = getAllCategories()
  
  // Get the most recent post for the featured section
  const featuredPost = [...BLOG_POSTS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0]
  
  // Get remaining posts
  const remainingPosts = BLOG_POSTS.filter(post => post.slug !== featuredPost.slug)

  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Blog
            </Heading>
            <Text className="text-xl text-gray-600">
              Tips, guides, and insights about mosquito protection, outdoor living, 
              and making the most of your outdoor spaces.
            </Text>
          </Stack>
        </section>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <span 
              key={category}
              className="px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Featured Post */}
        <HeaderBarSection icon={BookOpen} label="Featured Article" variant="dark">
          <Card variant="elevated" className="!p-0 overflow-hidden">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} className="gap-0">
                <Frame ratio="4/3" className="relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#406517] text-white text-xs font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                </Frame>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <Heading level={2} className="!mb-3 group-hover:text-[#406517] transition-colors">
                    {featuredPost.title}
                  </Heading>
                  <Text className="text-gray-600 !mb-4">{featuredPost.excerpt}</Text>
                  <span className="text-[#406517] font-medium flex items-center gap-2">
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Grid>
            </Link>
          </Card>
        </HeaderBarSection>

        {/* All Posts */}
        <HeaderBarSection icon={Tag} label="All Articles" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {remainingPosts.map((post) => (
              <Card key={post.slug} variant="elevated" className="!p-0 overflow-hidden group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <Frame ratio="16/9" className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </Frame>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <Heading level={4} className="!mb-2 group-hover:text-[#406517] transition-colors line-clamp-2">
                      {post.title}
                    </Heading>
                    <Text className="text-sm text-gray-600 !mb-0 line-clamp-2">{post.excerpt}</Text>
                  </div>
                </Link>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Protect Your Space?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Stop reading about mosquitoes and start enjoying your outdoor living 
            spaces bug-free.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
