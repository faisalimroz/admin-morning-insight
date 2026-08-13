import React from 'react'
import {
  useUsersList,
  useUpdateUser,
  useDeleteUser,
  useCreateAdmin,
  type UserItem
} from '@/hooks/useUsers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/Dialog'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from '@/store/toastStore'
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users as UsersIcon,
  Mail,
  Lock,
  User
} from 'lucide-react'

type UserTab = 'directory' | 'create-admin'

export function Users() {
  const [activeTab, setActiveTab] = React.useState<UserTab>('directory')

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 8

  // Modal States
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null)

  // Edit Form Fields
  const [editUsername, setEditUsername] = React.useState('')
  const [editEmail, setEditEmail] = React.useState('')
  const [editRole, setEditRole] = React.useState('user')

  // Create Admin Form Fields
  const [adminName, setAdminName] = React.useState('')
  const [adminUsername, setAdminUsername] = React.useState('')
  const [adminEmail, setAdminEmail] = React.useState('')
  const [adminPassword, setAdminPassword] = React.useState('')
  const [adminConfirmPassword, setAdminConfirmPassword] = React.useState('')
  const [isCreatingAdmin, setIsCreatingAdmin] = React.useState(false)

  // Queries
  const { data: users, isLoading, error } = useUsersList()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const createAdminMutation = useCreateAdmin()

  const isMutating = updateMutation.isPending || deleteMutation.isPending

  // Reset pagination when searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Open Edit User
  const handleEditClick = (user: UserItem) => {
    setSelectedUser(user)
    setEditUsername(user.username || '')
    setEditEmail(user.email || '')
    setEditRole(user.role || 'user')
    setIsEditOpen(true)
  }

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !editUsername || !editEmail) return

    try {
      await updateMutation.mutateAsync({
        id: selectedUser._id,
        data: {
          username: editUsername,
          email: editEmail,
          role: editRole,
        },
      })
      toast({
        title: 'User updated',
        description: `Successfully modified ${editUsername}'s account.`,
        variant: 'success',
      })
      setIsEditOpen(false)
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Update failed',
        description: err.response?.data?.message || err.message || 'An error occurred.',
        variant: 'destructive',
      })
    }
  }

  // Open Delete User
  const handleDeleteClick = (user: UserItem) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  // Confirm Delete User
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    try {
      await deleteMutation.mutateAsync(selectedUser._id)
      toast({
        title: 'User deleted',
        description: 'Account has been removed from the registry.',
        variant: 'success',
      })
      setIsDeleteOpen(false)
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Delete failed',
        description: err.response?.data?.message || err.message || 'An error occurred.',
        variant: 'destructive',
      })
    }
  }

  // Create Admin Submit
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminName || !adminUsername || !adminEmail || !adminPassword) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all the required fields.',
        variant: 'destructive',
      })
      return
    }

    if (adminPassword !== adminConfirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'The passwords do not match.',
        variant: 'destructive',
      })
      return
    }

    setIsCreatingAdmin(true)
    try {
      await createAdminMutation.mutateAsync({
        name: adminName,
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
      })

      toast({
        title: 'Admin created!',
        description: `Successfully registered new administrator "${adminUsername}".`,
        variant: 'success',
      })

      // Reset fields
      setAdminName('')
      setAdminUsername('')
      setAdminEmail('')
      setAdminPassword('')
      setAdminConfirmPassword('')
      setActiveTab('directory')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Admin creation failed',
        description: err.response?.data?.message || err.message || 'An error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  // Filter users
  const filteredUsers = React.useMemo(() => {
    if (!users) return []
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  // Paginated users
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  const totalPages = Math.max(Math.ceil(filteredUsers.length / itemsPerPage), 1)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users & Admins Registry</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage user directories, roles, profiles, and register secondary admin console logins.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card/50 p-1.5 rounded-lg max-w-sm">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <UsersIcon className="h-4 w-4 shrink-0" />
          Directory
        </button>
        <button
          onClick={() => setActiveTab('create-admin')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'create-admin'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          Create Admin
        </button>
      </div>

      {/* View Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'directory' ? (
          <div className="space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username, email, role..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* List */}
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading registry...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-sm text-destructive font-semibold">Failed to load users.</p>
                    <p className="text-xs text-muted-foreground mt-1">Verify you are authenticated as an admin.</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-sm font-semibold">No users found.</p>
                    <p className="text-xs mt-0.5">Try a different search query or register new admins.</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-semibold">{user.username}</TableCell>
                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                  user.role === 'admin'
                                    ? 'bg-purple-950 text-purple-200 border border-purple-800'
                                    : 'bg-zinc-800 text-zinc-300'
                                }`}
                              >
                                {user.role || 'user'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(user)}
                                  title="Edit role/info"
                                >
                                  <Edit className="h-4 w-4 text-blue-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(user)}
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4 text-rose-400" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-border px-6 py-4">
                        <div className="text-xs text-muted-foreground font-semibold">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
                          {filteredUsers.length} users
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-xs font-mono font-bold">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Create Admin Form */
          <Card className="max-w-md border border-border">
            <CardContent className="pt-6">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="admin-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-name"
                      placeholder="Jane Doe"
                      className="pl-10"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      disabled={isCreatingAdmin}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="admin-username">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-username"
                      placeholder="janedoe"
                      className="pl-10"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      disabled={isCreatingAdmin}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="admin-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="jane.doe@morninginsight.com"
                      className="pl-10"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={isCreatingAdmin}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="admin-password">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      disabled={isCreatingAdmin}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="admin-confirm">
                    Confirm Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-confirm"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      disabled={isCreatingAdmin}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isCreatingAdmin}>
                  {isCreatingAdmin ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    'Register Admin User'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>Change system configuration details for this user account.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="edit-username">
              Username
            </label>
            <Input
              id="edit-username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              disabled={isMutating}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="edit-email">
              Email Address
            </label>
            <Input
              id="edit-email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              disabled={isMutating}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="edit-role">
              User Role
            </label>
            <select
              id="edit-role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus:outline-none disabled:opacity-50"
              disabled={isMutating}
            >
              <option value="user">Standard User</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogHeader>
          <DialogTitle>Revoke & Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete this user account? This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-destructive/10 p-3 border border-destructive/20 rounded text-sm text-destructive font-semibold my-2">
          Deauthorizing: {selectedUser?.username} ({selectedUser?.email})
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revoking...
              </>
            ) : (
              'Revoke Account'
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
