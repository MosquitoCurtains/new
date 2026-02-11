/**
 * Orders Served Count Constants
 * 
 * Central location for the "orders served" count displayed across the site.
 * 
 * UPDATE THIS VALUE when launching or periodically syncing with the database.
 * This is used for SSR/static generation. The client-side hook fetches live values.
 * 
 * To get the current value from the database, run:
 * SELECT value->>'count' FROM site_settings WHERE key = 'orders_served_count';
 */

// The current orders served count (update this when launching)
export const ORDERS_SERVED_COUNT = 92035

// Formatted versions for common display patterns
export const ORDERS_SERVED_FORMATTED = `${ORDERS_SERVED_COUNT.toLocaleString('en-US')}+`

// Common display strings
export const ORDERS_SERVED_STRINGS = {
  // "92,035+"
  short: ORDERS_SERVED_FORMATTED,
  
  // "92,035+ customers"
  customers: `${ORDERS_SERVED_FORMATTED} customers`,
  
  // "92,035+ happy customers"
  happyCustomers: `${ORDERS_SERVED_FORMATTED} happy customers`,
  
  // "Over 92,035 customers"
  overCustomers: `Over ${ORDERS_SERVED_COUNT.toLocaleString('en-US')} customers`,
  
  // "Trusted by 92,035+ customers since 2004"
  trustedBy: `Trusted by ${ORDERS_SERVED_FORMATTED} customers since 2004`,
  
  // "Why 92,035+ Customers Choose Us"
  whyChooseUs: `Why ${ORDERS_SERVED_FORMATTED} Customers Choose Us`,
  
  // "Over 92,035 happy clients"
  happyClients: `Over ${ORDERS_SERVED_COUNT.toLocaleString('en-US')} happy clients`,

  // "92,035+ Happy Clients Since 2004" (for ClientReviewsTemplate header)
  happyClientsSince2004: `${ORDERS_SERVED_FORMATTED} Happy Clients Since 2004`,
  
  // For metadata descriptions
  metaDescription: `Over ${ORDERS_SERVED_COUNT.toLocaleString('en-US')} happy clients since 2004`,
} as const

// Type for display strings
export type OrdersServedStringKey = keyof typeof ORDERS_SERVED_STRINGS

/**
 * Get formatted orders served string
 * @param key - The string key to get
 * @returns The formatted string
 */
export function getOrdersServedString(key: OrdersServedStringKey): string {
  return ORDERS_SERVED_STRINGS[key]
}

/**
 * Format a custom orders served string
 * @param template - Template string with {count} placeholder
 * @param count - Optional count override (defaults to ORDERS_SERVED_COUNT)
 * @returns Formatted string
 */
export function formatOrdersServedTemplate(
  template: string, 
  count: number = ORDERS_SERVED_COUNT
): string {
  const formatted = count.toLocaleString('en-US')
  return template
    .replace('{count}', formatted)
    .replace('{count}+', `${formatted}+`)
}
