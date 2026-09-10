import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore, updateThemeClass } from '@/store/uiStore'
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Lightbulb,
  Bookmark,
  Users,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'
import { DropdownMenu, DropdownMenuItem } from './ui/DropdownMenu'
import { toast } from '@/store/toastStore'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const { theme, isSidebarOpen, toggleTheme, toggleSidebar } = useUIStore()
  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    // Sync initial theme
    updateThemeClass(theme)
  }, [theme])

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Users & Admins', path: '/users', icon: Users },
  ]

  const handleLogout = () => {
    logout()
    toast({
      title: 'Logged out successfully',
      message: 'You have been signed out of your session.',
      variant: 'success',
    })
    navigate('/login')
  }

  // Helper to extract breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    if (paths.length === 0) return [{ name: 'Dashboard', path: '/' }]
    return [
      { name: 'Dashboard', path: '/' },
      ...paths.map((p, idx) => {
        const path = `/${paths.slice(0, idx + 1).join('/')}`
        const name = p.charAt(0).toUpperCase() + p.slice(1)
        return { name, path }
      }),
    ]
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`relative z-20 flex flex-col border-r border-border bg-card transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">
              MI
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                MorningInsight
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer / Collapse Trigger */}
        <div className="border-t border-border p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {getBreadcrumbs().map((bc, idx, arr) => (
              <React.Fragment key={bc.path}>
                {idx > 0 && <span className="text-muted-foreground">/</span>}
                {idx === arr.length - 1 ? (
                  <span className="text-foreground font-semibold">{bc.name}</span>
                ) : (
                  <Link to={bc.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {bc.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Topbar actions (Theme, Profile) */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu
              align="right"
              trigger={
                <div className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-xs font-semibold leading-none">{user?.name || user?.username || 'Admin User'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{user?.email}</p>
                  </div>
                </div>
              }
            >
              <div className="px-3 py-2 border-b border-border md:hidden">
                <p className="text-xs font-semibold leading-none">{user?.name || user?.username || 'Admin User'}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/15">
                <LogOut className="mr-2 h-4 w-4 shrink-0" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
