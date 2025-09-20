import { Button } from "@/components/ui/button"
import { Search, PersonStanding, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center py-24 sm:py-32 md:py-40"
          style={{
            backgroundSize: "70%",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero_page-kk93RxLv26CEdRPhcsrCK4wCgeuWqc.png')`,
          }}
        >
          <div className="container mx-auto px-4 text-center text-white sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Discover Your Next Great Read
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
              Explore a curated collection of book reviews and recommendations tailored to your interests. Join our
              community of book lovers and dive into the world of literature.
            </p>
            <Link href="/home">
              <Button className="mt-8 rounded-full bg-blue-500 px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Joining our community is simple. Follow these easy steps to start your literary journey.
              </p>
            </div>
            <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <PersonStanding className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">1. Create an Account</h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Sign up for free and tell us about your reading preferences to personalize your experience.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">2. Discover Books</h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Explore thousands of books, read reviews from fellow readers, and find your next favorite.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">3. Share Your Thoughts</h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  Write your own reviews, rate books you've read, and contribute to our growing community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-16 sm:py-24 bg-white dark:bg-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Key Features
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                BookWise offers a range of features designed to enhance your reading experience.
              </p>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              <div className="group">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('/home-feed-book-reviews-social-media-interface.jpg')`,
                    }}
                  ></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Home Feed</h3>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    Stay up-to-date with the latest reviews and discussions from the community. Discover new books and
                    engage with fellow readers.
                  </p>
                </div>
              </div>
              <div className="group">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('/book-detail-page-reviews-ratings-interface.jpg')`,
                    }}
                  ></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Detail Page</h3>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    Get in-depth information about books, including reviews, ratings, and author details. Share your
                    thoughts and connect with other readers.
                  </p>
                </div>
              </div>
              <div className="group">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="h-48 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('/ai-recommendations-books-artificial-intelligence.jpg')`,
                    }}
                  ></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Recommendations</h3>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    Receive personalized book recommendations based on your reading history and preferences. Let our AI
                    guide you to your next favorite book.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                We're trusted by book lovers everywhere. Here's a selection of testimonials from our community.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800/50">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/diverse-woman-profile.png" alt="Sarah J." />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base italic text-slate-600 dark:text-slate-400">
                      "BookWise has completely transformed my reading habits. The recommendations are spot-on, and the
                      community is so welcoming. It's the best platform for any book enthusiast!"
                    </p>
                    <div className="mt-4 font-bold text-slate-900 dark:text-white">Sarah J.</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Avid Reader</div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800/50">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/diverse-man-profile.png" alt="Michael K." />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base italic text-slate-600 dark:text-slate-400">
                      "I've discovered so many hidden gems thanks to BookWise. The detailed reviews and the ability to
                      track my reading progress are features I can't live without now."
                    </p>
                    <div className="mt-4 font-bold text-slate-900 dark:text-white">Michael K.</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Book Club Organizer</div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800/50">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/woman-author-profile-picture.jpg" alt="Emily R." />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base italic text-slate-600 dark:text-slate-400">
                      "As an author, it's inspiring to see such a vibrant community of readers. BookWise is a fantastic
                      place to connect with people who are passionate about literature."
                    </p>
                    <div className="mt-4 font-bold text-slate-900 dark:text-white">Emily R.</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Fantasy Author</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-500/5 py-16 dark:bg-blue-500/10 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Ready to Dive In?
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Join thousands of readers and start your journey with BookWise today. Sign up is free and takes less
                than a minute.
              </p>
              <Link
                href="/home"
                className="mt-8 inline-block rounded-full bg-blue-500 px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 BookWise. All rights reserved.</p>
            <div className="flex items-center gap-x-6">
              <a
                className="text-sm text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-sm text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
