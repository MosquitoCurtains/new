/**
 * Types for WooCommerce Order Migration
 */

// =============================================================================
// RAW CSV ROW
// =============================================================================

export interface WooCommerceCSVRow {
  order_id: string
  order_number: string
  order_number_formatted: string
  date: string
  status: string
  shipping_total: string
  shipping_tax_total: string
  fee_total: string
  fee_tax_total: string
  tax_total: string
  discount_total: string
  order_total: string
  refunded_total: string
  order_currency: string
  payment_method: string
  shipping_method: string
  customer_id: string
  billing_first_name: string
  billing_last_name: string
  billing_company: string
  billing_email: string
  billing_phone: string
  billing_address_1: string
  billing_address_2: string
  billing_postcode: string
  billing_city: string
  billing_state: string
  billing_country: string
  shipping_first_name: string
  shipping_last_name: string
  shipping_address_1: string
  shipping_address_2: string
  shipping_postcode: string
  shipping_city: string
  shipping_state: string
  shipping_country: string
  shipping_company: string
  customer_note: string
  line_items: string
  shipping_items: string
  fee_items: string
  tax_items: string
  coupon_items: string
  refunds: string
  order_notes: string
  download_permissions_granted: string
  mc_product_flag: string
  checkout_add_on_c24c26e: string
  Salesperson: string
  'Snap tool': string
  'meta:mc_username': string
  'meta:_order_key': string
  'meta:_transaction_id': string
  'meta:_payment_method_title': string
  // Diagram attachment IDs
  'meta:_mc_files_0_mc_file': string
  'meta:_mc_files_1_mc_file': string
  'meta:_mc_files_2_mc_file': string
  'meta:mc_files_0_mc_file': string
  'meta:mc_files_1_mc_file': string
  'meta:mc_order_has_diagram': string
  // Attribution - UTM Parameters
  'meta:_wc_order_attribution_utm_source': string
  'meta:_wc_order_attribution_utm_medium': string
  'meta:_wc_order_attribution_utm_campaign': string
  'meta:_wc_order_attribution_utm_term': string
  'meta:_wc_order_attribution_utm_content': string
  'meta:_wc_order_attribution_utm_id': string
  'meta:_wc_order_attribution_utm_source_platform': string
  'meta:_wc_order_attribution_utm_creative_format': string
  'meta:_wc_order_attribution_utm_marketing_tactic': string
  // Attribution - Session/Source Data
  'meta:_wc_order_attribution_source_type': string
  'meta:_wc_order_attribution_referrer': string
  'meta:_wc_order_attribution_device_type': string
  'meta:_wc_order_attribution_user_agent': string
  'meta:_wc_order_attribution_session_entry': string
  'meta:_wc_order_attribution_session_pages': string
  'meta:_wc_order_attribution_session_count': string
  'meta:_wc_order_attribution_session_start_time': string
  // Allow any other meta fields
  [key: string]: string
}

// =============================================================================
// PARSED LINE ITEM
// =============================================================================

export interface ParsedLineItem {
  id: string
  name: string
  productId: string
  sku: string
  quantity: number
  subtotal: number
  subtotalTax: number
  total: number
  totalTax: number
  refunded: number
  refundedQty: number
  meta: Record<string, string>
  rawMeta: string
  
  // Classified item type
  itemType: 'panel' | 'track' | 'attachment' | 'raw_material' | 'tool' | 'accessory' | 'adjustment' | 'bundle' | 'unknown'
}

// =============================================================================
// PANEL SPECIFICATIONS (Extracted from meta)
// =============================================================================

export interface PanelSpec {
  panelNumber: number
  widthInches: number | null
  heightInches: number | null
  sqft: number | null
  meshType: string | null
  color: string | null
  topAttachment: string | null
  bottomAttachment: string | null
  hasDoor: boolean
  hasZipper: boolean
  hasNotch: boolean
  notchSpecs: string | null
  rawDimensionString: string
}

