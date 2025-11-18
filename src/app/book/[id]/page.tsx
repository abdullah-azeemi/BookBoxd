import Link from "next/link"
import ReviewsAndRatings from "./ReviewsAndRatings"
import BookStatusButton from "@/components/ui/BookStatusButton";

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    categories?: string[]
    description?: string
    imageLinks?: { thumbnail?: string }
  }
}

export default async function BookDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
  const book: Book = await res.json()

  const title = book?.volumeInfo?.title || "Unknown Title"
  const author = book?.volumeInfo?.authors?.join(", ") || "Unknown Author"
  const categories = book?.volumeInfo?.categories?.slice(0, 5)?.join(", ") || "Uncategorized"
  const cover = book?.volumeInfo?.imageLinks?.thumbnail || "/placeholder.svg"

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div
                className="aspect-[2/3] w-full rounded-lg bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url('${cover}')` }}
              ></div>
              <div className="mt-6 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">by {author}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{categories}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="mb-6">
              <BookStatusButton
                externalBookId={id}
                title={title}
                author={author}
                coverUrl={cover}
              />
            </div>
            
            <ReviewsAndRatings bookId={id} bookTitle={title} bookAuthor={author} />
          </div>
        </div>
      </main>
    </div>
  )
}