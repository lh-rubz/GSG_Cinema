"use client"

import { useState } from "react"
import { HeartIcon, SendIcon, ChevronDown, ChevronUp, MoreHorizontal, Flag, MessageSquare } from "lucide-react"
import { StarRating } from "./star-rating"
import { Review, Reply, User } from "@/types/types"

interface ReviewCardProps {
  review: Review
  replies: Reply[]
  users: User[]
  currentUserId?: string
  onAddReply?: (reviewId: string, comment: string) => void
  onLikeReview?: (reviewId: string) => void
  onReportContent?: (type: 'review' | 'reply', id: string) => void
  defaultVisibleReplies?: number
}

export function ReviewCard({ 
  review, 
  replies = [], 
  users = [], 
  currentUserId,
  onAddReply,
  onLikeReview,
  onReportContent,
  defaultVisibleReplies = 2
}: ReviewCardProps) {
  const author = users.find(user => user.id === review.userId)
  const [newReply, setNewReply] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null)

  const reviewReplies = replies.filter(reply => review.replies.includes(reply.id))
  const isLiked = currentUserId ? review.likedBy.includes(currentUserId) : false
  const isReportedByUser = currentUserId ? review.reportedBy.includes(currentUserId) : false

  const visibleReplies = showAllReplies 
    ? reviewReplies 
    : reviewReplies.slice(0, defaultVisibleReplies)

  const handleAddReply = () => {
    if (newReply.trim() && onAddReply) {
      onAddReply(review.id, newReply)
      setNewReply("")
      setShowReplyForm(false)
    }
  }

  const handleLike = () => {
    if (onLikeReview) {
      onLikeReview(review.id)
    }
  }

  const handleReport = (type: 'review' | 'reply', id: string) => {
    if (onReportContent) {
      onReportContent(type, id)
    }
    setShowMoreMenu(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-800 p-6 mb-6">
      {/* Review Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <img
            src={author?.profileImage || "/placeholder.svg"}
            alt={author?.username || "User"}
            className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{author?.username}</h3>
              <div className="flex items-center mt-1 gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(showMoreMenu === `review-${review.id}` ? null : `review-${review.id}`)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showMoreMenu === `review-${review.id}` && (
                <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-md p-1 w-40 border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => handleReport('review', review.id)}
                    disabled={isReportedByUser}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center rounded-sm ${isReportedByUser ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {isReportedByUser ? 'Reported' : 'Report Review'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* Review Content */}
      <div className="ml-[52px]">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{review.comment}</p>

        {/* Review Actions */}
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 h-8 px-2 rounded-md ${isLiked ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`}
          >
            <HeartIcon className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">{review.likedBy.length}</span>
          </button>

          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 h-8 px-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">{reviewReplies.length}</span>
          </button>

          {reviewReplies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 h-8 px-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-500 ml-auto"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Hide replies</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-xs font-medium">Show replies</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-700 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
            />
            <button
              onClick={handleAddReply}
              disabled={!newReply.trim()}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Replies Section */}
        {reviewReplies.length > 0 && showReplies && (
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 relative">
            <div className={`space-y-4 ${showAllReplies && reviewReplies.length > defaultVisibleReplies ? 'max-h-[300px] overflow-y-auto pr-2' : ''}`}>
              {visibleReplies.map((reply: Reply) => {
                const replyAuthor = users.find(user => user.id === reply.userId)
                const isReplyReportedByUser = currentUserId ? reply.reportedBy.includes(currentUserId) : false

                return (
                  <div key={reply.id} className="group relative pt-2">
                    <div className="flex items-start gap-2">
                      <img
                        src={replyAuthor?.profileImage || "/placeholder.svg"}
                        alt={replyAuthor?.username || "User"}
                        className="h-7 w-7 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {replyAuthor?.username}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(reply.date)}
                            </span>
                            {isReplyReportedByUser && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-red-500 text-red-500">
                                Reported
                              </span>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setShowMoreMenu(showMoreMenu === `reply-${reply.id}` ? null : `reply-${reply.id}`)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                              <MoreHorizontal className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            </button>

                            {showMoreMenu === `reply-${reply.id}` && (
                              <div className="absolute right-0 top-6 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-md p-1 w-40 border border-gray-200 dark:border-gray-700">
                                <button 
                                  onClick={() => handleReport('reply', reply.id)}
                                  disabled={isReplyReportedByUser}
                                  className={`w-full text-left px-3 py-2 text-sm flex items-center rounded-sm ${isReplyReportedByUser ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                  <Flag className="h-4 w-4 mr-2" />
                                  {isReplyReportedByUser ? 'Reported' : 'Report Reply'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{reply.comment}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Show More/Less Toggle */}
            {reviewReplies.length > defaultVisibleReplies && (
              <button
                onClick={() => setShowAllReplies(!showAllReplies)}
                className="mt-2 text-sm text-blue-500 hover:underline flex items-center"
              >
                {showAllReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show fewer
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show all {reviewReplies.length} replies
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}