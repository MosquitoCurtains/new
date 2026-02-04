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
  Badge,
} from '@/lib/design-system'

// Mock project data (would come from database)
interface Project {
  id: string
  name: string
  productType: 'mosquito_curtains' | 'clear_vinyl' | 'both'
  status: 'draft' | 'quoted' | 'ordered' | 'shipped' | 'delivered'
  totalWidth: number
  estimatedTotal: number
  createdAt: string
  updatedAt: string
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_001',
    name: 'Back Patio Enclosure',
    productType: 'mosquito_curtains',
    status: 'quoted',
    totalWidth: 35,
    estimatedTotal: 1450,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-20',
  },
  {
    id: 'proj_002',
    name: 'Garage Screen',
    productType: 'mosquito_curtains',
    status: 'draft',
    totalWidth: 16,
    estimatedTotal: 680,
    createdAt: '2026-01-28',
    updatedAt: '2026-01-28',
  },
]

function ProjectCard({ project }: { project: Project }) {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Clock },
    quoted: { label: 'Quote Ready', color: 'bg-blue-100 text-blue-700', icon: Package },
    ordered: { label: 'Ordered', color: 'bg-yellow-100 text-yellow-700', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Package },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  }

  const status = statusConfig[project.status]
  const StatusIcon = status.icon

  const productLabels = {
    mosquito_curtains: 'Mosquito Curtains',
    clear_vinyl: 'Clear Vinyl',
    both: 'Both Products',
  }

  return (
    <Card variant="elevated" hover className="!p-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Heading level={4} className="!mb-1">{project.name}</Heading>
            <Text size="sm" className="text-gray-500">
              {productLabels[project.productType]} • {project.totalWidth} ft
            </Text>
          </div>
          <Badge className={`${status.color} !border-0`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <Text size="sm" className="text-gray-500">Estimated Total</Text>
            <Text className="font-semibold text-[#406517]">
              ${project.estimatedTotal.toLocaleString()}
            </Text>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/my-projects/${project.id}`}>
              View Details
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo, show mock projects if email contains "demo"
    if (searchQuery.toLowerCase().includes('demo')) {
      setProjects(MOCK_PROJECTS)
      setSearchedEmail(searchQuery)
    } else {
      setProjects([])
      setSearchedEmail(searchQuery)
    }

    setIsSearching(false)
  }

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
                Look up your saved projects by entering the email or phone number 
                you used when starting your project.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Email or phone number"
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

        {/* Search Results */}
        {searchedEmail && (
          <section>
            {projects.length > 0 ? (
              <Stack gap="md">
                <div className="flex items-center justify-between">
                  <div>
                    <Heading level={3} className="!mb-1">Your Projects</Heading>
                    <Text className="text-gray-500">
                      Found {projects.length} project{projects.length !== 1 ? 's' : ''} for {searchedEmail}
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
            ) : (
              <Card className="!p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <Heading level={3} className="!mb-2">No Projects Found</Heading>
                <Text className="text-gray-600 mb-6">
                  We couldn't find any projects associated with "{searchedEmail}". 
                  Try a different email or phone number, or start a new project.
                </Text>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" asChild>
                    <Link href="/start-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Project
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:7706454745">
                      Call for Help
                    </a>
                  </Button>
                </div>
              </Card>
            )}
          </section>
        )}

        {/* Help Section */}
        {!searchedEmail && (
          <section>
            <Card variant="outlined" className="!p-6">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                <div>
                  <Heading level={3} className="!mb-2">Need Help?</Heading>
                  <Text className="text-gray-600">
                    If you can't find your project or need assistance, our planning team 
                    is happy to help. Call us or start a new project.
                  </Text>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline" asChild>
                    <a href="tel:7706454745">
                      Call (770) 645-4745
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

        {/* Demo Note */}
        <Card variant="outlined" className="!p-4 !bg-blue-50 !border-blue-200">
          <Text size="sm" className="text-blue-800">
            <strong>Demo:</strong> Try searching for "demo@example.com" to see sample projects.
          </Text>
        </Card>
      </Stack>
    </Container>
  )
}
