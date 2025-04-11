"use client"

import { ReactNode } from "react"

interface ActivityItemProps {
  title: string
  description: string
  icon: ReactNode
  time: string
}

export function ActivityItem({ title, description, icon, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {time}
        </p>
      </div>
    </div>
  )
} 