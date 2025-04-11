'use client'

import { useAuth } from '@/hooks/use-auth'
import { User, LayoutDashboard, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function UserFAB() {
  const { user, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-4 bg-red-600 dark:bg-zinc-800 text-white rounded-full shadow-lg hover:bg-red-700 dark:hover:bg-zinc-700 transition-all"
        aria-label="User menu"
      >
        <User className="h-5 w-5" />
        <span className="sr-only">User menu</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-xl border border-red-100 dark:border-zinc-700 min-w-[180px]">
          <div className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 border-b border-red-50 dark:border-zinc-700">
            {user?.displayName || user?.username}
          </div>
          
          {user?.role === 'Admin' && (
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-zinc-700 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
          
          {user?.role === 'Staff' && (
            <Link 
              href="/staff" 
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-zinc-700 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Staff Dashboard
            </Link>
          )}
          
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-zinc-700 rounded transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <LockKeyhole className="h-4 w-4" />
            My Account
          </Link>
        </div>
      )}
    </div>
  )
}