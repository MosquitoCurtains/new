'use client'

/**
 * SupportPageTemplate
 * 
 * Template for support/info pages (shipping, returns, contact, etc.)
 * Simple content-focused layout.
 * 
 * Usage:
 * ```tsx
 * <SupportPageTemplate
 *   title="Shipping & Delivery"
 *   sections={[...]}
 * />
 * ```
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  TwoColumn,
  BulletedList,
  ListItem,
  Frame,
} from '../components'
import { FinalCTATemplate } from './index'

export interface ContentSection {
  title: string
  content: ReactNode
  icon?: LucideIcon
  iconColor?: string
  image?: string
  bullets?: string[]
}

export interface QuickLink {
  title: string
  href: string
  description?: string
}

export interface SupportPageTemplateProps {
  /** Page title */
  title: string
  /** Page subtitle/description */
  subtitle?: string
  /** Content sections */
  sections?: ContentSection[]
  /** Quick links */
  quickLinks?: QuickLink[]
  /** Show contact info */
  showContactInfo?: boolean
  /** Custom children */
  children?: ReactNode
}

export function SupportPageTemplate({
  title,
  subtitle,
  sections = [],
  quickLinks = [],
  showContactInfo = true,
  children,
}: SupportPageTemplateProps) {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Content Sections */}
        {sections.map((section, idx) => (
          <section key={idx}>
            <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
              {section.icon && (
                <div 
                  className="px-6 py-4 flex items-center gap-3"
                  style={{ backgroundColor: section.iconColor || '#406517' }}
                >
                  <section.icon className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold text-lg uppercase tracking-wider">
                    {section.title}
                  </span>
                </div>
              )}
              <div className="p-6 md:p-8">
                {!section.icon && (
                  <Heading level={2} className="!mb-4">{section.title}</Heading>
                )}
                
                {section.image ? (
                  <TwoColumn gap="lg" className="items-start">
                    <div>
                      {typeof section.content === 'string' ? (
                        <Text className="text-gray-600">{section.content}</Text>
                      ) : (
                        section.content
                      )}
                      {section.bullets && (
                        <BulletedList spacing="sm" className="mt-4">
                          {section.bullets.map((bullet, i) => (
                            <ListItem key={i} variant="checked" iconColor="#406517">
                              {bullet}
                            </ListItem>
                          ))}
                        </BulletedList>
                      )}
                    </div>
                    <Frame ratio="16/10" className="rounded-xl overflow-hidden">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                    </Frame>
                  </TwoColumn>
                ) : (
                  <>
                    {typeof section.content === 'string' ? (
                      <Text className="text-gray-600">{section.content}</Text>
                    ) : (
                      section.content
                    )}
                    {section.bullets && (
                      <BulletedList spacing="sm" className="mt-4">
                        {section.bullets.map((bullet, i) => (
                          <ListItem key={i} variant="checked" iconColor="#406517">
                            {bullet}
                          </ListItem>
                        ))}
                      </BulletedList>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* Quick Links */}
        {quickLinks.length > 0 && (
          <section>
            <Heading level={3} className="text-center !mb-6">Related Information</Heading>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {quickLinks.map((link, idx) => (
                <Card key={idx} variant="outlined" className="!p-4 hover:border-[#406517]/50 transition-colors">
                  <Link href={link.href} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{link.title}</span>
                      {link.description && (
                        <p className="text-sm text-gray-500">{link.description}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                </Card>
              ))}
            </Grid>
          </section>
        )}

        {/* Contact Info */}
        {showContactInfo && (
          <section>
            <div className="bg-[#003365] rounded-3xl p-8 md:p-12">
              <div className="text-center text-white">
                <Heading level={3} className="!text-white !mb-4">
                  Need More Help?
                </Heading>
                <p className="text-white/80 mb-6">
                  Our planning team is here to assist you.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="highlight" asChild>
                    <a href="tel:7706454745">
                      Call (770) 645-4745
                    </a>
                  </Button>
                  <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10" asChild>
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Custom Children */}
        {children}

        {/* Final CTA */}
        <FinalCTATemplate variant="green" />
      </Stack>
    </Container>
  )
}
