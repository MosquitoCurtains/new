'use client'

/**
 * Admin Pricing
 * 
 * View and manage product pricing from the database.
 * Shows products grouped by category with inline editing.
 * For configurable products, shows their options with prices and fees.
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
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Scissors,
  HelpCircle,
} from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface ProductItem {
  id: string
  sku: string
  name: string
  description: string | null
  product_type: string
  base_price: number
  unit: string
  pack_quantity: number
  product_category: string | null
  category_section: string | null
  category_order: number
  admin_only: boolean
  is_active: boolean
}

interface OptionItem {
  id: string
  product_id: string
  option_name: string
  option_value: string
  display_label: string
  price: number | null
  fee: number | null
  pricing_key: string | null
  admin_only: boolean
  sort_order: number
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
  { id: 'Panels', title: 'Panels', icon: Layers, color: '#406517' },
  { id: 'Raw Netting Panels', title: 'Raw Netting Panels', icon: Scissors, color: '#0D9488' },
  { id: 'Track Hardware', title: 'Track Hardware', icon: Grid3X3, color: '#003365' },
  { id: 'Attachment Hardware', title: 'Attachment Hardware', icon: Wrench, color: '#B30158' },
  { id: 'Accessories', title: 'Accessories', icon: Package, color: '#FFA501' },
  { id: 'Tools', title: 'Tools', icon: Sparkles, color: '#6B7280' },
  { id: 'Raw Materials', title: 'Raw Materials', icon: Package, color: '#059669' },
  { id: 'Adjustments', title: 'Adjustments', icon: DollarSign, color: '#DC2626' },
]

// =============================================================================
// HELPERS
// =============================================================================

function formatPrice(value: number, unit: string): string {
  if (unit === '/ft') return `$${value.toFixed(2)}/ft`
  if (unit === '/panel') return `$${value.toFixed(2)}/panel`
  return `$${value.toFixed(2)}`
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminPricingPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [options, setOptions] = useState<OptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedValues, setEditedValues] = useState<Record<string, number | boolean>>({})
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())

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
      
      setProducts(result.products || [])
      setOptions(result.options || [])
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
  const handleProductPriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedValues(prev => ({ ...prev, [`product:${id}:base_price`]: numValue }))
    }
  }

  const handleOptionPriceChange = (id: string, field: 'price' | 'fee', value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedValues(prev => ({ ...prev, [`option:${id}:${field}`]: numValue }))
    }
  }

  const handleProductAdminOnlyChange = (id: string, checked: boolean) => {
    setEditedValues(prev => ({ ...prev, [`product:${id}:admin_only`]: checked }))
  }

  const handleProductIsActiveChange = (id: string, checked: boolean) => {
    setEditedValues(prev => ({ ...prev, [`product:${id}:is_active`]: checked }))
  }

  const handleOptionAdminOnlyChange = (id: string, checked: boolean) => {
    setEditedValues(prev => ({ ...prev, [`option:${id}:admin_only`]: checked }))
  }

  const getProductPrice = (product: ProductItem): number => {
    return (editedValues[`product:${product.id}:base_price`] as number) ?? product.base_price
  }

  const getProductAdminOnly = (product: ProductItem): boolean => {
    const edited = editedValues[`product:${product.id}:admin_only`]
    return edited !== undefined ? (edited as boolean) : product.admin_only
  }

  const getProductIsActive = (product: ProductItem): boolean => {
    const edited = editedValues[`product:${product.id}:is_active`]
    return edited !== undefined ? (edited as boolean) : product.is_active
  }

  const getOptionPrice = (option: OptionItem): number | null => {
    const edited = editedValues[`option:${option.id}:price`]
    return edited !== undefined ? (edited as number) : option.price
  }

  const getOptionFee = (option: OptionItem): number | null => {
    const edited = editedValues[`option:${option.id}:fee`]
    return edited !== undefined ? (edited as number) : option.fee
  }

  const getOptionAdminOnly = (option: OptionItem): boolean => {
    const edited = editedValues[`option:${option.id}:admin_only`]
    return edited !== undefined ? (edited as boolean) : option.admin_only
  }

  const hasChanges = Object.keys(editedValues).length > 0

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
      
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const [type, id, field] = key.split(':')
        return { type, id, field, value }
      })
      
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save prices')
      }
      
      await fetchPrices()
      
      setEditedValues({})
      setEditMode(false)
      setSuccess(`Successfully updated ${updates.length} price${updates.length > 1 ? 's' : ''}`)
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prices')
      console.error('Error saving prices:', err)
    } finally {
      setSaving(false)
    }
  }

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts(prev => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  // Group products by category
  const knownCategoryIds = new Set(CATEGORIES.map(c => c.id))
  const productsByCategory = CATEGORIES.map(cat => ({
    ...cat,
    products: products.filter(p => p.product_category === cat.id),
  }))
  // Catch-all: products whose category doesn't match any known category
  const uncategorized = products.filter(p => !knownCategoryIds.has(p.product_category || ''))
  if (uncategorized.length > 0) {
    productsByCategory.push({
      id: '__uncategorized__',
      title: 'Uncategorized',
      icon: HelpCircle,
      color: '#9CA3AF',
      products: uncategorized,
    })
  }

  // Group options by product_id
  const optionsByProduct: Record<string, OptionItem[]> = {}
  for (const opt of options) {
    if (!optionsByProduct[opt.product_id]) optionsByProduct[opt.product_id] = []
    optionsByProduct[opt.product_id].push(opt)
  }

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
                  {products.length} products ({products.filter(p => p.is_active).length} active, {products.filter(p => !p.is_active).length} inactive), {options.length} options
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
              <Text className="text-amber-800 !mb-0">
                <span className="font-semibold">{Object.keys(editedValues).length}</span> unsaved change{Object.keys(editedValues).length > 1 ? 's' : ''}
              </Text>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Discard
              </Button>
            </div>
          </Card>
        )}

        {/* Pricing Categories */}
        {productsByCategory.map((category) => {
          const Icon = category.icon
          if (category.products.length === 0) return null

          // Group products by section within category
          const sections = new Map<string, ProductItem[]>()
          for (const p of category.products) {
            const section = p.category_section || 'General'
            if (!sections.has(section)) sections.set(section, [])
            sections.get(section)!.push(p)
          }
          
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
                <Text size="sm" className="text-gray-400 !mb-0">({category.products.length})</Text>
              </div>
              
              {Array.from(sections.entries()).map(([sectionName, sectionProducts]) => (
                <div key={sectionName} className="mb-6 last:mb-0">
                  {sections.size > 1 && (
                    <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 !mb-2">{sectionName}</Text>
                  )}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-[1fr_100px_80px] gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <div>Product</div>
                      <div className="text-right">Price</div>
                      <div className="text-right">Pack</div>
                    </div>
                    
                    {/* Product Rows */}
                    {sectionProducts.map((product, idx) => {
                      const productOptions = optionsByProduct[product.id] || []
                      const hasOptions = productOptions.length > 0
                      const isExpanded = expandedProducts.has(product.id)
                      const isActive = getProductIsActive(product)
                      const hasEdits = editedValues[`product:${product.id}:base_price`] !== undefined
                        || editedValues[`product:${product.id}:admin_only`] !== undefined
                        || editedValues[`product:${product.id}:is_active`] !== undefined
                      
                      return (
                        <div key={product.id}>
                          <div 
                            className={`px-4 py-3 grid grid-cols-[1fr_100px_80px] gap-4 items-center ${
                              idx !== sectionProducts.length - 1 || isExpanded ? 'border-b border-gray-100' : ''
                            } ${hasEdits ? 'bg-amber-50/50' : ''} ${!isActive ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              {hasOptions && (
                                <button
                                  onClick={() => toggleProductExpanded(product.id)}
                                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                              )}
                              <div>
                                <Text className={`font-medium !mb-0 ${isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{product.name}</Text>
                                <Text size="sm" className="text-gray-400 !mb-0 font-mono text-xs">{product.sku}</Text>
                              </div>
                              {editMode ? (
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={isActive}
                                      onChange={(e) => handleProductIsActiveChange(product.id, e.target.checked)}
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#406517] focus:ring-[#406517]"
                                    />
                                    <span className="text-[10px] text-gray-500">active</span>
                                  </label>
                                  <label className="flex items-center gap-1 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={getProductAdminOnly(product)}
                                      onChange={(e) => handleProductAdminOnlyChange(product.id, e.target.checked)}
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#003365] focus:ring-[#003365]"
                                    />
                                    <span className="text-[10px] text-gray-500">admin only</span>
                                  </label>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {!isActive && (
                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">inactive</span>
                                  )}
                                  {product.admin_only && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">admin</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {editMode ? (
                                <div className="flex items-center gap-1 justify-end">
                                  <span className="text-gray-400 text-sm">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={getProductPrice(product)}
                                    onChange={(e) => handleProductPriceChange(product.id, e.target.value)}
                                    className="w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                                  />
                                </div>
                              ) : (
                                <Text className="font-semibold text-gray-900 !mb-0">
                                  {formatPrice(getProductPrice(product), product.unit)}
                                </Text>
                              )}
                            </div>
                            <div className="text-right">
                              {product.pack_quantity > 1 ? (
                                <Text size="sm" className="text-gray-500 !mb-0">x{product.pack_quantity}</Text>
                              ) : (
                                <Text size="sm" className="text-gray-400 !mb-0">&mdash;</Text>
                              )}
                            </div>
                          </div>
                          
                          {/* Expanded Options */}
                          {hasOptions && isExpanded && (
                            <div className="bg-gray-50/50 border-b border-gray-100">
                              {/* Group options by option_name */}
                              {Array.from(new Set(productOptions.map(o => o.option_name))).map(optName => {
                                const nameOptions = productOptions.filter(o => o.option_name === optName)
                                const hasPrice = nameOptions.some(o => (o.price != null && o.price > 0) || (o.fee != null && o.fee > 0))
                                const hasQuoteNeeded = nameOptions.some(o => o.price === null)
                                
                                return (
                                  <div key={optName} className="px-4 py-2 ml-8 border-b border-gray-100 last:border-b-0">
                                    <Text size="sm" className="text-gray-500 font-medium uppercase tracking-wider !mb-1">{optName.replace(/_/g, ' ')}</Text>
                                    {nameOptions.map(opt => {
                                      const priceVal = getOptionPrice(opt)
                                      const feeVal = getOptionFee(opt)
                                      const isQuoteNeeded = priceVal === null
                                      return (
                                        <div key={opt.id} className={`flex items-center justify-between py-1 ${editedValues[`option:${opt.id}:admin_only`] !== undefined ? 'bg-amber-50/50 -mx-2 px-2 rounded' : ''}`}>
                                          <div className="flex items-center gap-2">
                                            <Text size="sm" className="text-gray-700 !mb-0">{opt.display_label}</Text>
                                            {opt.pricing_key && (
                                              <Text size="sm" className="text-gray-400 font-mono text-[10px] !mb-0">{opt.pricing_key}</Text>
                                            )}
                                            {editMode ? (
                                              <label className="flex items-center gap-1 cursor-pointer select-none">
                                                <input
                                                  type="checkbox"
                                                  checked={getOptionAdminOnly(opt)}
                                                  onChange={(e) => handleOptionAdminOnlyChange(opt.id, e.target.checked)}
                                                  className="w-3 h-3 rounded border-gray-300 text-[#003365] focus:ring-[#003365]"
                                                />
                                                <span className="text-[10px] text-gray-500">admin only</span>
                                              </label>
                                            ) : (
                                              opt.admin_only && (
                                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">admin</span>
                                              )
                                            )}
                                          </div>
                                          {isQuoteNeeded && !editMode ? (
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Quote needed</span>
                                          ) : (hasPrice || hasQuoteNeeded || editMode) ? (
                                            <div className="flex items-center gap-3">
                                              {((priceVal != null && priceVal > 0) || editMode) && (
                                                <div className="flex items-center gap-1">
                                                  <Text size="sm" className="text-gray-400 !mb-0">rate:</Text>
                                                  {editMode ? (
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      value={priceVal ?? ''}
                                                      placeholder="Quote"
                                                      onChange={(e) => handleOptionPriceChange(opt.id, 'price', e.target.value)}
                                                      className="w-16 px-1.5 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                                                    />
                                                  ) : (
                                                    <Text size="sm" className="font-medium text-gray-900 !mb-0">${(priceVal ?? 0).toFixed(2)}</Text>
                                                  )}
                                                </div>
                                              )}
                                              {((feeVal != null && feeVal > 0) || (editMode && optName === 'size')) && (
                                                <div className="flex items-center gap-1">
                                                  <Text size="sm" className="text-gray-400 !mb-0">fee:</Text>
                                                  {editMode ? (
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      value={feeVal ?? 0}
                                                      onChange={(e) => handleOptionPriceChange(opt.id, 'fee', e.target.value)}
                                                      className="w-16 px-1.5 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                                                    />
                                                  ) : (
                                                    <Text size="sm" className="font-medium text-gray-900 !mb-0">${(feeVal ?? 0).toFixed(2)}</Text>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ) : null}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </Card>
          )
        })}

        {/* Bottom Spacing */}
        <div className="h-8" />
      </Stack>
    </Container>
  )
}
