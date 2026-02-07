'use client'

/**
 * Admin Pricing
 * 
 * View and manage product pricing from the database.
 * Shows calculations for multiplier-based prices.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  ArrowLeft, 
  Package, 
  Layers, 
  Wrench, 
  Grid3X3,
  Sparkles,
  Save,
  RotateCcw,
  Calculator,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Container, Stack, Grid, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface PriceItem {
  id: string
  category: string
  label: string
  value: number
  unit: string
  description: string | null
  is_multiplier: boolean
  base_price_id: string | null
}

interface CategoryConfig {
  id: string
  title: string
  icon: typeof DollarSign
  color: string
}

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

const CATEGORIES: CategoryConfig[] = [
  { id: 'mesh_panels', title: 'Mesh Panels', icon: Layers, color: '#406517' },
  { id: 'vinyl_panels', title: 'Clear Vinyl Panels', icon: Sparkles, color: '#003365' },
  { id: 'track_hardware', title: 'Track Hardware', icon: Grid3X3, color: '#B30158' },
  { id: 'attachments', title: 'Attachment Items', icon: Wrench, color: '#FFA501' },
  { id: 'accessories', title: 'Accessories', icon: Package, color: '#6B7280' },
]

// =============================================================================
// HELPERS
// =============================================================================

function formatPrice(value: number, unit: string): string {
  if (unit === 'x') {
    return `${value}x`
  }
  return `$${value.toFixed(2)}${unit}`
}

function calculateDerivedPrice(item: PriceItem, allPrices: PriceItem[]): number | null {
  if (!item.is_multiplier || !item.base_price_id) return null
  
  const baseItem = allPrices.find(p => p.id === item.base_price_id)
  if (!baseItem) return null
  
  return baseItem.value * item.value
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminPricingPage() {
  const [prices, setPrices] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({})

  // Fetch prices from database
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/pricing')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch prices')
      }
      
      setPrices(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing')
      console.error('Error fetching prices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Handle price change in edit mode
  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedPrices(prev => ({ ...prev, [id]: numValue }))
    }
  }

  // Get display value (edited or original)
  const getDisplayValue = (item: PriceItem): number => {
    return editedPrices[item.id] ?? item.value
  }

  // Get prices with edited values applied (for calculations)
  const getPricesWithEdits = (): PriceItem[] => {
    return prices.map(p => ({
      ...p,
      value: editedPrices[p.id] ?? p.value
    }))
  }

  const hasChanges = Object.keys(editedPrices).length > 0

  // Reset edits
  const handleReset = () => {
    setEditedPrices({})
    setEditMode(false)
    setSuccess(null)
    setError(null)
  }

  // Save changes to database
  const handleSave = async () => {
    if (!hasChanges) return
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const updates = Object.entries(editedPrices).map(([id, value]) => ({ id, value }))
      
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save prices')
      }
      
      // Refresh prices from database
      await fetchPrices()
      
      setEditedPrices({})
      setEditMode(false)
      setSuccess(`Successfully updated ${updates.length} price${updates.length > 1 ? 's' : ''}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prices')
      console.error('Error saving prices:', err)
    } finally {
      setSaving(false)
    }
  }

  // Group prices by category
  const pricesByCategory = CATEGORIES.map(cat => ({
    ...cat,
    items: prices.filter(p => p.category === cat.id)
  }))

  if (loading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <Text className="text-gray-500 mt-4 !mb-0">Loading pricing...</Text>
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
              <div className="w-12 h-12 rounded-xl bg-[#406517]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#406517]" />
              </div>
              <div>
                <Heading level={1} className="!mb-0">Product Pricing</Heading>
                <Text className="text-gray-500 !mb-0">
                  View and manage all product prices
                </Text>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchPrices} disabled={loading}>
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
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-amber-600" />
                </div>
                <Text className="text-amber-800 !mb-0">
                  <span className="font-semibold">{Object.keys(editedPrices).length}</span> unsaved change{Object.keys(editedPrices).length > 1 ? 's' : ''}
                </Text>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Discard
              </Button>
            </div>
          </Card>
        )}

        {/* Pricing Categories */}
        {pricesByCategory.map((category) => {
          const Icon = category.icon
          if (category.items.length === 0) return null
          
          return (
            <Card key={category.id} variant="elevated" className="!p-6">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <Heading level={2} className="!mb-0">{category.title}</Heading>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-[1fr_120px] md:grid-cols-[1fr_140px_180px] gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div>Item</div>
                  <div className="text-right">Price</div>
                  <div className="hidden md:block text-right">Calculated</div>
                </div>
                
                {/* Table Rows */}
                {category.items.map((item, idx) => {
                  const pricesWithEdits = getPricesWithEdits()
                  const derivedPrice = calculateDerivedPrice(
                    { ...item, value: getDisplayValue(item) }, 
                    pricesWithEdits
                  )
                  const baseItem = item.base_price_id 
                    ? pricesWithEdits.find(p => p.id === item.base_price_id) 
                    : null
                  
                  return (
                    <div 
                      key={item.id}
                      className={`px-4 py-3 grid grid-cols-[1fr_120px] md:grid-cols-[1fr_140px_180px] gap-4 items-center ${
                        idx !== category.items.length - 1 ? 'border-b border-gray-100' : ''
                      } ${editedPrices[item.id] !== undefined ? 'bg-amber-50/50' : ''}`}
                    >
                      <div>
                        <Text className="font-medium text-gray-900 !mb-0">{item.label}</Text>
                        {item.description && (
                          <Text size="sm" className="text-gray-500 !mb-0">{item.description}</Text>
                        )}
                        {item.is_multiplier && baseItem && (
                          <Text size="sm" className="text-blue-600 !mb-0">
                            Based on: {baseItem.label}
                          </Text>
                        )}
                      </div>
                      <div className="text-right">
                        {editMode ? (
                          <div className="flex items-center gap-1 justify-end">
                            {item.unit !== 'x' && (
                              <span className="text-gray-400 text-sm">$</span>
                            )}
                            <input
                              type="number"
                              step="0.01"
                              value={getDisplayValue(item)}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              className="w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                            />
                            {item.unit === 'x' && (
                              <span className="text-gray-400 text-sm">x</span>
                            )}
                          </div>
                        ) : (
                          <Text className="font-semibold text-gray-900 !mb-0">
                            {formatPrice(getDisplayValue(item), item.unit)}
                          </Text>
                        )}
                      </div>
                      <div className="hidden md:block text-right">
                        {derivedPrice !== null ? (
                          <div className="flex items-center gap-2 justify-end">
                            <Calculator className="w-4 h-4 text-blue-500" />
                            <Text className="font-semibold text-blue-600 !mb-0">
                              ${derivedPrice.toFixed(2)}{baseItem?.unit || ''}
                            </Text>
                          </div>
                        ) : (
                          <Text size="sm" className="text-gray-400 !mb-0">—</Text>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}

        {/* Pricing History Link */}
        <Card variant="outlined" className="!p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <Text className="font-medium text-gray-900 !mb-0">Pricing History</Text>
                <Text size="sm" className="text-gray-500 !mb-0">
                  All price changes are logged automatically
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </Stack>
    </Container>
  )
}
