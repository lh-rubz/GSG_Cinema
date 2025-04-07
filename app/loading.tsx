"use client"

import { PuffLoader } from "react-spinners"
import { useTheme } from "next-themes"

export default function Loading() {
  const { theme } = useTheme()
  const color = theme === "dark" ? "#ffffff" : "#dc2626" // white for dark, red-600 for light

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/70 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <PuffLoader color={color} size={60} />
        <p className="text-gray-900 dark:text-white font-medium">Loading...</p>
      </div>
    </div>
  )
}