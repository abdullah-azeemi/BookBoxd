import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from "next/link"
import ImageWithFallback from "@/components/ui/ImageWithFallback" 
import Image from "next/image"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

interface Recommendation {
    title: string;
    author: string;
    coverQuery: string;
}

interface Review {
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
}

interface HomeDataResponse {
    reviews: Review[];
    recommendations: Recommendation[];
    errors?: string[]; 
}


export default async function HomeFeedPage() {
  let reviews: Review[] = [];
  let recommendations: Recommendation[] = [];
  let fetchError: string | null = null;

  try {
    const h = await headers()
    const host = h.get("host") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const protocol = h.get("x-forwarded-proto") || (process.env.VERCEL ? "https" : "http")
    const origin = host.startsWith("http") ? host : `${protocol}://${host}`
    const res = await fetch(`${origin}/api/review`, {
        cache: 'no-store' 
    });

    if (res.ok) {
        const data: HomeDataResponse = await res.json();
        
        reviews = Array.isArray(data.reviews) ? data.reviews : [];
        recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];

        if (data.errors && data.errors.length > 0) {
            console.error("Backend errors during data fetch:", data.errors.join("; "));
            fetchError = "Some data failed to load. Check the console for details.";
        }

    } else {
        console.error(`Failed to fetch home data: ${res.status} ${res.statusText}`);
        fetchError = `Failed to load home feed data: ${res.statusText}`;
    }
  } catch (e) {
    console.error("Error fetching home data:", e);
    fetchError = "Network error or connection failed.";
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
          
          {/* Display general fetch error if present */}
          {fetchError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline ml-2">{fetchError}</span>
              </div>
          )}

          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Recommended for you</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.length === 0 ? (
                  <div className="col-span-full text-center py-4 text-slate-500 italic">
                      No personalized recommendations available right now.
                  </div>
              ) : (
                  recommendations.map((book, index) => (
                    <div key={index} className="group cursor-pointer">
                      {/* Recommendations use a standard 3/4 aspect ratio */}
                      <div className="aspect-[3/4] mb-3 overflow-hidden">
                        <Image
                          alt={`${book.title} cover`}
                          className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300"
                          width={240}
                          height={320}
                          src={`/abstract-geometric-shapes.png?height=320&width=240&query=${encodeURIComponent(book.coverQuery)}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm truncate">{book.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{book.author}</p>
                      </div>
                    </div>
                  ))
              )}
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
                      className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40 overflow-hidden rounded shadow-md border border-slate-200 dark:border-slate-700" 
                    >
                       <ImageWithFallback
                        alt={`${review.book.title} cover`}
                        className="w-full h-full object-contain rounded" 
                        src={review.book.coverUrl || `/abstract-geometric-shapes.png?height=320&width=240&query`} 
                        fallbackSrc="/placeholder.svg"
                        width={128}
                        height={160}
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
