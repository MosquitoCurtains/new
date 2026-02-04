'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Frame,
  Grid,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const RATIOS = ['1/1', '4/3', '16/9', '16/10', '21/9']

const CODE_EXAMPLE = `import { Frame, Grid } from '@/lib/design-system'

// Single image with aspect ratio
<Frame ratio="16/9" className="rounded-xl overflow-hidden">
  <img src="..." alt="..." className="w-full h-full object-cover" />
</Frame>

// Image gallery
<Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
  {images.map((img, idx) => (
    <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </Frame>
  ))}
</Grid>`

export default function FramePage() {
  const [copied, setCopied] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState<string>('16/9')

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
          <Heading level={1} className="!mb-0">Frame</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Layout</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Aspect ratio container for images and videos. Ensures consistent dimensions across all devices.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/layout/Frame.tsx
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

      {/* Ratio Examples */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Aspect Ratios</Heading>
        <Stack gap="md">
          <div className="flex flex-wrap gap-2">
            {RATIOS.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSelectedRatio(ratio)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedRatio === ratio
                    ? 'bg-[#406517] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
          
          <div className="max-w-md mx-auto">
            <Frame ratio={selectedRatio} className="rounded-xl overflow-hidden bg-[#406517]/10 border-2 border-[#406517]/30">
              <div className="w-full h-full flex items-center justify-center">
                <Text className="font-semibold text-[#406517] !mb-0">
                  ratio="{selectedRatio}"
                </Text>
              </div>
            </Frame>
          </div>
        </Stack>
      </Card>

      {/* Common Ratios */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Common Use Cases</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
          <div>
            <Text className="font-semibold !mb-2">4/3 - Gallery Images</Text>
            <Frame ratio="4/3" className="rounded-xl overflow-hidden bg-gray-200">
              <img 
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg"
                alt="Example"
                className="w-full h-full object-cover"
              />
            </Frame>
          </div>
          <div>
            <Text className="font-semibold !mb-2">16/9 - Videos</Text>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden bg-gray-200">
              <img 
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
                alt="Example"
                className="w-full h-full object-cover"
              />
            </Frame>
          </div>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">ratio</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">'16/9'</td>
                <td className="py-3 text-gray-600">Aspect ratio (e.g., "4/3", "16/9")</td>
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

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">ratio="4/3"</code> for gallery images</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">ratio="16/9"</code> for videos</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Add <code className="bg-gray-100 px-1 rounded">className="rounded-xl overflow-hidden"</code> for rounded corners</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">object-cover</code> on images inside Frame</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
