"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, BookOpen } from "lucide-react"

import Link from "next/link"

export default function AIRecommenderPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const recommendedBooks = [
    { title: "The Secret Garden", author: "Frances Hodgson Burnett", cover: "/placeholder.svg?height=300&width=200" },
    { title: "The Alchemist", author: "Paulo Coelho", cover: "/placeholder.svg?height=300&width=200" },
    { title: "Pride and Prejudice", author: "Jane Austen", cover: "/placeholder.svg?height=300&width=200" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", cover: "/placeholder.svg?height=300&width=200" },
    { title: "1984", author: "George Orwell", cover: "/placeholder.svg?height=300&width=200" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "/placeholder.svg?height=300&width=200" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", cover: "/placeholder.svg?height=300&width=200" },
    { title: "Lord of the Flies", author: "William Golding", cover: "/placeholder.svg?height=300&width=200" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", cover: "/placeholder.svg?height=300&width=200" },
    { title: "Jane Eyre", author: "Charlotte Brontë", cover: "/placeholder.svg?height=300&width=200" },
    { title: "Wuthering Heights", author: "Emily Brontë", cover: "/placeholder.svg?height=300&width=200" },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", cover: "/placeholder.svg?height=300&width=200" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-3 text-slate-900 dark:text-white" href="/">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold tracking-tight">NovelNest</h2>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                href="/"
              >
                Home
              </Link>
              <Link className="text-sm font-medium text-blue-500" href="/ai-recommender">
                Explore
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                href="/collections"
              >
                My Books
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                href="#"
              >
                Reviews
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                href="#"
              >
                Community
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-end gap-4">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <Input
                className="w-full rounded-lg border-slate-300 bg-white/70 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src="/diverse-user-avatars.png" alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Recommended For You
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              Based on your reading history, here are some books we think you'll love.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-6">
            {recommendedBooks.map((book, index) => (
              <div key={index} className="group book-card">
                <div className="w-full overflow-hidden rounded-lg">
                  <div className="aspect-[2/3] w-full bg-cover bg-center book-cover hover:scale-105 transition-transform duration-300">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{book.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
