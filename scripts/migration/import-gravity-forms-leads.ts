/**
 * Import Gravity Forms Leads to Legacy Leads Table
 * 
 * Imports historical lead data from Gravity Forms CSV exports into legacy_leads table.
 * Keeps raw data separate from new leads captured by the Next.js app.
 * 
 * Usage:
 *   npx ts-node scripts/migration/import-gravity-forms-leads.ts
 * 
 * Options:
 *   --dry-run     Show what would be imported without making changes
 *   --file=PATH   Specify a single CSV file to import
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

// Load env
const envPath = path.join(__dirname, '../../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Parse arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const fileArg = args.find(a => a.startsWith('--file='))
const SINGLE_FILE = fileArg ? fileArg.split('=')[1] : null

// CSV files to import
const CSV_FILES = SINGLE_FILE ? [SINGLE_FILE] : [
  '/Users/jvmacmini/Downloads/contact-us-71223-active-2026-02-05.csv',
  '/Users/jvmacmini/Downloads/contact-us-2026-02-05.csv'
]

// =============================================================================
// HELPERS
// =============================================================================

function normalizeInstallationMethod(value: string | null): string | null {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower.includes('self')) return 'self_install'
  if (lower.includes('handyman') || lower.includes('contractor')) return 'contractor'
  return 'not_specified'
}

function normalizeInterest(value: string | null): string | null {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower === 'both' || lower.includes('both')) return 'both'
  if (lower === 'vinyl' || lower.includes('vinyl') || lower.includes('clear')) return 'vinyl'
  if (lower === 'curtains' || lower.includes('curtain') || lower.includes('mesh') || lower.includes('netting')) return 'curtains'
  return value
}

function extractPhotos(value: string | null): string[] {
  if (!value) return []
  // Photos are comma-separated URLs
  return value.split(',')
    .map(url => url.trim())
    .filter(url => url.startsWith('http'))
}

function cleanPhone(value: string | null): string | null {
  if (!value) return null
  // Remove non-numeric except + for international
  return value.replace(/[^\d+]/g, '') || null
}

function parseDate(value: string | null): string | null {
  if (!value) return null
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date.toISOString()
  } catch {
    return null
  }
}

// =============================================================================
// MAIN IMPORT
// =============================================================================

async function importLeads() {
  console.log('='.repeat(60))
  console.log('Gravity Forms Lead Import')
  console.log('='.repeat(60))
  console.log(`Dry run: ${DRY_RUN}`)
  console.log('')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  let totalImported = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const csvFile of CSV_FILES) {
    console.log(`\nProcessing: ${path.basename(csvFile)}`)
    
    if (!fs.existsSync(csvFile)) {
      console.log(`  File not found, skipping`)
      continue
    }

    const content = fs.readFileSync(csvFile, 'utf8')
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    })

    console.log(`  Found ${records.length} records`)

    // Process in batches
    const batchSize = 100
    let fileImported = 0
    let fileSkipped = 0
    let fileErrors = 0

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize) as Record<string, string>[]
      const leads: Record<string, unknown>[] = []

      for (const record of batch) {
        // Extract entry ID to check for duplicates
        const entryId = parseInt(record['Entry Id']) || null
        
        // Skip if no email
        const email = record['Email']?.trim()
        if (!email) {
          fileSkipped++
          continue
        }

        // Determine interest field (different column names in different forms)
        const interest = record["I'm interested in..."] || 
                        record["What product are you interested in?"] ||
                        null

        // Determine project type
        const projectType = record["My project type..."] || 
                           record["What best describes your project type?"] ||
                           null

        // Get photos
        const photoField = record["Please upload images showing your full project from the outside (no close-ups)."] || ''
        const photos = extractPhotos(photoField)

        // Get installation method
        const installMethod = record["How will this be installed?"] || null

        // Get message/note
        const message = record["Please tell us about your project."] ||
                       record["If you would like to add a note, please do so here."] ||
                       null

        // Worked with before
        const workedBefore = record["Have you worked with us before?"]
        const workedWithBefore = workedBefore?.toLowerCase().includes('yes') || false

        // Previous salesperson
        const previousSalesperson = record["Who have you worked with previously?"] || null

        const lead = {
          gravity_form_entry_id: entryId,
          entry_date: parseDate(record['Entry Date']) || new Date().toISOString(),
          date_updated: parseDate(record['Date Updated']),
          email: email.toLowerCase(),
          first_name: record['Name (First)']?.trim() || null,
          last_name: record['Name (Last)']?.trim() || null,
          phone: cleanPhone(record['Phone']),
          interest: normalizeInterest(interest),
          project_type: projectType?.trim() || null,
          message: message?.trim() || null,
          installation_method: normalizeInstallationMethod(installMethod),
          has_photos: photos.length > 0,
          photo_urls: photos.length > 0 ? photos : null,
          worked_with_before: workedWithBefore,
          previous_salesperson: previousSalesperson?.trim() || null,
          source_url: record['Source Url']?.trim() || null,
          landing_page: record['Source Url']?.replace('https://www.mosquitocurtains.com', '') || null,
          gclid: record['Google Click ID']?.trim() || null,
          user_agent: record['User Agent']?.substring(0, 500) || null,
          user_ip: record['User IP']?.trim() || null,
          raw_csv_row: record  // Store the entire raw row
        }

        leads.push(lead)
      }

      if (leads.length === 0) continue

      if (DRY_RUN) {
        fileImported += leads.length
        console.log(`  [DRY RUN] Would import ${leads.length} leads (batch ${Math.floor(i / batchSize) + 1})`)
      } else {
        // Upsert to handle duplicates by entry_id
        const { data, error } = await supabase
          .from('legacy_leads')
          .upsert(leads, { 
            onConflict: 'gravity_form_entry_id',
            ignoreDuplicates: false
          })
          .select('id')

        if (error) {
          console.error(`  Error in batch: ${error.message}`)
          fileErrors += leads.length
        } else {
          fileImported += leads.length
        }
      }

      // Progress indicator every 1000 records
      if ((i + batchSize) % 1000 === 0 || i + batchSize >= records.length) {
        console.log(`  Processed ${Math.min(i + batchSize, records.length)} / ${records.length}`)
      }
    }

    console.log(`  Imported: ${fileImported}, Skipped: ${fileSkipped}, Errors: ${fileErrors}`)
    totalImported += fileImported
    totalSkipped += fileSkipped
    totalErrors += fileErrors
  }

  console.log('\n' + '='.repeat(60))
  console.log('Import Complete!')
  console.log('='.repeat(60))
  console.log(`Total Imported: ${totalImported}`)
  console.log(`Total Skipped: ${totalSkipped}`)
  console.log(`Total Errors: ${totalErrors}`)

  // Show conversion stats if not dry run
  if (!DRY_RUN) {
    console.log('\nChecking lead-to-order conversion...')
    
    const { data: conversionStats } = await supabase
      .from('legacy_lead_by_landing_page')
      .select('*')
      .order('total_leads', { ascending: false })
      .limit(15)

    if (conversionStats && conversionStats.length > 0) {
      console.log('\nTop Landing Pages by Lead Volume:')
      console.log('Landing Page                              | Leads | Converted | Conv% | Revenue')
      console.log('------------------------------------------|-------|-----------|-------|------------')
      conversionStats.forEach(row => {
        console.log(
          (row.landing_page || '').substring(0, 42).padEnd(42) + '| ' +
          String(row.total_leads).padStart(5) + ' | ' +
          String(row.converted_leads).padStart(9) + ' | ' +
          String(row.conversion_rate_pct || 0).padStart(5) + '% | $' +
          Number(row.total_revenue || 0).toLocaleString().padStart(10)
        )
      })
    }

    // Also show interest breakdown
    const { data: interestStats } = await supabase
      .from('legacy_lead_by_interest')
      .select('*')
      .order('total_leads', { ascending: false })

    if (interestStats && interestStats.length > 0) {
      console.log('\nLeads by Interest Type:')
      console.log('Interest      | Leads | Converted | Conv% | Revenue')
      console.log('--------------|-------|-----------|-------|------------')
      interestStats.forEach(row => {
        console.log(
          (row.interest || '').substring(0, 14).padEnd(14) + '| ' +
          String(row.total_leads).padStart(5) + ' | ' +
          String(row.converted_leads).padStart(9) + ' | ' +
          String(row.conversion_rate_pct || 0).padStart(5) + '% | $' +
          Number(row.total_revenue || 0).toLocaleString().padStart(10)
        )
      })
    }
  }
}

// Run
importLeads().catch(console.error)
