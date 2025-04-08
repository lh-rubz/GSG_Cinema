"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { PulseLoader, SyncLoader, ClipLoader } from "react-spinners"

interface CinemaSpinnerProps {
  size?: number
  fullScreen?: boolean
  text?: string
  type?: "pulse" | "sync" | "clip"
}

export default function CinemaSpinner({
  size = 15,
  fullScreen = false,
  text = "Loading...",
  type = "pulse",
}: CinemaSpinnerProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) return null

  // Cinema theme colors - red for both light and dark modes
  const color = theme === "dark" ? "#ef4444" : "#dc2626" // Red in both modes

  // Choose the spinner based on type
  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return <PulseLoader color={color} size={size} />
      case "sync":
        return <SyncLoader color={color} size={size} />
      case "clip":
        return <ClipLoader color={color} size={size * 2} /> // ClipLoader is smaller visually
      default:
        return <PulseLoader color={color} size={size} />
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-white/10 backdrop-blur-sm">
          {renderSpinner()}
          <p className="text-white font-medium">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {renderSpinner()}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{text}</p>
    </div>
  )
} 