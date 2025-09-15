"use client"

import { useState, useEffect } from "react"
import { Flag, User, MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, RefreshCw, Filter } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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

export default function StaffReportedCommentsPage() {
  const [reports, setReports] = useState<ReportedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'RESOLVED' | 'DISMISSED'>('PENDING')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Check staff access
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'Staff') {
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

  const handleDismissReport = async (reportId: string) => {
    try {
      setIsProcessing(reportId)
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          action: 'dismiss',
          adminId: user?.id,
        }),
      })

      if (response.ok) {
        toast.success("Report dismissed successfully")
        fetchReports() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to dismiss report")
      }
    } catch (error) {
      console.error("Error dismissing report:", error)
      toast.error("Failed to dismiss report")
    } finally {
      setIsProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            Pending Review
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        )
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
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

  if (!isAuthenticated || !user || user.role !== 'Staff') {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl"></div>
        <div className="relative p-6 rounded-2xl border border-blue-200/20 dark:border-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <Flag className="h-8 w-8 text-blue-600" />
                Reported Comments
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Review and manage user-reported content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>
              <button
                onClick={fetchReports}
                className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Content */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading reports...</div>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <Flag className="h-16 w-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              No {selectedStatus.toLowerCase()} reports
            </h3>
            <p className="text-zinc-500 dark:text-zinc-500 max-w-md mx-auto">
              {selectedStatus === 'PENDING' 
                ? "Great! All reported content has been reviewed. The community is behaving well." 
                : `No ${selectedStatus.toLowerCase()} reports found. Try switching to a different status filter.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
                        {report.contentType === 'REVIEW' ? 'Review Report' : 'Reply Report'}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Reported on {formatDate(report.reportDate)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                {/* Reporter Information */}
                <div className="mb-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Reported by:
                  </h4>
                  <div className="flex items-center gap-3">
                    {report.reporter.profileImage ? (
                      <img
                        src={report.reporter.profileImage}
                        alt={report.reporter.displayName}
                        className="h-8 w-8 rounded-full border-2 border-blue-200 dark:border-blue-700"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {report.reporter.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {report.reporter.displayName}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        @{report.reporter.username}
                      </div>
                    </div>
                  </div>
                  {report.reason && (
                    <div className="mt-3 p-3 bg-white/60 dark:bg-zinc-800/60 rounded-lg">
                      <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Reason:</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{report.reason}</div>
                    </div>
                  )}
                </div>

                {/* Reported Content */}
                <div className="mb-6 p-4 bg-gradient-to-r from-zinc-50 to-blue-50/30 dark:from-zinc-800/50 dark:to-blue-900/10 rounded-xl border-l-4 border-blue-500">
                  {report.contentType === 'REVIEW' && report.review ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Review Content</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-full">
                            {report.review.rating}/5 ⭐
                          </span>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full">
                          {report.review.movie.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <span>By {report.review.user.displayName}</span>
                        <span>•</span>
                        <span>@{report.review.user.username}</span>
                      </div>
                      
                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                          "{report.review.comment}"
                        </p>
                      </div>
                    </div>
                  ) : report.contentType === 'REPLY' && report.reply ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Reply Content</h4>
                        <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full">
                          {report.reply.review.movie.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <span>By {report.reply.user.displayName}</span>
                        <span>•</span>
                        <span>@{report.reply.user.username}</span>
                      </div>
                      
                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                          "{report.reply.comment}"
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Actions - Only show for pending reports */}
                {report.status === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <button
                      onClick={() => handleDismissReport(report.id)}
                      disabled={isProcessing === report.id}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isProcessing === report.id
                          ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:shadow-md'
                      }`}
                    >
                      {isProcessing === report.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-400"></div>
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {isProcessing === report.id ? 'Processing...' : 'Dismiss Report'}
                    </button>
                    
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                      <strong>Note:</strong> Staff can dismiss reports. For content removal, contact an administrator.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
