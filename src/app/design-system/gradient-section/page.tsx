'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  GradientSection,
  Grid,
  FeatureCard,
  Button,
} from '@/lib/design-system'
import { Copy, Check, Shield, Wrench, Truck, Award, ArrowRight } from 'lucide-react'

const CODE_EXAMPLE = `import { GradientSection, Grid, FeatureCard, Button } from '@/lib/design-system'
import { Shield, Wrench, Truck, Award, ArrowRight } from 'lucide-react'

<GradientSection 
  variant="green"  // 'green' | 'blue' | 'pink' | 'mixed'
  title="Section Title"
  subtitle="Optional description text"
>
  <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
    <FeatureCard icon={Shield} title="Feature 1" iconColor="#406517">
      Description text
    </FeatureCard>
    {/* More cards... */}
  </Grid>
  <div className="flex justify-center pt-6">
    <Button variant="primary">
      Call to Action
      <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </div>
</GradientSection>`

const VARIANTS = ['green', 'blue', 'pink', 'mixed']

export default function GradientSectionPage() {
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
          <Heading level={1} className="!mb-0">GradientSection</Heading>
          <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30">Sections</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Gradient-bordered section container. Perfect for feature grids and marketing content.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/sections/GradientSection.tsx
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
        <div className="flex flex-wrap gap-2 mb-6">
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
      <GradientSection 
        variant={selectedVariant as any}
        title={`GradientSection variant="${selectedVariant}"`}
        subtitle="This is a live preview of the component"
      >
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
          <FeatureCard 
            icon={Shield} 
            title={<span className="text-[#406517]">Quality</span>}
            iconColor="#406517"
            variant="elevated"
            className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
          >
            Marine-grade materials
          </FeatureCard>
          <FeatureCard 
            icon={Wrench} 
            title={<span className="text-[#003365]">Easy Install</span>}
            iconColor="#003365"
            variant="elevated"
            className="!bg-[#003365]/5 !border-[#003365]/20 text-center"
          >
            DIY in an afternoon
          </FeatureCard>
          <FeatureCard 
            icon={Truck} 
            title={<span className="text-[#B30158]">Fast Ship</span>}
            iconColor="#B30158"
            variant="elevated"
            className="!bg-[#B30158]/5 !border-[#B30158]/20 text-center"
          >
            3-8 business days
          </FeatureCard>
          <FeatureCard 
            icon={Award} 
            title={<span className="text-[#FFA501]">Guaranteed</span>}
            iconColor="#FFA501"
            variant="elevated"
            className="!bg-[#FFA501]/5 !border-[#FFA501]/20 text-center"
          >
            Satisfaction guaranteed
          </FeatureCard>
        </Grid>
        <div className="flex justify-center pt-6">
          <Button variant="primary">
            Call to Action
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </GradientSection>

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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'green' | 'blue' | 'pink' | 'mixed'</td>
                <td className="py-3 pr-4 text-gray-600">'green'</td>
                <td className="py-3 text-gray-600">Color theme</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">title</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Section title (optional)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">subtitle</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Section subtitle (optional)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Section content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </Stack>
  )
}
