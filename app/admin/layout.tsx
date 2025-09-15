"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminLayout from "@/components/admin-layout"
import LoadingFull from "@/components/loading-full"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to signin if not authenticated
        router.push("/signin")
        return
      }

      if (user?.role !== "Admin") {
        // Redirect to 403 page if not admin
        router.push("/403")
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingFull />
  }

  // Don't render anything if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "Admin") {
    return <LoadingFull />
  }

  return <AdminLayout>{children}</AdminLayout>
}

