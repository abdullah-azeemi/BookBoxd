"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Settings, Plus } from "lucide-react"
import { GenresChart } from "@/components/ui/GenresChart"
import { QuoteCard } from "@/components/ui/QuoteCard"
import { AddQuoteDialog } from "@/components/ui/AddQuoteDialog"
import { EditProfileDialog } from "@/components/ui/EditProfileDialog"

interface Genre {
  genre: string
  count: number
  percentage: number
}

interface Quote {
  id: string
  text: string
  bookTitle: string
  author: string
  createdAt: string
}

interface Book {
  id: string
  dbId: string
  title: string
  author: string
  coverUrl: string
}

interface UserProfileData {
  user: {
    username: string
    avatarUrl: string
    joiningDate: string
    bio: string
  }
  bookshelf: {
    currentlyReading: Book[]
    wantToRead: Book[]
    read: Book[]
  }
  stats: {
    totalBooksRead: number
    favoriteGenre: string
    averageRating: number
    genreBreakdown: Genre[]
  }
  reviews: {
    id: string
    bookTitle: string
    bookId: string
    content: string
    rating: number
    createdAt: string
  }[]
  quotes: Quote[]
}

export default function ProfilePage() {
  const [data, setData] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddQuote, setShowAddQuote] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", { cache: "no-store" })
      if (res.ok) {
        const profileData = await res.json()
        setData(profileData)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAddQuote = async (quoteData: {
    text: string
    bookId: string
    bookTitle: string
    author: string
  }) => {
    const book = data?.bookshelf.read.find(b => b.id === quoteData.bookId)
    const finalBookId = book ? book.dbId : quoteData.bookId

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...quoteData,
        bookId: finalBookId
      }),
    })

    if (!res.ok) {
      throw new Error("Failed to add quote")
    }

    // Refresh profile to show new quote
    await fetchProfile()
  }

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return

    const res = await fetch(`/api/quotes/${quoteId}`, { method: "DELETE" })

    if (!res.ok) {
      alert("Failed to delete quote")
      return
    }

    // Refresh profile
    await fetchProfile()
  }

  const handleSaveProfile = async (profileData: {
    username: string
    bio: string
    avatarUrl?: string
  }) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: profileData.username,
        bio: profileData.bio,
      }),
    })

    if (!res.ok) {
      throw new Error("Failed to update profile")
    }

    // Refresh profile
    await fetchProfile()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    )
  }

  const { user, stats, reviews, quotes, bookshelf } = data

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <main className="px-4 md:px-8 lg:px-16 xl:px-32 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-slate-100 dark:ring-slate-800">
              <AvatarImage src={user.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {user.username}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{user.bio}</p>
              <p className="text-xs text-slate-500">
                Joined in {new Date(user.joiningDate).getFullYear()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEditProfile(true)}
                className="bg-[#00A8FF] hover:bg-[#0090D9] text-white px-5 py-2 text-sm rounded-lg"
              >
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Card className="bg-[#E8F4F9] dark:bg-slate-800 border-none">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Books Read</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.totalBooksRead}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Favorite Genre</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stats.favoriteGenre}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.averageRating.toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User's Top Genres */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              User&apos;s Top Genres
            </h2>
            {stats.genreBreakdown.length > 0 ? (
              <Card className="p-6 border border-slate-200 dark:border-slate-700">
                <GenresChart genres={stats.genreBreakdown} />
              </Card>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400">
                  No genre data yet. Start adding books to your collection!
                </p>
              </Card>
            )}
          </section>

          {/* Favorite Quotes & Highlights */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Favorite Quotes & Highlights
              </h2>
              <Button
                onClick={() => setShowAddQuote(true)}
                disabled={bookshelf.read.length === 0}
                className="bg-[#00A8FF] hover:bg-[#0090D9] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </div>

            {quotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotes.map((quote) => (
                  <QuoteCard
                    key={quote.id}
                    id={quote.id}
                    text={quote.text}
                    bookTitle={quote.bookTitle}
                    author={quote.author}
                    onDelete={handleDeleteQuote}
                    deletable={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  No quotes yet. Save your favorite passages from books you&apos;ve read!
                </p>
                {bookshelf.read.length > 0 && (
                  <Button onClick={() => setShowAddQuote(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Quote
                  </Button>
                )}
              </Card>
            )}
          </section>

          {/* Reviews Tab */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 dark:border-slate-700 p-0 mb-6 rounded-none h-auto">
              <TabsTrigger
                value="reviews"
                className="px-5 py-2.5 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8FF] data-[state=active]:text-[#00A8FF] data-[state=active]:bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white">My Reviews</h2>
              {reviews.length === 0 ? (
                <Card className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No reviews yet. Start reading and share your thoughts!
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {reviews.map((r) => (
                    <Card key={r.id} className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {r.bookTitle}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-medium">{r.rating}</span>
                              <span className="text-slate-400">/5</span>
                            </div>
                          </div>
                          <span className="text-sm text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {r.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      <AddQuoteDialog
        open={showAddQuote}
        onClose={() => setShowAddQuote(false)}
        onAdd={handleAddQuote}
        readBooks={bookshelf.read}
      />

      <EditProfileDialog
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentUsername={user.username}
        currentBio={user.bio}
        currentAvatarUrl={user.avatarUrl}
        onSave={handleSaveProfile}
      />
    </div>
  )
}
