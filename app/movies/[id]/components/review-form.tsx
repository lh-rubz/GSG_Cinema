"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid'

interface ReviewFormProps {
  movieId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ movieId, onReviewSubmitted }: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow text-center">
        <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
        <p className="text-zinc-600 dark:text-zinc-300 mb-4">
          Please sign in to write a review
        </p>
        <Link
          href="/signin"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!rating) {
      setError("Please select a rating")
      setIsSubmitting(false)
      return
    }

    if (!comment.trim()) {
      setError("Please write a review")
      setIsSubmitting(false)
      return
    }

    if (!user) {
      setError("User not found")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(),
          userId: user.id,
          movieId,
          rating,
          comment,
          date: new Date().toISOString(),
          likes: 0,
          likedBy: [],
          replies: [],
          reportedBy: []
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit review")
      }

      setRating(0)
      setComment("")
      onReviewSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">Rating (out of 5)</label>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1
            const isFilled = (hoveredRating || rating) >= starValue
            
            return (
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(starValue)}
                className="focus:outline-none transition-colors"
              >
                <Star 
                  className={`h-8 w-8 ${isFilled ? 'text-yellow-400 fill-current' : 'text-zinc-300 dark:text-zinc-600'}`}
                  strokeWidth={1}
                />
              </button>
            )
          })}
          {(hoveredRating || rating) > 0 && (
            <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              ({hoveredRating || rating}/5)
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
          placeholder="Write your review here..."
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
} 