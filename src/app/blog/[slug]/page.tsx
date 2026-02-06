'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight, 
  Calendar,
  Tag,
  BookOpen,
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
import { BLOG_POSTS, getPostBySlug } from '../blog-data'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  // Get related posts (same category, excluding current)
  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)
  
  // Get next/prev posts
  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug)
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null

  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#406517] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article>
          <Stack gap="md" className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-[#406517]/10 text-[#406517] rounded-full font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            {/* Title */}
            <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl">
              {post.title}
            </Heading>
            
            {/* Excerpt */}
            <Text className="text-xl text-gray-600 !leading-relaxed">
              {post.excerpt}
            </Text>
          </Stack>
          
          {/* Featured Image */}
          <Frame ratio="21/9" className="rounded-2xl overflow-hidden my-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </Frame>
          
          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg prose-gray max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-strong:text-gray-900
                prose-ul:my-6 prose-li:text-gray-600
              "
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>
        </article>

        {/* Author/CTA Box */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 max-w-3xl mx-auto">
          <Stack gap="sm" className="text-center">
            <Heading level={4}>Ready to Get Started?</Heading>
            <Text className="text-gray-600 !mb-2">
              Have questions about protecting your outdoor space? We're here to help.
            </Text>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/start-project?mode=planner">
                  Talk to a Planner
                </Link>
              </Button>
            </div>
          </Stack>
        </Card>

        {/* Prev/Next Navigation */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="max-w-3xl mx-auto">
          {prevPost ? (
            <Link 
              href={`/blog/${prevPost.slug}`}
              className="group p-4 border border-gray-200 rounded-xl hover:border-[#406517]/30 hover:bg-[#406517]/5 transition-all"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <ArrowLeft className="w-4 h-4" />
                Previous Article
              </div>
              <Text className="font-medium group-hover:text-[#406517] transition-colors !mb-0 line-clamp-2">
                {prevPost.title}
              </Text>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link 
              href={`/blog/${nextPost.slug}`}
              className="group p-4 border border-gray-200 rounded-xl hover:border-[#406517]/30 hover:bg-[#406517]/5 transition-all text-right"
            >
              <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                Next Article
                <ArrowRight className="w-4 h-4" />
              </div>
              <Text className="font-medium group-hover:text-[#406517] transition-colors !mb-0 line-clamp-2">
                {nextPost.title}
              </Text>
            </Link>
          ) : (
            <div />
          )}
        </Grid>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <HeaderBarSection icon={BookOpen} label={`More in ${post.category}`} variant="dark">
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
              {relatedPosts.map((related) => (
                <Card key={related.slug} variant="elevated" className="!p-0 overflow-hidden group">
                  <Link href={`/blog/${related.slug}`} className="block">
                    <Frame ratio="16/9" className="relative">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Frame>
                    <div className="p-5">
                      <Heading level={4} className="!mb-2 group-hover:text-[#406517] transition-colors line-clamp-2">
                        {related.title}
                      </Heading>
                      <Text className="text-sm text-gray-600 !mb-0 line-clamp-2">{related.excerpt}</Text>
                    </div>
                  </Link>
                </Card>
              ))}
            </Grid>
          </HeaderBarSection>
        )}

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}

// Simple markdown-like formatting
function formatContent(content: string): string {
  return content
    .trim()
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (block.startsWith('## ')) {
        return `<h2>${block.slice(3)}</h2>`
      }
      if (block.startsWith('### ')) {
        return `<h3>${block.slice(4)}</h3>`
      }
      if (block.startsWith('**') && block.endsWith('**')) {
        return `<p><strong>${block.slice(2, -2)}</strong></p>`
      }
      if (block.startsWith('- ')) {
        const items = block.split('\n').map(item => {
          const text = item.slice(2).trim()
          // Handle bold text within list items
          const formattedText = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          return `<li>${formattedText}</li>`
        }).join('')
        return `<ul>${items}</ul>`
      }
      // Handle bold text within paragraphs
      const formattedBlock = block.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p>${formattedBlock}</p>`
    })
    .join('\n')
}

