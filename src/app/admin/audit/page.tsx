'use client'

/**
 * Simple Page Review Dashboard
 * 
 * Clean workflow: Look at page → Add notes → Mark Complete or Needs Revision
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2,
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
  // Audit scores (from dashboard view)
  seo_score?: number | null
  ai_score?: number | null
  performance_score?: number | null
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

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical': return '!bg-red-100 !text-red-700 !border-red-200'
    case 'high': return '!bg-orange-100 !text-orange-700 !border-orange-200'
    case 'medium': return '!bg-blue-100 !text-blue-700 !border-blue-200'
    case 'low': return '!bg-gray-100 !text-gray-600 !border-gray-200'
    default: return '!bg-gray-100 !text-gray-600 !border-gray-200'
  }
}

const getPageTypeLabel = (pageType: string) => {
  const labels: Record<string, string> = {
    homepage: 'Homepage',
    product_landing: 'Product',
    seo_landing: 'SEO Landing',
    category: 'Category',
    informational: 'Info',
    legal: 'Legal',
    support: 'Support',
    marketing: 'Marketing',
    ecommerce: 'E-commerce',
    admin: 'Admin',
    utility: 'Utility',
  }
  return labels[pageType] || pageType
}

const isPageBuilt = (status: string) => status === 'live'

const getScoreColor = (score: number | null | undefined) => {
  if (score === null || score === undefined) return 'text-gray-400'
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

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
// COMPONENTS
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

function EditModal({ 
  page, 
  onClose, 
  onSave,
  saving,
}: { 
  page: PageReview
  onClose: () => void
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-lg">{page.title}</h2>
            <p className="text-sm text-gray-500 font-mono">{page.slug}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* View Page Link */}
          {isBuilt && (
            <Link 
              href={page.slug}
              target="_blank"
              className="flex items-center gap-2 text-[#406517] hover:underline text-sm"
            >
              <Eye className="w-4 h-4" />
              View page in new tab
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          
          {!isBuilt && (
            <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Page not built yet ({page.migration_status})
            </div>
          )}
          
          {/* Audit Scores (if available) */}
          {(page.seo_score || page.ai_score || page.performance_score) && (
            <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className={`text-lg font-bold ${getScoreColor(page.seo_score)}`}>
                  {page.seo_score ?? '--'}
                </p>
                <p className="text-xs text-gray-500">SEO</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${getScoreColor(page.ai_score)}`}>
                  {page.ai_score ?? '--'}
                </p>
                <p className="text-xs text-gray-500">AI</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${getScoreColor(page.performance_score)}`}>
                  {page.performance_score ?? '--'}
                </p>
                <p className="text-xs text-gray-500">Perf</p>
              </div>
            </div>
          )}
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {(['pending', 'complete', 'needs_revision'] as ReviewStatus[]).map((s) => {
                const info = getStatusInfo(s)
                const isSelected = status === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? `${info.bg} ${info.border} ${info.text}` 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
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
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this page..."
              className="!min-h-[80px]"
            />
          </div>
          
          {/* Revision Items (only show if needs revision) */}
          {status === 'needs_revision' && (
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                What needs to be fixed?
              </label>
              <Textarea
                value={revisionItems}
                onChange={(e) => setRevisionItems(e.target.value)}
                placeholder="- Item 1&#10;- Item 2&#10;- Item 3"
                className="!min-h-[100px] !border-orange-200 focus:!border-orange-400"
              />
              <p className="text-xs text-gray-500 mt-1">Use bullet points for each item</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={() => onSave(page.id, status, notes, revisionItems)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PageReviewDashboard() {
  const [pages, setPages] = useState<PageReview[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | ReviewStatus>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterBuilt, setFilterBuilt] = useState<'all' | 'built' | 'not_built'>('all')
  const [editingPage, setEditingPage] = useState<PageReview | null>(null)
  
  // Fetch pages from API
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/page-reviews')
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setPages(data.pages || [])
      setStats(data.stats || { total: 0, pending: 0, complete: 0, needs_revision: 0, built: 0 })
      
      if (data.message) {
        setError(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchPages()
  }, [fetchPages])
  
  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const pageReviewStatus = page.review_status || 'pending'
    const matchesStatus = filterStatus === 'all' || pageReviewStatus === filterStatus
    const matchesCategory = filterCategory === 'all' || page.page_type === filterCategory
    const isBuilt = isPageBuilt(page.migration_status)
    const matchesBuilt = filterBuilt === 'all' || 
                         (filterBuilt === 'built' && isBuilt) ||
                         (filterBuilt === 'not_built' && !isBuilt)
    return matchesSearch && matchesStatus && matchesCategory && matchesBuilt
  })
  
  // Get unique page types
  const pageTypes = [...new Set(pages.map(p => p.page_type))].sort()
  
  // Handle save
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
      
      if (data.error) {
        alert('Error saving: ' + data.error)
        return
      }
      
      // Update local state
      setPages(prev => prev.map(p => p.id === id ? { ...p, ...data.page } : p))
      
      // Recalculate stats
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
            <Heading level={1} className="!mb-1">Page Reviews</Heading>
            <Text className="text-gray-500 !mb-0">
              Review each page, add notes, mark complete or needs revision
            </Text>
          </div>
          <Button variant="outline" onClick={fetchPages} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Error Message */}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-yellow-50 !border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}
        
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
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!pl-9 !py-2"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="needs_revision">Needs Revision</option>
            </select>
            
            {/* Page Type Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20"
            >
              <option value="all">All Types</option>
              {pageTypes.map(type => (
                <option key={type} value={type}>{getPageTypeLabel(type)}</option>
              ))}
            </select>
            
            {/* Migration Status Filter */}
            <select
              value={filterBuilt}
              onChange={(e) => setFilterBuilt(e.target.value as typeof filterBuilt)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/20"
            >
              <option value="all">All Migration</option>
              <option value="built">Live</option>
              <option value="not_built">Not Started</option>
            </select>
          </div>
        </Card>
        
        {/* Loading State */}
        {loading && pages.length === 0 && (
          <Card variant="elevated" className="!p-8">
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading pages...</span>
            </div>
          </Card>
        )}
        
        {/* Pages Table */}
        {!loading && pages.length === 0 && !error && (
          <Card variant="elevated" className="!p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <Text className="text-gray-500 !mb-2">No pages found</Text>
            <Text size="sm" className="text-gray-400 !mb-0">
              Run migration <code className="bg-gray-100 px-1 rounded">20260205000007_simple_page_reviews.sql</code> to populate pages
            </Text>
          </Card>
        )}
        
        {pages.length > 0 && (
          <Card variant="elevated" className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider">Page</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-32">Built</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-32">Review</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-20 hidden sm:table-cell">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider hidden lg:table-cell">Notes</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-24 hidden md:table-cell">Updated</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-black uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPages.map((page) => {
                    const reviewStatus = page.review_status || 'pending'
                    const statusInfo = getStatusInfo(reviewStatus)
                    const StatusIcon = statusInfo.icon
                    
                    // Migration status badge
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
                    
                    return (
                      <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="min-w-0">
                            <p className="font-medium text-black truncate">{page.title}</p>
                            <p className="text-xs text-black/70 font-mono truncate">{page.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${migrationBadge.className} text-xs whitespace-nowrap`}>
                            {migrationBadge.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label.split(' ')[0]}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-sm text-black">{page.migration_priority}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-sm text-black truncate max-w-xs">
                            {page.review_notes || <span className="text-black/40">-</span>}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-black">{formatDate(page.updated_at)}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditingPage(page)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black hover:text-black"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
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
        
        {/* Results count */}
        {pages.length > 0 && (
          <Text size="sm" className="text-black text-center !mb-0">
            Showing {filteredPages.length} of {pages.length} pages
          </Text>
        )}
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
