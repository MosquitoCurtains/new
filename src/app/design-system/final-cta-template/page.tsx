'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  FinalCTATemplate,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { FinalCTATemplate } from '@/lib/design-system'

// Default usage - place at bottom of page
<FinalCTATemplate />

// Inside Stack
<Container size="xl">
  <Stack gap="lg">
    {/* Other sections */}
    <FinalCTATemplate />
  </Stack>
</Container>`

export default function FinalCTATemplatePage() {
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
          <Heading level={1} className="!mb-0">FinalCTATemplate</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Template</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Big gradient call-to-action section for the bottom of pages.
          Edit once, update everywhere.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/templates/FinalCTATemplate.tsx
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
      <FinalCTATemplate />

      {/* Props */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Props</Heading>
        <Text className="text-gray-600 !mb-0">
          This template has no props. Content is defined in the source file.
        </Text>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Customization</Heading>
        <Stack gap="sm">
          <Text className="!mb-0">
            To customize the content (headline, buttons, phone number, etc.), edit:
          </Text>
          <code className="bg-gray-100 px-3 py-2 rounded block text-sm">
            src/lib/design-system/templates/FinalCTATemplate.tsx
          </code>
          <Text className="text-gray-500 !mb-0">
            Changes will update everywhere this template is used.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}
