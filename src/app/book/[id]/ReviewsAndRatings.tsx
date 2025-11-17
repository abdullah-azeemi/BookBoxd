'use client'

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface Review {
  id: string
  content: string
  rating: number
  user: { username: string | null }
}

interface ReviewsAndRatingsProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
}

export default function ReviewsAndRatings({ bookId, bookTitle, bookAuthor }: ReviewsAndRatingsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const userId = "user1" // replace with actual logged-in user id

  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  

  useEffect(() => {
    // Fetch reviews
  fetch(`/api/reviews?bookId=${bookId}`)
    .then(res => res.json())
    .then(data => setReviews(data.reviews || []));

    // Fetch rating summary
  fetch(`/api/ratings?bookId=${bookId}`)
    .then(res => res.json())
    .then(data => {
      setAverageRating(data.average || 0);
      setRatingCount(data.count || 0);
    });
}, [bookId]);

  const submitReview = async () => {
    if (!newReview) return

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: bookId,
        title: bookTitle,
        author: bookAuthor,
        userId,
        content: newReview,
        rating: newRating,
      }),
    })

    setNewReview("")
    setNewRating(5)

    // Refresh reviews
    const reviewsRes = await fetch(`/api/reviews?bookId=${bookId}`)
    const reviewsData = await reviewsRes.json()
    setReviews(reviewsData.reviews || [])
  }

  // Placeholder array to maintain 2-3 empty boxes if no reviews
  const displayReviews = reviews.length ? reviews : Array(3).fill(null)

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Rating & Reviews</h2>

      <div className="space-y-6">
        {displayReviews.map((review, idx) => (
          <article
            key={review?.id || idx}
            className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-start gap-4"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={review ? "/placeholder-user.png" : ""} alt={review?.user.username || "Anonymous"} />
              <AvatarFallback>
                {review ? (review.user.username || "A")[0] : "?"}
              </AvatarFallback>
            </Avatar>

            

            <div className="flex-1">
              {review ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.user.username || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">{review.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <button className="flex items-center gap-1.5 hover:text-blue-500">
                      <ThumbsUp className="w-4 h-4" />0
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500">
                      <ThumbsDown className="w-4 h-4" />0
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-slate-400 dark:text-slate-500 w-full py-8">
                  No reviews yet
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      

      {/* Post Review */}
      <div className="mt-8">
        <textarea
          value={newReview}
          onChange={e => setNewReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex items-center justify-between mt-2">
          <select
            value={newRating}
            onChange={e => setNewRating(parseInt(e.target.value))}
            className="p-2 border rounded-md"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            onClick={submitReview}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </section>
  )
}
