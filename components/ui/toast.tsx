"use client"

import * as React from "react"

export type ToastActionElement = React.ReactElement<any>

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & ToastProps
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`${className || ''} toast toast-${variant}`}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

export { Toast }
