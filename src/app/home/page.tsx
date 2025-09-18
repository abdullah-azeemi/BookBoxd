import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Search, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomeFeedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-blue-500">
                <BookOpen className="h-8 w-8" />
                <h1 className="text-xl font-bold">NovelNest</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/home" className="text-sm font-medium text-slate-900 dark:text-white">
                  Home
                </Link>
                <Link
                  href="/explore"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"
                >
                  Explore
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"
                >
                  My Reviews
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full h-10 pl-10 pr-4 w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Search books..."
                  type="text"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/user-avatar-sarah.png" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Welcome back, Sarah</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Search for books, authors, or reviews..."
                type="text"
              />
            </div>
          </div>

          {/* Recommended Books */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Recommended for you</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[
                { title: "The Whispering Woods", author: "Amelia Stone", cover: "mystery forest book cover" },
                { title: "Shadows of the Past", author: "David Blackwood", cover: "dark thriller book cover" },
                { title: "Echoes of Tomorrow", author: "Clara Hayes", cover: "sci-fi book cover" },
                { title: "The Forgotten Kingdom", author: "Thomas Ashton", cover: "fantasy kingdom book cover" },
              ].map((book, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-[3/4] mb-3">
                    <img
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                      src={`/abstract-geometric-shapes.png?height=320&width=240&query=${book.cover}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm truncate">{book.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{book.author}</p>
                  </div>
                </div>
              ))}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] mb-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-center">View More</p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest Reviews */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Latest Reviews</h3>
            <div className="space-y-6">
              {[
                {
                  reviewer: "Emily Carter",
                  book: "The Secret Garden",
                  cover: "classic garden book cover",
                  review:
                    "A heartwarming tale of discovery and friendship. The author's prose is enchanting, and the characters are unforgettable. A must-read for all ages.",
                },
                {
                  reviewer: "Michael Evans",
                  book: "The Lost City",
                  cover: "adventure lost city book cover",
                  review:
                    "An epic adventure filled with twists and turns. The world-building is immersive, and the plot keeps you on the edge of your seat. Highly recommended!",
                },
                {
                  reviewer: "Olivia Bennett",
                  book: "The Silent Sea",
                  cover: "mystery ocean book cover",
                  review:
                    "A captivating mystery with a compelling protagonist. The suspense builds gradually, leading to a satisfying conclusion. A great read for mystery lovers.",
                },
              ].map((review, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-6"
                >
                  <img
                    alt={`${review.book} cover`}
                    className="w-full md:w-1/4 h-auto object-cover rounded"
                    src={`/abstract-geometric-shapes.png?height=200&width=150&query=${review.cover}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Review by {review.reviewer}</p>
                    <h4 className="text-xl font-bold mb-2">{review.book}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {review.review}
                    </p>
                    <Link href="/book-details" className="text-blue-500 font-semibold text-sm hover:underline">
                      Read More
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 mt-12 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 NovelNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
