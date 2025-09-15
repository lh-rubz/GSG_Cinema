"use client"

import { AlertTriangle, Eye, Trash2, UserX, X } from "lucide-react"

interface AdminActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  action: 'dismiss' | 'delete_comment' | 'delete_user_and_comment' | null
  isProcessing: boolean
  reportDetails?: {
    contentType: 'REVIEW' | 'REPLY'
    content: string
    authorName: string
    reporterName: string
    reason?: string
  }
}

export function AdminActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  isProcessing,
  reportDetails 
}: AdminActionModalProps) {
  if (!isOpen || !action) return null

  const actionConfig = {
    dismiss: {
      title: "Dismiss Report",
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      description: "Mark this report as resolved without taking any action on the content.",
      warning: "The reported content will remain visible and the report will be marked as dismissed.",
      buttonText: "Dismiss Report",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      severity: "low"
    },
    delete_comment: {
      title: "Delete Comment",
      icon: <Trash2 className="h-6 w-6 text-red-500" />,
      description: "Permanently remove the reported content from the platform.",
      warning: "This action cannot be undone. The comment will be deleted but the user account will remain active.",
      buttonText: "Delete Comment",
      buttonClass: "bg-red-600 hover:bg-red-700",
      severity: "medium"
    },
    delete_user_and_comment: {
      title: "Delete User & Comment",
      icon: <UserX className="h-6 w-6 text-red-700" />,
      description: "Permanently remove both the user account and all their content from the platform.",
      warning: "This action cannot be undone. The entire user account and all associated content will be permanently deleted.",
      buttonText: "Delete User & Content",
      buttonClass: "bg-red-800 hover:bg-red-900",
      severity: "high"
    }
  }

  const config = actionConfig[action]

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-red-50/30 to-zinc-50/30 dark:from-red-900/10 dark:to-zinc-800/30">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-red-100/80 dark:bg-red-900/30 backdrop-blur-sm">
              {config.icon}
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {config.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-zinc-700/80 transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
          >
            <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            {config.description}
          </p>

          {/* Report Details */}
          {reportDetails && (
            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 mb-2">
                  Reported {reportDetails.contentType.toLowerCase()}:
                </h4>
                <div className="bg-white dark:bg-zinc-800 p-3 rounded border text-sm text-zinc-800 dark:text-zinc-200">
                  "{reportDetails.content}"
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Author:</span>
                  <span className="ml-2 text-zinc-600 dark:text-zinc-400">{reportDetails.authorName}</span>
                </div>
                <div>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Reported by:</span>
                  <span className="ml-2 text-zinc-600 dark:text-zinc-400">{reportDetails.reporterName}</span>
                </div>
              </div>
              
              {reportDetails.reason && (
                <div className="mt-3 text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Reason:</span>
                  <span className="ml-2 text-zinc-600 dark:text-zinc-400">{reportDetails.reason}</span>
                </div>
              )}
            </div>
          )}

          {/* Warning */}
          <div className={`p-4 rounded-lg border-l-4 mb-6 ${
            config.severity === 'high' 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
              : config.severity === 'medium'
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                config.severity === 'high' 
                  ? 'text-red-600' 
                  : config.severity === 'medium'
                  ? 'text-orange-600'
                  : 'text-blue-600'
              }`} />
              <div>
                <h4 className={`font-medium text-sm ${
                  config.severity === 'high' 
                    ? 'text-red-800 dark:text-red-300' 
                    : config.severity === 'medium'
                    ? 'text-orange-800 dark:text-orange-300'
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  {config.severity === 'high' ? 'Critical Action' : config.severity === 'medium' ? 'Warning' : 'Information'}
                </h4>
                <p className={`text-sm mt-1 ${
                  config.severity === 'high' 
                    ? 'text-red-700 dark:text-red-400' 
                    : config.severity === 'medium'
                    ? 'text-orange-700 dark:text-orange-400'
                    : 'text-blue-700 dark:text-blue-400'
                }`}>
                  {config.warning}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-50/30 to-red-50/30 dark:from-zinc-800/30 dark:to-red-900/10">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-zinc-700/80 rounded-lg transition-all duration-200 disabled:opacity-50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-600/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none ${config.buttonClass}`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                Processing...
              </div>
            ) : (
              config.buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
