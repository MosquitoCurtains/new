'use client'

/**
 * Admin Instant Quote Pricing
 * 
 * View and manage instant quote pricing parameters from the database.
 * Shows pricing grouped by category with inline editing.
 * admin_only flag hides options from the front-end quote form.
 * Mirrors the structure of /admin/pricing.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  ArrowLeft, 
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calculator,
  Layers,
  Truck,
  Grid3X3,
  Wrench,
  Settings,
} from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface PricingRow {
  id: string
  category: string
  pricing_key: string
  value: number
  display_label: string
  admin_only: boolean
  sort_order: number
  updated_at: string
}

interface CategoryConfig {
  id: string
  title: string
  subtitle: string
  icon: typeof DollarSign
  color: string
  valueLabel: string
  valueStep: string
  /** Whether rows in this category can be toggled admin_only */
  canToggleVisibility: boolean
}

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

const CATEGORIES: CategoryConfig[] = [
  { 
    id: 'mosquito_mesh_price', 
    title: 'Mosquito Mesh Prices', 
    subtitle: 'Per linear foot',
    icon: Layers, 
    color: '#406517',
    valueLabel: '$/ft',
    valueStep: '0.01',
    canToggleVisibility: true,
  },
  { 
    id: 'vinyl_height_price', 
    title: 'Clear Vinyl Height Prices', 
    subtitle: 'Per linear foot',
    icon: Layers, 
    color: '#003365',
    valueLabel: '$/ft',
    valueStep: '0.01',
    canToggleVisibility: true,
  },
  { 
    id: 'vinyl_side_cost', 
    title: 'Clear Vinyl Side Costs', 
    subtitle: 'Per side by panel height',
    icon: Grid3X3, 
    color: '#003365',
    valueLabel: '$/side',
    valueStep: '0.01',
    canToggleVisibility: true,
  },
  { 
    id: 'mosquito_config', 
    title: 'Mosquito Configuration', 
    subtitle: 'Per-side cost and markup multiplier',
    icon: Settings, 
    color: '#406517',
    valueLabel: '',
    valueStep: '0.01',
    canToggleVisibility: false,
  },
  { 
    id: 'top_attachment_cost', 
    title: 'Top Attachment Costs', 
    subtitle: 'Per linear foot (shared by both products)',
    icon: Wrench, 
    color: '#B30158',
    valueLabel: '$/ft',
    valueStep: '0.01',
    canToggleVisibility: true,
  },
  { 
    id: 'mosquito_sides_multiplier', 
    title: 'Mosquito Sides Multiplier', 
    subtitle: 'Display sides to formula multiplier',
    icon: Calculator, 
    color: '#406517',
    valueLabel: 'multiplier',
    valueStep: '1',
    canToggleVisibility: true,
  },
  { 
    id: 'vinyl_sides_multiplier', 
    title: 'Vinyl Sides Multiplier', 
    subtitle: 'Display sides to formula multiplier',
    icon: Calculator, 
    color: '#003365',
    valueLabel: 'multiplier',
    valueStep: '1',
    canToggleVisibility: true,
  },
  { 
    id: 'mosquito_shipping', 
    title: 'Mosquito Shipping', 
    subtitle: 'Base fees, rates, and tracking surcharges',
    icon: Truck, 
    color: '#406517',
    valueLabel: '',
    valueStep: '0.0001',
    canToggleVisibility: false,
  },
  { 
    id: 'vinyl_shipping', 
    title: 'Clear Vinyl Shipping', 
    subtitle: 'Base fees, rates, and tracking surcharges',
    icon: Truck, 
    color: '#003365',
    valueLabel: '',
    valueStep: '0.0001',
    canToggleVisibility: false,
  },
]

// =============================================================================
// HELPERS
// =============================================================================

