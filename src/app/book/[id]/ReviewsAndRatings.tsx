'use client'  // Only this component is client-side

import { useState, useEffect } from "react"

interface Review {
  id: string
  content: string
  rating: number
  user: { username: string | null }
}

interface RatingSummary {
  average: number
  count: number
}

export default function ReviewsAndRatings({ bookId, bookTitle, bookAuthor }: { bookId: string, bookTitle: string, bookAuthor: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState<RatingSummary>({ average: 0, count: 0 })
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const userId = "user1" // todo: replace with actual logged-in user id

  useEffect(() => {
    fetch(`/api/reviews?bookId=${bookId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))

    fetch(`/api/ratings?bookId=${bookId}`)
      .then(res => res.json())
      .then(data => setAvgRating(data || { average: 0, count: 0 }))
  }, [bookId])

  const submitReview = async () => {
    if (!newReview) return

    console.log({ bookId, bookTitle, bookAuthor });

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

    const reviewsRes = await fetch(`/api/reviews?bookId=${bookId}`)
    const reviewsData = await reviewsRes.json()
    setReviews(reviewsData.reviews || [])

    const ratingRes = await fetch(`/api/ratings?bookId=${bookId}`)
    const ratingData = await ratingRes.json()
    setAvgRating(ratingData || { average: 0, count: 0 })
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold">
         Average Rating: {avgRating.average.toFixed(1)}/5 ({avgRating.count} reviews)
      </h3>

      <div>
        <h4 className="font-semibold mb-2">User Reviews</h4>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map(r => (
          <div key={r.id} className="border-b pb-2 mb-2">
            <p className="font-medium">{r.user.username || "Anonymous"}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{r.content}</p>
            <p className="text-sm text-yellow-500">⭐ {r.rating}</p>
          </div>
        ))}
      </div>

      <textarea
        value={newReview}
        onChange={e => setNewReview(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border rounded-md"
      />

      <div className="flex items-center mt-2 space-x-2">
        <span>Rating:</span>
        <select
          value={newRating}
          onChange={e => setNewRating(parseInt(e.target.value))}
          className="p-1 border rounded-md"
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <button
        onClick={submitReview}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
      >
        Submit Review
      </button>
    </div>
  )
}
