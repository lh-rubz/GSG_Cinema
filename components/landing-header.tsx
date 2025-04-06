"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"
import { Film } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export default function Header() {
  
  const pathname = usePathname()

  // Helper function to determine active link
  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black bg-opacity-95 dark:bg-opacity-95 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Film className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-white font-bold text-xl">CinemaHub</span>
            </Link>
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/movies') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Movies
              </Link>
              <Link
                href="/showtimes"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/showtimes') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Showtimes
              </Link>
              <Link
                href="/promotions"
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/promotions') 
                    ? 'text-red-600 dark:text-red-500 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Promotions
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
         <ThemeToggle/>
            <Link
              href="/signin"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}