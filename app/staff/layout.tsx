"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Ticket, LayoutDashboard, Menu, X, LogOut } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/staff",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Movies",
      href: "/staff/movies",
      icon: <Film className="h-5 w-5" />,
    },
    {
      label: "Tickets",
      href: "/staff/tickets",
      icon: <Ticket className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/staff" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Cinema Staff</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? "bg-primary text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                S
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Staff User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">staff@cinema.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-800">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}

