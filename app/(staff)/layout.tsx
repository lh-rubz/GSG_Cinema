"use client"


import { useRouter } from "next/navigation"
import { useEffect } from "react"
import CinemaSpinner from "@/components/cinema-spinner"
import { useAuth } from "@/hooks/use-auth"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    } else if (user.role === "User") {
      router.push("/profile")
    } else if (user.role === "Admin") {
      router.push("/admin")
    }
  }, [user, router])

  if (!user) {
    return <CinemaSpinner fullScreen text="Checking permissions..." />
  }

  if (user.role === "User" || user.role === "Admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {children}
    </div>
  )
} 