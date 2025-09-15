"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Users, User, Video, Cast, MonitorPlay, Ticket, Calendar, Menu, X, Home, LogOut } from "lucide-react"

type SidebarItem = {
  title: string
  href: string
  icon: React.ElementType
  roles: ("Admin" | "Staff")[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    roles: ["Admin"],
  },
  {
    title: "Dashboard",
    href: "/staff/dashboard",
    icon: Home,
    roles: ["Staff"],
  },
  {
    title: "Movies",
    href: "/admin/movies",
    icon: Film,
    roles: ["Admin"],
  },
  {
    title: "Movies",
    href: "/staff/movies",
    icon: Film,
    roles: ["Staff"],
  },
  {
    title: "Showtimes",
    href: "/admin/showtimes",
    icon: Calendar,
    roles: ["Admin"],
  },
  {
    title: "Staff",
    href: "/admin/staff",
    icon: Users,
    roles: ["Admin"],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: User,
    roles: ["Admin"],
  },
  {
    title: "Directors",
    href: "/admin/directors",
    icon: Video,
    roles: ["Admin"],
  },
  {
    title: "Cast",
    href: "/admin/cast",
    icon: Cast,
    roles: ["Admin"],
  },
  {
    title: "Screens",
    href: "/admin/screens",
    icon: MonitorPlay,
    roles: ["Admin"],
  },
  {
    title: "Tickets",
    href: "/admin/tickets",
    icon: Ticket,
    roles: ["Admin"],
  },
  {
    title: "Tickets",
    href: "/staff/tickets",
    icon: Ticket,
    roles: ["Staff"],
  },
]

interface AppSidebarProps {
  userRole: "Admin" | "Staff"
  userName?: string
  userImage?: string
}

export function AppSidebar({ userRole, userName = "User", userImage }: AppSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Filter items based on user role
  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole))

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and title */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                userRole === "Admin" 
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              }`}>
                <Film className="h-6 w-6" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-zinc-900 dark:text-white">
                {userRole === "Admin" ? "Cinema Admin" : "Staff Panel"}
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {filteredItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={`${item.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {userImage ? (
                  <img className="h-8 w-8 rounded-full" src={userImage || "/placeholder.svg"} alt={userName} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{userName}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">{userRole}</p>
              </div>
              <button
                className="ml-auto p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
