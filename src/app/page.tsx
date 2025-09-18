import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Sparkles, Search, Heart, Star, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">NovelNest</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
              Features
            </Link>
            <Link href="#community" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
              Community
            </Link>
            <Link href="#discover" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
              Discover
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-600 dark:text-slate-300">
              Sign In
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">Join Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-slate-900 dark:text-white">
            Your next great read is waiting
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 text-balance mb-8 max-w-2xl mx-auto">
            Join thousands of readers logging books, sharing reviews, and discovering personalized recommendations
            powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/home">
              <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600 px-8">
                Start Your Reading Journey
              </Button>
            </Link>
            <Link href="/book-details">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-slate-300 dark:border-slate-700 bg-transparent"
              >
                Explore Books
              </Button>
            </Link>
          </div>

          {/* Featured Books Preview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {[
              { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid" },
              { title: "Atomic Habits", author: "James Clear" },
              { title: "The Silent Patient", author: "Alex Michaelides" },
              { title: "Where the Crawdads Sing", author: "Delia Owens" },
              { title: "The Midnight Library", author: "Matt Haig" },
              { title: "Educated", author: "Tara Westover" },
            ].map((book, index) => (
              <Card
                key={index}
                className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-3 h-full flex flex-col justify-end">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                    {book.title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{book.author}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Everything you need to track your reading
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From logging your latest read to discovering your next obsession, NovelNest has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Log Your Books</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Keep track of what you're reading, want to read, and have finished. Rate and review every book to build
                your personal library.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">AI Recommendations</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Get personalized book suggestions based on your reading history, preferences, and mood. Discover hidden
                gems tailored just for you.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Join the Community</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Connect with fellow readers, share reviews, and discover what your friends are reading. Build your
                reading network.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section id="community" className="py-20 px-4 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
            Join thousands of passionate readers
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-500">50K+</div>
              <div className="text-slate-600 dark:text-slate-400">Active Readers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-emerald-500">2M+</div>
              <div className="text-slate-600 dark:text-slate-400">Books Logged</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-purple-500">500K+</div>
              <div className="text-slate-600 dark:text-slate-400">Reviews Written</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-chart-4">1M+</div>
              <div className="text-slate-600 dark:text-slate-400">Recommendations</div>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-left border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://example.com/sarah.jpg" alt="Sarah M." />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Sarah M.</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                "The AI recommendations are spot-on! I've discovered so many amazing books I never would have found
                otherwise."
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Mystery
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Thriller
                </Badge>
              </div>
            </Card>

            <Card className="p-6 text-left border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://example.com/alex.jpg" alt="Alex K." />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Alex K.</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                "Love seeing what my friends are reading and getting their honest reviews. It's like having a personal
                book club!"
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Fiction
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Literary
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Discover your next favorite book
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore trending books, browse by genre, or let our AI find the perfect match for your taste.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <Search className="h-8 w-8 text-blue-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Smart Search</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Find books by title, author, genre, or even describe what you're in the mood for.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <TrendingUp className="h-8 w-8 text-emerald-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Trending Now</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                See what's popular in the community and discover books everyone's talking about.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <Heart className="h-8 w-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Personal Taste</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get recommendations that match your unique reading preferences and history.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-100 dark:bg-slate-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Ready to start your reading journey?
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join NovelNest today and discover a world of books tailored just for you.
          </p>
          <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600 px-8">
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">NovelNest</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Your personal book community for discovering, tracking, and sharing your reading journey.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-3 text-slate-900 dark:text-white">Features</h5>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Book Logging
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    AI Recommendations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Reviews & Ratings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Reading Lists
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3 text-slate-900 dark:text-white">Community</h5>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Book Clubs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Discussion Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Author Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Reading Challenges
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3 text-slate-900 dark:text-white">Support</h5>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 NovelNest. All rights reserved. Made with ❤️ for book lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
