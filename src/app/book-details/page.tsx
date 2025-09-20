import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Search, Bell, Star, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

export default function BookDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-slate-50 dark:bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">NovelNest</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                >
                  Home
                </Link>
                <Link href="/collections" className="text-sm font-medium text-blue-500 dark:text-blue-500">
                  Explore
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                >
                  My Books
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  className="w-full max-w-xs pl-10 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Search books or authors"
                  type="search"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('/placeholder.svg?key=profile')`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-500 dark:hover:text-blue-500">
            Books
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200">The Silent Observer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div
                className="aspect-[2/3] w-full rounded-lg bg-cover bg-center shadow-lg"
                style={{
                  backgroundImage: `url('/placeholder.svg?key=book-cover')`,
                }}
              ></div>
              <div className="mt-6 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">The Silent Observer</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">by Amelia Stone</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Mystery, Thriller</p>
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
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${rating.percentage}%` }} />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 w-8 text-right">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Individual Reviews */}
            <div className="space-y-8">
              {[
                {
                  name: "Sophia Carter",
                  avatar: "/diverse-woman-profile.png",
                  time: "2 months ago",
                  rating: 5,
                  review:
                    "Absolutely captivating! The Silent Observer kept me on the edge of my seat until the very last page. Amelia Stone is a master of suspense.",
                  likes: 25,
                  dislikes: 2,
                },
                {
                  name: "Ethan Blake",
                  avatar: "/diverse-man-profile.png",
                  time: "3 months ago",
                  rating: 4,
                  review:
                    "A solid thriller with a few twists I didn't see coming. The characters were well-developed, and the plot moved at a good pace.",
                  likes: 18,
                  dislikes: 3,
                },
                {
                  name: "Olivia Reed",
                  avatar: "/woman-author-profile-picture.jpg",
                  time: "4 months ago",
                  rating: 5,
                  review:
                    "This book is a masterpiece! The Silent Observer is a thrilling ride from start to finish. I couldn't put it down.",
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
                              className={`w-5 h-5 ${i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"}`}
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
