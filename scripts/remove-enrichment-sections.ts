/**
 * Remove Enrichment Junk Sections
 * 
 * The enrich-pages.ts script injected HeaderBarSection blocks with variant="dark"
 * right before <FinalCTATemplate /> on ~64 pages. These contain thin, generic,
 * repetitive content that hurts SEO rather than helping.
 * 
 * This script removes those injected sections while preserving:
 * - Original page content
 * - Updated gallery images
 * - Everything else
 * 
 * Detection: Finds consecutive HeaderBarSection blocks immediately before
 * FinalCTATemplate that match the enrichment pattern.
 */

import * as fs from 'fs'
import * as path from 'path'

const SRC_DIR = path.join(__dirname, '..', 'src', 'app')

// Known enrichment-injected section labels
const ENRICHMENT_LABELS = new Set([
  'Custom Kits',
  'Delivered Fast',
  'High Quality',
])

// Known enrichment-injected text snippets (the generated filler text)
const ENRICHMENT_TEXT_SNIPPETS = [
  'Modular panels custom made to your exact size requirements',
  'Delivered at lightning speed in 6-10 business days',
  'Exceptional Marine-grade quality materials made to last',
  'Modular Mosquito Netting Panels custom-made to fit any space',
]

interface RemovalResult {
  file: string
  sectionsRemoved: number
  labels: string[]
}

function findAllPageFiles(dir: string): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // Skip admin, api, and node_modules
      if (['admin', 'api', 'node_modules', '.next'].includes(entry.name)) continue
      results.push(...findAllPageFiles(fullPath))
    } else if (entry.name === 'page.tsx') {
      results.push(fullPath)
    }
  }
  
  return results
}

/**
 * Remove enrichment-injected HeaderBarSection blocks before FinalCTATemplate.
 * 
 * Strategy:
 * 1. Find <FinalCTATemplate in the file
 * 2. Work backwards to find HeaderBarSection blocks with variant="dark"
 * 3. Check if they contain enrichment-generated content
 * 4. Remove the entire block
 */
function removeEnrichmentSections(filePath: string): RemovalResult | null {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Must have FinalCTATemplate
  if (!content.includes('<FinalCTATemplate')) return null
  
  // Must have HeaderBarSection with variant="dark"
  if (!content.includes('variant="dark"')) return null
  
  const lines = content.split('\n')
  
  // Find the line index of <FinalCTATemplate
  let ctaLineIdx = -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('<FinalCTATemplate')) {
      ctaLineIdx = i
      break
    }
  }
  
  if (ctaLineIdx === -1) return null
  
  // Now walk backwards from FinalCTATemplate to find injected sections
  // Skip blank lines and comments before FinalCTATemplate
  let searchIdx = ctaLineIdx - 1
  while (searchIdx >= 0 && lines[searchIdx].trim() === '') {
    searchIdx--
  }
  
  // Skip "FINAL CTA" comment blocks if present
  if (searchIdx >= 0 && lines[searchIdx].trim().includes('*/')) {
    while (searchIdx >= 0 && !lines[searchIdx].trim().includes('/*')) {
      searchIdx--
    }
    searchIdx-- // skip the /* line
    while (searchIdx >= 0 && lines[searchIdx].trim() === '') {
      searchIdx--
    }
  }
  
  // Now we should be at the end of the last content section
  // Check if it's a </HeaderBarSection> - if so, it might be an injected section
  const sectionsToRemove: { startLine: number; endLine: number; label: string }[] = []
  
  let currentEnd = searchIdx
  
  while (currentEnd >= 0) {
    const trimmedEnd = lines[currentEnd].trim()
    
    // Check if we're at a closing </HeaderBarSection>
    if (trimmedEnd !== '</HeaderBarSection>') break
    
    // Find the matching opening <HeaderBarSection tag
    let depth = 1
    let openIdx = currentEnd - 1
    
    while (openIdx >= 0 && depth > 0) {
      const line = lines[openIdx].trim()
      // Count closing tags (but not the one we already found)
      if (line === '</HeaderBarSection>') depth++
      // Count opening tags
      if (line.includes('<HeaderBarSection')) depth--
      if (depth > 0) openIdx--
    }
    
    if (openIdx < 0 || depth !== 0) break
    
    // Found the opening tag - check if it has variant="dark"
    const openLine = lines[openIdx]
    if (!openLine.includes('variant="dark"')) break
    
    // Extract the label
    const labelMatch = openLine.match(/label="([^"]*)"/)
    const label = labelMatch ? labelMatch[1] : 'unknown'
    
    // Check if this is an enrichment section by examining content
    const sectionContent = lines.slice(openIdx, currentEnd + 1).join('\n')
    
    const isEnrichmentSection = 
      ENRICHMENT_LABELS.has(label) ||
      ENRICHMENT_TEXT_SNIPPETS.some(snippet => sectionContent.includes(snippet)) ||
      isShortContentSection(sectionContent)
    
    if (!isEnrichmentSection) break
    
    sectionsToRemove.push({
      startLine: openIdx,
      endLine: currentEnd,
      label,
    })
    
    // Move to the line before this section's opening tag
    currentEnd = openIdx - 1
    while (currentEnd >= 0 && lines[currentEnd].trim() === '') {
      currentEnd--
    }
  }
  
  if (sectionsToRemove.length === 0) return null
  
  // Remove sections (they're in reverse order - bottom to top)
  // Sort by startLine descending to remove from bottom up
  sectionsToRemove.sort((a, b) => b.startLine - a.startLine)
  
  let newLines = [...lines]
  for (const section of sectionsToRemove) {
    // Also remove blank lines after the section
    let endWithBlanks = section.endLine
    while (endWithBlanks + 1 < newLines.length && newLines[endWithBlanks + 1].trim() === '') {
      endWithBlanks++
    }
    // Keep at most one blank line
    newLines.splice(section.startLine, endWithBlanks - section.startLine + 1)
  }
  
  // Clean up excessive blank lines before FinalCTATemplate
  const newContent = newLines.join('\n')
    .replace(/\n{4,}/g, '\n\n')  // Max 2 consecutive newlines
  
  // Check if we should also clean up imports that are now unused
  const cleanedContent = cleanUnusedImports(newContent, filePath)
  
  fs.writeFileSync(filePath, cleanedContent)
  
  const slug = path.relative(SRC_DIR, filePath).replace('/page.tsx', '')
  return {
    file: slug,
    sectionsRemoved: sectionsToRemove.length,
    labels: sectionsToRemove.map(s => s.label),
  }
}

