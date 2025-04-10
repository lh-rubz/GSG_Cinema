import type React from "react"
interface FormFieldProps {
  label: string
  id: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

export function FormField({ label, id, error, children, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-900 dark:text-white">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

