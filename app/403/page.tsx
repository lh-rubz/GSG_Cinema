"use client"

import Link from "next/link"
import { HomeIcon, Lock, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function ForbiddenPage() {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null)
  const rows = 6
  const seatsPerRow = 8
  const { user } = useAuth()

  const getMessage = () => {
    return {
      title: "Restricted Access Area",
      description: "This section is strictly limited to authorized personnel only. Unauthorized access is prohibited.",
      buttonText: user ? "Back to Dashboard" : "Sign In",
      buttonIcon: user ? Shield : Lock,
      buttonHref: user ? "/" : "/signin"
    }
  }

  const message = getMessage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4 transition-colors duration-300">
      {/* Screen */}
      <div className="w-full max-w-2xl h-12 bg-gradient-to-b from-zinc-400 to-transparent dark:from-zinc-600 mb-12 rounded-t-full [perspective:800px] [transform:rotateX(60deg)]" />

      {/* Cinema seats */}
      <div className="mb-12 relative">
        <div className="grid grid-cols-8 gap-2">
          {[...Array(rows * seatsPerRow)].map((_, index) => {
            const isErrorSeat = index === 19 || index === 20 || index === 27 || index === 28
            const isHovered = hoveredSeat === index

            return (
              <div
                key={index}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg cursor-pointer transition-all duration-200
                  ${isErrorSeat
                    ? "bg-rose-600 hover:bg-rose-500 dark:bg-red-600 dark:hover:bg-red-500"
                    : "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  }
                  ${isHovered ? "-translate-y-1" : ""}
                  shadow-[0_3px_0_rgba(0,0,0,0.15)]
                  dark:shadow-[0_3px_0_rgba(0,0,0,0.3)]
                `}
                onMouseEnter={() => setHoveredSeat(index)}
                onMouseLeave={() => setHoveredSeat(null)}
              />
            )
          })}
        </div>

        {/* 403 overlay on seats */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-7xl font-bold text-zinc-400/70 dark:text-zinc-800/50">403</h1>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">{message.title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          {message.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 dark:bg-red-600 dark:hover:bg-red-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Lobby
          </Link>

          <Link
            href={message.buttonHref}
            className="inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-3 px-6 rounded-md font-medium transition-colors border border-zinc-600 dark:border-zinc-700"
          >
            <message.buttonIcon className="w-5 h-5" />
            {message.buttonText}
          </Link>
        </div>
      </div>
    </div>
  )
}

