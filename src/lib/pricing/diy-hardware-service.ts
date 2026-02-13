/**
 * DIY Hardware Recommendation Rules Service
 *
 * Server-side service to load recommendation rules from the database.
 * These rules define WHAT hardware to recommend and HOW MANY based on
 * the customer's panel configuration. Pricing data comes from the
 * products table (managed at /admin/pricing), not from here.
 *
 * Used by the admin page (/admin/diy-hardware) and public API.
 * Includes a 5-minute cache to reduce DB calls.
 */

import { createAdminClient } from '@/lib/supabase/admin'

// =============================================================================
// TYPES
// =============================================================================

export interface DiyHardwareItem {
  id: string
  item_key: string
  category: string
  product_sku: string | null   // links to products.sku for pricing/images
  name: string
  description_template: string | null
  unit_label: string
  calc_rule: string
  calc_params: Record<string, number | string>
  color_match: string | null
  sort_order: number
  active: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
}

// =============================================================================
// CACHE (5-minute TTL)
// =============================================================================

let cachedItems: DiyHardwareItem[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000

export function invalidateDiyHardwareCache() {
  cachedItems = null
  cacheTimestamp = 0
}

// =============================================================================
// FETCH ALL ROWS (including inactive — used by admin UI)
// =============================================================================

export async function fetchDiyHardwareItems(): Promise<DiyHardwareItem[]> {
  if (cachedItems && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedItems
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('diy_wizard_hardware_recommendations')
    .select('*')
    .order('sort_order')
    .order('category')

  if (error) {
    console.error('[DiyHardware] Error fetching items:', error.message)
    return []
  }

  cachedItems = (data || []).map(row => ({
    ...row,
    calc_params: row.calc_params || {},
  })) as DiyHardwareItem[]
  cacheTimestamp = Date.now()
  return cachedItems
}

// =============================================================================
// FETCH ACTIVE ITEMS ONLY (for public/PanelBuilder use)
// =============================================================================

export async function fetchActiveDiyHardwareItems(): Promise<DiyHardwareItem[]> {
  const allItems = await fetchDiyHardwareItems()
  return allItems.filter(item => item.active)
}

// =============================================================================
// ADD NEW ITEM
// =============================================================================

export async function addDiyHardwareItem(
  item: Omit<DiyHardwareItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: DiyHardwareItem | null; error: string | null }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('diy_wizard_hardware_recommendations')
    .insert({
      item_key: item.item_key,
      category: item.category,
      product_sku: item.product_sku,
      name: item.name,
      description_template: item.description_template,
      unit_label: item.unit_label,
      calc_rule: item.calc_rule,
      calc_params: item.calc_params,
      color_match: item.color_match,
      sort_order: item.sort_order,
      active: item.active,
      admin_notes: item.admin_notes,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  invalidateDiyHardwareCache()
  return { data: data as DiyHardwareItem, error: null }
}

// =============================================================================
// DELETE ITEM
// =============================================================================

export async function deleteDiyHardwareItem(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('diy_wizard_hardware_recommendations')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  invalidateDiyHardwareCache()
  return { error: null }
}
