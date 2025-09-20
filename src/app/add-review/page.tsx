"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkBox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, BookOpen, Star } from "lucide-react"

import Link from "next/link"

export default function AddReviewPage() {
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(3)
  const [selectedTags, setSelectedTags] = useState(["Contemporary", "Self-Help"])
  const [markAsRead, setMarkAsRead] = useState(false)

  const availableTags = ["Fiction", "Contemporary", "Fantasy", "Philosophy", "Self-Help"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <BookOpen className="w-7 h-7 text-blue-500" />
              <h1 className="text-xl font-bold tracking-tight">NovelNest</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                href="/"
              >
                Home
              </Link>
              <a className="text-blue-500 font-semibold" href="/add-review">
                Explore
              </a>
              <a
                className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
                href="/collections"
              >
                My Books
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Write a Review</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Share your thoughts on "The Midnight Library" by Matt Haig.
            </p>
          </div>

          <div className="space-y-8">
            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="review">
                Your Review
              </label>
              <Textarea
                id="review"
                name="review"
                placeholder="What did you think of the book?"
                rows={8}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:ring-0 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium mb-3">Rating</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-colors ${
                      star <= rating ? "text-blue-500" : "text-slate-300 dark:text-slate-600 hover:text-blue-400"
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Mark as Read */}
            <div className="flex items-center space-x-3">
              <Checkbox id="mark-as-read" checked={markAsRead} onCheckedChange={setMarkAsRead} className="h-5 w-5" />
              <label htmlFor="mark-as-read" className="text-sm cursor-pointer">
                I have finished reading this book
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 dark:focus:ring-offset-slate-900 transition-all">
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
