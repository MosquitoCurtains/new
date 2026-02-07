'use client'

/**
 * Site Audit Dashboard
 * 
 * Three tabs:
 * 1. Page Reviews - Review workflow with expandable notes
 * 2. SEO Audit - Detailed SEO health per page
 * 3. AI Audit - AI/LLM readiness per page
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  Edit2,
  X,
  Save,
  RefreshCw,
  Eye,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Globe,
  Bot,
  Terminal,
  FileText,
  Link2,
  Image,
  Smartphone,
  Code,
  BookOpen,
  Shield,
  Quote,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Badge,
  Input,
  Button,
  Textarea,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

type ReviewStatus = 'pending' | 'complete' | 'needs_revision'
type TabId = 'reviews' | 'seo' | 'ai'

interface PageReview {
  id: string
  slug: string
  title: string
  wordpress_url: string | null
  page_type: string
  migration_status: string
  migration_priority: number
  migration_batch: string | null
  review_status: ReviewStatus | null
  review_notes: string | null
  revision_items: string | null
  updated_at: string
  reviewed_at: string | null
  seo_score?: number | null
  ai_score?: number | null
  performance_score?: number | null
}

interface SEOAudit {
  id: string
  page_id: string
  slug: string
  title: string
  page_type: string
  migration_status: string
  migration_priority: number
  seo_score: number | null
  seo_rating: string
  has_meta_title: boolean
  meta_title: string | null
  meta_title_length: number | null
  meta_title_ok: boolean | null
  has_meta_description: boolean
  meta_description: string | null
  meta_description_length: number | null
  meta_description_ok: boolean | null
  has_canonical: boolean
  canonical_url: string | null
  has_og_title: boolean
  has_og_description: boolean
  has_og_image: boolean
  og_image_url: string | null
  has_twitter_card: boolean
  has_h1: boolean
  h1_count: number
  h1_text: string | null
  heading_hierarchy_ok: boolean | null
  images_have_alt: boolean | null
  images_missing_alt: number
  internal_links_count: number
  external_links_count: number
  broken_links_count: number
  has_robots_meta: boolean
  is_indexable: boolean
  has_sitemap_entry: boolean
  is_mobile_friendly: boolean | null
  viewport_configured: boolean
  issues: Array<{ type: string; message: string }> | null
  recommendations: Array<{ type: string; message: string }> | null
  audited_at: string
}

interface AIAudit {
  id: string
  page_id: string
  slug: string
  title: string
  page_type: string
  migration_status: string
  migration_priority: number
  ai_score: number | null
  ai_rating: string
  has_structured_data: boolean
  structured_data_types: string[] | null
  structured_data_valid: boolean | null
  has_clear_headings: boolean
  has_faq_section: boolean
  has_how_to_content: boolean
  content_is_factual: boolean | null
  has_specific_details: boolean | null
  uses_semantic_html: boolean
  has_main_element: boolean
  has_article_element: boolean
  has_nav_element: boolean
  has_header_footer: boolean
  has_aria_labels: boolean
  has_skip_links: boolean
  form_labels_ok: boolean | null
  content_in_html: boolean
  avoids_infinite_scroll: boolean
  has_clear_content_boundaries: boolean | null
  has_author_info: boolean
  has_publish_date: boolean
  has_last_updated: boolean
  has_sources_citations: boolean
  issues: Array<{ type: string; message: string }> | null
  recommendations: Array<{ type: string; message: string }> | null
  audited_at: string
}

interface Stats {
  total: number
  pending: number
  complete: number
  needs_revision: number
  built: number
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getStatusInfo = (status: ReviewStatus) => {
  switch (status) {
    case 'pending': return { label: 'Pending', icon: Clock, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
    case 'complete': return { label: 'Complete', icon: CheckCircle2, bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
    case 'needs_revision': return { label: 'Needs Revision', icon: AlertTriangle, bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
  }
}

const getPageTypeLabel = (pageType: string) => {
  const labels: Record<string, string> = {
    homepage: 'Homepage', product_landing: 'Product', seo_landing: 'SEO Landing',
    category: 'Category', informational: 'Info', legal: 'Legal',
    support: 'Support', marketing: 'Marketing', ecommerce: 'E-commerce',
    admin: 'Admin', utility: 'Utility',
  }
  return labels[pageType] || pageType
}

const isPageBuilt = (status: string) => status === 'live'

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// =============================================================================
// SMALL REUSABLE COMPONENTS
// =============================================================================

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Clock; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

/** Green check or red X for boolean audit fields */
function BoolCheck({ value, label }: { value: boolean | null | undefined; label?: string }) {
  if (value === null || value === undefined) return <span className="text-gray-300 text-xs" title={label}>--</span>
  return value
    ? <span title={label ? `${label}: Pass` : 'Pass'}><CheckCircle2 className="w-4 h-4 text-green-500 inline-block" /></span>
    : <span title={label ? `${label}: Fail` : 'Fail'}><XCircle className="w-4 h-4 text-red-400 inline-block" /></span>
}

