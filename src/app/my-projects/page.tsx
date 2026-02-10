'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  FolderOpen,
  ArrowRight,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  Plus,
  Truck,
  ExternalLink,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface Salesperson {
  id: string
  name: string
  email: string
}

interface Project {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  product_type: string
  status: string
  share_token: string
  estimated_total: number | null
  created_at: string
  updated_at: string
  staff?: Salesperson | Salesperson[] | null
}

interface TrackingNumber {
  id: string
  tracking_number: string
  carrier: string | null
  tracking_url: string | null
}

interface CustomerNote {
  id: string
  content: string
  created_at: string
}

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  total: number
  payment_status: string | null
  created_at: string
  salesperson_name: string | null
  tracking_numbers: TrackingNumber[]
  customer_notes: CustomerNote[]
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const PROJECT_STATUS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: 'Submitted', color: 'bg-gray-100 text-gray-700', icon: Clock },
  new: { label: 'Submitted', color: 'bg-gray-100 text-gray-700', icon: Clock },
  need_photos: { label: 'Photos Needed', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  need_measurements: { label: 'Measurements Needed', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  working_on_quote: { label: 'Quote in Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  quote_sent: { label: 'Quote Ready', color: 'bg-green-100 text-green-700', icon: Package },
  quote_viewed: { label: 'Quote Ready', color: 'bg-green-100 text-green-700', icon: Package },
  need_decision: { label: 'Quote Ready', color: 'bg-green-100 text-green-700', icon: Package },
  order_placed: { label: 'Order Placed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500', icon: AlertCircle },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-500', icon: AlertCircle },
}

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  'on-hold': { label: 'On Hold', color: 'bg-orange-100 text-orange-700' },
  'on-hold-waiting': { label: 'On Hold', color: 'bg-orange-100 text-orange-700' },
  'pending': { label: 'Pending', color: 'bg-blue-100 text-blue-700' },
  'processing': { label: 'Processing', color: 'bg-green-100 text-green-700' },
  'diagrams-uploaded': { label: 'In Progress', color: 'bg-green-100 text-green-700' },
  'in-production': { label: 'In Production', color: 'bg-gray-100 text-gray-700' },
  'cut': { label: 'In Production', color: 'bg-gray-100 text-gray-700' },
  'resting': { label: 'In Production', color: 'bg-gray-100 text-gray-700' },
  'sewing': { label: 'In Production', color: 'bg-gray-100 text-gray-700' },
  'qc': { label: 'Quality Check', color: 'bg-gray-100 text-gray-700' },
  'shipped': { label: 'Shipped', color: 'bg-teal-100 text-teal-700' },
  'completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  'refunded': { label: 'Refunded', color: 'bg-purple-100 text-purple-700' },
}

function formatMoney(val: number | null) {
  if (val == null) return '$0.00'
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// =============================================================================
// PROJECT CARD
// =============================================================================

function ProjectCard({ project }: { project: Project }) {
  const statusConfig = PROJECT_STATUS[project.status] || PROJECT_STATUS.draft
  const StatusIcon = statusConfig.icon
  const salesperson = Array.isArray(project.staff) ? project.staff[0] : project.staff

  const productLabels: Record<string, string> = {
    curtains: 'Mosquito Curtains',
    clear_vinyl: 'Clear Vinyl',
    raw_netting: 'Raw Netting',
    rollup_shades: 'Roll-Up Shades',
  }

  const hasQuote = ['quote_sent', 'quote_viewed', 'need_decision'].includes(project.status)

  return (
    <Card variant="elevated" hover className="!p-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Heading level={4} className="!mb-1">
              {project.first_name} {project.last_name}
            </Heading>
            <Text size="sm" className="text-gray-500">
              {productLabels[project.product_type] || project.product_type}
            </Text>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </span>
        </div>

        {salesperson && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <User className="w-3 h-3" />
            <span>Planner: {salesperson.name}</span>
            <a href={`mailto:${salesperson.email}`} className="text-[#406517] hover:underline">
              {salesperson.email}
            </a>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {project.estimated_total && project.estimated_total > 0 ? (
              <>
                <Text size="sm" className="text-gray-500">Estimated Total</Text>
                <Text className="font-semibold text-[#406517]">
                  {formatMoney(project.estimated_total)}
                </Text>
              </>
            ) : (
              <Text size="sm" className="text-gray-400">
                Created {formatDate(project.created_at)}
              </Text>
            )}
          </div>
          {hasQuote ? (
            <Button variant="primary" size="sm" asChild>
              <Link href={`/project/${project.share_token}`}>
                View Quote <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <Text size="sm" className="text-gray-400">
              {formatDate(project.updated_at)}
            </Text>
          )}
        </div>
      </div>
    </Card>
  )
}

// =============================================================================
// ORDER CARD
// =============================================================================

function OrderCard({ order }: { order: Order }) {
  const statusConfig = ORDER_STATUS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }

  return (
    <Card variant="elevated" className="!p-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Heading level={4} className="!mb-0.5">{order.order_number}</Heading>
            <Text size="sm" className="text-gray-500">{formatDate(order.created_at)}</Text>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <div className="text-lg font-bold text-gray-900 mt-1">{formatMoney(order.total)}</div>
          </div>
        </div>

        {/* Tracking Numbers */}
        {order.tracking_numbers.length > 0 && (
          <div className="space-y-1 mb-3">
            {order.tracking_numbers.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-xs">
                <Truck className="w-3 h-3 text-teal-600" />
                {t.tracking_url ? (
                  <a href={t.tracking_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline flex items-center gap-1">
                    {t.tracking_number}
                    {t.carrier && <span className="text-gray-400">({t.carrier})</span>}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-600">
                    {t.tracking_number}
                    {t.carrier && <span className="text-gray-400"> ({t.carrier})</span>}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Customer Notes */}
        {order.customer_notes.length > 0 && (
          <div className="space-y-1 mb-3">
            {order.customer_notes.map((note) => (
              <div key={note.id} className="bg-blue-50 rounded p-2 text-xs text-blue-800">
                {note.content}
              </div>
            ))}
          </div>
        )}

        {order.salesperson_name && (
          <Text size="sm" className="text-gray-400">
            Planner: {order.salesperson_name}
          </Text>
        )}
      </div>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)

    try {
      const res = await fetch(`/api/my-projects?email=${encodeURIComponent(searchQuery.trim())}`)
      const data = await res.json()

      if (res.ok) {
        setProjects(data.projects || [])
        setOrders(data.orders || [])
        setSearchedEmail(searchQuery.trim())
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Failed to search. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const hasResults = projects.length > 0 || orders.length > 0

  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Header */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-[#406517]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                My Projects
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                Look up your saved projects and orders by entering the email
                you used when starting your project.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Your email address"
                    className="!pl-10"
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Error */}
        {error && (
          <Card className="!p-4 !bg-red-50 !border-red-200">
            <Text size="sm" className="text-red-800">{error}</Text>
          </Card>
        )}

        {/* Search Results */}
        {searchedEmail && (
          <>
            {hasResults ? (
              <>
                {/* Projects Section */}
                {projects.length > 0 && (
                  <section>
                    <Stack gap="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <Heading level={3} className="!mb-1">Your Projects</Heading>
                          <Text className="text-gray-500">
                            {projects.length} project{projects.length !== 1 ? 's' : ''} found
                          </Text>
                        </div>
                        <Button variant="primary" asChild>
                          <Link href="/start-project">
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                          </Link>
                        </Button>
                      </div>

                      <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                        {projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </Grid>
                    </Stack>
                  </section>
                )}

                {/* Orders Section */}
                {orders.length > 0 && (
                  <section>
                    <Stack gap="md">
                      <div>
                        <Heading level={3} className="!mb-1">Your Orders</Heading>
                        <Text className="text-gray-500">
                          {orders.length} order{orders.length !== 1 ? 's' : ''}
                        </Text>
                      </div>

                      <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                        {orders.map((order) => (
                          <OrderCard key={order.id} order={order} />
                        ))}
                      </Grid>
                    </Stack>
                  </section>
                )}
              </>
            ) : (
              <Card className="!p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <Heading level={3} className="!mb-2">No Projects Found</Heading>
                <Text className="text-gray-600 mb-6">
                  We couldn&apos;t find any projects associated with &ldquo;{searchedEmail}&rdquo;.
                  Try a different email, or start a new project.
                </Text>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/start-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Project
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+18883649870">
                      Call for Help
                    </a>
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Help Section */}
        {!searchedEmail && (
          <section>
            <Card variant="outlined" className="!p-6">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                <div>
                  <Heading level={3} className="!mb-2">Need Help?</Heading>
                  <Text className="text-gray-600">
                    If you can&apos;t find your project or need assistance, our planning team
                    is happy to help. Call us or start a new project.
                  </Text>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline" asChild>
                    <a href="tel:+18883649870">
                      <Phone className="w-4 h-4 mr-2" />
                      Call (888) 364-9870
                    </a>
                  </Button>
                  <Button variant="primary" asChild>
                    <Link href="/start-project">
                      Start New Project
                    </Link>
                  </Button>
                </div>
              </Grid>
            </Card>
          </section>
        )}
      </Stack>
    </Container>
  )
}
