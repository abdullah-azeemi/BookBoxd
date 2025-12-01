'use client'

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  content: string
  rating: number
  user: { username: string | null }
  createdAt?: string
}

interface ReviewsAndRatingsProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
}

export default function ReviewsAndRatings({ bookId, bookTitle, bookAuthor }: ReviewsAndRatingsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: [0, 0, 0, 0, 0] })

  useEffect(() => {
    fetch(`/api/reviews?bookId=${bookId}`)
      .then(res => res.json())
      .then(data => {
        const fetchedReviews: Review[] = data.reviews || [];
        setReviews(fetchedReviews);

        const total = fetchedReviews.length;
        if (total > 0) {
          const sum = fetchedReviews.reduce((acc, r) => acc + r.rating, 0);
          const distribution = [0, 0, 0, 0, 0];
          fetchedReviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
              distribution[5 - r.rating]++;
            }
          });
          setStats({
            average: parseFloat((sum / total).toFixed(1)),
            total,
            distribution
          });
        }
      });
  }, [bookId]);

  return (
    <section className="bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Rating & Reviews</h2>

      {/* Rating Stats */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 items-center md:items-start">
        <div className="text-center md:text-left min-w-[120px]">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-500">{stats.average || "0.0"}</div>
          <div className="flex justify-center md:justify-start my-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(stats.average) ? "fill-current" : "text-slate-300 dark:text-slate-600"}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500">Based on {stats.total} reviews</p>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = stats.distribution[idx];
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-3 font-medium text-slate-600 dark:text-slate-400">{star}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-slate-400">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? reviews.map((review) => (
          <article
            key={review.id}
            className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-700 shadow-sm">
                <AvatarImage src="/placeholder-user.jpg" alt={review.user.username || "Anonymous"} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {review.user.username ? review.user.username[0].toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {review.user.username || "Anonymous"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {review.content}
                </p>
              </div>
            </div>
          </article>
        )) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Link href={`/add-review?bookId=${encodeURIComponent(bookId)}&title=${encodeURIComponent(bookTitle)}&author=${encodeURIComponent(bookAuthor)}`}>
            <Button size="lg" className="px-8 shadow-lg shadow-blue-500/20">Write a Review</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