/** Color-coded score badge */
function ScoreBadge({ score, size = 'sm' }: { score: number | null | undefined; size?: 'sm' | 'lg' }) {
  if (score === null || score === undefined) return <span className="text-gray-400 text-xs">--</span>
  const color = score >= 80 ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : score >= 40 ? 'bg-orange-100 text-orange-700 border-orange-200'
    : 'bg-red-100 text-red-700 border-red-200'
  const sizeClass = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
  return <span className={`inline-flex items-center rounded-full font-bold border ${color} ${sizeClass}`}>{score}</span>
}

/** Expandable text block - shows truncated with "Show more" */
function ExpandableText({ text, maxLength = 120 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false)
  
  if (text.length <= maxLength) {
    return <span className="text-sm text-gray-700 whitespace-pre-line">{text}</span>
  }
  
  return (
    <span className="text-sm text-gray-700">
      <span className="whitespace-pre-line">{expanded ? text : text.slice(0, maxLength) + '...'}</span>
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
        className="ml-1 text-[#406517] hover:underline text-xs font-medium"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  )
}

/** Issues/recommendations list */
function IssuesList({ items, type }: { items: Array<{ type?: string; message: string }> | null; type: 'issue' | 'recommendation' }) {
  if (!items || items.length === 0) return <span className="text-gray-400 text-sm">None</span>
  const color = type === 'issue' ? 'text-red-600' : 'text-blue-600'
  const Icon = type === 'issue' ? AlertCircle : CheckCircle2
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-1.5 text-sm">
          <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${color}`} />
          <span className="text-gray-700">{item.message || String(item)}</span>
        </li>
      ))}
    </ul>
  )
}

// =============================================================================
// EDIT MODAL (for Reviews tab)
// =============================================================================

function EditModal({ 
  page, onClose, onSave, saving,
}: { 
  page: PageReview; onClose: () => void
  onSave: (id: string, status: ReviewStatus, notes: string, revisionItems: string) => void
  saving: boolean
}) {
  const [status, setStatus] = useState<ReviewStatus>(page.review_status || 'pending')
  const [notes, setNotes] = useState(page.review_notes || '')
  const [revisionItems, setRevisionItems] = useState(page.revision_items || '')
  const isBuilt = isPageBuilt(page.migration_status)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-lg">{page.title}</h2>
            <p className="text-sm text-gray-500 font-mono">{page.slug}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {isBuilt && (
            <Link href={page.slug} target="_blank" className="flex items-center gap-2 text-[#406517] hover:underline text-sm">
              <Eye className="w-4 h-4" /> View page in new tab <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          
          {!isBuilt && (
            <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4" /> Page not built yet ({page.migration_status})
            </div>
          )}

          {/* Scores */}
          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <ScoreBadge score={page.seo_score} size="lg" />
              <p className="text-xs text-gray-500 mt-1">SEO</p>
            </div>
            <div className="text-center">
              <ScoreBadge score={page.ai_score} size="lg" />
              <p className="text-xs text-gray-500 mt-1">AI</p>
            </div>
            <div className="text-center">
              <ScoreBadge score={page.performance_score} size="lg" />
              <p className="text-xs text-gray-500 mt-1">Perf</p>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {(['pending', 'complete', 'needs_revision'] as ReviewStatus[]).map((s) => {
                const info = getStatusInfo(s)
                const isSelected = status === s
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${isSelected ? `${info.bg} ${info.border} ${info.text}` : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <info.icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? info.text : 'text-gray-400'}`} />
                    <span className="text-xs font-medium">{info.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this page..." className="!min-h-[80px]" />
          </div>
          
          {/* Revision Items - always show if there are items, editable when needs_revision */}
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              {status === 'needs_revision' ? 'What needs to be fixed?' : 'Revision Items (read-only unless Needs Revision)'}
            </label>
            <Textarea 
              value={revisionItems} 
              onChange={(e) => setRevisionItems(e.target.value)}
              placeholder={"- Item 1\n- Item 2\n- Item 3"} 
              className={`!min-h-[120px] !border-orange-200 focus:!border-orange-400 !text-sm`}
              readOnly={status !== 'needs_revision'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {revisionItems ? `${revisionItems.split('\n').filter(l => l.trim().startsWith('-')).length} items` : 'No items yet'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(page.id, status, notes, revisionItems)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// TAB: PAGE REVIEWS
// =============================================================================

function ReviewsTab({ 
  pages, stats, loading, error, onEdit, onRefresh
}: {
  pages: PageReview[]; stats: Stats; loading: boolean; error: string | null
  onEdit: (page: PageReview) => void; onRefresh: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | ReviewStatus>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterBuilt, setFilterBuilt] = useState<'all' | 'built' | 'not_built'>('all')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const pageReviewStatus = page.review_status || 'pending'
    const matchesStatus = filterStatus === 'all' || pageReviewStatus === filterStatus
    const matchesCategory = filterCategory === 'all' || page.page_type === filterCategory
    const built = isPageBuilt(page.migration_status)
    const matchesBuilt = filterBuilt === 'all' || (filterBuilt === 'built' && built) || (filterBuilt === 'not_built' && !built)
    return matchesSearch && matchesStatus && matchesCategory && matchesBuilt
  })
  
  const pageTypes = [...new Set(pages.map(p => p.page_type))].sort()
  
  return (
    <Stack gap="md">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total Pages" value={stats.total} icon={Filter} color="#6B7280" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="#6B7280" />
        <StatCard label="Complete" value={stats.complete} icon={CheckCircle2} color="#059669" />
        <StatCard label="Needs Revision" value={stats.needs_revision} icon={AlertTriangle} color="#EA580C" />
        <StatCard label="Built" value={stats.built} icon={CheckCircle2} color="#406517" />
      </div>
      
      {/* Filters */}
      <Card variant="outlined" className="!p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search pages..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="!pl-9 !py-2" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="needs_revision">Needs Revision</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20">
            <option value="all">All Types</option>
            {pageTypes.map(type => <option key={type} value={type}>{getPageTypeLabel(type)}</option>)}
          </select>
          <select value={filterBuilt} onChange={(e) => setFilterBuilt(e.target.value as typeof filterBuilt)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20">
            <option value="all">All Migration</option>
            <option value="built">Live</option>
            <option value="not_built">Not Started</option>
          </select>
        </div>
      </Card>
      
      {/* Loading */}
      {loading && pages.length === 0 && (
        <Card variant="elevated" className="!p-8">
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" /> <span>Loading pages...</span>
          </div>
        </Card>
      )}
      
      {/* Empty State */}
      {!loading && pages.length === 0 && !error && (
        <Card variant="elevated" className="!p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <Text className="text-gray-500 !mb-2">No pages found</Text>
          <Text size="sm" className="text-gray-400 !mb-0">
            Run migration <code className="bg-gray-100 px-1 rounded">20260205000007_simple_page_reviews.sql</code> to populate pages
          </Text>
        </Card>
      )}
      
      {/* Table */}
      {pages.length > 0 && (
        <Card variant="elevated" className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-8"></th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider">Page</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">SEO</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">AI</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">Perf</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-28">Built</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-28">Review</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-24 hidden md:table-cell">Updated</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPages.map((page) => {
                  const reviewStatus = page.review_status || 'pending'
                  const statusInfo = getStatusInfo(reviewStatus)
                  const StatusIcon = statusInfo.icon
                  const isExpanded = expandedRows.has(page.id)
                  
                  const getMigrationBadge = (status: string) => {
                    switch (status) {
                      case 'live': return { label: 'Live', className: '!bg-green-100 !text-green-700 !border-green-200' }
                      case 'in_progress': return { label: 'Building', className: '!bg-blue-100 !text-blue-700 !border-blue-200' }
                      case 'review': return { label: 'Review', className: '!bg-purple-100 !text-purple-700 !border-purple-200' }
                      case 'content_extracted': return { label: 'Extracted', className: '!bg-yellow-100 !text-yellow-700 !border-yellow-200' }
                      case 'not_started': return { label: 'Not Started', className: '!bg-gray-100 !text-gray-500 !border-gray-200' }
                      default: return { label: status, className: '!bg-gray-100 !text-gray-500 !border-gray-200' }
                    }
                  }
                  const migrationBadge = getMigrationBadge(page.migration_status)
                  
                  // Parse revision items into structured list
                  const revisionLines = (page.revision_items || '').split('\n').filter(l => l.trim().startsWith('-'))
                  const missingImages = revisionLines.filter(l => l.includes('MISSING IMAGE')).length
                  const missingHeadings = revisionLines.filter(l => l.includes('MISSING HEADING')).length
                  const missingText = revisionLines.filter(l => l.includes('MISSING TEXT') || l.includes('WORD COUNT')).length
                  const missingVideos = revisionLines.filter(l => l.includes('MISSING VIDEO') || l.includes('VIDEO')).length
                  const otherItems = revisionLines.length - missingImages - missingHeadings - missingText - missingVideos
                  
                  return (
                    <tr key={page.id} className="group">
                      <td colSpan={9} className="p-0">
                        {/* Main row */}
                        <div className="flex items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleRow(page.id)}>
                          <div className="px-4 py-3 w-8 flex-shrink-0">
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4 text-gray-400" />
                              : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          </div>
                          <div className="px-4 py-3 flex-1 min-w-0">
                            <p className="font-medium text-black truncate">{page.title}</p>
                            <p className="text-xs text-black/70 font-mono truncate">{page.slug}</p>
                            {/* Inline audit summary */}
                            {page.review_notes && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{page.review_notes}</p>
                            )}
                          </div>
                          <div className="px-3 py-3 w-16 text-center"><ScoreBadge score={page.seo_score} /></div>
                          <div className="px-3 py-3 w-16 text-center"><ScoreBadge score={page.ai_score} /></div>
                          <div className="px-3 py-3 w-16 text-center"><ScoreBadge score={page.performance_score} /></div>
                          <div className="px-4 py-3 w-28">
                            <Badge className={`${migrationBadge.className} text-xs whitespace-nowrap`}>{migrationBadge.label}</Badge>
                          </div>
                          <div className="px-4 py-3 w-28">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}>
                              <StatusIcon className="w-3 h-3" /> {statusInfo.label.split(' ')[0]}
                            </span>
                          </div>
                          <div className="px-4 py-3 w-24 hidden md:block">
                            <span className="text-sm text-black">{formatDate(page.updated_at)}</span>
                          </div>
                          <div className="px-4 py-3 w-16 text-right">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(page) }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black hover:text-black">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-12 pb-4 bg-gray-50/50 border-t border-gray-100">
                            {/* Audit Summary Banner */}
                            {page.review_notes && (
                              <div className={`mt-3 px-4 py-3 rounded-lg border ${
                                reviewStatus === 'needs_revision' ? 'bg-orange-50 border-orange-200' :
                                reviewStatus === 'complete' ? 'bg-green-50 border-green-200' :
                                'bg-gray-50 border-gray-200'
                              }`}>
                                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  {page.review_notes}
                                </p>
                              </div>
                            )}
                            
                            {/* Revision Items - Categorized */}
                            {page.revision_items && revisionLines.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-orange-700 uppercase mb-2 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  What Needs to Be Fixed ({revisionLines.length} items)
                                </p>
                                
                                {/* Category summary chips */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {missingImages > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                      <Image className="w-3 h-3" /> {missingImages} missing images
                                    </span>
                                  )}
                                  {missingHeadings > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                      <FileText className="w-3 h-3" /> {missingHeadings} missing headings
                                    </span>
                                  )}
                                  {missingText > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                                      <BookOpen className="w-3 h-3" /> {missingText} text gaps
                                    </span>
                                  )}
                                  {missingVideos > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                      <Eye className="w-3 h-3" /> {missingVideos} video issues
                                    </span>
                                  )}
                                  {otherItems > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                      {otherItems} other items
                                    </span>
                                  )}
                                </div>
                                
                                {/* Detailed item list */}
                                <div className="bg-white rounded-lg border border-orange-100 p-3 max-h-[300px] overflow-y-auto">
                                  <ul className="space-y-1.5">
                                    {revisionLines.map((line, i) => {
                                      const text = line.replace(/^-\s*/, '')
                                      const isMissingImage = text.includes('MISSING IMAGE')
                                      const isMissingHeading = text.includes('MISSING HEADING')
                                      const isMissingVideo = text.includes('VIDEO')
                                      const iconColor = isMissingImage ? 'text-purple-500' : isMissingHeading ? 'text-blue-500' : isMissingVideo ? 'text-red-500' : 'text-orange-500'
                                      const ItemIcon = isMissingImage ? Image : isMissingHeading ? FileText : isMissingVideo ? Eye : AlertCircle
                                      
                                      return (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                          <ItemIcon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                                          <span className="text-gray-700 break-all">{text}</span>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              </div>
                            )}
                            
                            {!page.review_notes && !page.revision_items && (
                              <div className="mt-3 text-sm text-gray-400 italic">
                                No audit notes yet. Run the content audit to populate.
                              </div>
                            )}
                            
                            {/* Quick links */}
                            <div className="flex gap-3 mt-3">
                              {isPageBuilt(page.migration_status) && (
                                <Link href={page.slug} target="_blank"
                                  className="inline-flex items-center gap-1.5 text-xs text-[#406517] hover:underline">
                                  <Eye className="w-3.5 h-3.5" /> View page <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                              {page.wordpress_url && (
                                <a href={`https://mosquitocurtains.com${page.wordpress_url}`} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                                  <Globe className="w-3.5 h-3.5" /> WordPress <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPages.length === 0 && pages.length > 0 && (
            <div className="p-8 text-center text-black">
              <Search className="w-12 h-12 mx-auto mb-3 text-black/50" />
              <p>No pages match your filters</p>
            </div>
          )}
        </Card>
      )}
      
      <Text size="sm" className="text-black text-center !mb-0">
        Showing {filteredPages.length} of {pages.length} pages
      </Text>
    </Stack>
  )
}

// =============================================================================
// TAB: SEO AUDIT
// =============================================================================

function SEOAuditTab() {
  const [audits, setAudits] = useState<SEOAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'score' | 'title'>('score')
  
  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  
  useEffect(() => {
    async function fetchSEO() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/page-reviews?type=seo')
        const data = await res.json()
        if (data.error) { setError(data.error); return }
        if (data.message) { setError(data.message) }
        setAudits(data.audits || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load SEO audits')
      } finally {
        setLoading(false)
      }
    }
    fetchSEO()
  }, [])

  const sorted = [...audits].sort((a, b) => {
    if (sortBy === 'score') return (a.seo_score ?? 0) - (b.seo_score ?? 0)
    return a.title.localeCompare(b.title)
  })
  
  if (loading) {
    return (
      <Card variant="elevated" className="!p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" /> <span>Loading SEO audits...</span>
        </div>
      </Card>
    )
  }
  
  if (audits.length === 0) {
    return (
      <Card variant="elevated" className="!p-8 text-center">
        <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <Text className="text-gray-500 !mb-2 font-medium">No SEO Audit Data Yet</Text>
        <Text size="sm" className="text-gray-400 !mb-4">
          Run the SEO audit script to populate this tab with detailed per-page analysis.
        </Text>
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono text-left max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Terminal className="w-4 h-4" /> Terminal
          </div>
          npx tsx scripts/audit-seo.ts --base-url http://localhost:3000
        </div>
      </Card>
    )
  }
  
  // Summary stats
  const avgScore = Math.round(audits.reduce((sum, a) => sum + (a.seo_score ?? 0), 0) / audits.length)
  const excellent = audits.filter(a => (a.seo_score ?? 0) >= 80).length
  const poor = audits.filter(a => (a.seo_score ?? 0) < 50).length
  
  return (
    <Stack gap="md">
      {error && (
        <Card variant="outlined" className="!p-4 !bg-yellow-50 !border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" /> <span>{error}</span>
          </div>
        </Card>
      )}
      
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Pages Audited" value={audits.length} icon={Globe} color="#6B7280" />
        <StatCard label="Avg Score" value={avgScore} icon={Search} color={avgScore >= 70 ? '#059669' : '#EA580C'} />
        <StatCard label="Score 80+" value={excellent} icon={CheckCircle2} color="#059669" />
        <StatCard label="Score < 50" value={poor} icon={AlertTriangle} color="#DC2626" />
      </div>
      
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <button onClick={() => setSortBy('score')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sortBy === 'score' ? 'bg-[#406517] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Score
        </button>
        <button onClick={() => setSortBy('title')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sortBy === 'title' ? 'bg-[#406517] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Title
        </button>
      </div>
      
      {/* Table */}
      <Card variant="elevated" className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-8"></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider">Page</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">Score</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><FileText className="w-3 h-3" /> Meta</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">H1</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><Globe className="w-3 h-3" /> OG</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-20">
                  <span className="flex items-center justify-center gap-1"><Image className="w-3 h-3" /> Imgs</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><Link2 className="w-3 h-3" /> Links</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">
                  <span className="flex items-center justify-center gap-1"><Smartphone className="w-3 h-3" /></span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((audit) => {
                const isExpanded = expandedRows.has(audit.id)
                return (
                  <tr key={audit.id} className="group">
                    <td colSpan={10} className="p-0">
                      {/* Main row */}
                      <div className="flex items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleRow(audit.id)}>
                        <div className="px-4 py-3 w-8 flex-shrink-0">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="px-4 py-3 flex-1 min-w-0">
                          <p className="font-medium text-black truncate">{audit.title}</p>
                          <p className="text-xs text-black/70 font-mono truncate">{audit.slug}</p>
                        </div>
                        <div className="px-3 py-3 w-16 text-center"><ScoreBadge score={audit.seo_score} /></div>
                        <div className="px-3 py-3 w-24 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <BoolCheck value={audit.meta_title_ok} label="Title" />
                            <BoolCheck value={audit.meta_description_ok} label="Description" />
                          </div>
                        </div>
                        <div className="px-3 py-3 w-16 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_h1} label="H1" />
                            {audit.h1_count > 1 && <span className="text-xs text-orange-500" title={`${audit.h1_count} H1s found`}>x{audit.h1_count}</span>}
                          </div>
                        </div>
                        <div className="px-3 py-3 w-24 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_og_title} label="OG Title" />
                            <BoolCheck value={audit.has_og_description} label="OG Desc" />
                            <BoolCheck value={audit.has_og_image} label="OG Image" />
                          </div>
                        </div>
                        <div className="px-3 py-3 w-20 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.images_have_alt} label="Alt text" />
                            {audit.images_missing_alt > 0 && (
                              <span className="text-xs text-red-500" title={`${audit.images_missing_alt} missing alt`}>-{audit.images_missing_alt}</span>
                            )}
                          </div>
                        </div>
                        <div className="px-3 py-3 w-24 text-center">
                          <span className="text-xs text-gray-600" title={`${audit.internal_links_count} internal, ${audit.external_links_count} external`}>
                            {audit.internal_links_count}i / {audit.external_links_count}e
                          </span>
                          {audit.broken_links_count > 0 && (
                            <span className="text-xs text-red-500 ml-1" title={`${audit.broken_links_count} broken`}>({audit.broken_links_count} broken)</span>
                          )}
                        </div>
                        <div className="px-3 py-3 w-16 text-center">
                          <BoolCheck value={audit.is_mobile_friendly} label="Mobile" />
                        </div>
                        <div className="px-3 py-3 w-16 text-center">
                          <BoolCheck value={audit.is_indexable} label="Indexable" />
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-12 pb-4 bg-gray-50/50 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                            {/* Meta Title */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Meta Title
                                {audit.meta_title_length && (
                                  <span className={`ml-auto ${audit.meta_title_ok ? 'text-green-600' : 'text-orange-600'}`}>
                                    {audit.meta_title_length} chars
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-700">{audit.meta_title || <span className="text-red-400 italic">Missing</span>}</p>
                            </div>
                            
                            {/* Meta Description */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Meta Description
                                {audit.meta_description_length && (
                                  <span className={`ml-auto ${audit.meta_description_ok ? 'text-green-600' : 'text-orange-600'}`}>
                                    {audit.meta_description_length} chars
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-700">{audit.meta_description || <span className="text-red-400 italic">Missing</span>}</p>
                            </div>
                            
                            {/* H1 */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                H1 Tag
                                <span className="ml-auto">{audit.h1_count} found</span>
                              </p>
                              <p className="text-sm text-gray-700">{audit.h1_text || <span className="text-red-400 italic">Missing</span>}</p>
                              <div className="flex items-center gap-2 mt-1.5 text-xs">
                                <BoolCheck value={audit.heading_hierarchy_ok} /> <span className="text-gray-500">Heading hierarchy OK</span>
                              </div>
                            </div>
                            
                            {/* Canonical */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Canonical URL</p>
                              <div className="flex items-center gap-2">
                                <BoolCheck value={audit.has_canonical} />
                                <p className="text-sm text-gray-700 font-mono truncate">{audit.canonical_url || '--'}</p>
                              </div>
                            </div>
                            
                            {/* Technical */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Technical</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_twitter_card} /> <span>Twitter Card</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_sitemap_entry} /> <span>In Sitemap</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.viewport_configured} /> <span>Viewport Meta</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_robots_meta} /> <span>Robots Meta</span></div>
                              </div>
                            </div>

                            {/* Audited */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Audit Info</p>
                              <p className="text-sm text-gray-700">Audited: {formatDate(audit.audited_at)}</p>
                              <p className="text-sm text-gray-700">Rating: <span className="font-medium capitalize">{audit.seo_rating?.replace('_', ' ')}</span></p>
                            </div>
                          </div>
                          
                          {/* Issues & Recommendations */}
                          {((audit.issues && audit.issues.length > 0) || (audit.recommendations && audit.recommendations.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              {audit.issues && audit.issues.length > 0 && (
                                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                  <p className="text-xs font-medium text-red-700 uppercase mb-2">Issues ({audit.issues.length})</p>
                                  <IssuesList items={audit.issues} type="issue" />
                                </div>
                              )}
                              {audit.recommendations && audit.recommendations.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                  <p className="text-xs font-medium text-blue-700 uppercase mb-2">Recommendations ({audit.recommendations.length})</p>
                                  <IssuesList items={audit.recommendations} type="recommendation" />
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* View Page Link */}
                          <div className="mt-3">
                            <Link href={audit.slug} target="_blank"
                              className="inline-flex items-center gap-1.5 text-xs text-[#406517] hover:underline">
                              <Eye className="w-3.5 h-3.5" /> View page <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Text size="sm" className="text-gray-500 text-center !mb-0">{audits.length} pages audited</Text>
    </Stack>
  )
}

// =============================================================================
// TAB: AI AUDIT
// =============================================================================

function AIAuditTab() {
  const [audits, setAudits] = useState<AIAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'score' | 'title'>('score')
  
  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  
  useEffect(() => {
    async function fetchAI() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/page-reviews?type=ai')
        const data = await res.json()
        if (data.error) { setError(data.error); return }
        if (data.message) { setError(data.message) }
        setAudits(data.audits || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load AI audits')
      } finally {
        setLoading(false)
      }
    }
    fetchAI()
  }, [])

  const sorted = [...audits].sort((a, b) => {
    if (sortBy === 'score') return (a.ai_score ?? 0) - (b.ai_score ?? 0)
    return a.title.localeCompare(b.title)
  })
  
  if (loading) {
    return (
      <Card variant="elevated" className="!p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" /> <span>Loading AI audits...</span>
        </div>
      </Card>
    )
  }
  
  if (audits.length === 0) {
    return (
      <Card variant="elevated" className="!p-8 text-center">
        <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <Text className="text-gray-500 !mb-2 font-medium">No AI Audit Data Yet</Text>
        <Text size="sm" className="text-gray-400 !mb-4">
          Run the SEO audit script (it includes AI readiness checks) to populate this tab.
        </Text>
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono text-left max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Terminal className="w-4 h-4" /> Terminal
          </div>
          npx tsx scripts/audit-seo.ts --base-url http://localhost:3000
        </div>
      </Card>
    )
  }
  
  const avgScore = Math.round(audits.reduce((sum, a) => sum + (a.ai_score ?? 0), 0) / audits.length)
  const excellent = audits.filter(a => (a.ai_score ?? 0) >= 80).length
  const poor = audits.filter(a => (a.ai_score ?? 0) < 50).length
  
  return (
    <Stack gap="md">
      {error && (
        <Card variant="outlined" className="!p-4 !bg-yellow-50 !border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" /> <span>{error}</span>
          </div>
        </Card>
      )}
      
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Pages Audited" value={audits.length} icon={Bot} color="#6B7280" />
        <StatCard label="Avg Score" value={avgScore} icon={Search} color={avgScore >= 70 ? '#059669' : '#EA580C'} />
        <StatCard label="Score 80+" value={excellent} icon={CheckCircle2} color="#059669" />
        <StatCard label="Score < 50" value={poor} icon={AlertTriangle} color="#DC2626" />
      </div>
      
      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <button onClick={() => setSortBy('score')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sortBy === 'score' ? 'bg-[#406517] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Score
        </button>
        <button onClick={() => setSortBy('title')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sortBy === 'title' ? 'bg-[#406517] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Title
        </button>
      </div>
      
      {/* Table */}
      <Card variant="elevated" className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-8"></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider">Page</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-16">Score</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><Code className="w-3 h-3" /> Schema</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-20">
                  <span className="flex items-center justify-center gap-1"><Code className="w-3 h-3" /> HTML</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><BookOpen className="w-3 h-3" /> Content</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-20">
                  <span className="flex items-center justify-center gap-1"><Shield className="w-3 h-3" /> A11y</span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-black uppercase tracking-wider w-24">
                  <span className="flex items-center justify-center gap-1"><Quote className="w-3 h-3" /> Citation</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((audit) => {
                const isExpanded = expandedRows.has(audit.id)
                return (
                  <tr key={audit.id} className="group">
                    <td colSpan={8} className="p-0">
                      {/* Main row */}
                      <div className="flex items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleRow(audit.id)}>
                        <div className="px-4 py-3 w-8 flex-shrink-0">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="px-4 py-3 flex-1 min-w-0">
                          <p className="font-medium text-black truncate">{audit.title}</p>
                          <p className="text-xs text-black/70 font-mono truncate">{audit.slug}</p>
                        </div>
                        <div className="px-3 py-3 w-16 text-center"><ScoreBadge score={audit.ai_score} /></div>
                        <div className="px-3 py-3 w-24 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_structured_data} label="Structured Data" />
                            <BoolCheck value={audit.structured_data_valid} label="Valid" />
                          </div>
                        </div>
                        <div className="px-3 py-3 w-20 text-center">
                          <BoolCheck value={audit.uses_semantic_html} label="Semantic HTML" />
                        </div>
                        <div className="px-3 py-3 w-24 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_faq_section} label="FAQ" />
                            <BoolCheck value={audit.has_how_to_content} label="HowTo" />
                            <BoolCheck value={audit.content_is_factual} label="Factual" />
                          </div>
                        </div>
                        <div className="px-3 py-3 w-20 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_aria_labels} label="ARIA" />
                            <BoolCheck value={audit.has_skip_links} label="Skip Links" />
                          </div>
                        </div>
                        <div className="px-3 py-3 w-24 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BoolCheck value={audit.has_author_info} label="Author" />
                            <BoolCheck value={audit.has_publish_date} label="Date" />
                            <BoolCheck value={audit.has_sources_citations} label="Sources" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-12 pb-4 bg-gray-50/50 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                            {/* Structured Data */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <Code className="w-3 h-3" /> Structured Data
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_structured_data} /> <span>Has Schema.org</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.structured_data_valid} /> <span>Valid</span></div>
                                {audit.structured_data_types && audit.structured_data_types.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {audit.structured_data_types.map((t, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Semantic HTML */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Semantic HTML</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.uses_semantic_html} /> <span>Semantic HTML</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_main_element} /> <span>{'<main>'}</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_article_element} /> <span>{'<article>'}</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_nav_element} /> <span>{'<nav>'}</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_header_footer} /> <span>{'<header>/<footer>'}</span></div>
                              </div>
                            </div>
                            
                            {/* Content Quality */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> Content Quality
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_clear_headings} /> <span>Clear Headings</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_faq_section} /> <span>FAQ Section</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_how_to_content} /> <span>How-To Content</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.content_is_factual} /> <span>Factual Content</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_specific_details} /> <span>Specific Details</span></div>
                              </div>
                            </div>
                            
                            {/* Accessibility */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Accessibility
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_aria_labels} /> <span>ARIA Labels</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_skip_links} /> <span>Skip Links</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.form_labels_ok} /> <span>Form Labels</span></div>
                              </div>
                            </div>
                            
                            {/* Content Extraction */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">Crawl Friendliness</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.content_in_html} /> <span>Content in HTML</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.avoids_infinite_scroll} /> <span>No Infinite Scroll</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_clear_content_boundaries} /> <span>Clear Boundaries</span></div>
                              </div>
                            </div>
                            
                            {/* Citation Readiness */}
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                <Quote className="w-3 h-3" /> Citation Readiness
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_author_info} /> <span>Author Info</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_publish_date} /> <span>Publish Date</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_last_updated} /> <span>Last Updated</span></div>
                                <div className="flex items-center gap-2 text-xs"><BoolCheck value={audit.has_sources_citations} /> <span>Sources/Citations</span></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Issues & Recommendations */}
                          {((audit.issues && audit.issues.length > 0) || (audit.recommendations && audit.recommendations.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              {audit.issues && audit.issues.length > 0 && (
                                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                  <p className="text-xs font-medium text-red-700 uppercase mb-2">Issues ({audit.issues.length})</p>
                                  <IssuesList items={audit.issues} type="issue" />
                                </div>
                              )}
                              {audit.recommendations && audit.recommendations.length > 0 && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                  <p className="text-xs font-medium text-blue-700 uppercase mb-2">Recommendations ({audit.recommendations.length})</p>
                                  <IssuesList items={audit.recommendations} type="recommendation" />
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Audit info + link */}
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-gray-500">
                              Audited: {formatDate(audit.audited_at)} | Rating: <span className="font-medium capitalize">{audit.ai_rating?.replace('_', ' ')}</span>
                            </span>
                            <Link href={audit.slug} target="_blank"
                              className="inline-flex items-center gap-1.5 text-xs text-[#406517] hover:underline">
                              <Eye className="w-3.5 h-3.5" /> View page <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Text size="sm" className="text-gray-500 text-center !mb-0">{audits.length} pages audited</Text>
    </Stack>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TABS: { id: TabId; label: string; icon: typeof ClipboardList }[] = [
  { id: 'reviews', label: 'Page Reviews', icon: ClipboardList },
  { id: 'seo', label: 'SEO Audit', icon: Globe },
  { id: 'ai', label: 'AI Audit', icon: Bot },
]

export default function AuditDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('reviews')
  
  // Reviews tab state (lifted here for refresh and edit modal)
  const [pages, setPages] = useState<PageReview[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingPage, setEditingPage] = useState<PageReview | null>(null)
  
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/page-reviews')
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setPages(data.pages || [])
      setStats(data.stats || { total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 })
      if (data.message) setError(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => { fetchPages() }, [fetchPages])
  
  const handleSave = async (id: string, status: ReviewStatus, notes: string, revisionItems: string) => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/page-reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          review_status: status,
          review_notes: notes || null,
          revision_items: status === 'needs_revision' ? (revisionItems || null) : null,
        }),
      })
      const data = await res.json()
      if (data.error) { alert('Error saving: ' + data.error); return }
      
      setPages(prev => prev.map(p => p.id === id ? { ...p, ...data.page } : p))
      const updatedPages = pages.map(p => p.id === id ? { ...p, ...data.page } : p)
      setStats({
        total: updatedPages.length,
        pending: updatedPages.filter(p => (p.review_status || 'pending') === 'pending').length,
        complete: updatedPages.filter(p => p.review_status === 'complete').length,
        needs_revision: updatedPages.filter(p => p.review_status === 'needs_revision').length,
        built: updatedPages.filter(p => isPageBuilt(p.migration_status)).length,
      })
      setEditingPage(null)
    } catch (err) {
      alert('Error saving: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Heading level={1} className="!mb-1">Site Audit Dashboard</Heading>
            <Text className="text-gray-500 !mb-0">
              Review pages, track SEO health, and monitor AI readiness
            </Text>
          </div>
          <Button variant="outline" onClick={fetchPages} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Error */}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-yellow-50 !border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" /> <span>{error}</span>
            </div>
          </Card>
        )}
        
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#406517] text-[#406517]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'reviews' && (
          <ReviewsTab
            pages={pages}
            stats={stats}
            loading={loading}
            error={null}
            onEdit={setEditingPage}
            onRefresh={fetchPages}
          />
        )}
        
        {activeTab === 'seo' && <SEOAuditTab />}
        {activeTab === 'ai' && <AIAuditTab />}
      </Stack>
      
      {/* Edit Modal */}
      {editingPage && (
        <EditModal
          page={editingPage}
          onClose={() => setEditingPage(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </Container>
  )
}
