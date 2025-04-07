"use client"

import { PuffLoader } from "react-spinners"
import { useTheme } from "next-themes"

export default function LoadingFull() {
  const { theme } = useTheme()
  const color = theme === "dark" ? "#ffffff" : "#dc2626" // white for dark, red-600 for light

  return (
    <div className="fixed inset-0 w-full h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm z-50">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center gap-4 p-8 ">
          <PuffLoader 
            color={color} 
            size={70}
            speedMultiplier={1.2}
          />
          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  )
}