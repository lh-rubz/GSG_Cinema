"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Users, User, Video, Cast, MonitorPlay, Ticket, LayoutDashboard, Menu, X, LogOut, Calendar, Tag } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { useAuth } from "@/hooks/use-auth"


interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems: NavItem[] = [
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
  ]

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'Admin')

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-700">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? "bg-red-600 text-white" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                {user?.displayName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.displayName || 'Admin User'}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{user?.email || 'admin@cinema.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={() => logout()} 
                className="rounded-md p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-between px-4 lg:px-6">
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
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

