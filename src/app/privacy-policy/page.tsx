'use client'

import Link from 'next/link'
import { Shield, Mail, Phone, Globe } from 'lucide-react'
import {
  Container,
  Stack,
  Text,
  Heading,
  Card,
  HeaderBarSection,
  BulletedList,
  ListItem,
  FinalCTATemplate,
} from '@/lib/design-system'

export default function PrivacyPolicyPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4" />
            <span>Last Updated: February 20, 2025</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Privacy Policy
          </Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
          </Text>
        </div>

        {/* Introduction */}
        <Card className="p-6 md:p-8">
          <Text className="text-gray-600">
            Welcome to Mosquito Curtains. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website (www.mosquitocurtains.com) and use our services.
          </Text>
          <Text className="text-gray-600 mt-4">
            By using our website and services, you consent to the data practices described in this policy.
          </Text>
        </Card>

        {/* Section 1: Information We Collect */}
        <HeaderBarSection icon={Shield} label="1. Information We Collect" variant="dark">
          <Stack gap="md">
            <div>
              <Heading level={3} className="!text-xl !mb-3">1.1 Personal Information</Heading>
              <Text className="text-gray-600 mb-4">
                When you interact with Mosquito Curtains, we may collect personal information such as:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Name</ListItem>
                <ListItem variant="dot">Phone number</ListItem>
                <ListItem variant="dot">Email address</ListItem>
                <ListItem variant="dot">Mailing address</ListItem>
                <ListItem variant="dot">Payment details (processed securely via third-party payment processors)</ListItem>
                <ListItem variant="dot">Account login credentials (if applicable)</ListItem>
              </BulletedList>
            </div>

            <div>
              <Heading level={3} className="!text-xl !mb-3">1.2 Automatically Collected Information</Heading>
              <Text className="text-gray-600 mb-4">
                When you visit our website, we may automatically collect certain information through cookies and analytics tools, including:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">IP address</ListItem>
                <ListItem variant="dot">Browser type and version</ListItem>
                <ListItem variant="dot">Device information</ListItem>
                <ListItem variant="dot">Pages visited and time spent on the site</ListItem>
                <ListItem variant="dot">Referring website or source</ListItem>
              </BulletedList>
            </div>

            <div>
              <Heading level={3} className="!text-xl !mb-3">1.3 SMS & Communication Data</Heading>
              <Text className="text-gray-600 mb-4">
                If you opt in to receive SMS communications, we collect and store:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Your phone number</ListItem>
                <ListItem variant="dot">Consent status</ListItem>
                <ListItem variant="dot">Message history and engagement</ListItem>
              </BulletedList>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Section 2: How We Use Your Information */}
        <HeaderBarSection icon={Shield} label="2. How We Use Your Information" variant="dark">
          <Text className="text-gray-600 mb-4">
            We use your personal information for the following purposes:
          </Text>
          <BulletedList spacing="sm">
            <ListItem variant="checked" iconColor="#406517">
              <strong>To fulfill orders and provide services</strong> - processing transactions, shipping, and order confirmations.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>To communicate with you</strong> - sending order updates, customer service responses, and requested information.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>For SMS marketing and promotions</strong> - only with your explicit consent.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>To improve our website and user experience</strong> - using analytics and cookies to optimize performance.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>For legal and security reasons</strong> - to prevent fraud, comply with laws, and enforce our policies.
            </ListItem>
          </BulletedList>
        </HeaderBarSection>

        {/* Section 3: SMS Communication */}
        <HeaderBarSection icon={Shield} label="3. SMS Communication & Consent" variant="dark">
          <Stack gap="md">
            <div>
              <Heading level={3} className="!text-xl !mb-3">3.1 How You Opt In</Heading>
              <Text className="text-gray-600 mb-4">
                You may opt-in to receive SMS messages from Mosquito Curtains when you:
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Check the consent box on our website lead forms</ListItem>
                <ListItem variant="dot">Submit your phone number via Facebook Lead Forms</ListItem>
                <ListItem variant="dot">Text START to subscribe</ListItem>
              </BulletedList>
            </div>

            <div>
              <Heading level={3} className="!text-xl !mb-3">3.2 Message Frequency & Data Charges</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="dot">We send SMS messages related to orders, promotions, and product updates.</ListItem>
                <ListItem variant="dot">Message frequency varies, and standard message and data rates may apply based on your carrier&apos;s terms.</ListItem>
              </BulletedList>
            </div>

            <div>
              <Heading level={3} className="!text-xl !mb-3">3.3 How to Opt Out</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="dot">You can unsubscribe at any time by replying STOP to any text message.</ListItem>
                <ListItem variant="dot">For assistance, reply HELP or contact our support team.</ListItem>
              </BulletedList>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Section 4: Sharing & Disclosure */}
        <HeaderBarSection icon={Shield} label="4. Sharing & Disclosure of Your Information" variant="dark">
          <Text className="text-gray-600 mb-4 font-semibold">
            We do not sell your personal data.
          </Text>
          <Text className="text-gray-600 mb-4">
            We may share your information with:
          </Text>
          <BulletedList spacing="sm">
            <ListItem variant="dot">
              <strong>Service providers & payment processors</strong> - to fulfill orders, process payments, and deliver communications.
            </ListItem>
            <ListItem variant="dot">
              <strong>Third-party marketing partners</strong> - only with your consent.
            </ListItem>
            <ListItem variant="dot">
              <strong>Legal authorities</strong> - if required by law or to prevent fraud or abuse.
            </ListItem>
          </BulletedList>
        </HeaderBarSection>

        {/* Section 5: Data Security */}
        <HeaderBarSection icon={Shield} label="5. Data Security" variant="dark">
          <Text className="text-gray-600 mb-4">
            We take data security seriously and implement the following measures:
          </Text>
          <BulletedList spacing="sm">
            <ListItem variant="checked" iconColor="#406517">
              <strong>Encryption</strong> - Secure SSL encryption for transactions.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>Access controls</strong> - Restricted access to sensitive data.
            </ListItem>
            <ListItem variant="checked" iconColor="#406517">
              <strong>Regular audits</strong> - Monitoring for potential security risks.
            </ListItem>
          </BulletedList>
        </HeaderBarSection>

        {/* Section 6: Your Privacy Rights */}
        <HeaderBarSection icon={Shield} label="6. Your Privacy Rights" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Depending on your location, you may have the following rights:
            </Text>

            <div>
              <Heading level={3} className="!text-xl !mb-3">6.1 GDPR (For EU Users)</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Right to access, correct, or delete your personal data.</ListItem>
                <ListItem variant="dot">Right to object to processing and withdraw consent.</ListItem>
              </BulletedList>
            </div>

            <div>
              <Heading level={3} className="!text-xl !mb-3">6.2 CCPA (For California Residents)</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="dot">Right to know what personal data we collect.</ListItem>
                <ListItem variant="dot">Right to request deletion of your personal data.</ListItem>
                <ListItem variant="dot">Right to opt out of data sales (we do not sell your data).</ListItem>
              </BulletedList>
            </div>

            <Text className="text-gray-600">
              To exercise your rights, email us at{' '}
              <a href="mailto:help@mosquitocurtains.com" className="text-[#406517] hover:underline">
                help@mosquitocurtains.com
              </a>
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* Section 7: Cookies */}
        <HeaderBarSection icon={Shield} label="7. Cookies & Tracking Technologies" variant="dark">
          <Text className="text-gray-600 mb-4">
            We use cookies and similar tracking technologies to:
          </Text>
          <BulletedList spacing="sm">
            <ListItem variant="dot">Analyze website traffic and performance.</ListItem>
            <ListItem variant="dot">Remember user preferences for a personalized experience.</ListItem>
          </BulletedList>
          <Text className="text-gray-600 mt-4">
            You can manage cookie preferences via your browser settings.
          </Text>
        </HeaderBarSection>

        {/* Section 8: Third-Party Links */}
        <HeaderBarSection icon={Shield} label="8. Third-Party Links" variant="dark">
          <Text className="text-gray-600">
            Our website may contain links to third-party sites. We are not responsible for their privacy practices. Please review their privacy policies separately.
          </Text>
        </HeaderBarSection>

        {/* Section 9: Changes */}
        <HeaderBarSection icon={Shield} label="9. Changes to This Privacy Policy" variant="dark">
          <Text className="text-gray-600">
            We may update this Privacy Policy as needed. Any changes will be posted here with an updated &quot;Last Updated&quot; date.
          </Text>
        </HeaderBarSection>

        {/* Section 10: Contact Us */}
        <HeaderBarSection icon={Shield} label="10. Contact Us" variant="dark">
          <Text className="text-gray-600 mb-6">
            For questions or privacy-related concerns, contact us at:
          </Text>
          <Card className="p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Text className="font-semibold text-gray-900 mb-2">Mosquito Curtains</Text>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:help@mosquitocurtains.com" className="flex items-center gap-2 text-[#406517] hover:underline">
                  <Mail className="w-4 h-4" />
                  help@mosquitocurtains.com
                </a>
                <a href="tel:7706454745" className="flex items-center gap-2 text-[#406517] hover:underline">
                  <Phone className="w-4 h-4" />
                  (770) 645-4745
                </a>
                <a href="https://www.mosquitocurtains.com" className="flex items-center gap-2 text-[#406517] hover:underline">
                  <Globe className="w-4 h-4" />
                  www.mosquitocurtains.com
                </a>
              </div>
            </div>
          </Card>
        </HeaderBarSection>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
