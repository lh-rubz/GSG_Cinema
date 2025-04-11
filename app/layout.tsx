import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/landing-header"
import { Footer } from "@/components/landing-footer"
import { Providers } from "./providers"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/hooks/use-auth"
import { Suspense } from "react"
import Loading from "./loading"
import { ConditionalLayout } from "@/components/conditonalLayout"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CineHub - Your Ultimate Movie Destination",
  description: "Discover and book tickets for the latest movies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: You can't use hooks directly in the layout component in Next.js 13+
  // So we'll create a client component wrapper for the conditional rendering

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <Suspense fallback={<Loading />}>
        <body
          className={`${inter.className} dark:bg-black dark:text-white bg-white text-gray-900 min-h-screen flex flex-col`}
        >
          <AuthProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Providers>
              <ConditionalLayout>{children}</ConditionalLayout>
            </Providers>
          </AuthProvider>
        </body>
      </Suspense>
    </html>
  )
}

