'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  CTASection,
  Button,
} from '@/lib/design-system'
import { Copy, Check, ArrowRight, Phone } from 'lucide-react'

const CODE_EXAMPLE = `import { CTASection, Button } from '@/lib/design-system'
import { ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'

<CTASection
  title="Ready to Get Started?"
  subtitle="Get your free instant quote in under 2 minutes."
  variant="green"  // 'green' | 'blue' | 'pink' | 'dark'
>
  <Button variant="highlight" size="lg" asChild>
    <Link href="/start-project">
      Get Free Quote
      <ArrowRight className="ml-2 w-5 h-5" />
    </Link>
  </Button>
  <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10" asChild>
    <a href="tel:1-855-684-5677">
      <Phone className="mr-2 w-5 h-5" />
      Call Us
    </a>
  </Button>
</CTASection>`

const VARIANTS = ['green', 'blue', 'pink', 'dark']

export default function CTASectionPage() {
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>('green')

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Heading level={1} className="!mb-0">CTASection</Heading>
          <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30">Sections</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Big gradient call-to-action section. Use for prominent CTAs.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/sections/CTASection.tsx
          </code>
        </Text>
      </Card>

      {/* Usage */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Usage</Heading>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
            {CODE_EXAMPLE}
          </pre>
          <button
            onClick={copyCode}
            className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </Card>

      {/* Variant Selector */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Variants</Heading>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((variant) => (
            <button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedVariant === variant
                  ? 'bg-[#406517] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
      </Card>

      {/* Live Example */}
      <CTASection
        title={`CTASection variant="${selectedVariant}"`}
        subtitle="This is a live preview of the component with buttons"
        variant={selectedVariant as any}
      >
        <Button variant="highlight" size="lg">
          Primary CTA
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
          <Phone className="mr-2 w-5 h-5" />
          Secondary CTA
        </Button>
      </CTASection>

      {/* Props */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Props</Heading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold">Prop</th>
                <th className="text-left py-2 pr-4 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 font-semibold">Default</th>
                <th className="text-left py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">title</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Main headline</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">subtitle</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Supporting text</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'green' | 'blue' | 'pink' | 'dark'</td>
                <td className="py-3 pr-4 text-gray-600">'green'</td>
                <td className="py-3 text-gray-600">Color theme</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Buttons/actions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* vs FinalCTATemplate */}
      <Card className="!p-6 border-l-4 border-l-[#003365]">
        <Heading level={3} className="!mb-4">CTASection vs FinalCTATemplate</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#003365] font-bold">→</span>
            <Text className="!mb-0"><strong>CTASection:</strong> Empty container - you provide title, subtitle, and buttons</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">→</span>
            <Text className="!mb-0"><strong>FinalCTATemplate:</strong> Pre-configured with content - just drop in</Text>
          </div>
          <Text className="text-gray-500 !mb-0 mt-2">
            Use FinalCTATemplate for consistent page endings. Use CTASection when you need custom content.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}
