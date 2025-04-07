"use client"

import { ClipLoader, PacmanLoader, PuffLoader } from "react-spinners"
import { useTheme } from "next-themes"

interface LoadingSpinnerProps {
  size?: number
  fullScreen?: boolean
  text?: string
}

export default function Loading({ 
  size = 40, 
  fullScreen = false,
  text = "Loading..."
}: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const color = theme === "dark" ? "#ef4444" : "#dc2626" // Using red color to match cinema theme

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 dark:bg-black/70 flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <PuffLoader  color={color} size={size} />
          <p className="text-white font-medium">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <ClipLoader color={color} size={size} />
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{text}</p>
    </div>
  )
} 