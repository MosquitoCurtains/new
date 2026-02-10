'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Plus,
  Save,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  UserPlus,
  X,
  Shield,
  KeyRound,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface StaffMember {
  id: string
  name: string
  first_name: string | null
  last_name: string | null
  email: string
  role: string
  is_active: boolean
  auth_user_id: string | null
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'sales', label: 'Sales' },
  { value: 'production', label: 'Production' },
]

const ROLE_COLORS: Record<string, string> = {
  superadmin: '!bg-purple-100 !text-purple-700 !border-purple-200',
  admin: '!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30',
  sales: '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30',
  production: '!bg-teal-100 !text-teal-700 !border-teal-200',
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false)

  // New member form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('sales')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    try {
      const params = showInactive ? '' : '?active=true'
      const res = await fetch(`/api/admin/staff${params}`)
      const data = await res.json()
      setStaff(data.staff || [])
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    } finally {
      setLoading(false)
    }
  }, [showInactive])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  // --- Create staff ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim()) return
    setCreating(true)
    setCreateError(null)
    try {
      const payload: Record<string, string> = {
        first_name: newFirstName.trim(),
        last_name: newLastName.trim(),
        email: newEmail,
        role: newRole,
      }
      if (newPassword.trim()) payload.password = newPassword.trim()

      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setStaff((prev) => [...prev, data.staff])
        setNewFirstName('')
        setNewLastName('')
        setNewEmail('')
        setNewPassword('')
        setNewRole('sales')
        setShowAddForm(false)
      } else {
        setCreateError(data.error || 'Failed to create staff member')
      }
    } catch (err) {
      setCreateError('Network error')
    } finally {
      setCreating(false)
    }
  }

  // --- Start editing ---
  const startEdit = (member: StaffMember) => {
    setEditingId(member.id)
    setEditFirstName(member.first_name ?? member.name?.split(' ')[0] ?? '')
    setEditLastName(member.last_name ?? member.name?.split(' ').slice(1).join(' ') ?? '')
    setEditEmail(member.email)
    setEditRole(member.role)
  }

  // --- Save edit ---
  const handleSaveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/staff/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName.trim(),
          last_name: editLastName.trim(),
          email: editEmail,
          role: editRole,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStaff((prev) =>
          prev.map((s) => (s.id === editingId ? data.staff : s))
        )
        setEditingId(null)
      }
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }

  // --- Toggle active ---
  const handleToggleActive = async (member: StaffMember) => {
    try {
      const res = await fetch(`/api/admin/staff/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !member.is_active }),
      })
      const data = await res.json()
      if (data.success) {
        if (!showInactive && !data.staff.is_active) {
          // Remove from list if we're hiding inactive
          setStaff((prev) => prev.filter((s) => s.id !== member.id))
        } else {
          setStaff((prev) =>
            prev.map((s) => (s.id === member.id ? data.staff : s))
          )
        }
      }
    } catch (err) {
      console.error('Failed to toggle active:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="!mb-1">Staff Management</Heading>
              <Text className="text-gray-600">
                Manage salespeople and team members. Staff appear in the sales page project bar.
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Show inactive
              </label>
              <Button variant="outline" size="sm" onClick={fetchStaff}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Add Staff
              </Button>
            </div>
          </div>
        </section>

        {/* Add New Form */}
        {showAddForm && (
          <section>
            <Card variant="elevated" className="!p-4 !border-[#406517]/30">
              <div className="flex items-center justify-between mb-3">
                <Text size="sm" className="font-semibold text-gray-700 !mb-0">New Staff Member</Text>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="First name *"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <input
                    type="text"
                    placeholder="Last name *"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="Password (creates login account)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <Button type="submit" variant="primary" size="sm" disabled={creating || !newFirstName.trim() || !newLastName.trim() || !newEmail.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                </div>
                {!newPassword.trim() && (
                  <Text size="sm" className="text-gray-400 !mb-0">
                    No password = staff record only (no login). Add a password to create an auth account.
                  </Text>
                )}
              </form>
              {createError && (
                <Text size="sm" className="text-red-600 mt-2 !mb-0">{createError}</Text>
              )}
            </Card>
          </section>
        )}

        {/* Staff Table */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">First</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Auth</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Added</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        Loading staff...
                      </td>
                    </tr>
                  ) : staff.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No staff members found. Click &quot;Add Staff&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    staff.map((member) => (
                      <tr key={member.id} className={`hover:bg-gray-50 transition-colors ${!member.is_active ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          {editingId === member.id ? (
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded text-sm w-full"
                            />
                          ) : (
                            <Text className="font-medium text-gray-900 !mb-0">{member.first_name ?? member.name?.split(' ')[0] ?? '-'}</Text>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === member.id ? (
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded text-sm w-full"
                            />
                          ) : (
                            <Text className="font-medium text-gray-900 !mb-0">{member.last_name ?? member.name?.split(' ').slice(1).join(' ') ?? '-'}</Text>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === member.id ? (
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded text-sm w-full"
                            />
                          ) : (
                            <Text size="sm" className="text-gray-600 !mb-0">{member.email}</Text>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === member.id ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded text-sm"
                            >
                              {ROLE_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                              ))}
                            </select>
                          ) : (
                            <Badge className={ROLE_COLORS[member.role] || '!bg-gray-100 !text-gray-600 !border-gray-200'}>
                              {ROLE_OPTIONS.find((r) => r.value === member.role)?.label || member.role}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {member.auth_user_id ? (
                            <Badge className="!bg-green-100 !text-green-700 !border-green-200">
                              <Shield className="w-3 h-3 mr-1" /> Linked
                            </Badge>
                          ) : (
                            <Badge className="!bg-amber-50 !text-amber-600 !border-amber-200">
                              <KeyRound className="w-3 h-3 mr-1" /> No login
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {member.is_active ? (
                            <Badge className="!bg-green-100 !text-green-700 !border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          ) : (
                            <Badge className="!bg-gray-100 !text-gray-500 !border-gray-200">
                              <XCircle className="w-3 h-3 mr-1" /> Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Text size="sm" className="text-gray-500 !mb-0">
                            {formatDate(member.created_at)}
                          </Text>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingId === member.id ? (
                              <>
                                <Button variant="primary" size="sm" onClick={handleSaveEdit} disabled={saving}>
                                  <Save className="w-3.5 h-3.5 mr-1" />
                                  {saving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => startEdit(member)}>
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleActive(member)}
                                  title={member.is_active ? 'Deactivate' : 'Reactivate'}
                                >
                                  {member.is_active ? (
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Help */}
        <section>
          <Card variant="outlined" className="!p-4">
            <Text size="sm" className="text-gray-600 !mb-0">
              Staff members with the <strong>Sales</strong> role appear in the salesperson dropdown on the sales page.
              Provide a password when creating staff to create a login account (Auth: Linked).
              Staff without a login can still be assigned to projects and orders.
              Deactivated staff are hidden from dropdowns but their name still appears on existing orders.
            </Text>
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
