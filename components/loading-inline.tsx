"use client";

import { useEffect, useState } from "react"

interface LoadingProps {
  text?: string
  className?: string
  loaderColor?: string
}

export function Loading({ text = "Loading...", className, loaderColor = "#ffffff" }: LoadingProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const baseClasses = "flex flex-col items-center justify-center gap-4 py-16"
  const containerClasses = className ? `${baseClasses} ${className}` : baseClasses

  if (!isClient) {
    return (
      <div className={containerClasses}>
        <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-red-500 dark:border-t-red-400 rounded-full animate-spin" />
        <p className="text-zinc-600 dark:text-zinc-400">{text}</p>
      </div>
    )
  }

  return (
    <div className={containerClasses}>
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-red-500 dark:border-t-red-400 rounded-full animate-spin" />
      <p className="text-zinc-600 dark:text-zinc-400">{text}</p>
    </div>
  )
}