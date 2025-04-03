
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/landing-header"
import { Footer } from "@/components/landing-footer"
import { Providers } from "./providers"

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
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.className} dark:bg-black dark:text-white bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <Providers>
          <Header/>{children}<Footer/></Providers>
      </body>
    </html>
  )
}

