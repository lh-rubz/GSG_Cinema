"use client"

import { PuffLoader } from "react-spinners"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LoadingFullProps {
  text?: string
}

export default function LoadingFull({ text = "Loading..." }: LoadingFullProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const color = theme === "dark" ? "#ffffff" : "#dc2626" // white for dark, red-600 for light

  // Ensure we only render the loader after mounting (client-side)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm z-50">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            {/* Empty div with same dimensions as loader */}
            <div className="w-[70px] h-[70px]" />
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 animate-pulse">
              {text}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm z-50">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <PuffLoader 
            color={color} 
            size={70}
            speedMultiplier={1.2}
          />
          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 animate-pulse">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}