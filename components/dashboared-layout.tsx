'use client'

import { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  userRole: 'Admin' | 'Staff'
  userName?: string
  userImage?: string
}

export function DashboardLayout({ 
  children, 
  userRole, 
  userName, 
  userImage 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppSidebar 
        userRole={userRole} 
        userName={userName} 
        userImage={userImage} 
      />
      <main className="md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
