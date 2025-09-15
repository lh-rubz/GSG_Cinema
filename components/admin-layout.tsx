"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Import useRouter for navigation
import { Film, Users, User, Video, Cast, MonitorPlay, Ticket, LayoutDashboard, Menu, X, LogOut, Calendar, Tag, Flag } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { ConfirmDialog } from "./confirm-dialog"
import { usePreferences } from "@/context/PreferencesContext"
import { formatCurrency } from "@/utils/formatters"
import { statsApi, type Stats } from "@/lib/endpoints/stats"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false) // State for confirmation dialog
  const [revenue, setRevenue] = useState(0)
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true)
  const pathname = usePathname()
  const router = useRouter() // Initialize router
  const { user, logout, isAuthenticated } = useAuth()
  const { preferences } = usePreferences()

  // Additional safety check - redirect if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== 'Admin') {
    router.push('/403')
    return null
  }

  // Fetch revenue data
  useEffect(() => {
    async function fetchRevenue() {
      try {
        setIsLoadingRevenue(true)
        const response = await statsApi.getStats()
        if (response.data) {
          setRevenue(response.data.revenue)
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setIsLoadingRevenue(false)
      }
    }

    fetchRevenue()
  }, [])

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Movies",
      href: "/admin/movies",
      icon: <Film className="h-5 w-5" />,
    },
    {
      label: "Showtimes",
      href: "/admin/showtimes",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Staff",
      href: "/admin/staff",
      icon: <Users className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: <User className="h-5 w-5" />,
    },
    {
      label: "Directors",
      href: "/admin/directors",
      icon: <Video className="h-5 w-5" />,
    },
    {
      label: "Cast",
      href: "/admin/cast",
      icon: <Cast className="h-5 w-5" />,
    },
    {
      label: "Screens",
      href: "/admin/screens",
      icon: <MonitorPlay className="h-5 w-5" />,
    },
    {
      label: "Tickets",
      href: "/admin/tickets",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      label: "Promotions",
      href: "/admin/promotions",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: <Flag className="h-5 w-5" />,
      adminOnly: true,
    },
  ]

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'Admin')

  const handleLogout = () => {
    logout() // Call the logout function
    router.push("/signin") // Redirect to the signin page
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-red-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-red-950/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white/90 dark:bg-zinc-800/95 backdrop-blur-md border-r border-zinc-200/50 dark:border-zinc-700/50 shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-red-50/50 to-orange-50/30 dark:from-red-900/10 dark:to-orange-900/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-red-600 dark:text-red-500" />
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">Cinema Admin</span>
          </Link>
          <button className="lg:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === item.href 
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25 scale-105" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-700/50 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 hover:shadow-md"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Total Revenue</p>
            {isLoadingRevenue ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Loading...</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-green-800 dark:text-green-300">
                {formatCurrency(revenue, preferences.currency as 'USD' | 'NIS')}
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 w-full border-t border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-white/90 to-red-50/50 dark:from-zinc-800/90 dark:to-red-900/10 backdrop-blur-sm">
          {/* Theme Toggle and Logout Row */}
          <div className="px-4 py-2 flex items-center justify-center gap-2 border-b border-zinc-200/30 dark:border-zinc-700/30">
            <ThemeToggle />
            <button 
              onClick={() => setIsConfirmDialogOpen(true)}
              className="rounded-lg p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          
          {/* User Info Row */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.displayName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {user?.displayName || 'Admin User'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={user?.email || 'admin@cinema.com'}>
                  {user?.email || 'admin@cinema.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-b from-transparent to-zinc-50/30 dark:to-zinc-900/30">{children}</main>
      </div>

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)} // Close dialog
        onConfirm={handleLogout} // Handle logout on confirm
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

