import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Settings } from "lucide-react"
import Image from "next/image"
import { headers } from "next/headers"

interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  genre: string
  rating?: number
}

interface UserProfileData {
  user: { username: string; avatarUrl: string; joiningDate: string; tagLine: string }
  bookshelf: { currentlyReading: Book[]; wantToRead: Book[]; read: Book[] }
  stats: { totalBooksRead: number; favoriteGenre: string; averageRating: number; currentYearGoal: number; currentYearProgress: number; genreBreakdown: { genre: string; count: number }[] }
  reviews: { id: string; bookTitle: string; bookId: string; content: string; rating: number; createdAt: string }[]
}

async function getProfile() {
  const h = await headers()
  const host = h.get("host") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const protocol = h.get("x-forwarded-proto") || (process.env.VERCEL ? "https" : "http")
  const origin = host.startsWith("http") ? host : `${protocol}://${host}`
  const res = await fetch(`${origin}/api/profile`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function ProfilePage() {
  const data: UserProfileData | null = await getProfile()
  const bookshelf = data?.bookshelf || { currentlyReading: [], wantToRead: [], read: [] }
  const stats = data?.stats || { totalBooksRead: 0, favoriteGenre: "Unknown", averageRating: 3, currentYearGoal: 60, currentYearProgress: 0, genreBreakdown: [] }
  const user = data?.user || { username: "Anonymous", avatarUrl: "/placeholder-user.jpg", joiningDate: new Date().toISOString(), tagLine: "" }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-16 xl:px-32 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            <Avatar className="h-24 w-24 md:h-28 md:w-28">
              <AvatarImage src={user.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-slate-100">{(user.username || "A")[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{user.username}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{user.tagLine || "Avid reader and book reviewer"}</p>
              <p className="text-xs text-slate-500">Joined in {new Date(user.joiningDate).getFullYear()}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button className="bg-[#00A8FF] hover:bg-[#0090D9] text-white px-5 py-2 text-sm rounded-lg">
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-[#E8F4F9] dark:bg-slate-800 border-none">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Books Read</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalBooksRead}</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Favorite Genre</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.favoriteGenre}</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardContent className="p-5">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookshelf" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 dark:border-slate-700 p-0 mb-6 rounded-none h-auto">
              <TabsTrigger
                value="bookshelf"
                className="px-5 py-2.5 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8FF] data-[state=active]:text-[#00A8FF] data-[state=active]:bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
              >
                Bookshelf
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="px-5 py-2.5 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8FF] data-[state=active]:text-[#00A8FF] data-[state=active]:bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookshelf" className="space-y-10">

              {/* Currently Reading */}
              {bookshelf.currentlyReading.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Currently Reading</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {bookshelf.currentlyReading.map((b, index) => (
                      <div key={`${b.id}-${index}`} className="group">
                        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-[2/3] relative">
                            <Image
                              src={b.coverUrl || "/placeholder.svg"}
                              alt={b.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Card>
                        <h3 className="mt-2 font-medium text-xs text-slate-900 dark:text-white line-clamp-2">{b.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">by {b.author}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Read */}
              {bookshelf.read.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Read</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {bookshelf.read.map((b, index) => (
                      <div key={`${b.id}-${index}`} className="group">
                        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={b.coverUrl || "/placeholder.svg"}
                              alt={b.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Card>
                        <h3 className="mt-2 font-medium text-xs text-slate-900 dark:text-white line-clamp-2">{b.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">by {b.author}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Want to Read */}
              {bookshelf.wantToRead.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Want to Read</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {bookshelf.wantToRead.map((b, index) => (
                      <div key={`${b.id}-${index}`} className="group">
                        <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={b.coverUrl || "/placeholder.svg"}
                              alt={b.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Card>
                        <h3 className="mt-2 font-medium text-xs text-slate-900 dark:text-white line-clamp-2">{b.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">by {b.author}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white">My Reviews</h2>
              {(!data || !data.reviews || data.reviews.length === 0) ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 dark:text-slate-400">No reviews yet. Start reading and share your thoughts!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {data.reviews.map((r) => (
                    <Card key={r.id} className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">{r.bookTitle}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-medium">{r.rating}</span>
                              <span className="text-slate-400">/5</span>
                            </div>
                          </div>
                          <span className="text-sm text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export const dynamic = "force-dynamic"
