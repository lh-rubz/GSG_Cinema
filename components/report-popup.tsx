"use client"

import { useState } from "react"
import { X, Flag } from "lucide-react"

interface ReportPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  contentType: 'review' | 'reply'
  isSubmitting?: boolean
}

const REPORT_REASONS = [
  "Spam or misleading content",
  "Inappropriate language or behavior",
  "Harassment or bullying",
  "False information",
  "Off-topic content",
  "Copyright violation",
  "Other"
]

export function ReportPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contentType, 
  isSubmitting = false 
}: ReportPopupProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason
    if (!reason.trim()) return
    
    onSubmit(reason)
    // Reset form after submit
    setSelectedReason("")
    setCustomReason("")
  }

  const isSubmitDisabled = !selectedReason || (selectedReason === "Other" && !customReason.trim()) || isSubmitting

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-red-50/50 to-zinc-50/50 dark:from-red-900/20 dark:to-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Report {contentType}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-zinc-700/80 transition-colors disabled:opacity-50 backdrop-blur-sm"
          >
            <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
            Please select a reason for reporting this {contentType}:
          </p>

          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-900/10 cursor-pointer transition-all duration-200 border border-transparent hover:border-red-200/50 dark:hover:border-red-700/30"
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  disabled={isSubmitting}
                  className="text-red-600 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 scale-110"
                />
                <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          {/* Custom reason input */}
          {selectedReason === "Other" && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50/30 to-zinc-50/30 dark:from-red-900/10 dark:to-zinc-800/20 rounded-lg border border-red-200/30 dark:border-red-700/20">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={isSubmitting}
                placeholder="Please specify the reason..."
                className="w-full p-4 text-sm border border-red-200/50 dark:border-red-700/30 rounded-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 disabled:opacity-50 transition-all"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                {customReason.length}/500 characters
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-50/30 to-red-50/30 dark:from-zinc-800/30 dark:to-red-900/10">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-700/80 rounded-lg transition-all duration-200 disabled:opacity-50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-600/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                Reporting...
              </div>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
