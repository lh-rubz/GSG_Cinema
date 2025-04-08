"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, User } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Helper function to determine active link
  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black bg-opacity-95 dark:bg-opacity-95 z-50 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Film className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-red-600  font-bold text-xl">CinemaHub</span>
            </Link>
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/movies') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Movies
              </Link>
              <Link
                href="/showtimes"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/showtimes') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Showtimes
              </Link>
              <Link
                href="/promotions"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/promotions') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Promotions
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle/>
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              >
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-white font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden md:inline">{user.displayName}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}