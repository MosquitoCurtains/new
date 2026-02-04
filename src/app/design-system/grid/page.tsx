'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Grid,
  Frame,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { Grid, Card, Frame } from '@/lib/design-system'

// Responsive grid - mobile 1 col, tablet 2 cols, desktop 4 cols
<Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>

// Image gallery grid
<Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
  {images.map((img, idx) => (
    <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
    </Frame>
  ))}
</Grid>`

const PRESETS = [
  { name: '1-2-3', config: { mobile: 1, tablet: 2, desktop: 3 } },
  { name: '1-2-4', config: { mobile: 1, tablet: 2, desktop: 4 } },
  { name: '2-3-5', config: { mobile: 2, tablet: 3, desktop: 5 } },
  { name: '1-3-4', config: { mobile: 1, tablet: 3, desktop: 4 } },
]

export default function GridPage() {
  const [copied, setCopied] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])

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
          <Heading level={1} className="!mb-0">Grid</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Layout</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Responsive grid layout component with configurable columns per breakpoint.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/layout/Grid.tsx
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
        <Stack gap="md">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPreset.name === preset.name
                    ? 'bg-[#406517] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300">
            <Grid responsiveCols={selectedPreset.config} gap="md">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-[#406517]/20 border-2 border-[#406517]/40 rounded-lg p-6 text-center">
                  <Text className="font-semibold !mb-0">Item {n}</Text>
                </div>
              ))}
            </Grid>
          </div>
          
          <Text size="sm" className="text-gray-500 text-center !mb-0">
            Config: mobile={selectedPreset.config.mobile}, tablet={selectedPreset.config.tablet}, desktop={selectedPreset.config.desktop}
          </Text>
          <Text size="xs" className="text-gray-400 text-center !mb-0">
            Resize your browser to see responsive behavior
          </Text>
        </Stack>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">responsiveCols</code></td>
                <td className="py-3 pr-4 text-gray-600">{'{ mobile: number, tablet: number, desktop: number }'}</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Columns per breakpoint</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">gap</code></td>
                <td className="py-3 pr-4 text-gray-600">'xs' | 'sm' | 'md' | 'lg' | 'xl'</td>
                <td className="py-3 pr-4 text-gray-600">'md'</td>
                <td className="py-3 text-gray-600">Space between items</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">className</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Common Patterns */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Common Patterns</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">→</span>
            <Text className="!mb-0"><strong>Product cards:</strong> <code className="bg-gray-100 px-1 rounded">{'{ mobile: 1, tablet: 2, desktop: 3 }'}</code></Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">→</span>
            <Text className="!mb-0"><strong>Feature cards:</strong> <code className="bg-gray-100 px-1 rounded">{'{ mobile: 1, tablet: 2, desktop: 4 }'}</code></Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">→</span>
            <Text className="!mb-0"><strong>Image gallery:</strong> <code className="bg-gray-100 px-1 rounded">{'{ mobile: 2, tablet: 3, desktop: 5 }'}</code></Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
