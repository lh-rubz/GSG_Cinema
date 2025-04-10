import { Review } from "@/types/types"
import { ReviewCard } from "./review-card"
import { replies } from "@/data/replies"
import { users } from "@/data/users"
import { ReviewForm } from "./review-form"
import { useState } from "react"

interface ReviewsTabProps {
  reviews: Review[]
  movieId: string
  userId: string
}

export function ReviewsTab({ reviews, movieId, userId }: ReviewsTabProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [currentReviews, setCurrentReviews] = useState(reviews)

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    // Refresh reviews
    fetch(`/api/reviews?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => setCurrentReviews(data))
      .catch(err => console.error("Failed to refresh reviews:", err))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm 
            movieId={movieId}
            userId={userId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      {currentReviews.length > 0 ? (
        <div className="space-y-8">
          {currentReviews.map(review => (
            <ReviewCard key={review.id} review={review} replies={replies} users={users} />
          ))}
        </div>
      ) : (
        <NoReviewsMessage />
      )}
    </div>
  )
}

function NoReviewsMessage() {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-zinc-600 dark:text-zinc-400">No reviews yet</h3>
      <p className="text-zinc-500 dark:text-zinc-500">Be the first to review this movie</p>
    </div>
  )
}