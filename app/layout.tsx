import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/landing-header"
import { Footer } from "@/components/landing-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CinemaHub - Your Ultimate Movie Destination",
  description: "Discover and book tickets for the latest movies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} dark:bg-black dark:text-white bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <ThemeProvider><Header/>{children}<Footer/></ThemeProvider>
      </body>
    </html>
  )
}

