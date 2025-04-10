"use client"

import type React from "react"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import Header from "@/components/landing-header"
import { Footer } from "@/components/landing-footer"
import { ThemeProvider } from "@/components/theme-provider"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const showHeaderFooter = !user || user.role === "User"

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
        <Toaster position="bottom-right" reverseOrder={false} />
      </AuthProvider>
    </ThemeProvider>
  )
} 