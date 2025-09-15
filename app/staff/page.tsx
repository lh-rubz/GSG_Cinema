"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function StaffLanding() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated === false) {
        router.push("/403")
      } else if (isAuthenticated && user && user.role !== "Staff") {
        router.push("/403")
      } else if (isAuthenticated && user && user.role === "Staff") {
        // Redirect to dashboard
        router.push("/staff/dashboard")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
