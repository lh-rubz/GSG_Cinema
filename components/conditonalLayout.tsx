
"use client"
import { usePathname } from "next/navigation"
import { Footer } from "./landing-footer"
import Header from "./landing-header"
import { UserFAB } from "./user-fab"

// Client component that handles the conditional rendering
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    // Check if the current path includes /admin or /staff
    const isAdminOrStaffRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/staff')
  
    return (
      <>
      {!isAdminOrStaffRoute && <UserFAB/>}
        {!isAdminOrStaffRoute && <Header />}
        {children}
        {!isAdminOrStaffRoute && <Footer />}
      </>
    )
  }