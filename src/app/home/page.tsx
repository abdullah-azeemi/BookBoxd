import { Card } from "@/components/ui/card"
import { Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import ImageWithFallback from "@/components/ui/ImageWithFallback" 
interface ReviewResponse {
  reviews: Array<{
    id: string;
    content: string;
    createdAt: string;
    book: {
      externalId: string;
      title: string;
      author: string;
      coverUrl: string;
    };
    user: {
      username: string;
    };
  }>;
}


export default async function HomeFeedPage() {
  let reviews: ReviewResponse['reviews'] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/review`, {
        cache: 'no-store' 
    });

    if (res.ok) {
        const data: ReviewResponse = await res.json();
        reviews = data.reviews;
    } else {
        console.error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.error("Error fetching reviews:", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Welcome back, Abdullah</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Search for books, authors, or reviews..."
                type="text"
              />
            </div>
          </div>

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

          <section>
            <h3 className="text-2xl font-bold mb-6">Latest Reviews</h3>
            <div className="space-y-6">
              {reviews.length === 0 ? (
                  <p className="text-slate-500">No recent reviews yet. Be the first to post one!</p>
              ) : (
                reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-6"
                  >
                    <Link
                      href={`/book/${review.book.externalId}`}
                      className="flex-shrink-0 w-full md:w-1/4 h-auto object-cover rounded" 
                    >
                       <ImageWithFallback
                        alt={`${review.book.title} cover`}
                        className="w-full h-auto object-cover rounded max-h-64"
                        src={review.book.coverUrl || `/abstract-geometric-shapes.png?height=320&width=240&query`} 
                        fallbackSrc="/placeholder.svg"
                      />
                    </Link>

                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Review by <span className="font-semibold">{review.user.username}</span></p>
                      
                      <h4 className="text-xl font-bold mb-2">{review.book.title}</h4>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        &quot;{review.content}&quot;
                      </p>
                      
                      <Link href={`/book/${review.book.externalId}`} className="text-blue-500 font-semibold text-sm hover:underline">
                        Read More
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800 mt-12 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 BookBoxd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}