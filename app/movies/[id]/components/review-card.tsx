"use client"

import { useState } from "react"
import { HeartIcon, SendIcon, ChevronDown, ChevronUp, MoreHorizontal, Flag, MessageSquare } from "lucide-react"
import { StarRating } from "./star-rating"
import { Review, Reply, User } from "@/types/types"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "react-hot-toast"
import Link from "next/link"

interface ReviewCardProps {
  review: {
    id: string;
    movieId: string;
    userId: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
    likedBy: {
      id: string;
      username: string;
      displayName: string | null;
      profileImage: string | null;
    }[];
    replies: {
      id: string;
      userId: string;
      comment: string;
      date: string;
      reportedBy: string[];
      user: {
        id: string;
        username: string;
        displayName: string | null;
        profileImage: string | null;
      };
    }[];
    reportedBy: string[];
    user: {
      id: string;
      username: string;
      displayName: string | null;
      profileImage: string | null;
    };
  };
  onReviewUpdated?: () => void;
  defaultVisibleReplies?: number;
}

export function ReviewCard({ 
  review, 
  onReviewUpdated,
  defaultVisibleReplies = 2
}: ReviewCardProps) {
  const { user, isAuthenticated } = useAuth()
  const [newReply, setNewReply] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  // Count replies for this review
  const replyCount = review.replies?.length || 0

  // Count likes for this review
  const likeCount = review.likes || 0
  const isLiked = user && review.likedBy ? review.likedBy.some(likedUser => likedUser.id === user.id) : false
  const isReportedByUser = user && review.reportedBy ? review.reportedBy.includes(user.id) : false

  const visibleReplies = showAllReplies 
    ? review.replies || []
    : (review.replies || []).slice(0, defaultVisibleReplies)

  const handleAddReply = async () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true)
      return
    }

    if (!newReply.trim()) return

    setIsReplying(true)
    try {
      const response = await fetch(`/api/reviews/${review.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          userId: user?.id,
          comment: newReply.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add reply")
      }

      const newReplyData = await response.json()
      
      // Immediately add the new reply to the local state
      const updatedReplies = [...(review.replies || []), {
        ...newReplyData,
        user: user // Add the current user info to the reply
      }]
      
      // Update the review object with the new replies
      review.replies = updatedReplies
      
      setNewReply("")
      setShowReplyForm(false)
      onReviewUpdated?.()
      toast.success("Reply added successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add reply")
    } finally {
      setIsReplying(false)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true)
      return
    }

    if (!user) return

    setIsLiking(true)
    try {
      if (isLiked) {
        // Unlike the review
        const response = await fetch(`/api/reviews/${review.id}/like?userId=${user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to unlike review")
        }

        // Update local state
        review.likes = (review.likes || 0) - 1
        if (review.likedBy) {
          review.likedBy = review.likedBy.filter(likedUser => likedUser.id !== user.id)
        }
      } else {
        // Like the review
        const response = await fetch(`/api/reviews/${review.id}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to like review")
        }

        // Update local state
        review.likes = (review.likes || 0) + 1
        if (!review.likedBy) {
          review.likedBy = []
        }
        review.likedBy.push({
          id: user.id,
          username: user.username,
          displayName: user.displayName || null,
          profileImage: user.profileImage || null
        })
      }

      onReviewUpdated?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update like")
    } finally {
      setIsLiking(false)
    }
  }

  const handleReport = async (type: 'review' | 'reply', id: string) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true)
      return
    }

    try {
      const response = await fetch(`/api/reviews/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to report content")
      }

      onReviewUpdated?.()
      toast.success("Content reported successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to report content")
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
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-zinc-100 dark:border-zinc-800 p-6 mb-6">
      {/* Review Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          {review.user.profileImage ? (
            <img
              src={review.user.profileImage}
              alt={review.user.displayName || review.user.username || "User"}
              className="h-10 w-10 rounded-full border-2 border-white dark:border-zinc-800 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-white dark:border-zinc-800 bg-red-600 flex items-center justify-center text-white font-semibold">
              {review.user.displayName ? review.user.displayName.charAt(0).toUpperCase() : 
               review.user.username ? review.user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">
                {review.user.displayName || review.user.username || "User"}
              </h3>
              <div className="flex items-center mt-1 gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setShowMoreMenu(showMoreMenu === `review-${review.id}` ? null : `review-${review.id}`)}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </button>

                {showMoreMenu === `review-${review.id}` && (
                  <div className="absolute right-0 top-8 z-10 bg-white dark:bg-zinc-800 shadow-lg rounded-md p-1 w-40 border border-zinc-200 dark:border-zinc-700">
                    <button 
                      onClick={() => handleReport('review', review.id)}
                      disabled={isReportedByUser}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center rounded-sm ${isReportedByUser ? 'text-zinc-400 dark:text-zinc-500' : 'text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      {isReportedByUser ? 'Reported' : 'Report Review'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="ml-[52px]">
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{review.comment}</p>

        {/* Review Actions */}
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 h-8 px-2 rounded-md ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-500'}`}
          >
            <HeartIcon className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-medium">{likeCount}</span>
          </button>

          <button 
            onClick={() => {
              if (!isAuthenticated) {
                setShowLoginPopup(true)
                return
              }
              setShowReplyForm(!showReplyForm)
            }}
            className="flex items-center gap-1.5 h-8 px-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">{replyCount}</span>
          </button>

          {replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 h-8 px-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-blue-500 ml-auto"
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
        {isAuthenticated && showReplyForm && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-zinc-50 dark:bg-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-200 dark:border-zinc-700 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
            />
            <button
              onClick={handleAddReply}
              disabled={!newReply.trim() || isReplying}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Replies Section */}
        {replyCount > 0 && showReplies && (
          <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 relative">
            <div className={`space-y-4 ${showAllReplies && replyCount > defaultVisibleReplies ? 'max-h-[300px] overflow-y-auto pr-2' : ''}`}>
              {visibleReplies.map((reply) => {
                const isReplyReportedByUser = user && reply.reportedBy ? reply.reportedBy.includes(user.id) : false

                return (
                  <div key={reply.id} className="group relative pt-2">
                    <div className="flex items-start gap-2">
                      {reply.user.profileImage ? (
                        <img
                          src={reply.user.profileImage}
                          alt={reply.user.displayName || reply.user.username || "User"}
                          className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-700 bg-red-600 flex items-center justify-center text-white text-xs font-semibold">
                          {reply.user.displayName ? reply.user.displayName.charAt(0).toUpperCase() : 
                           reply.user.username ? reply.user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                              {reply.user.displayName || reply.user.username || "User"}
                            </h4>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {formatDate(reply.date)}
                            </span>
                            {isReplyReportedByUser && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-red-500 text-red-500">
                                Reported
                              </span>
                            )}
                          </div>

                          {isAuthenticated && (
                            <div className="relative">
                              <button
                                onClick={() => setShowMoreMenu(showMoreMenu === `reply-${reply.id}` ? null : `reply-${reply.id}`)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                              >
                                <MoreHorizontal className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                              </button>

                              {showMoreMenu === `reply-${reply.id}` && (
                                <div className="absolute right-0 top-6 z-10 bg-white dark:bg-zinc-800 shadow-lg rounded-md p-1 w-40 border border-zinc-200 dark:border-zinc-700">
                                  <button 
                                    onClick={() => handleReport('reply', reply.id)}
                                    disabled={isReplyReportedByUser}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center rounded-sm ${isReplyReportedByUser ? 'text-zinc-400 dark:text-zinc-500' : 'text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                                  >
                                    <Flag className="h-4 w-4 mr-2" />
                                    {isReplyReportedByUser ? 'Reported' : 'Report Reply'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{reply.comment}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Show More/Less Toggle */}
            {replyCount > defaultVisibleReplies && (
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
                    Show all {replyCount} replies
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Sign In Required</h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Please sign in to perform this action
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md"
              >
                Cancel
              </button>
              <Link
                href="/signin"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}