"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Film, Ticket, LayoutDashboard, Menu, X, LogOut, BarChart3, Calendar, Flag } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  // Additional safety check - redirect if not authenticated or not staff
  if (!isAuthenticated || !user || user.role !== 'Staff') {
    router.push('/403')
    return null
  }

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/staff/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Showtimes",
      href: "/staff/showtimes",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Tickets",
      href: "/staff/tickets",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      label: "Reports",
      href: "/staff/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Reported Comments",
      href: "/staff/reported-comments",
      icon: <Flag className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/20">
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
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10">
          <Link href="/staff" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">Staff Portal</span>
          </Link>
          <button className="lg:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === item.href 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-700/50 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 hover:shadow-md"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-white/90 to-blue-50/50 dark:from-zinc-800/90 dark:to-blue-900/10 backdrop-blur-sm">
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.displayName?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {user?.displayName || 'Staff User'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={user?.email || 'staff@cinema.com'}>
                  {user?.email || 'staff@cinema.com'}
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
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

