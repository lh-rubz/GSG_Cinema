"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/403')
      return
    }

    if (user.role === 'User') {
      router.push('/profile')
      return
    }

    if (user.role === 'Staff' && !window.location.pathname.startsWith('/staff')) {
      router.push('/staff')
      return
    }

    if (user.role === 'Admin' && !window.location.pathname.startsWith('/admin')) {
      router.push('/admin')
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user || user.role === 'User') {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {children}
    </div>
  )
} 