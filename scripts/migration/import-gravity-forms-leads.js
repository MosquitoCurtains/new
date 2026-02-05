/**
 * Import Gravity Forms Leads to Legacy Leads Table
 * 
 * Usage:
 *   node scripts/migration/import-gravity-forms-leads.js
 *   node scripts/migration/import-gravity-forms-leads.js --dry-run
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

// Load env
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Parse arguments
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')

// CSV files to import
const CSV_FILES = [
  '/Users/jvmacmini/Downloads/contact-us-71223-active-2026-02-05.csv',
  '/Users/jvmacmini/Downloads/contact-us-2026-02-05.csv',
  '/Users/jvmacmini/Downloads/fb-contact-us-32625-active-2026-02-05.csv'
]

// =============================================================================
// HELPERS
// =============================================================================

function normalizeInstallationMethod(value) {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower.includes('self')) return 'self_install'
  if (lower.includes('handyman') || lower.includes('contractor')) return 'contractor'
  return 'not_specified'
}

function normalizeInterest(value) {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower === 'both' || lower.includes('both')) return 'both'
  if (lower === 'vinyl' || lower.includes('vinyl') || lower.includes('clear')) return 'vinyl'
  if (lower === 'curtains' || lower.includes('curtain') || lower.includes('mesh') || lower.includes('netting')) return 'curtains'
  return value
}

function extractPhotos(value) {
  if (!value) return []
  return value.split(',')
    .map(url => url.trim())
    .filter(url => url.startsWith('http'))
}

function cleanPhone(value) {
  if (!value) return null
  return value.replace(/[^\d+]/g, '') || null
}

function parseDate(value) {
  if (!value) return null
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date.toISOString()
  } catch {
    return null
  }
}

function extractFbclid(url) {
  if (!url) return null
  const match = url.match(/fbclid=([^&]+)/)
  return match ? match[1] : null
}

function extractGclid(url) {
  if (!url) return null
  const match = url.match(/gclid=([^&]+)/)
  return match ? match[1] : null
}

function determineLeadSource(gclid, fbclid, sourceUrl) {
  if (gclid && gclid !== '') return 'google_ads'
  if (fbclid && fbclid !== '') return 'facebook_ads'
  if (sourceUrl) {
    if (sourceUrl.includes('fbclid=')) return 'facebook_ads'
    if (sourceUrl.includes('gclid=')) return 'google_ads'
  }
  return 'organic'
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

    let content = fs.readFileSync(csvFile, 'utf8')
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1)
    }
    const records = parse(content, {
      bom: true,
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
      const batch = records.slice(i, i + batchSize)
      const leads = []

      for (const record of batch) {
        // Extract entry ID to check for duplicates
        const entryId = parseInt(record['Entry Id']) || null
        if (!entryId) {
          fileSkipped++
          continue
        }
        
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

        // Extract tracking IDs
        const sourceUrl = record['Source Url']?.trim() || null
        const gclid = record['Google Click ID']?.trim() || extractGclid(sourceUrl) || null
        const fbclid = extractFbclid(sourceUrl) || null
        const leadSource = determineLeadSource(gclid, fbclid, sourceUrl)
        
        // Clean up landing page (remove query params for cleaner grouping)
        let landingPage = sourceUrl?.replace('https://www.mosquitocurtains.com', '') || null
        if (landingPage) {
          landingPage = landingPage.split('?')[0] || landingPage
        }

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
          message: message?.trim()?.substring(0, 5000) || null,
          installation_method: normalizeInstallationMethod(installMethod),
          has_photos: photos.length > 0,
          photo_urls: photos.length > 0 ? photos : null,
          worked_with_before: workedWithBefore,
          previous_salesperson: previousSalesperson?.trim() || null,
          source_url: sourceUrl,
          landing_page: landingPage,
          gclid: gclid,
          fbclid: fbclid,
          lead_source: leadSource,
          user_agent: record['User Agent']?.substring(0, 500) || null,
          user_ip: record['User IP']?.trim() || null
        }

        leads.push(lead)
      }

      if (leads.length === 0) continue

      if (DRY_RUN) {
        fileImported += leads.length
      } else {
        // Upsert to handle duplicates by entry_id
        const { error } = await supabase
          .from('legacy_leads')
          .upsert(leads, { 
            onConflict: 'gravity_form_entry_id',
            ignoreDuplicates: false
          })

        if (error) {
          console.error(`  Error in batch: ${error.message}`)
          fileErrors += leads.length
        } else {
          fileImported += leads.length
        }
      }

      // Progress indicator every 1000 records
      if ((i + batchSize) % 5000 === 0 || i + batchSize >= records.length) {
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
  if (!DRY_RUN && totalImported > 0) {
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
