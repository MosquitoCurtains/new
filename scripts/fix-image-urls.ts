/**
 * fix-image-urls.ts
 *
 * Scans all .tsx files under src/ for static.mosquitocurtains.com image URLs
 * with WordPress resolution suffixes, normalizes them, validates the new URL
 * returns HTTP 200, and rewrites the files.
 *
 * Usage: npx tsx scripts/fix-image-urls.ts [--dry-run]
 */

import * as fs from 'fs'
import * as path from 'path'

// Inline the normalizeImageUrl logic to avoid import issues in scripts context
const USER_DIMENSIONS = new Set(['400x300', '1200x900'])

function normalizeImageUrl(url: string): string {
  if (!url.includes('static.mosquitocurtains.com')) return url

  const extMatch = url.match(/^(.+)\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
  if (!extMatch) return url

  let basePath = extMatch[1]
  const ext = extMatch[2]
  const queryString = extMatch[3] || ''

  let hadUser400x300 = false
  let hasStandalone1200 = false

  let changed = true
  while (changed) {
    changed = false

    // Strip trailing WP duplicate marker (only if preceded by a dimension)
    const dupMatch = basePath.match(/^(.+)-(\d{1,2})$/)
    if (dupMatch) {
      const preceding = dupMatch[1]
      if (preceding.match(/-\d+x\d+$/) || preceding.match(/-\d{3,4}$/)) {
        basePath = preceding
        changed = true
        continue
      }
    }

    // Strip trailing dimension suffix
    const dimMatch = basePath.match(/^(.+)-(\d+x\d+)$/)
    if (dimMatch) {
      const dim = dimMatch[2]
      if (USER_DIMENSIONS.has(dim)) {
        if (dim === '400x300') {
          hadUser400x300 = true
        }
        if (dimMatch[1].match(/-1200$/)) {
          basePath = dimMatch[1]
          hadUser400x300 = false
          hasStandalone1200 = true
          changed = true
          continue
        }
        basePath = dimMatch[1]
        changed = true
        continue
      } else {
        basePath = dimMatch[1]
        changed = true
        continue
      }
    }
  }

  if (hadUser400x300 && !hasStandalone1200) {
    basePath = basePath + '-1200x900'
  }

  if (basePath.match(/-400$/)) {
    basePath = basePath.replace(/-400$/, '-1200')
  }

  return `${basePath}.${ext}${queryString}`
}

// ─── File scanning ───────────────────────────────────────────────────────────

function findTsxFiles(dir: string): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      results.push(...findTsxFiles(fullPath))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath)
    }
  }
  return results
}

// ─── URL validation ──────────────────────────────────────────────────────────

async function validateUrl(url: string): Promise<boolean> {
  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return resp.ok
  } catch {
    return false
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

const STATIC_URL_PATTERN = /https:\/\/static\.mosquitocurtains\.com\/[^\s'"`)]+\.(jpg|jpeg|png|gif|webp)/gi

interface UrlChange {
  file: string
  original: string
  normalized: string
  validated: boolean | null
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const skipValidation = process.argv.includes('--skip-validation')

  console.log(`\n=== Image URL Fix Script ===`)
  console.log(`Mode: ${dryRun ? 'DRY RUN (no files written)' : 'LIVE (files will be modified)'}`)
  console.log(`Validation: ${skipValidation ? 'SKIPPED' : 'ENABLED'}\n`)

  const srcDir = path.resolve(__dirname, '..', 'src')
  const files = findTsxFiles(srcDir)
  console.log(`Found ${files.length} .tsx/.ts files to scan\n`)

  const allChanges: UrlChange[] = []
  const failedValidations: UrlChange[] = []
  const filesModified: string[] = []

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const urls = content.match(STATIC_URL_PATTERN) || []

    const uniqueUrls = [...new Set(urls)]
    const fileChanges: UrlChange[] = []

    for (const originalUrl of uniqueUrls) {
      const normalized = normalizeImageUrl(originalUrl)
      if (normalized !== originalUrl) {
        fileChanges.push({
          file: path.relative(process.cwd(), filePath),
          original: originalUrl,
          normalized,
          validated: null,
        })
      }
    }

    if (fileChanges.length === 0) continue

    // Validate new URLs
    if (!skipValidation) {
      for (const change of fileChanges) {
        change.validated = await validateUrl(change.normalized)
        if (!change.validated) {
          failedValidations.push(change)
        }
      }
    }

    // Apply changes to file content
    let newContent = content
    let applied = 0
    for (const change of fileChanges) {
      if (!skipValidation && !change.validated) {
        console.log(`  SKIP (404): ${change.original}`)
        console.log(`           -> ${change.normalized}`)
        continue
      }
      // Replace all occurrences of this URL in the file
      const before = newContent
      newContent = newContent.split(change.original).join(change.normalized)
      if (newContent !== before) applied++
    }

    if (applied > 0 && newContent !== content) {
      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8')
      }
      filesModified.push(path.relative(process.cwd(), filePath))
      console.log(`${dryRun ? '[DRY] ' : ''}Fixed ${applied} URL(s) in ${path.relative(process.cwd(), filePath)}`)
    }

    allChanges.push(...fileChanges)
  }

  // Summary
  console.log(`\n=== Summary ===`)
  console.log(`Files scanned:    ${files.length}`)
  console.log(`Files modified:   ${filesModified.length}`)
  console.log(`URLs changed:     ${allChanges.filter(c => c.validated !== false).length}`)
  console.log(`URLs skipped (404): ${failedValidations.length}`)

  if (failedValidations.length > 0) {
    console.log(`\n=== Failed Validations (kept original) ===`)
    for (const f of failedValidations) {
      console.log(`  ${f.file}`)
      console.log(`    ${f.original}`)
      console.log(`    -> ${f.normalized}`)
    }
  }

  if (filesModified.length > 0) {
    console.log(`\n=== Modified Files ===`)
    for (const f of filesModified) {
      console.log(`  ${f}`)
    }
  }

  // Detailed change log
  console.log(`\n=== All Changes ===`)
  for (const c of allChanges) {
    const status = c.validated === false ? 'SKIPPED' : c.validated === true ? 'OK' : 'UNVALIDATED'
    console.log(`[${status}] ${c.file}`)
    console.log(`  - ${c.original}`)
    console.log(`  + ${c.normalized}`)
  }
}

main().catch(console.error)
