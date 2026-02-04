'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  FeatureCard,
  Grid,
} from '@/lib/design-system'
import { Copy, Check, Shield, Wrench, Truck, Award } from 'lucide-react'

const CODE_EXAMPLE = `import { FeatureCard, Grid } from '@/lib/design-system'
import { Shield, Wrench, Truck, Award } from 'lucide-react'

<Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
  <FeatureCard 
    icon={Shield} 
    title={<span className="text-[#406517]">Quality</span>}
    iconColor="#406517"
    variant="elevated"
    className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
  >
    Marine-grade materials built to last.
  </FeatureCard>
  
  <FeatureCard 
    icon={Wrench} 
    title={<span className="text-[#003365]">Easy Install</span>}
    iconColor="#003365"
    variant="elevated"
    className="!bg-[#003365]/5 !border-[#003365]/20 text-center"
  >
    DIY installation in an afternoon.
  </FeatureCard>
</Grid>`

export default function FeatureCardPage() {
  const [copied, setCopied] = useState(false)

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
          <Heading level={1} className="!mb-0">FeatureCard</Heading>
          <Badge className="!bg-[#FFA501]/10 !text-[#FFA501] !border-[#FFA501]/30">Cards</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Icon + title + description card. Perfect for feature grids.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/cards/FeatureCard.tsx
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

      {/* Live Example */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Live Example</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
          <FeatureCard 
            icon={Shield} 
            title={<span className="text-[#406517]">Quality</span>}
            iconColor="#406517"
            variant="elevated"
            className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
          >
            Marine-grade materials built to last.
          </FeatureCard>
          <FeatureCard 
            icon={Wrench} 
            title={<span className="text-[#003365]">Easy Install</span>}
            iconColor="#003365"
            variant="elevated"
            className="!bg-[#003365]/5 !border-[#003365]/20 text-center"
          >
            DIY installation in an afternoon.
          </FeatureCard>
          <FeatureCard 
            icon={Truck} 
            title={<span className="text-[#B30158]">Fast Shipping</span>}
            iconColor="#B30158"
            variant="elevated"
            className="!bg-[#B30158]/5 !border-[#B30158]/20 text-center"
          >
            Delivered in 3-8 business days.
          </FeatureCard>
          <FeatureCard 
            icon={Award} 
            title={<span className="text-[#FFA501]">Guaranteed</span>}
            iconColor="#FFA501"
            variant="elevated"
            className="!bg-[#FFA501]/5 !border-[#FFA501]/20 text-center"
          >
            Satisfaction guaranteed.
          </FeatureCard>
        </Grid>
      </Card>

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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">icon</code></td>
                <td className="py-3 pr-4 text-gray-600">LucideIcon</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Icon component from lucide-react</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">title</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Card title</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">iconColor</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Icon color (hex)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'default' | 'elevated'</td>
                <td className="py-3 pr-4 text-gray-600">'default'</td>
                <td className="py-3 text-gray-600">Card style</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Description text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use inside <code className="bg-gray-100 px-1 rounded">GradientSection</code> for feature grids</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Match <code className="bg-gray-100 px-1 rounded">iconColor</code> with background and border colors</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Add <code className="bg-gray-100 px-1 rounded">text-center</code> for centered layout</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