function formatValue(row: PricingRow): string {
  // Rates show as percentage
  if (row.pricing_key.endsWith('_rate')) {
    return `${(row.value * 100).toFixed(2)}%`
  }
  // Multipliers show as integer or decimal
  if (row.category.includes('multiplier') || row.pricing_key === 'markup_multiplier') {
    return row.value.toString()
  }
  // Everything else is dollar
  return `$${Number(row.value).toFixed(2)}`
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminInstantQuotePage() {
  const [rows, setRows] = useState<PricingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  // Tracks both value and admin_only edits: key = "value:{id}" or "admin_only:{id}"
  const [editedValues, setEditedValues] = useState<Record<string, number | boolean>>({})

  // Fetch pricing from database
  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/instant-quote')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch pricing')
      }
      
      setRows(result.rows || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing')
      console.error('Error fetching instant quote pricing:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPricing()
  }, [fetchPricing])

  // Handle value change
  const handleValueChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedValues(prev => ({ ...prev, [`value:${id}`]: numValue }))
    }
  }

  // Handle admin_only toggle
  const handleAdminOnlyChange = (id: string, checked: boolean) => {
    setEditedValues(prev => ({ ...prev, [`admin_only:${id}`]: checked }))
  }

  const getValue = (row: PricingRow): number => {
    return (editedValues[`value:${row.id}`] as number) ?? Number(row.value)
  }

  const getAdminOnly = (row: PricingRow): boolean => {
    const edited = editedValues[`admin_only:${row.id}`]
    return edited !== undefined ? (edited as boolean) : row.admin_only
  }

  const hasChanges = Object.keys(editedValues).length > 0
  const changeCount = Object.keys(editedValues).length

  const handleReset = () => {
    setEditedValues({})
    setEditMode(false)
    setSuccess(null)
    setError(null)
  }

  const handleSave = async () => {
    if (!hasChanges) return
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Build updates array with field type
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const [field, id] = key.split(':')
        return { id, field, value }
      })
      
      const response = await fetch('/api/admin/instant-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save prices')
      }
      
      await fetchPricing()
      
      setEditedValues({})
      setEditMode(false)
      setSuccess(`Successfully updated ${updates.length} value${updates.length > 1 ? 's' : ''}`)
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prices')
      console.error('Error saving instant quote pricing:', err)
    } finally {
      setSaving(false)
    }
  }

  // Group rows by category
  const rowsByCategory = CATEGORIES.map(cat => ({
    ...cat,
    rows: rows.filter(r => r.category === cat.id).sort((a, b) => a.sort_order - b.sort_order),
  }))

  if (loading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <Text className="text-gray-500 mt-4 !mb-0">Loading instant quote pricing...</Text>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href="/admin" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Text size="sm" className="text-gray-500 !mb-0">Back to Admin</Text>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#B30158]/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[#B30158]" />
              </div>
              <div>
                <Heading level={1} className="!mb-0">Instant Quote Pricing</Heading>
                <Text className="text-gray-500 !mb-0">
                  {rows.length} pricing parameters across {CATEGORIES.length} categories
                </Text>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchPricing} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {editMode ? (
                <>
                  <Button variant="outline" onClick={handleReset} disabled={saving}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    disabled={!hasChanges || saving}
                    onClick={handleSave}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  Edit Prices
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Success Message */}
        {success && (
          <Card variant="outlined" className="!p-4 !bg-green-50 !border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <Text className="text-green-700 !mb-0">{success}</Text>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-red-50 !border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <Text className="text-red-700 !mb-0">{error}</Text>
            </div>
          </Card>
        )}

        {/* Changes Indicator */}
        {editMode && hasChanges && (
          <Card variant="outlined" className="!p-4 !bg-amber-50 !border-amber-200">
            <div className="flex items-center justify-between">
              <Text className="text-amber-800 !mb-0">
                <span className="font-semibold">{changeCount}</span> unsaved change{changeCount > 1 ? 's' : ''}
              </Text>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Discard
              </Button>
            </div>
          </Card>
        )}

        {/* Formula Reference */}
        <Card variant="outlined" className="!p-4 !bg-gray-50 !border-gray-200">
          <Heading level={4} className="!mb-2 !text-sm text-gray-700">Formula Reference</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Text size="sm" className="!mb-1 font-medium text-[#406517]">Mosquito Curtains</Text>
              <Text size="xs" className="text-gray-600 !mb-0 font-mono">
                subtotal = (meshPrice * width + attachmentPrice * width + sidesMult * sideCost) * markup
              </Text>
            </div>
            <div>
              <Text size="sm" className="!mb-1 font-medium text-[#003365]">Clear Vinyl</Text>
              <Text size="xs" className="text-gray-600 !mb-0 font-mono">
                subtotal = heightPrice * width + attachmentPrice * width + sidesMult * sideCost
              </Text>
            </div>
            <div className="md:col-span-2">
              <Text size="sm" className="!mb-1 font-medium text-gray-700">Shipping (both)</Text>
              <Text size="xs" className="text-gray-600 !mb-0 font-mono">
                shipping = baseFee + (subtotal * rate) + (hasTracking ? trackSurcharge : 0)
              </Text>
            </div>
          </div>
        </Card>

        {/* Pricing Categories */}
        {rowsByCategory.map((category) => {
          const Icon = category.icon
          if (category.rows.length === 0) return null
          
          return (
            <Card key={category.id} variant="elevated" className="!p-6">
              <div className="flex items-center gap-3 mb-1">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div>
                  <Heading level={2} className="!mb-0">{category.title}</Heading>
                  <Text size="sm" className="text-gray-400 !mb-0">{category.subtitle}</Text>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-[1fr_140px] gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div>Parameter</div>
                  <div className="text-right">Value</div>
                </div>
                
                {/* Rows */}
                {category.rows.map((row, idx) => {
                  const isEdited = editedValues[`value:${row.id}`] !== undefined || editedValues[`admin_only:${row.id}`] !== undefined
                  const isAdminOnly = getAdminOnly(row)
                  
                  return (
                    <div 
                      key={row.id}
                      className={`px-4 py-3 grid grid-cols-[1fr_140px] gap-4 items-center ${
                        idx !== category.rows.length - 1 ? 'border-b border-gray-100' : ''
                      } ${isEdited ? 'bg-amber-50/50' : ''} ${isAdminOnly ? 'opacity-60' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Text className="font-medium text-gray-900 !mb-0">{row.display_label}</Text>
                          {editMode && category.canToggleVisibility ? (
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isAdminOnly}
                                onChange={(e) => handleAdminOnlyChange(row.id, e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#B30158] focus:ring-[#B30158]"
                              />
                              <span className="text-[10px] text-gray-500">admin only</span>
                            </label>
                          ) : (
                            isAdminOnly && (
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">admin</span>
                            )
                          )}
                        </div>
                        <Text size="sm" className="text-gray-400 !mb-0 font-mono text-xs">{row.pricing_key}</Text>
                      </div>
                      <div className="text-right">
                        {editMode ? (
                          <div className="flex items-center gap-1 justify-end">
                            {!row.pricing_key.endsWith('_rate') && !row.category.includes('multiplier') && row.pricing_key !== 'markup_multiplier' && (
                              <span className="text-gray-400 text-sm">$</span>
                            )}
                            <input
                              type="number"
                              step={category.valueStep}
                              value={getValue(row)}
                              onChange={(e) => handleValueChange(row.id, e.target.value)}
                              className="w-24 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#B30158] focus:border-transparent"
                            />
                            {row.pricing_key.endsWith('_rate') && (
                              <span className="text-gray-400 text-xs ml-1">
                                ({(getValue(row) * 100).toFixed(2)}%)
                              </span>
                            )}
                          </div>
                        ) : (
                          <Text className="font-semibold text-gray-900 !mb-0">
                            {formatValue(row)}
                          </Text>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}

        {/* Bottom Spacing */}
        <div className="h-8" />
      </Stack>
    </Container>
  )
}
