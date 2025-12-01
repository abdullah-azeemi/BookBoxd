import Link from "next/link"
import ReviewsAndRatings from "./ReviewsAndRatings"
import BookStatusButton from "@/components/ui/BookStatusButton";
import BookCover3D from "@/components/ui/BookCover3D";
import AIBookSummary from "@/components/AIBookSummary";
import SmartReviewAnalysis from "@/components/SmartReviewAnalysis";
import AIChatbot from "@/components/AIChatbot";

import { getBookById } from "@/lib/books"
import { getAIBookDetails } from "@/lib/ai-book-details";
import { prisma } from "@/lib/prisma";

export default async function BookDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const book = await getBookById(id)

  if (!book) {
    return <div>Book not found</div>
  }

  const title = book.title || "Unknown Title"
  const author = book.authors.join(", ") || "Unknown Author"
  const categories = book.categories.slice(0, 5).join(", ") || "Uncategorized"
  const cover = book.coverUrl || "/placeholder.svg"

  const dbBook = await prisma.book.findUnique({ where: { externalId: id } });
  let reviews: string[] = [];

  if (dbBook) {
    const dbReviews = await prisma.review.findMany({
      where: { bookId: dbBook.id },
      select: { content: true },
      take: 20
    });
    reviews = dbReviews.map(r => r.content);
  }

  // Fetch AI Details
  const aiDetails = await getAIBookDetails(title, author, reviews);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/collections" className="hover:text-blue-500 dark:hover:text-blue-500">
            Books
          </Link>
          <span className="mx-1">/</span>
          <span className="text-slate-800 dark:text-slate-200">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Cover & Basic Info - Sticky */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">

              <div className="py-4">
                <BookCover3D coverUrl={cover} title={title} />
              </div>

              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 font-medium">by {author}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{categories}</p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <BookStatusButton
                  externalBookId={id}
                  title={title}
                  author={author}
                  coverUrl={cover}
                />
              </div>
            </div>
          </div>

          {/* Right Column: AI Features & Reviews */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">

            {/* AI Summary */}
            {aiDetails && <AIBookSummary summary={aiDetails.summary} />}

            {/* Smart Analysis */}
            {aiDetails && (
              <SmartReviewAnalysis
                themes={aiDetails.themes}
                sentiment={aiDetails.sentiment}
              />
            )}

            {/* Reviews Section */}
            <ReviewsAndRatings
              bookId={id}
              bookTitle={title}
              bookAuthor={author}
            />
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <AIChatbot bookTitle={title} bookAuthor={author} />
    </div>
  )
}