// =============================================================================
// PARSED ORDER
// =============================================================================

export interface ParsedOrder {
  // Identifiers
  wooOrderId: number
  orderNumber: string
  orderKey: string | null
  
  // Timestamps
  orderDate: Date
  
  // Status
  status: string
  
  // Customer
  email: string
  billingFirstName: string
  billingLastName: string
  billingPhone: string
  billingAddress1: string
  billingAddress2: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  
  shippingFirstName: string
  shippingLastName: string
  shippingAddress1: string
  shippingAddress2: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  
  // Financials
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  refunded: number
  
  // Payment
  paymentMethod: string
  paymentMethodTitle: string | null
  transactionId: string | null
  
  // Attribution - Salesperson
  salespersonUsername: string | null
  
  // Attribution - UTM Parameters
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
  utmId: string | null
  utmSourcePlatform: string | null
  utmCreativeFormat: string | null
  utmMarketingTactic: string | null
  
  // Attribution - Session Data
  sourceType: string | null
  referrer: string | null
  deviceType: string | null
  userAgent: string | null
  sessionEntry: string | null
  sessionPages: number | null
  sessionCount: number | null
  sessionStartTime: Date | null
  
  // Diagrams
  diagramAttachmentIds: number[]
  diagramUrls: string[]
  
  // Notes
  customerNote: string | null
  
  // Line Items
  lineItems: ParsedLineItem[]
  
  // Panel Specs (extracted from line items)
  panelSpecs: PanelSpec[]
  
  // Raw data for debugging
  rawLineItems: string
  rawCsvRow: Record<string, string>
}

// =============================================================================
// IMPORT STATISTICS
// =============================================================================

export interface ImportStats {
  totalOrders: number
  successfulOrders: number
  failedOrders: number
  totalLineItems: number
  lineItemsByType: Record<string, number>
  totalPanelSpecs: number
  ordersWithDiagrams: number
  uniqueCustomers: number
  uniqueSalespersons: Set<string>
  dateRange: {
    earliest: Date | null
    latest: Date | null
  }
  totalRevenue: number
  errors: Array<{ orderId: string; error: string }>
}

// =============================================================================
// DATABASE MODELS (for Supabase insert)
// =============================================================================

export interface LegacyOrderInsert {
  woo_order_id: number
  woo_order_key: string | null
  order_number: string
  order_date: string
  status: string
  email: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_address_1: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  subtotal: number | null
  tax: number | null
  shipping: number | null
  discount: number | null
  total: number | null
  payment_method: string | null
  payment_method_title: string | null
  transaction_id: string | null
  // Attribution - Salesperson
  salesperson_username: string | null
  // Attribution - UTM Parameters
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  utm_id: string | null
  utm_source_platform: string | null
  utm_creative_format: string | null
  utm_marketing_tactic: string | null
  // Attribution - Session Data
  source_type: string | null
  referrer: string | null
  device_type: string | null
  user_agent: string | null
  session_entry: string | null
  session_pages: number | null
  session_count: number | null
  session_start_time: string | null
  // Attachments
  diagram_attachment_id: number | null
  diagram_url: string | null
  // Raw Data
  raw_line_items: string | null
  raw_meta: string | null
  raw_csv_row: Record<string, string>
}

export interface LegacyLineItemInsert {
  legacy_order_id: string // UUID
  product_name: string
  product_sku: string | null
  quantity: number
  unit_price: number | null
  line_total: number | null
  item_type: string
  raw_meta: string | null
  parsed_meta: Record<string, string>
}

export interface LegacyPanelSpecInsert {
  legacy_line_item_id: string // UUID
  panel_number: number
  width_inches: number | null
  height_inches: number | null
  sqft: number | null
  mesh_type: string | null
  color: string | null
  top_attachment: string | null
  bottom_attachment: string | null
  has_door: boolean
  has_zipper: boolean
  has_notch: boolean
  notch_specs: string | null
  raw_dimension_string: string | null
}
