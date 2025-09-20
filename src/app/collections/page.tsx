"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Bell, BookOpen } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const readBooks = [
    { title: "The Whispering Woods", cover: "/whispering-woods-book-cover.jpg" },
    { title: "Shadows of the Past", cover: "/shadows-past-book-cover.jpg" },
    { title: "Echoes of Tomorrow", cover: "/echoes-tomorrow-book-cover.jpg" },
    { title: "The Silent Witness", cover: "/silent-witness-book-cover.jpg" },
    { title: "Chronicles of Eldoria", cover: "/chronicles-eldoria-book-cover.jpg" },
  ]

  const currentlyReading = [
    { title: "City of Dreams", cover: "/city-dreams-book-cover.jpg" },
    { title: "Love in the Highlands", cover: "/love-highlands-book-cover.jpg" },
    { title: "The Lost Expedition", cover: "/lost-expedition-book-cover.jpg" },
  ]

  const wantToRead = [
    { title: "The Dragon's Legacy", cover: "/dragon-legacy-book-cover.jpg" },
    { title: "Secrets of the Manor", cover: "/secrets-manor-book-cover.jpg" },
    { title: "Beyond the Stars", cover: "/beyond-stars-book-cover.jpg" },
    { title: "The Vanishing Act", cover: "/vanishing-act-book-cover.jpg" },
    { title: "Tales of the Empire", cover: "/tales-empire-book-cover.jpg" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <h1 className="text-xl font-bold">NovelNest</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link className="text-sm font-medium hover:text-blue-500 transition-colors" href="/">
                  Home
                </Link>
                <Link className="text-sm font-medium hover:text-blue-500 transition-colors" href="/home">
                  Explore
                </Link>
                <Link className="text-sm font-medium text-blue-500" href="/collections">
                  My Library
                </Link>
                <Link className="text-sm font-medium hover:text-blue-500 transition-colors" href="#">
                  Community
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="w-full pl-10 pr-4 py-2 rounded-full"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Library</h1>

        {/* Read Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Read</h2>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {readBooks.map((book, index) => (
                <div key={index} className="flex-shrink-0 w-40 space-y-2">
                  <img
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    src={book.cover || "/placeholder.svg"}
                  />
                  <h3 className="font-semibold truncate text-sm">{book.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Currently Reading Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Currently Reading</h2>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {currentlyReading.map((book, index) => (
                <div key={index} className="flex-shrink-0 w-40 space-y-2">
                  <img
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    src={book.cover || "/placeholder.svg"}
                  />
                  <h3 className="font-semibold truncate text-sm">{book.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Want to Read Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Want to Read</h2>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {wantToRead.map((book, index) => (
                <div key={index} className="flex-shrink-0 w-40 space-y-2">
                  <img
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    src={book.cover || "/placeholder.svg"}
                  />
                  <h3 className="font-semibold truncate text-sm">{book.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Auto-generated Reading Lists */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Auto-generated Reading Lists</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">Top Picks for You</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Based on your reading history and preferences
                  </p>
                </div>
                <img alt="Top Picks" className="w-32 h-20 object-cover rounded-lg" src="/top-picks-books-collection.jpg" />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">New Releases in Your Favorite Genres</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Stay up-to-date with the latest books</p>
                </div>
                <img
                  alt="New Releases"
                  className="w-32 h-20 object-cover rounded-lg"
                  src="/new-releases-books-collection.jpg"
                />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">Hidden Gems</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Discover lesser-known books that match your taste
                  </p>
                </div>
                <img
                  alt="Hidden Gems"
                  className="w-32 h-20 object-cover rounded-lg"
                  src="/placeholder.svg?height=80&width=128"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
