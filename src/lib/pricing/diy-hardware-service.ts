/**
 * DIY Hardware Items Service
 * 
 * Server-side service to load DIY hardware recommendation items from the database.
 * Used by the admin page (/admin/diy-hardware) and public API.
 * Includes a 5-minute cache to reduce DB calls.
 * 
 * The PanelBuilder component uses the public API to get active hardware items,
 * then applies calculation rules client-side based on panel configurations.
 */

import { createAdminClient } from '@/lib/supabase/admin'

// =============================================================================
// TYPES
// =============================================================================

export interface DiyHardwareItem {
  id: string
  item_key: string
  category: string
  name: string
  description_template: string | null
  image_url: string | null
  product_url: string | null
  unit_label: string
  unit_price: number
  pack_quantity: number
  calc_rule: string
  calc_params: Record<string, number | string>
  color_match: string | null
  sort_order: number
  active: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
}

/** The fields that the admin can update */
export type DiyHardwareUpdateField =
  | 'name'
  | 'description_template'
  | 'image_url'
  | 'product_url'
  | 'unit_label'
  | 'unit_price'
  | 'pack_quantity'
  | 'calc_params'
  | 'color_match'
  | 'sort_order'
  | 'active'
  | 'admin_notes'

// =============================================================================
// CACHE (5-minute TTL)
// =============================================================================

let cachedItems: DiyHardwareItem[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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
    .from('diy_hardware_items')
    .select('*')
    .order('sort_order')
    .order('category')

  if (error) {
    console.error('[DiyHardware] Error fetching items:', error.message)
    return []
  }

  cachedItems = (data || []).map(row => ({
    ...row,
    unit_price: Number(row.unit_price),
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
    .from('diy_hardware_items')
    .insert({
      item_key: item.item_key,
      category: item.category,
      name: item.name,
      description_template: item.description_template,
      image_url: item.image_url,
      product_url: item.product_url,
      unit_label: item.unit_label,
      unit_price: item.unit_price,
      pack_quantity: item.pack_quantity,
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
    .from('diy_hardware_items')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  invalidateDiyHardwareCache()
  return { error: null }
}
