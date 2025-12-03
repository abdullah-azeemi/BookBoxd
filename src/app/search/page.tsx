"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { BookCard } from "@/components/ui/BookCard"

interface Book {
    id: string
    title: string
    authors: string[]
    description?: string
    publishedDate?: string
    categories?: string[]
    coverUrl: string | null
}

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const handleSearch = async () => {
        if (!query.trim()) return

        setLoading(true)
        setSearched(true)

        try {
            const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
            const data = await response.json()
            setBooks(data.books || [])
        } catch (error) {
            console.error("Search error:", error)
            setBooks([])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Search Books
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Find your next great read
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author, or genre..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-12 pr-12 py-4 text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery("")
                                setBooks([])
                                setSearched(false)
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Clear search"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={!query.trim() || loading}
                    className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-colors text-base mb-8"
                >
                    {loading ? "Searching..." : "Search"}
                </button>

                {/* Search Results */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Searching for books...</p>
                    </div>
                )}

                {!loading && searched && books.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400">
                            No books found for &quot;{query}&quot;. Try a different search term.
                        </p>
                    </div>
                )}

                {!loading && books.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Found {books.length} {books.length === 1 ? "book" : "books"}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    title={book.title}
                                    author={book.authors?.[0] || "Unknown Author"}
                                    coverUrl={book.coverUrl || "/placeholder.svg"}
                                    rating={undefined}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
