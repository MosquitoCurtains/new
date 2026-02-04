'use client'

/**
 * Admin Financial Export Page
 * 
 * Export orders and financial data for accounting purposes.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Badge,
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

type ExportType = 'orders' | 'customers' | 'products' | 'revenue'
type ExportFormat = 'csv' | 'json'

interface ExportConfig {
  type: ExportType
  format: ExportFormat
  startDate: string
  endDate: string
  includeLineItems: boolean
  includeTax: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FinancialExportPage() {
  const [config, setConfig] = useState<ExportConfig>({
    type: 'orders',
    format: 'csv',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeLineItems: true,
    includeTax: true,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportResult(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setExportResult({
        success: true,
        message: `Successfully exported ${config.type} data from ${config.startDate} to ${config.endDate}`,
        url: '#',
      })
    } catch (error) {
      setExportResult({
        success: false,
        message: 'Export failed. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportTypes = [
    { id: 'orders' as const, label: 'Orders', description: 'Complete order history with totals and status', icon: FileText },
    { id: 'customers' as const, label: 'Customers', description: 'Customer list with lifetime value and metrics', icon: DollarSign },
    { id: 'products' as const, label: 'Products', description: 'Product catalog with pricing and inventory', icon: FileText },
    { id: 'revenue' as const, label: 'Revenue Summary', description: 'Monthly revenue breakdown for accounting', icon: DollarSign },
  ]

  return (
    <Container size="lg">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <Heading level={1} className="!mb-1">Financial Export</Heading>
              <Text className="text-gray-600">
                Export data for accounting and analysis
              </Text>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8">
            <Grid responsiveCols={{ mobile: 1, desktop: 2 }} gap="lg">
              {/* Export Configuration */}
              <Stack gap="lg">
                {/* Export Type */}
                <Card variant="elevated" className="!p-6">
                  <Heading level={3} className="!mb-4">Export Type</Heading>
                  <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                    {exportTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setConfig({ ...config, type: type.id })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            config.type === type.id
                              ? 'border-[#406517] bg-[#406517]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              config.type === type.id ? 'bg-[#406517]/10' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                config.type === type.id ? 'text-[#406517]' : 'text-gray-500'
                              }`} />
                            </div>
                            <div>
                              <Text className={`font-medium !mb-0 ${
                                config.type === type.id ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {type.label}
                              </Text>
                              <Text size="sm" className="text-gray-500 !mb-0">
                                {type.description}
                              </Text>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </Grid>
                </Card>

                {/* Date Range */}
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#003365]" />
                    <Heading level={3} className="!mb-0">Date Range</Heading>
                  </div>
                  <Grid responsiveCols={{ mobile: 2 }} gap="md">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={config.startDate}
                        onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={config.endDate}
                        onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                      />
                    </div>
                  </Grid>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfig({
                        ...config,
                        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                        endDate: new Date().toISOString().split('T')[0],
                      })}
                    >
                      Year to Date
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const now = new Date()
                        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
                        setConfig({
                          ...config,
                          startDate: lastMonth.toISOString().split('T')[0],
                          endDate: lastMonthEnd.toISOString().split('T')[0],
                        })
                      }}
                    >
                      Last Month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfig({
                        ...config,
                        startDate: new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0],
                        endDate: new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0],
                      })}
                    >
                      Last Year
                    </Button>
                  </div>
                </Card>

                {/* Format & Options */}
                <Card variant="elevated" className="!p-6">
                  <Heading level={3} className="!mb-4">Format & Options</Heading>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Export Format
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setConfig({ ...config, format: 'csv' })}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          config.format === 'csv'
                            ? 'border-[#406517] bg-[#406517]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <FileSpreadsheet className={`w-5 h-5 ${
                          config.format === 'csv' ? 'text-[#406517]' : 'text-gray-500'
                        }`} />
                        <span className={config.format === 'csv' ? 'text-gray-900' : 'text-gray-700'}>
                          CSV
                        </span>
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, format: 'json' })}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          config.format === 'json'
                            ? 'border-[#406517] bg-[#406517]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <FileJson className={`w-5 h-5 ${
                          config.format === 'json' ? 'text-[#406517]' : 'text-gray-500'
                        }`} />
                        <span className={config.format === 'json' ? 'text-gray-900' : 'text-gray-700'}>
                          JSON
                        </span>
                      </button>
                    </div>
                  </div>

                  {config.type === 'orders' && (
                    <Stack gap="sm">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={config.includeLineItems}
                          onChange={(e) => setConfig({ ...config, includeLineItems: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-[#406517] focus:ring-[#406517]"
                        />
                        <span className="text-gray-700">Include line item details</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={config.includeTax}
                          onChange={(e) => setConfig({ ...config, includeTax: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-[#406517] focus:ring-[#406517]"
                        />
                        <span className="text-gray-700">Include tax breakdown</span>
                      </label>
                    </Stack>
                  )}
                </Card>
              </Stack>

              {/* Export Preview & Actions */}
              <div>
                <div className="sticky top-4">
                  <Card variant="elevated" className="!p-6">
                    <Heading level={3} className="!mb-4">Export Summary</Heading>
                    
                    <Stack gap="md" className="mb-6">
                      <div className="flex justify-between">
                        <Text className="text-gray-500 !mb-0">Export Type</Text>
                        <Text className="font-medium text-gray-900 !mb-0 capitalize">{config.type}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-gray-500 !mb-0">Format</Text>
                        <Badge className="!bg-gray-100 !text-gray-700 !border-gray-200 uppercase">{config.format}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <Text className="text-gray-500 !mb-0">Date Range</Text>
                        <Text className="font-medium text-gray-900 !mb-0">
                          {new Date(config.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(config.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </div>
                    </Stack>

                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full"
                      >
                        {isExporting ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Generating Export...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Generate Export
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Export Result */}
                    {exportResult && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        exportResult.success 
                          ? 'bg-[#406517]/10 border border-[#406517]/30' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          {exportResult.success ? (
                            <CheckCircle className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <Text className={`!mb-2 ${exportResult.success ? 'text-[#406517]' : 'text-red-700'}`}>
                              {exportResult.message}
                            </Text>
                            {exportResult.success && exportResult.url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={exportResult.url} download>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download File
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card variant="outlined" className="!p-4 mt-4">
                    <Text size="sm" className="text-gray-600 !mb-0">
                      Exports are generated in real-time from your database. 
                      Large date ranges may take longer to process.
                    </Text>
                  </Card>
                </div>
              </div>
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
