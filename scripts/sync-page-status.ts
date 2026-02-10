/**
 * Sync page_status fields from the master CSV into site_pages.
 *
 * Requires migrations:
 *   20260210000001_add_duplicate_canonical_url.sql
 *   20260210000002_add_is_wordpress_original.sql
 *   20260210000003_page_status_fields.sql
 *
 * Operations:
 *   1. REBUILT rows   -> upsert with page_status='rebuilt', is_wordpress_original=true
 *   2. REDIRECTED rows -> upsert with page_status='redirected', is_wordpress_original=true
 *   3. Existing pages NOT in CSV:
 *      - If another page's duplicate_canonical_url points to this slug -> 'replacement'
 *      - Otherwise -> 'new'
 *      - Both get is_wordpress_original=false
 *
 * Safe to re-run.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zmtqborzhfhtoibsyldu.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// ---------------------------------------------------------------------------
// CSV Parser
// ---------------------------------------------------------------------------

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

interface CSVRow {
  original_post_id: number
  title: string
  redirect_to_url: string | null
  page_status: 'rebuilt' | 'redirected'
  original_wordpress_url: string // normalized, no trailing slash
}

function parseCSV(filePath: string): CSVRow[] {
  const csv = fs.readFileSync(filePath, 'utf-8')
  const lines = csv.split('\n').slice(1).filter(l => l.trim())
  const rows: CSVRow[] = []

  for (const line of lines) {
    const parts = parseCSVLine(line)
    const postId = parseInt(parts[0], 10)
    const title = parts[2] || ''
    const redirectTo = parts[3]?.trim() || null
    const status = parts[4]?.trim()
    const wpUrl = (parts[5] || '').replace(/\/$/, '') || '/'

    if (status !== 'REBUILT' && status !== 'REDIRECTED') continue

    rows.push({
      original_post_id: postId,
      title,
      redirect_to_url: status === 'REDIRECTED' ? (redirectTo?.replace(/\/$/, '') || '/') : null,
      page_status: status.toLowerCase() as 'rebuilt' | 'redirected',
      original_wordpress_url: wpUrl,
    })
  }

  return rows
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const csvPath = path.join('/Users/jordanbuckingham/Downloads', 'Checked URLS Mosquito Curtains New.csv')
  const csvRows = parseCSV(csvPath)
  console.log(`Parsed ${csvRows.length} CSV rows (${csvRows.filter(r => r.page_status === 'rebuilt').length} rebuilt, ${csvRows.filter(r => r.page_status === 'redirected').length} redirected)`)

  // 1. Check if required columns exist
  const { error: colCheck } = await supabase
    .from('site_pages')
    .select('page_status, original_post_id, redirect_to_url, is_wordpress_original, duplicate_canonical_url')
    .limit(1)

  if (colCheck) {
    console.error('\nMissing columns! Run these migrations first:')
    console.error('  20260210000001_add_duplicate_canonical_url.sql')
    console.error('  20260210000002_add_is_wordpress_original.sql')
    console.error('  20260210000003_page_status_fields.sql')
    console.error('\nError:', colCheck.message)
    process.exit(1)
  }

  // 2. Fetch all existing pages
  const { data: existingPages, error: fetchErr } = await supabase
    .from('site_pages')
    .select('id, slug, title, wordpress_url, duplicate_canonical_url, page_status, original_post_id, is_wordpress_original, migration_status')
    .order('slug')

  if (fetchErr) { console.error('Fetch error:', fetchErr.message); process.exit(1) }

  const slugMap = new Map(existingPages!.map(p => [p.slug.replace(/\/$/, '') || '/', p]))
  console.log(`Existing site_pages: ${existingPages!.length}`)

  // 3. Build set of canonical targets (slugs that are pointed to by duplicate_canonical_url)
  const canonicalTargets = new Set<string>()
  for (const page of existingPages!) {
    if (page.duplicate_canonical_url) {
      const target = page.duplicate_canonical_url.replace(/\/$/, '') || '/'
      canonicalTargets.add(target)
    }
  }
  console.log(`Canonical targets (replacement pages): ${canonicalTargets.size}`)

  // 4. Process CSV rows
  let updated = 0
  let inserted = 0
  let skipped = 0
  const errors: string[] = []

  // Track which slugs are covered by CSV
  const csvSlugs = new Set<string>()

  for (const row of csvRows) {
    const slug = row.original_wordpress_url
    csvSlugs.add(slug)

    const existing = slugMap.get(slug)

    if (existing) {
      // UPDATE existing row
      const updates: Record<string, unknown> = {
        page_status: row.page_status,
        original_post_id: row.original_post_id,
        is_wordpress_original: true,
        wordpress_url: slug, // consistent: the slug IS the original WP URL
      }
      if (row.redirect_to_url) {
        updates.redirect_to_url = row.redirect_to_url
      }
      if (row.page_status === 'redirected') {
        updates.migration_status = 'redirect_only'
      }

      const { error } = await supabase
        .from('site_pages')
        .update(updates as never)
        .eq('id', existing.id)

      if (error) {
        errors.push(`UPDATE ${slug}: ${error.message}`)
      } else {
        updated++
      }
    } else {
      // INSERT new row
      const newRow: Record<string, unknown> = {
        slug,
        title: row.title,
        wordpress_url: slug,
        page_status: row.page_status,
        original_post_id: row.original_post_id,
        is_wordpress_original: true,
        migration_status: row.page_status === 'redirected' ? 'redirect_only' : 'live',
        migration_priority: 0,
        review_status: row.page_status === 'redirected' ? 'complete' : 'pending',
      }
      if (row.redirect_to_url) {
        newRow.redirect_to_url = row.redirect_to_url
      }
      // Set page_type based on URL pattern
      if (slug.startsWith('/product/')) newRow.page_type = 'ecommerce'
      else if (slug.startsWith('/project-gallery/')) newRow.page_type = 'category'
      else if (slug.startsWith('/sales/') || slug.endsWith('-sales')) newRow.page_type = 'admin'
      else newRow.page_type = 'informational'

      const { error } = await supabase
        .from('site_pages')
        .insert(newRow as never)

      if (error) {
        errors.push(`INSERT ${slug}: ${error.message}`)
      } else {
        inserted++
      }
    }
  }

  console.log(`\nCSV sync: ${updated} updated, ${inserted} inserted`)

  // 5. Mark non-CSV pages as 'new' or 'replacement'
  let markedNew = 0
  let markedReplacement = 0

  for (const page of existingPages!) {
    const normalizedSlug = page.slug.replace(/\/$/, '') || '/'
    if (csvSlugs.has(normalizedSlug)) continue // Already handled by CSV

    // Determine status
    const isReplacement = canonicalTargets.has(normalizedSlug)
    const newStatus = isReplacement ? 'replacement' : 'new'

    // Only update if different from current
    if (page.page_status === newStatus && page.is_wordpress_original === false) continue

    const { error } = await supabase
      .from('site_pages')
      .update({
        page_status: newStatus,
        is_wordpress_original: false,
      } as never)
      .eq('id', page.id)

    if (error) {
      errors.push(`MARK ${normalizedSlug} as ${newStatus}: ${error.message}`)
    } else {
      if (isReplacement) markedReplacement++
      else markedNew++
    }
  }

  console.log(`Non-CSV pages: ${markedNew} marked 'new', ${markedReplacement} marked 'replacement'`)

  // 6. Final count
  const { count } = await supabase
    .from('site_pages')
    .select('*', { count: 'exact', head: true })

  console.log(`\nFinal site_pages count: ${count}`)

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`)
    errors.slice(0, 20).forEach(e => console.log(`  ${e}`))
    if (errors.length > 20) console.log(`  ... and ${errors.length - 20} more`)
  }

  // 7. Summary by page_status
  for (const status of ['rebuilt', 'redirected', 'new', 'replacement']) {
    const { count: c } = await supabase
      .from('site_pages')
      .select('*', { count: 'exact', head: true })
      .eq('page_status', status)
    console.log(`  ${status}: ${c}`)
  }
}

main()
