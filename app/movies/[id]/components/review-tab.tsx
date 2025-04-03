import { Review } from "@/types/types"
import { ReviewCard } from "./review-card"
import { replies } from "@/data/replies"
import { users } from "@/data/users"

interface ReviewsTabProps {
  reviews: Review[]
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors">
          Write a Review
        </button>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map(review => (
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
      <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No reviews yet</h3>
      <p className="text-gray-500 dark:text-gray-500">Be the first to review this movie</p>
    </div>
  )
}