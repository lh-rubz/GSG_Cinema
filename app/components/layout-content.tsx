"use client"

import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/landing-header"
import { Footer } from "@/components/landing-footer"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const showHeaderFooter = !user || user.role === "User"

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  )
} 