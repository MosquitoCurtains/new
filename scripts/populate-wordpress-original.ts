/**
 * Populate is_wordpress_original from the master CSV.
 *
 * What it does:
 *  1. Parses "Checked URLS Mosquito Curtains.csv" — every URL in it was a WordPress original
 *  2. For each site_pages row whose slug matches a CSV URL, sets is_wordpress_original = TRUE
 *  3. For any matching page missing its wordpress_url, backfills it with the CSV URL
 *
 * Safe to re-run — uses upsert-style updates.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zmtqborzhfhtoibsyldu.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Simple CSV parser that handles quoted fields with commas
function parseCSVLine(line: string): string[] {
  const parts: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue }
    current += ch
  }
  parts.push(current.trim())
  return parts
}

async function main() {
  // 1. Parse CSV
  const csvPath = path.join('/Users/jordanbuckingham/Downloads', 'Checked URLS Mosquito Curtains.csv')
  const csv = fs.readFileSync(csvPath, 'utf-8')
  const lines = csv.split('\n').slice(1).filter(l => l.trim())

  // Build a map: normalized slug -> { title, instruction, fullUrl }
  const csvMap = new Map<string, { title: string; instruction: string; fullUrl: string }>()
  for (const line of lines) {
    const parts = parseCSVLine(line)
    const title = parts[1] || ''
    const instruction = parts[3] || '' // BUILD, DELETE, REDIRECT
    const urlCol = parts[4] || ''      // e.g. /plan-screen-porch/
    const fullUrl = parts[5] || ''     // e.g. https://mosquitocurtains.com/plan-screen-porch/

    // Normalize: strip trailing slash (keep "/" for home)
    const normalized = urlCol.replace(/\/$/, '') || '/'
    csvMap.set(normalized, { title, instruction, fullUrl })
  }

  console.log(`Parsed ${csvMap.size} URLs from CSV`)

  // 2. Fetch all site_pages (don't select is_wordpress_original in case migration hasn't run)
  const { data: pages, error } = await supabase
    .from('site_pages')
    .select('id, slug, title, wordpress_url')
    .order('slug')

  if (error) { console.error('DB error:', error.message); process.exit(1) }
  console.log(`Found ${pages!.length} pages in site_pages`)

  // 3. Check if column exists by trying a small update
  const testPage = pages![0]
  const { error: colCheck } = await supabase
    .from('site_pages')
    .update({ is_wordpress_original: false } as never)
    .eq('id', testPage.id)

  if (colCheck && colCheck.message?.includes('does not exist')) {
    console.error('\n*** Column is_wordpress_original does not exist yet! ***')
    console.error('Run migration first: supabase/migrations/20260210000002_add_is_wordpress_original.sql')
    console.error('Then re-run this script.\n')
    process.exit(1)
  }

  // 4. Match and update
  let markedOriginal = 0
  let backfilledWpUrl = 0
  const errors: string[] = []

  for (const page of pages!) {
    const normalizedSlug = page.slug.replace(/\/$/, '') || '/'
    const csvEntry = csvMap.get(normalizedSlug)

    if (!csvEntry) continue // Not a WordPress original

    const updates: Record<string, unknown> = {
      is_wordpress_original: true,
    }

    // Backfill wordpress_url if missing
    if (!page.wordpress_url) {
      updates.wordpress_url = normalizedSlug // The slug IS the wordpress URL
      backfilledWpUrl++
    }

    const { error: updateError } = await supabase
      .from('site_pages')
      .update(updates as never)
      .eq('id', page.id)

    if (updateError) {
      errors.push(`Failed to update ${page.slug}: ${updateError.message}`)
    } else {
      markedOriginal++
    }
  }

  console.log('\n=== RESULTS ===')
  console.log(`Marked as WordPress original: ${markedOriginal}`)
  console.log(`Backfilled wordpress_url: ${backfilledWpUrl}`)
  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`)
    errors.forEach(e => console.log(`  ${e}`))
  }

  // 4. Summary: pages NOT in CSV (new pages)
  const newPages = pages!.filter(p => {
    const n = p.slug.replace(/\/$/, '') || '/'
    return !csvMap.has(n)
  })
  console.log(`\nNew pages (not WordPress originals): ${newPages.length}`)
}

main()
