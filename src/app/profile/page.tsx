import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen } from "lucide-react"
import Image from "next/image"

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/profile`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function ProfilePage() {
  const data: UserProfileData | null = await getProfile()
  const bookshelf = data?.bookshelf || { currentlyReading: [], wantToRead: [], read: [] }
  const stats = data?.stats || { totalBooksRead: 0, favoriteGenre: "Unknown", averageRating: 3, currentYearGoal: 60, currentYearProgress: 0, genreBreakdown: [] }
  const user = data?.user || { username: "Anonymous", avatarUrl: "/placeholder-user.png", joiningDate: new Date().toISOString(), tagLine: "" }

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="px-4 md:px-10 lg:px-20 xl:px-40 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-6 text-center mb-10">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{(user.username || "A")[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">{user.tagLine}</p>
              <p className="text-sm text-muted-foreground">Joined {new Date(user.joiningDate).getFullYear()}</p>
            </div>
            <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              Edit Profile
            </Button>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="bookshelf" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bookshelf">Bookshelf</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="bookshelf" className="space-y-8">
              {/* Bookshelf Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Bookshelf</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {bookshelf.read.concat(bookshelf.currentlyReading).concat(bookshelf.wantToRead).map((b, index) => (
                    <div key={`${b.id}-${index}`} className="aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={b.coverUrl || "/placeholder.svg"}
                        alt={b.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Reading Stats */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Reading Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Total Books Read</p>
                        <p className="text-4xl font-bold">{stats.totalBooksRead}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Favorite Genre</p>
                        <p className="text-4xl font-bold">{stats.favoriteGenre}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium text-muted-foreground">Average Rating</p>
                        <p className="text-4xl font-bold">{stats.averageRating.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              {(!data || !data.reviews || data.reviews.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Start reading and share your thoughts!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {data.reviews.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{r.bookTitle}</div>
                          <div className="text-sm">{r.rating} / 5</div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{r.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold">Detailed Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Reading Progress This Year</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Books Read</span>
                        <span>{stats.currentYearProgress} / {stats.currentYearGoal}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((stats.currentYearProgress / Math.max(1, stats.currentYearGoal)) * 100))}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Top Genres</h3>
                    <div className="space-y-3">
                      {stats.genreBreakdown.slice(0, 5).map((g: { genre: string; count: number }) => (
                        <div key={g.genre} className="flex justify-between">
                          <span className="text-sm">{g.genre}</span>
                          <span className="text-sm font-medium">{g.count} books</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
