'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search,
  UserPlus,
  FolderOpen,
  X,
  Mail,
  Phone,
  Copy,
  Check,
  ChevronDown,
  Pencil,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  status: string
  interest: string | null
}

interface Project {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  project_name: string | null
  status: string
  share_token: string
  estimated_total: number | null
  assigned_to: string | null
  notes: string | null
  leads?: Lead | Lead[] | null
}

interface Staff {
  id: string
  name: string
  email: string
  is_active: boolean
}

interface ProjectBarProps {
  mode: string
  selectedProject: Project | null
  selectedSalesperson: Staff | null
  staffList: Staff[]
  onProjectSelected: (project: Project) => void
  onSalespersonChanged: (staff: Staff | null) => void
  onNewProject: (project: Project) => void
  onDetachProject?: () => void
  onEditProject?: () => void
}

// =============================================================================
// PROJECT BAR
// =============================================================================

export default function ProjectBar({
  mode,
  selectedProject,
  selectedSalesperson,
  staffList,
  onProjectSelected,
  onSalespersonChanged,
  onNewProject,
  onDetachProject,
  onEditProject,
}: ProjectBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Project[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // --- Search projects ---
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/admin/sales/projects`)
        const data = await res.json()
        const projects: Project[] = data.projects || []

        // Client-side filter by search query
        const q = searchQuery.toLowerCase()
        const filtered = projects.filter((p) => {
          const lead = Array.isArray(p.leads) ? p.leads[0] : p.leads
          return (
            p.project_name?.toLowerCase().includes(q) ||
            p.email?.toLowerCase().includes(q) ||
            p.first_name?.toLowerCase().includes(q) ||
            p.last_name?.toLowerCase().includes(q) ||
            lead?.email?.toLowerCase().includes(q) ||
            lead?.first_name?.toLowerCase().includes(q) ||
            lead?.last_name?.toLowerCase().includes(q) ||
            lead?.phone?.includes(q)
          )
        })
        setSearchResults(filtered.slice(0, 10))
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCopyLink = useCallback(() => {
    if (!selectedProject) return
    const url = `${window.location.origin}/project/${selectedProject.share_token}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }, [selectedProject])

  const lead = selectedProject?.leads
    ? Array.isArray(selectedProject.leads)
      ? selectedProject.leads[0]
      : selectedProject.leads
    : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      {/* Top row: project selection + salesperson */}
      <div className="flex items-center gap-3 mb-3">
        {/* Project Selector */}
        <div className="flex-1 relative" ref={searchRef}>
          {selectedProject ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <FolderOpen className="w-4 h-4 text-[#003365] flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                {selectedProject.project_name ? (
                  <>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {selectedProject.project_name}
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500 truncate">
                      {selectedProject.first_name} {selectedProject.last_name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {selectedProject.first_name} {selectedProject.last_name} - {selectedProject.product_type}
                  </span>
                )}
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 whitespace-nowrap flex-shrink-0">
                {selectedProject.status.replace(/_/g, ' ')}
              </span>
              {onEditProject && (
                <button
                  onClick={onEditProject}
                  className="p-1 text-gray-400 hover:text-[#003365] transition-colors"
                  title="Edit project"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  if (onDetachProject) {
                    onDetachProject()
                  } else {
                    setShowSearch(true)
                    setSearchQuery('')
                  }
                }}
                className="ml-auto p-1 text-gray-400 hover:text-gray-600"
                title="Detach project"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearch(true)
                  }}
                  onFocus={() => setShowSearch(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20"
                />
              </div>

              {/* Search Dropdown */}
              {showSearch && (searchResults.length > 0 || searching) && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                  {searching ? (
                    <div className="p-3 text-center text-sm text-gray-400">Searching...</div>
                  ) : (
                    searchResults.map((project) => {
                      const pLead = Array.isArray(project.leads) ? project.leads[0] : project.leads
                      return (
                        <button
                          key={project.id}
                          onClick={() => {
                            onProjectSelected(project)
                            setShowSearch(false)
                            setSearchQuery('')
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {project.project_name ? (
                              <>
                                {project.project_name}
                                <span className="text-xs text-gray-400 ml-2">
                                  ({project.first_name || pLead?.first_name} {project.last_name || pLead?.last_name})
                                </span>
                              </>
                            ) : (
                              <>
                                {project.first_name || pLead?.first_name} {project.last_name || pLead?.last_name}
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{project.product_type}</span>
                            <span className="text-gray-300">|</span>
                            <span>{project.email || pLead?.email}</span>
                            <span className="text-gray-300">|</span>
                            <span className="capitalize">{project.status.replace(/_/g, ' ')}</span>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* New Project Button */}
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[#003365] text-white rounded-lg hover:bg-[#002244] transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          New Project
        </button>

        {/* Salesperson Dropdown */}
        <div className="relative min-w-[180px]">
          <select
            value={selectedSalesperson?.id || ''}
            onChange={(e) => {
              const s = staffList.find((s) => s.id === e.target.value)
              onSalespersonChanged(s || null)
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-[#003365]"
          >
            <option value="">Salesperson...</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Selected project info */}
      {selectedProject && (
        <div className="flex items-center gap-6 text-xs text-gray-500">
          {(lead?.email || selectedProject.email) && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{lead?.email || selectedProject.email}</span>
            </div>
          )}
          {(lead?.phone || selectedProject.phone) && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{lead?.phone || selectedProject.phone}</span>
            </div>
          )}
          {selectedProject.share_token && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied!' : 'Copy share link'}</span>
            </button>
          )}
          {selectedProject.estimated_total && selectedProject.estimated_total > 0 && (
            <span className="font-medium text-gray-700">
              Est: ${Number(selectedProject.estimated_total).toFixed(2)}
            </span>
          )}
        </div>
      )}

      {/* New Project Form */}
      {showNewForm && (
        <NewProjectForm
          mode={mode}
          onCreated={(project) => {
            onNewProject(project)
            setShowNewForm(false)
          }}
          onCancel={() => setShowNewForm(false)}
        />
      )}
    </div>
  )
}

// =============================================================================
// NEW PROJECT FORM
// =============================================================================

function NewProjectForm({
  mode,
  onCreated,
  onCancel,
}: {
  mode: string
  onCreated: (project: Project) => void
  onCancel: () => void
}) {
  const [projectName, setProjectName] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [productType, setProductType] = useState(mode === 'mc' ? 'curtains' : mode === 'cv' ? 'clear_vinyl' : mode === 'rn' ? 'raw_netting' : 'rollup_shades')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/sales/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          product_type: productType,
          project_name: projectName || null,
        }),
      })
      const data = await res.json()
      if (data.project) {
        onCreated(data.project)
      }
    } catch (err) {
      console.error('Error creating project:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-gray-100">
      {/* Row 1: Project name (full width) */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Project name (e.g. Smith Patio Enclosure)"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
        />
      </div>
      {/* Row 2: Contact details + create */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
        />
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#003365]"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={creating || !email.trim()}
            className="flex-1 px-3 py-2 text-sm font-medium bg-[#406517] text-white rounded-lg hover:bg-[#335213] disabled:opacity-50 transition-colors"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