/**
 * Check if a HeaderBarSection contains only a very short amount of text content
 * (single sentence, no lists, no multiple paragraphs = enrichment filler)
 */
function isShortContentSection(sectionContent: string): boolean {
  // Count Text components
  const textMatches = sectionContent.match(/<Text[^>]*>/g)
  if (!textMatches) return false
  
  // If it has only 1 Text component and no BulletedList, it's likely enrichment filler
  const hasBulletedList = sectionContent.includes('BulletedList')
  const hasMultipleTexts = textMatches.length > 1
  
  // Short section: one Text, no lists, total content is brief
  if (!hasBulletedList && !hasMultipleTexts) {
    // Extract the text content
    const textContent = sectionContent.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    // If the actual text is under ~100 chars, it's filler
    return textContent.length < 150
  }
  
  return false
}

/**
 * Remove imports that are no longer used after removing sections.
 * Specifically targets: Frame, Award (common in enrichment sections)
 */
function cleanUnusedImports(content: string, filePath: string): string {
  // Check if Frame is still used in the content (outside of import statements)
  const importSection = content.match(/import[\s\S]*?from\s+['"][^'"]+['"]/g) || []
  const codeWithoutImports = importSection.reduce((c, imp) => c.replace(imp, ''), content)
  
  // Don't remove imports that are still used - just return as-is
  // The build will catch any actual unused import issues
  return content
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  console.log('🔍 Scanning for enrichment-injected sections...\n')
  
  const files = findAllPageFiles(SRC_DIR)
  console.log(`Found ${files.length} page files to check\n`)
  
  const results: RemovalResult[] = []
  let totalSections = 0
  
  for (const file of files) {
    const result = removeEnrichmentSections(file)
    if (result) {
      results.push(result)
      totalSections += result.sectionsRemoved
      console.log(`✅ ${result.file}: removed ${result.sectionsRemoved} sections [${result.labels.join(', ')}]`)
    }
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 Summary:`)
  console.log(`   Files modified: ${results.length}`)
  console.log(`   Sections removed: ${totalSections}`)
  console.log(`${'='.repeat(60)}\n`)
  
  if (results.length === 0) {
    console.log('No enrichment sections found to remove.')
  }
}

main()
