import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    categories?: string[]
    description?: string
    imageLinks?: { thumbnail?: string }
  }
}

export default async function BookDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params // ✅ Await params as required by Next.js 15+
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
  const book: Book = await res.json()

  const title = book?.volumeInfo?.title || "Unknown Title"
  const author = book?.volumeInfo?.authors?.join(", ") || "Unknown Author"
  const categories = book?.volumeInfo?.categories?.slice(0, 5)?.join(", ") || "Uncategorized"
  const cover = book?.volumeInfo?.imageLinks?.thumbnail || "/placeholder.svg"

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/collections" className="hover:text-blue-500 dark:hover:text-blue-500">
            Books
          </Link>
          <span className="mx-1">/</span>
          <span className="text-slate-800 dark:text-slate-200">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Book Cover and Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div
                className="aspect-[2/3] w-full rounded-lg bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url('${cover}')` }}
              ></div>
              <div className="mt-6 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">by {author}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{categories}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            {/* Rating Overview */}
            <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Rating & Reviews</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-6xl font-bold text-blue-500">4.6</p>
                  <div className="flex items-center text-blue-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on 124 reviews</p>
                </div>
                <div className="w-full flex-1 space-y-2">
                  {[
                    { stars: 5, percentage: 50 },
                    { stars: 4, percentage: 30 },
                    { stars: 3, percentage: 10 },
                    { stars: 2, percentage: 5 },
                    { stars: 1, percentage: 5 },
                  ].map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-4 text-right">{rating.stars}</span>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 w-8 text-right">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Individual Reviews (Static) */}
            <div className="space-y-8">
              {[
                {
                  name: "Sophia Carter",
                  avatar: "/diverse-woman-profile.png",
                  time: "2 months ago",
                  rating: 5,
                  review:
                    "Absolutely captivating! The story kept me on the edge of my seat until the last page. A master of suspense.",
                  likes: 25,
                  dislikes: 2,
                },
                {
                  name: "Ethan Blake",
                  avatar: "/diverse-man-profile.png",
                  time: "3 months ago",
                  rating: 4,
                  review:
                    "A solid read with a few twists I didn't see coming. The characters were well-developed, and the plot moved at a good pace.",
                  likes: 18,
                  dislikes: 3,
                },
                {
                  name: "Olivia Reed",
                  avatar: "/woman-author-profile-picture.jpg",
                  time: "4 months ago",
                  rating: 5,
                  review:
                    "This book is a masterpiece! A thrilling ride from start to finish. I couldn't put it down.",
                  likes: 32,
                  dislikes: 1,
                },
              ].map((review, index) => (
                <article key={index} className="p-6 rounded-lg bg-slate-50 dark:bg-slate-900/50 shadow-md">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{review.time}</p>
                        </div>
                        <div className="flex items-center text-blue-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-slate-700 dark:text-slate-300">{review.review}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <button className="flex items-center gap-1.5 hover:text-blue-500">
                          <ThumbsUp className="w-4 h-4" />
                          {review.likes}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-500">
                          <ThumbsDown className="w-4 h-4" />
                          {review.dislikes}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
