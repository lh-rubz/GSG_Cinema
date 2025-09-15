"use client"

import { useState, useEffect } from "react"
import { Flag, User, MessageSquare, AlertTriangle, CheckCircle, XCircle, Trash2, UserX, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { AdminActionModal } from "@/components/admin-action-modal"

interface ReportedContent {
  id: string
  reporterId: string
  reason: string | null
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  reportDate: string
  contentType: 'REVIEW' | 'REPLY'
  reviewId: string | null
  replyId: string | null
  reporter: {
    id: string
    username: string
    displayName: string
    email: string
    profileImage: string | null
  }
  review?: {
    id: string
    comment: string
    rating: number
    date: string
    user: {
      id: string
      username: string
      displayName: string
      email: string
      profileImage: string | null
    }
    movie: {
      id: string
      title: string
      image: string | null
    }
  }
  reply?: {
    id: string
    comment: string
    date: string
    user: {
      id: string
      username: string
      displayName: string
      email: string
      profileImage: string | null
    }
    review: {
      movie: {
        id: string
        title: string
        image: string | null
      }
    }
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'RESOLVED' | 'DISMISSED'>('PENDING')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean
    reportId: string
    action: 'dismiss' | 'delete_comment' | 'delete_user_and_comment'
    reportDetails: {
      contentType: 'REVIEW' | 'REPLY'
      content: string
      authorName: string
      reporterName: string
      reason?: string
    }
  } | null>(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'Admin') {
      router.push('/403')
      return
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    fetchReports()
  }, [selectedStatus])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/reports?status=${selectedStatus}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        toast.error("Failed to fetch reports")
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast.error("Failed to fetch reports")
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = (reportId: string, action: 'dismiss' | 'delete_comment' | 'delete_user_and_comment') => {
    const report = reports.find(r => r.id === reportId)
    if (!report) return

    // Prepare report details for the modal
    const reportDetails = {
      contentType: report.contentType,
      content: report.contentType === 'REVIEW' ? report.review?.comment || '' : report.reply?.comment || '',
      authorName: report.contentType === 'REVIEW' 
        ? `${report.review?.user.displayName} (@${report.review?.user.username})`
        : `${report.reply?.user.displayName} (@${report.reply?.user.username})`,
      reporterName: `${report.reporter.displayName} (@${report.reporter.username})`,
      reason: report.reason || undefined
    }

    setActionModal({
      isOpen: true,
      reportId,
      action,
      reportDetails
    })
  }

  const handleConfirmAction = async () => {
    if (!actionModal || !user) return

    try {
      setIsProcessing(actionModal.reportId)
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: actionModal.reportId,
          action: actionModal.action,
          adminId: user.id,
        }),
      })

      if (response.ok) {
        toast.success("Action completed successfully")
        fetchReports() // Refresh the list
        setActionModal(null)
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to process action")
      }
    } catch (error) {
      console.error("Error processing action:", error)
      toast.error("Failed to process action")
    } finally {
      setIsProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        )
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500">
            <XCircle className="h-3 w-3" />
            Dismissed
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isAuthenticated || !user || user.role !== 'Admin') {
    return null
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Flag className="h-6 w-6 text-red-600" />
          Reported Content
        </h1>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-600 dark:border-zinc-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <Flag className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            No {selectedStatus.toLowerCase()} reports
          </h3>
          <p className="text-zinc-500 dark:text-zinc-500">
            {selectedStatus === 'PENDING' ? "All reports have been handled!" : `No ${selectedStatus.toLowerCase()} reports found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                      {report.contentType === 'REVIEW' ? (
                        <MessageSquare className="h-5 w-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Reported {report.contentType.toLowerCase()}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Reported on {formatDate(report.reportDate)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                {/* Reporter Info */}
                <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Reported by:</h4>
                  <div className="flex items-center gap-2">
                    {report.reporter.profileImage ? (
                      <img
                        src={report.reporter.profileImage}
                        alt={report.reporter.displayName}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-semibold">
                        {report.reporter.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {report.reporter.displayName} (@{report.reporter.username})
                    </span>
                  </div>
                  {report.reason && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                      <strong>Reason:</strong> {report.reason}
                    </p>
                  )}
                </div>

                {/* Content Info */}
                <div className="mb-4 p-4 bg-gradient-to-r from-zinc-50 to-red-50/30 dark:from-zinc-700/50 dark:to-red-900/10 rounded-lg border-l-4 border-red-500">
                  {report.contentType === 'REVIEW' && report.review ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Review by:</h4>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {report.review.user.displayName} (@{report.review.user.username})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                          Movie: {report.review.movie.title}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded">
                          Rating: {report.review.rating}/10
                        </span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 p-3 rounded border">
                        "{report.review.comment}"
                      </p>
                    </div>
                  ) : report.contentType === 'REPLY' && report.reply ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reply by:</h4>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {report.reply.user.displayName} (@{report.reply.user.username})
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                          Movie: {report.reply.review.movie.title}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 p-3 rounded border">
                        "{report.reply.comment}"
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                {report.status === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <button
                      onClick={() => handleActionClick(report.id, 'dismiss')}
                      disabled={isProcessing === report.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Eye className="h-4 w-4" />
                      Dismiss Report
                    </button>
                    
                    <button
                      onClick={() => handleActionClick(report.id, 'delete_comment')}
                      disabled={isProcessing === report.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Comment
                    </button>
                    
                    <button
                      onClick={() => handleActionClick(report.id, 'delete_user_and_comment')}
                      disabled={isProcessing === report.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <UserX className="h-4 w-4" />
                      Delete User & Comment
                    </button>
                    
                    {isProcessing === report.id && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Action Modal */}
      <AdminActionModal
        isOpen={actionModal?.isOpen || false}
        onClose={() => setActionModal(null)}
        onConfirm={handleConfirmAction}
        action={actionModal?.action || null}
        isProcessing={isProcessing !== null}
        reportDetails={actionModal?.reportDetails}
      />
    </div>
  )
}
